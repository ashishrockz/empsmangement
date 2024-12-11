import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define type for user data
interface User {
  profilePic: string | undefined;
  firstName: string;
  lastName: string;
}

type RootStackParamList = {
  Dashboard: undefined;
  AddEmployee: undefined;
};

type DrawerScreenNavigationProp = DrawerNavigationProp<RootStackParamList>;

interface DrawerContantProps {
  logout: () => void;
}

const DrawerContant: React.FC<DrawerContantProps & DrawerContentComponentProps> = ({ logout }) => {
  const [user, setUser] = useState<User | null>(null); // State initialized as null
  const navigation = useNavigation<DrawerScreenNavigationProp>();

  const addEmployee = () => {
    navigation.navigate('AddEmployee');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log("Retrieved Token:", token); // Debug token
        if (!token) {
          console.error('No token found');
          return;
        }
        const response = await axios.get(`https://backend-api-social.vercel.app/api/emp/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data); 
      } catch (error:any) {
        // console.error("Fetch user error:", error.response?.data || error.message);
      }
    };
    fetchUser();
  }, []);
  const fetchEmployeeDetails = () =>{
    Alert.alert('The next version update ')
  }

  return (
    <View style={styles.container}>
      {user ? (
        // {user.profilePic ? (
        //   <Image
        //     source={{uri:user.profilePic}}
        //     style={styles.profilePic}
        //   />
        // ) : (
        //   <Text style={styles.noImage}>No Profile Picture</Text>
        // )}
        <Text onPress={fetchEmployeeDetails}>{user.firstName} {user.lastName}</Text>
      ) : (
        <Text>Loading user data...</Text>
      )}
      <TouchableOpacity style={styles.item} onPress={addEmployee}>
        <Text style={styles.text}>Add Employee</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={addEmployee}>
        <Text style={styles.text}>Leavs</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.item, { backgroundColor: '#f8d7da' }]}
        onPress={logout}
      >
        <Text style={[styles.text, { textAlign: 'center' }]}>Logout</Text>
      </TouchableOpacity>
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
  item: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
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
});
