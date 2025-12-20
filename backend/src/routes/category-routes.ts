import { Router, Request, Response } from 'express';
import prisma from '@/utils/prisma';
import { authenticateToken } from '../middlewares/authenticate-token';

// mergeParams: true 옵션
// 부모 라우터(app.ts)에서 '/restaurants/:restaurantId/categories'로 연결할 때
// URL 파라미터(:restaurantId)를 자식 라우터(여기)까지 전달받기 위함
const router = Router({ mergeParams: true });

// 카테고리 목록 조회 (GET /restaurants/:restaurantId/categories)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    const categories = await prisma.category.findMany({
      where: { restaurantId: Number(restaurantId) },
      include: {   // 카테고리 불러올 때 메뉴도 같이 보여줌 
        menus: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }, // 최신순 정렬
    });

    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get Categories Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러' });
  }
});

// 카테고리 추가 (POST /restaurants/:restaurantId/categories)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params; // URL에서 식당 ID 가져옴
    const { name } = req.body;
    const ownerId = req.user?.id;

    if (!name) {
      return res.status(400).json({ success: false, message: '카테고리 이름은 필수입니다.' });
    }

    // 1. 권한 체크: "이 식당이 정말 로그인한 사장님 거냐?"
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: Number(restaurantId), ownerId },
    });

    if (!restaurant) {
      return res.status(403).json({ success: false, message: '본인의 식당에만 카테고리를 추가할 수 있습니다.' });
    }

    // 2. 카테고리 생성
    const newCategory = await prisma.category.create({
      data: {
        name,
        restaurantId: Number(restaurantId),
      },
    });

    return res.status(201).json({
      success: true,
      message: '카테고리가 추가되었습니다.',
      data: newCategory,
    });

  } catch (error) {
    console.error('Create Category Error:', error);
    return res.status(500).json({ success: false, message: '카테고리 추가 실패' });
  }
});

// 카테고리 수정 (PATCH /restaurants/:restaurantId/categories/:categoryId)
router.patch('/:categoryId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { restaurantId, categoryId } = req.params;
    const { name } = req.body;
    const ownerId = req.user?.id;

    // 1. 권한 체크 (식당 주인 확인)
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: Number(restaurantId), ownerId },
    });

    if (!restaurant) {
      return res.status(403).json({ success: false, message: '수정 권한이 없습니다.' });
    }

    // 2. 카테고리 수정
    // where 조건에 restaurantId도 같이 넣어서 더 안전하게 처리
    const updatedCategory = await prisma.category.updateMany({
      where: { 
        id: Number(categoryId),
        restaurantId: Number(restaurantId) // 다른 식당의 카테고리 ID를 넣는 실수 방지
      },
      data: { name }
    });

    if (updatedCategory.count === 0) {
      return res.status(404).json({ success: false, message: '카테고리를 찾을 수 없습니다.' });
    }

    return res.status(200).json({
      success: true,
      message: '카테고리가 수정되었습니다.',
    });

  } catch (error) {
    console.error('Update Category Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러' });
  }
});

// 카테고리 삭제 (DELETE /restaurants/:restaurantId/categories/:categoryId)
router.delete('/:categoryId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { restaurantId, categoryId } = req.params;
    const ownerId = req.user?.id;

    // 1. 권한 체크
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: Number(restaurantId), ownerId },
    });

    if (!restaurant) {
      return res.status(403).json({ success: false, message: '삭제 권한이 없습니다.' });
    }

    // 2. 삭제 실행
    // Prisma 스키마에서 onDelete: Cascade 설정했으면 메뉴들도 자동 삭제
    const deleteResult = await prisma.category.deleteMany({
      where: { 
        id: Number(categoryId),
        restaurantId: Number(restaurantId)
      },
    });

    if (deleteResult.count === 0) {
      return res.status(404).json({ success: false, message: '카테고리를 찾을 수 없습니다.' });
    }

    return res.status(200).json({
      success: true,
      message: '카테고리가 삭제되었습니다.',
    });

  } catch (error) {
    console.error('Delete Category Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러' });
  }
});

export default router;
