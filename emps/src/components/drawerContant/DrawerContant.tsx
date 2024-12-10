import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';

interface DrawerContantProps {
  logout: () => void;
}

const DrawerContant: React.FC<DrawerContantProps & DrawerContentComponentProps> = ({logout}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('AddEmployee')}>
        <Text style={styles.text}>Add Employee</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={logout}>
        <Text style={styles.text}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DrawerContant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  item: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
