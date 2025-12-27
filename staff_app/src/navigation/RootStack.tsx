import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation'; // 타입 정의 파일

import LoginScreen from '@/screens/LoginScreen';
import SignupScreen from '@/screens/SignupScreen';
import HomeScreen from '@/screens/HomeScreen';
import DetailScreen from '@/screens/DetailScreen';

import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator<RootStackParamList>();

// 라우트 설정 객체 타입 정의 (자동완성 및 타입체크용)
interface RouteConfig {
  name: keyof RootStackParamList;
  component: React.ComponentType<any>;
  options?: NativeStackNavigationOptions | ((props: any) => NativeStackNavigationOptions);
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
    options: { headerShown: false } 
    // options: ({ navigation }) => ({
    //   title: '근무 관리',
    //   headerLeft: () => (
    //     <Ionicons name="storefront" size={24} style={{ marginRight: 3 }} color="#FF7F50" /> 
    //   ),
    //   headerRight: () => (
    //     <TouchableOpacity 
    //       onPress={() => navigation.navigate('Profile')} 
    //       style={{ marginRight: 15 }}
    //     >
    //       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    //         <View style={{ alignItems: 'flex-end', marginRight: 6 }}>
    //           <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>김민수</Text>
    //         </View>
    //         <View style={{
    //           width: 36,
    //           height: 36,
    //           borderRadius: 18,
    //           backgroundColor: '#FF7F50',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //         }}>
    //           <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>김</Text>
    //         </View>
    //       </View>
    //     </TouchableOpacity>
    //   ),
    // }) 
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
