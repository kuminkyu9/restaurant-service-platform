
import { Navigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth'; 

const TypeChecker = () => {
  const { userType, loading } = useAuth();

  if (loading) {
    // 사용자 정보를 불러오는 동안 로딩 화면을 보여줍니다.
    return <div>사용자 타입 확인 중...</div>;
  }

  if (userType === 'customer') {
    // 손님이면 손님 전용 메인 페이지로 이동
    return <Navigate to="/customer/main" replace />;
  }

  /* eslint-disable no-constant-condition */  // false 땜에 고정으로 해서 에러뜬거임 임시로 해논거
  // false 내용은 로그인 되어 있는지 확인하는거(token값?)
  // if (userType === 'owner') {
  if (userType === 'owner' && false) {
    // 사장님이면 사장님 전용 메인 페이지로 이동
    return <Navigate to="/owner/main" replace />;
  }

  // 타입이 확인되지 않으면 (또는 로그인 안했으면) 로그인 페이지로
  return <Navigate to="/owner/login" replace />;
};

export default TypeChecker;