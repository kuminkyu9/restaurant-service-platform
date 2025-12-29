import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

import OrderItemCard, { type Order, type OrderStatus } from '@/screens/workplace/OrderItemCard';
import StatusChangeModal from '@/screens/workplace/StatusChangeModal';
import WorkplaceFooter from '@/screens/workplace/WorkplaceFooter'; 

import { employmentApi } from '@/api/employment';

type Props = NativeStackScreenProps<RootStackParamList, 'Workplace'>;
// -------------------- 더미 데이터 --------------------
const DUMMY_ORDERS: Order[] = [
  {
    id: '1',
    tableNumber: 3,
    items: [{ name: '김치찌개', quantity: 1 }, { name: '계란말이', quantity: 1 }],
    orderTime: '12:30',
    status: 'PENDING',
  },
  {
    id: '2',
    tableNumber: 5,
    items: [{ name: '삼겹살 2인분', quantity: 1 }, { name: '공기밥', quantity: 2 }],
    orderTime: '12:35',
    status: 'COOKING',
  },
  {
    id: '3',
    tableNumber: 1,
    items: [{ name: '된장찌개', quantity: 1 }],
    orderTime: '12:10',
    status: 'COMPLETED',
  },
];

const WorkplaceScreen = ({ navigation }: Props) => {
  const route = useRoute();
  const { restaurantId, restaurantName, startWorkTime, endWorkTime, isWorking: initialIsWorking  } = route.params as any;

  const [activeTab, setActiveTab] = useState<'PROGRESS' | 'COMPLETED'>('PROGRESS');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('PENDING');

  const [isWorking, setIsWorking] = useState(initialIsWorking); // 근무 상태 (API 연동 시 초기값 설정 필요)
  const handleWorkToggle = async () => {
    // TODO: 출퇴근 API 호출 로직
    const nextState = !isWorking;
    console.log(nextState ? '출근 처리' : '퇴근 처리');
    

    try {
      // setIsLoading(true);
      const response = await employmentApi.toggleWorkStatus(restaurantId, isWorking ? "END" : "START"); 
      if (response.success) {
        setIsWorking(nextState);
      }
    } catch (error) {
      console.error(`${isWorking ? "퇴근" : "출근"}처리 실패: `, error);
    } finally {
      // setIsLoading(false);
    }
  };

  const filteredOrders = DUMMY_ORDERS.filter((order) => {
    if (activeTab === 'PROGRESS') {
      return ['PENDING', 'COOKING', 'SERVED'].includes(order.status);
    } else {
      return ['COMPLETED', 'CANCELED'].includes(order.status);
    }
  });

  const openStatusModal = (order: Order) => {
    if(order.status == 'CANCELED' || order.status == 'COMPLETED') return; // 완료된 요청건은 상태 변경 못함
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setModalVisible(true);
  };

  const handleStatusChange = () => {
    // TODO: API Call Logic Here
    console.log(`${restaurantId} 변경: ${selectedOrder?.id} -> ${selectedStatus}`);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. 헤더 */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderBottomColor: '#E0E0E0'
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>{restaurantName}</Text>
          <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 2 }}>
            근무시간 {startWorkTime} ~ {endWorkTime}
          </Text>
        </View>
        
        <View style={{ padding: 4 }}>
          <View style={{
            width: 12, height: 12, borderRadius: 6,
            backgroundColor: isWorking ? '#4CAF50' : '#BDBDBD', // 초록 or 회색
            borderWidth: 2, borderColor: '#FFFFFF', // 흰색 테두리로 깔끔하게
            elevation: 2, shadowColor: '#000', shadowOpacity: 0.1
          }} />
        </View>
      </View>

      {/* 2. 탭 바 */}
      <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF', marginBottom: 2 }}>
        <TouchableOpacity 
          style={{
            flex: 1, paddingVertical: 14, alignItems: 'center',
            borderBottomWidth: 2, borderBottomColor: activeTab === 'PROGRESS' ? '#FF6B00' : 'transparent'
          }}
          onPress={() => setActiveTab('PROGRESS')}
        >
          <Text style={{ fontSize: 15, fontWeight: '600', color: activeTab === 'PROGRESS' ? '#FF6B00' : '#888' }}>요청 진행</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{
            flex: 1, paddingVertical: 14, alignItems: 'center',
            borderBottomWidth: 2, borderBottomColor: activeTab === 'COMPLETED' ? '#FF6B00' : 'transparent'
          }}
          onPress={() => setActiveTab('COMPLETED')}
        >
          <Text style={{ fontSize: 15, fontWeight: '600', color: activeTab === 'COMPLETED' ? '#FF6B00' : '#888' }}>요청 완료</Text>
        </TouchableOpacity>
      </View>

      {/* 3. 주문 리스트 */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderItemCard 
            item={item} 
            onStatusChange={openStatusModal} 
          />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ color: '#999', fontSize: 16 }}>주문 내역이 없습니다.</Text>
          </View>
        }
      />

      {/* 4. 상태 변경 모달 (분리됨!) */}
      <StatusChangeModal
        visible={modalVisible}
        selectedOrder={selectedOrder}
        selectedStatus={selectedStatus}
        onClose={() => setModalVisible(false)}
        onStatusSelect={setSelectedStatus}
        onConfirm={handleStatusChange}
      />

      {/* 5. 접이식 출퇴근 Footer (여기에 추가!) */}
      <WorkplaceFooter 
        isWorking={isWorking} 
        onWorkToggle={handleWorkToggle} 
      />
    </SafeAreaView>
  );
};

export default WorkplaceScreen;
