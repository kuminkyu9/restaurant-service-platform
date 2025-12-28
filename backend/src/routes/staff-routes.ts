import { Router, Request, Response } from 'express';
import prisma from '@/utils/prisma';
import { authenticateToken } from '../middlewares/authenticate-token';

// 부모 라우터에서 restaurantId를 받아오기 위해 mergeParams 필수
const router = Router({ mergeParams: true });

// 직원이 자신이 고용된 식당 목록 조회 (GET /staff/restaurants)
router.get('/restaurants', authenticateToken, async (req: Request, res: Response) => {
  try {
    // 1. 토큰에서 로그인한 직원 ID 추출
    const staffId = req.user?.id;

    if (!staffId) {
      return res.status(401).json({ success: false, message: '인증 정보가 없습니다.' });
    }

    // 2. Employment 테이블을 조회 (내 staffId가 있는 것들)
    // 식당 정보(Restaurant)를 include로 가져옴
    const myEmployments = await prisma.employment.findMany({
      where: {
        staffId: staffId,
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
        }
      },
      orderBy: {
        createdAt: 'desc', // 최근 취직한 순서
      },
    });

    // 3. 응답 데이터 가공 (프론트에서 쓰기 편하게 Flattening 추천)
    // employment 정보(시급, 근무시간 등)와 restaurant 정보를 합쳐서 보내줌
    const data = myEmployments.map((emp) => ({
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
    }));

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
});


export default router;