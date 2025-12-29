import React from 'react';
import { View, Text } from 'react-native';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

/* 
  Custom Toast 설정 
  - 반투명 검정 배경
  - 둥근 모서리 (Capsule 형태)
  - 심플한 텍스트
*/

export const toastConfig: ToastConfig = {
  // 성공 메시지 (커스텀)
  success: ({ text1, text2 }) => (
    <View style={{
      height: 40,
      // height: 48,
      // width: '80%', // 좌우 여백 줌
      backgroundColor: 'rgba(30, 30, 30, 0.7)', // 반투명 진한 검정
      borderRadius: 24, // 완전 둥글게 (캡슐형)
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      
      // 그림자 (살짝 띄운 느낌)
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    }}>
      <Text style={{ 
        color: '#FFFFFF', 
        fontSize: 14, 
        fontWeight: '600' 
      }}>
        {text1}
      </Text>
      {text2 ? (
        <Text style={{ color: '#E0E0E0', fontSize: 13, marginLeft: 8 }}>
          {text2}
        </Text>
      ) : null}
    </View>
  ),

  // 에러 메시지 (커스텀)
  error: ({ text1, text2 }) => (
    <View style={{
      height: 40,
      // height: 48,
      // width: '80%',
      backgroundColor: 'rgba(211, 47, 47, 0.7)', // 반투명 빨강
      borderRadius: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    }}>
      <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>⚠️ {text1}</Text>
      {text2 ? <Text style={{ color: '#FFEBEE', fontSize: 13, marginLeft: 8 }}>{text2}</Text> : null}
    </View>
  ),
};
