import type { RouteObject } from 'react-router-dom';

import TypeChecker from '@/screens/TypeChecker';
import CustomerMain from '@/screens/customer/CustomerMain'
import OwnerMain from '@/screens/owner/OwnerMain';
import OwnerLogin from '@/screens/owner/account/OwnerLogin';
import RegisterForm from '@/screens/owner/account/RegisterForm';
import WithdrawForm from '@/screens/owner/account/WithdrawForm';
import OwnerRestaurantMain from '@/screens/owner/restaurant/RestaurantMain';
import ProfileMain from '@/screens/owner/profile/ProfileMain';
import CategoryMain from '@/screens/owner/category/CategoryMain';

import NotFoundPage from '@/screens/NotFoundPage';

// 옵션: 보호된 경로를 처리하는 레이아웃 컴포넌트 
// (로그인 여부를 확인하고 Outlet을 렌더링하는 역할)
import ProtectedLayout from '@/router/ProtectedLayout'; 

// RouteObject 배열을 선언
// RouteObject 타입은 react-router-dom에서 제공
export const appRoutes: RouteObject[] = [
  {path: '/', element: <TypeChecker />, },  // 현재 qr로만 손님 페이지 진입 가능

  {path: '/customer/main', element: <CustomerMain />, },  // /customer/main?restaurantId=2&qrTableNumber=3
  
  {path: 'owner/login', element: <OwnerLogin />, },
  {path: 'owner/register', element: <RegisterForm />, },
  {path: 'owner/withdraw', element: <WithdrawForm />, },


  // 보호된 경로들은 부모 라우트로 묶어서 관리할 수 있음(안에 있는 경로들은 ProtectedLayout파일 코드에 따라 보호되면서 동작함)
  {path: '/', element: <ProtectedLayout />,
    children: [
      // 부모 경로 '/'에 합쳐져서 '/profile'이 됌
      {path: 'owner/main', element: <OwnerMain />, },
      {path: 'owner/profile-main', element: <ProfileMain />, },
      {path: 'owner/main/restaurant/:restaurantId', element: <OwnerRestaurantMain />, },
      {path: 'owner/main/restaurant/:restaurantId/category/:categoryId', element: <CategoryMain />, },
    ],
  },

  // 일치하는 경로가 없을 때
  {path: '*', element: <NotFoundPage />, }
];
