import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation'; // 타입 정의 파일

import LoginScreen from '@/screens/LoginScreen';
import SignupScreen from '@/screens/SignupScreen';
import HomeScreen from '@/screens/HomeScreen';
import DetailScreen from '@/screens/DetailScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();

// 라우트 설정 객체 타입 정의 (자동완성 및 타입체크용)
interface RouteConfig {
  name: keyof RootStackParamList;
  component: React.ComponentType<any>;
  options?: NativeStackNavigationOptions;
}

// 경로 설정을 배열로 관리
const routes: RouteConfig[] = [
  { 
    name: 'Login', 
    component: LoginScreen, 
    options: { headerShown: false } 
  },{ 
    name: 'Signup', 
    component: SignupScreen, 
    options: { title: '회원가입', headerBackTitle: '로그인' } 
  },{ 
    name: 'Home', 
    component: HomeScreen, 
    options: { title: '주문 목록' } 
  },{ 
    name: 'Detail', 
    component: DetailScreen,
    options: { title: '상세 정보' }
  },
];

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      {routes.map((route) => (
        <Stack.Screen 
          key={route.name} 
          name={route.name}
          component={route.component}
          options={route.options}
        />
      ))}
    </Stack.Navigator>
  );
}
