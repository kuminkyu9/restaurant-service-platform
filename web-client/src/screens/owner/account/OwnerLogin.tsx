import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { useForm } from 'react-hook-form'; // react-hook-form 임포트

// 폼 데이터 타입 정의
interface LoginFormValues {
  email: string;
  password: string;
}

const OwnerLogin = () => {
  const navigate = useNavigate();

  // Hook을 컴포넌트 최상단에 써야함
  const setUser = useUserStore((state) => state.setUser);
  // const user = useUserStore.getState().user; // 전역변수 지금 안써서 주석해놓음

  // useForm 훅 초기화
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();

  const signUp = () => {
    console.log('회원가입');
    navigate('/owner/register');
  }

  // 제출 핸들러 (handleSubmit이 감싸줍니다)
  const onSubmit = (data: LoginFormValues) => {
    console.log('Form Submitted:', data); // 이메일, 비밀번호가 data 객체에 담겨있음

    // 실제 로그인 API 호출 로직이 들어갈 자리
    // 예시: axios.post('/api/login', data)...

    setUser({
      id: 123,
      role: 'OWNER',
      restaurantId: 456,
      name: '테스트',
    });

    // 임시 로그인 및 화면이동
    navigate('/owner/main');
  }

  return (
    <>
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm w-full max-w-md p-8">
          {/* Title */}
          <h1 className="text-center text-xl font-semibold text-gray-900 mb-2">
            관리자 로그인
          </h1>

          {/* Subtitle */}
          <p className="text-center text-sm text-gray-500 mb-8">
            식당 관리 시스템에 오신 것을 환영합니다
          </p>

          {/* 폼 태그로 감싸고 onSubmit 핸들러 연결 */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                placeholder="이메일을 입력하세요"
                // register를 사용하여 연결하고 유효성 검사 규칙 추가
                {...register('email', {
                  required: '이메일은 필수입니다.',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: '유효한 이메일 주소를 입력해주세요.',
                  },
                })}
                // 에러 발생 시 테두리 색상 변경
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                placeholder="비밀번호를 입력하세요"
                // register를 사용하여 연결하고 유효성 검사 규칙 추가
                {...register('password', {
                    required: '비밀번호는 필수입니다.',
                    minLength: {
                        value: 6,
                        message: '비밀번호는 6자 이상이어야 합니다.'
                    }
                })}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Login Button (type="submit"으로 변경) */}
            <button type="submit" className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-8">
              로그인
            </button>
          </form>
          <hr className="text-gray-400 pb-4" />

          {/* Demo Account Info */}
          <div className="text-center">
            <p className="text-xs text-gray-400 pb-4">
              데모 계정: <span className="text-gray-600">demo@example.com</span> / <span className="text-gray-600">Demo!P@ssword123</span>
            </p>
            <p className="text-xs text-gray-400">계정이 없으신가요? <span onClick={() => signUp()} className="cursor-pointer text-base text-orange-500 hover:underline ml-1 font-medium">회원가입</span></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerLogin; // 보통 default export를 많이 사용합니다.
