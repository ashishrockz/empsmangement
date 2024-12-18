import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the parameter types for your navigation
export type RootStackParamList = {
  Login:undefined;
  List: undefined; // No parameters for the List screen
  MainDrawer: undefined;
  AddEmployee: undefined;
  Profile:undefined;
  ApplyLeave:{ employeeId: string };
  LeaveRequestApproval: { leaveId: string };
  EmployeeDetails: { employeeId: string };
  EditEmployee: { employeeId: string };
  EditProfile: { employeeId: string }
  AppliedLeaves: { employeeId: string };
};


export type EmployeeDetailsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EmployeeDetails',
  'Profile'
  >;

export type ListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'List'>;
