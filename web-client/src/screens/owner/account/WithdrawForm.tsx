import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 분리한 아이콘 컴포넌트 import (index.ts를 통한 일괄 import 가정)
import { ArrowLeftIcon, UserXIcon, AlertTriangleIcon, HelpIcon } from '@/components/icons';
import { useDeleteAccount } from '@/hooks/queries/useAuth';
import Spinner from '@/screens/Spinner';

const WithdrawForm = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: withdraw, isPending } = useDeleteAccount();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('탈퇴 요청:', { email, password });
    withdraw({ email, password })
  };

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <div className="flex flex-col items-center">
            <Spinner /> 
            <p className="mt-2 text-white font-medium">회원가입 중입니다...</p>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-[#fff9f9] flex items-center justify-center p-4 relative font-sans">
        
        {/* 메인 카드 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-[480px] w-full">
          
          {/* 상단 네비게이션: 아이콘 컴포넌트 재사용 */}
          <button 
            onClick={() => navigate(-1)}
            className="cursor-pointer flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium mb-8 transition-colors group"
          >
            {/* group-hover 시 색상 변경 등의 효과 적용 가능 */}
            <ArrowLeftIcon size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="ml-2">로그인으로 돌아가기</span>
          </button>

          {/* 헤더 영역 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <UserXIcon size={32} className="text-red-500" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">회원탈퇴</h1>
            </div>
            <p className="text-gray-500 text-sm pl-1">
              계정을 삭제하시겠습니까?
            </p>
          </div>

          {/* 경고 박스 */}
          <div className="bg-[#fff5f5] border border-red-100 rounded-lg p-5 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangleIcon size={20} className="text-red-500" />
              <span className="text-red-800 font-semibold text-sm">탈퇴 시 주의사항</span>
            </div>
            <ul className="list-disc list-inside text-xs text-red-700 space-y-1.5 ml-1">
              <li>모든 계정 정보가 영구적으로 삭제됩니다</li>
              <li>근무 기록 및 급여 정보가 모두 삭제됩니다</li>
              <li>삭제된 정보는 복구할 수 없습니다</li>
            </ul>
          </div>

          {/* 입력 폼 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-[#dc0000] hover:bg-[#b90000] text-white font-bold py-3.5 rounded-lg transition-colors text-sm mt-4 shadow-sm active:scale-[0.98] transform"
            >
              회원탈퇴
            </button>
          </form>
        </div>

        {/* 우측 하단 도움말 버튼 */}
        {/* 아이콘 내부에서 이미 색상/스타일 처리가 되어있으므로 size만 조절 */}
        <button className="fixed bottom-6 right-6 hover:scale-105 transition-transform" aria-label="Help">
          <div className="bg-gray-900 rounded-full p-2 shadow-lg">
            <HelpIcon size={24} />
          </div>
        </button>

      </div>
    </>
  );
};

export default WithdrawForm;