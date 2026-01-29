import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ClinicTabNavigator from './ClinicTabNavigator';
import StudentBottomTabs from './StudentBottomTabs';
import StudentAppointment from '../screens/student/studentAppointment';
import StudentBooking from '../screens/student/studentBooking';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ClinicMain" component={ClinicTabNavigator} />
        <Stack.Screen name="StudentDashboard" component={StudentBottomTabs} />
        <Stack.Screen name="StudentAppointment" component={StudentAppointment} />
        <Stack.Screen name="StudentBooking" component={StudentBooking} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;