import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your clinic screens - CORRECT PATHS FOR YOUR STRUCTURE
import ClinicDashboard from '../screens/clinic/clinicDashboard';
import ManageAppointmentsScreen from '../screens/clinic/ManageAppointmentsScreen';
import SetAvailabilityScreen from '../screens/clinic/SetAvailabilityScreen';

const Tab = createBottomTabNavigator();

const ClinicTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Availability') {
            iconName = focused ? 'time' : 'time-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerTitleAlign: 'center',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={ClinicDashboard}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={ManageAppointmentsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Availability" 
        component={SetAvailabilityScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default ClinicTabNavigator;