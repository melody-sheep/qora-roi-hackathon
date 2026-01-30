import AsyncStorage from '@react-native-async-storage/async-storage';
import { TABLES } from './constants';

// Generate unique ID
const generateId = () => `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// APPOINTMENT STATUSES: 'waiting', 'confirmed', 'in-progress', 'completed', 'cancelled'

export const createAppointment = async (appointmentData) => {
  try {
    const id = generateId();
    const appointment = {
      id,
      ...appointmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(
      `${TABLES.APPOINTMENTS}_${id}`,
      JSON.stringify(appointment)
    );
    
    // Create notification for clinic
    await createNotification({
      id: `notif_${Date.now()}`,
      type: 'new_appointment',
      title: 'New Appointment',
      message: `New booking from ${appointmentData.patientName}`,
      clinicId: appointmentData.clinicId,
      appointmentId: id,
      read: false,
      createdAt: new Date().toISOString()
    });
    
    // Update availability slot count
    if (appointmentData.availabilityId) {
      const availability = await getAvailabilityById(appointmentData.availabilityId);
      if (availability) {
        const updatedSlots = Math.max(0, availability.availableSlots - 1);
        await updateAvailability(appointmentData.availabilityId, {
          availableSlots: updatedSlots,
          bookedSlots: (availability.bookedSlots || 0) + 1
        });
      }
    }
    
    return { success: true, id, appointment };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { success: false, error: error.message };
  }
};

export const getAppointments = async (filters = {}) => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appointmentKeys = keys.filter(key => key.startsWith(TABLES.APPOINTMENTS));
    const items = await AsyncStorage.multiGet(appointmentKeys);
    
    let appointments = items.map(([key, value]) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }).filter(item => item !== null);
    
    // Apply filters
    if (filters.clinicId) {
      appointments = appointments.filter(apt => apt.clinicId === filters.clinicId);
    }
    
    if (filters.studentId) {
      appointments = appointments.filter(apt => apt.studentId === filters.studentId);
    }
    
    if (filters.status) {
      appointments = appointments.filter(apt => apt.status === filters.status);
    }
    
    if (filters.date) {
      appointments = appointments.filter(apt => 
        apt.date === filters.date || apt.appointmentDate === filters.date
      );
    }
    
    // Sort by date/time
    appointments.sort((a, b) => {
      const timeA = a.time || a.startTime || '';
      const timeB = b.time || b.startTime || '';
      return timeA.localeCompare(timeB);
    });
    
    return appointments;
  } catch (error) {
    console.error('Error getting appointments:', error);
    return [];
  }
};

export const getAppointmentsByClinic = async (clinicId) => {
  return getAppointments({ clinicId });
};

export const getAppointmentsByUser = async (userId, userType = 'student') => {
  const filter = userType === 'student' 
    ? { studentId: userId }
    : { doctorId: userId };
  return getAppointments(filter);
};

export const updateAppointment = async (appointmentId, updates) => {
  try {
    const key = `${TABLES.APPOINTMENTS}_${appointmentId}`;
    const existing = await AsyncStorage.getItem(key);
    
    if (!existing) {
      return { success: false, error: 'Appointment not found' };
    }
    
    const appointment = JSON.parse(existing);
    const updatedAppointment = {
      ...appointment,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(key, JSON.stringify(updatedAppointment));
    
    // Create notification if status changed
    if (updates.status && updates.status !== appointment.status) {
      await createNotification({
        id: `notif_${Date.now()}`,
        type: 'appointment_update',
        title: 'Appointment Updated',
        message: `Appointment status changed to ${updates.status}`,
        clinicId: appointment.clinicId,
        studentId: appointment.studentId,
        appointmentId: appointmentId,
        read: false,
        createdAt: new Date().toISOString()
      });
    }
    
    return { success: true, appointment: updatedAppointment };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return { success: false, error: error.message };
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    // First get the appointment to release availability slot
    const key = `${TABLES.APPOINTMENTS}_${appointmentId}`;
    const appointment = JSON.parse(await AsyncStorage.getItem(key) || 'null');
    
    if (appointment && appointment.availabilityId) {
      const availability = await getAvailabilityById(appointment.availabilityId);
      if (availability) {
        const updatedSlots = availability.availableSlots + 1;
        await updateAvailability(appointment.availabilityId, {
          availableSlots: updatedSlots,
          bookedSlots: Math.max(0, (availability.bookedSlots || 0) - 1)
        });
      }
    }
    
    await AsyncStorage.removeItem(key);
    
    // Create notification
    await createNotification({
      id: `notif_${Date.now()}`,
      type: 'appointment_cancelled',
      title: 'Appointment Cancelled',
      message: 'An appointment has been cancelled',
      clinicId: appointment?.clinicId,
      appointmentId: appointmentId,
      read: false,
      createdAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return { success: false, error: error.message };
  }
};

// Helper function (defined in availability.js)
const getAvailabilityById = async (id) => {
  try {
    const key = `${TABLES.AVAILABILITY}_${id}`;
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting availability:', error);
    return null;
  }
};

// Helper function (defined in availability.js)
const updateAvailability = async (id, updates) => {
  try {
    const key = `${TABLES.AVAILABILITY}_${id}`;
    const existing = await AsyncStorage.getItem(key);
    
    if (!existing) {
      return { success: false, error: 'Availability not found' };
    }
    
    const availability = JSON.parse(existing);
    const updated = {
      ...availability,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(key, JSON.stringify(updated));
    return { success: true, availability: updated };
  } catch (error) {
    console.error('Error updating availability:', error);
    return { success: false, error: error.message };
  }
};

// Helper function (defined in notifications.js)
const createNotification = async (notificationData) => {
  try {
    await AsyncStorage.setItem(
      `${TABLES.NOTIFICATIONS}_${notificationData.id}`,
      JSON.stringify(notificationData)
    );
    return { success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false };
  }
};