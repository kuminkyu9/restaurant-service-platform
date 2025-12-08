import { useState } from 'react';

// 서버에서 받아올 카테고리 데이터의 타입 정의
interface Category {
  id: number;
  name: string;
}

const CategoryTab = () => {
  // 카테고리 데이터를 배열로 정의합니다. (서버에서 가져왔다고 가정)
  // const [categories, setCategories] = useState<Category[]>([]); // 실제로는 이렇게 상태로 관리
  const categories: Category[] = [
    { id: 1, name: '전체' },
    { id: 2, name: '메인' },
    { id: 3, name: '사이드' },
    { id: 4, name: '음료' },
    { id: 5, name: '디저트' },
  ];

  // 현재 활성화된 카테고리를 추적하기 위한 상태
  const [activeCategoryId, setActiveCategoryId] = useState(1); 
  
  return(
    <div className="px-4 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide bg-white">
      <div className="flex gap-2">
        {categories.map((category, index) => {
          // 현재 카테고리가 활성화된 카테고리인지 확인
          const isActive = category.id === activeCategoryId;
          
          // Tailwind CSS 클래스를 동적으로 결정
          const buttonClasses = isActive
            ? 'px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium cursor-pointer'
            : 'px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-100';

          return (
            <button 
              key={index} // React는 리스트 렌더링 시 고유한 'key' prop을 필요로 함
              className={buttonClasses}
              onClick={() => setActiveCategoryId(category.id)} // 클릭 핸들러 추가
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTab;