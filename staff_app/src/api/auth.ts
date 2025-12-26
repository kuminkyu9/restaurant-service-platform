import client from './client';

interface SignupRequest { email: string; password: string; name: string; }
interface AuthResponse { accessToken: string; refreshToken: string; user: { id: number; name: string; }; }

interface LoginRequest { email: string; password: string; }
interface AuthLoginResponse { 
  success: boolean; 
  message: string; 
  data: { 
    token: string, 
    staff: { id: number; name: string; email: string; } 
  } 
}

export const authApi = {
  // 회원가입
  signup: async (data: SignupRequest) => {
    const response = await client.post<AuthResponse>('/auth/staff/register', data);
    return response.data;
  },

  // 로그인
  login: async (data: LoginRequest) => {
    const response = await client.post<AuthLoginResponse>('/auth/staff/login', data);
    return response.data;
  },

  // 로그아웃 (선택)
  logout: async () => {
    // 백엔드 로그아웃 처리가 있다면 호출
    // await client.post('/auth/logout');
  },
};
