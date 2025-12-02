import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, } from '../../../packages/shared-types/user.ts';

// 1. 상태와 동작의 타입 정의 (이미지의 interface 부분)
interface UserState {
  user: User | null;                // 상태: 현재 로그인한 유저 정보 (없으면 null)
  setUser: (user: User) => void;    // 동작: 로그인 (정보 저장)
  clearUser: () => void;            // 동작: 로그아웃 (정보 초기화)
}

// 2. 스토어 생성 (이미지의 create 부분)
export const useUserStore = create<UserState>()(
  persist(  // 로컬에 저장되서 새로고침시 데이터 초기화 안되게끔
    (set) => ({
      // 초기값은 로그인 안 된 상태(null)
      user: null,                             

      // 로그인 함수: 받아온 유저 정보(userData)를 상태(user)에 넣음
      setUser: (user) => set({ user }),

      // 로그아웃 함수: 상태(user)를 다시 null로 만듦
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // localStorage에 저장될 키 이름 (필수)
      // 이 스토어의 데이터가 'user-storage'라는 키로 localStorage에 저장
      
      // 만약 세션 스토리지 사용
      // getStorage: () => sessionStorage, 
    }
  )
);