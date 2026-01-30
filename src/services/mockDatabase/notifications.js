import AsyncStorage from '@react-native-async-storage/async-storage';
import { TABLES } from './constants';

export const createNotification = async (notificationData) => {
  try {
    await AsyncStorage.setItem(
      `${TABLES.NOTIFICATIONS}_${notificationData.id}`,
      JSON.stringify(notificationData)
    );
    return { success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
};

export const getNotifications = async (userId, userType = 'clinic') => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const notificationKeys = keys.filter(key => key.startsWith(TABLES.NOTIFICATIONS));
    const items = await AsyncStorage.multiGet(notificationKeys);
    
    let notifications = items.map(([key, value]) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }).filter(item => item !== null);
    
    // Filter by user
    if (userType === 'clinic') {
      notifications = notifications.filter(notif => notif.clinicId === userId);
    } else {
      notifications = notifications.filter(notif => notif.studentId === userId);
    }
    
    // Sort by date (newest first)
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

export const markNotificationRead = async (notificationId) => {
  try {
    const key = `${TABLES.NOTIFICATIONS}_${notificationId}`;
    const existing = await AsyncStorage.getItem(key);
    
    if (!existing) {
      return { success: false, error: 'Notification not found' };
    }
    
    const notification = JSON.parse(existing);
    const updatedNotification = {
      ...notification,
      read: true,
      readAt: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(key, JSON.stringify(updatedNotification));
    return { success: true };
  } catch (error) {
    console.error('Error marking notification read:', error);
    return { success: false, error: error.message };
  }
};