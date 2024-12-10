import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ListNavigationProp } from '../../models/types'; // Import the ListNavigationProp type

const List = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<ListNavigationProp>(); // Use the ListNavigationProp type

  // Fetch employee data from API
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get('https://backend-api-social.vercel.app/api/emp/all');
        setEmployeeData(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData();
  }, []);

  // Render a single employee row
  const renderItem = ({ item }: { item: any }) => (
    <View style={tableStyles.row}>
      <TouchableOpacity onPress={() => navigation.navigate('EmployeeDetails', { employeeId: item.employeeId })}>
        <Text style={[tableStyles.cell, { color: 'blue', textDecorationLine: 'underline' }]}>
          {item.employeeId}
        </Text>
      </TouchableOpacity>
      <Text style={tableStyles.cell}>{item.firstName}</Text>
      <Text style={tableStyles.cell}>{item.lastName}</Text>
      <Text style={tableStyles.cell}>{item.status}</Text>
    </View>
  );

  return (
    <View style={tableStyles.container}>
      <View style={tableStyles.headerRow}>
        <Text style={tableStyles.cellHeader}>Emp ID</Text>
        <Text style={tableStyles.cellHeader}>First Name</Text>
        <Text style={tableStyles.cellHeader}>Last Name</Text>
        <Text style={tableStyles.cellHeader}>Status</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : employeeData.length > 0 ? (
        <FlatList
          data={employeeData}
          renderItem={renderItem}
          keyExtractor={(item) => item.employeeId.toString()} // Use a unique key
        />
      ) : (
        <Text style={tableStyles.emptyText}>
          No employees available. Please check back later.
        </Text>
      )}
    </View>
  );
};

export default List;

const tableStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#52006A',
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cellHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    padding: 10,
    fontSize: 17,
    color: 'black',
    fontWeight: '500',
  },
});
