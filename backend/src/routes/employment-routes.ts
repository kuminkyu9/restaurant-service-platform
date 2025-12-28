import { Router, Request, Response } from 'express';
import prisma from '@/utils/prisma';
import { authenticateToken } from '../middlewares/authenticate-token';

// 부모 라우터에서 restaurantId를 받아오기 위해 mergeParams 필수
const router = Router({ mergeParams: true });

// 스태프 고용하기 (POST /employment/:restaurantId)
router.post('/:restaurantId', authenticateToken, async (req: Request, res: Response) => {
  try {
    // 1. 파라미터 및 바디 데이터 수신
    const { restaurantId } = req.params;
    const ownerId = req.user?.id;
    
    // UI 모달에 있는 입력값들
    const { email, hourlyWage, startWorkTime, endWorkTime, isManager } = req.body;

    // 2. 필수 값 검증
    if (!email || !hourlyWage || !startWorkTime || !endWorkTime) {
      return res.status(400).json({ 
        success: false, 
        message: '스태프 이메일, 시급, 근무 시간은 필수입니다.' 
      });
    }

    // 3. 권한 체크: 요청자가 이 식당의 주인(Owner)이 맞는지 확인
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: Number(restaurantId),
        ownerId: ownerId,
      },
    });

    if (!restaurant) {
      return res.status(403).json({ 
        success: false, 
        message: '식당 주인만 스태프를 고용할 수 있습니다.' 
      });
    }

    // 4. 스태프 계정 찾기 (이메일로 조회)
    // 스태프가 먼저 'Staff' 앱이나 웹을 통해 회원가입이 되어 있어야 고용 가능
    const staff = await prisma.staff.findUnique({
      where: { email: email },
    });

    if (!staff) {
      return res.status(404).json({ 
        success: false, 
        message: '해당 이메일을 가진 스태프 계정을 찾을 수 없습니다. 먼저 회원가입을 요청해주세요.' 
      });
    }

    // 5. 중복 고용 체크
    // 이미 이 식당에 고용된 스태프인지 확인 (Prisma 모델의 @@unique([staffId, restaurantId]) 제약 관련)
    const existingEmployment = await prisma.employment.findUnique({
      where: {
        staffId_restaurantId: {
          staffId: staff.id,
          restaurantId: Number(restaurantId),
        },
      },
    });

    if (existingEmployment) {
      return res.status(409).json({ 
        success: false, 
        message: '이미 이 식당에 등록된 스태프입니다.' 
      });
    }

    // 6. 고용(Employment) 레코드 생성
    const newEmployment = await prisma.employment.create({
      data: {
        restaurantId: Number(restaurantId),
        staffId: staff.id,
        hourlyWage: Number(hourlyWage),
        startWorkTime,
        endWorkTime,
        isManager: !!isManager, // boolean 강제 형변환 (undefined 방지)
      },
      include: {
        staff: {
          select: { name: true, email: true } // 응답에 스태프 이름 포함 (UI 갱신용)
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: '스태프가 성공적으로 등록되었습니다.',
      data: newEmployment,
    });

  } catch (error) {
    console.error('Create Employment Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: '스태프 등록 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});


// 스태프 정보 수정하기 (PATCH /employment/:restaurantId/:employmentId)
router.patch('/:restaurantId/:employmentId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { restaurantId, employmentId } = req.params;
    const ownerId = req.user?.id;
    
    const { hourlyWage, startWorkTime, endWorkTime, isManager } = req.body;

    // 권한 검증: "요청된 식당(restaurantId)이 내 식당(ownerId)이고, 그 식당의 고용정보(employmentId)가 맞는가?"
    const employment = await prisma.employment.findFirst({
      where: {
        id: Number(employmentId),
        restaurantId: Number(restaurantId), // URL의 식당 ID와 일치하는지 이중 체크
        restaurant: {
          ownerId: ownerId, // 토큰 주인(사장님)의 식당인지 체크
        },
      },
    });

    if (!employment) {
      return res.status(404).json({ 
        success: false, 
        message: '해당 스태프를 찾을 수 없거나 수정 권한이 없습니다.' 
      });
    }

    const updatedEmployment = await prisma.employment.update({
      where: { id: Number(employmentId) },
      data: {
        hourlyWage: hourlyWage !== undefined ? Number(hourlyWage) : undefined,
        startWorkTime: startWorkTime !== undefined ? startWorkTime : undefined,
        endWorkTime: endWorkTime !== undefined ? endWorkTime : undefined,
        isManager: isManager !== undefined ? isManager : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: '스태프 정보가 수정되었습니다.',
      data: updatedEmployment,
    });

  } catch (error) {
    console.error('Update Employment Error:', error);
    return res.status(500).json({ success: false, message: '수정 실패' });
  }
});

// 스태프 목록 조회 (GET /employment/:restaurantId)
router.get('/:restaurantId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const ownerId = req.user?.id;
    // 1. 권한 체크 (내 식당인지) 식당 자체가 존재하는지, 그리고 내 소유인지 먼저 확인
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: Number(restaurantId),
        ownerId: ownerId,
      },
    });
    if (!restaurant) {
      return res.status(403).json({ 
        success: false, 
        message: '조회 권한이 없거나 존재하지 않는 식당입니다.' 
      });
    }
    // 2. 고용 목록 조회 (스태프 정보 포함)
    const employments = await prisma.employment.findMany({
      where: {
        restaurantId: Number(restaurantId),
      },
      // Staff 테이블을 조인해서 이름과 이메일을 가져옴
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            // phone: true, (만약 있다면)
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // 최신 고용 순으로 정렬
      },
    });
    return res.status(200).json({
      success: true,
      message: '스태프 목록 조회 성공',
      data: employments,
    });
  } catch (error) {
    console.error('Get Employments Error:', error);
    return res.status(500).json({ success: false, message: '목록 조회 실패' });
  }
});

// 스태프 고용 정보 삭제 해고 (DELETE /employment/:employmentId)
router.delete('/:employmentId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const employmentId = Number(req.params.employmentId);
    const ownerId = req.user?.id;
    const existingEmployment = await prisma.employment.findFirst({
      where: { id: employmentId, restaurant: {ownerId: ownerId} },
    });
    if (!existingEmployment) {
      return res.status(404).json({ success: false, message: '고용정보를 찾을 수 없거나 삭제 권한이 없습니다.' });
    }
    await prisma.employment.delete({
      where: { id: employmentId },
    });
    return res.status(200).json({
      success: true,
      message: '스태프 고용정보가 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Delete Employments Error:', error);
    return res.status(500).json({ success: false, message: '스태프 고용정보 삭제 중 오류 발생' });
  }
});

export default router;
