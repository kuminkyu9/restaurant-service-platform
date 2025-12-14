/**
 * 사용자 정보를 담는 인터페이스
 * @property {number} id - 사용자 고유 ID
 * @property {string} name - 사용자 이름(실명)
 */
// 기존 user를 사장, 직원 이렇게 두개로 나누기
export interface User {
  id: number;
  name: string;
}

/**  
 * 사장님
 * @property {number} id - 사용자 고유 ID
*/
export interface Owner {
  id: number;
  name: string;
}

/**  
 * 직원(알바)
 * @property {number} id - 사용자 고유 ID
*/
export interface Staff {
  id: number;
  name: string;
}