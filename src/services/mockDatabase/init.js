import AsyncStorage from '@react-native-async-storage/async-storage';
import { TABLES, SEED_DATA } from './constants';

export const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Check if database is already initialized
    const isInitialized = await AsyncStorage.getItem('DB_INITIALIZED');
    
    if (isInitialized) {
      console.log('✅ Database already initialized');
      return true;
    }
    
    // Seed initial data
    await seedServices();
    await seedFAQ();
    
    // Mark database as initialized
    await AsyncStorage.setItem('DB_INITIALIZED', 'true');
    
    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    return false;
  }
};

const seedServices = async () => {
  try {
    // Clear old services first
    const keys = await AsyncStorage.getAllKeys();
    const oldServiceKeys = keys.filter(key => key.startsWith(TABLES.SERVICES));
    if (oldServiceKeys.length > 0) {
      await AsyncStorage.multiRemove(oldServiceKeys);
    }
    
    // Seed new services
    for (const service of SEED_DATA.services) {
      const key = `${TABLES.SERVICES}_${service.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(service));
    }
    console.log('✅ Services seeded');
  } catch (error) {
    console.error('Error seeding services:', error);
  }
};

const seedFAQ = async () => {
  try {
    for (const faq of SEED_DATA.faq) {
      const key = `${TABLES.FAQ}_${faq.id}`;
      const exists = await AsyncStorage.getItem(key);
      
      if (!exists) {
        await AsyncStorage.setItem(key, JSON.stringify(faq));
      }
    }
    console.log('✅ FAQ seeded');
  } catch (error) {
    console.error('Error seeding FAQ:', error);
  }
};

export const clearAllData = async () => {
  try {
    console.log('🗑️  Clearing all database data...');
    
    const keys = await AsyncStorage.getAllKeys();
    const dbKeys = keys.filter(key => 
      !key.includes('persist:') && 
      !key.includes('persist_navigation') &&
      key !== 'DB_INITIALIZED'
    );
    
    if (dbKeys.length > 0) {
      await AsyncStorage.multiRemove(dbKeys);
    }
    
    await AsyncStorage.removeItem('DB_INITIALIZED');
    
    console.log('✅ Database cleared');
    return true;
  } catch (error) {
    console.error('Error clearing database:', error);
    return false;
  }
};

export const getDatabaseStats = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const dbKeys = keys.filter(key => 
      !key.includes('persist:') && 
      !key.includes('persist_navigation')
    );
    
    const stats = {
      totalKeys: dbKeys.length,
      services: dbKeys.filter(key => key.startsWith(TABLES.SERVICES)).length,
      appointments: dbKeys.filter(key => key.startsWith(TABLES.APPOINTMENTS)).length,
      availability: dbKeys.filter(key => key.startsWith(TABLES.AVAILABILITY) && !key.includes('_slot_')).length,
      documents: dbKeys.filter(key => key.startsWith(TABLES.DOCUMENTS)).length,
      profiles: dbKeys.filter(key => key.startsWith(TABLES.PROFILES)).length,
      faq: dbKeys.filter(key => key.startsWith(TABLES.FAQ)).length,
      notifications: dbKeys.filter(key => key.startsWith(TABLES.NOTIFICATIONS)).length,
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting database stats:', error);
    return null;
  }
};

export const resetDatabase = async () => {
  try {
    console.log('🔄 Resetting database...');
    await clearAllData();
    await initializeDatabase();
    console.log('✅ Database reset complete');
    return true;
  } catch (error) {
    console.error('Error resetting database:', error);
    return false;
  }
};
