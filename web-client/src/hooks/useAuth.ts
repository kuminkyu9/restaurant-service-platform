import { useState, useEffect } from 'react';

type UserType = 'owner' | 'customer' | null;

const useAuth = () => {
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제로는 서버에서 사용자 정보를 가져오는 API 호출
    setTimeout(() => {
      // 예시 데이터: 사용자가 사장님이라고 가정
      const fetchedUserType: UserType = 'owner'; 
      setUserType(fetchedUserType);
      setLoading(false);
    }, 500); 
  }, []);

  return { userType, loading };
};

export default useAuth;
