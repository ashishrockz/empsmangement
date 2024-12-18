import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppliedLeaves = ({ employeeId }: { employeeId: string }) => {
  const [appliedLeaves, setAppliedLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch leave requests for the specific employee
  const fetchAppliedLeaves = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const response = await axios.get(
        `https://backend-api-social.vercel.app/api/leave/${employeeId}`
      );
      setAppliedLeaves(response.data);
      console.log("Fetched Employee ID:", employeeId); // Debug log
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      Alert.alert('Error', 'Failed to fetch leave requests');
    } finally {
      setLoading(false); // Ensure loading state is false after completion
    }
  };
  

  // Delete leave request by ID
  const deleteLeaveRequest = async (leaveId: string) => {
    try {
      await axios.delete(`https://backend-api-social.vercel.app/api/leave/${leaveId}`);
      Alert.alert('Success', 'Leave request deleted successfully');
      setAppliedLeaves(appliedLeaves.filter((leave) => leave._id !== leaveId));
    } catch (error) {
      console.error('Error deleting leave request:', error);
      Alert.alert('Error', 'Failed to delete leave request');
    }
  };

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    if (employeeId) {
      fetchAppliedLeaves();
    }
  }, [employeeId]);

  // Format the date to a readable format
  const formatDate = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
        <View style={styles.card}>
        <Text style={styles.leaveType}>Leave Type: {item.leaveType}</Text>
        <Text style={styles.date}>
          {`Start Date: ${formatDate(item.startDate)} - End Date: ${formatDate(
            item.endDate
          )}`}
        </Text>
        <Text style={styles.reason}>Reason: {item.reason}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
      
        {/* Conditionally Render Delete Button */}
        {item.status !== 'Approved' && item.status !== 'Rejected' ? (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              Alert.alert(
                'Confirm Delete',
                'Are you sure you want to delete this leave request?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteLeaveRequest(item._id),
                  },
                ]
              )
            }
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.disabledText}>Your Leave Had Approved if you want to delet contact manager</Text>
        )}
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
        data={appliedLeaves}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default AppliedLeaves;

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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledText: {
    color: 'gray',
    fontStyle: 'italic',
    marginTop: 10,
  },
  
});
