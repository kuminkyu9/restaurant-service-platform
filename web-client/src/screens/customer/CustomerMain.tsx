import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// import Spinner from '@/screens/Spinner';
import CategoryTab from '@/screens/customer/CategoryTab';
import MenuListItem from '@/screens/customer/MenuListItem';
import OrderListModal from './OrderListModal';
import type { CategoryInMenu, Menu, Restaurant } from '@restaurant/shared-types/restaurant';
import { useCustomerRestaurant } from '@/hooks/queries/useRestaurant';
import { useCustomerRestaurantCategory } from '@/hooks/queries/useCategory';
import CategoryTabSkeleton from '@/components/skeletons/customer/CategoryTabSkeleton';
import MenuListSkeleton from '@/components/skeletons/customer/MenuListSkeleton';
import CartButtonSkeleton from '@/components/skeletons/customer/CartButtonSkeleton';
import RestaurantHeaderSkeleton from '@/components/skeletons/customer/RestaurantHeaderSkeleton';

const CustomerMain = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const restaurantId = Number(searchParams.get('restaurantId')) || 0;
  const qrTableNumber = Number(searchParams.get('qrTableNumber')) || 0;
  if (!restaurantId || !qrTableNumber) {
    // 아예 없는 경로(예: /404)로 보내서 "잘못된 페이지"를 띄움
    navigate('/not-found', { replace: true }); 
  }

  const { data: restaurant = {} as Restaurant, isLoading: isRestaurantLoading } = useCustomerRestaurant(restaurantId ?? 0);
  const { data: categoryList = [], isLoading: isMenuLoading } = useCustomerRestaurantCategory(restaurantId ?? 0, qrTableNumber ?? 0);

  const allMenus = categoryList.flatMap(category => category.menus);

  const extendedCategoryList = useMemo(() => {
    if (!categoryList || categoryList.length === 0) return [];
    const allMenus = categoryList.flatMap(category => category.menus);
    return [
      { 
        id: 0, 
        name: '전체', 
        restaurantId: categoryList[0].restaurantId, 
        createdAt: '', 
        menus: allMenus 
      }, 
      ...categoryList
    ];
  }, [categoryList]); 
  const [activeCategoryId, setActiveCategoryId] = useState(0);
  const menuList = useMemo(() => {
    if (!extendedCategoryList || extendedCategoryList.length === 0) return [];
    const targetCategory = extendedCategoryList.find(c => c.id === activeCategoryId);
    return targetCategory ? targetCategory.menus : extendedCategoryList[0].menus;
  }, [extendedCategoryList, activeCategoryId]);

  
  // const [activeCategoryId, setActiveCategoryId] = useState(extendedCategoryList[0].id);
  const handleTabClick = (data: CategoryInMenu) => {
    setActiveCategoryId(data.id);
    // setMenuList(data.menus)
    console.log(data);
    console.log(menuList);
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const openModal = () => {
    setIsRendered(true);
    setTimeout(() => setIsOpen(true), 10); 
  };
  const closeModal = () => {
    setIsOpen(false); // 애니메이션 역재생 시작
    setTimeout(() => setIsRendered(false), 300); 
  };

  const moveMenuDetail = (data: Menu) => {
    console.log(data);
    console.log('디테일 페이지로 이동');
  }

  // --- [핵심] 장바구니 상태 관리 ---
  // Key: MenuId, Value: 수량
  const [cart, setCart] = useState<Record<number, number>>({});

  // 수량 변경 핸들러
  const updateQuantity = (menuId: number, delta: number) => {
    setCart(prev => {
      const newCart = { ...prev }; 
      const currentQty = newCart[menuId] || 0;
      const newQty = currentQty + delta;
      if (newQty <= 0) {
        delete newCart[menuId];
      } else {
        newCart[menuId] = newQty;
      }
      return newCart;
    });
  };

  // 장바구니 총 개수 및 총 가격 계산
  const { totalCount, totalPrice } = useMemo(() => {
    // 전체 메뉴 풀 (가격 조회를 위함)
    const allMenus = extendedCategoryList[0]?.menus || [];
    
    return Object.entries(cart).reduce((acc, [id, qty]) => {
      const menu = allMenus.find(m => m.id === Number(id));
      if (menu) {
        acc.totalCount += qty;
        acc.totalPrice += menu.price * qty;
      }
      return acc;
    }, { totalCount: 0, totalPrice: 0 });
  }, [cart, extendedCategoryList]);

  const menuPut = (data: Menu) => {
    console.log(data);
    console.log('장바구니');
    updateQuantity(data.id, 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 relative pb-20"> {/* pb-20 ensures content isn't hidden behind fixed cart */}
      {/* Sticky Header */}
      <header className="bg-white sticky top-0 z-30 shadow-sm">
        {/* Restaurant Info */}
        { 
          isRestaurantLoading || isMenuLoading ? <RestaurantHeaderSkeleton />
          : <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-base">{restaurant ? restaurant.name : 'test'}</h1>
                <p className="text-xs text-gray-500">테이블 {qrTableNumber}번</p>
              </div>
            </div>
            <button onClick={() => openModal()} className="cursor-pointer hover:bg-gray-100 flex items-center gap-1 text-gray-500 text-sm border border-gray-200 px-2 py-1 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              주문내역
            </button>
          </div>
        }
        {/* tab */}
        {
          isRestaurantLoading || isMenuLoading ? <CategoryTabSkeleton />
          : <CategoryTab categoryList={extendedCategoryList} activeCategoryId={activeCategoryId} onTabChange={handleTabClick} />
        }
      </header>
      {/* Menu List (Scrollable Content) */}
      <main className="p-4 space-y-4">
        {
          isRestaurantLoading || isMenuLoading ? <MenuListSkeleton /> 
          : (activeCategoryId == 0 ? allMenus : menuList).map((item, idx) => (
            <div key={idx}>
              <MenuListItem 
                img={item.image}
                name={item.name} content={item.description} price={item.price} 
                moveMenuDetail={()=> moveMenuDetail(item)} 
                put={() => menuPut(item)}

                quantity={cart[item.id] || 0}
                onIncrement={() => updateQuantity(item.id, 1)}
                onDecrement={() => updateQuantity(item.id, -1)}
              />
            </div>
          ))
        }
      </main>
      {/* Fixed Bottom Cart Bar */}
      {
        isRestaurantLoading || isMenuLoading ? <CartButtonSkeleton /> 
        : totalCount < 1 ? <div className="cursor-pointer fixed bottom-4 left-4 right-4 bg-orange-400 text-white p-4 z-40 rounded-xl shadow-lg flex justify-between items-center transition-all animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className='font-bold'>장바구니</span>
          </div>
        </div> : <div 
          onClick={openModal}
          className="cursor-pointer hover:bg-orange-500 fixed bottom-4 left-4 right-4 bg-orange-400 text-white p-4 z-40 rounded-xl shadow-lg flex justify-between items-center transition-all animate-fade-in-up"
        >
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {totalCount}
            </div>
            <span className="font-bold">장바구니</span>
          </div>
          <div className="font-bold">
            {totalPrice.toLocaleString()}원
          </div>
        </div>
      }
      {/* 바텀 모달 컨테이너 */}
      <OrderListModal isOpen={isOpen} isRendered={isRendered} closeModal={() => closeModal()} />
    </div>
  );
};

export default CustomerMain;
