import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StudentDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>this is the student dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  text: {
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '500',
  },
});