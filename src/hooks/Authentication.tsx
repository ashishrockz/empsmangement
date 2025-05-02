import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  tokenExpirationTime: number | null;
  login: (token: string, expirationTime: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpirationTime, setTokenExpirationTime] = useState<number | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedExpirationTime = await AsyncStorage.getItem('tokenExpirationTime');

        if (storedToken && storedExpirationTime) {
          const parsedExpirationTime = parseInt(storedExpirationTime);
          const currentTime = new Date().getTime();

          if (currentTime < parsedExpirationTime) {
            setIsAuthenticated(true);
            setToken(storedToken);
            setTokenExpirationTime(parsedExpirationTime);
          } else {
            // Token is expired, logout
            logout();
          }
        }
      } catch (error) {
        console.log('Error retrieving token or expiration time:', error);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (newToken: string, expirationTime: number) => {
    AsyncStorage.setItem('token', newToken);
    AsyncStorage.setItem('tokenExpirationTime', expirationTime.toString());
    setToken(newToken);
    setTokenExpirationTime(expirationTime);
    setIsAuthenticated(true);
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
      setIsAuthenticated(false);
      setToken(null);
      setTokenExpirationTime(null);
    } catch (error) {
      console.log('Error removing token:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, tokenExpirationTime, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
