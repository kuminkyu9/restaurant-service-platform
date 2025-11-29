import { CustomerMain } from './screens/customer/CustomerMain.tsx'
import { OwnerLogin } from './screens/owner/OwnerLogin.tsx'

import './index.css'

import type { User, } from '../../packages/shared-types/user.ts';

function App() {

  const user: User = {
    id: 123, // num
    role: 'OWNER', // "OWNER" | "CUSTOMER" | "STAFF"
    restaurantId: 12345,
    name: '테스트',
  }

  return (  // return 안에 최상위 요소는 한개만 가능해서 <></> 빈 tag를 쓸 때도 있고 안쓸 때도 있음(빈 tag는 실제 tag는 없게 들어가는거임)
    <>
      {user.role == 'CUSTOMER' ? (
        <CustomerMain />
      ) : (
        <OwnerLogin />
      )}
    </>
  )
}

export default App
