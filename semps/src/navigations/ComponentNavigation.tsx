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
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfile from '../screens/editProfile/EditProfile';
import AddLeave from '../screens/addLeave/AddLeave';
import LeaveRequests from '../screens/leaveRequests/leaveRequests';
import LeaveRequestApproval from '../screens/leaveRequestAproval/LeaveRequestAproval';
import AppliedLeaves from '../screens/appliedLeaves/AppliedLeaves';
// Define stack parameters
type RootStackParamList = {
  MainDrawer: undefined;
  AddEmployee: undefined;
  Profile: undefined;
  LeaveRequests: undefined;
  LeaveRequestApproval: {leaveId: string}; // Fixed naming
  EmployeeDetails: {employeeId: string};
  EditEmployee: {employeeId: string};
  EditProfile: {employeeId: string};
  ApplyLeave: {employeeId: string};
  AppliedLeaves: {employeeId: string};
};

interface MainProps {
  logout: () => void;
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const DrawerNavigation: React.FC<MainProps> = ({logout}) => {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContant {...props} logout={logout} />}>
      <Drawer.Screen
        name="Admin Dashboard"
        component={DashBoard}
        options={{
          headerTitleAlign: 'center', // Center the text
        }}
      />
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
            children={({
              route,
            }: StackScreenProps<RootStackParamList, 'EmployeeDetails'>) => (
              <EmployeeDetails route={route} />
            )}
            options={{title: 'Employee Details'}}
          />
          <Stack.Screen
            name="EditEmployee"
            children={({
              route,
            }: StackScreenProps<RootStackParamList, 'EditEmployee'>) => (
              <EditEmployee route={route} />
            )}
            options={{title: 'Edit Employee'}}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen
            name="EditProfile"
            children={({
              route,
            }: StackScreenProps<RootStackParamList, 'EditProfile'>) => (
              <EditProfile route={route} />
            )}
            options={{title: 'Edit Profile'}} // Fixed title capitalization
          />
          <Stack.Screen
            name="ApplyLeave"
            children={({
              route,
            }: StackScreenProps<RootStackParamList, 'ApplyLeave'>) => (
              <AddLeave route={route} />
            )}
            options={{title: 'Apply Leave'}} // Fixed title
          />
          <Stack.Screen name="LeaveRequests" component={LeaveRequests} />
          <Stack.Screen
            name="LeaveRequestApproval"
            children={({
              route,
            }: StackScreenProps<
              RootStackParamList,
              'LeaveRequestApproval'
            >) => <LeaveRequestApproval route={route} />}
            options={{title: 'Leave Request Approval'}}
          />
          <Stack.Screen
            name="AppliedLeaves"
            children={({
              route,
            }: StackScreenProps<RootStackParamList, 'AppliedLeaves'>) => (
              <AppliedLeaves employeeId={route.params.employeeId} />
            )}
            options={{title: 'Check Applied Leaves'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default AppNavigator;
