# restaurant-service-platform

식당 사장/손님/알바 통합 주문 관리 플랫폼 (React + React Native + Express)

cd project 
pnpm install
cd ..
pnpm --filter web-client dev
pnpm --filter backend dev
pnpm --filter staff_app start

# 2. 모든 프로젝트 동시 실행
pnpm -r dev

# 3. 특정 프로젝트만 빌드/스타트
pnpm --filter web-client build