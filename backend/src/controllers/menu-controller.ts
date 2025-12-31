import { Request, Response } from 'express';
import prisma from '@/utils/prisma';
import s3 from '@/utils/s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { deleteS3Image } from '@/utils/s3-client';

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

// 메뉴 목록 조회 (GET /restaurants/:restaurantId/categories/:categoryId/menus)
export const getMenus = async (req: Request, res: Response) => {
// router.get('/', async (req: Request, res: Response) => {
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
};
// });

// 메뉴 추가 (POST /restaurants/:restaurantId/categories/:categoryId/menus)
export const postMenu = async (req: Request, res: Response) => {
// router.post('/', authenticateToken, upload.single('image'), async (req: Request, res: Response) => {
  try {
    // URL 파라미터 가져오기 (app.ts에서 정의한 이름과 일치 필요)
    const { restaurantId, categoryId } = req.params;
    const { name, price, description } = req.body;
    const ownerId = req.user?.id;
    const file = req.file;

    // 필수 값 체크
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: '메뉴 이름과 가격은 필수입니다.' });
    }

    // 권한 체크 (내 식당의 카테고리가 맞는지 확인)
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

    let imageUrl: string | null = null;
    if (file) {
      const key = `menus/${ownerId}/${Date.now()}-${file.originalname}`;
      // const key = `restaurants/${ownerId}/${Date.now()}-${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer,              // 메모리에 올라온 Buffer
        ContentType: file.mimetype,     // image/png 등
      });
      await s3.send(command); // S3 업로드[web:59][web:68]
      imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    // 메뉴 생성
    const newMenu = await prisma.menu.create({
      data: {
        name,
        price: Number(price),
        description: description || '',
        image: imageUrl,
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
};
// });

// 메뉴 수정 (PATCH /restaurants/:restaurantId/categories/:categoryId/menus/:menuId)
export const patchMenu = async (req: Request, res: Response) => {
// router.patch('/:menuId', authenticateToken, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { restaurantId, categoryId, menuId } = req.params;
    const { name, price, description } = req.body;
    const ownerId = req.user?.id;
    const file = req.file;

    // 권한 체크 (내 식당 -> 내 카테고리 -> 내 메뉴 인지 확인)
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

    let imageUrl: string | null = null;
    // 이미지 파일이 있을 경우 S3 업로드
    if (file) {
      const key = `menus/${ownerId}/${Date.now()}-${file.originalname}`;
      // const key = `restaurants/${ownerId}/${Date.now()}-${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer,              // 메모리에 올라온 Buffer
        ContentType: file.mimetype,     // image/png 등
      });
      await s3.send(command); // S3 업로드[web:59][web:68]
      imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    // 메뉴 수정
    const updatedMenu = await prisma.menu.update({
      where: { id: Number(menuId) },
      data: {
        name,
        price: price !== undefined ? Number(price) : undefined,
        description,
        // image,
        image: imageUrl || undefined, // image가 없으면 undefined를 넣어 업데이트 대상에서 제외
      },
    });

    // 이미지 있으면 aws s3 이미지 삭제
    if(file && menu.image) {
      deleteS3Image(menu.image).catch(err => console.error("S3 기존 이미지 삭제 실패:", err));
    }

    return res.status(200).json({
      success: true,
      message: '메뉴가 수정되었습니다.',
      data: updatedMenu,
    });

  } catch (error) {
    console.error('Update Menu Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러' });
  }
};
// });

// 메뉴 삭제 (DELETE /restaurants/:restaurantId/categories/:categoryId/menus/:menuId)
export const delMenu = async (req: Request, res: Response) => {
// router.delete('/:menuId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { restaurantId, categoryId, menuId } = req.params;
    const ownerId = req.user?.id;

    // 권한 체크 (삭제 대상 메뉴 찾기 + 주인 확인)
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

    // 메뉴 삭제
    await prisma.menu.delete({
      where: { id: Number(menuId) },
    });

    // 이미지 있으면 aws s3 이미지 삭제
    if(menu.image) {
      deleteS3Image(menu.image).catch(err => console.error("S3 기존 이미지 삭제 실패:", err));
    }

    return res.status(200).json({
      success: true,
      message: '메뉴가 삭제되었습니다.',
    });

  } catch (error) {
    console.error('Delete Menu Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러' });
  }
};
// });