import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { employmentApi } from '@/api/employment';

// 화면에서 사용할 타입 정의 (API 응답 타입과 동일하게 사용하거나 매핑)
interface WorkLogDisplayItem {
  id: number;
  restaurantName: string;
  workDate: string;
  startTime: string;
  endTime: string | null;
  hourlyWage: number;
  note: string | null;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Worklog'>;

const WorklogScreen = ({ navigation }: Props) => {
  const [logs, setLogs] = useState<WorkLogDisplayItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
  };

  const calculateDuration = (start: string, end: string | null) => {
    if (!end) return '진행 중';
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}시간 ${mins}분`;
  };

  const calculatePay = (start: string, end: string | null, wage: number) => {
    if (!end) return '0';
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const hours = diffMs / (1000 * 60 * 60);
    return Math.floor(hours * wage).toLocaleString();
  };

  const fetchWorkLogs = async () => {
    try {
      setIsLoading(true);
      const response = await employmentApi.getWorkLogs();
      
      if (response.success) {
        // API의 logs 데이터를 화면 상태에 저장
        setLogs(response.data.logs);
      } else {
        console.warn('근무 기록 불러오기 실패:', response.message);
      }
    } catch (e) {
      console.error('API Error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkLogs();
  }, []);

  const renderLogItem = ({ item }: { item: WorkLogDisplayItem }) => {
    const isWorking = !item.endTime;
    
    return (
      <View style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        borderLeftWidth: 5,
        borderLeftColor: isWorking ? '#4CAF50' : '#E0E0E0', 
      }}>
        {/* 상단: 식당 이름 & 날짜 */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{item.restaurantName}</Text>
            <Text style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{formatDate(item.workDate)}</Text>
          </View>
          {isWorking ? (
            <View style={{ backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: 12 }}>근무 중 🔥</Text>
            </View>
          ) : (
            <View style={{ backgroundColor: '#F5F5F5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ color: '#666', fontSize: 12 }}>완료</Text>
            </View>
          )}
        </View>

        <View style={{ height: 1, backgroundColor: '#F0F0F0', marginBottom: 12 }} />

        {/* 하단: 시간 정보 */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="time-outline" size={16} color="#666" style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 14, color: '#444' }}>
                {formatTime(item.startTime)} ~ {item.endTime ? formatTime(item.endTime) : '...'}
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: '#888', marginLeft: 22 }}>
              총 {calculateDuration(item.startTime, item.endTime)}
            </Text>
          </View>

          {/* 예상 급여 */}
          {!isWorking && (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 11, color: '#888' }}>예상 급여</Text>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#333' }}>
                {calculatePay(item.startTime, item.endTime, item.hourlyWage)}원
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // ... (return 부분은 기존 UI 그대로 사용) ...
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 헤더 */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderBottomColor: '#E0E0E0'
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>근무 기록</Text>
        <View style={{ width: 32 }} /> 
      </View>

      {/* 리스트 */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF6B00" />
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLogItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Ionicons name="document-text-outline" size={48} color="#CCC" />
              <Text style={{ color: '#999', fontSize: 16, marginTop: 12 }}>아직 근무 기록이 없습니다.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default WorklogScreen;
