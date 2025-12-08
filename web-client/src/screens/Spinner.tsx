// Spinner.tsx
import React from 'react';

interface SpinnerProps {
  // 필요하다면 크기나 색상
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'text-blue-500' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-8',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          ${sizeClasses[size]}
          ${color}
          animate-spin
          rounded-full
          border-t-transparent
          border-solid
        `}
        role="status"
      >
        {/* 스크린 리더기를 위한 숨겨진 텍스트 */}
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
