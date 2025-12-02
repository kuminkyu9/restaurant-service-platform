export function OwnerLottgin() {
  return (
    <>
      <div className="text-orange-600">ㅇㅇ OwnerLogin1</div>
      <div className="test">OwnerLogin2</div>
      <div style={{color: 'red'}}>OwnerLogin3</div>
    </>
  )
}

// 위는 import {OwnerLottgin, } from '/주소';
// 아래는 import MainPttage from '/주소'; 
// 이렇게임 위는 여러개 가져올수 있고 컴포넌트 명 고정 as 제외 아래는 컴포넌트명 자유롭게 가능 하지만 한개

// src/pages/MainPage.tsx
const Temp = () => {
  // 여기에 state, effects, 로직을 추가 
  return (
    <>
    </>
  );
};

export default Temp; // 보통 default export를 많이 사용합니다.




// useEffect 컴포넌트가 처음 로드될 때 실행함(화면 다 그려진후 렌더링 후 ) 그래서 사용자 데이터 가져오는 코드를 보통 넣음