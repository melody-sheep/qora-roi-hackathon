import AsyncStorage from '@react-native-async-storage/async-storage';
import { TABLES } from './constants';

// Clear all mock database data
export const clearAllData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const mockKeys = keys.filter(key => 
      key.startsWith('qora_') || 
      key === 'qora_db_initialized'
    );
    
    if (mockKeys.length > 0) {
      await AsyncStorage.multiRemove(mockKeys);
    }
    
    return { success: true, cleared: mockKeys.length };
  } catch (error) {
    console.error('Error clearing all data:', error);
    return { success: false, error: error.message };
  }
};

// Export all data for backup
export const exportData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const mockKeys = keys.filter(key => key.startsWith('qora_'));
    const items = await AsyncStorage.multiGet(mockKeys);
    
    const data = {};
    items.forEach(([key, value]) => {
      try {
        data[key] = JSON.parse(value);
      } catch {
        data[key] = value;
      }
    });
    
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      itemCount: items.length
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    return { success: false, error: error.message };
  }
};

// Import data from backup
export const importData = async (data) => {
  try {
    // Clear existing data first
    await clearAllData();
    
    // Import new data
    const entries = Object.entries(data);
    const setPromises = entries.map(([key, value]) => {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      return AsyncStorage.setItem(key, stringValue);
    });
    
    await Promise.all(setPromises);
    
    return {
      success: true,
      imported: entries.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error importing data:', error);
    return { success: false, error: error.message };
  }
};

// Synchronize clinic and student data
export const syncData = async () => {
  try {
    // This function would normally sync with a real backend
    // For mock database, we just ensure data consistency
    
    const syncReport = {
      timestamp: new Date().toISOString(),
      checks: [],
      issues: []
    };
    
    // Check appointment-availability consistency
    const appointments = await getAllAppointments();
    const availability = await getAllAvailability();
    
    // Verify each appointment has valid availability
    for (const appointment of appointments) {
      if (appointment.availabilityId) {
        const avail = availability.find(a => a.id === appointment.availabilityId);
        if (!avail) {
          syncReport.issues.push({
            type: 'orphaned_appointment',
            appointmentId: appointment.id,
            availabilityId: appointment.availabilityId
          });
        }
      }
    }
    
    // Update sync timestamp
    await AsyncStorage.setItem('qora_last_sync', new Date().toISOString());
    
    syncReport.lastSync = new Date().toISOString();
    syncReport.status = syncReport.issues.length === 0 ? 'clean' : 'needs_attention';
    
    return { success: true, report: syncReport };
  } catch (error) {
    console.error('Error syncing data:', error);
    return { success: false, error: error.message };
  }
};

// Get data statistics for dashboard
export const getDatabaseStats = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    
    const stats = {
      totalItems: keys.filter(key => key.startsWith('qora_')).length,
      appointments: keys.filter(key => key.startsWith(TABLES.APPOINTMENTS)).length,
      availability: keys.filter(key => key.startsWith(TABLES.AVAILABILITY) && !key.includes('_slot_')).length,
      availabilitySlots: keys.filter(key => key.includes('_slot_')).length,
      services: keys.filter(key => key.startsWith(TABLES.SERVICES)).length,
      documents: keys.filter(key => key.startsWith(TABLES.DOCUMENTS)).length,
      profiles: keys.filter(key => key.startsWith(TABLES.PROFILES)).length,
      faq: keys.filter(key => key.startsWith(TABLES.FAQ)).length,
      notifications: keys.filter(key => key.startsWith(TABLES.NOTIFICATIONS)).length,
      lastSync: await AsyncStorage.getItem('qora_last_sync'),
      initialized: await AsyncStorage.getItem('qora_db_initialized') === 'true'
    };
    
    return { success: true, stats };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return { success: false, error: error.message };
  }
};

// Helper functions for sync
const getAllAppointments = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appointmentKeys = keys.filter(key => key.startsWith(TABLES.APPOINTMENTS));
    const items = await AsyncStorage.multiGet(appointmentKeys);
    
    return items.map(([key, value]) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }).filter(item => item !== null);
  } catch (error) {
    console.error('Error getting all appointments:', error);
    return [];
  }
};

const getAllAvailability = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const availabilityKeys = keys.filter(key => 
      key.startsWith(TABLES.AVAILABILITY) && !key.includes('_slot_')
    );
    const items = await AsyncStorage.multiGet(availabilityKeys);
    
    return items.map(([key, value]) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }).filter(item => item !== null);
  } catch (error) {
    console.error('Error getting all availability:', error);
    return [];
  }
};