import { Cog } from 'lucide-react';
import Spinner from '@/screens/Spinner';

interface itemProps {
  menuName: string;
  content: string;
  price: number;
  edit: () => void;
  isEditPending: boolean;
  del: () => void;
  isDeletePending: boolean;
}

const MenuListItem = ({ menuName, content, price, edit, isEditPending, del, isDeletePending }: itemProps) => {
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // **이벤트 버블링 중단!**
    edit(); // props로 받은 edit 함수 실행
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // **이벤트 버블링 중단!**
    del(); // props로 받은 del 함수 실행
  };

  return(
    <div className="mb-4 bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between hover:shadow-md transition-shadow group">
      <div>
        <h3 className="text-gray-900 font-medium text-base mb-1">{menuName}</h3>
        <p className="text-gray-400 text-xs">{content}</p>
      </div>
      <div className="flex items-center gap-4">
        {  
          (isEditPending || isDeletePending) ? <Spinner size='sm' />
          : <>
            <button onClick={handleEditClick} className="cursor-pointer text-gray-400 hover:text-blue-300 p-2 rounded-full hover:bg-blue-50 transition-colors">
              <Cog className="h-5 w-5" />
            </button>
            <button onClick={handleDeleteClick} className="cursor-pointer text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <div className="text-orange-500 font-bold text-sm">
              {price}원
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default MenuListItem;