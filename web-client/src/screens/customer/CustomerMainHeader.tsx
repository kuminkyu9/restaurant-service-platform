import Logo from '@/assets/images/fork-plate-and-knife.png'

interface HeaderProps {
  restaurantName: string;
  tableNumber: number;
}

export function CustomerMainHeader({ restaurantName, tableNumber }: HeaderProps) { 
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
              <img 
                src={Logo} 
                className="w-5.5 h-5.5 filter grayscale invert brightness-200" 
                alt="가게 로고" 
              />
            </div>
            <div>
              {/* props. 안 붙여도 됨 */}
              <h1 className="text-gray-900">{restaurantName}</h1>
              <p className="text-gray-500">테이블 {tableNumber}번</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}