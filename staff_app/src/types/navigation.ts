export type RootStackParamList = {
  Login: undefined; // 로그인
  Signup: undefined;  // 회원가입
  Home: undefined;  // 주문목록
  Workplace: {
    restaurantId: number;
    restaurantName: string;
    startWorkTime: string;
    endWorkTime: string;
    isWorking: boolean;
  };  // 주문목록
  Worklog: undefined;
  // Workplace: undefined;  // 주문목록
  Detail: { id: number; title: string };
};
