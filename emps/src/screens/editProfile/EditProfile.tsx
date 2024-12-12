import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../models/types';
import axios from 'axios';

type EditProfileRouteProp = RouteProp<RootStackParamList, 'EditProfile'>;

const EditProfile = ({route}: {route: EditProfileRouteProp}) => {
  const {employeeId} = route.params;
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    personalMail: '',
    companyMail: '',
    department: '',
    address: '',
    status: '',
    isAdmin: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(
          `https://backend-api-social.vercel.app/api/emp/${employeeId}`,
        );
        const {
          firstName,
          middleName,
          lastName,
          phone,
          companyMail,
          status,
          personalMail,
          address,
          isAdmin,
          department,
        } = response.data;
        setFormData({
          firstName,
          middleName,
          lastName,
          phone,
          companyMail,
          personalMail,
          address,
          status,
          isAdmin,
          department,
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch employee details.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData();
  }, [employeeId]);

  const handleInputChange = (key: string, value: string) => {
    setFormData({...formData, [key]: value});
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `https://backend-api-social.vercel.app/api/emp/${employeeId}`,
        formData,
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
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name:</Text>
          <TextInput
            style={styles.input}
            value={formData.firstName}
            onChangeText={text => handleInputChange('firstName', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Middle Name:</Text>
          <TextInput
            style={styles.input}
            value={formData.middleName}
            onChangeText={text => handleInputChange('middleName', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name:</Text>
          <TextInput
            style={styles.input}
            value={formData.lastName}
            onChangeText={text => handleInputChange('lastName', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone:</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            keyboardType="phone-pad"
            onChangeText={text => handleInputChange('phone', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email (Personal Mail):</Text>
          <TextInput
            style={styles.input}
            value={formData.personalMail}
            keyboardType="email-address"
            onChangeText={text => handleInputChange('personalMail', text)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Address:</Text>
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={text => handleInputChange('address', text)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Company Mail</Text>
          <Text
            style={styles.staticText}
            onPress={() =>
              Alert.alert(
                'Access Restricted',
                'Only an admin can change the department. Please contact your Manager or System Admin.',
              )
            }>
            {formData.companyMail}
          </Text>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Department:</Text>
          <Text
            style={styles.staticText}
            onPress={() =>
              Alert.alert(
                'Access Restricted',
                'Only an admin can change the department. Please contact your Manager or System Admin.',
              )
            }>
            {formData.department}
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Status:</Text>
          <Text
            style={styles.staticText}
            onPress={() =>
              Alert.alert(
                'Access Restricted',
                'Only an admin can change the department. Please contact your Manager or System Admin.',
              )
            }>
            {formData.status}
          </Text>
        </View>
        <Button title="Save Changes" onPress={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

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
  staticText: {
    fontSize: 16,
    padding: 10,
    color: '#555',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
