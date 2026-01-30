// src/utils/appointmentService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const APPOINTMENTS_KEY = '@student_appointments';
const BOOKED_SLOTS_KEY = '@booked_slots';

export const appointmentService = {
  // Get all appointments
  async getAppointments() {
    try {
      const jsonValue = await AsyncStorage.getItem(APPOINTMENTS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error getting appointments:', error);
      return [];
    }
  },

  // Add a new appointment
  async addAppointment(appointment) {
    try {
      const appointments = await this.getAppointments();
      const newAppointment = {
        ...appointment,
        id: `AP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'confirmed',
        location: appointment.location || 'USTP Medical and Dental Clinic',
        duration: appointment.duration || '30 minutes',
        appointmentNumber: `AP-${new Date().getFullYear()}-${String(appointments.length + 1).padStart(3, '0')}`,
        notes: appointment.notes || 'Regular appointment'
      };
      
      const updatedAppointments = [newAppointment, ...appointments];
      await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updatedAppointments));
      
      // Also add to booked slots
      await this.addBookedSlot({
        doctorId: appointment.doctorId,
        slotId: appointment.slotId,
        date: appointment.date,
        time: appointment.time
      });
      
      return newAppointment;
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  },

  // Update appointment status
  async updateAppointmentStatus(appointmentId, status, notes = '') {
    try {
      const appointments = await this.getAppointments();
      const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
      
      if (appointmentIndex !== -1) {
        const updatedAppointment = {
          ...appointments[appointmentIndex],
          status,
          ...(status === 'cancelled' && { 
            cancelledAt: new Date().toISOString().split('T')[0],
            notes: notes || appointments[appointmentIndex].notes
          }),
          ...(status === 'completed' && { 
            notes: notes || appointments[appointmentIndex].notes
          })
        };
        
        appointments[appointmentIndex] = updatedAppointment;
        await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
        
        // If cancelled, remove from booked slots
        if (status === 'cancelled') {
          await this.removeBookedSlot(updatedAppointment.slotId);
        }
        
        return updatedAppointment;
      }
      return null;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  // Get booked slots
  async getBookedSlots() {
    try {
      const jsonValue = await AsyncStorage.getItem(BOOKED_SLOTS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error getting booked slots:', error);
      return [];
    }
  },

  // Add a booked slot
  async addBookedSlot(slot) {
    try {
      const bookedSlots = await this.getBookedSlots();
      const updatedSlots = [...bookedSlots, slot];
      await AsyncStorage.setItem(BOOKED_SLOTS_KEY, JSON.stringify(updatedSlots));
      return slot;
    } catch (error) {
      console.error('Error adding booked slot:', error);
      throw error;
    }
  },

  // Remove a booked slot
  async removeBookedSlot(slotId) {
    try {
      const bookedSlots = await this.getBookedSlots();
      const updatedSlots = bookedSlots.filter(slot => slot.slotId !== slotId);
      await AsyncStorage.setItem(BOOKED_SLOTS_KEY, JSON.stringify(updatedSlots));
      return true;
    } catch (error) {
      console.error('Error removing booked slot:', error);
      throw error;
    }
  },

  // Check if a slot is booked
  async isSlotBooked(slotId) {
    try {
      const bookedSlots = await this.getBookedSlots();
      return bookedSlots.some(slot => slot.slotId === slotId);
    } catch (error) {
      console.error('Error checking slot:', error);
      return false;
    }
  },

  // Clear all data (for testing/reset)
  async clearAllData() {
    try {
      await AsyncStorage.removeItem(APPOINTMENTS_KEY);
      await AsyncStorage.removeItem(BOOKED_SLOTS_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
};