export interface ApiErrorResponse {
  message: string;
  success: boolean;
}

export  interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  // status?: number 등 다른 필드
}