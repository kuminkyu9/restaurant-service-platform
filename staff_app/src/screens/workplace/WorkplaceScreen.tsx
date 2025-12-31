import React, { useState, useEffect, useCallback } from 'react';
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

import { employmentApi, type OrderItem } from '@/api/employment';
import Toast from 'react-native-toast-message';

import { useSocketService } from '@/hooks/useSocketService';

type Props = NativeStackScreenProps<RootStackParamList, 'Workplace'>;

const WorkplaceScreen = ({ navigation }: Props) => {
  const route = useRoute();
  const { restaurantId, restaurantName, startWorkTime, endWorkTime, isWorking: initialIsWorking  } = route.params as any;

  const [activeTab, setActiveTab] = useState<'PROGRESS' | 'COMPLETED'>('PROGRESS');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('PENDING');

  const [isWorking, setIsWorking] = useState(initialIsWorking); // 근무 상태 (API 연동 시 초기값 설정 필요)

  const [restaurantOrders, setRestaurantOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchWorkLogs = useCallback(async (tabStatus: 'PROGRESS' | 'COMPLETED') => { // active: 요청진행, finished: 요청완료
    try {
      setIsLoading(true);
      const orderStatus = tabStatus == 'PROGRESS' ? 'active' : 'finished'
      const response = await employmentApi.getRestaurantOrders(restaurantId, orderStatus);
      if (response.success) {
        setRestaurantOrders(response.data);
        console.log('해당 식당 주문 정보 가져오기');
      } else {
        console.warn('식당 주문 정보 불러오기 실패:', response.message);
      }
    } catch (e) {
      console.error('API Error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);
  
  const handleNewOrder = useCallback(() => {
    // 현재 보고 있는 탭이 '진행 중(PROGRESS)'일 때만 새로고침하는 게 자연스러움
    if (activeTab === 'PROGRESS') {
      fetchWorkLogs('PROGRESS');
    }
  }, [activeTab, fetchWorkLogs]); 
  // isWorking 값 바뀔때마다. 출근이면 socket연결, 퇴근이면 끊음
  useSocketService(restaurantId, isWorking, handleNewOrder); 
  
  const handleWorkToggle = async () => {
    // TODO: 출퇴근 API 호출 로직
    const nextState = !isWorking;
    console.log(nextState ? '출근 처리' : '퇴근 처리');
    try {
      // setIsLoading(true);
      const response = await employmentApi.toggleWorkStatus(restaurantId, isWorking ? "END" : "START"); 
      if (response.success) {
        setIsWorking(nextState);
        
        Toast.show({
          type: 'success', // 'success' | 'error' | 'info'
          text1: `${nextState ? '출근' : '퇴근'} 완료`,
          position: 'bottom', // 'top' | 'bottom'
          visibilityTime: 2000, // 2초 뒤 사라짐
          bottomOffset: 100,
        });
      }
    } catch (error) {
      console.error(`${isWorking ? "퇴근" : "출근"}처리 실패: `, error);
    } finally {
      // setIsLoading(false);
    }
  };

  const openStatusModal = (order: OrderItem) => {
  // const openStatusModal = (order: Order) => {
    if(order.status == 'CANCELED' || order.status == 'COMPLETED') return; // 완료된 요청건은 상태 변경 못함
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setModalVisible(true);
  };

  const handleStatusChange = async () => {
    if(selectedOrder?.status == selectedStatus) {  // 같은 상태 값일 경우 api 사용 안되게
      setModalVisible(false);
      Toast.show({
        type: 'error', // 'success' | 'error' | 'info'
        text1: '다른 값을 선택해주세요',
        position: 'bottom', // 'top' | 'bottom'
        visibilityTime: 2000, // 2초 뒤 사라짐
        bottomOffset: 100,
      });
      return;
    }
    console.log(`${restaurantId} 변경: ${selectedOrder?.id} -> ${selectedStatus}`);

    try {
      if(selectedOrder == null) return; 
      // setIsLoading(true);
      const data = {status: selectedStatus};
      const response = await employmentApi.patchRestaurantOrderStatus(restaurantId, selectedOrder?.id, data);
      if (response.success) {
        // 성공 시 로컬 리스트 상태 업데이트
        setRestaurantOrders((prevOrders) => {
          // 상태가 바뀌었으므로 리스트에서 해당 주문을 찾아서 status만 변경
          // (만약 '완료' 탭으로 보내야 하는 로직이라면 filter로 제거해야 함)
          if (activeTab === 'PROGRESS' && (selectedStatus === 'COMPLETED' || selectedStatus === 'CANCELED')) {
            // [진행중 탭]에서 [완료/취소]로 바꿨다면 -> 목록에서 제거
            return prevOrders.filter(order => order.id !== selectedOrder.id);
          } 
          else if (activeTab === 'COMPLETED' && (selectedStatus !== 'COMPLETED' && selectedStatus !== 'CANCELED')) {
             // [완료 탭]에서 [진행중]으로 되돌렸다면 -> 목록에서 제거
            return prevOrders.filter(order => order.id !== selectedOrder.id);
          }else {
            // 같은 탭 내에서 상태만 변경 (예: 대기 -> 조리중)
            return prevOrders.map(order => 
              order.id === selectedOrder.id 
              ? { ...order, status: selectedStatus } // 상태만 교체
              : order
            );
          }
        });

        Toast.show({
          type: 'success', // 'success' | 'error' | 'info'
          text1: `${selectedStatus == 'PENDING' ? '접수대기' 
            : selectedStatus == 'COOKING' ? '조리중'
            : selectedStatus == 'SERVED' ? '서빙중'
            : selectedStatus == 'COMPLETED' ? '완료'
            : '취소'
          } 완료`,
          position: 'bottom', // 'top' | 'bottom'
          visibilityTime: 2000, // 2초 뒤 사라짐
          bottomOffset: 100,
        });
      } else {
        console.warn('상태값 변경 실패:', response.message);
      }
    } catch (e) {
      console.error('API Error:', e);
    } finally {
      // setIsLoading(false);
      setModalVisible(false);
    }
  };

  

  // 마운트시 최초 1회
  useEffect(() => {
    fetchWorkLogs(activeTab);
  }, [activeTab]);  // activeTab 변경될 때마다 실행

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
        data={restaurantOrders}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <OrderItemCard 
            item={item} 
            onStatusChange={openStatusModal} 
            isWorking={isWorking} // 출근중일경우에만 테이블 주문 상태 변경 할 수 있게
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
