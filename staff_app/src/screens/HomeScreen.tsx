import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// 메뉴 카드 컴포넌트
const MenuCard = ({ 
  iconName, 
  iconColor, 
  iconBgColor, 
  title, 
  subtitle, 
  onPress 
}: { 
  iconName: keyof typeof Ionicons.glyphMap; 
  iconColor: string; 
  iconBgColor: string; 
  title: string; 
  subtitle: string; 
  onPress?: () => void;
}) => (
  <TouchableOpacity 
    onPress={onPress} 
    activeOpacity={0.7}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#F0F0F0',
      // 그림자 효과
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 5,
    }}
  >
    <View style={{
      width: 44,
      height: 44,
      borderRadius: 10,
      backgroundColor: iconBgColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    }}>
      <Ionicons name={iconName} size={24} color={iconColor} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 2 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 13, color: '#888' }}>
        {subtitle}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
  </TouchableOpacity>
);

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        
        {/* 1. 상단 헤더 */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: '#FFFFFF',
        }}>
          {/* 왼쪽: 로고 및 앱 이름 */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 36,
              height: 36,
              backgroundColor: '#FF6B00',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}>
              <Ionicons name="storefront" size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>근무 관리</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>스태프 대시보드</Text>
            </View>
          </View>
          
          {/* 오른쪽: 사용자 정보 */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>김민수</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>홀 서빙</Text>
            </View>
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#2962FF',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>김</Text>
            </View>
          </View>
        </View>

        {/* 구분선 */}
        <View style={{ height: 1, backgroundColor: '#E0E0E0' }} />

        {/* 2. 근무 중인 식당 카드 */}
        <View style={{
          backgroundColor: '#FFFFFF',
          margin: 20,
          padding: 20,
          borderRadius: 16,
          // 그림자 효과
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        }}>
          {/* 카드 헤더 */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 15, color: '#333', fontWeight: '500' }}>근무 중인 식당</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#E8F5E9',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#00C853', marginRight: 6 }} />
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#00C853' }}>근무 중</Text>
            </View>
          </View>

          {/* 식당 정보 */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{
              width: 50,
              height: 50,
              backgroundColor: '#FFF3E0',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 15,
            }}>
              <Ionicons name="restaurant-outline" size={28} color="#E65100" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
                맛있는 한식당
              </Text>
              
              {/* 상세 정보 행들 */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={{ fontSize: 13, color: '#666', marginLeft: 6 }}>서울시 강남구 테헤란로 123</Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons name="call-outline" size={14} color="#666" />
                <Text style={{ fontSize: 13, color: '#666', marginLeft: 6 }}>02-1234-5678</Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="person-outline" size={14} color="#666" />
                <Text style={{ fontSize: 13, color: '#666', marginLeft: 6 }}>매니저: 박매니저</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3. 하단 메뉴 리스트 */}
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          <MenuCard 
            iconName="time-outline" 
            iconColor="#2962FF" 
            iconBgColor="#E3F2FD" 
            title="출퇴근 기록" 
            subtitle="근무 시간 관리"
            onPress={() => console.log('출퇴근 클릭')}
          />
          
          <MenuCard 
            iconName="calendar-outline" 
            iconColor="#00C853" 
            iconBgColor="#E8F5E9" 
            title="근무 일정" 
            subtitle="스케줄 확인"
            onPress={() => console.log('일정 클릭')}
          />
          
          <MenuCard 
            iconName="cash-outline" 
            iconColor="#AA00FF" 
            iconBgColor="#F3E5F5" 
            title="급여 정보" 
            subtitle="급여 내역 조회"
            onPress={() => console.log('급여 클릭')}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
