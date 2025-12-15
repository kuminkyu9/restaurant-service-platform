import { PrismaClient } from '@prisma/client';

// 전역에서 하나의 인스턴스만 사용 (Singleton 패턴)
const prisma = new PrismaClient();

export default prisma;