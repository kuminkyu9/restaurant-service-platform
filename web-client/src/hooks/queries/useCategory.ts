import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { AxiosError } from 'axios';
import type { Category } from '@restaurant/shared-types/restaurant'; 
import type { ApiErrorResponse, ApiResponse } from '@restaurant/shared-types/api';

// 카테고리 조회
export const useOwnerRestaurantCategory = (restaurantId: string | number) => {

  return useQuery<Category[], AxiosError<ApiErrorResponse>>({
    // queryKey: 캐싱 관리용 키. ['categories', 'owner'] 로 관리
    queryKey: ['categories', 'owner', String(restaurantId)],
    
    // queryFn: 실제 API 호출 함수
    queryFn: async () => {
      // const response = await api.get<ApiResponse<Restaurant[]>>('/restaurants/2/categories');

      // 캐시 없으면 최소 500ms는 스켈레톤을 보여주도록 강제 설정 (깜빡임 문제로 딜레이 추가)
      const [response] = await Promise.all([
        api.get<ApiResponse<Category[]>>(`/restaurants/${restaurantId}/categories`),
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

// 카테고리 추가
interface AddCategoryRequest {
  restaurantId: number;
  data: {
    name: string;
  }
}
export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddCategoryRequest) => {
      const response = await api.post(`/restaurants/${data.restaurantId}/categories`, data.data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      alert('카테고리 추가 성공');
      
      // 데이터 최신화
      queryClient.invalidateQueries({ queryKey: ['categories', 'owner', String(variables.restaurantId)] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('카테고리 추가 실패:', error);
      const message = error.response?.data?.message || '카테고리 추가 실패했습니다.';
      alert(message);
    },
  });
};

// 카테고리 수정
interface EditCategoryRequest {
  restaurantId: number;
  categoryId: number;
  data: {name: string;}
}
export const useEditCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EditCategoryRequest) => {
      const response = await api.patch(`/restaurants/${data.restaurantId}/categories/${data.categoryId}`, data.data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      alert('카테고리 수정 완료');
      
      // 데이터 최신화
      queryClient.invalidateQueries({ queryKey: ['categories', 'owner', String(variables.restaurantId)] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('카테고리 수정 실패:', error);
      const message = error.response?.data?.message || '카테고리 수정에 실패했습니다.';
      alert(message);
    },
  });
};

// 카테고리 삭제
interface DeleteCategoryRequest {
  restaurantId: number;
  categoryId: number;
}
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteCategoryRequest) => {
      const response = await api.delete(`/restaurants/${data.restaurantId}/categories/${data.categoryId}`);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      alert('카테고리 삭제 완료');
      
      // 데이터 최신화
      queryClient.invalidateQueries({ queryKey: ['categories', 'owner', String(variables.restaurantId)] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('카테고리 삭제 실패:', error);
      const message = error.response?.data?.message || '카테고리 삭제에 실패했습니다.';
      alert(message);
    },
  });
};
