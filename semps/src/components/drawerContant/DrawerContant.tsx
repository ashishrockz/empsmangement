import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define type for user data
interface User {
  profilePic: string | undefined;
  firstName: string;
  lastName: string;
  department: string;
  employeeId: string;
}

type RootStackParamList = {
  Dashboard: undefined;
  AddEmployee: undefined;
  Profile: undefined;
  ApplyLeave: {employeeId: string}; // Update this line
  AppliedLeaves: {employeeId: string};
  LeaveRequests: undefined;
};

type DrawerScreenNavigationProp = DrawerNavigationProp<RootStackParamList>;

interface DrawerContantProps {
  logout: () => void;
}

const DrawerContant: React.FC<
  DrawerContantProps & DrawerContentComponentProps
> = ({logout}) => {
  const [user, setUser] = useState<User | null>(null); // State initialized as null
  const navigation = useNavigation<DrawerScreenNavigationProp>();
  const [loading, setLoading] = useState(true);

  const addEmployee = () => {
    navigation.navigate('AddEmployee');
  };

  const profile = () => {
    navigation.navigate('Profile');
  };
  const applyLeave = () => {
    if (user?.employeeId) {
      navigation.navigate('ApplyLeave', {employeeId: user.employeeId});
    } else {
      Alert.alert('Error', 'Employee ID not available');
    }
  };
  const leaveRequests = () => {
    navigation.navigate('LeaveRequests');
  };
  const appliedLeaves = () => {
    if (user?.employeeId) {
      navigation.navigate('AppliedLeaves', {employeeId: user.employeeId});
    } else {
      Alert.alert('Error', 'Employee ID not available');
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        // console.log('Retrieved Token:', token); // Debug token
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
        // console.log(response.data);
      } catch (error: any) {
        Alert.alert('Fetch user error:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    const interval = setInterval(() => {
      fetchUser();
    }, 30000); // 10000ms = 10 seconds
    return () => clearInterval(interval);
  }, []);
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {user ? (
        user.profilePic ? (
          <View>
            <Image source={{uri: user.profilePic}} style={styles.profilePic} />
            <Text style={{fontSize: 18, textAlign: 'center'}}>
              {user.firstName} {user.lastName}
            </Text>
          </View>
        ) : (
          <Text style={styles.noImage}>No Profile Picture</Text>
        )
      ) : (
        <Text>Loading user data...</Text>
      )}
      <View style={styles.content}>
        {user?.department === 'Manager' ? (
          <>
            <TouchableOpacity style={styles.item} onPress={addEmployee}>
              <Text style={styles.text}>Add Employee</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => applyLeave()}>
              <Text style={styles.text}>Apply Leave</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => leaveRequests()}>
              <Text style={styles.text}>Leave Requests</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => appliedLeaves()}>
              <Text style={styles.text}>Check Applied Leaves</Text>
            </TouchableOpacity>
          </>
        ) : user?.department === 'TeamLead' ? (
          <>
            <TouchableOpacity style={styles.item} onPress={() => applyLeave()}>
              <Text style={styles.text}>Apply Leave</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => leaveRequests()}>
              <Text style={styles.text}>Leave Requests</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => appliedLeaves()}>
              <Text style={styles.text}>Check Applied Leaves</Text>
            </TouchableOpacity>
          </>
        ) : user?.department === 'SystemAdmin' ? (
          <>
            <TouchableOpacity style={styles.item} onPress={addEmployee}>
              <Text style={styles.text}>Add Employee</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => applyLeave()}>
              <Text style={styles.text}>Apply Leave</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => appliedLeaves()}>
              <Text style={styles.text}>Check Applied Leaves</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.item} onPress={() => applyLeave()}>
              <Text style={styles.text}>Apply Leave</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => appliedLeaves()}>
              <Text style={styles.text}>Check Applied Leaves</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Fixed section at the bottom */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.item} onPress={profile}>
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.item, styles.logoutButton]}
          onPress={logout}>
          <Text style={[styles.text, {textAlign: 'center'}]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DrawerContant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1, // Pushes the footer to the bottom
  },
  footer: {
    marginTop: 'auto', // Ensures this section stays at the bottom
  },
  item: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
  },
  logoutButton: {
    backgroundColor: '#f8d7da',
  },
  text: {
    fontSize: 16,
    color: '#333',
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
