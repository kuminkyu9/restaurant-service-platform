export type UserRole = 'OWNER'|'CUSTOMER'|'STAFF';

/**
 * 사용자 정보를 담는 인터페이스
 * @property {number} id - 사용자 고유 ID
 * @property {'OWNER'|'CUSTOMER'|'STAFF'} role - 사용자의 역할
 * @property {number} [restaurantId] - 레스토랑 ID (선택 사항)
 * @property {string} name - 사용자 이름
 */
export interface User {
  id: number;
  role: UserRole;
  restaurantId?: number;
  name: string;
}