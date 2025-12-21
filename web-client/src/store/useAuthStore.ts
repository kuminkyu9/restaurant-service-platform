import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Owner } from '@restaurant/shared-types/user'; 

interface AuthState {
  token: string | null;
  user: Owner | null;
  isLoggedIn: boolean;
  
  // Actions
  login: (token: string, user: Owner) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,

      login: (token, user) => {
        console.log(user);
        // Zustand가 상태 업데이트 및 로컬 스토리지 저장(persist 미들웨어 덕분) 자동 처리
        set({ token, user, isLoggedIn: true });
        
        // Axios 헤더 설정 등을 위해 필요하다면 여기서 직접 localStorage 조작을 추가로 해도 됨
        // 하지만 persist 미들웨어가 'auth-storage' 키로 알아서 저장해줌
      },

      logout: () => {
        set({ token: null, user: null, isLoggedIn: false });
        // 로컬 스토리지 클리어는 persist가 관리하거나 필요시 localStorage.removeItem('auth-storage') 호출
      },
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // 저장소 지정
    }
  )
);
