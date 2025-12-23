import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(), // 파일을 디스크가 아니라 메모리(Buffer)로 받음
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한 
});

export default upload;
