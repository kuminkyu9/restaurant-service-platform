import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Cog, X, UserPlus, Edit2, Users, DollarSign, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import type { Employment } from '@restaurant/shared-types/restaurant'; 
import { isEmpty } from '@restaurant/shared-types/utils';
import { useMyEmployment, useAddEmployment, useEditEmployment, useDeleteEmployment } from '@/hooks/queries/useEmployment';
import Spinner from '../Spinner';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: number;
}

// 폼 데이터 타입 정의
export interface StaffFormData {
  email: string;
  hourlyWage: number;
  startWorkTime: string;
  endWorkTime: string;
  isManager: boolean;
}
export default function StaffModal({ isOpen, onClose, restaurantId }: StaffModalProps) {
  const { data: employmentList = [], isLoading } = useMyEmployment(restaurantId);
  const { mutate: handleAddEmployment, isPending: isAddEmploymentPending } = useAddEmployment(restaurantId);
  const { mutate: handleEditEmployment, isPending: isEditEmploymentPending } = useEditEmployment();
  const { mutate: handleDeleteEmployment} = useDeleteEmployment(restaurantId);
  // const { mutate: handleDeleteEmployment, isPending: isDeleteEmploymentPending } = useDeleteEmployment(restaurantId);

  const [activeTab, setActiveTab] = useState<'current' | 'hire'>('current');
  const [editingId, setEditingId] = useState<number | null>(null);  // employmentId

  // React Hook Form 설정
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    reset,
    formState: { errors } 
  } = useForm<StaffFormData>({
    defaultValues: {
      isManager: false, // 기본값 설정
    },
    mode: 'onSubmit' // 제출 시 검증 실행
  });

  // 커스텀 토글 UI 상태 동기화를 위해 값 관찰
  // eslint-disable-next-line react-hooks/incompatible-library
  const isManager = watch('isManager');

  // 폼 제출 핸들러
  const onSubmit: SubmitHandler<StaffFormData> = (data: StaffFormData) => {
    console.log('제출된 데이터:', data);
    // alert(`스태프 등록 완료!\n${JSON.stringify(data, null, 2)}`);
    
    if(editingId) {
      handleEditEmployment({
        restaurantId: restaurantId,
        employmentId: editingId,
        data: {
          hourlyWage: data.hourlyWage,
          startWorkTime: data.startWorkTime,
          endWorkTime: data.endWorkTime,
          isManager: data.isManager,
        }
      });
      setEditingId(null);
    }else {
      handleAddEmployment(data);
    }
    reset(); // 폼 초기화
    setActiveTab('current');
    // onClose(); // 모달 닫기
  };

  const editStaff = (data: Employment) => {
    console.log(data);
    console.log('시급, 근무시간 수정 가능');
    setEditingId(data.id);

    setValue('email', data.staff.email); // 이메일은 보통 읽기 전용으로 두지만, 폼에는 채워줌
    setValue('hourlyWage', data.hourlyWage);
    setValue('startWorkTime', data.startWorkTime);
    setValue('endWorkTime', data.endWorkTime);
    setValue('isManager', data.isManager);
    // 고용 추가 탭 재활용 하기!
    setActiveTab('hire');
    // setStaffEditMode(false);
  }
  
  const delStaff = (data: Employment) => {
    console.log(data);
    console.log('해당 스태프 해고!');
    handleDeleteEmployment(data.id);
  }

  const close = () => {
    setEditingId(null);
    reset(); // 폼 초기화
    setActiveTab('current');
    onClose();
  }

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 블러 및 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        // className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={close}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative z-10 w-full max-w-[500px] bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
            <UserPlus className="w-5 h-5 text-orange-500" />
            맛있는 한식당 - 스태프 관리
          </h2>
          <button 
            onClick={close}
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className="px-6 py-4">
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setActiveTab('current')}
              className={`cursor-pointer flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2
                ${activeTab === 'current' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Users className="w-4 h-4" />
              현재 고용
            </button>
            <button
              onClick={() => setActiveTab('hire')}
              className={`cursor-pointer flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2
                ${activeTab === 'hire' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              {
                editingId ? (
                  <><Edit2 className="w-4 h-4" /> 수정하기</>
                ) : (
                  <><UserPlus className="w-4 h-4" />고용하기</>
                )
              }
            </button>
          </div>
        </div>

        {/* 컨텐츠 본문 */}
        <div className="px-6 pb-6">
          {activeTab === 'current' ? (
            // 탭 1: 현재 고용 (변경 없음)
            isLoading ? (
              <div className="border border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center h-[400px] bg-gray-50/50">
                <Spinner />
              </div>
            ) : !isEmpty(employmentList) ? (
              <div className="flex flex-col gap-4 w-full h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {employmentList.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="pt-4 px-4 pb-2 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-800">이름: {item.staff.name}</div>
                      <div className="text-sm text-gray-500">시급: {item.hourlyWage.toLocaleString()}원</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400 mt-1">
                        근무 시간: {item.startWorkTime} ~ {item.endWorkTime}
                      </div>
                      <div>
                        <button onClick={() => editStaff(item)} className="mr-2 cursor-pointer text-gray-400 hover:text-blue-300 p-2 rounded-full hover:bg-blue-50 transition-colors">
                          <Cog className="h-5 w-5" />
                        </button>
                        <button onClick={() => delStaff(item)} className="cursor-pointer text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center h-[400px] bg-gray-50/50">
                <div className="w-16 h-16 bg-white border border-gray-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Users className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 mb-6 text-center font-medium">현재 고용된 스태프가 없습니다.</p>
                <button 
                  onClick={() => setActiveTab('hire')}
                  className="cursor-pointer px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                  스태프 고용하러 가기
                </button>
              </div>
            )
          ) : (
            // 탭 2: 고용하기 폼 (react-hook-form 적용)
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* 이메일 입력 */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  스태프 이메일 <span className="text-orange-500">*{editingId ? '이메일은 수정 불가!' : ''}</span>
                </label>
                <input 
                  type="email"
                  disabled={!!editingId}  
                  placeholder="staff@example.com"
                  {...register('email', { 
                    required: '이메일을 입력해주세요.',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "유효한 이메일 주소를 입력해주세요."
                    }
                  })}
                  className={`w-full px-4 py-3 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-lg transition-all outline-none text-sm
                    ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email.message}
                  </p>
                )}
              </div>

              {/* 시급 입력 */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  시급 (원) <DollarSign className="w-3 h-3 text-gray-400" /> <span className="text-orange-500">*</span>
                </label>
                <input 
                  type="number" 
                  placeholder="10030"
                  {...register('hourlyWage', { 
                    required: '시급을 입력해주세요.',
                    min: { 
                      value: 10030, 
                      message: '2025년 최저시급(10,030원)보다 적을 수 없습니다.' 
                    }
                  })}
                  className={`w-full px-4 py-3 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-lg transition-all outline-none text-sm
                    ${errors.hourlyWage ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
                />
                {errors.hourlyWage && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.hourlyWage.message}
                  </p>
                )}
              </div>

              {/* 근무 시간 (시작 - 종료) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    출근 시간 <Clock className="w-3 h-3 text-gray-400" /> <span className="text-orange-500">*</span>
                  </label>
                  <input 
                    type="time" 
                    {...register('startWorkTime', { required: '출근 시간을 선택해주세요.' })}
                    className={`w-full px-4 py-3 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-lg transition-all outline-none text-sm
                      ${errors.startWorkTime ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
                  />
                  {errors.startWorkTime && (
                    <p className="text-xs text-red-500 mt-1">{errors.startWorkTime.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    퇴근 시간 <Clock className="w-3 h-3 text-gray-400" /> <span className="text-orange-500">*</span>
                  </label>
                  <input 
                    type="time" 
                    {...register('endWorkTime', { required: '퇴근 시간을 선택해주세요.' })}
                    className={`w-full px-4 py-3 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-lg transition-all outline-none text-sm
                      ${errors.endWorkTime ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
                  />
                  {errors.endWorkTime && (
                    <p className="text-xs text-red-500 mt-1">{errors.endWorkTime.message}</p>
                  )}
                </div>
              </div>

              {/* 매니저 여부 (Boolean 토글) */}
              {/* register를 사용하지 않고 setValue로 커스텀 핸들링 */}
              <div 
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all 
                  ${isManager ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-white'}`}
                onClick={() => setValue('isManager', !isManager)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isManager ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${isManager ? 'text-orange-900' : 'text-gray-700'}`}>매니저 권한 부여</span>
                    <span className="text-xs text-gray-500">매장 설정 및 스태프 관리 권한이 부여됩니다.</span>
                  </div>
                </div>
                {/* 토글 스위치 비주얼 */}
                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${isManager ? 'bg-orange-500' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${isManager ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* 하단 버튼 그룹 */}
              <div className="flex gap-3 mt-4 pt-2">
                <button 
                  type="submit"
                  disabled={isAddEmploymentPending}
                  className="cursor-pointer flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-200 active:scale-[0.98]"
                > 
                  {editingId ? <Edit2 className="w-4 h-4" /> : <UserPlus className="w-5 h-5" />}
                  {
                    editingId ? (isEditEmploymentPending ? '수정중...': '스태프 수정하기')
                    : (isAddEmploymentPending ? '등록중...' : '스태프 등록하기')
                  }
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if(editingId) {
                      setEditingId(null);
                      reset();
                    }else{
                      reset();
                    }
                  }}
                  className="cursor-pointer px-6 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                >
                  {editingId ? '고용' : '초기화'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
