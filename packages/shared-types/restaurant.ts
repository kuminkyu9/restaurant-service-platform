
export interface Restaurant {
  id: number;
  name: string;
  address: string;
  image?: string;
  // phone?: string;  // 추가 해야 할듯
  totalTable: number;
  createdAt: string
}