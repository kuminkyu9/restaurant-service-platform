import React from 'react';
import { View, Text, Button } from 'react-native';
// 1. 필요한 타입 임포트
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';

// 3. HomeScreen의 Props 타입 정의 (NativeStackScreenProps 사용)
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// 4. Props 타입을 컴포넌트에 적용
const HomeScreen = ({ navigation }: Props) => {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>📝 오늘의 할 일</Text>
      <Button
        title="할 일 상세 보기"
        onPress={() =>
          navigation.navigate('Detail', {
            id: 1,
            title: 'React Native 공부하기',
          })
        }
      />
    </View>
  );
};

export default HomeScreen;
