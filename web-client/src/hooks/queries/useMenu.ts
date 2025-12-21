import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { AxiosError } from 'axios';
import type { Menu } from '@restaurant/shared-types/restaurant'; 
import type { ApiResponse, ApiErrorResponse } from '@restaurant/shared-types/api';

// 메뉴 조회 (수정중) 
export const useOwnerRestaurantCategoryMenu = (restaurantId: string | number, categoryId: string | number) => {

  return useQuery<Menu[], AxiosError<ApiErrorResponse>>({
    // queryKey: 캐싱 관리용 키. ['menus', 'owner'] 로 관리
    queryKey: ['menus', 'owner', String(restaurantId), String(categoryId)],
    
    // queryFn: 실제 API 호출 함수
    queryFn: async () => {
      // const response = await api.get<ApiResponse<Menu[]>>('/restaurants/2/categories/7/menus');

      // 캐시 없으면 최소 500ms는 스켈레톤을 보여주도록 강제 설정 (깜빡임 문제로 딜레이 추가)
      const [response] = await Promise.all([
        api.get<ApiResponse<Menu[]>>(`/restaurants/${restaurantId}/categories/${categoryId}/menus`),
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

// 메뉴 추가
interface AddMenuRequest {
  restaurantId: number;
  categoryId: number;
  data: {
    name: string;
    price: number;
    description: string;
    image?: string;
  }
}
export const useAddMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddMenuRequest) => {
      const response = await api.post(`/restaurants/${data.restaurantId}/categories/${data.categoryId}/menus`, data.data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      alert('메뉴 추가 성공');
      
      // 데이터 최신화  (queryKey를 한군데서 관리해도 좋음)
      queryClient.invalidateQueries({ queryKey: ['menus', 'owner', String(variables.restaurantId), String(variables.categoryId)] }); 
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('메뉴 추가 실패:', error);
      const message = error.response?.data?.message || '메뉴 추가 실패했습니다.';
      alert(message);
    },
  });
};


// 메뉴 수정
interface EditMenuRequest {
  restaurantId: number;
  categoryId: number;
  menuId: number;
  data: {
    name: string;
    price: number;
    description: string;
    image?: string; 
  }
}
export const useEditMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EditMenuRequest) => {
      const response = await api.patch(`/restaurants/${data.restaurantId}/categories/${data.categoryId}/menus/${data.menuId}`, data.data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      alert('메뉴 수정 완료');
      
      // 데이터 최신화
      queryClient.invalidateQueries({ queryKey: ['menus', 'owner', String(variables.restaurantId), String(variables.categoryId)] }); 
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('메뉴 수정 실패:', error);
      const message = error.response?.data?.message || '메뉴 수정에 실패했습니다.';
      alert(message);
    },
  });
};

// 메뉴 삭제
interface DeleteMenuRequest {
  categoryId: number;
  restaurantId: number;
  menuId: number;
}
export const useDeleteMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteMenuRequest) => {
      const response = await api.delete(`/restaurants/${data.restaurantId}/categories/${data.categoryId}/menus/${data.menuId}`);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      alert('메뉴 삭제 완료');
      
      // 데이터 최신화
      queryClient.invalidateQueries({ queryKey: ['menus', 'owner', String(variables.restaurantId), String(variables.categoryId)] }); 
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('메뉴 삭제 실패:', error);
      const message = error.response?.data?.message || '메뉴 삭제에 실패했습니다.';
      alert(message);
    },
  });
};