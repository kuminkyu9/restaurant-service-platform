const RestaurantHeaderSkeleton = () => {
  return (
    <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100 animate-pulse bg-white">
      {/* 왼쪽 로고 및 텍스트 영역 */}
      <div className="flex items-center gap-3">
        {/* 원형 로고 스켈레톤 */}
        <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
        
        <div className="space-y-2">
          {/* 상호명 스켈레톤 ( restaurant.name ) */}
          <div className="h-4 bg-gray-200 rounded w-24" />
          {/* 테이블 번호 스켈레톤 ( tableNumber ) */}
          <div className="h-3 bg-gray-100 rounded w-16" />
        </div>
      </div>

      {/* 우측 주문내역 버튼 스켈레톤 */}
      <div className="flex items-center gap-1 border border-gray-100 px-2 py-1 rounded w-20 h-7 bg-gray-50">
        {/* 아이콘 위치 */}
        <div className="w-3 h-3 bg-gray-200 rounded-sm" />
        {/* 텍스트 위치 */}
        <div className="w-10 h-3 bg-gray-200 rounded-sm" />
      </div>
    </div>
  );
};

export default RestaurantHeaderSkeleton;
