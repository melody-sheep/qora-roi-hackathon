import AsyncStorage from '@react-native-async-storage/async-storage';
import { TABLES, SEED_DATA } from './constants';

export const getServices = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const serviceKeys = keys.filter(key => key.startsWith(TABLES.SERVICES));
    
    if (serviceKeys.length === 0) {
      // Seed initial services if none exist
      await seedServices();
      return SEED_DATA.services;
    }
    
    const items = await AsyncStorage.multiGet(serviceKeys);
    const services = items.map(([key, value]) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }).filter(item => item !== null);
    
    // Sort by name
    services.sort((a, b) => a.name.localeCompare(b.name));
    
    return services;
  } catch (error) {
    console.error('Error getting services:', error);
    // Return seed data as fallback
    return SEED_DATA.services;
  }
};

export const getServiceById = async (serviceId) => {
  try {
    const key = `${TABLES.SERVICES}_${serviceId}`;
    const service = await AsyncStorage.getItem(key);
    
    if (!service) {
      // Check if it's in seed data
      const seedService = SEED_DATA.services.find(s => s.id === serviceId);
      if (seedService) {
        // Save it for future use
        await AsyncStorage.setItem(key, JSON.stringify(seedService));
        return seedService;
      }
      return null;
    }
    
    return JSON.parse(service);
  } catch (error) {
    console.error('Error getting service by ID:', error);
    return null;
  }
};

export const createService = async (serviceData) => {
  try {
    const id = `service_${Date.now()}`;
    const service = {
      id,
      ...serviceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(
      `${TABLES.SERVICES}_${id}`,
      JSON.stringify(service)
    );
    
    return { success: true, id, service };
  } catch (error) {
    console.error('Error creating service:', error);
    return { success: false, error: error.message };
  }
};

export const updateService = async (serviceId, updates) => {
  try {
    const key = `${TABLES.SERVICES}_${serviceId}`;
    const existing = await AsyncStorage.getItem(key);
    
    if (!existing) {
      return { success: false, error: 'Service not found' };
    }
    
    const service = JSON.parse(existing);
    const updatedService = {
      ...service,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(key, JSON.stringify(updatedService));
    return { success: true, service: updatedService };
  } catch (error) {
    console.error('Error updating service:', error);
    return { success: false, error: error.message };
  }
};

export const deleteService = async (serviceId) => {
  try {
    await AsyncStorage.removeItem(`${TABLES.SERVICES}_${serviceId}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to seed initial services
const seedServices = async () => {
  try {
    for (const service of SEED_DATA.services) {
      await AsyncStorage.setItem(
        `${TABLES.SERVICES}_${service.id}`,
        JSON.stringify(service)
      );
    }
    console.log('Services seeded successfully');
  } catch (error) {
    console.error('Error seeding services:', error);
  }
};