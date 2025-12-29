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
};



