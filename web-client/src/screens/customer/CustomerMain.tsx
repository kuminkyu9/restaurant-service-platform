import {MenuListItem} from "@/screens/customer/MenuListItem"
import {CustomerMainHeader} from "@/screens/customer/CustomerMainHeader"

import { useState } from "react";

export function CustomerMain() {

  // 테이블 번호 (실제로는 URL 파라미터나 QR 코드에서 가져올 수 있음)
  const tableNumber = 5;
  const restaurantName = "맛있는 한식당";

  const [isModalOpen, setIsModalOpen] = useState(false);

  const test = (a: number) => {
    console.log(a);
    setIsModalOpen(true);
  }

  return (
    <>
      <div onClick={() => test(1)}>{isModalOpen} CustomerMain</div>
      <CustomerMainHeader restaurantName={restaurantName} tableNumber={tableNumber}  />
      <div>ds</div>
      <MenuListItem />
    </>
  )
}
