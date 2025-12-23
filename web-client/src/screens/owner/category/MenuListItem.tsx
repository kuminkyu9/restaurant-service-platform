import { Cog } from 'lucide-react';
import Spinner from '@/screens/Spinner';

interface itemProps {
  img?: string;
  menuName: string;
  content: string;
  price: number;
  edit: () => void;
  isEditPending: boolean;
  del: () => void;
  isDeletePending: boolean;
}

const MenuListItem = ({ img, menuName, content, price, edit, isEditPending, del, isDeletePending }: itemProps) => {
  
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
      {/* <div>
        <h3 className="text-gray-900 font-medium text-base mb-1">{menuName}</h3>
        <p className="text-gray-400 text-xs">{content}</p>
      </div> */}
      <div className="flex items-center gap-4">
        {/* Icon Box */}
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
          {img == null ?
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg> : <img src={img} />}
        </div>
        {/* Text Content */}
        <div className="flex flex-col gap-1">
          <h3 className="text-gray-900 font-medium text-base mb-1">{menuName}</h3>
          <p className="text-gray-400 text-xs">{content}</p>
        </div>
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