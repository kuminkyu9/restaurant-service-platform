import { api } from '@/api/axios';

// 타입 예시
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const loginAPI = async (data: unknown): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

// ... 회원가입, 탈퇴 등 동일
