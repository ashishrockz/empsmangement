import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the parameter types for your navigation
export type RootStackParamList = {
  List: undefined; // No parameters for the List screen
  MainDrawer: undefined;
  AddEmployee: undefined;
  Profile:undefined;
  EmployeeDetails: { employeeId: string };
  EditEmployee: { employeeId: string };
  EditProfile: { employeeId: string }

};


export type EmployeeDetailsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EmployeeDetails',
  'Profile'
>;

export type ListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'List'>;
