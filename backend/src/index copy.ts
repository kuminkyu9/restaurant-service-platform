import 'dotenv/config'; 
import app from '@/app'
import prisma from '@/utils/prisma';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on [http://localhost:${PORT}]`);

  // 데이터베이스 연결 확인 로그 (선택사항)
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed', error);
  }
});