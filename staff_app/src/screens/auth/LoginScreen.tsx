import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { authApi } from '@/api/auth';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/contexts/AuthContext';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const { setStaff } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const handleSetTmpAccount = () => {
    setEmail('staff@naver.com');
    setPassword('staff123!@#');
  }

  const handleLogin = async () => {
    console.log('로그인 시도:', email, password);

    if (!email || !password) {
      Alert.alert('알림', '아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    // replace를 쓰면 뒤로가기 했을 때 로그인 화면으로 다시 안 돌아옴
    try {
      setLoading(true);
      const response = await authApi.login({ email, password });
      
      console.log('로그인 성공:', response);
      
      // 추후 redius refresh 추가 필요
      if (response.data.token) {
        await SecureStore.setItemAsync('accessToken', response.data.token);
      }
      if (response.data.staff) {
        setStaff(response.data.staff);
      }
      // 토큰 저장(여긴 access 와 refresh 있음 시간상 한개로 통일)
      // await SecureStore.setItemAsync('accessToken', data.accessToken);
      // if(data.refreshToken) {
      //   await SecureStore.setItemAsync('refreshToken', data.refreshToken);
      // }
      navigation.replace('Home');

      Toast.show({
        type: 'success', // 'success' | 'error' | 'info'
        text1: '로그인 성공',
        position: 'bottom', // 'top' | 'bottom'
        visibilityTime: 2000, // 2초 뒤 사라짐
        bottomOffset: 100,
      });
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || '로그인에 실패했습니다.';
      Alert.alert('오류', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>STAFF APP</Text>
        <Text style={styles.subtitle}>스태프 전용 관리 시스템</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="이메일 (ID)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '로그인 중...' : '로그인'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>계정이 없으신가요?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>회원가입</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSetTmpAccount}>
          <Text style={{ textAlign: 'center', paddingTop: 4 }}>임시 계정 넣기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#FF7F50', // 브랜드 컬러에 맞게 변경 가능
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#666',
    marginRight: 8,
  },
  linkText: {
    color: '#FF7F50',
    fontWeight: 'bold',
  }
});

export default LoginScreen;
