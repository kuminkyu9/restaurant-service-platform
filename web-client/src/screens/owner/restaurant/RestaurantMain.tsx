
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { QrCode } from 'lucide-react';
import Modal from '@/components/Modal';
import QrModal from '@/screens/owner/restaurant/QrModal';
import CategoryListItem from '@/screens/owner/restaurant/CategoryListItem';
import type { Category, Restaurant } from '@restaurant/shared-types/restaurant';
import { useOwnerRestaurantCategory, useAddCategory, useEditCategory, useDeleteCategory } from '@/hooks/queries/useCategory';
import CategorySkeleton from '@/components/skeletons/owner/CategorySkeleton';
import Spinner from '@/screens/Spinner';
import ConfirmModal from '@/components/ConfirmModal';

const RestaurantMain = () => {
  const navigate = useNavigate();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deleteRestaurantId, setDeleteRestaurantId] = useState<number | null>(null); // 삭제 대상 ID 저장
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null); // 삭제 대상 ID 저장

  const { restaurantId } = useParams<{ restaurantId: string }>();
  // 경로에서 받아온거임
  const location = useLocation();
  const restaurant = location.state.restaurant as Restaurant;

  const skeletons = [1, 2, 3, 4];
  const { data: categoryList = [], isLoading } = useOwnerRestaurantCategory(restaurantId || '');
  const { mutate: handleAddCategory, isPending: isAddPending } = useAddCategory();
  const { mutate: handleEditCategory, isPending: isEditPending } = useEditCategory();
  const { mutate: handleDeleteCategory, isPending: isDeletePending } = useDeleteCategory();

  const [isAddModal, setIsAddModal] = useState(false);
  const setAddModal = (val: boolean) => setIsAddModal(val);
  const [isAddModalEditMode, setIsAddModalEditMode] = useState(false);
  const setAddModalEditMode = (val: boolean) => setIsAddModalEditMode(val);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [categoryName, setCategory] = useState('');

  const [isQrTableNumberModal, setIsQrTableNumberModal] = useState(false);
  const setQrTableNumberModal = (val: boolean) => setIsQrTableNumberModal(val);
  const [qrTableNumber, setQrTableNumber] = useState<number | null>(null);

  const addCategory = () => {
    if(categoryName == '') return;
    console.log('카테고리 이름: ',categoryName);

    if(isAddModalEditMode && isAddModal) {
      if(editingCategory != null) {
        handleEditCategory({
          restaurantId: editingCategory.restaurantId,
          categoryId: editingCategory.id,
          data: {
            name: categoryName,
          }
        });
        setEditingCategory(null);
      }
    }else {
      handleAddCategory({
        restaurantId: restaurant.id,
        data: {
          name: categoryName
        }
      });
    }

    setCategory('');
    if(isAddModalEditMode) setAddModalEditMode(false);
    setAddModal(false);
  }

  const openEditCategory = (data: Category) => {
    console.log(data);
    console.log('해당 카테고리 수정 모달 열기');
    setEditingCategory(data);
    setCategory(data.name);
    setAddModalEditMode(true);
    setAddModal(true);
  }

  const delCategory = (data: Category) => {
    console.log(data);
    console.log('해당 카테고리 삭제');
    setDeleteRestaurantId(data.restaurantId);
    setDeleteCategoryId(data.id);
    setIsConfirmModalOpen(true);

    // 더블체크 안했을 경우 아래 
    // handleDeleteCategory({restaurantId: data.restaurantId, categoryId: data.id});
  }

  const handleDelete = () => {
    if (deleteRestaurantId !== null && deleteCategoryId !== null) {
      console.log(`삭제 확인:, Restaurant: ${deleteRestaurantId}, Category: ${deleteCategoryId}`);
      handleDeleteCategory({restaurantId: deleteRestaurantId, categoryId: deleteCategoryId});
      setDeleteCategoryId(null);
      setDeleteRestaurantId(null);
    }
    setIsConfirmModalOpen(false);
  }

  const moveCategory = (data: Category) => {
    console.log(data);
    console.log('해당 카테고리 이동');
    navigate(`/owner/main/restaurant/${data.restaurantId}/category/${data.id}`, {
      state: {category: data}
    });
  }

  // 모달의 열림/닫힘 상태 관리
  const [isOpen, setIsOpen] = useState(false);
  // 애니메이션 종료 후 완전히 숨기기 위한 별도 상태 (선택 사항)
  const [isRendered, setIsRendered] = useState(false);
  const openQRModal = () => {
    setIsRendered(true); // 렌더링 시작
    // 다음 틱에서 애니메이션 시작 (transition 적용을 위해 필요)
    setTimeout(() => setIsOpen(true), 10); 
  };
  const closeModal = () => {
    setIsOpen(false); // 애니메이션 역재생 시작
    // 애니메이션이 끝난 후 (duration-300 = 300ms) 컴포넌트를 DOM에서 제거
    setTimeout(() => setIsRendered(false), 300); 
  };

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
              <span className="font-bold text-gray-900 text-base">{restaurant.name}</span>
              <span className="text-xs text-gray-500">카테고리 관리</span>
            </div>
          </div>
          {/* **QR 생성 버튼** */}
          <button
            onClick={() => {
              setQrTableNumber(null);
              setQrTableNumberModal(true);
            }}
            // onClick={() => openQRModal()}
            className="cursor-pointer flex items-center space-x-2 px-3 py-1.5 border border-solid border-gray-400 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            {/* QrCode 아이콘 사용, Tailwind text-white 클래스로 색상 설정 */}
            <QrCode className="w-4 h-4" />
            <span>테이블 QR 생성</span>
          </button>
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
        {isLoading ? (
          <div className='flex flex-col animate-fade-in-custom'>
            {skeletons.map((item) => (
              // **가장 바깥쪽 요소에 고유한 key prop을 추가합니다.**
              <CategorySkeleton key={item} />
            ))}
          </div>
        ) : Array.isArray(categoryList) && categoryList?.length === 0 ? (
          <div className="flex items-center justify-center bg-gray-30 animate-fade-in-custom">
            <div className="text-center p-6 bg-white shadow-xl rounded-3xl">
              <h3 className="text-lg font-semibold text-gray-900">등록된 카테고리가 없습니다.</h3>
              <p className="mt-2 text-sm text-gray-500">
                서비스 이용을 위해 해당 식당의 새로운 카테고리를 추가해주세요.
              </p>
              <div className="mt-0">
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col animate-fade-in-custom">
            {categoryList.map((item, idx) => (
              <div key={idx}>
                <CategoryListItem 
                  categoryName={item.name} 
                  // menu={item.menus.length} 
                  edit={() => openEditCategory(item)} 
                  isEditPending={isEditPending}
                  del={() => delCategory(item)}
                  isDeletePending={isDeletePending}
                  movePath={()=> moveCategory(item)} 
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 카테고리 추가 모달    모달 위치: 최상위 div 닫기 직전 */}
      <Modal
        isOpen={isAddModal}
        onClose={() => {
          if(isAddModalEditMode) {
            setEditingCategory(null);
            setAddModalEditMode(false);
          }
          setAddModal(false);
          setCategory('');
        }}
        title={isAddModalEditMode&&isAddModal ? "카테고리 수정" : "새 카테고리 추가"}
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
            {
              isAddModalEditMode&&isAddModal ? ( isEditPending ? <div className='flex justify-center items-center'><Spinner size='sm'/><span className='ml-4'>수정중</span></div> 
                : '수정하기'
              ) 
              : (isAddPending ? <div className='flex justify-center items-center'><Spinner size='sm'/><span className='ml-4'>추가중</span></div> 
                : '추가하기'
              )
            }
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isQrTableNumberModal}
        onClose={() => {
          setQrTableNumberModal(false);
          setQrTableNumber(null);
        }}
        title='테이블 번호 입력'
      >
        {/* 테이블 QR 생성: 테이블 번호 선택 모달 내용 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              테이블 번호(최소: 1, 최대: {restaurant.totalTable})
            </label>
            <input 
              type="number" 
              placeholder="생성될 QR의 테이블 번호를 입력하세요"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
              value={qrTableNumber ?? ''}
              onChange={(e) => {
                // 1. 숫자(0-9)가 아닌 모든 문자를 제거 (한글 및 다른 기호 방지)
                const filteredValue = e.target.value.replace(/[^0-9]/g, ''); 

                // 2. 숫자로 변환
                const numberValue = Number(filteredValue);

                // 3. 유효성 검사 및 상태 업데이트
                if (filteredValue === '') {
                  // 입력이 비어있으면 null로 설정
                  setQrTableNumber(null);
                } else if (numberValue === 0) {
                  // 0을 입력하면 1로 강제 설정
                  setQrTableNumber(1);
                } else if (numberValue > restaurant.totalTable) {
                  setQrTableNumber(restaurant.totalTable);
                } else {
                  // 그 외의 유효한 숫자 입력 시 상태 업데이트
                  setQrTableNumber(numberValue);
                }
              }}
              min="1"
              max={restaurant.totalTable}
              style={{ imeMode: "disabled" }}
            />
          </div>
          <button 
            onClick={
              () => {
                if(qrTableNumber == null) return;
                setQrTableNumberModal(false);
                openQRModal();
              }
            } 
            className="cursor-pointer w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
          >생성하기</button>
        </div>
      </Modal>

      {/* 바텀 모달 컨테이너 */}
      <QrModal isOpen={isOpen} isRendered={isRendered} restaurant={restaurant} tableNumber={qrTableNumber} closeModal={() => closeModal()} />

      {/* 삭제시 확인 모달 */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="카테고리 삭제"
        message="이 카테고리를 삭제하시겠습니까? 메뉴도 삭제됩니다."
        confirmText="네"
        cancelText="아니오"
        type="danger"
      />
    </div>
  );
};

export default RestaurantMain;