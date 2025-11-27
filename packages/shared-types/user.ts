export type UserRole = 'OWNER'|'CUSTOMER'|'STAFF';

export interface User {
  id: number;
  role: UserRole;
  restaurantId?: number;
  name: string;
}