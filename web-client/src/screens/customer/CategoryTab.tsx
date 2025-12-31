// import { useState } from 'react';
import type { CategoryInMenu } from '@restaurant/shared-types/restaurant'; 

interface itemProps {
  categoryList: CategoryInMenu[];
  activeCategoryId: number;
  onTabChange: (data: CategoryInMenu) => void;
}

const CategoryTab = ({ categoryList, activeCategoryId, onTabChange }: itemProps) => {

  return(
    <div className="px-4 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide bg-white">
      <div className="flex gap-2">
        {categoryList
        .filter((category) => category.menus && category.menus.length > 0)
        .map((category, index) => {
          // 현재 카테고리가 활성화된 카테고리인지 확인
          const isActive = category.id === activeCategoryId;
          
          // Tailwind CSS 클래스를 동적으로 결정
          const buttonClasses = isActive
            ? 'px-6 py-2  bg-orange-400 text-white rounded-full text-sm font-medium cursor-pointer'
            : 'px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-100';

          return (
            <button 
              key={index} // React는 리스트 렌더링 시 고유한 'key' prop을 필요로 함
              className={buttonClasses}
              onClick={() => onTabChange(category)}
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