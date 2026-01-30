import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import StudentDashboard from '../screens/student/studentDashboard';
import StudentBooking from '../screens/student/studentBooking';
import StudentAppointment from '../screens/student/studentAppointment';

const Tab = createBottomTabNavigator();

const StudentBottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Book') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'list' : 'list-outline';
          } 

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#334155',
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={StudentDashboard}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Book" 
        component={StudentBooking}
        options={{
          tabBarLabel: 'Book',
        }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={StudentAppointment}
        options={{
          tabBarLabel: 'Appointments',
        }}
      />
    </Tab.Navigator>
  );
};

export default StudentBottomTabs;