import { Cog } from 'lucide-react';
import Spinner from '@/screens/Spinner';

interface itemProps {
  img: React.ReactNode;
  name: string;
  address: string;
  edit: () => void;
  del: () => void;
  isDeletePending: boolean;
  isEditPending: boolean;
  movePath: () => void;
}

const RestaurantListItem = ({ name, address, edit, del, isDeletePending, isEditPending, movePath }: itemProps) => {
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // **이벤트 버블링 중단!**
    edit(); // props로 받은 del 함수 실행
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // **이벤트 버블링 중단!**
    del(); // props로 받은 del 함수 실행
  };

  return (
    <div onClick={() => movePath()} className="mb-4 bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-center gap-4">
        {/* Icon Box */}
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        {/* Text Content */}
        <div className="flex flex-col gap-1">
          <h3 className="text-gray-900 font-semibold text-base">{name}</h3>
          <p className="text-gray-500 text-sm">{address}</p>
        </div>
      </div>
      {/* Action Icons */}
      <div className="flex items-center gap-4">
        {
          (isDeletePending || isEditPending) ? <Spinner size='sm' /> 
          : <>
            <button onClick={handleEditClick} className="cursor-pointer text-gray-400 hover:text-blue-300 p-2 rounded-full hover:bg-blue-50 transition-colors">
              <Cog className="h-5 w-5" />
            </button>
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
          </>
        }
      </div>
    </div>
  );
};

export default RestaurantListItem;