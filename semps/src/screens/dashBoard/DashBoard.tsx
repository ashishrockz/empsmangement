import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Header from '../../components/header/Header';
import List from '../../components/list/List';

interface DashboardProps {
  logout: () => void;
}

const Dashboard = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <List />
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Add a default background color
  },
  container: {
    flex: 1,
    padding: 10, // Adds padding around the content
    backgroundColor: '#f1f1f1', // Use a different color for content area if needed
  },
});
