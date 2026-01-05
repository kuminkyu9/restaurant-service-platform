// staff_app/src/hooks/useSocketService.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Vibration, Alert } from 'react-native';
import { SERVER_URL } from '@/constants/env';

// const SERVER_URL = "http://192.168.200.182:3000"; // 내 pc 
// const SERVER_URL = "http://localhost:3000"; 

export const useSocketService = (
  restaurantId: number | null, 
  isWorking: boolean,
  onNewOrderReceived?: () => void // 리스트 갱신
) => {
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    // 근무 중(isWorking)이고 식당 ID가 있을 때만 연결
    if (!isWorking || !restaurantId) {
      if (socket.current) {
        console.log('🔌 Socket disconnecting...');
        socket.current.disconnect();
        socket.current = null;
      }
      return;
    }

    // 소켓 서버 연결
    socket.current = io(SERVER_URL, {
      transports: ['websocket'], // React Native에서는 websocket 전송 방식 강제 권장
    });

    // 연결 성공 시 'joinRoom' 이벤트 발송
    socket.current.on('connect', () => {
      console.log('✅ Connected to Socket Server');
      // !서버의 index.ts에 작성한 'joinRoom' 이벤트를 여기서 호출
      socket.current?.emit('joinRoom', restaurantId);
    });

    // 'newOrder' 이벤트 수신 (서버에서 주문 들어왔다고 알림)
    socket.current.on('newOrder', (data) => {
      console.log('🔔 New Order Received:', data);
      
      // 진동 알림 (패턴: 0.5초 진동, 0.2초 쉼, 0.5초 진동)
      Vibration.vibrate([500, 200, 500]);

      // 수신시 이벤트
      if (onNewOrderReceived) onNewOrderReceived();
      
      // 알림 창 표시
      Alert.alert(
        "새로운 주문!",
        `${data.tableNumber}번 테이블에서 주문이 들어왔습니다.`,
        [{ text: "확인" }]
        // [
        //   { 
        //     text: "확인", 
        //     onPress: () => {
        //       if (onNewOrderReceived) onNewOrderReceived();
        //     } 
        //   }
        // ]
      );
    });

    // 클린업: 컴포넌트가 사라지거나 근무 종료 시 연결 해제
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [restaurantId, isWorking]); // 근무 상태나 식당 ID가 바뀌면 재실행
};
