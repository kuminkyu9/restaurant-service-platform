import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MenuListItem from '@/screens/owner/category/MenuListItem';
import Modal from '@/components/Modal';

const CategoryMain = () => {
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const setAddModal = (val: boolean) => setIsAddModalOpen(val);
  
  const [menuName, setMenuName] = useState('');
  const [price, setPrice] = useState(1000);
  const [content, setContent] = useState('');

  const resetModal = () => {
    setMenuName('');
    setPrice(1000);
    setContent('');
  }

  const addMenu = () => {
    console.log(`메뉴 추가 { 메뉴: ${menuName}, 가격: ${price}, 설명: ${content}`);
    resetModal();
    setAddModal(false);
  }

  const editMenu = (index: number) => {
    console.log('index: '+index+', 메뉴 수정');
  }

  const delMenu = (index: number) => {
    console.log('index: '+index+', 해당 메뉴 삭제');
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
              <span className="font-bold text-gray-900 text-base">선택한 카테고리 이름</span>
              <span className="text-xs text-gray-500">메뉴 관리</span>
            </div>
          </div>
        </div>

        <button onClick={() => setAddModal(true)} className="cursor-pointer flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          메뉴 추가
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 space-y-4">
        {/* Menu Item 1 */}
        <MenuListItem menuName={"김치찌개"} content={"얼큰한 김치찌개"} price={9000}
          edit={()=> editMenu(1)} 
          del={() => delMenu(1)} 
        />
      </main>

      {/* 메뉴 추가 모달 */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setAddModal(false);
          resetModal();
        }}
        title="새 메뉴 추가"
      >
        {/* 모달 내용 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              메뉴 이름
            </label>
            <input 
              type="text" 
              placeholder="메뉴 이름을 입력하세요"
              className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 transition-colors"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              가격
            </label>
            <input 
              type="number" 
              placeholder="가격을 입력하세요"
              className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 transition-colors"
              value={price}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                
                if (!isNaN(newValue) && newValue >= 0) {
                  setPrice(newValue);
                } else if (e.target.value === '') {
                  setPrice(0);
                }
              }}
              min={0}
              step={100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              설명 
            </label>
            <input 
              type="text" 
              placeholder="메뉴 설명을 입력하세요"
              className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 transition-colors"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button 
            onClick={addMenu} 
            className="cursor-pointer w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            추가하기
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryMain;