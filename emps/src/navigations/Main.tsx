import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/Authentication';
import ComponentNavigation from './ComponentNavigation';
import AuthNavigation from './AuthNavigation';

const Main = () => {
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, logout } = useAuth();  // Access authentication state from the context
  
    useEffect(() => {
      setLoading(false);  // Stop loading once the authentication context is set
    }, [isAuthenticated]);
  
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2B8761" />
        </View>
      );
    }
  
  return isAuthenticated ? <><ComponentNavigation logout={logout} /></> : <AuthNavigation />;
   
}

export default Main