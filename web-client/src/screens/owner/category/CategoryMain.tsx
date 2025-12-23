import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import MenuListItem from '@/screens/owner/category/MenuListItem';
import Modal from '@/components/Modal';
import type { Category, Menu } from '@restaurant/shared-types/restaurant';
import { useOwnerRestaurantCategoryMenu, useAddMenu, useEditMenu, useDeleteMenu } from '@/hooks/queries/useMenu';
import MenuSkeleton from '@/components/skeletons/MenuSkeleton';
import Spinner from '@/screens/Spinner';

const CategoryMain = () => {
  const navigate = useNavigate();

  const { restaurantId, categoryId } = useParams<{ restaurantId: string, categoryId: string }>();
  // 경로에서 받아온거임
  const location = useLocation();
  const category = location.state.category as Category;

    const skeletons = [1, 2, 3, 4];
    const { data: menuList = [], isLoading } = useOwnerRestaurantCategoryMenu(restaurantId || '', categoryId || '');
    const { mutate: handleAddMenu, isPending: isAddPending } = useAddMenu();
    const { mutate: handleEditMenu, isPending: isEditPending } = useEditMenu();
    const { mutate: handleDeleteMenu, isPending: isDeletePending } = useDeleteMenu();

  const [isAddModal, setIsAddModal] = useState(false);
  const setAddModal = (val: boolean) => setIsAddModal(val);
  const [isAddModalEditMode, setIsAddModalEditMode] = useState(false);
  const setAddModalEditMode = (val: boolean) => setIsAddModalEditMode(val);

  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  
  const [menuName, setMenuName] = useState('');
  // const [price, setPrice] = useState(1000);
  const [price, setPrice] = useState<number | null>(1000);
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const resetModal = () => {
    setMenuName('');
    setImage(null);
    setPrice(1000);
    setContent('');
  }

  const addMenu = () => {
    if(price == null || price == 0) return;
    console.log(`메뉴 추가 { 메뉴: ${menuName}, 가격: ${price}, 설명: ${content}`);
    if(isAddModalEditMode && isAddModal) {
      if(editingMenu != null) {
        handleEditMenu({
          categoryId: editingMenu.categoryId,
          restaurantId: category.restaurantId,
          menuId: editingMenu.id,
          data: {
            name: menuName,
            price: price,
            description: content,
            image: image || undefined,
            // image: formData.image || undefined, // 빈 문자열이면 undefined로
          }
        });
        setEditingMenu(null);
      }
    }else {
      handleAddMenu({
        restaurantId: category.restaurantId,
        categoryId: category.id,
        data: {
          name: menuName,
          price: price,
          description: content,
          image: image || undefined,
          // image: formData.image || undefined, // 빈 문자열이면 undefined로
        }
      });
    }
    resetModal();
    if(isAddModalEditMode) setAddModalEditMode(false);
    setAddModal(false);
  }

  const convertUrlToFile = async (imageUrl: string, fileName: string = "saved_image.jpg"): Promise<File> => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  };
  const handleImageConversion = async (data: Menu) => {
    if (data.image != null) {
      const savedImg = await convertUrlToFile(data.image);
      console.log(savedImg)
      setImage(savedImg);
    }
  };

  const editMenu = (data: Menu) => {
    console.log(data);
    console.log('메뉴 수정');
    setEditingMenu(data);

    setMenuName(data.name);
    setPrice(data.price);
    setContent(data.description);
    handleImageConversion(data);

    setAddModalEditMode(true);
    setAddModal(true);
  }

  const delMenu = (data: Menu) => {
    console.log(data);
    console.log('해당 메뉴 삭제');
    handleDeleteMenu({restaurantId: category.restaurantId, categoryId: data.categoryId, menuId: data.id});
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
              <span className="font-bold text-gray-900 text-base">{category.name}</span>
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
        {isLoading ? (
          <div className='flex flex-col animate-fade-in-custom'>
            {skeletons.map((item) => (
              // **가장 바깥쪽 요소에 고유한 key prop을 추가합니다.**
              <MenuSkeleton key={item} />
            ))}
          </div>
        ) : Array.isArray(menuList) && menuList?.length === 0 ? (
          <div className="flex items-center justify-center bg-gray-30 animate-fade-in-custom">
            <div className="text-center p-6 bg-white shadow-xl rounded-3xl">
              <h3 className="text-lg font-semibold text-gray-900">등록된 메뉴가 없습니다.</h3>
              <p className="mt-2 text-sm text-gray-500">
                서비스 이용을 위해 해당 식당의 새로운 메뉴를 추가해주세요.
              </p>
              <div className="mt-0">
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col animate-fade-in-custom">
            {menuList.map((item, idx) => (
              <div key={idx}>
                <MenuListItem 
                  img={item.image}
                  menuName={item.name} 
                  content={item.description} 
                  price={item.price}
                  edit={()=> editMenu(item)}
                  isEditPending={isEditPending}
                  del={() => delMenu(item)} 
                  isDeletePending={isDeletePending}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 메뉴 추가 모달 */}
      <Modal
        isOpen={isAddModal}
        onClose={() => {
          if(isAddModalEditMode) {
            setEditingMenu(null);
            setAddModalEditMode(false);
          }
          setAddModal(false);
          resetModal();
        }}
        title={isAddModalEditMode&&isAddModal ? "메뉴 수정" : "새 메뉴 추가"}
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
              value={price ?? ''}
              onChange={(e) => {
                // 1. 숫자(0-9)가 아닌 모든 문자를 제거 (한글 및 다른 기호 방지)
                const filteredValue = e.target.value.replace(/[^0-9]/g, ''); 

                // 2. 숫자로 변환
                const numberValue = Number(filteredValue);

                // 3. 유효성 검사 및 상태 업데이트
                if (filteredValue === '') {
                  // 입력이 비어있으면 null로 설정
                  setPrice(null);
                } else if (numberValue === 0) {
                  // 0을 입력하면 1로 강제 설정
                  setPrice(100);
                } else {
                  // 그 외의 유효한 숫자 입력 시 상태 업데이트
                  setPrice(numberValue);
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              메뉴 이미지 (선택)
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
            { 
              image == null || editingMenu?.image == null ? <></>
              : <div className='mt-4 '>
                <p className='text-sm font-semibold text-gray-700 mb-1.5 '>수정할 이미지</p>
                <div className='bg-orange-100 w-full h-64 flex items-center justify-center overflow-hidden rounded-md'>  
                  <img src={editingMenu?.image} alt='수정할 이미지'
                    className='max-w-full max-h-full object-contain'
                  ></img>
                </div>
              </div>
            }
          </div>
          <button 
            onClick={addMenu} 
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
    </div>
  );
};

export default CategoryMain;