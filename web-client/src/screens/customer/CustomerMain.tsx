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
          <div className="bg-white rounded-xl p-3 shadow-sm flex h-28 sm:h-32"> {/* 높이를 28(112px)로 줄이고, 큰 화면에서 32로 복귀. 패딩도 p-3으로 축소 */}
  
  {/* 이미지 영역 */}
  <div className="h-full aspect-square bg-gray-200 rounded-lg shrink-0 overflow-hidden mr-3"> {/* 마진도 mr-3으로 약간 축소 */}
    <img 
      src="https://via.placeholder.com/80" 
      alt="비빔밥" 
      className="w-full h-full object-cover" 
    />
  </div>

  {/* 텍스트 및 버튼 영역 */}
  <div className="flex-1 flex flex-col justify-between min-w-0">
    
    <div className="flex justify-between items-start mb-1 gap-2"> {/* mb-3 -> mb-1로 여백 축소 */}
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-gray-900 truncate text-sm sm:text-base">비빔밥</h3> {/* 폰트 크기 sm으로 축소 */}
        <p className="text-xs text-gray-500 mt-0.5 truncate">신선한 야채와 고추장</p> {/* 폰트 크기 xs로 축소, mt-1 -> mt-0.5 */}
      </div>
      <span className="font-bold text-gray-900 shrink-0 text-sm sm:text-base">₩12,000</span> {/* 가격 폰트도 sm으로 */}
    </div>

    <button className="w-full bg-gray-900 text-white py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-1"> {/* 버튼 높이/폰트 축소 */}
      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      담기
    </button>

  </div>
</div>
          {/* <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                  <img src="https://via.placeholder.com/80" alt="불고기" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">불고기</h3>
                  <p className="text-sm text-gray-500 mt-1">달콤짭짤한 소불고기</p>
                </div>
              </div>
              <span className="font-bold text-gray-900">₩18,000</span>
            </div>
            <button className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              담기
            </button>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                  <img src="https://via.placeholder.com/80" alt="김치볶음밥" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">김치볶음밥</h3>
                  <p className="text-sm text-gray-500 mt-1">매콤한 김치와 계란후라이</p>
                </div>
              </div>
              <span className="font-bold text-gray-900">₩10,000</span>
            </div>
            <button className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              담기
            </button>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                  <img src="https://via.placeholder.com/80" alt="김치찌개" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">김치찌개</h3>
                  <p className="text-sm text-gray-500 mt-1">얼큰한 국물</p>
                </div>
              </div>
              <span className="font-bold text-gray-900">₩9,000</span>
            </div>
            <button className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              담기
            </button>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                  <img src="https://via.placeholder.com/80" alt="김치찌개" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">김치찌개</h3>
                  <p className="text-sm text-gray-500 mt-1">얼큰한 국물</p>
                </div>
              </div>
              <span className="font-bold text-gray-900">₩9,000</span>
            </div>
            <button className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              담기
            </button>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                  <img src="https://via.placeholder.com/80" alt="김치찌개" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">김치찌개</h3>
                  <p className="text-sm text-gray-500 mt-1">얼큰한 국물</p>
                </div>
              </div>
              <span className="font-bold text-gray-900">₩9,000</span>
            </div>
            <button className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              담기
            </button>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                  <img src="https://via.placeholder.com/80" alt="김치찌개" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">김치찌개</h3>
                  <p className="text-sm text-gray-500 mt-1">얼큰한 국물</p>
                </div>
              </div>
              <span className="font-bold text-gray-900">₩9,000</span>
            </div>
            <button className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              담기
            </button>
          </div> */}
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
