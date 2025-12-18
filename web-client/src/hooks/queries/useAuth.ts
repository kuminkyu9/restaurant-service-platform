import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore'; // Zustand Store
import type { AxiosError } from 'axios';

// 1. 로그인 요청 데이터 타입 (이메일, 비밀번호)
interface LoginRequest {
  email: string;
  password: string;
}

// 2. 로그인 응답 데이터 타입 (서버가 주는 거에 맞춰야 함)
interface LoginResponse {
  data: {
    token: string;
    owner: {
      id: string;
      email: string;
      name: string;
    };
  },
  message: string;
  success: boolean;
}

// 3. 에러 응답 타입
interface ApiErrorResponse {
  message: string;
  // statusCode?: number;
  // error?: string;
}

// 로그인
export const useLogin = () => {
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
      const response = await api.post<LoginResponse>('/auth/owner/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('1. 응답 데이터 확인:', data);

      loginAction(data.data.token, data.data.owner);

      alert(`${data.data.owner.name} 로그인 성공`);
      navigate('/owner/main');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      alert(error.response?.data?.message || '로그인 실패');
    },
  });
};

// 로그아웃
export const useLogout = () => {
  const navigate = useNavigate();
  const logoutAction = useAuthStore((state) => state.logout);
  
  return () => {
    logoutAction();
    navigate('/owner/login', { replace: true });
  }
}

// 회원가입
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await api.post('/auth/owner/register', data);
      return response.data;
    },
    onSuccess: () => {
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/owner/login', { replace: true }); // 가입 성공 후 로그인 페이지로 이동
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error.response?.data?.message || '회원가입에 실패했습니다.';
      alert(message);
    },
  });
};



// 탈퇴 시 본인확인을 위해 비밀번호를 보내는 경우
interface DeleteAccountRequest {
  email: string;
  password: string;
}

// 회원탈퇴
export const useDeleteAccount = () => {
  const navigate = useNavigate();
  // 탈퇴 성공 시 로컬에 저장된 토큰도 지워야 하므로 logout 액션 가져옴
  const logoutAction = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async (data: DeleteAccountRequest) => {
      // 주의: axios.delete는 두 번째 인자가 config 객체
      // body에 데이터를 실어 보내려면 data 필드 안에 넣어야 함
      const response = await api.delete('/auth/owner/withdraw', {
        data: data // { password: "..." } 형태가 됨
      });
      return response.data;
    },
    onSuccess: () => {
      alert('회원탈퇴가 완료되었습니다.');
      logoutAction(); // 스토어 비우기 (토큰 삭제)
      navigate('/owner/login', { replace: true }); // 로그인 페이지로 튕겨내기
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error.response?.data?.message || '회원탈퇴에 실패했습니다.';
      alert(message);
    },
  });
};