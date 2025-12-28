export type RootStackParamList = {
  Login: undefined; // 로그인
  Signup: undefined;  // 회원가입
  Home: undefined;  // 주문목록
  Workplace: {
    restaurantId: number;
    restaurantName: string;
    startWorkTime: string;
    endWorkTime: string;
  };  // 주문목록
  // Workplace: undefined;  // 주문목록
  Detail: { id: number; title: string };
};
