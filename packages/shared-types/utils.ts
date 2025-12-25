// import { isEmpty } from '@restaurant/shared-types/utils'; 

export const isEmpty = (data: unknown): boolean => {
  // 배열인 경우 길이를 체크
  if (Array.isArray(data)) {
    return data.length === 0;
  }
  
  // 문자열인 경우 길이를 체크
  if (typeof data === 'string') {
    return data.trim().length === 0;
  }
  
  // null이나 undefined인 경우
  return data === null || data === undefined;
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};