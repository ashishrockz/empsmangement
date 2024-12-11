import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {EmployeeDetailsNavigationProp, RootStackParamList} from '../../models/types';

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

const EmployeeDetails = ({
  route,
}: {
  route: RouteProp<RootStackParamList, 'EmployeeDetails'>;
}) => {
  const {employeeId} = route.params;
  const navigation = useNavigation<EmployeeDetailsNavigationProp>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(
          `https://backend-api-social.vercel.app/api/emp/${employeeId}`,
        );
        setEmployee(response.data);
      } catch (error) {
        console.error('Error fetching employee details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeDetails();
    const interval = setInterval(() => {
      fetchEmployeeDetails();
    }, 5000); // 10000ms = 10 seconds

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

            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
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
