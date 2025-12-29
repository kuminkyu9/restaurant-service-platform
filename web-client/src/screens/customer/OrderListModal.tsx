import type { OrderHistory } from '@restaurant/shared-types/restaurant';
import { formatDate } from '@restaurant/shared-types/utils'; 
interface itemProps {
  isOpen: boolean;
  isRendered: boolean;
  closeModal: () => void;
  orderList: OrderHistory[];
}

const OrderListModal = ({ isOpen, isRendered, closeModal, orderList }: itemProps) => {
  const totalPrice = orderList.reduce((acc, cur) => acc + cur.totalPrice, 0);

  return(
    <>
      {isRendered && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* 오버레이 */}
          <div 
            className={`fixed inset-0 bg-black transition-opacity duration-300 ${
              isOpen ? 'opacity-50' : 'opacity-0'
            }`}
            onClick={closeModal}
          ></div>
          {/* 실제 모달 콘텐츠 영역 - 높이(max-h-[80vh]) 등을 조정*/}
          <div 
            className={`relative bg-gray-50 w-full max-h-[70vh] rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
            ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
          >
            {/* 1. 모달 헤더 (고정) */}
            <div className="bg-white px-5 py-4 rounded-t-2xl border-b border-gray-100 flex justify-between items-start shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900">주문 내역</h2>
                <p className="text-sm text-gray-500 mt-1">총 1건의 주문</p>
              </div>
              <button onClick={closeModal} className="cursor-pointer p-1 text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* 2. 스크롤 가능한 콘텐츠 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 주문 카드 */}
              {orderList.map((order, orderIdx) => (
                <div key={orderIdx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  {/* 카드 헤더: 주문번호, 시간, 상태배지 */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-sm text-gray-500">주문번호: {order.id}</div>
                      <div className="text-sm text-gray-400 mt-0.5">{formatDate(order.createdAt)}</div>
                    </div>
                    <span className="bg-orange-100 text-orange-500 text-xs font-bold px-2.5 py-1 rounded-md">
                      {
                        order.status == 'PENDING' ? '접수대기'
                        : order.status == 'COOKING' ? '조리중'
                        : order.status == 'SERVED' ? '서빙중'
                        : order.status == 'COMPLETED' ? '완료'
                        : order.status == 'CANCELED' ? '취소'
                        : order.status
                      }
                    </span>
                  </div>
                  {/* 메뉴 리스트 */}
                  <ul className="space-y-3 mb-6">
                    {order.orderItems.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-gray-700 text-sm">
                        <span className="truncate pr-4 text-gray-600">
                          {item.menu.name} <span className="text-gray-400 text-xs ml-1">x {item.quantity}</span>
                        </span>
                        <span className="font-medium whitespace-nowrap">
                          ₩{item.price.toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {/* 구분선 */}
                  <div className="border-t border-gray-100 my-4"></div>
                  {/* 개별 주문 합계 */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">주문 금액</span>
                    <span className="text-gray-900 font-bold">₩{order.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* 3. 모달 푸터 (총 합계 고정) */}
            <div className="bg-white p-5 border-t border-gray-100 shrink-0 pb-8">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <span className="text-gray-600 font-medium">전체 주문 금액</span>
                <span className="text-lg font-bold text-gray-900">₩{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderListModal;