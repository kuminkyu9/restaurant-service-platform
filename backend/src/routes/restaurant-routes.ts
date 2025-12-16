import { Router, Request, Response } from 'express';
import prisma from '@/utils/prisma';
import { authenticateToken } from '../middlewares/authenticate-token';

const router = Router();

// 식당 추가 (POST /restaurants)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    // 1. 요청 바디에서 식당 정보 가져오기
    // totalTable: 테이블 개수 (기본값 설정 가능하지만 여기선 필수로 받음)
    const { name, address, image, totalTable } = req.body;

    // 2. 필수 값 체크
    if (!name || !address || !totalTable) {
      return res.status(400).json({ 
        success: false, 
        message: '식당 이름, 주소, 테이블 개수는 필수입니다.' 
      });
    }

    // 3. 토큰에서 사장님 ID 추출 (미들웨어가 심어준 값)
    const ownerId = req.user?.id;

    if (!ownerId) {
      return res.status(401).json({ success: false, message: '사용자 정보를 찾을 수 없습니다.' });
    }

    // 4. DB에 식당 생성
    const newRestaurant = await prisma.restaurant.create({
      data: {
        name,
        address,
        image: image || null, // 이미지는 선택 사항
        totalTable: Number(totalTable), // 혹시 문자열로 올 수 있으니 숫자 변환
        ownerId: ownerId, // 로그인한 사장님 ID로 연결
      },
    });

    // 5. 성공 응답
    return res.status(201).json({
      success: true,
      message: '식당이 성공적으로 등록되었습니다.',
      data: newRestaurant,
    });

  } catch (error) {
    console.error('Create Restaurant Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: '식당 등록 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 내 식당 목록 조회 (GET /restaurants/my)
// 사장님이 로그인하면 "내 식당들"을 보여줘야 하니까 바로 필요
router.get('/my', authenticateToken, async (req: Request, res: Response) => {
  try {
    const ownerId = req.user?.id;

    const myRestaurants = await prisma.restaurant.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' } // 최신순 정렬
    });

    return res.status(200).json({
      success: true,
      message: '내 식당 목록 조회 성공',
      data: myRestaurants,
    });

  } catch (error) {
    console.error('Get My Restaurants Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러' });
  }
});

export default router;
