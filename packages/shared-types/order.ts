export interface OrderItem { 
  menuId: number; 
  name: string; 
  price: number; 
  quantity: number; 
}

export interface OrderResponse {
  id: number;
  items: OrderItem[];
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED';
}