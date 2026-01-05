import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { SERVER_URL as BASE_URL } from '@/constants/env';

// 실제 개발 서버 IP로 변경필요(localhost는 안드로이드 에뮬레이터에서 안 됨)
// 안드로이드 에뮬레이터: 'http://10.0.2.2:3000'
// iOS 시뮬레이터: 'http://localhost:3000'
// 실제 기기: 'http://내PC_IP주소:3000'
// const BASE_URL = 'http://192.168.200.182:3000'; // 내 pc IPv4

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. 요청 인터셉터: 모든 요청 헤더에 Access Token 자동 추가
client.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. 응답 인터셉터: 401 에러(토큰 만료) 처리
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 로그인 경로는 401이 나더라도 토큰 갱신 시도를 하지 않음
    if (originalRequest.url.includes('/login')) { 
      return Promise.reject(error);
    }

    // 401 에러이고, 재시도한 적이 없을 때
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh Token으로 새 Access Token 발급 요청
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        
        // Refresh Token도 없으면 아웃
        if (!refreshToken) throw new Error('No refresh token');

        // 백엔드의 토큰 갱신 엔드포인트 호출 (경로는 실제 백엔드에 맞게 수정)
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        // 새 토큰 저장
        await SecureStore.setItemAsync('accessToken', data.accessToken);
        
        // 실패했던 요청에 새 토큰 담아서 재요청
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return client(originalRequest);

      } catch (refreshError) {
        // Refresh Token도 만료되었거나 갱신 실패 시 -> 로그아웃 처리
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        
        Alert.alert('세션 만료', '다시 로그인해주세요.');
        // 여기서 네비게이션을 로그인 화면으로 돌리는 처리가 필요할 수 있음
        // (보통 Context API나 전역 상태관리에서 처리)
        
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
