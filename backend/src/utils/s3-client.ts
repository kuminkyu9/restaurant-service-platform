import { S3Client, DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

// 1. S3 클라이언트 설정 (기존 코드)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default s3;

// ==========================================
// [추가] S3 이미지 삭제 유틸리티 함수들
// ==========================================

/**
 * S3 이미지 URL에서 Key(파일 경로)를 추출하는 헬퍼 함수
 * 예: https://my-bucket.s3.ap-northeast-2.amazonaws.com/uploads/menu/abc.jpg -> uploads/menu/abc.jpg
 */
const getKeyFromUrl = (url: string): string | null => {
  try {
    if (!url) return null;
    // URL 구조에 따라 파싱 (보통 .amazonaws.com/ 뒤에 오는 부분이 Key)
    const urlParts = url.split('.amazonaws.com/');
    return urlParts.length > 1 ? urlParts[1] : null;
  } catch (e) {
    console.error('Invalid S3 URL:', url);
    return null;
  }
};

/**
 * 2. 단일 이미지 삭제 (메뉴 삭제, 식당 이미지 수정 시 사용)
 */
export const deleteS3Image = async (imageUrl: string) => {
  const key = getKeyFromUrl(imageUrl);
  if (!key) return;

  try {
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME, // .env에 버킷 이름 있어야 함
      Key: key,
    }));
    console.log(`🗑️ S3 Image Deleted: ${key}`);
  } catch (error) {
    console.error(`❌ Failed to delete S3 image (${key}):`, error);
    // S3 삭제 실패해도 메인 로직(DB 삭제)은 멈추지 않도록 에러를 던지지 않음 (선택사항)
  }
};

/**
 * 3. 다중 이미지 일괄 삭제 (식당 삭제 시 메뉴 이미지들 한방에 지울 때 사용)
 */
export const deleteS3Images = async (imageUrls: string[]) => {
  // 유효한 Key만 추출해서 객체 배열로 변환
  const objects = imageUrls
    .map(url => ({ Key: getKeyFromUrl(url) })) // [{Key: '...'}, {Key: '...'}]
    .filter(obj => obj.Key) as { Key: string }[]; // null 제거 및 타입 단언

  if (objects.length === 0) return;

  try {
    await s3.send(new DeleteObjectsCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Delete: {
        Objects: objects,
        Quiet: true, // 에러만 리턴받고 성공 로그는 생략 (성능 최적화)
      },
    }));
    console.log(`🗑️ ${objects.length} S3 Images Deleted Successfully`);
  } catch (error) {
    console.error(`❌ Failed to batch delete S3 images:`, error);
  }
};
