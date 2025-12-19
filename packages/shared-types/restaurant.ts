export interface Restaurant {
  id: number;
  name: string;
  address: string;
  image?: string;
  // phone?: string;  // 추가 해야 할듯
  totalTable: number;
  createdAt: string
}

export interface Category {
  id: number;
  name: string;
  restaurantId: number,
  menus: menu[]
}

export interface menu {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  categoryId: number;
}

