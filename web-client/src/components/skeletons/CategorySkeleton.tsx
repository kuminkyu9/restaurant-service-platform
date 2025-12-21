const CategorySkeleton = () => {
  return (
    <div className="mb-4 h-[78px] flex items-center justify-between p-3 bg-white rounded-lg w-full mx-auto border border-gray-200">
      {/* 왼쪽 아이콘 및 텍스트 영역 */}
      <div className="flex items-center space-x-4">
        {/* 아이콘 Placeholder (사각형) */}
        <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
        
        {/* 텍스트 Placeholder */}
        <div className="flex flex-col space-y-2">
          {/* 사이드 이름 Placeholder */}
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          {/* 메뉴개수 Placeholder */}
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* 오른쪽 아이콘 영역 (삭제 및 이동 아이콘) */}
      <div className="flex items-center space-x-4">
        {/* 수정 아이콘 Placeholder */}
        <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
        {/* 삭제 아이콘 Placeholder */}
        <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
        {/* 이동 아이콘 Placeholder */}
        <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default CategorySkeleton;
