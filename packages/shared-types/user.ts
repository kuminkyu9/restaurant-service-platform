/**
 * 사용자 정보를 담는 인터페이스
 * @property {number} id - 사용자 고유 ID
 * @property {string} eamil - 사용자 이메일
 * @property {string} name - 사용자 이름(실명)
 */
export interface Owner {
  id: string;
  email: string;
  name: string;
}

/**  
 * 사장님
 * @property {number} id - 사용자 고유 ID
*/
// export interface Owner {
//   id: number;
//   email: string;
//   password: string;
//   name: string;
//   createdAt: string;
// }

/**  
 * 직원(알바)
 * @property {number} id - 사용자 고유 ID
*/
export interface Staff {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}