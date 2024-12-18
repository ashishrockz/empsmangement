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

  // Render status for each approver
  const renderApprovalStatus = (status: string) => {
    let color = '#FFA500'; // Default color for pending
    if (status === 'Approved') color = '#4CAF50'; // Green for approved
    if (status === 'Rejected') color = '#FF0000'; // Red for rejected
    return (
      <View style={[styles.statusBox, {backgroundColor: color}]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
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
        <Text style={styles.status}>Overall Status: {item.status}</Text>

        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <Text style={styles.approverTitle}>Team Lead</Text>
            {renderApprovalStatus(item.approver?.teamLead?.status || 'Pending')}
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.approverTitle}>Manager</Text>
            {renderApprovalStatus(item.approver?.manager?.status || 'Pending')}
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.approverTitle}>Approver</Text>
            {renderApprovalStatus(item.approver?.status || 'Pending')}
          </View>
        </View>

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
    elevation: 2,
    shadowColor: '#000',
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
    marginBottom: 10,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  approverTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusBox: {
    width: 60,
    height: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
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
