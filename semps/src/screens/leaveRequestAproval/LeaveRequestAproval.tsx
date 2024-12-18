import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import reanimatedJS from 'react-native-reanimated/lib/typescript/js-reanimated';

const LeaveRequestAproval = ({ route }: { route: any; }) => {
  const { leaveId, approverRole } = route.params; // Get leaveId and approverRole passed from the previous screen
  
  const [leaveRequest, setLeaveRequest] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch leave request details by leaveId
  const fetchLeaveRequest = async () => {
    try {
      const response = await axios.get(`https://backend-api-social.vercel.app/api/leave/details/${leaveId}`);
      setLeaveRequest(response.data);
      console.log(response.data)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leave request:', error);
      Alert.alert('Error', 'Failed to fetch leave request');
      setLoading(false);
    }
  };

  // Approve or Reject the leave request
  const handleApproval = async (status: string) => {
    try {
      const response = await axios.put(`https://backend-api-social.vercel.app/api/leave/${leaveId}`, {
        approverRole,
        status,
      });
      Alert.alert('Success', `Leave ${status.toLowerCase()} successfully`);
    } catch (error: any) {
      console.error('Error approving/rejecting leave request:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update leave status';
      Alert.alert('Error', errorMessage);
    }
  };
  

  // Fetch leave request details when the component mounts
  useEffect(() => {
    fetchLeaveRequest();
  }, [leaveId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading leave request...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Employee ID: {leaveRequest.employeeId}</Text>
      <Text style={styles.text}>Leave Type: {leaveRequest.leaveType}</Text>
      <Text style={styles.text}>Start Date: {new Date(leaveRequest.startDate).toLocaleDateString()}</Text>
      <Text style={styles.text}>End Date: {new Date(leaveRequest.endDate).toLocaleDateString()}</Text>
      <Text style={styles.text}>Reason: {leaveRequest.reason}</Text>

      <Text style={styles.text}>Current Status: {leaveRequest.status}</Text>

      {/* Approve or Reject Buttons */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
        onPress={() => handleApproval('Approved')}
      >
        <Text style={styles.buttonText}>Approve</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#F44336' }]}
        onPress={() => handleApproval('Rejected')}
      >
        <Text style={styles.buttonText}>Reject</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LeaveRequestAproval;

