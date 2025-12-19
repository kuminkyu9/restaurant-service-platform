import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  // Zustand 스토어의 상태에 직접 접근 (컴포넌트 밖에서도 가능!)
  const { token } = useAuthStore.getState();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 401 에러 시 Zustand의 logout 액션 실행 -> 상태 초기화 및 UI 반영
      useAuthStore.getState().logout();
      window.location.href = '/owner/login'; // 강제 리다이렉트
    }
    return Promise.reject(error);
  }
);
