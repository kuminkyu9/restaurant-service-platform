const CartButtonSkeleton = () => {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 animate-pulse">
      <div className="w-full h-[60px] bg-gray-200 rounded-4xl shadow-lg flex items-center justify-center gap-2">
        {/* 장바구니 아이콘 위치 스켈레톤 */}
        <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
        
        {/* 장바구니 텍스트 위치 스켈레톤 */}
        <div className="w-16 h-5 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
};

export default CartButtonSkeleton;