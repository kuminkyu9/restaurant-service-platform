# backend/Dockerfile

# 1. Node.js 이미지 기반
FROM node:20-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. pnpm 설치를 위한 준비
RUN npm install -g pnpm

# 4. 패키지 파일 복사 및 설치
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 5. 소스 코드 복사 (Prisma 포함)
COPY . .

# 6. Prisma 클라이언트 생성
RUN npx prisma generate

# 7. 빌드 (TypeScript -> JavaScript)
RUN pnpm build

# 8. 포트 노출
EXPOSE 3000

# 9. 서버 실행 (DB 마이그레이션 후 시작)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
