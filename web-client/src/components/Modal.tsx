import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal= ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* 1. 어두운 배경 오버레이 (클릭 시 닫힘) */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* 2. 모달 창 컨테이너 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 pointer-events-auto relative animate-fadeIn">
          
          {/* 모달 헤더 (타이틀 & 닫기 버튼) */}
          <div className="flex justify-between items-center mb-6">
            {/* 타이틀이 있을 때만 렌더링 */}
            <h2 className="text-xl font-bold text-gray-900">{title || ''}</h2>
            
            <button
              onClick={onClose}
              className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 모달 내부 컨텐츠 (children으로 받음) */}
          {children}
          
        </div>
      </div>
    </>
  );
};

export default Modal;