export interface Restaurant {
  id: number;
  name: string;
  address: string;
  image?: string;
  // phone?: string;  // 추가 해야 할듯
  totalTable: number;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  restaurantId: number;
  createdAt: string;
}

// 손님용
export interface CategoryInMenu {
  id: number;
  name: string;
  restaurantId: number;
  createdAt: string;
  menus: Menu[]
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  categoryId: number;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  createdAt: string;
  orderId: number;
  menuId: number;
  menu: Menu
}

export interface OrderHistory {
  id: number;
  tableNumber: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  restaurantId: number;
  orderItems: OrderItem[]
}

