import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setIsAuthenticated(true);
          setToken(storedToken);
        }
      } catch (error) {
        console.log('Error retrieving token:', error);
      }
    };
    checkAuthStatus();
  }, []);

  const login = (newToken: string) => {
    AsyncStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  // Inside your useAuth hook
const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
      console.log('logout successfully');
      setIsAuthenticated(false);
    } catch (error) {
      console.log('Error removing token:', error);
    }
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
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