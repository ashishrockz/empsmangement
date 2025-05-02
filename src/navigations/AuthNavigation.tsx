import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/login/Login';
import { RootStackParamList } from '../models/types';

const Stack = createStackNavigator<RootStackParamList>();

const AuthNavigation = () => {
  return (
    <>
    <Login />  
    </>
  );
};

export default AuthNavigation;
