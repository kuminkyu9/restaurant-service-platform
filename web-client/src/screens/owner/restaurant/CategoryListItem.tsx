interface itemProps {
  categoryName: string;
  menu: number;
  movePath: () => void;
  del: () => void;
}

const CategoryListItem = ({ categoryName, menu, movePath, del }: itemProps) => {
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // **이벤트 버블링 중단!**
    del(); // props로 받은 del 함수 실행
  };

  return(
    <div onClick={() => movePath()} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group">
      <div>
        <h3 className="text-gray-900 font-medium text-base mb-1">{categoryName}</h3>
        <p className="text-gray-400 text-xs">메뉴 {menu}개</p>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleDeleteClick} className="cursor-pointer text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button className="cursor-pointer text-gray-400 group-hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CategoryListItem;