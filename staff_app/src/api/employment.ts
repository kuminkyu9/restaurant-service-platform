import client from './client';

interface WorkLogItem {
  id: number;
  workDate: string;
  startTime: string;
  endTime: string | null;
  breakTime: number;
  hourlyWage: number;
  note: string | null;
  employmentId: number;
}

interface WorkLogListItem {
  id: number;
  restaurantName: string;
  workDate: string;
  startTime: string;
  endTime: string | null;
  hourlyWage: number;
  note: string | null;  // .? 은 속성이 없을 수도 있다는 거고 이거는 null값이거나 type값
}

interface WorkLogResponse {
  success: boolean;
  message: string;
  data: WorkLogItem;
}

interface WorkLogListResponse {
  success: boolean;
  message: string;
  data: {
    isWorking: boolean;
    currentWorkingRestaurantId: number | null; 
    logs: any[];  // WorkLogListItem 이거임
  };
}

interface OrderMenuItem {
  name: string;
  quantity: number;
}

export interface OrderItem {
  id: number;
  tableNumber: number;
  orderTime: string;
  status: 'PENDING' | 'COOKING' | 'SERVED' | 'COMPLETED' | 'CANCELED';
  totalPrice: number;
  items: OrderMenuItem[];
}

interface RestaurantOrderResponse {
  success: boolean;
  message: string;
  data: OrderItem[];
}

interface changeOrderStatusRequest {
  status: 'PENDING' | 'COOKING' | 'SERVED' | 'COMPLETED' | 'CANCELED'; 
}
interface OrderStatus {
  orderId: number;
  status: 'PENDING' | 'COOKING' | 'SERVED' | 'COMPLETED' | 'CANCELED';  
}
interface RestaurantOrderStatusResponse {
  success: boolean;
  message: string;
  data: OrderStatus
}

export const employmentApi = {
  // 출근/퇴근 POST  type: "START" | "END"
  toggleWorkStatus: async (restaurantId: number | string, type: 'START' | 'END') => {
    const response = await client.post<WorkLogResponse>(`/staff/work-logs/${restaurantId}`, {
      type,
    });
    return response.data;
  },

  // 내 근무 기록(전체 식당) (GET)
  getWorkLogs: async () => {
    const response = await client.get<WorkLogListResponse>(`/staff/work-logs`);
    return response.data;
  },

  // 해당 식당 주문 정보 가져오기
  getRestaurantOrders: async (restaurantId: number, orderStatus: 'active' | 'finished') => {
    const response = await client.get<RestaurantOrderResponse>(`/staff/restaurants/${restaurantId}/orders?status=${orderStatus}`);
    return response.data;
  },

  // 식당 주문 상태 변경
  patchRestaurantOrderStatus: async (restaurantId: number, orderId: number, data: changeOrderStatusRequest) => {
    const response = await client.patch<RestaurantOrderStatusResponse>(`/staff/restaurants/${restaurantId}/orders/${orderId}/status`, data);
    return response.data;
  },
};



