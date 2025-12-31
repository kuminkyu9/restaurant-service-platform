import React, { useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'primary';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "확인",
  message = "정말로 진행하시겠습니까?",
  confirmText = "확인",
  cancelText = "취소",
  type = 'danger'
}) => {
  // ESC 키를 누르면 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const confirmBtnColor = 
    type === 'danger' 
      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
    {/* <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4"> */}
      {/* 모달 컨테이너 */}
      <div 
        className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 컨텐츠 영역 */}
        <div className="bg-white px-6 py-6">
          <div className="flex items-center">
            {type === 'danger' && (
              <div className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold leading-6 text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-500">{message}</p>
            </div>
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex justify-end gap-3 bg-gray-50 px-6 py-4">
          <button
            type="button"
            className="cursor-pointer inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`cursor-pointer inline-flex justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmBtnColor}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
      
      {/* 배경 클릭 시 닫기 */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
};

export default ConfirmModal;
