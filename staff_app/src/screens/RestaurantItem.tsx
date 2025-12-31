import React, { useCallback, useRef } from 'react'; // useRef, useCallback 추가
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { DisplayRestaurant } from '@/screens/HomeScreen'

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  role: string;
  isWorking: boolean;
}

interface RestaurantItemProps {
  item: DisplayRestaurant;
  onPress: () => void;
}

const RestaurantItem = ({ item, onPress }: RestaurantItemProps) => {
  // 마지막 클릭 시간을 저장할 변수 (렌더링에 영향을 주지 않음)
  const lastClickTime = useRef<number>(0);

  // 연타 방지 핸들러
  const handlePress = useCallback(() => {
    const now = Date.now();
    // 마지막 클릭 후 1초(1000ms)가 지나지 않았으면 실행 방지
    if (now - lastClickTime.current < 1000) {
      return;
    }
    lastClickTime.current = now;
    onPress();
  }, [onPress]);

  return (
    <TouchableOpacity
      onPress={handlePress} // handlePress로 변경
      activeOpacity={0.7}
      style={{
        backgroundColor: '#FFFFFF',
        marginBottom: 15,
        padding: 20,
        borderRadius: 16,
        borderWidth: item.isWorking ? 1.5 : 0,
        borderColor: item.isWorking ? '#00C853' : 'transparent',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      }}
    >
      <View>
        {/* 카드 헤더 */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
          <Text style={{ fontSize: 15, color: '#333', fontWeight: '500' }}>나의 근무지</Text>
          {item.isWorking && (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#00C853', marginRight: 6 }} />
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#00C853' }}>출근 중</Text>
            </View>
          )}
        </View>

        {/* 식당 정보 */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ width: 50, height: 50, backgroundColor: '#FFF3E0', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
            <Ionicons name="restaurant-outline" size={28} color="#E65100" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>{item.restaurantName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={{ fontSize: 13, color: '#666', marginLeft: 6 }}>{item.restaurantAddress}</Text>
            </View>
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="call-outline" size={14} color="#666" />
              <Text style={{ fontSize: 13, color: '#666', marginLeft: 6 }}>{item.phone}</Text>
            </View> */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="cash-outline" size={14} color="#666" />
              <Text style={{ fontSize: 13, color: '#666', marginLeft: 6 }}>시급: {item.hourlyWage}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="person-outline" size={14} color="#666" />
              <Text style={{ fontSize: 13, color: '#666', marginLeft: 6 }}>담당: {item.role}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={{ fontSize: 13, color: '#666', marginLeft: 6 }}>근무시간: {item.startWorkTime} ~ {item.endWorkTime}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantItem;
