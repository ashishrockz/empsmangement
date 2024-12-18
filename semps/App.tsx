import {View, Text} from 'react-native';
import React from 'react';
import {AuthProvider} from './src/hooks/Authentication';
import Main from './src/navigations/Main';
import { NavigationContainer } from '@react-navigation/native';
const App = () => {
  return (
    <AuthProvider>
      <Main/>
    </AuthProvider>
  );
};

export default App;
