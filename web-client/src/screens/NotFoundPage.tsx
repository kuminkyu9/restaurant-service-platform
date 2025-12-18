import { useNavigate } from 'react-router-dom';

// 아이콘 컴포넌트들 (SVG 직접 포함)
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

// 경로 잘못 갔을 때
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 relative font-sans">
      {/* 메인 카드 컨테이너 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 max-w-lg w-full text-center">
        
        {/* 경고 아이콘 영역 */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* 배경 원 효과 (퍼지는 느낌) */}
            <div className="absolute inset-0 bg-red-100 rounded-full scale-125 opacity-50"></div>
            <div className="relative bg-red-50 rounded-full p-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
        </div>

        {/* 텍스트 영역 */}
        <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-500 mb-8 leading-relaxed text-sm md:text-base">
          요청하신 페이지가 존재하지 않거나<br className="hidden md:block" />
          잘못된 경로로 접근하셨습니다.
        </p>

        {/* 원인 박스 */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <p className="text-xs font-semibold text-gray-500 mb-3 text-center uppercase tracking-wider">가능한 원인:</p>
          <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside px-2">
            <li>URL 주소가 잘못 입력되었습니다</li>
            <li>페이지가 삭제되었거나 이동되었습니다</li>
            <li>접근 권한이 없는 페이지입니다</li>
          </ul>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <button 
            onClick={() => navigate(-1)}
            className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium w-full md:w-auto"
          >
            <ArrowLeftIcon />
            이전 페이지
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-[#ff6b00] hover:bg-[#e65100] text-white rounded-lg transition-colors text-sm font-medium w-full md:w-auto shadow-sm"
          >
            <HomeIcon />
            홈으로 가기
          </button>
        </div>
      </div>

      {/* 우측 하단 도움말 플로팅 아이콘 */}
      <button className="fixed bottom-6 right-6 p-0 hover:scale-105 transition-transform cursor-pointer" aria-label="Help">
        <div className="bg-gray-900 text-white rounded-full p-3 shadow-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default NotFoundPage;
