import React from 'react';
import { View, Text } from 'react-native';
// 1. 타입 임포트
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';


// 3. DetailScreen의 Props 타입 정의
type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

// 4. Props 타입 적용
const DetailScreen = ({ route }: Props) => {
  // 이제 route.params.id와 route.params.title의 타입을 TS가 알고 있습니다.
  const { id, title } = route.params;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>할 일 번호: {id}</Text>
      <Text style={{ fontSize: 18, marginTop: 10 }}>제목: {title}</Text>
    </View>
  );
};

export default DetailScreen;
