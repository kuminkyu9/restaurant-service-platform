import { useState } from 'react';
import Modal from '@/components/Modal';
import OwnerMainProfileDropDown from '@/screens/owner/profile/OwnerMainProfileDropDown';
import RestaurantListItem from '@/screens/owner/RestaurantListItem';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '@/hooks/queries/useAuth';
import { useMyRestaurant } from '@/hooks/queries/useRestaurant';
// import { useMyRestaurant, type Restaurant } from '@/hooks/queries/useRestaurant';
import { useAddRestaurant, useDeleteRestaurant, useEditRestaurant } from '@/hooks/queries/useRestaurant';
import Spinner from '@/screens/Spinner';
import RestaurantSkeleton from '@/components/skeletons/RestaurantSkeleton';
import type { Restaurant } from '@restaurant/shared-types/restaurant'; 

const OwnerMain = () => {
  const navigate = useNavigate();

  const skeletons = [1, 2, 3, 4];
  const { data: restaurantList = [], isLoading } = useMyRestaurant();
  const { mutate: handleAddRestaurant, isPending: isAddPending } = useAddRestaurant();
  const { mutate: handleEditRestaurant, isPending: isEditPending } = useEditRestaurant();
  const { mutate: handleDeleteRestaurant, isPending: isDeletePending } = useDeleteRestaurant();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const setAddModal = (val: boolean) => setIsAddModalOpen(val);
  const [isAddModalEditMode, setIsAddModalEditMode] = useState(false);
  const setAddModalEditMode = (val: boolean) => setIsAddModalEditMode(val);

  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

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

  const handleLogout = useLogout();
  const logout = () => {
    console.log('로그아웃');
    handleLogout();
  }

  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  // const [totalTable, setTotalTable] = useState(1);
  const [totalTable, setTotalTable] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const resetModal = () => {
    setRestaurantName('');
    setAddress('');
    setTotalTable(null);
    setImage(null);
    setEditingRestaurant(null);
  }

  const addRestaurant = () => {
    if(restaurantName !== '' && address !== '' && (totalTable !== null && totalTable > 0)) {
      console.log(`식당이름: ${restaurantName}, 주소: ${address}, totalTable: ${totalTable}, image: ${image}`,);
      // return;
      if(isAddModalEditMode && isAddModalOpen) {
        if(editingRestaurant == null) return;
        handleEditRestaurant({
          id: editingRestaurant.id,
          data: {
            name: restaurantName,
            address: address,
            totalTable: totalTable,
            // image: formData.image || undefined, // 빈 문자열이면 undefined로
          }
        });
        setAddModalEditMode(false);
        resetModal();
        setAddModal(false);
      }else {
        handleAddRestaurant({
          name: restaurantName,
          address: address,
          totalTable: totalTable,
          // image: formData.image || undefined, // 빈 문자열이면 undefined로
        });
        resetModal();
        setAddModal(false);
      }
    }
  }

  // const editRestaurant = (data: Restaurant) => {
  const openEditRestaurantModal = (data: Restaurant) => {
    console.log(data);
    console.log('해당 식당 수정모달');
    setEditingRestaurant(data);

    // isAddModalEditMode
    setRestaurantName(data.name);
    setAddress(data.address);
    setTotalTable(data.totalTable);

    setAddModal(true);
    setAddModalEditMode(true);
  }

  const delRestaurant = (data: Restaurant) => {
    console.log(data);
    console.log('해당 식당 삭제');
    handleDeleteRestaurant(data.id);
  }

  const moveRestaurant = (data: Restaurant) => {
    // 쿼리 피라미터 사용 예시(흠 전역변수로 하면 안해도 될 것 같기도 하고 데모 데이터 넣어서 다 만들어보고 고민 해보기)
    // const restaurantName = '맛있는 국밥집';
    // const menuList = ['순대국밥', '고기국밥'];
    // // 메뉴 리스트 같은 배열은 JSON.stringify로 문자열화하여 전달합니다.
    // const queryString = new URLSearchParams({
    //   name: restaurantName,
    //   menus: JSON.stringify(menuList), // 문자열: "[\"순대국밥\",\"고기국밥\"]"
    // }).toString();
    // navigate(`/owner/profile-main?${queryString}`);

    console.log(data);
    console.log('해당 식당 이동');
    // navigate('/owner/main/restaurant-main');
    navigate(`/owner/main/restaurant-main/${data.id}`, {
      state: {restaurant: data}
    });
  }

  return (
    <>
      {/*  관리상점, 상점추가, 상점들어가면 메뉴 수정 등 */}
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
          <button onClick={() => {
            setAddModalEditMode(false);
            setAddModal(true);
          }} className="cursor-pointer flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
          {isLoading ? (
            <div className='flex flex-col animate-fade-in-custom'>
              {skeletons.map((item) => (
                // **가장 바깥쪽 요소에 고유한 key prop을 추가합니다.**
                <RestaurantSkeleton key={item} />
              ))}
            </div>
          ) : Array.isArray(restaurantList) && restaurantList?.length === 0 ? (
            <div className="flex items-center justify-center bg-gray-30 animate-fade-in-custom">
              <div className="text-center p-6 bg-white shadow-xl rounded-3xl">
                <h3 className="text-lg font-semibold text-gray-900">등록된 식당이 없습니다.</h3>
                <p className="mt-2 text-sm text-gray-500">
                  서비스 이용을 위해 새로운 식당을 추가해주세요.
                </p>
                <div className="mt-0">
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col animate-fade-in-custom">
              {restaurantList.map((item, idx) => (
                <div key={idx}>
                  <RestaurantListItem 
                    img={item.image} name={item.name} address={item.address} 
                    edit={() => openEditRestaurantModal(item)}
                    isEditPending={isEditPending}
                    del={() => delRestaurant(item)} 
                    isDeletePending={isDeletePending}
                    movePath={()=> moveRestaurant(item)} 
                  />
                </div>
              ))}
            </div>
          )}
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
            setAddModalEditMode(false);
            setAddModal(false);
            resetModal();
          }}
          title={isAddModalEditMode&&isAddModalOpen ? "식당 정보 수정" : "새 식당 추가"}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                테이블 개수(최소1개)
              </label>
              <input 
                type="number" 
                placeholder="테이블 개수를 입력하세요"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
                value={totalTable ?? ''}
                onChange={(e) => {
                  // 1. 숫자(0-9)가 아닌 모든 문자를 제거 (한글 및 다른 기호 방지)
                  const filteredValue = e.target.value.replace(/[^0-9]/g, ''); 

                  // 2. 숫자로 변환
                  const numberValue = Number(filteredValue);

                  // 3. 유효성 검사 및 상태 업데이트
                  if (filteredValue === '') {
                    // 입력이 비어있으면 null로 설정
                    setTotalTable(null);
                  } else if (numberValue === 0) {
                    // 0을 입력하면 1로 강제 설정
                    setTotalTable(1);
                  } else {
                    // 그 외의 유효한 숫자 입력 시 상태 업데이트
                    setTotalTable(numberValue);
                  }
                }}
                min="1"
                style={{ imeMode: "disabled" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                식당 이미지 (선택)
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-l-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gray-200 file:text-gray-700
                    hover:file:bg-gray-300
                    bg-gray-50 border border-gray-200 rounded-md cursor-pointer"
                />
              </div>
            </div>
            <button 
              onClick={addRestaurant} 
              className="cursor-pointer w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              {
              isAddModalEditMode&&isAddModalOpen ? ( isEditPending ? <div className='flex justify-center items-center'><Spinner size='sm'/><span className='ml-4'>수정중</span></div> 
                : '수정하기'
              ) 
              : (isAddPending ? <div className='flex justify-center items-center'><Spinner size='sm'/><span className='ml-4'>추가중</span></div> 
                : '추가하기'
              )
              }
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default OwnerMain;