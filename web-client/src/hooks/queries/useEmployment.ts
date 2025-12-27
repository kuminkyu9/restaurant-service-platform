import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Employment } from '@restaurant/shared-types/restaurant'; 
import type { ApiErrorResponse, ApiResponse } from '@restaurant/shared-types/api';

// 내 고용된 스태프 조회
export const useMyEmployment = (restaurantId: number) => {
  return useQuery<Employment[], AxiosError<ApiErrorResponse>>({
    queryKey: ['employment', 'my', String(restaurantId)],
    queryFn: async () => {
      const [response] = await Promise.all([
        api.get<ApiResponse<Employment[]>>(`/employment/${restaurantId}`),
        // new Promise(resolve => setTimeout(resolve, 500)) 
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

// 스태프 고용
interface AddEmploymentRequest {
  email: string;
  hourlyWage: number;
  startWorkTime: string;
  endWorkTime: string;
  isManager: boolean;
}
export const useAddEmployment = (restaurantId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddEmploymentRequest) => {
      const response = await api.post(`/employment/${restaurantId}`, data);
      return response.data;
    },
    onSuccess: () => {
      alert('스태프 고용 성공');
      queryClient.invalidateQueries({ queryKey: ['employment', 'my', String(restaurantId)] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('스태프 고용 실패:', error);
      const message = error.response?.data?.message || '스태프 고용에 실패했습니다.';
      alert(message);
    },
  });
};

// 스태프 고용 정보 수정
interface DetailEmploymentRequest {
  hourlyWage?: number;
  startWorkTime?: string;
  endWorkTime?: string;
  isManager?: boolean;
}
interface EditEmploymentRequest {
  restaurantId: number;
  employmentId: number;
  data: DetailEmploymentRequest;
}
export const useEditEmployment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({restaurantId, employmentId, data}: EditEmploymentRequest) => {
    // mutationFn: async (data: EditEmploymentRequest) => {
      const response = await api.patch(`/employment/${restaurantId}/${employmentId}`, data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      alert('스태프 고용 정보 수정 완료');
      queryClient.invalidateQueries({ queryKey: ['employment', 'my', String(variables.restaurantId)] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('스태프 고용 정보 수정 실패:', error);
      const message = error.response?.data?.message || '스태프 고용 정보 수정에 실패했습니다.';
      alert(message);
    },
  });
};

// 고용 정보 삭제(해고)
export const useDeleteEmployment = (restaurantId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employmentId: number) => {
      const response = await api.delete(`/employment/${employmentId}`);
      return response.data;
    },
    onSuccess: () => {
      alert('고용 정보 삭제 완료');
      queryClient.invalidateQueries({ queryKey: ['employment', 'my', String(restaurantId)] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('식당 삭제 실패:', error);
      const message = error.response?.data?.message || '식당 삭제에 실패했습니다.';
      alert(message);
    },
  });
};
