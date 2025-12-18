import React from 'react';

// React.SVGProps를 상속받아 onClick, style 등 기본 SVG 속성 지원
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

// 1. props 인자에 ...props 추가
const ArrowLeftIcon = ({ size = 24, className, ...props }: IconProps) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props} // 2. 여기서 안전하게 전달
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
};

export default ArrowLeftIcon;