import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { type OrderItem } from '@/api/employment'
import Toast from 'react-native-toast-message';

// 필요한 타입 재정의 (또는 types 파일에서 import)
export type OrderStatus = 'PENDING' | 'COOKING' | 'SERVED' | 'COMPLETED' | 'CANCELED';

interface OrderItemDetail {
  name: string;
  quantity: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItemDetail[];
  orderTime: string;
  status: OrderStatus;
}

interface OrderItemCardProps {
  item: OrderItem;
  onStatusChange: (item: OrderItem) => void;
  isWorking: boolean;
  // item: Order;
  // onStatusChange: (item: Order) => void;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: '접수대기',
  COOKING: '조리중',
  SERVED: '서빙중',
  COMPLETED: '완료',
  CANCELED: '취소',
};

const getStatusBadgeStyle = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING': return { backgroundColor: '#FFF3E0', color: '#FF9800' };
    case 'COOKING': return { backgroundColor: '#E3F2FD', color: '#2196F3' };
    case 'SERVED': return { backgroundColor: '#E8F5E9', color: '#4CAF50' };
    case 'CANCELED': return { backgroundColor: '#FFEBEE', color: '#F44336' };
    default: return { backgroundColor: '#F5F5F5', color: '#9E9E9E' };
  }
};

const OrderItemCard = ({ item, onStatusChange, isWorking }: OrderItemCardProps) => {
  const badgeStyle = getStatusBadgeStyle(item.status);
  const formatOrderTime = (orderTimeStr: string) => {
    if (!orderTimeStr) return '';
    try {
      const now = new Date();
      const todayStr = `${now.getMonth() + 1}월 ${now.getDate()}일`;
      // 입력받은 문자열에서 날짜와 시간 분리
      const parts = orderTimeStr.split(' ');
      const datePart = `${parts[0]} ${parts[1]}`; // "12월 25일"
      const timePart = `${parts[2]} ${parts[3]}`; // "오후 11:08"
      // 오늘 날짜와 비교
      if (datePart === todayStr) return `오늘 ${timePart}`;
      return orderTimeStr; // 오늘이 아니면 원래 문자열(12월 25일 오후 11:08) 그대로 반환
    } catch (e) {
      return orderTimeStr; // 파싱 에러 시 원본 반환
    }
  };

  return (
    <View style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }}>
      {/* 카드 헤더: 테이블번호 + 상태뱃지 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <View style={{ backgroundColor: '#333', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>{item.tableNumber}번 테이블</Text>
        </View>
        <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: badgeStyle.backgroundColor }}>
          <Text style={{ fontWeight: 'bold', fontSize: 12, color: badgeStyle.color }}>
            {STATUS_LABELS[item.status]}
          </Text>
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: '#F0F0F0', marginBottom: 12 }} />

      {/* 메뉴 리스트 */}
      <View style={{ marginBottom: 12 }}>
        {item.items.map((menu, idx) => (
          <Text key={idx} style={{ fontSize: 16, color: '#333', marginBottom: 4, lineHeight: 22 }}>
            • {menu.name} <Text style={{ color: '#FF6B00', fontWeight: 'bold' }}>x{menu.quantity}</Text>
          </Text>
        ))}
      </View>

      {/* 카드 푸터: 시간 + 버튼 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <Text style={{ fontSize: 12, color: '#888' }}>요청 시간: {formatOrderTime(item.orderTime)}</Text>
        
        {
          // 완료건도 테스트 간편하게 하고 싶으면 주석하면댐
          item.status == 'COMPLETED' || item.status == 'CANCELED' ? <View /> 
          : <TouchableOpacity 
            onPress={() => {
              if(!isWorking) {
                Toast.show({
                  type: 'error', // 'success' | 'error' | 'info'
                  text1: '출근한 후 변경 가능해요',
                  position: 'bottom', // 'top' | 'bottom'
                  visibilityTime: 2000, // 2초 뒤 사라짐
                  bottomOffset: 100,
                });
                return;
              }
              onStatusChange(item);
            }}
            style={{
              backgroundColor: '#F5F5F5',
              paddingHorizontal: 12, paddingVertical: 8,
              borderRadius: 6,
              borderWidth: 1, borderColor: '#E0E0E0',
            }}
          >
            <Text style={{ fontSize: 13, color: '#333', fontWeight: '600' }}>상태 변경</Text>
          </TouchableOpacity>
        }
      </View>
    </View>
  );
};

export default React.memo(OrderItemCard);
