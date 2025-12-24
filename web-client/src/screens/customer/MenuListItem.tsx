import { useRef } from 'react';

interface itemProps {
  img?: string;
  name: string;
  content: string;
  price: number;
  moveMenuDetail: () => void;
  put: () => void;
}

const MenuListItem = ({ img, name, content, price, moveMenuDetail, put }: itemProps) => {

  // 길게 누르는 시간을 설정
  const LONG_PRESS_DELAY = 500;
  // 타이머 ID를 저장할 ref
  const timerRef = useRef<number | null>(null); 
  
  const startPressTimer = () => {
    // 딜레이 후에 moveMenuDetail 함수가 실행되도록 타이머를 설정.
    timerRef.current = setTimeout(() => {
      moveMenuDetail();
    }, LONG_PRESS_DELAY);
  };

  const clearPressTimer = () => {
    // 타이머가 설정되어 있다면 취소
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    // 담기 버튼에서 꾹 눌렀을 경우에는 안되게끔
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'button') return; 

    startPressTimer();
  };

  const handleInteractionEnd = () => {
    // 마우스를 떼거나 영역을 벗어날 때 타이머를 취소
    clearPressTimer();
  };

  const handleDeleteClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // **이벤트 버블링 중단!**
    clearPressTimer(); // put 버튼 클릭 시 길게 누르기 이벤트가 실행되지 않도록 타이머 취소
    put(); // props로 받은 put 함수 실행
  };

  return (
    // <div onClick={() => moveMenuDetail()} className="cursor-pointer bg-white rounded-xl p-3 shadow-sm flex h-28 sm:h-32"> 
    <div 
      // PC 웹 환경을 위한 마우스 이벤트 핸들러
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd} // 영역 밖으로 마우스 이동 시
      
      // 모바일 터치 환경을 위한 터치 이벤트 핸들러
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onTouchCancel={handleInteractionEnd} // 전화가 오거나 알림창이 떴을 때

      className="cursor-pointer bg-white rounded-xl p-3 shadow-sm flex h-28 sm:h-32"> {/* 높이를 28(112px)로 줄이고, 큰 화면에서 32로 복귀. 패딩도 p-3으로 축소 */}
      {/* 이미지 영역 */}
      <div className="h-full aspect-square bg-gray-200 rounded-lg shrink-0 overflow-hidden mr-3"> {/* 마진도 mr-3으로 약간 축소 */}
        <img 
          src={img ?? "https://images.unsplash.com/photo-1693429308125-3be7b105ad56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiaWJpbWJhcCUyMGZvb2R8ZW58MXx8fHwxNzYzMTA0MjM0fDA&ixlib=rb-4.1.0&q=80&w=1080"} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
      </div>
      {/* 텍스트 및 버튼 영역 */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex justify-between items-start mb-1 gap-2"> {/* mb-3 -> mb-1로 여백 축소 */}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 truncate text-sm sm:text-base">{name}</h3> {/* 폰트 크기 sm으로 축소 */}
            <p className="text-xs text-gray-500 mt-0.5 truncate">{content}</p> {/* 폰트 크기 xs로 축소, mt-1 -> mt-0.5 */}
          </div>
          <span className="font-bold text-gray-900 shrink-0 text-sm sm:text-base">₩{price}</span> {/* 가격 폰트도 sm으로 */}
        </div>
        <button onClick={handleDeleteClick} className="cursor-pointer w-full bg-orange-400 hover:bg-orange-500 text-white py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-1"> {/* 버튼 높이/폰트 축소 */}
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          담기
        </button>
      </div>
    </div>
  );
};

export default MenuListItem;