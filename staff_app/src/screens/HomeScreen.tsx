import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FooterScreen from '@/screens/FooterScreen';
import RestaurantItem from '@/screens/RestaurantItem';
import { restaurantApi, type MyRestaurantData } from '@/api/restaurant';
import { useAuth } from '@/contexts/AuthContext'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
export interface DisplayRestaurant extends MyRestaurantData {
  id: string;        // FlatList keyExtractor용
  isWorking: boolean;
  role: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const HomeScreen = ({ navigation }: Props) => {
  const { staff } = useAuth();

  const [restaurants, setRestaurants] = useState<DisplayRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      const response = await restaurantApi.getMyRestaurants(); 
      if (response.success) {
        // const now = new Date();
        // const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        // 데이터 가공: MyRestaurantData -> UI용 Restaurant 타입으로 변환
        const processedData = response.data.map((item) => {
          return {
            ...item, // 원본 데이터 복사
            id: item.restaurantId.toString(),
            role: item.isManager ? "매니저" : "스태프",
            // phone: "010-0000-0000", // 현재 전화번호 속성 없음
          };
        });
        setRestaurants(processedData);
      }
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // 마운트 시 최초 1회
  // useEffect(() => {
  //   fetchRestaurants();
  // }, []);
  // 화면 진입시 리로드(1초에 10회 같이 호출하는게 아니여서 부담 없을 듯) 글고 출퇴근 그것땜에 임시로 더 최적화 할 수 있긴함
  useFocusEffect(
    useCallback(() => {
      fetchRestaurants();
    }, [])
  );
  const sortedRestaurants = [...restaurants].sort((a, b) => 
    (a.isWorking === b.isWorking ? 0 : a.isWorking ? -1 : 1)
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {/* 1. 고정 헤더 */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderBottomColor: '#E0E0E0'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 36, height: 36, backgroundColor: '#FF6B00', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
            <Ionicons name="storefront" size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>근무 관리</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>스태프 대시보드</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>{staff?.name}</Text>
            {/* <Text style={{ fontSize: 12, color: '#666' }}>직원</Text> */}
          </View>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#2962FF', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>{staff?.name.slice(0,1)}</Text>
          </View>
        </View>
      </View>

      {/* 2. 가변 영역 (식당 리스트) */}
      <View style={{ flex: 1, paddingTop: 20 }}>
        {/* 리스트 헤더 텍스트 */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
            내 근무지 목록 <Text style={{ color: '#FF6B00' }}>{sortedRestaurants.length}</Text>
          </Text>
        </View>
        
        <FlatList
          data={sortedRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RestaurantItem item={item} onPress={() => {
            console.log(item);
            console.log(`해당 식당 이동`);
            navigation.push('Workplace', {
              restaurantId: item.restaurantId,
              restaurantName: item.restaurantName,
              startWorkTime: item.startWorkTime,
              endWorkTime: item.endWorkTime,
              isWorking: item.isWorking
            });
          }} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, flexGrow: 1, paddingTop: 10 }}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
              <View style={{ 
                width: 80, height: 80, borderRadius: 40, 
                backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginBottom: 16 
              }}>
                <Ionicons name="storefront-outline" size={40} color="#BDBDBD" />
              </View>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#666', marginBottom: 8 }}>
                등록된 근무지가 없습니다
              </Text>
              <Text style={{ fontSize: 14, color: '#999', textAlign: 'center' }}>
                사장님에게 초대 코드를 요청하거나{'\n'}새로운 근무지를 등록해 보세요.
              </Text>
              <TouchableOpacity 
                onPress={fetchRestaurants} // 새로고침 기능 연결
                style={{
                  marginTop: 20,
                  paddingVertical: 10, paddingHorizontal: 20,
                  backgroundColor: '#E3F2FD', borderRadius: 8
                }}
              >
                <Text style={{ color: '#2962FF', fontWeight: '600' }}>목록 새로고침</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      {/* footer 출퇴근, 일정, 급여 */}
      <FooterScreen />
    </SafeAreaView>
  );
};

export default HomeScreen;