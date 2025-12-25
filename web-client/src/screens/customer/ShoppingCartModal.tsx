import { useMemo } from 'react';
import type { Menu } from '@restaurant/shared-types/restaurant';
import Spinner from '../Spinner';

export interface OrderItem extends Menu {
  quantity: number;
  totalPrice: number;
}

interface OrderListModalProps {
  isOpen: boolean;
  isRendered: boolean;
  closeModal: () => void;
  cart: Record<number, number>; // { 메뉴ID: 수량 }
  allMenus: Menu[];             // 전체 메뉴 정보 리스트
  updateQuantity: (menuId: number, delta: number) => void;
  onOrder: (data: OrderItem[]) => void;
  isAddPending: boolean;
}

const OrderListModal = ({isOpen, isRendered, closeModal, cart, allMenus, updateQuantity, onOrder, isAddPending}: OrderListModalProps) => {
  
  const orderItems: OrderItem[] = useMemo(() => {
    return Object.entries(cart).map(([strId, quantity]) => {
      const menuId = Number(strId);
      const menuDetail = allMenus.find(m => m.id === menuId);
      
      if (!menuDetail) return null;

      return {
        ...menuDetail,
        quantity,
        totalPrice: menuDetail.price * quantity
      };
    }).filter((item): item is OrderItem => item !== null);
  }, [cart, allMenus]);

  // 총 결제 예상 금액 계산
  const totalOrderPrice = orderItems.reduce((acc, item) => acc + (item?.totalPrice || 0), 0);

  if (!isRendered) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* 배경 오버레이 (클릭 시 닫힘) */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={closeModal}
      ></div>
      {/* 모달 컨텐츠 */}
      <div className={`relative w-full bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 flex flex-col max-h-[70vh] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
      {/* <div className={`relative w-full max-w-md bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 flex flex-col max-h-[70vh] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}> */}
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">주문 내역</h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 주문 목록 (스크롤 영역) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
          {orderItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <p>장바구니가 비었습니다.</p>
            </div>
          ) : (
            orderItems.map(item => (
              <div key={item!.id} className="flex gap-4 items-start">
                {/* 메뉴 이미지 */}
                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  {item!.image ? <img src={item!.image} className="w-full h-full object-cover"/> : null}
                </div>
                {/* 메뉴 정보 */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900">{item!.name}</h3>
                    <button 
                       onClick={() => updateQuantity(item!.id, -item!.quantity)} // 전체 삭제 (수량만큼 빼기)
                      className="text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">수량: {item!.quantity}개</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">₩{item!.totalPrice.toLocaleString()}</span>
                    {/* 수량 조절 버튼 (UI와 동일하게) */}
                    <div className="flex items-center border border-gray-200 rounded-lg h-8">
                      <button onClick={() => updateQuantity(item!.id, -1)} className="w-8 h-full flex items-center justify-center hover:bg-gray-50">-</button>
                      <span className="text-sm font-bold w-6 text-center">{item!.quantity}</span>
                      <button onClick={() => updateQuantity(item!.id, 1)} className="w-8 h-full flex items-center justify-center hover:bg-gray-50">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* 푸터 (총 금액 및 주문 버튼) */}
        <div className="p-4 border-t border-gray-100 bg-white safe-area-bottom">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500">총 금액</span>
            <span className="text-xl font-bold text-gray-900">₩{totalOrderPrice.toLocaleString()}</span>
          </div>
          {
            isAddPending ? <button onClick={() => onOrder(orderItems)} className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg shadow-orange-200 shadow-lg active:scale-[0.98] transition-all">
              <div className='flex items-center justify-center'><Spinner size='sm' /><span className='pl-4'>주문중</span></div> 
            </button> : <button onClick={() => onOrder(orderItems)} className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg shadow-orange-200 shadow-lg active:scale-[0.98] transition-all">
              주문하기
            </button>
          }
        </div>
      </div>
    </div>
  );
};

export default OrderListModal;
