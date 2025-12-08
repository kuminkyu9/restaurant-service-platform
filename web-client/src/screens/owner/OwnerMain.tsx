import { useUserStore } from '@/store/useUserStore';
import { useState } from 'react';
import Modal from '@/components/Modal';
import OwnerMainProfileDropDown from '@/screens/owner/profile/OwnerMainProfileDropDown';
import RestaurantListItem from '@/screens/owner/RestaurantListItem';
import { useNavigate } from 'react-router-dom';

const OwnerMain = () => {
  const navigate = useNavigate();
  const user = useUserStore.getState().user; 

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const setAddModal = (val: boolean) => setIsAddModalOpen(val);

  const [isProfile, setIsProfileOpen] = useState(false);
  const setProfileDropDown = (val: boolean) => setIsProfileOpen(val);
  const profile = () => {
    console.log('프로필');
    navigate('/owner/profile-main');
  }
  // const setting = () => {
  //   console.log('설정');
  //   navigate('/owner/profile-main');
  // }
  const logout = () => {
    console.log('로그아웃');
    // navigate('owner/login');
    navigate(-1);
  }

  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');

  const resetModal = () => {
    setRestaurantName('');
    setAddress('');
  }

  const addRestaurant = () => {
    console.log(user);
    console.log(`식당이름: ${restaurantName}, 주소: ${address}`)
    resetModal();
    setAddModal(false);
  }

  const moveRestaurant = (index: number) => {

    // 쿼리 피라미터 사용 예시(흠 전역변수로 하면 안해도 될 것 같기도 하고 데모 데이터 넣어서 다 만들어보고 고민 해보기)
    // const restaurantName = '맛있는 국밥집';
    // const menuList = ['순대국밥', '고기국밥'];
    // // 메뉴 리스트 같은 배열은 JSON.stringify로 문자열화하여 전달합니다.
    // const queryString = new URLSearchParams({
    //   name: restaurantName,
    //   menus: JSON.stringify(menuList), // 문자열: "[\"순대국밥\",\"고기국밥\"]"
    // }).toString();
    // navigate(`/owner/profile-main?${queryString}`);

    console.log('index: '+index+', 해당 식당 이동');
    navigate('/owner/main/restaurant-main');
  }

  const delRestaurant = (index: number) => {
    console.log('index: '+index+', 해당 식당 삭제');
  }

  return (
    // 관리상점, 상점추가, 상점들어가면 메뉴 수정 등
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center relative">
        {/* icon */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-lg leading-tight">식당 관리</span>
            <span className="text-xs text-gray-500">사장님 대시보드</span>
          </div>
        </div>
        {/* 식당 추가 버튼 */}
        <button onClick={() => setAddModal(true)} className="cursor-pointer flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          식당 추가
        </button>
        {/* 프로필 */}
        <div className="flex items-start gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-gray-900">김민수</div>
          </div>
          <div onClick={() => setProfileDropDown(true)} className="cursor-pointer w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
            김
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6">
        {/* Restaurant Card   List 식으로 해서 index 값 넣어야댐 */}
        <RestaurantListItem 
          img={undefined} name={"맛있는 한식당"} address={"서울시 강남구 테헤란로 123"} category={2} 
          movePath={()=> moveRestaurant(1)} 
          del={() => delRestaurant(1)} 
        />
      </main>
      <OwnerMainProfileDropDown
        isOpen={isProfile}
        onClose={() => setProfileDropDown(false)}
        onProfile={() => profile()}
        // onSetting={() => setting()}
        onLogout={() => logout()}
      ></OwnerMainProfileDropDown>
      {/* 식당 추가 모달    모달 위치: 최상위 div 닫기 직전 */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setAddModal(false);
          resetModal();
        }}
        title="새 식당 추가"
      >
        {/* 모달 내용 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              식당 이름
            </label>
            <input 
              type="text" 
              placeholder="식당 이름을 입력하세요"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              주소
            </label>
            <input 
              type="text" 
              placeholder="식당 주소를 입력하세요"
              className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 transition-colors"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <button 
            onClick={addRestaurant} 
            className="cursor-pointer w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            추가하기
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default OwnerMain;