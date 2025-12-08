interface itemProps {
  isOpen: boolean;
  isRendered: boolean;
  closeModal: () => void;
}

const QrModal = ({ isOpen, isRendered, closeModal }: itemProps) => {

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
          {/* 실제 모달 콘텐츠 영역 - 높이(h-[80%]) 등을 조정가능 */}
          <div 
            className={`relative bg-gray-50 w-full h-[60%] rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
            ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
          >
            <div className="bg-white px-5 py-4 rounded-t-2xl border-b border-gray-100 flex justify-between items-start shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900">맛있는 한식당</h2>
                <p className="text-sm text-gray-500 mt-1">고객이 스캔하여 메뉴를 확인할 수 있습니다</p>
              </div>
              <button onClick={closeModal} className="cursor-pointer p-1 text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* 2. 스크롤 가능한 콘텐츠 영역 */}
            <div className="grow flex flex-col items-center justify-center p-5 overflow-y-auto">
              <div className="p-4 bg-white rounded-lg shadow-lg">
                <img src="path/to/your/qr-code-image.png" alt="QR Code" className="w-48 h-48" />
              </div>
              <div className="mt-6 text-center">
                <p className="text-base font-semibold text-gray-800">맛있는 한식당</p>
                <p className="text-sm text-gray-500 mt-1">서울시 강남구 테헤란로 123</p>
                <p className="text-sm text-gray-500">카테고리: 2개</p>
              </div>
            </div>
            {/* 3. 다운로드 버튼 영역 (모달 하단에 고정) */}
            <div className="p-5 bg-white shrink-0 flex">
              <button 
                onClick={() => console.log('다운로드 버튼 클릭됨')}
                className="cursor-pointer w-full max-w-md mx-auto py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-150 ease-in-out"
              >
                QR 코드 다운로드
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QrModal;