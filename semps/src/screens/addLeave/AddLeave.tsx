import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Button,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import axios from 'axios';
import {RouteProp, useNavigation} from '@react-navigation/core';
import {RootStackParamList} from '../../models/types';

const data = [
  {label: 'Sick Leave', value: 'Sick Leave'},
  {label: 'Casual Leave', value: 'Casual Leave'},
  {label: 'Paid Leave', value: 'Paid Leave'},
  {label: 'Maternity Leave', value: 'Maternity Leave'},
  {label: 'Paternity Leave', value: 'Paternity Leave'},
];

type AddLeaveProp = RouteProp<RootStackParamList, 'ApplyLeave'>;

const AddLeave = ({route}: {route: AddLeaveProp}) => {
  const {employeeId} = route.params;
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const navigation = useNavigation();
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const showStartDatePicker = () => setStartDatePickerVisibility(true);
  const hideStartDatePicker = () => setStartDatePickerVisibility(false);
  const handleStartDateConfirm = (date: Date) => {
    setStartDate(dayjs(date).format('YYYY-MM-DD')); // Ensure the date is formatted properly
    hideStartDatePicker();
  };

  const showEndDatePicker = () => setEndDatePickerVisibility(true);
  const hideEndDatePicker = () => setEndDatePickerVisibility(false);
  const handleEndDateConfirm = (date: Date) => {
    setEndDate(dayjs(date).format('YYYY-MM-DD')); // Ensure the date is formatted properly
    hideEndDatePicker();
  };

  const calculateDaysBetween = () => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    return end.diff(start, 'day') + 1;
  };

  const handleSubmit = async () => {
    if (!employeeId || !leaveType || !startDate || !endDate || !reason) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    try {
      const payload = {
        employeeId,
        leaveType,
        startDate,
        endDate,
        reason,
      };
      console.log('Payload:', payload);
  
      const response = await axios.post(
        'https://backend-api-social.vercel.app/api/leave/apply',
        payload,
      );
      console.log('API Response:', response.data);
  
      Alert.alert('Success', 'Leave request submitted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }, // Ensure navigation happens on success
      ]);
    } catch (error) {
      console.error('Error submitting leave request:', error);
      Alert.alert('Error', 'Failed to submit leave request.');
    }
  };
  

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Leave Type</Text>
          <Dropdown
            data={data}
            maxHeight={200}
            labelField="label"
            valueField="value"
            placeholder="Select leave type"
            value={leaveType} // Ensure this is the value that is being updated
            style={styles.dropdown}
            selectedTextStyle={styles.selectedTextStyle}
            placeholderStyle={styles.placeholderStyle}
            onChange={item => {
              console.log('Selected item:', item); // Log the selected item
              setLeaveType(item.value); // Update leaveType
            }}
          />
        </View>

        <View style={[styles.inputGroup, styles.nameContainer]}>
          <View style={styles.halfWidthInputGroup}>
            <Text style={styles.label}>Start Date:</Text>
            <DateTimePickerModal
              isVisible={isStartDatePickerVisible}
              mode="date"
              onConfirm={handleStartDateConfirm}
              onCancel={hideStartDatePicker}
            />
            <TouchableOpacity
              style={styles.datePicker}
              onPress={showStartDatePicker}>
              <Text style={styles.dateText}>{startDate}</Text>{' '}
              {/* Display date in string format */}
              <Image
                source={require('../../assets/calendar.png')}
                style={styles.calendarIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.halfWidthInputGroup}>
            <Text style={styles.label}>End Date:</Text>
            <DateTimePickerModal
              isVisible={isEndDatePickerVisible}
              mode="date"
              onConfirm={handleEndDateConfirm}
              onCancel={hideEndDatePicker}
            />
            <TouchableOpacity
              style={styles.datePicker}
              onPress={showEndDatePicker}>
              <Text style={styles.dateText}>{endDate}</Text>{' '}
              {/* Display date in string format */}
              <Image
                source={require('../../assets/calendar.png')}
                style={styles.calendarIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reason:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Reason"
            placeholderTextColor="gray"
            value={reason}
            onChangeText={setReason}
          />
        </View>

        <View
          style={[
            styles.inputGroup,
            {flexDirection: 'row', justifyContent: 'flex-start'},
          ]}>
          <Text style={styles.label}>Number of Days:</Text>
          <Text style={styles.daysText}>
            {`${calculateDaysBetween()} ${
              calculateDaysBetween() === 1 ? 'Day' : 'Days'
            }`}
          </Text>
        </View>
        <Button title="Apply for Leave" onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
};

export default AddLeave;

const styles = StyleSheet.create({
  formContainer: {
    margin: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidthInputGroup: {
    width: '47%',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    fontSize: 16,
    height: 50,
    color: '#333',
    paddingHorizontal: 5,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
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
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingBottom: 5,
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  calendarIcon: {
    width: 20,
    height: 20,
  },
  daysText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});
