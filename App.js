import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DatabaseProvider } from './src/contexts/DatabaseContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <DatabaseProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <AppNavigator />
      </SafeAreaProvider>
    </DatabaseProvider>
  );
}