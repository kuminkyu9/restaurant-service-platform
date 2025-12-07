import MenuListItem from '@/screens/customer/MenuListItem';

const CustomerMain = () => {
  
  return (
    <>
      <div className="min-h-screen bg-gray-50 relative pb-20"> {/* pb-20 ensures content isn't hidden behind fixed cart */}
      
        {/* Sticky Header */}
        <header className="bg-white sticky top-0 z-30 shadow-sm">
          {/* Restaurant Info */}
          <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-base">맛있는 한식당</h1>
                <p className="text-xs text-gray-500">테이블 5번</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-gray-500 text-sm border border-gray-200 px-2 py-1 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              주문내역
            </button>
          </div>

          {/* Category Tabs */}
          <div className="px-4 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide bg-white">
            <div className="flex gap-2">
              <button className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium">
                전체
              </button>
              <button className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium">
                메인
              </button>
              <button className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium">
                사이드
              </button>
              <button className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium">
                음료
              </button>
              <button className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium">
                디저트
              </button>
            </div>
          </div>
        </header>

        {/* Menu List (Scrollable Content) */}
        <main className="p-4 space-y-4">
          {/* Menu Item 1 */}
          <MenuListItem 
            name={'비빔밥'} content={'신선한 야채와 고추장'} price={12000} 
            movePath={()=> console.log('move')} 
            put={() => console.log('put')} 
          />
        </main>

        {/* Fixed Bottom Cart Bar */}
        <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white p-4 z-40 rounded-4xl shadow-lg">
          <div className="flex items-center justify-center gap-2 font-bold text-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            장바구니
          </div>
        </div>

      </div>
    </>
  );
};

export default CustomerMain;
