import { Navigate, Outlet } from 'react-router-dom';

import type { User, } from '../../../packages/shared-types/user.ts';

const ProtectedLayout = () => {
  // 변수를 전역변수나 상태관리로 어캐 해서 여기저기서 쓸 수 있게 해야됌 중요!
  const user: User = {
    id: 123, // num
    role: 'OWNER', // "OWNER" | "CUSTOMER" | "STAFF"
    restaurantId: 12345,
    name: '테스트',
  }

  const checkUserLoginStatus = () => {
    return true;  // user 타입 가변적으로 하게 넣어야댐
    // return false;
  }

  // 실제로는 Context API나 Redux 등에서 로그인 상태를 가져옴
  const isLoggedIn = checkUserLoginStatus(); 
  if (user.role == 'CUSTOMER') {
    return <Navigate to="/customer/main" replace />;
  }else if (!isLoggedIn) {
    // 로그인 안 되어 있으면, 바로 로그인 페이지로 강제 이동 (리다이렉트)
    return <Navigate to="/owner/login" replace />;
  }

  // 로그인 되어 있으면, 'children'에 해당하는 컴포넌트(ProfilePage 등)를 렌더링
  // Outlet은 자식 라우트가 렌더링될 위치를 지정
  return <Outlet />; 
};

export default ProtectedLayout;
