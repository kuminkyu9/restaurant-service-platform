import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// import Spinner from '@/screens/Spinner';
import CategoryTab from '@/screens/customer/CategoryTab';
import MenuListItem from '@/screens/customer/MenuListItem';
import OrderListModal from '@/screens/customer/OrderListModal';
import ShoppingCartModal, { type OrderItem } from '@/screens/customer/ShoppingCartModal';
import type { CategoryInMenu, Menu, Restaurant } from '@restaurant/shared-types/restaurant';
import type { OrderMenu } from '@/hooks/queries/useOrder';
import { useCustomerRestaurant } from '@/hooks/queries/useRestaurant';
import { useCustomerRestaurantCategory } from '@/hooks/queries/useCategory';
import { useOrderCustomer, useAddOrderCustomer } from '@/hooks/queries/useOrder';
import CategoryTabSkeleton from '@/components/skeletons/customer/CategoryTabSkeleton';
import MenuListSkeleton from '@/components/skeletons/customer/MenuListSkeleton';
import CartButtonSkeleton from '@/components/skeletons/customer/CartButtonSkeleton';
import RestaurantHeaderSkeleton from '@/components/skeletons/customer/RestaurantHeaderSkeleton';
import { isEmpty } from '@restaurant/shared-types/utils';

const CustomerMain = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const restaurantId = Number(searchParams.get('restaurantId')) || 0;
  const tableNumber = Number(searchParams.get('tableNumber')) || 0;
  if (!restaurantId || !tableNumber) {
    // 아예 없는 경로(예: /404)로 보내서 "잘못된 페이지"를 띄움
    navigate('/not-found', { replace: true }); 
  }

  // 식당 정보
  const { data: restaurant = {} as Restaurant, isLoading: isRestaurantLoading } = useCustomerRestaurant(restaurantId ?? 0);
  // 카테고리.메뉴 정보
  const { data: categoryList = [], isLoading: isMenuLoading, isError: categoryError } = useCustomerRestaurantCategory(restaurantId ?? 0, tableNumber ?? 0);
  // 주문내역 정보
  const { data: orderList = [], isLoading: isOrderLoading, } = useOrderCustomer(restaurantId ?? 0, tableNumber ?? 0);
  // (장바구니)주문하기
  const { mutate: handleAddOrderCustomer, isPending: isAddPending } = useAddOrderCustomer();

  const allMenus = categoryList.flatMap(category => category.menus);

  // const extendedCategoryList = useMemo(() => {
  //   if (!categoryList || categoryList.length === 0) return [];
  //   const allMenus = categoryList.flatMap(category => category.menus);
  //   return [
  //     { 
  //       id: 0, 
  //       name: '전체', 
  //       restaurantId: categoryList[0].restaurantId, 
  //       createdAt: '', 
  //       menus: allMenus 
  //     }, 
  //     ...categoryList
  //   ];
  // }, [categoryList]); 
  const getExtendedList = () => {
  if (!categoryList || categoryList.length === 0) return [];
  const allMenus = categoryList.flatMap(category => [...category.menus]);
  return [
    { id: 0, name: '전체', restaurantId: categoryList[0].restaurantId, createdAt: '', menus: allMenus },
    ...categoryList
  ];
};
const extendedCategoryList = getExtendedList();

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

  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isOrderRendered, setIsOrderRendered] = useState(false);
  const openOrderModal = () => {
    if(isOrderLoading) return;
    setIsOrderRendered(true);
    setTimeout(() => setIsOrderOpen(true), 10); 
    console.log(orderList);
    console.log('주문내역 모달');
  };
  const closeOrderModal = () => {
    setIsOrderOpen(false); // 애니메이션 역재생 시작
    setTimeout(() => setIsOrderRendered(false), 300); 
  };

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartRendered, setIsCartRendered] = useState(false);
  const openCartModal = () => {
    setIsCartRendered(true);
    setTimeout(() => setIsCartOpen(true), 10); 
  };
  const closeCartModal = () => {
    setIsCartOpen(false); // 애니메이션 역재생 시작
    setTimeout(() => setIsCartRendered(false), 300); 
  };
  const onOrder = (data: OrderItem[]) => {  // 장바구니 > 주문하기
    const formattedItems: OrderMenu[] = data.map(item => ({
      menuId: item.id, // item.id를 menuId로 매핑
      quantity: item.quantity
    }));
    console.log(data);
    console.log('주문하기');
    handleAddOrderCustomer({
      restaurantId: restaurantId,
      tableNumber: tableNumber,
      items: formattedItems
    });
    setCart({});
    setIsCartOpen(false);
  }

  const moveMenuDetail = (data: Menu) => {
    console.log(data);
    console.log('디테일 페이지로 이동');
  }

  // --- [핵심] 장바구니 상태 관리 ---(사전 형식으로 검색하는거임 array 처럼 list는 아니고)
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
    <div className={isEmpty(menuList) || categoryError ? "pointer-events-none select-none" : "min-h-screen bg-gray-50 relative pb-20"}> {/* pb-20 ensures content isn't hidden behind fixed cart */}
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
                <p className="text-xs text-gray-500">테이블 {tableNumber}번</p>
              </div>
            </div>
            <button onClick={() => openOrderModal()} className="cursor-pointer hover:bg-gray-100 flex items-center gap-1 text-gray-500 text-sm border border-gray-200 px-2 py-1 rounded">
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
          : isEmpty(menuList) || categoryError ? <div className="flex items-center justify-center bg-gray-100">
            <div className="text-center p-8 bg-white shadow-xl rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-yellow-500"
                xmlns="www.w3.org"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                { 
                  categoryError ? <div><p>주소를 임의로 수정하신 것 같아요!</p><p>올바른 주소가 아니에요</p></div> 
                  : '**사장님이 아직 식당 설정을 하지 않으셨어요**'
                }
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                서비스 이용을 위해 관리자에게 문의해 주세요.
              </p>
            </div>
          </div> 
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
        : totalCount < 1 ? <div onClick={openCartModal} className="cursor-pointer fixed bottom-4 left-4 right-4 bg-orange-400 text-white p-4 z-40 rounded-xl shadow-lg flex justify-between items-center transition-all animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className='font-bold'>장바구니</span>
          </div>
        </div> : <div 
          onClick={openCartModal}
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
      {/* (주문내역) 바텀 모달 컨테이너 */}
      <OrderListModal isOpen={isOrderOpen} isRendered={isOrderRendered} closeModal={() => closeOrderModal()} 
        orderList={orderList}  
      />
      {/* (장바구니) 바텀 모달 컨테이너 */}
      <ShoppingCartModal isOpen={isCartOpen} isRendered={isCartRendered} closeModal={() => closeCartModal()} 
        cart={cart}
        allMenus={allMenus}
        updateQuantity={updateQuantity}
        onOrder={onOrder}
        isAddPending={isAddPending}
      />
    </div>
  );
};

export default CustomerMain;
