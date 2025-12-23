import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Restaurant } from '@restaurant/shared-types/restaurant'; 
import type { ApiErrorResponse, ApiResponse } from '@restaurant/shared-types/api';

// 내 식당 조회
export const useMyRestaurant = () => {

  return useQuery<Restaurant[], AxiosError<ApiErrorResponse>>({
    // queryKey: 캐싱 관리용 키. ['restaurant', 'my'] 로 관리
    queryKey: ['restaurants', 'my'],
    
    // queryFn: 실제 API 호출 함수
    queryFn: async () => {
      // const response = await api.get<ApiResponse<Restaurant[]>>('/restaurants/my');

      // 캐시 없으면 최소 500ms는 스켈레톤을 보여주도록 강제 설정 (깜빡임 문제로 딜레이 추가)
      const [response] = await Promise.all([
        api.get<ApiResponse<Restaurant[]>>('/restaurants/my'),
        new Promise(resolve => setTimeout(resolve, 500)) 
      ]);
      // console.log(response);
      return response?.data?.data ?? []; 
    },
    staleTime: 1000 * 60, 
    gcTime: 1000 * 60 * 30,
    retry: 1, // 옵션: 에러 발생 시 재시도 횟수 등 설정
    refetchOnWindowFocus: false,  // 창을 다시 포커스했을 때 재요청 할지 여부
  });
};

// 식당 추가
interface AddRestaurantRequest {
  name: string;
  address: string;
  totalTable: number;
  image?: File;     // 선택 사항
}
export const useAddRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddRestaurantRequest) => {
      const response = await api.post('/restaurants', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      alert('식당 등록 성공');
      
      // 데이터 최신화
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'my'] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('식당 등록 실패:', error);
      const message = error.response?.data?.message || '식당 등록에 실패했습니다.';
      alert(message);
    },
  });
};

// 식당 수정
interface EditRestaurantRequest {
  id: number;
  data: AddRestaurantRequest;
}
export const useEditRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EditRestaurantRequest) => {
      const response = await api.patch(`/restaurants/${data.id}`, data.data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      alert('식당 수정 완료');
      
      // 데이터 최신화
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'my'] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('식당 수정 실패:', error);
      const message = error.response?.data?.message || '식당 수정에 실패했습니다.';
      alert(message);
    },
  });
};

// 식당 삭제
export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: number) => {
      const response = await api.delete(`/restaurants/${data}`);
      return response.data;
    },
    onSuccess: () => {
      alert('식당 삭제 완료');
      
      // 데이터 최신화
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'my'] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('식당 삭제 실패:', error);
      const message = error.response?.data?.message || '식당 삭제에 실패했습니다.';
      alert(message);
    },
  });
};
