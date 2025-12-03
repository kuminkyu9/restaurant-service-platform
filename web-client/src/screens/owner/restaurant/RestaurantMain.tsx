
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Modal from '@/components/Modal';

const RestaurantMain = () => {
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const setAddModal = (val: boolean) => setIsAddModalOpen(val);

  const [categoryName, setCategory] = useState('');

  const addCategory = () => {
    console.log('카테고리 이름: ',categoryName);
    setAddModal(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="cursor-pointer text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-base">맛있는 한식당</span>
              <span className="text-xs text-gray-500">카테고리 관리</span>
            </div>
          </div>
        </div>
        <button onClick={() => setAddModal(true)} className="cursor-pointer flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          카테고리 추가
        </button>
      </header>
      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 space-y-4">
        {/* Category Card 1 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group">
          <div>
            <h3 className="text-gray-900 font-medium text-base mb-1">메인 요리</h3>
            <p className="text-gray-400 text-xs">메뉴 2개</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button className="text-gray-400 group-hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        {/* Category Card 2 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group">
          <div>
            <h3 className="text-gray-900 font-medium text-base mb-1">사이드 메뉴</h3>
            <p className="text-gray-400 text-xs">메뉴 1개</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="cursor-pointer text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
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
      </main>

      {/* 카테고리 추가 모달    모달 위치: 최상위 div 닫기 직전 */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setAddModal(false)}
        title="새 카테고리 추가"
      >
        {/* 모달 내용 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              카테고리 이름
            </label>
            <input 
              type="text" 
              placeholder="카테고리 이름을 입력하세요"
              className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 transition-colors"
              value={categoryName}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <button 
            onClick={addCategory} 
            className="cursor-pointer w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            추가하기
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default RestaurantMain;