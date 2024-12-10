import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';

const data = [
  { label: 'BA', value: 'BA' },
  { label: 'Development', value: 'Development' },
  { label: 'Designing', value: 'Designing' },
  { label: 'UI', value: 'UI' },
  { label: 'Testing', value: 'Testing' },
  { label: 'HR', value: 'HR' },
  { label: 'Manager', value: 'Manager' },
  { label: 'System Admin', value: 'System Admin' },
];

const admin = [
  { label: 'True', value: 'true' },
  { label: 'False', value: 'false' },
];

const AddEmployee = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyMail, setCompanyMail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState('');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    const isValid =
      employeeId.trim() &&
      firstName.trim() &&
      lastName.trim() &&
      /^\S+@\S+\.\S+$/.test(companyMail) &&
      /^\d{10}$/.test(phone) &&
      department &&
      password &&
      isAdmin;
    setIsFormValid(isValid);
  }, [employeeId, firstName, lastName, companyMail, phone, department, password, isAdmin]);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      const response = await axios.post(
        'https://backend-api-social.vercel.app/api/emp/add',
        {
          employeeId,
          firstName,
          lastName,
          companyMail,
          department,
          phone,
          password,
          isAdmin,
        }
      );

      setEmployeeId('');
      setFirstName('');
      setLastName('');
      setCompanyMail('');
      setPhone('');
      setDepartment('');
      setPassword('');
      setIsAdmin('');
      Alert.alert('Success', 'Employee added successfully');
      console.log('Employee Registered Successfully', response.data);
    } catch (error) {
      console.error('Signup failed:', error);
      Alert.alert('Error', 'Failed to add employee. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Add Employee</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Employee ID:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter employee ID"
              placeholderTextColor="gray"
              value={employeeId}
              onChangeText={setEmployeeId}
            />
          </View>
          <View style={[styles.inputGroup, styles.nameContainer]}>
            <View style={styles.halfWidthInputGroup}>
              <Text style={styles.label}>First Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="John"
                placeholderTextColor="gray"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.halfWidthInputGroup}>
              <Text style={styles.label}>Last Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="Doe"
                placeholderTextColor="gray"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Office Mail:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter office email"
              placeholderTextColor="gray"
              value={companyMail}
              onChangeText={setCompanyMail}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="gray"
              value={phone}
              onChangeText={setPhone}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Department:</Text>
            <Dropdown
              data={data}
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder="Select department"
              value={department}
              onChange={(item) => setDepartment(item.value)}
              style={styles.dropdown}
              selectedTextStyle={styles.selectedTextStyle}
              placeholderStyle={styles.placeholderStyle}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password:</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter password"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="gray"

              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}>
                <Image
                  style={{ width: 25, height: 25 }}
                  source={
                    passwordVisible
                      ? require('../../assets/Eye.png')
                      : require('../../assets/Eyeoff.png')
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Admin:</Text>
            <Dropdown
              data={admin}
              maxHeight={70}
              labelField="label"
              valueField="value"
              placeholder="Select Admin Status"
              value={isAdmin}
              onChange={(item) => setIsAdmin(item.value)}
              style={styles.dropdown}
              selectedTextStyle={styles.selectedTextStyle}
              placeholderStyle={styles.placeholderStyle}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: isFormValid ? '#4070f4' : '#cccccc' },
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid}
          >
            <Text style={styles.submitButtonText}>Add Employee</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidthInputGroup: {
    width: '48%',
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    fontSize: 16,
    height: 50,
    color: '#333',
  },
  dropdown: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    height: 40,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#4070f4',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddEmployee;
