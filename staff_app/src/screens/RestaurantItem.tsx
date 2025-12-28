import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { DisplayRestaurant } from '@/screens/HomeScreen'

// 타입 정의 (다른 곳에서도 쓸 수 있도록 export)
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

const RestaurantItem = ({ item, onPress }: RestaurantItemProps) => (
  

  <TouchableOpacity
    onPress={onPress}
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
    <View >
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

export default RestaurantItem;
