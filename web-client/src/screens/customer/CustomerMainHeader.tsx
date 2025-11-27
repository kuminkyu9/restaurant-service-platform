import Logo from '@/assets/images/fork-plate-and-knife.png'

interface HeaderProps {
  restaurantName: string;
  tableNumber: number;
}

export function CustomerMainHeader(props: HeaderProps) {   // default 가 없어서 명명 함수(이름 변경x 강제됨)    근데 default가 있으면 {} 중괄호로 안감싸도 되는데 없음 감싸야댐
  return (
    <>
      <div>
        <div className='w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center'>
          <img src={Logo} className='w-5.5 h-5.5 filter grayscale invert brightness-200' alt="웹 로고" />
        </div>
        <h2>식당 이름</h2>
      </div>

      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                {/* <Utensils className="h-5 w-5 text-white" /> */}
              </div>
              <div>
                <h1 className="text-gray-900">{props.restaurantName}</h1>
                <p className="text-gray-500">테이블 {props.tableNumber}번</p>
              </div>
            </div>
            {/* <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full border-gray-200"
              onClick={() => setShowOrderHistory(true)}
            >
              <Receipt className="h-4 w-4" />
              주문내역
            </Button> */}
          </div>
        </div>
      </header>
    </>
  );
}