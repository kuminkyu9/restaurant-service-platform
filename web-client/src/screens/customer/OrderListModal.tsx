interface itemProps {
  isOpen: boolean;
  isRendered: boolean;
  closeModal: () => void;
}

const OrderListModal = ({ isOpen, isRendered, closeModal }: itemProps) => {
  
  const mockOrder = {
    orderNum: "ORD-660568",
    time: "오전 02:31",
    status: "준비중",
    items: [
      { name: "비빔밥", count: 1, price: 12000 },
      { name: "불고기", count: 1, price: 18000 },
      { name: "김치볶음밥", count: 1, price: 10000 },
      { name: "김치찌개", count: 1, price: 9000 },
      { name: "떡볶이", count: 1, price: 7000 },
      { name: "만두", count: 1, price: 6000 },
      { name: "소주", count: 1, price: 5000 },
      { name: "팥빙수", count: 1, price: 8000 },
    ],
    totalPrice: 75000
  };

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
          {/* 실제 모달 콘텐츠 영역 - 높이(h-[80%]) 등을 조정하여 더 넓게 쓸 수 있습니다 */}
          <div 
            className={`relative bg-gray-50 w-full h-[50%] rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
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
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                {/* 카드 헤더: 주문번호, 시간, 상태배지 */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-sm text-gray-500">주문번호: {mockOrder.orderNum}</div>
                    <div className="text-sm text-gray-400 mt-0.5">{mockOrder.time}</div>
                  </div>
                  <span className="bg-orange-100 text-orange-500 text-xs font-bold px-2.5 py-1 rounded-md">
                    {mockOrder.status}
                  </span>
                </div>
                {/* 메뉴 리스트 */}
                <ul className="space-y-3 mb-6">
                  {mockOrder.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-gray-700 text-sm">
                      <span className="truncate pr-4 text-gray-600">
                        {item.name} <span className="text-gray-400 text-xs ml-1">x {item.count}</span>
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
                  <span className="text-gray-900 font-bold">₩{mockOrder.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
            {/* 3. 모달 푸터 (총 합계 고정) */}
            <div className="bg-white p-5 border-t border-gray-100 shrink-0 pb-8">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <span className="text-gray-600 font-medium">전체 주문 금액</span>
                <span className="text-lg font-bold text-gray-900">₩{mockOrder.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderListModal;