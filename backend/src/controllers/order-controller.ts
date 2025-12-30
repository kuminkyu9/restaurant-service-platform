import { Request, Response } from 'express';
import prisma from '@/utils/prisma';

// 손님 주문 접수 (POST /orders) socket.io 적용 실시간
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { restaurantId, tableNumber, items } = req.body;
    if (!restaurantId || !tableNumber || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: '주문 정보가 올바르지 않습니다.' });
    }

    // 가격 검증 및 총액 계산 로직
    const menuIds = items.map((item: any) => item.menuId);
    const dbMenus = await prisma.menu.findMany({
      where: {
        id: { in: menuIds },
        category: { restaurantId: Number(restaurantId) } // 해당 식당 메뉴인지 확인
      }
    });
    if (dbMenus.length !== menuIds.length) {
      return res.status(400).json({ success: false, message: '존재하지 않는 메뉴가 포함되어 있습니다.' });
    }

    // 주문 내역 데이터 준비 및 총액 계산
    let totalPrice = 0;
    const orderItemsData = items.map((item: any) => {
      const menu = dbMenus.find(m => m.id === item.menuId);
      if (!menu) throw new Error('Menu not found'); 

      const itemTotalPrice = menu.price * item.quantity;
      totalPrice += itemTotalPrice;

      return {
        menuId: menu.id,
        quantity: item.quantity,
        price: menu.price // 가격 박제 (스냅샷)
      };
    });

    // 트랜잭션으로 주문 생성
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          restaurantId: Number(restaurantId),
          tableNumber: Number(tableNumber),
          totalPrice: totalPrice,
          status: 'PENDING', // 접수 대기
          orderItems: {
            create: orderItemsData
          }
        },
        include: {
          orderItems: {
            include: { menu: true } // 메뉴 이름 포함
          }
        }
      });
      return order;
    });

    // [추가] Socket.IO로 해당 식당 방에만 알림 전송
    // index.ts에서 set한 'io' 객체를 가져옴
    const io = req.app.get('io');
    if(io) {
      // 'restaurant_{id}' 방에 있는 사람(직원)에게만 'newOrder' 이벤트 발송
      io.to(`restaurant_${restaurantId}`).emit('newOrder', {
        orderId: newOrder.id,
        tableNumber: newOrder.tableNumber,
        totalPrice: newOrder.totalPrice,
        items: newOrder.orderItems.map(item => ({
          name: item.menu.name,
          quantity: item.quantity
        })),
        createdAt: newOrder.createdAt
      });
      console.log(`Socket emitted to restaurant_${restaurantId} for Order #${newOrder.id}`);
    } else {
      console.warn('Socket.io instance not found on req.app');
    }
    return res.status(201).json({
      success: true,
      message: '주문이 성공적으로 접수되었습니다.',
      data: newOrder
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    return res.status(500).json({ success: false, message: '주문 처리 중 오류 발생' });
  }
};

// 주문 목록 조회 (GET /orders?restaurantId=10&tableNumber=3&status=pending) - 주방/홀 스태프용 (인증 X 또는 간소화)
// 실제 서비스라면 스태프 로그인이 필요하지만, 지금은 테스트 편의상 restaurantId 쿼리로 조회하게끔
// (비회원)손님이 주문한 목록 확인하기 위한 api(그래서 #$이거 표시된 조건 추가함) !! 위에꺼 일부 취소
export const getOrders = async (req: Request, res: Response) => {
// router.get('/', async (req: Request, res: Response) => {
  try {
    const { restaurantId, tableNumber, status } = req.query;

    if (!restaurantId) {
      return res.status(400).json({ success: false, message: '식당 ID가 필요합니다.' });
    }

    // 조건부 필터링 (status가 있으면 status로 필터, 없으면 전체)
    const whereCondition: any = {
      restaurantId: Number(restaurantId),
    };

    if(tableNumber) { // 테이블 번호 조건 추가 #$,  이거 있음 손님용에서 쓰는거
      whereCondition.tableNumber = Number(tableNumber);  
    }
    if (status) {
      whereCondition.status = String(status);
    } else {
      // status가 없으면 보통 '완료(COMPLETED)'된 건 안 보고 싶어 함 (주방 화면이니까)
      // whereCondition.status = { not: 'COMPLETED' }; // 필요하면 주석 해제
    }

    const orders = await prisma.order.findMany({
      where: whereCondition,
      include: {
        orderItems: {
          include: { menu: true }
        }
      },
      orderBy: { createdAt: 'desc' } // 최신 주문이 위로
    });

    return res.status(200).json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Get Orders Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러' });
  }
};
// });


// 이거 orderId 여서 스태프쪽에서는 orderId 알수가 없어서 생각해보니깐 이거 못쓸듯 staff에 새로 만들거임
// 주문 상태 변경 (PATCH /orders/:orderId/status) - "조리중", "서빙완료" 등
export const patchOrder = async (req: Request, res: Response) => {
// router.patch('/:orderId/status', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // 유효한 상태 값인지 확인 (타입 안전성)
    const validStatuses = ['PENDING', 'COOKING', 'SERVED', 'COMPLETED', 'CANCELED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: '올바르지 않은 주문 상태입니다.' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status }
    });

    return res.status(200).json({
      success: true,
      message: `주문 상태가 ${status}(으)로 변경되었습니다.`,
      data: updatedOrder
    });

  } catch (error) {
    console.error('Update Order Status Error:', error);
    return res.status(500).json({ success: false, message: '상태 변경 실패' });
  }
};
// });