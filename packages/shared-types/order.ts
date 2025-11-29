export interface OrderItem { 
  menuId: number; 
  name: string; 
  price: number; 
  quantity: number; 
}

/**
 * 주문 응답 정보를 담는 인터페이스
 * @property {number} id - 주문 고유 ID
 * @property {OrderItem[]} items - 주문된 상품 목록
 * @property {number} totalPrice - 주문 총 가격
 * @property {'PENDING' | 'CONFIRMED' | 'COMPLETED'} status - 주문 상태
 */
export interface OrderResponse {
  id: number;
  items: OrderItem[];
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED';
}