import { Request, Response } from 'express';
import prisma from '@/utils/prisma';
import s3 from '@/utils/s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { deleteS3Image, deleteS3Images } from '@/utils/s3-client';

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

// 식당 추가 (POST /restaurants)
export const postRestaurant = async (req: Request, res: Response) => {
// router.post('/', authenticateToken, upload.single('image'), async (req: Request, res: Response) => {
  try {
    // 요청 바디에서 식당 정보 가져오기
    const { name, address, totalTable } = req.body;
    const file = req.file; // multer가 채워줌

    // 필수 값 체크
    if (!name || !address || !totalTable) {
      return res.status(400).json({ 
        success: false, 
        message: '식당 이름, 주소, 테이블 개수는 필수입니다.' 
      });
    }

    // 토큰에서 사장님 ID 추출 (미들웨어가 심어준 값)
    const ownerId = req.user?.id;
    if (!ownerId) {
      return res.status(401).json({ success: false, message: '사용자 정보를 찾을 수 없습니다.' });
    }

    let imageUrl: string | null = null;
    // 이미지 파일이 있을 경우 S3 업로드
    if (file) {
      const key = `restaurants/${ownerId}/${Date.now()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer,              // 메모리에 올라온 Buffer
        ContentType: file.mimetype,     // image/png 등
      });

      await s3.send(command); // S3 업로드[web:59][web:68]

      imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    // DB에 식당 생성
    const newRestaurant = await prisma.restaurant.create({
      data: {
        name,
        address,
        image: imageUrl, // 이미지는 선택 사항
        // image: image || null, // 이미지는 선택 사항
        totalTable: Number(totalTable), // 혹시 문자열로 올 수 있으니 숫자 변환
        ownerId: ownerId, // 로그인한 사장님 ID로 연결
      },
    });

    // 성공 응답
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
};
// });

// 내 식당 목록 조회 (GET /restaurants/my)
export const getRestaurants = async (req: Request, res: Response) => {
// router.get('/my', authenticateToken, async (req: Request, res: Response) => {
  try {
    const ownerId = req.user?.id;

    const myRestaurants = await prisma.restaurant.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' }, // 최신순 정렬
      // include: { categories: true } // 상점 불러올 때 카테고리도 같이 보여줌
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
};
// });

// 식당 정보 수정 (PATCH /restaurants/:id)
export const patchRestaurant = async (req: Request, res: Response) => {
// router.patch('/:id', authenticateToken, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const restaurantId = Number(req.params.id); // URL 파라미터에서 식당 ID 가져오기
    const ownerId = req.user?.id;
    const { name, address, totalTable } = req.body;
    const file = req.file;

    // 내 식당인지 확인 (권한 체크)
    // Prisma의 updateMany를 쓰면 "조건에 맞는 것만 수정"하므로 
    // 내 식당이 아니면 count가 0이 되어 안전하게 처리 가능하지만,
    // 명확한 에러 메시지를 위해 findFirst로 먼저 찾음
    const existingRestaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId },
    });
    if (!existingRestaurant) {
      return res.status(404).json({ success: false, message: '식당을 찾을 수 없거나 수정 권한이 없습니다.' });
    }

    let image: string | null = null;
    // 이미지 파일이 있을 경우 S3 업로드
    if (file) {
      const key = `restaurants/${ownerId}/${Date.now()}-${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer,              // 메모리에 올라온 Buffer
        ContentType: file.mimetype,     // image/png 등
      });
      await s3.send(command); // S3 업로드[web:59][web:68]
      image = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    // 업데이트 실행
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        name,      // 값이 undefined면 Prisma가 알아서 무시함 (부분 수정 가능)
        address,
        // image,
        image: image || undefined, // image가 없으면 undefined를 넣어 업데이트 대상에서 제외
        totalTable: totalTable ? Number(totalTable) : undefined,
      },
    });

    // 이미지 있으면 aws s3 이미지 삭제
    if(file && existingRestaurant.image) {
      deleteS3Image(existingRestaurant.image).catch(err => console.error("S3 기존 이미지 삭제 실패:", err));
    }

    return res.status(200).json({
      success: true,
      message: '식당 정보가 수정되었습니다.',
      data: updatedRestaurant,
    });

  } catch (error) {
    console.error('Update Restaurant Error:', error);
    return res.status(500).json({ success: false, message: '식당 수정 중 오류 발생' });
  }
};
// });

// 식당 삭제 (DELETE /restaurants/:id)
export const delRestaurant = async (req: Request, res: Response) => {
// router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const restaurantId = Number(req.params.id);
    const ownerId = req.user?.id;

    // 권한 체크 (사장식당) 삭제될 이미지 url들 미리 조회
    // 식당정보 + 식당에 속한 카테고리의 메뉴들의 이미지
    const existingRestaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId },
      include: {
        categories: {
          include: {
            menus: {
              select: {image: true}
            }
          }
        }
      }
    });
    if (!existingRestaurant) {
      return res.status(404).json({ success: false, message: '식당을 찾을 수 없거나 삭제 권한이 없습니다.' });
    }

    const imagesToDelete: string[] = [];
    // 식당 이미지
    if (existingRestaurant.image) {
      imagesToDelete.push(existingRestaurant.image);
    }
    // 모든 메뉴 이미지 수집
    existingRestaurant.categories.forEach(category => {
      category.menus.forEach(menu => {
        if (menu.image) {
          imagesToDelete.push(menu.image);
        }
      });
    });

    // 삭제 실행  (식당을 지우면 연결된 카테고리, 메뉴는 cascade로 삭제됨)
    await prisma.restaurant.delete({
      where: { id: restaurantId },
    });

    // S3 이미지 일괄 삭제 (비동기 Fire-and-Forget)
    if (imagesToDelete.length > 0) {
      console.log('식당 관련 이미지 삭제');
      deleteS3Images(imagesToDelete).catch(err => 
        console.error(`식당(ID:${restaurantId}) 삭제 후 S3 정리 실패:`, err)
      );
    }

    return res.status(200).json({
      success: true,
      message: '식당이 삭제되었습니다.',
    });

  } catch (error) {
    console.error('Delete Restaurant Error:', error);
    return res.status(500).json({ success: false, message: '식당 삭제 중 오류 발생' });
  }
};
// });

// (손님용) 현재 식당 조회 (GET /restaurants/:id)
export const getRestaurant = async (req: Request, res: Response) => {
// router.get('/:id', async (req: Request, res: Response) => {
  try {
    const restaurantId = Number(req.params.id);

    const restaurant = await prisma.restaurant.findUnique({
        where: { id: Number(restaurantId) },
      });

    return res.status(200).json({
      success: true,
      message: '식당 정보 조회 성공',
      data: restaurant,
    });

  } catch (error) {
    console.error('Get My Restaurants Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러' });
  }
};
// });