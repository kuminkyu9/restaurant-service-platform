import { create } from 'zustand';
import type { User, } from '../../../packages/shared-types/user.ts';

// 1. 상태와 동작의 타입 정의 (이미지의 interface 부분)
interface UserState {
  user: User | null;                // 상태: 현재 로그인한 유저 정보 (없으면 null)
  setUser: (user: User) => void;    // 동작: 로그인 (정보 저장)
  clearUser: () => void;            // 동작: 로그아웃 (정보 초기화)
}

// 2. 스토어 생성 (이미지의 create 부분)
export const useUserStore = create<UserState>((set) => ({
  // 초기값은 로그인 안 된 상태(null)
  user: null,                             

  // 로그인 함수: 받아온 유저 정보(userData)를 상태(user)에 넣음
  setUser: (user) => set({ user }),

  // 로그아웃 함수: 상태(user)를 다시 null로 만듦 (이미지의 reset과 같음)
  clearUser: () => set({ user: null }),
}));
