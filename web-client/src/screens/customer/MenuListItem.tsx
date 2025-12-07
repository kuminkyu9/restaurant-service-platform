interface itemProps {
  name: string;
  content: string;
  price: number;
  movePath: () => void;
  put: () => void;
}

const MenuListItem = ({ name, content, price, movePath, put }: itemProps) => {
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // **이벤트 버블링 중단!**
    put(); // props로 받은 put 함수 실행
  };

  return (
    <div onClick={() => movePath()} className="bg-white rounded-xl p-3 shadow-sm flex h-28 sm:h-32"> {/* 높이를 28(112px)로 줄이고, 큰 화면에서 32로 복귀. 패딩도 p-3으로 축소 */}
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
            <h3 className="font-bold text-gray-900 truncate text-sm sm:text-base">{name}</h3> {/* 폰트 크기 sm으로 축소 */}
            <p className="text-xs text-gray-500 mt-0.5 truncate">{content}</p> {/* 폰트 크기 xs로 축소, mt-1 -> mt-0.5 */}
          </div>
          <span className="font-bold text-gray-900 shrink-0 text-sm sm:text-base">₩{price}</span> {/* 가격 폰트도 sm으로 */}
        </div>
        <button onClick={handleDeleteClick} className="w-full bg-gray-900 text-white py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-1"> {/* 버튼 높이/폰트 축소 */}
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