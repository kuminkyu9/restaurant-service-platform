import { Request, Response } from 'express';
import prisma from '@/utils/prisma';

// 직원이 자신이 고용된 식당 목록 조회 (GET /staff/restaurants)
export const getStaffRestaurant = async (req: Request, res: Response) => {
  try {
    // 토큰에서 로그인한 직원 ID 추출
    const staffId = req.user?.id;
    if (!staffId) {
      return res.status(401).json({ success: false, message: '인증 정보가 없습니다.' });
    }

    // Employment 테이블을 조회 (내 staffId가 있는 것들)
    // 식당 정보(Restaurant)를 include로 가져옴
    const myEmployments = await prisma.employment.findMany({
      where: {
        staffId: staffId,
        deletedAt: null,  // 해고/퇴사 여부 확인
        restaurant: {
          deletedAt: null,  // 삭제여부 확인
        }
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            image: true,
            totalTable: true,
            owner: { // 필요하다면 사장님 이름도 조회 가능
              select: { name: true }
            }
          }
        },
        workLogs: {
          orderBy: {startTime: 'desc'},
          take: 1,
        }
      },
      orderBy: {
        createdAt: 'desc', // 최근 취직한 순서
      },
    });
    const data = myEmployments.map((emp) => {
      const lastLog = emp.workLogs[0];
      const isWorking = lastLog && lastLog.endTime === null;
      return {
        employmentId: emp.id,
        restaurantId: emp.restaurant.id,
        restaurantName: emp.restaurant.name,
        restaurantAddress: emp.restaurant.address,
        restaurantImage: emp.restaurant.image,
        ownerName: emp.restaurant.owner.name, // 사장님 이름
        hourlyWage: emp.hourlyWage,
        startWorkTime: emp.startWorkTime,
        endWorkTime: emp.endWorkTime,
        isManager: emp.isManager,
        hiredAt: emp.createdAt,
        // 현재 일하는 중인지 체크
        isWorking: isWorking
      }
    });

    return res.status(200).json({
      success: true,
      message: '내 근무지 목록 조회 성공',
      data: data,
    });
  } catch (error) {
    console.error('Get My Restaurants Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: '근무지 목록 조회 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 한국 시간(KST) 기준의 오늘 날짜(00:00:00)를 구하는 헬퍼 함수
const getKSTDate = () => {
  const now = new Date();
  // UTC 시간에 9시간을 더해 한국 시간을 구함
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  
  // 시간을 00:00:00으로 초기화 (날짜만 남김)
  kstDate.setUTCHours(0, 0, 0, 0);
  return kstDate;
};

// 출근 / 퇴근 처리 API (토글 방식 or 타입 구분 방식) (POST /staff/work-logs/:restaurantId)
export const postStaffWork = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const staffId = req.user?.id;
    const { type } = req.body; // "START" (출근) or "END" (퇴근)

    if (!staffId) return res.status(401).json({ success: false, message: '인증 정보 없음' });

    // 고용 관계 확인 (내가 이 식당 알바가 맞는지?)
    const employment = await prisma.employment.findUnique({
      where: {
        staffId_restaurantId: {
          staffId: Number(staffId),
          restaurantId: Number(restaurantId),
        },
      },
    });
    if (!employment) {
      return res.status(403).json({ success: false, message: '해당 식당의 직원이 아닙니다.' });
    }
    
    const now = new Date(); // 현재 시간 (TimeStamp용)
    const todayKST = getKSTDate(); // 한국 기준 오늘 날짜 (YYYY-MM-DD 00:00)
    // UTC 시간 문제 방지를 위해 로컬 날짜(YYYY-MM-DD) 기준으로 처리하는 게 좋지만, 
    // 여기선 심플하게 오늘 날짜(workDate) 범위로 조회한다고 가정
    if (type === 'START') { // 출근 (START)
      // 이미 퇴근 안 한 기록이 있는지 체크 (중복 출근 방지)
      const activeLog = await prisma.workLog.findFirst({
        where: {
          employmentId: employment.id,
          endTime: null, // 아직 퇴근 안 함
        },
      });
      if (activeLog) {
        return res.status(400).json({ success: false, message: '이미 근무 중입니다.' });
      }
      // 새 출근 기록 생성
      const newLog = await prisma.workLog.create({
        data: {
          employmentId: employment.id,
          workDate: todayKST,           // 근무 날짜 : 한국 시간 기준 날짜 저장
          startTime: now,               // 현재 시간 출근 : 실제 찍힌 시간 (UTC)
          hourlyWage: employment.hourlyWage, // 계약된 시급 스냅샷 저장
        },
      });
      return res.status(200).json({ success: true, message: '출근 처리되었습니다.', data: newLog });
    }else if (type === 'END') {  // 퇴근 (END)
      // 퇴근 처리가 안 된 가장 최근 기록 찾기
      const activeLog = await prisma.workLog.findFirst({
        where: {
          employmentId: employment.id,
          endTime: null,
        },
        orderBy: { startTime: 'desc' },
      });
      if (!activeLog) {
        return res.status(400).json({ success: false, message: '출근 기록이 없습니다.' });
      }
      // 퇴근 시간 업데이트
      const updatedLog = await prisma.workLog.update({
        where: { id: activeLog.id },
        data: {
          endTime: now,
        },
      });
      return res.status(200).json({ success: true, message: '퇴근 처리되었습니다.', data: updatedLog });
    }else {
      return res.status(400).json({ success: false, message: '잘못된 요청 타입입니다. (START/END)' });
    }
  } catch (error) {
    console.error('WorkLog Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러 발생' });
  }
};


// 내 근무 기록 조회 API (전체 식당) (GET /staff/work-logs)
export const getStaffWorkLogs = async (req: Request, res: Response) => {
  try {
    const staffId = req.user?.id;
    if (!staffId) return res.status(401).json({ success: false, message: '인증 정보 없음' });

    // 내 모든 고용 관계(Employment) ID들 찾기
    const myEmployments = await prisma.employment.findMany({
      where: { staffId: Number(staffId) },
      select: { id: true }
    });
    if (myEmployments.length === 0) {
      return res.status(200).json({
        success: true,
        message: '근무 기록 조회 성공',
        data: { isWorking: false, logs: [] }
      });
    }

    
    const employmentIds = myEmployments.map(e => e.id);
    // 해당 고용 ID들에 속한 모든 근무 기록 조회 (최신순)
    const logs = await prisma.workLog.findMany({
      where: {
        employmentId: { in: employmentIds } // IN 쿼리 사용
      },
      include: {
        // 어떤 식당 기록인지 알아야 하므로 식당 정보 JOIN
        employment: {
          include: {
            restaurant: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: {
        startTime: 'desc', // 전체 통틀어 최신순 정렬
      },
      take: 20, // 최근 20개
    });

    // 현재 근무 중인지 체크 (전체 식당 중 어디라도 퇴근 안 한 게 있으면 true)
    // (보통 몸은 하나니까 1곳에서만 일하겠지만, 실수로 퇴근 안 찍은 경우 포함)
    const activeLog = logs.find(log => log.endTime === null);
    const isWorking = !!activeLog;
    // 데이터 가공: 프론트에서 쓰기 편하게
    const formattedLogs = logs.map(log => ({
      id: log.id,
      restaurantName: log.employment.restaurant.name, // 식당 이름 추가
      workDate: log.workDate,
      startTime: log.startTime,
      endTime: log.endTime,
      hourlyWage: log.hourlyWage,
      note: log.note
    }));

    return res.status(200).json({
      success: true,
      message: '전체 근무 기록 조회 성공',
      data: {
        isWorking, // 퇴근 안찍혀져 있을 경우
        currentWorkingRestaurantId: activeLog?.employment.restaurant.id || null, // 현재 일하고 있는 식당 ID도 주면 좋음
        logs: formattedLogs,
      },
    });
  } catch (error) {
    console.error('Get WorkLogs Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러 발생' });
  }
};


// 특정 식당의 주문 목록 조회 (GET /staff/restaurants/:restaurantId/orders) /staff/restaurants/1/orders?status=active || /staff/restaurants/1/orders?status=finished
export const getRestaurantOrders = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const staffId = req.user?.id;
    // ?status=active (진행중) / ?status=finished (완료/취소)
    const { status } = req.query;
    if (!staffId) return res.status(401).json({ success: false, message: '인증 정보 없음' });

    // 고용 관계 확인 (보안)
    const employment = await prisma.employment.findUnique({
      where: {
        staffId_restaurantId: {
          staffId: Number(staffId),
          restaurantId: Number(restaurantId),
        },
      },
    });
    if (!employment) {
      return res.status(403).json({ success: false, message: '해당 식당의 접근 권한이 없습니다.' });
    }

    // 필터 조건 설정
    let statusFilter = {};
    if (status === 'active') {
      // 진행 중: 대기, 조리중, 서빙중
      statusFilter = { status: { in: ['PENDING', 'COOKING', 'SERVED'] } };
    } else if (status === 'finished') {
      // 완료됨: 완료, 취소
      statusFilter = { status: { in: ['COMPLETED', 'CANCELED'] } };
    }

    // 주문 조회
    const orders = await prisma.order.findMany({
      where: {
        restaurantId: Number(restaurantId),
        ...statusFilter,
      },
      // 정렬: 최신순 (또는 상태별 정렬도 가능)
      orderBy: { createdAt: 'desc' },
      // 포함할 연관 데이터
      include: {
        orderItems: {
          include: {
            menu: {
              select: { name: true } // 메뉴 이름만 필요
            }
          }
        }
      },
      take: 50, // 너무 많으면 성능 이슈 생기니 최근 50개 제한
    });

    // 프론트엔드용 데이터 포맷팅 (Flattening)
    const formattedOrders = orders.map(order => ({
      id: order.id,
      // id: order.id.toString(), // ID는 문자열로 변환 (FlatList key용)
      tableNumber: order.tableNumber,
      orderTime: new Date(order.createdAt).toLocaleString('ko-KR', {
        month: 'long',   // "12월" (숫자만 원하면 '2-digit')
        day: 'numeric',  // "29일"
        hour: '2-digit',
        minute: '2-digit',
        hour12: true     // 오전/오후 표시를 위해 true로 설정
      }), 
      // orderTime: new Date(order.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }), // "12:30" 형식
      status: order.status,
      totalPrice: order.totalPrice,
      items: order.orderItems.map(item => ({
        name: item.menu.name,
        quantity: item.quantity,
      })),
    }));

    return res.status(200).json({
      success: true,
      message: '주문 목록 조회 성공',
      data: formattedOrders,
    });
  } catch (error) {
    console.error('Get Orders Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러 발생' });
  }
};


// 주문 상태 변경 (PATCH /staff/restaurants/:restaurantId/orders/:orderId/status)
export const patchOrderStatus = async (req: Request, res: Response) => {
  try {
    const { restaurantId, orderId } = req.params;
    const { status } = req.body; // 변경할 상태 (PENDING, COOKING, SERVED, COMPLETED, CANCELED)
    const staffId = req.user?.id;
    if (!staffId) return res.status(401).json({ success: false, message: '인증 정보 없음' });

    // 고용 관계 확인 (보안: 남의 식당 주문 건드리면 안됨)
    const employment = await prisma.employment.findUnique({
      where: {
        staffId_restaurantId: {
          staffId: Number(staffId),
          restaurantId: Number(restaurantId),
        },
      },
    });
    if (!employment) {
      return res.status(403).json({ success: false, message: '해당 식당의 접근 권한이 없습니다.' });
    }

    // 주문 존재 여부 및 식당 일치 확인
    const targetOrder = await prisma.order.findUnique({
      where: { id: Number(orderId) },
    });
    if (!targetOrder) {
      return res.status(404).json({ success: false, message: '주문을 찾을 수 없습니다.' });
    }
    if (targetOrder.restaurantId !== Number(restaurantId)) {
      return res.status(400).json({ success: false, message: '해당 주문은 이 식당의 주문이 아닙니다.' });
    }

    // 상태 업데이트 실행
    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: status }, // Prisma가 Enum 타입 체크를 자동으로 해줌
    });
    return res.status(200).json({
      success: true,
      message: '주문 상태가 변경되었습니다.',
      data: {
        orderId: updatedOrder.id,
        status: updatedOrder.status,
      },
    });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    // Prisma Enum 에러 처리 (잘못된 문자열이 들어왔을 때)
    // if (error.code === 'P2002' || error.message?.includes('valid value')) {
    //     return res.status(400).json({ success: false, message: '유효하지 않은 주문 상태입니다.' });
    // }
    return res.status(500).json({ success: false, message: '서버 에러 발생' });
  }
};