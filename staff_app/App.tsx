import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { StatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RootStack from '@/navigation/RootStack';
import { AuthProvider } from '@/contexts/AuthContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/utils/toastConfig'; 

export default function App() {
  return (
    <AuthProvider>
      <StatusBar 
        hidden={false} 
        // barStyle="dark-content" // 글자색: 검정(light-content는 흰색)
        backgroundColor="transparent" // 안드로이드 배경색 설정
        translucent={true} // 안드로이드에서 앱 영역이 상태바까지 확장되게 설정
      />
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>

      <Toast config={toastConfig} />
    </AuthProvider>
  );
}
