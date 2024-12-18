import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import {useNavigation, NavigationProp} from '@react-navigation/native';

// Define the types for your navigation routes
type RootStackParamList = {
    LeaveRequestApproval: {leaveId: string};
};

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Type the navigation hook
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Fetch all leave requests from the API
  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get(
        'https://backend-api-social.vercel.app/api/leave/all',
      );
      setLeaveRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      Alert.alert('Error', 'Failed to fetch leave requests');
      setLoading(false);
    }
  };

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Format the date to a readable format
  const formatDate = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  };

  const renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.card}>
        <Text style={styles.employeeId}>Employee ID: {item.employeeId}</Text>
        <Text style={styles.leaveType}>Leave Type: {item.leaveType}</Text>

        <Text style={styles.date}>
          {`Start Date: ${formatDate(item.startDate)} - End Date: ${formatDate(
            item.endDate,
          )}`}
        </Text>

        <Text style={styles.reason}>Reason: {item.reason}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate('LeaveRequestApproval', {leaveId: item._id})
          }>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading leave requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={leaveRequests}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  employeeId: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  leaveType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    marginBottom: 5,
  },
  reason: {
    fontSize: 14,
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LeaveRequests;
