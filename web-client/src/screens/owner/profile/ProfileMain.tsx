import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const ProfileMain = () => {
  const user = useAuthStore((state) => state.user);
  
  const navigate = useNavigate();

  const cancel = () => {
    console.log('취소');
    navigate(-1);
  }
  
  const save = () => {
    console.log('저장');
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button className="text-gray-600 hover:text-gray-900 transition-colors">
          <svg onClick={() => navigate(-1)} className="cursor-pointer w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="font-bold text-gray-900 text-base">프로필 설정</h1>
          <p className="text-xs text-gray-500">내 정보를 수정할 수 있습니다</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-6 mt-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          
          {/* Profile Image & Name Section */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500">사장님</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <input 
                type="text" 
                defaultValue={user?.name}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Role Input */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                직책
              </label>
              <input 
                type="text" 
                defaultValue="홀 서빙"
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div> */}

            {/* Contact Input */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처
              </label>
              <input 
                type="tel" 
                defaultValue="010-1234-5678"
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div> */}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input 
                type="email" 
                defaultValue={user?.email}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <p className="mt-1.5 text-xs text-gray-400">로그인 계정으로 사용됩니다</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-10 pt-6 border-t border-gray-100">
            <button onClick={() => cancel() } className="cursor-pointer flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              취소
            </button>
            <button onClick={() => save() } className="cursor-pointer flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              저장
            </button>
          </div>

        </div>
      </main>

      {/* Help Button (Fixed) */}
      {/* <button className="fixed bottom-6 right-6 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-20">
        <span className="font-bold text-lg">?</span>
      </button> */}
    </div>
  );
};

export default ProfileMain;