import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import DashBoard from '../screens/dashBoard/DashBoard';
import AddEmployee from '../screens/addEmployee/AddEmployee';
import DrawerContant from '../components/drawerContant/DrawerContant';
import EmployeeDetails from '../screens/employeeDetails/EmployeeDetails';
import EditEmployee from '../screens/editEmployee/EditEmployee';

// Define stack parameters
type RootStackParamList = {
  MainDrawer: undefined;
  AddEmployee: undefined;
  EmployeeDetails: { employeeId: string };
  EditEmployee: { employeeId: string };
};

interface MainProps {
  logout: () => void;
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const DrawerNavigation: React.FC<MainProps> = ({logout}) => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContant {...props} logout={logout} />}
    >
      <Drawer.Screen name="Dashboard" component={DashBoard} />
    </Drawer.Navigator>
  );
};

const AppNavigator: React.FC<MainProps> = ({logout}) => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="MainDrawer"
            children={() => <DrawerNavigation logout={logout} />}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddEmployee"
            component={AddEmployee}
            options={{title: 'Add Employee'}}
          />
          <Stack.Screen
            name="EmployeeDetails"
            children={({ route }: StackScreenProps<RootStackParamList, 'EmployeeDetails'>) => (
              <EmployeeDetails route={route} />
            )}
            options={{title: 'Employee Details'}}
          />
          <Stack.Screen
            name="EditEmployee"
            children={({ route }: StackScreenProps<RootStackParamList, 'EditEmployee'>) => (
              <EditEmployee route={route} />
            )}
            options={{title: 'Edit Employee'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default AppNavigator;
