import { Request, Response } from 'express';
import prisma from '@/utils/prisma';
import { deleteS3Images } from '@/utils/s3-client';

// 카테고리 목록 조회 (GET /restaurants/:restaurantId/categories)
// 카테고리 목록 조회: 손님용 (GET /restaurants/:restaurantId/categories?tableNumber=5)
export const getCategoryMenus = async (req: Request, res: Response) => {
// router.get('/', async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { tableNumber } = req.query;

    if(tableNumber) {
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: Number(restaurantId) },
        select: { totalTable: true } // totalTable 필드만 선택해서 최적화
      });
      if (!restaurant) {
        return res.status(404).json({ success: false, message: '식당을 찾을 수 없습니다.' });
      }

      const requestedTable = Number(tableNumber);
      if (requestedTable < 1 || requestedTable > restaurant.totalTable) {
        return res.status(400).json({ 
          success: false, 
          message: `유효하지 않은 테이블 번호입니다. (1~${restaurant.totalTable} 사이여야 함)` 
        });
      }
    }

    const categories = await prisma.category.findMany({
      where: { restaurantId: Number(restaurantId) },
      include: tableNumber ? {   // 카테고리 불러올 때 메뉴도 같이 보여줌 
        menus: {
          orderBy: { createdAt: 'desc' }
        }
      } : null,
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
};
// });

// 카테고리 추가 (POST /restaurants/:restaurantId/categories)
export const postCategory = async (req: Request, res: Response) => {
// router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params; // URL에서 식당 ID 가져옴
    const { name } = req.body;
    const ownerId = req.user?.id;

    if (!name) {
      return res.status(400).json({ success: false, message: '카테고리 이름은 필수입니다.' });
    }

    // 권한 체크: 해당식당이 로그인한 사장님껀지
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: Number(restaurantId), ownerId },
    });

    if (!restaurant) {
      return res.status(403).json({ success: false, message: '본인의 식당에만 카테고리를 추가할 수 있습니다.' });
    }

    // 카테고리 생성
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
};
// });

// 카테고리 수정 (PATCH /restaurants/:restaurantId/categories/:categoryId)
export const patchCategory = async (req: Request, res: Response) => {
// router.patch('/:categoryId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { restaurantId, categoryId } = req.params;
    const { name } = req.body;
    const ownerId = req.user?.id;

    // 권한 체크 (식당 주인 확인)
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: Number(restaurantId), ownerId },
    });

    if (!restaurant) {
      return res.status(403).json({ success: false, message: '수정 권한이 없습니다.' });
    }

    // 카테고리 수정
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
};
// });

// 카테고리 삭제 (DELETE /restaurants/:restaurantId/categories/:categoryId)
export const delCategory = async (req: Request, res: Response) => {
// router.delete('/:categoryId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { restaurantId, categoryId } = req.params;
    const ownerId = req.user?.id;

    // 권한 체크
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: Number(restaurantId), ownerId },
    });
    if (!restaurant) {
      return res.status(403).json({ success: false, message: '삭제 권한이 없습니다.' });
    }

    // 삭제될 메뉴들의 이미지 URL 미리 조회
    // 카테고리가 삭제되면 같이 날아갈 메뉴들 리스트업
    const menusToDelete = await prisma.menu.findMany({
      where: { categoryId: Number(categoryId) },
      select: { image: true } // 이미지 URL만 가져옴 (가볍게)
    });

    // 삭제 실행
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

    // DB 삭제 성공 시, S3 이미지들도 일괄 삭제 (Fire-and-Forget)
    // image 필드가 null이 아닌 것만 모아서 삭제
    const imageUrls = menusToDelete
      .map(m => m.image)
      .filter((url): url is string => url !== null);
    if (imageUrls.length > 0) {
      // await 없이 실행하여 응답 속도 최적화 (로그는 s3-client 내부에서 찍힘)
      deleteS3Images(imageUrls).catch(err => 
        console.error("카테고리 삭제 후 S3 이미지 정리 실패:", err)
      );
    }

    return res.status(200).json({
      success: true,
      message: '카테고리가 삭제되었습니다.',
    });

  } catch (error) {
    console.error('Delete Category Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러' });
  }
};
// });