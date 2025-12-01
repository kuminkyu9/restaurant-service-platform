import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const OwnerLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    console.log('login');

    // 임시 로그인 및 화면이동
    navigate('/owner/main');
  }

  return (
    <>
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm w-full max-w-md p-8">
          {/* Logo Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center text-xl font-semibold text-gray-900 mb-2">
            관리자 로그인
          </h1>

          {/* Subtitle */}
          <p className="text-center text-sm text-gray-500 mb-8">
            근무 관리 시스템에 오신 것을 환영합니다
          </p>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>

          {/* Login Button */}
          <button onClick={() => login()} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-6">
            로그인
          </button>

          {/* Demo Account Info */}
          <div className="text-center">
            <p className="text-xs text-gray-400">
              데모 계정: <span className="text-gray-600">demo@example.com</span> / <span className="text-gray-600">password123</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerLogin; // 보통 default export를 많이 사용합니다.
