import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { OrderHistory } from '@restaurant/shared-types/restaurant'; 
import type { ApiErrorResponse, ApiResponse} from '@restaurant/shared-types/api';

// 손님 주문 목록 조회  GET /orders?restaurantId=10&tableNumber=3&status=pending
export const useOrderCustomer = (restaurantId: number, tableNumber: number, options?: { enabled?: boolean }) => {
  return useQuery<OrderHistory[], AxiosError<ApiErrorResponse>>({
    queryKey: ['orders', 'customer', String(restaurantId)],
    queryFn: async () => {
      const [response] = await Promise.all([
        api.get<ApiResponse<OrderHistory[]>>(`/orders?restaurantId=${restaurantId}&tableNumber=${tableNumber}`),
        new Promise(resolve => setTimeout(resolve, 500)) 
      ]);
      return response?.data?.data ?? []; 
    },
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60, 
    gcTime: 1000 * 60 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// 손님용 주문
export interface OrderMenu {
  menuId: number;
  quantity: number;
  // content: string; // 주의 사항(나중에 추가하면 좋을듯)
}
interface OrderCustomerRequest {
  restaurantId: number;
  tableNumber: number;
  items: OrderMenu[];
}
export const useAddOrderCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OrderCustomerRequest) => {
      const response = await api.post('/orders', data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      alert('주문 성공');
      
      // 데이터 최신화
      queryClient.invalidateQueries({ queryKey: ['orders', 'customer', String(variables.restaurantId)] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('주문 실패:', error);
      const message = error.response?.data?.message || '주문에 실패했습니다.';
      alert(message);
    },
  });
};