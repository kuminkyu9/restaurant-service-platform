const CategoryTabSkeleton = () => {
  const skeletonItems = Array.from({ length: 5 });

  return (
    <div className="px-4 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide bg-white animate-pulse">
      <div className="flex gap-2">
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            // 실제 버튼의 padding(px-6, py-2)과 text-sm 높이를 고려한 고정 너비와 높이
            // 첫 번째 아이템은 활성화된 느낌을 주기 위해 배경색을 조금 더 진하게 설정 가능
            className={`h-9 rounded-full bg-gray-200 ${
              index === 0 ? 'w-16 bg-gray-300' : 'w-20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryTabSkeleton;