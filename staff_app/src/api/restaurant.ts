import client from './client';

// 백엔드에서 내려주는 데이터 형태 (Flattened된 구조)
interface MyRestaurantResponse {
  success: boolean;
  message: string;
  data: MyRestaurantData[];
}

export interface MyRestaurantData {
  employmentId: number;
  restaurantId: number;
  restaurantName: string;
  restaurantAddress: string;
  restaurantImage: string | null;
  ownerName: string;
  hourlyWage: number;
  startWorkTime: string; // "09:00"
  endWorkTime: string;   // "18:00"
  isManager: boolean;
  hiredAt: string;       // Date string
  isWorking: boolean;
}

export const restaurantApi = {
  // 내 근무지(식당) 목록 조회
  // GET /staff/restaurants
  getMyRestaurants: async () => {
    const response = await client.get<MyRestaurantResponse>('/staff/restaurants');
    return response.data;
  },
};
