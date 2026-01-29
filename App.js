import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ClinicDashboard from './src/screens/clinic/clinicDashboard';
import StudentDashboard from './src/screens/student/studentDashboard';
import StudentBooking from './src/screens/student/studentBooking';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#0F172A' },
            gestureEnabled: false,
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen 
            name="ClinicDashboard"
            component={ClinicDashboard}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen 
            name="StudentDashboard"
            component={StudentDashboard}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen 
            name="StudentBooking"
            component={StudentBooking}
            options={{ animationEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}