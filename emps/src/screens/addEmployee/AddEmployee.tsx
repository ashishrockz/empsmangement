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
  const [isFormValid, setIsFormValid] = useState(false);

  // Error messages for each field
  const [errors, setErrors] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    companyMail: '',
    phone: '',
    department: '',
    password: '',
    isAdmin: '',
  });

  useEffect(() => {
    const newErrors = { ...errors };

    // Reset error messages
    newErrors.employeeId = '';
    newErrors.firstName = '';
    newErrors.lastName = '';
    newErrors.companyMail = '';
    newErrors.phone = '';
    newErrors.department = '';
    newErrors.password = '';
    newErrors.isAdmin = '';

    // Validation checks and setting error messages
    if (!employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required.';
    }
    if (!firstName.trim()) {
      newErrors.firstName = 'First Name is required.';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last Name is required.';
    }
    if (!/^\S+@\S+\.\S+$/.test(companyMail)) {
      newErrors.companyMail = 'Please enter a valid email.';
    }
    if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits.';
    }
    if (!department.trim()) {
      newErrors.department = 'Department is required.';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    }
    if (!isAdmin.trim()) {
      newErrors.isAdmin = 'Admin status is required.';
    }

    setErrors(newErrors);

    // Check if the form is valid
    const isValid =
      !Object.values(newErrors).some((error) => error) && // Check if there is any error
      employeeId.trim() &&
      firstName.trim() &&
      lastName.trim() &&
      /^\S+@\S+\.\S+$/.test(companyMail) &&
      /^\d{10}$/.test(phone) &&
      department.trim() &&
      password.trim() &&
      isAdmin.trim();

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
            {errors.employeeId ? <Text style={styles.errorText}>{errors.employeeId}</Text> : null}
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
              {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
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
              {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
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
            {errors.companyMail ? <Text style={styles.errorText}>{errors.companyMail}</Text> : null}
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
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
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
            {errors.department ? <Text style={styles.errorText}>{errors.department}</Text> : null}
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
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
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
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
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
            {errors.isAdmin ? <Text style={styles.errorText}>{errors.isAdmin}</Text> : null}
          </View>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: isFormValid ? '#4070f4' : '#cccccc' }]}
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default AddEmployee;
