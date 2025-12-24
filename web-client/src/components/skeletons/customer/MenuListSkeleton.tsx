const MenuListSkeleton = () => {
  const skeletonItems = Array.from({ length: 5 });
  return (
    <>
      {
        skeletonItems.map((_, index) => (
          <div key={index} className="cursor-pointer bg-white rounded-xl p-3 shadow-sm flex h-28 sm:h-32">
            {/* 이미지 영역 스켈레톤 */}
            <div className="h-full aspect-square bg-gray-200 rounded-lg shrink-0 mr-3 flex items-center justify-center">
              {/* 음식 아이콘 SVG (Placeholder) */}
              <svg 
                className="w-10 h-10 text-gray-300" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9-4.5v16.5m-9-12l9 5.25m9-5.25l-9 5.25M3 16.5l2.25 1.313M21 16.5l-2.25 1.313" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            {/* 텍스트 및 버튼 영역 */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="flex justify-between items-start mb-1 gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              {/* 제목 스켈레톤 */}
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              {/* 설명 스켈레톤 */}
              <div className="h-3 bg-gray-100 rounded w-full"></div>
            </div>
            {/* 가격 스켈레톤 */}
            <div className="h-4 bg-gray-200 rounded w-12 shrink-0"></div>
          </div>
          
          {/* 버튼 스켈레톤 */}
          <div className="w-full bg-gray-200 h-8 sm:h-9 rounded-lg"></div>
            </div>
          </div>
        ))
      }
    </>
  );
};

export default MenuListSkeleton;