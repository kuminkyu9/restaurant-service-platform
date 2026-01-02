# backend/Dockerfile

# 1. Node.js 이미지 기반
FROM node:20-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. pnpm 설치
RUN npm install -g pnpm

# 4. 패키지 파일 복사 (lock 파일 제거, package.json만 복사)
COPY package.json ./

# [수정] --frozen-lockfile 옵션 제거 (lock 파일 없이도 설치되게)
RUN pnpm install

# 5. 소스 코드 복사
COPY . .

# 6. Prisma 클라이언트 생성
RUN npx prisma generate

# 7. 빌드
RUN pnpm build

# 8. 포트 노출
EXPOSE 3000

# 9. 서버 실행
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
