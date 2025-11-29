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