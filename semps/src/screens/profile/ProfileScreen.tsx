import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../hooks/Authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {EmployeeDetailsNavigationProp} from '../../models/types';

interface User {
  employeeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  personalMail: string;
  companyMail: string;
  address: string;
  department: string;
  profilePic?: string;
  isAdmin: boolean;
  status: string;
}

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<EmployeeDetailsNavigationProp>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Retrieved Token:', token); // Debug token
        if (!token) {
          console.error('No token found');
          return;
        }
        const response = await axios.get(
          `https://backend-api-social.vercel.app/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setUser(response.data);
      } catch (error: any) {
        console.error(
          'Fetch user error:',
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const handleEdit = () => {
    if (user?.employeeId) {
      navigation.navigate('EditProfile', {employeeId: user.employeeId});
    } else {
      console.error('Employee ID is not available.');
    }
  };
  const InfoRow = ({label, value}: {label: string; value: string}) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
  );
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
      {user ? (
  <>
    {user.profilePic ? (
      <Image source={{uri: user.profilePic}} style={styles.profilePic} />
    ) : (
      <Text style={styles.noImage}>No Profile Picture</Text>
    )}
    <InfoRow label="User ID" value={user.employeeId} />
    <InfoRow label="First Name" value={user.firstName} />
    <InfoRow label="Middle Name" value={user.middleName} />
    <InfoRow label="Last Name" value={user.lastName} />
    <InfoRow label="Phone Number" value={user.phone} />
    <InfoRow label="Personal Mail" value={user.personalMail} />
    <InfoRow label="Company Mail" value={user.companyMail} />
    <InfoRow label="Address" value={user.address} />
    <InfoRow label="Department" value={user.department} />
    <InfoRow label="Admin" value={user.isAdmin ? 'Yes' : 'No'} />
    <View
      style={[
        styles.statusContainer,
        {
          backgroundColor: user.status.toLowerCase() === 'active' ? '#d4edda' : '#f8d7da',
        },
      ]}>
      <Text style={styles.statusText}>{user.status}</Text>
    </View>
    <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
      <Text style={styles.editButtonText}>Edit</Text>
    </TouchableOpacity>
  </>
) : (
  <Text>No details available for this user.</Text>
)}

      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

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
