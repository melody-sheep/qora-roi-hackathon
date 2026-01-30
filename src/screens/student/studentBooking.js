import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock doctors data
const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Maria Santos',
    specialty: 'Dentist',
    service: 'dental',
    rating: 4.8,
    experience: '8 years',
    availableSlots: [
      { id: 's1', date: '2026-01-31', time: '09:00 AM - 09:30 AM', available: true },
      { id: 's2', date: '2026-01-31', time: '10:00 AM - 10:30 AM', available: true },
      { id: 's3', date: '2026-01-31', time: '02:00 PM - 02:30 PM', available: false },
      { id: 's4', date: '2026-02-01', time: '11:00 AM - 11:30 AM', available: true },
    ],
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
  },
  {
    id: '2',
    name: 'Dr. James Wilson',
    specialty: 'General Physician',
    service: 'medical',
    rating: 4.9,
    experience: '12 years',
    availableSlots: [
      { id: 's5', date: '2026-01-31', time: '08:30 AM - 09:00 AM', available: true },
      { id: 's6', date: '2026-01-31', time: '01:00 PM - 01:30 PM', available: true },
      { id: 's7', date: '2026-02-01', time: '10:00 AM - 10:30 AM', available: true },
    ],
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '3',
    name: 'Dr. Sarah Johnson',
    specialty: 'Pediatric Dentist',
    service: 'dental',
    rating: 4.7,
    experience: '6 years',
    availableSlots: [
      { id: 's8', date: '2026-01-31', time: '03:00 PM - 03:30 PM', available: true },
      { id: 's9', date: '2026-02-01', time: '09:30 AM - 10:00 AM', available: true },
    ],
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: '4',
    name: 'Dr. Robert Chen',
    specialty: 'Cardiologist',
    service: 'medical',
    rating: 4.9,
    experience: '15 years',
    availableSlots: [
      { id: 's10', date: '2026-02-01', time: '02:00 PM - 02:30 PM', available: true },
      { id: 's11', date: '2026-02-02', time: '11:00 AM - 11:30 AM', available: true },
    ],
    image: 'https://randomuser.me/api/portraits/men/54.jpg',
  },
];

// AsyncStorage keys
const APPOINTMENTS_KEY = '@student_appointments';
const BOOKED_SLOTS_KEY = '@booked_slots';

// Appointment service functions
const appointmentService = {
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
        appointmentNumber: `AP-${new Date().getFullYear()}-${String(appointments.length + 1).padStart(3, '0')}`, // Add this
      };
      
      const updatedAppointments = [newAppointment, ...appointments];
      await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updatedAppointments));
      
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

export default function StudentBooking() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedService, setSelectedService] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [appointmentNotes, setAppointmentNotes] = useState('');
  
  // Dates for selection
  const dates = [
    { id: 'today', label: 'Today', date: new Date() },
    { id: 'tomorrow', label: 'Tomorrow', date: new Date(Date.now() + 86400000) },
    { id: 'day3', label: 'Feb 2', date: new Date(Date.now() + 172800000) },
    { id: 'day4', label: 'Feb 3', date: new Date(Date.now() + 259200000) },
    { id: 'day5', label: 'Feb 4', date: new Date(Date.now() + 345600000) },
  ];

  const services = [
    { id: 'all', label: 'All Services', icon: 'medkit-outline' },
    { id: 'medical', label: 'Medical', icon: 'medical-outline' },
    { id: 'dental', label: 'Dental', icon: 'fitness-outline' },
  ];

  const loadAvailabilityData = async () => {
    setLoading(true);
    try {
      // Get booked slots from AsyncStorage
      const slots = await appointmentService.getBookedSlots();
      setBookedSlots(slots);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load availability data');
    } finally {
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 500);
    }
  };

  useEffect(() => {
    loadAvailabilityData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadAvailabilityData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadAvailabilityData();
  };

  // Check if a slot is booked
  const isSlotBooked = (slotId) => {
    return bookedSlots.some(slot => slot.slotId === slotId);
  };

  // Get available slots for a doctor (excluding booked ones)
  const getAvailableSlotsForDoctor = (doctor) => {
    return doctor.availableSlots.filter(slot => 
      slot.available && !isSlotBooked(slot.id)
    );
  };

  const handleBookSlot = (doctor, slot) => {
    setSelectedSlot(slot);
    setBookingDetails({
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorImage: doctor.image,
      service: doctor.service === 'medical' ? 'Medical Consultation' : 'Dental Check-up',
      date: slot.date,
      time: slot.time,
      slotId: slot.id,
      doctorId: doctor.id,
    });
    setAppointmentNotes(''); // Reset notes
    setBookingModalVisible(true);
  };

  const confirmBooking = async () => {
    try {
      const appointmentData = {
        doctorName: bookingDetails.doctorName,
        doctorSpecialty: bookingDetails.doctorSpecialty,
        doctorImage: bookingDetails.doctorImage,
        service: bookingDetails.service,
        date: bookingDetails.date,
        time: bookingDetails.time,
        slotId: bookingDetails.slotId,
        doctorId: bookingDetails.doctorId,
        location: 'USTP Medical and Dental Clinic',
        duration: '30 minutes',
        notes: appointmentNotes || 'Regular appointment',
      };

      // Save appointment to AsyncStorage
      const newAppointment = await appointmentService.addAppointment(appointmentData);
      
      setBookingModalVisible(false);
      setAppointmentNotes('');
      
      // Refresh slots to show booked slot as unavailable
      await loadAvailabilityData();
      
      Alert.alert(
        '✅ Booking Successful!',
        `Your appointment with ${bookingDetails.doctorName} has been confirmed for ${formatDate(bookingDetails.date)} at ${bookingDetails.time}`,
        [
          {
            text: 'View Appointment',
            onPress: () => {
              navigation.navigate('StudentAppointment');
            },
          },
          {
            text: 'Book Another',
            onPress: () => {
              // Do nothing, just close
            },
          },
        ]
      );
      
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    }
  };

  const filteredDoctors = selectedService === 'all' 
    ? mockDoctors 
    : mockDoctors.filter(doctor => doctor.service === selectedService);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getServiceIcon = (service) => {
    return service === 'medical' ? 'medical-outline' : 'fitness-outline';
  };

  const getServiceColor = (service) => {
    return service === 'medical' ? '#3B82F6' : '#10B981';
  };

  const renderDoctorCard = ({ item: doctor }) => {
    const availableSlots = getAvailableSlotsForDoctor(doctor);
    const availableSlotsCount = availableSlots.length;
    
    return (
      <View style={styles.doctorCard}>
        <View style={styles.doctorHeader}>
          <View style={styles.doctorImageContainer}>
            <Image 
              source={{ uri: doctor.image }} 
              style={styles.doctorImage}
              defaultSource={require('../../../assets/doctor_placeholder.jpg')}
            />
            <View style={[styles.serviceBadge, { backgroundColor: getServiceColor(doctor.service) + '20' }]}>
              <Ionicons 
                name={getServiceIcon(doctor.service)} 
                size={16} 
                color={getServiceColor(doctor.service)} 
              />
            </View>
          </View>
          
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
            
            <View style={styles.doctorStats}>
              <View style={styles.stat}>
                <Ionicons name="briefcase" size={14} color="#6B7280" />
                <Text style={styles.statText}>{doctor.experience}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="time" size={14} color="#6B7280" />
                <Text style={styles.statText}>{availableSlotsCount} slots</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.slotsSection}>
          <Text style={styles.slotsTitle}>Available Slots</Text>
          
          {availableSlotsCount === 0 ? (
            <View style={styles.noSlotsContainer}>
              <Ionicons name="time-outline" size={24} color="#CBD5E1" />
              <Text style={styles.noSlotsText}>No available slots</Text>
            </View>
          ) : (
            <>
              <View style={styles.slotsGrid}>
                {availableSlots
                  .slice(0, 3)
                  .map((slot) => (
                    <TouchableOpacity
                      key={slot.id}
                      style={styles.slotButton}
                      onPress={() => handleBookSlot(doctor, slot)}
                    >
                      <Text style={styles.slotTime}>{slot.time.split(' - ')[0]}</Text>
                      <Text style={styles.slotDuration}>30 min</Text>
                      <View style={styles.slotBadge}>
                        <Ionicons name="calendar-outline" size={12} color="#2563EB" />
                        <Text style={styles.slotDateText}>{formatDate(slot.date)}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
              
              {availableSlotsCount > 3 && (
                <TouchableOpacity style={styles.viewMoreButton}>
                  <Text style={styles.viewMoreText}>
                    +{availableSlotsCount - 3} more slots
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#2563EB" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    );
  };

  // Reset data for testing (long press on title)
  const resetDataForTesting = async () => {
    Alert.alert(
      'Reset Data',
      'This will clear all appointments and booked slots. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await appointmentService.clearAllData();
            loadAvailabilityData();
            Alert.alert('Success', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading available slots...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity onLongPress={resetDataForTesting} delayLongPress={2000}>
            <Text style={styles.headerTitle}>Available Doctors</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="options-outline" size={24} color="#1E293B" />
          </TouchableOpacity>
        </View>

        {/* SERVICE FILTERS */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.servicesScroll}
          contentContainerStyle={styles.servicesContainer}
        >
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceFilter,
                selectedService === service.id && styles.serviceFilterActive,
              ]}
              onPress={() => setSelectedService(service.id)}
            >
              <Ionicons 
                name={service.icon} 
                size={20} 
                color={selectedService === service.id ? '#2563EB' : '#64748B'} 
              />
              <Text style={[
                styles.serviceFilterText,
                selectedService === service.id && styles.serviceFilterTextActive,
              ]}>
                {service.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* DATE SELECTOR */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.datesScroll}
          contentContainerStyle={styles.datesContainer}
        >
          {dates.map((date) => (
            <TouchableOpacity
              key={date.id}
              style={[
                styles.dateButton,
                selectedDate.toDateString() === date.date.toDateString() && styles.dateButtonActive,
              ]}
              onPress={() => setSelectedDate(date.date)}
            >
              <Text style={[
                styles.dateButtonText,
                selectedDate.toDateString() === date.date.toDateString() && styles.dateButtonTextActive,
              ]}>
                {date.label}
              </Text>
              <Text style={[
                styles.dateButtonDay,
                selectedDate.toDateString() === date.date.toDateString() && styles.dateButtonDayActive,
              ]}>
                {date.date.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* DOCTORS LIST */}
      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctorCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.doctorsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563EB']}
          />
        }
        ListHeaderComponent={
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>
              {filteredDoctors.length} {selectedService === 'all' ? 'Doctors' : selectedService === 'medical' ? 'Medical Doctors' : 'Dentists'} Available
            </Text>
            <Text style={styles.statsSubtitle}>
              Real-time availability • 30-minute slots • Free for students
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyStateTitle}>No Available Slots</Text>
            <Text style={styles.emptyStateText}>
              No doctors are available for {selectedService === 'all' ? 'selected services' : selectedService} on the selected date.
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => setSelectedService('all')}
            >
              <Text style={styles.emptyStateButtonText}>Show All Services</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* BOOKING MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bookingModalVisible}
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Appointment</Text>
              <TouchableOpacity onPress={() => setBookingModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Doctor Info */}
            <View style={styles.modalDoctorInfo}>
              <Image 
                source={{ uri: bookingDetails.doctorImage }} 
                style={styles.modalDoctorImage}
              />
              <View style={styles.modalDoctorDetails}>
                <Text style={styles.modalDoctorName}>{bookingDetails.doctorName}</Text>
                <Text style={styles.modalDoctorSpecialty}>{bookingDetails.doctorSpecialty}</Text>
                <View style={styles.modalServiceBadge}>
                  <Ionicons 
                    name={bookingDetails.service?.includes('Medical') ? 'medical-outline' : 'fitness-outline'} 
                    size={16} 
                    color="#2563EB" 
                  />
                  <Text style={styles.modalServiceText}>{bookingDetails.service}</Text>
                </View>
              </View>
            </View>

            {/* Appointment Details */}
            <View style={styles.appointmentDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={20} color="#64748B" />
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{formatDate(bookingDetails.date)}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={20} color="#64748B" />
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Time Slot</Text>
                  <Text style={styles.detailValue}>{bookingDetails.time}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="timer-outline" size={20} color="#64748B" />
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>30 minutes</Text>
                </View>
              </View>
            </View>

            {/* Additional Notes */}
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Additional Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Any symptoms, concerns, or special requests..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={appointmentNotes}
                onChangeText={setAppointmentNotes}
              />
            </View>

            {/* Booking Policy */}
            <View style={styles.policySection}>
              <View style={styles.policyItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.policyText}>Free for verified students</Text>
              </View>
              <View style={styles.policyItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.policyText}>Cancel up to 24 hours before</Text>
              </View>
              <View style={styles.policyItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.policyText}>Bring your student ID</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => {
                  setBookingModalVisible(false);
                  setAppointmentNotes('');
                }}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmBookingButton}
                onPress={confirmBooking}
              >
                <Text style={styles.confirmBookingText}>Confirm Booking</Text>
                <Ionicons name="checkmark-circle" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* FILTER MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.comingSoonText}>
              Advanced filters coming soon!
            </Text>
            
            <TouchableOpacity 
              style={styles.applyFiltersButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.applyFiltersText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
    minWidth:160
  },
  
  // HEADER
  header: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  filterButton: {
    padding: 8,
  },
  
  // SERVICE FILTERS
  servicesScroll: {
    marginBottom: 16,
  },
  servicesContainer: {
    paddingHorizontal: 20,
  },
  serviceFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  serviceFilterActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  serviceFilterText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  serviceFilterTextActive: {
    color: '#2563EB',
  },
  
  // DATE SELECTOR
  datesScroll: {
    marginBottom: 8,
  },
  datesContainer: {
    paddingHorizontal: 20,
  },
  dateButton: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginRight: 12,
    minWidth: 70,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  dateButtonText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  dateButtonTextActive: {
    color: 'white',
  },
  dateButtonDay: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  dateButtonDayActive: {
    color: 'white',
  },
  
  // STATS HEADER
  statsHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  
  doctorsList: {
    paddingBottom: 40,
  },
  
  doctorCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    paddingBottom:0,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  doctorHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  doctorImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  serviceBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  doctorStats: {
    flexDirection: 'row',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '600',
  },
  
  // SLOTS SECTION
  slotsSection: {
    marginBottom: 20,
  },
  slotsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  slotButton: {
    width: '31%',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: '1%',
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  slotTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 2,
  },
  slotDuration: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 6,
  },
  slotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  slotDateText: {
    fontSize: 10,
    color: '#1E40AF',
    marginLeft: 4,
    fontWeight: '600',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  viewMoreText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  
  // NO SLOTS CONTAINER
  noSlotsContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noSlotsText: {
    marginTop: 8,
    color: '#94A3B8',
    fontSize: 14,
  },
  
  // EMPTY STATE
  emptyState: {
    alignItems: 'center',
    padding: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyStateButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  
  // MODAL DOCTOR INFO
  modalDoctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalDoctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  modalDoctorDetails: {
    flex: 1,
  },
  modalDoctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  modalDoctorSpecialty: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  modalServiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  modalServiceText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 6,
  },
  
  // APPOINTMENT DETAILS
  appointmentDetails: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailInfo: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  
  // NOTES SECTION
  notesSection: {
    marginBottom: 24,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  
  // POLICY SECTION
  policySection: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  policyText: {
    fontSize: 13,
    color: '#0C4A6E',
    marginLeft: 8,
    flex: 1,
  },
  
  // MODAL ACTIONS
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelModalButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelModalText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmBookingButton: {
    flex: 2,
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 8,
  },
  confirmBookingText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  
  // FILTER MODAL
  filterModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '60%',
  },
  comingSoonText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 16,
    marginVertical: 40,
  },
  applyFiltersButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  applyFiltersText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
