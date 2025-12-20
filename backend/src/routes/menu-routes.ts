import { Router, Request, Response } from 'express';
import prisma from '@/utils/prisma';
import { authenticateToken } from '../middlewares/authenticate-token';

// mergeParams: true 필수 (부모 URL의 :restaurantId, :categoryId 가져오기 위해)
const router = Router({ mergeParams: true });

// 메뉴 목록 조회 (GET /restaurants/:restaurantId/categories/:categoryId/menus)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    const menus = await prisma.menu.findMany({
      where: { categoryId: Number(categoryId) },
      orderBy: { createdAt: 'desc' }, // 최신순 정렬
    });

    return res.status(200).json({
      success: true,
      data: menus
    });
  } catch (error) {
    console.error('Get menus Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러' });
  }
});

// 메뉴 추가 (POST /restaurants/:restaurantId/categories/:categoryId/menus)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    // 1. URL 파라미터 가져오기 (app.ts에서 정의한 이름과 일치 필요)
    const { restaurantId, categoryId } = req.params;
    const { name, price, description, image } = req.body;
    const ownerId = req.user?.id;

    // 2. 필수 값 체크
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: '메뉴 이름과 가격은 필수입니다.' });
    }

    // 3. 권한 체크 (내 식당의 카테고리가 맞는지 확인)
    // 식당 주인 확인 + 해당 카테고리가 그 식당 소속인지까지 체크
    const category = await prisma.category.findFirst({
      where: {
        id: Number(categoryId),
        restaurantId: Number(restaurantId),
        restaurant: { ownerId: ownerId } // 관계 쿼리로 한 번에 주인 확인
      }
    });

    if (!category) {
      return res.status(403).json({ success: false, message: '메뉴 추가 권한이 없거나 카테고리가 존재하지 않습니다.' });
    }

    // 4. 메뉴 생성
    const newMenu = await prisma.menu.create({
      data: {
        name,
        price: Number(price),
        description: description || '',
        image: image,
        categoryId: Number(categoryId),
      },
    });

    return res.status(201).json({
      success: true,
      message: '메뉴가 추가되었습니다.',
      data: newMenu,
    });

  } catch (error) {
    console.error('Create Menu Error:', error);
    return res.status(500).json({ success: false, message: '메뉴 추가 실패' });
  }
});

// 메뉴 수정 (PATCH /restaurants/:restaurantId/categories/:categoryId/menus/:menuId)
router.patch('/:menuId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { restaurantId, categoryId, menuId } = req.params;
    const { name, price, description } = req.body;
    const ownerId = req.user?.id;

    // 1. 권한 체크 (내 식당 -> 내 카테고리 -> 내 메뉴 인지 확인)
    // 단순히 menuId만으로 수정하면, 남의 식당 메뉴를 수정할 수도 있으므로 철저히 검증
    const menu = await prisma.menu.findFirst({
      where: {
        id: Number(menuId),
        categoryId: Number(categoryId),
        category: {
          restaurantId: Number(restaurantId),
          restaurant: { ownerId: ownerId }
        }
      }
    });

    if (!menu) {
      return res.status(403).json({ success: false, message: '수정 권한이 없거나 메뉴를 찾을 수 없습니다.' });
    }

    // 2. 메뉴 수정
    const updatedMenu = await prisma.menu.update({
      where: { id: Number(menuId) },
      data: {
        name,
        price: price !== undefined ? Number(price) : undefined,
        description,
      },
    });

    return res.status(200).json({
      success: true,
      message: '메뉴가 수정되었습니다.',
      data: updatedMenu,
    });

  } catch (error) {
    console.error('Update Menu Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러' });
  }
});

// 메뉴 삭제 (DELETE /restaurants/:restaurantId/categories/:categoryId/menus/:menuId)
router.delete('/:menuId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { restaurantId, categoryId, menuId } = req.params;
    const ownerId = req.user?.id;

    // 1. 권한 체크 (삭제 대상 메뉴 찾기 + 주인 확인)
    const menu = await prisma.menu.findFirst({
      where: {
        id: Number(menuId),
        categoryId: Number(categoryId),
        category: {
          restaurantId: Number(restaurantId),
          restaurant: { ownerId: ownerId }
        }
      }
    });

    if (!menu) {
      return res.status(403).json({ success: false, message: '삭제 권한이 없거나 메뉴를 찾을 수 없습니다.' });
    }

    // 2. 메뉴 삭제
    await prisma.menu.delete({
      where: { id: Number(menuId) },
    });

    return res.status(200).json({
      success: true,
      message: '메뉴가 삭제되었습니다.',
    });

  } catch (error) {
    console.error('Delete Menu Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러' });
  }
});

export default router;
