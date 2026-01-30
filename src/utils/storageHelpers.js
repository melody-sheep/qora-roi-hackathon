// src/utils/storageHelpers.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
export const STORAGE_KEYS = {
  CLINIC_PROFILE: 'clinicProfile',
  CLINIC_USER: 'clinicUser',
  CURRENT_USER: 'currentUser',
  USER: 'user',
  CLINIC_AVAILABILITY: 'clinicAvailability',
  CLINIC_APPOINTMENTS: 'clinicAppointments',
  CLINIC_SETTINGS: 'clinicSettings',
  CLINIC_NOTIFICATIONS: 'clinicNotifications',
  AUTH_TOKEN: 'authToken',
  SESSION: 'session',
  LAST_SYNC: 'lastSync',
};

// ==================== CLINIC PROFILE STORAGE ====================

/**
 * Save clinic profile to AsyncStorage
 * @param {Object} profileData - The clinic profile data
 * @returns {Promise<boolean>} - Success status
 */
export const saveClinicProfile = async (profileData) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CLINIC_PROFILE,
      JSON.stringify(profileData)
    );
    return true;
  } catch (error) {
    console.error('Error saving clinic profile:', error);
    throw error;
  }
};

/**
 * Get clinic profile from AsyncStorage
 * @returns {Promise<Object|null>} - The clinic profile or null
 */
export const getClinicProfile = async () => {
  try {
    const profile = await AsyncStorage.getItem(STORAGE_KEYS.CLINIC_PROFILE);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting clinic profile:', error);
    return null;
  }
};

/**
 * Update specific field in clinic profile
 * @param {string} field - Field name to update
 * @param {any} value - New value
 * @returns {Promise<boolean>} - Success status
 */
export const updateClinicProfileField = async (field, value) => {
  try {
    const profile = await getClinicProfile();
    if (profile) {
      profile[field] = value;
      await saveClinicProfile(profile);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating clinic profile field:', error);
    throw error;
  }
};

/**
 * Clear clinic profile from AsyncStorage
 * @returns {Promise<boolean>} - Success status
 */
export const clearClinicProfile = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CLINIC_PROFILE);
    return true;
  } catch (error) {
    console.error('Error clearing clinic profile:', error);
    throw error;
  }
};

// ==================== USER AUTHENTICATION STORAGE ====================

/**
 * Save current user session
 * @param {Object} userData - User data including email, name, etc.
 * @returns {Promise<boolean>} - Success status
 */
export const saveCurrentUser = async (userData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
    // Also save to user key for compatibility
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving current user:', error);
    throw error;
  }
};

/**
 * Get current user from AsyncStorage
 * @returns {Promise<Object|null>} - The user data or null
 */
export const getCurrentUser = async () => {
  try {
    let user = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!user) {
      user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    }
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Clear current user session
 * @returns {Promise<boolean>} - Success status
 */
export const clearCurrentUser = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    return true;
  } catch (error) {
    console.error('Error clearing current user:', error);
    throw error;
  }
};

/**
 * Save auth token
 * @param {string} token - The authentication token
 * @returns {Promise<boolean>} - Success status
 */
export const saveAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    return true;
  } catch (error) {
    console.error('Error saving auth token:', error);
    throw error;
  }
};

/**
 * Get auth token
 * @returns {Promise<string|null>} - The auth token or null
 */
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// ==================== CLINIC AVAILABILITY STORAGE ====================

/**
 * Save clinic availability schedule
 * @param {Object} availabilityData - Availability data
 * @returns {Promise<boolean>} - Success status
 */
export const saveClinicAvailability = async (availabilityData) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CLINIC_AVAILABILITY,
      JSON.stringify(availabilityData)
    );
    return true;
  } catch (error) {
    console.error('Error saving clinic availability:', error);
    throw error;
  }
};

/**
 * Get clinic availability schedule
 * @returns {Promise<Object|null>} - The availability data or null
 */
export const getClinicAvailability = async () => {
  try {
    const availability = await AsyncStorage.getItem(
      STORAGE_KEYS.CLINIC_AVAILABILITY
    );
    return availability ? JSON.parse(availability) : null;
  } catch (error) {
    console.error('Error getting clinic availability:', error);
    return null;
  }
};

/**
 * Update availability for a specific day
 * @param {string} day - Day of week
 * @param {Object} slots - Available time slots
 * @returns {Promise<boolean>} - Success status
 */
export const updateDayAvailability = async (day, slots) => {
  try {
    const availability = await getClinicAvailability() || {};
    availability[day] = slots;
    await saveClinicAvailability(availability);
    return true;
  } catch (error) {
    console.error('Error updating day availability:', error);
    throw error;
  }
};

/**
 * Clear clinic availability
 * @returns {Promise<boolean>} - Success status
 */
export const clearClinicAvailability = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CLINIC_AVAILABILITY);
    return true;
  } catch (error) {
    console.error('Error clearing clinic availability:', error);
    throw error;
  }
};

// ==================== CLINIC APPOINTMENTS STORAGE ====================

/**
 * Save clinic appointments
 * @param {Array} appointments - List of appointments
 * @returns {Promise<boolean>} - Success status
 */
export const saveClinicAppointments = async (appointments) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CLINIC_APPOINTMENTS,
      JSON.stringify(appointments)
    );
    return true;
  } catch (error) {
    console.error('Error saving clinic appointments:', error);
    throw error;
  }
};

/**
 * Get clinic appointments
 * @returns {Promise<Array>} - List of appointments
 */
export const getClinicAppointments = async () => {
  try {
    const appointments = await AsyncStorage.getItem(
      STORAGE_KEYS.CLINIC_APPOINTMENTS
    );
    return appointments ? JSON.parse(appointments) : [];
  } catch (error) {
    console.error('Error getting clinic appointments:', error);
    return [];
  }
};

/**
 * Add a single appointment
 * @param {Object} appointment - Appointment data
 * @returns {Promise<boolean>} - Success status
 */
export const addClinicAppointment = async (appointment) => {
  try {
    const appointments = await getClinicAppointments();
    appointments.push(appointment);
    await saveClinicAppointments(appointments);
    return true;
  } catch (error) {
    console.error('Error adding clinic appointment:', error);
    throw error;
  }
};

/**
 * Update a specific appointment
 * @param {string} appointmentId - ID of appointment to update
 * @param {Object} updatedData - Updated appointment data
 * @returns {Promise<boolean>} - Success status
 */
export const updateClinicAppointment = async (appointmentId, updatedData) => {
  try {
    let appointments = await getClinicAppointments();
    appointments = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, ...updatedData } : apt
    );
    await saveClinicAppointments(appointments);
    return true;
  } catch (error) {
    console.error('Error updating clinic appointment:', error);
    throw error;
  }
};

/**
 * Delete a specific appointment
 * @param {string} appointmentId - ID of appointment to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteClinicAppointment = async (appointmentId) => {
  try {
    let appointments = await getClinicAppointments();
    appointments = appointments.filter(apt => apt.id !== appointmentId);
    await saveClinicAppointments(appointments);
    return true;
  } catch (error) {
    console.error('Error deleting clinic appointment:', error);
    throw error;
  }
};

/**
 * Clear all appointments
 * @returns {Promise<boolean>} - Success status
 */
export const clearClinicAppointments = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CLINIC_APPOINTMENTS);
    return true;
  } catch (error) {
    console.error('Error clearing clinic appointments:', error);
    throw error;
  }
};

// ==================== CLINIC SETTINGS STORAGE ====================

/**
 * Save clinic settings
 * @param {Object} settingsData - Clinic settings
 * @returns {Promise<boolean>} - Success status
 */
export const saveClinicSettings = async (settingsData) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CLINIC_SETTINGS,
      JSON.stringify(settingsData)
    );
    return true;
  } catch (error) {
    console.error('Error saving clinic settings:', error);
    throw error;
  }
};

/**
 * Get clinic settings
 * @returns {Promise<Object|null>} - The settings data or null
 */
export const getClinicSettings = async () => {
  try {
    const settings = await AsyncStorage.getItem(STORAGE_KEYS.CLINIC_SETTINGS);
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error('Error getting clinic settings:', error);
    return null;
  }
};

/**
 * Update a specific setting
 * @param {string} key - Setting key
 * @param {any} value - Setting value
 * @returns {Promise<boolean>} - Success status
 */
export const updateClinicSetting = async (key, value) => {
  try {
    const settings = await getClinicSettings() || {};
    settings[key] = value;
    await saveClinicSettings(settings);
    return true;
  } catch (error) {
    console.error('Error updating clinic setting:', error);
    throw error;
  }
};

// ==================== CLINIC NOTIFICATIONS STORAGE ====================

/**
 * Save clinic notifications
 * @param {Array} notifications - List of notifications
 * @returns {Promise<boolean>} - Success status
 */
export const saveClinicNotifications = async (notifications) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CLINIC_NOTIFICATIONS,
      JSON.stringify(notifications)
    );
    return true;
  } catch (error) {
    console.error('Error saving clinic notifications:', error);
    throw error;
  }
};

/**
 * Get clinic notifications
 * @returns {Promise<Array>} - List of notifications
 */
export const getClinicNotifications = async () => {
  try {
    const notifications = await AsyncStorage.getItem(
      STORAGE_KEYS.CLINIC_NOTIFICATIONS
    );
    return notifications ? JSON.parse(notifications) : [];
  } catch (error) {
    console.error('Error getting clinic notifications:', error);
    return [];
  }
};

/**
 * Add a notification
 * @param {Object} notification - Notification data
 * @returns {Promise<boolean>} - Success status
 */
export const addClinicNotification = async (notification) => {
  try {
    const notifications = await getClinicNotifications();
    notifications.unshift(notification); // Add to beginning
    await saveClinicNotifications(notifications);
    return true;
  } catch (error) {
    console.error('Error adding clinic notification:', error);
    throw error;
  }
};

/**
 * Clear all notifications
 * @returns {Promise<boolean>} - Success status
 */
export const clearClinicNotifications = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CLINIC_NOTIFICATIONS);
    return true;
  } catch (error) {
    console.error('Error clearing clinic notifications:', error);
    throw error;
  }
};

// ==================== SYNC MANAGEMENT ====================

/**
 * Save last sync timestamp
 * @returns {Promise<boolean>} - Success status
 */
export const updateLastSync = async () => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_SYNC,
      new Date().toISOString()
    );
    return true;
  } catch (error) {
    console.error('Error updating last sync:', error);
    throw error;
  }
};

/**
 * Get last sync timestamp
 * @returns {Promise<string|null>} - Last sync timestamp or null
 */
export const getLastSync = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  } catch (error) {
    console.error('Error getting last sync:', error);
    return null;
  }
};

// ==================== BULK OPERATIONS ====================

/**
 * Clear all clinic data from AsyncStorage
 * @returns {Promise<boolean>} - Success status
 */
export const clearAllClinicData = async () => {
  try {
    const keysToRemove = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keysToRemove);
    return true;
  } catch (error) {
    console.error('Error clearing all clinic data:', error);
    throw error;
  }
};

/**
 * Get all clinic data
 * @returns {Promise<Object>} - All clinic data
 */
export const getAllClinicData = async () => {
  try {
    const data = {
      profile: await getClinicProfile(),
      user: await getCurrentUser(),
      availability: await getClinicAvailability(),
      appointments: await getClinicAppointments(),
      settings: await getClinicSettings(),
      notifications: await getClinicNotifications(),
      lastSync: await getLastSync(),
    };
    return data;
  } catch (error) {
    console.error('Error getting all clinic data:', error);
    throw error;
  }
};

/**
 * Save all clinic data at once
 * @param {Object} data - All clinic data to save
 * @returns {Promise<boolean>} - Success status
 */
export const saveAllClinicData = async (data) => {
  try {
    if (data.profile) await saveClinicProfile(data.profile);
    if (data.user) await saveCurrentUser(data.user);
    if (data.availability) await saveClinicAvailability(data.availability);
    if (data.appointments) await saveClinicAppointments(data.appointments);
    if (data.settings) await saveClinicSettings(data.settings);
    if (data.notifications) await saveClinicNotifications(data.notifications);
    await updateLastSync();
    return true;
  } catch (error) {
    console.error('Error saving all clinic data:', error);
    throw error;
  }
};
