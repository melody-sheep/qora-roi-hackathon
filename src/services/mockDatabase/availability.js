import AsyncStorage from '@react-native-async-storage/async-storage';
import { TABLES, SEED_DATA } from './constants';

// Generate unique ID
const generateId = () => `avail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper function to generate time slots
const generateTimeSlots = (startTime, endTime, interval = 60) => {
  const slots = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMinute = startMinute;
  
  while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    slots.push(timeString);
    
    currentMinute += interval;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
  }
  
  return slots;
};

export const createAvailability = async (availabilityData) => {
  try {
    const id = generateId();
    const timeSlots = generateTimeSlots(availabilityData.startTime, availabilityData.endTime);
    
    const availability = {
      id,
      clinicId: availabilityData.clinicId || 'clinic_1', // Default clinic
      doctorId: availabilityData.doctorId || 'doc_1', // Default doctor
      serviceId: availabilityData.serviceId,
      date: availabilityData.date,
      startTime: availabilityData.startTime,
      endTime: availabilityData.endTime,
      timeSlots,
      maxPatientsPerSlot: parseInt(availabilityData.maxPatientsPerSlot) || 1,
      availableSlots: timeSlots.length * (parseInt(availabilityData.maxPatientsPerSlot) || 1),
      bookedSlots: 0,
      isActive: availabilityData.isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(
      `${TABLES.AVAILABILITY}_${id}`,
      JSON.stringify(availability)
    );
    
    // Generate individual appointment slots for booking
    await generateAppointmentSlots(availability);
    
    return { 
      success: true, 
      id, 
      availability,
      slotsGenerated: availability.availableSlots
    };
  } catch (error) {
    console.error('Error creating availability:', error);
    return { success: false, error: error.message };
  }
};

// Generate individual appointment slots for easy booking
const generateAppointmentSlots = async (availability) => {
  try {
    const slotPromises = availability.timeSlots.map(async (slotTime, index) => {
      const slotId = `${availability.id}_slot_${index}`;
      const slotData = {
        id: slotId,
        availabilityId: availability.id,
        clinicId: availability.clinicId,
        doctorId: availability.doctorId,
        serviceId: availability.serviceId,
        date: availability.date,
        time: slotTime,
        status: 'available',
        maxPatients: availability.maxPatientsPerSlot,
        currentPatients: 0,
        createdAt: new Date().toISOString()
      };
      
      await AsyncStorage.setItem(
        `${TABLES.AVAILABILITY}_slot_${slotId}`,
        JSON.stringify(slotData)
      );
    });
    
    await Promise.all(slotPromises);
    return { success: true };
  } catch (error) {
    console.error('Error generating slots:', error);
    return { success: false, error: error.message };
  }
};

export const getAvailability = async (filters = {}) => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const availabilityKeys = keys.filter(key => 
      key.startsWith(TABLES.AVAILABILITY) && !key.includes('_slot_')
    );
    const items = await AsyncStorage.multiGet(availabilityKeys);
    
    let availability = items.map(([key, value]) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }).filter(item => item !== null);
    
    // Apply filters
    if (filters.clinicId) {
      availability = availability.filter(avail => avail.clinicId === filters.clinicId);
    }
    
    if (filters.doctorId) {
      availability = availability.filter(avail => avail.doctorId === filters.doctorId);
    }
    
    if (filters.date) {
      availability = availability.filter(avail => avail.date === filters.date);
    }
    
    if (filters.serviceId) {
      availability = availability.filter(avail => avail.serviceId === filters.serviceId);
    }
    
    if (filters.isActive !== undefined) {
      availability = availability.filter(avail => avail.isActive === filters.isActive);
    }
    
    // Sort by date, then time
    availability.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
    
    return availability;
  } catch (error) {
    console.error('Error getting availability:', error);
    return [];
  }
};

export const getAvailableSlots = async (date, serviceId = null) => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const slotKeys = keys.filter(key => key.includes('_slot_'));
    const items = await AsyncStorage.multiGet(slotKeys);
    
    let slots = items.map(([key, value]) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }).filter(item => item !== null && item.status === 'available');
    
    // Filter by date
    slots = slots.filter(slot => slot.date === date);
    
    // Filter by service
    if (serviceId) {
      slots = slots.filter(slot => slot.serviceId === serviceId);
    }
    
    // Group by time and check capacity
    const groupedSlots = {};
    slots.forEach(slot => {
      if (!groupedSlots[slot.time]) {
        groupedSlots[slot.time] = {
          time: slot.time,
          maxPatients: slot.maxPatients,
          currentPatients: 0,
          slots: []
        };
      }
      groupedSlots[slot.time].slots.push(slot);
      groupedSlots[slot.time].currentPatients = groupedSlots[slot.time].slots.length;
    });
    
    // Convert to array and filter out fully booked slots
    const availableSlots = Object.values(groupedSlots)
      .filter(group => group.currentPatients < group.maxPatients)
      .map(group => ({
        time: group.time,
        available: group.maxPatients - group.currentPatients,
        total: group.maxPatients
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
    
    return availableSlots;
  } catch (error) {
    console.error('Error getting available slots:', error);
    return [];
  }
};

export const updateAvailability = async (availabilityId, updates) => {
  try {
    const key = `${TABLES.AVAILABILITY}_${availabilityId}`;
    const existing = await AsyncStorage.getItem(key);
    
    if (!existing) {
      return { success: false, error: 'Availability not found' };
    }
    
    const availability = JSON.parse(existing);
    const updatedAvailability = {
      ...availability,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(key, JSON.stringify(updatedAvailability));
    return { success: true, availability: updatedAvailability };
  } catch (error) {
    console.error('Error updating availability:', error);
    return { success: false, error: error.message };
  }
};

export const deleteAvailability = async (availabilityId) => {
  try {
    // Also delete associated appointment slots
    const keys = await AsyncStorage.getAllKeys();
    const slotKeys = keys.filter(key => key.includes(availabilityId));
    
    if (slotKeys.length > 0) {
      await AsyncStorage.multiRemove(slotKeys);
    }
    
    await AsyncStorage.removeItem(`${TABLES.AVAILABILITY}_${availabilityId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting availability:', error);
    return { success: false, error: error.message };
  }
};

// Helper function used by appointments.js
export const getAvailabilityById = async (id) => {
  try {
    const key = `${TABLES.AVAILABILITY}_${id}`;
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting availability by ID:', error);
    return null;
  }
};