# restaurant-service-platform
식당 사장/손님/알바 통합 주문 관리 플랫폼 (React + React Native + Express)

# 1. pnpm
pnpm install

# 2. 모든 프로젝트 동시 실행
pnpm -r dev

# 3. 특정 프로젝트만 스타트
pnpm --filter ./web-client dev	# 웹 <br />
pnpm --filter ./staff_app start 	# 앱: 메트로		// pnpm --filter staff-app start --web   # 웹으로 보는법<br />
pnpm --filter ./backend dev		# 백

# 4. 특정 프로젝트만 빌드
pnpm --filter web-client build

# 5. 각 프로젝트 패키지 라이브러리 설치 방법
ex:  pnpm --filter ./backend add @prisma/client   // pnpm --filter ./<프로젝트명> add <라이브러리 또는 패키지 이름> 

# 6.1. 마이그레이션 실행(DB에 테이블 생성)
ex:  pnpm --filter ./backend exec prisma migrate dev --name init    
// pnpm --filter ./<프로젝트명> [npx대신 pnpm에선 exec를 권장] prisma migrate dev --name [마이그레이션에 부여할 이름 또는 라벨]

# 6.2. Prisma Client 생성(마이그레이션 끝나면 자동으로 되긴 하지만 혹시 몰라서 수동으로 한 번 더 하는거)
pnpm --filter ./backend exec prisma generate

# 6.3. Prisma Studio열기
pnpm --filter ./backend exec prisma studio