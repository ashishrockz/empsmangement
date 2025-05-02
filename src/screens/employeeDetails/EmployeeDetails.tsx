import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {
  EmployeeDetailsNavigationProp,
  RootStackParamList,
} from '../../models/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Employee {
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  personalMail?: string;
  companyMail: string;
  address?: string;
  department: string;
  profilePic?: string;
  isAdmin: boolean;
  status: string;
}

interface CurrentUser {
  employeeId: string;
  department: string;
  isAdmin?: boolean;
}

const EmployeeDetails = ({
  route,
}: {
  route: RouteProp<RootStackParamList, 'EmployeeDetails'>;
}) => {
  const {employeeId} = route.params;
  const navigation = useNavigation<EmployeeDetailsNavigationProp>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user information
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          setLoading(false);
          return;
        }

        // Fetch current user data
        const userResponse = await axios.get(
          'https://emps-jade.vercel.app/auth/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setCurrentUser(userResponse.data);

        // Fetch employee details
        const employeeResponse = await axios.get(
          `https://emps-jade.vercel.app/api/emp/${employeeId}`,
        );
        setEmployee(employeeResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load employee details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Setup refresh interval
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [employeeId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleEdit = () => {
    navigation.navigate('EditEmployee', {employeeId});
  };

  // Check if current user has edit permissions
  const canEditEmployee = () => {
    if (!currentUser) return false;
    
    // System Admin, Manager can edit any employee
    if (currentUser.department === 'SystemAdmin' || currentUser.department === 'Manager') {
      return true;
    }
    
    // Users can edit their own profile
    if (currentUser.employeeId === employeeId) {
      return true;
    }
    
    return false;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {employee ? (
          <>
            {employee.profilePic ? (
              <Image
                source={{uri: employee.profilePic}}
                style={styles.profilePic}
              />
            ) : (
              <Text style={styles.noImage}>No Profile Picture</Text>
            )}

            <View style={styles.row}>
              <Text style={styles.label}>Employee ID:</Text>
              <Text style={styles.value}>{employee.employeeId}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>First Name:</Text>
              <Text style={styles.value}>{employee.firstName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Middle Name:</Text>
              <Text style={styles.value}>{employee.middleName || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Last Name:</Text>
              <Text style={styles.value}>{employee.lastName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phone Number:</Text>
              <Text style={styles.value}>{employee.phone}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Personal Mail:</Text>
              <Text style={styles.value}>{employee.personalMail || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Company Mail:</Text>
              <Text style={styles.value}>{employee.companyMail}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{employee.address || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Department:</Text>
              <Text style={styles.value}>{employee.department}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Admin:</Text>
              <Text style={styles.value}>
                {employee.isAdmin ? 'Yes' : 'No'}
              </Text>
            </View>
            <View
              style={[
                styles.statusContainer,
                {
                  backgroundColor:
                    employee.status.toLowerCase() === 'active'
                      ? '#d4edda'
                      : '#f8d7da',
                },
              ]}>
              <Text style={styles.statusText}>{employee.status}</Text>
            </View>
            
            {/* Show edit button based on user permissions */}
            {canEditEmployee() && (
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text>No details available for this employee.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default EmployeeDetails;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  noImage: {
    fontSize: 16,
    color: '#888',
    alignSelf: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  value: {
    fontSize: 18,
    fontWeight: '400',
    color: '#333',
    flex: 2,
  },
  statusContainer: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});