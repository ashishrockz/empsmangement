import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../models/types';
import axios from 'axios';

const departmentData = [
  { label: 'BA', value: 'BA' },
  { label: 'Development', value: 'Development' },
  { label: 'Designing', value: 'Designing' },
  { label: 'UI', value: 'UI' },
  { label: 'Testing', value: 'Testing' },
  { label: 'HR', value: 'HR' },
  { label: 'Manager', value: 'Manager' },
  { label: 'System Admin', value: 'System Admin' },
];

const adminData = [
  { label: 'True', value: 'true' },
  { label: 'False', value: 'false' },
];

const statusData = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

type EditEmployeeRouteProp = RouteProp<RootStackParamList, 'EditEmployee'>;

const EditEmployee = ({ route }: { route: EditEmployeeRouteProp }) => {
  const { employeeId } = route.params;
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    department: '',
    status: '',
    isAdmin: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(
          `https://backend-api-social.vercel.app/api/emp/${employeeId}`
        );
        const { firstName, lastName, phone, companyMail: email, status, isAdmin, department } = response.data;
        setFormData({ firstName, lastName, phone, email, status, isAdmin, department });
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch employee details.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData();
  }, [employeeId]);

  const handleInputChange = (key: string, value: string | boolean) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `https://backend-api-social.vercel.app/api/emp/${employeeId}`,
        formData
      );
      Alert.alert('Success', 'Employee details updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update employee details.');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Employee Details</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>First Name:</Text>
        <TextInput
          style={styles.input}
          value={formData.firstName}
          onChangeText={(text) => handleInputChange('firstName', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={formData.lastName}
          onChangeText={(text) => handleInputChange('lastName', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone:</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          keyboardType="phone-pad"
          onChangeText={(text) => handleInputChange('phone', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email (Company Mail):</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          keyboardType="email-address"
          onChangeText={(text) => handleInputChange('email', text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Department:</Text>
        <Dropdown
          data={departmentData}
          labelField="label"
          valueField="value"
          placeholder="Select department"
          value={formData.department}
          onChange={(item) => handleInputChange('department', item.value)}
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          placeholderStyle={styles.placeholderStyle}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Status:</Text>
        <Dropdown
          data={statusData}
          labelField="label"
          valueField="value"
          placeholder="Select status"
          value={formData.status}
          onChange={(item) => handleInputChange('status', item.value)}
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          placeholderStyle={styles.placeholderStyle}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Admin:</Text>
        <Dropdown
          data={adminData}
          labelField="label"
          valueField="value"
          placeholder="Select admin status"
          value={formData.isAdmin}
          onChange={(item) => handleInputChange('isAdmin', item.value)}
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          placeholderStyle={styles.placeholderStyle}
        />
      </View>

      <Button title="Save Changes" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default EditEmployee;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 15,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#aaa',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
