'use client';
import { useForm } from 'react-hook-form';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 폼 데이터 타입 정의
interface RegistrationFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm = () => {
  const navigate = useNavigate();

  const { register, handleSubmit,  getValues, formState: { errors } } = useForm<RegistrationFormValues>();

  const onSubmit = (data: RegistrationFormValues) => {
    console.log('Form Submitted:', data);
    // 실제 회원가입 로직 구현
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* 헤더 섹션 */}
        <div className="flex items-center mb-6">
          <button onClick={() =>navigate(-1)} className="cursor-pointer text-gray-400 hover:text-gray-600">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* 로고 및 제목 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-orange-500 rounded-lg">
            {/* 로고 아이콘 자리 (이미지에 있는 심볼 대체) */}
            <span className="text-white text-xl font-bold">R</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">회원가입</h1>
          <p className="text-gray-500 mt-1">새로운 계정을 만들어보세요</p>
        </div>

        {/* 폼 섹션 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 이름 입력 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input
              id="name"
              type="text"
              placeholder="이름을 입력하세요"
              {...register('name', { required: '이름은 필수 항목입니다.' })}
              className={`focus:outline-none focus:ring-1 focus:bg-white transition-all w-full px-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* 이메일 입력 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              {...register('email', {
                required: '이메일은 필수 항목입니다.',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: '유효한 이메일 주소를 입력해주세요.',
                },
              })}
              className={`focus:outline-none focus:ring-1 focus:bg-white transition-all w-full px-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            <p className="mt-1 text-xs text-gray-500">이메일은 로그인 시 아이디로 사용됩니다.</p>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              {...register('password', {
                required: '비밀번호는 필수 항목입니다.',
                minLength: {
                  value: 6,
                  message: '비밀번호는 6자 이상이어야 합니다.',
                },
              })}
              className={`focus:outline-none focus:ring-1 focus:bg-white transition-all w-full px-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {/* 비밀번호 확인 입력 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              {...register('confirmPassword', {
                required: '비밀번호 확인은 필수 항목입니다.',
                validate: (value) => value === getValues('password') || '비밀번호가 일치하지 않습니다.',
              })}
              className={`focus:outline-none focus:ring-1 focus:bg-white transition-all w-full px-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          {/* 가입하기 버튼 */}
          <button
            type="submit"
            className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            가입하기
          </button>
        </form>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?
          <span onClick={() => navigate(-1)} className="cursor-pointer text-orange-500 hover:underline ml-1 font-medium">로그인하기</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
