import {QRCodeSVG} from 'qrcode.react';
import { useRef } from 'react';
import type { Restaurant } from '@restaurant/shared-types/restaurant';
import { FRONTEND_URL } from '@/constants/env';

interface itemProps {
  isOpen: boolean;
  isRendered: boolean;
  restaurant: Restaurant;
  tableNumber: number | null;
  closeModal: () => void;
}

const QrModal = ({ isOpen, isRendered, restaurant, tableNumber, closeModal }: itemProps) => {
  const targetUrl = `${FRONTEND_URL}/customer/main?restaurantId=${restaurant.id}&tableNumber=${tableNumber}`;
  const qrRef = useRef<HTMLDivElement>(null); 

  const downloadQrCode = () => {
    console.log('다운로드 버튼 클릭');
    if (qrRef.current) {
      const svgElement = qrRef.current.querySelector('svg');
      if (svgElement) {
        const serializer = new XMLSerializer();
        let svgSource = serializer.serializeToString(svgElement);

        // 1. 올바른 XMLNS 주소로 수정 (중요)
        if (!svgSource.match(/^<svg[^>]+xmlns="http:\/\/www.w3.org\/2000\/svg"/)) {
          svgSource = svgSource.replace(/^<svg/, '<svg xmlns="www.w3.org"');
        }

        // 2. SVG의 실제 렌더링 크기 가져오기
        const rect = svgElement.getBoundingClientRect();
        const svgWidth = rect.width || 256; // 기본값 설정
        const svgHeight = rect.height || 256;

        const image = new Image();
        image.crossOrigin = 'anonymous'; 
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const padding = 40; 

          // 3. 계산된 크기 기반으로 캔버스 설정
          canvas.width = svgWidth + padding * 2;
          canvas.height = svgHeight + padding * 2;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // 4. 이미지 그릴 때 크기 명시 (가장 안전함)
            ctx.drawImage(image, padding, padding, svgWidth, svgHeight);

            const pngUrl = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `qrcode_${tableNumber || 'image'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        };
        image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgSource);
      }
    }
  }

  return(
    <>
      {tableNumber == 0 ? <div>테이블 번호를 올바르게 입력해주세요</div> : (
        isRendered && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* 오버레이 */}
            <div 
              className={`fixed inset-0 bg-black transition-opacity duration-300 ${
                isOpen ? 'opacity-50' : 'opacity-0'
              }`}
              onClick={closeModal}
            ></div>
            {/* 실제 모달 콘텐츠 영역 - 높이(h-[80%]) 등을 조정가능 */}
            <div 
              className={`relative bg-gray-50 w-full h-[60%] rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
              ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
              <div className="bg-white px-5 py-4 rounded-t-2xl border-b border-gray-100 flex justify-between items-start shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{restaurant.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">고객이 스캔하여 메뉴를 확인할 수 있습니다</p>
                </div>
                <button onClick={closeModal} className="cursor-pointer p-1 text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* 2. 스크롤 가능한 콘텐츠 영역 */}
              <div className="grow flex flex-col items-center justify-center p-5 overflow-y-auto">
                <div className="p-2 bg-white rounded-lg shadow-lg">
                  <div ref={qrRef} className="p-3 border -mb-1.5 border-gray-300 inline-block">
                    <QRCodeSVG 
                      value={targetUrl} 
                      size={200}
                      level={"H"}
                    />
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-base font-semibold text-gray-800">{restaurant.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{restaurant.address}</p>
                  <p className="text-sm text-gray-500">{targetUrl}</p>
                  {/* <p className="text-sm text-gray-500">카테고리: 2개</p> */}
                </div>
              </div>
              {/* 3. 다운로드 버튼 영역 (모달 하단에 고정) */}
              <div className="p-5 bg-white shrink-0 flex">
                <button 
                  onClick={() => downloadQrCode()}
                  className="cursor-pointer w-full max-w-md mx-auto py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-150 ease-in-out"
                >
                  QR 코드 다운로드
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default QrModal;