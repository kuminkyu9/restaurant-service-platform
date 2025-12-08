import { useState, useEffect } from 'react';
import Spinner from '@/screens/Spinner';
import CategoryTab from '@/screens/customer/CategoryTab';
import MenuListItem from '@/screens/customer/MenuListItem';
import OrderListModal from './OrderListModal';

interface Category {
  categoryId: number;
  categoryName: string;
}

interface MenuItem {
  menuId: number;
  name: string;
  price: number;
  content: string;
  category: Category;
}

const CustomerMain = () => {
  const [categoryItems, setCategoryItems] = useState<Category[]>([]);

  // 1. 로딩 상태 관리 (초기값: true, 로딩 중)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 2. 데이터 저장 상태 관리 (초기값: 빈 배열)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  // 3. 에러 상태 관리 (선택 사항)
  const [error, setError] = useState<string | null>(null);
  // 컴포넌트가 처음 렌더링될 때(마운트 시)만 실행됩니다.
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        // 실제 백엔드 API 호출 로직 (예시)
        // const response = await fetch('/api/store/menu');
        // const data = await response.json();
        // setMenuItems(data);
        // API 호출 대신 2초 지연을 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 2000));
        // 임시 메뉴 데이터
        const mockMenuList: MenuItem[] = [
          { menuId: 1, name: "비빔밥", price: 12000, content: "신선한 나물과 고추장이 어우러진 전통 한식", category: {categoryId: 1, categoryName: "메인"}, },
          { menuId: 2, name: "불고기", price: 18000, content: "부드럽고 달콤한 양념에 재운 소고기 구이", category: {categoryId: 1, categoryName: "메인"}, },
          { menuId: 3, name: "김치볶음밥", price: 10000, content: "매콤한 김치와 밥이 조화를 이룬 인기 메뉴", category: {categoryId: 1, categoryName: "메인"}, },
          { menuId: 4, name: "김치찌개", price: 9000, content: "얼큰하고 개운한 김치찌개", category: {categoryId: 1, categoryName: "메인"}, },
          { menuId: 5, name: "떡볶이", price: 7000, content: "달콤 매콤한 떡볶이", category: {categoryId: 2, categoryName: "사이드"}, },
          { menuId: 6, name: "만두", price: 6000, content: "고기와 야채가 가득 찬 군만두", category: {categoryId: 2, categoryName: "사이드"}, },
          { menuId: 7, name: "소주", price: 5000, content: "시원한 참이슬", category: {categoryId: 3, categoryName: "음료"}, },
          { menuId: 8, name: "팥빙수", price: 8000, content: "달콤한 팥과 얼음이 어우러진 디저트", category: {categoryId: 4, categoryName: "디저트"}, },
        ];
        console.log('로딩 성공( 개발에선 두번 찍힘)');
        console.log(mockMenuList);
        setCategoryItems(getUniqueCategories(mockMenuList));
        setMenuItems(mockMenuList);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        // 로딩이 성공하든 실패하든 끝났으므로 false로 설정
        setIsLoading(false);
      }
    };
    fetchMenuData();
  }, []); // 빈 배열: 의존성 배열이 비어 있으므로 컴포넌트 마운트 시 1회 실행

  // 중복 카테고리 제거 로직
  const getUniqueCategories = (menuList: MenuItem[]): Category[] => {
    const seenIds = new Set<number>();
    const uniqueCategories: Category[] = [];
    for (const item of menuList) {
      const categoryId = item.category.categoryId;
      // Set.has()을 사용해 이미 추가된 ID인지 확인
      if (!seenIds.has(categoryId)) {
        // 중복이 아니라면, Set에 ID를 추가하고, 새 리스트에도 카테고리 객체를 추가
        seenIds.add(categoryId);
        uniqueCategories.push(item.category);
      }
    }
    return uniqueCategories;
  }

  // 모달의 열림/닫힘 상태 관리
  const [isOpen, setIsOpen] = useState(false);
  // 애니메이션 종료 후 완전히 숨기기 위한 별도 상태 (선택 사항)
  const [isRendered, setIsRendered] = useState(false);
  const openModal = () => {
    setIsRendered(true); // 렌더링 시작
    // 다음 틱에서 애니메이션 시작 (transition 적용을 위해 필요)
    setTimeout(() => setIsOpen(true), 10); 
  };
  const closeModal = () => {
    setIsOpen(false); // 애니메이션 역재생 시작
    // 애니메이션이 끝난 후 (duration-300 = 300ms) 컴포넌트를 DOM에서 제거
    setTimeout(() => setIsRendered(false), 300); 
  };

  const moveMenuDetail = (index: number) => {
    console.log(`index: ${index} 번째 메뉴 디테일 페이지로 이동`);
  }

  const menuPut = (index: number) => {
    console.log(`index: ${index} 번째 메뉴 장바구니`);
    console.log(menuItems);
    console.log(categoryItems);
  }

  // 데이터 가져올때 로딩
  if(isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }
  if (error) {
    // 에러 발생 시 에러 메시지 띄우기
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative pb-20"> {/* pb-20 ensures content isn't hidden behind fixed cart */}
      {/* Sticky Header */}
      <header className="bg-white sticky top-0 z-30 shadow-sm">
        {/* Restaurant Info */}
        <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base">맛있는 한식당</h1>
              <p className="text-xs text-gray-500">테이블 5번</p>
            </div>
          </div>
          <button onClick={() => openModal()} className="cursor-pointer hover:bg-gray-100 flex items-center gap-1 text-gray-500 text-sm border border-gray-200 px-2 py-1 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            주문내역
          </button>
        </div>
        {/* Category Tabs */}
        <CategoryTab />
      </header>
      {/* Menu List (Scrollable Content) */}
      <main className="p-4 space-y-4">
        <MenuListItem 
          img={"https://images.unsplash.com/photo-1693429308125-3be7b105ad56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiaWJpbWJhcCUyMGZvb2R8ZW58MXx8fHwxNzYzMTA0MjM0fDA&ixlib=rb-4.1.0&q=80&w=1080"}
          name={"비빔밥"} content={"신선한 야채와 고추장"} price={12000} 
          moveMenuDetail={()=> moveMenuDetail(1)} 
          put={() => menuPut(1)} 
        />
      </main>
      {/* Fixed Bottom Cart Bar */}
      <div className="cursor-pointer hover:bg-gray-800 fixed bottom-4 left-4 right-4 bg-gray-900 text-white p-4 z-40 rounded-4xl shadow-lg">
        <div className="flex items-center justify-center gap-2 font-bold text-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          장바구니
        </div>
      </div>
      {/* 바텀 모달 컨테이너 */}
      <OrderListModal isOpen={isOpen} isRendered={isRendered} closeModal={() => closeModal()} />
    </div>
  );
};

export default CustomerMain;
