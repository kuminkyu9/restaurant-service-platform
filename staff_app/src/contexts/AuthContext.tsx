import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface Staff {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  staff: Staff | null;
  setStaff: (staff: Staff | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  staff: null,
  setStaff: () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 저장된 사용자 정보가 있는지 확인 (선택 사항)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedStaff = await SecureStore.getItemAsync('staffData');
        if (storedStaff) {
          setStaff(JSON.parse(storedStaff));
        }
      } catch (e) {
        console.error('Failed to load staff data', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ staff, setStaff, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
