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
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function StudentAppointment() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('upcoming'); // 'upcoming', 'past', 'cancelled'
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  // Mock appointments data
  const mockAppointments = [
    {
      id: '1',
      doctorName: 'Dr. Maria Santos',
      doctorSpecialty: 'Dentist',
      doctorImage: 'https://randomuser.me/api/portraits/women/45.jpg',
      service: 'Dental Check-up',
      date: '2026-02-8',
      time: '02:00 PM - 02:30 PM',
      status: 'confirmed',
      location: 'USTP Medical and Dental Clinic',
      duration: '30 minutes',
      appointmentNumber: 'AP-2026-001',
      notes: 'Regular dental cleaning and check-up',
      createdAt: '2026-01-30',
    },
    {
      id: '2',
      doctorName: 'Dr. James Wilson',
      doctorSpecialty: 'General Physician',
      doctorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      service: 'Medical Consultation',
      date: '2026-01-20',
      time: '10:00 AM - 10:30 AM',
      status: 'completed',
      location: 'USTP Medical and Dental Clinic',
      duration: '30 minutes',
      appointmentNumber: 'AP-2026-002',
      notes: 'Follow-up for cold symptoms',
      createdAt: '2026-01-18',
    },
    {
      id: '3',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialty: 'Pediatric Dentist',
      doctorImage: 'https://randomuser.me/api/portraits/women/68.jpg',
      service: 'Dental Consultation',
      date: '2026-01-15',
      time: '02:00 PM - 02:30 PM',
      status: 'completed',
      location: 'USTP Medical and Dental Clinic',
      duration: '30 minutes',
      appointmentNumber: 'AP-2026-003',
      notes: 'Completed successfully',
      createdAt: '2026-01-14',
    },
    {
      id: '4',
      doctorName: 'Dr. Robert Chen',
      doctorSpecialty: 'Cardiologist',
      doctorImage: 'https://randomuser.me/api/portraits/men/54.jpg',
      service: 'Cardiology Consultation',
      date: '2026-01-11',
      time: '11:00 AM - 11:30 AM',
      status: 'cancelled',
      location: 'USTP Medical and Dental Clinic',
      duration: '30 minutes',
      appointmentNumber: 'AP-2026-004',
      notes: 'Cancelled by student',
      createdAt: '2026-01-9',
      cancelledAt: '2026-01-18',
    },
    {
      id: '5',
      doctorName: 'Dr. James Wilson',
      doctorSpecialty: 'General Physician',
      doctorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      service: 'medical',
      date: '2026-01-8',
      time: '11:00 AM - 11:30 AM',
      status: 'completed',
      location: 'USTP Medical and Dental Clinic',
      duration: '30 minutes',
      appointmentNumber: 'AP-2026-004',
      notes: 'Completed successfully',
      createdAt: '2026-01-7',
    },
    {
      id: '6',
      doctorName: 'Dr. James Wilson',
      doctorSpecialty: 'General Physician',
      doctorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      service: 'medical',
      date: '2026-01-5',
      time: '11:00 AM - 11:30 AM',
      status: 'completed',
      location: 'USTP Medical and Dental Clinic',
      duration: '30 minutes',
      appointmentNumber: 'AP-2026-004',
      notes: 'Completed successfully',
      createdAt: '2026-01-3',
    },
    {
      id: '7',
      doctorName: 'Dr. Robert Chen',
      doctorSpecialty: 'Cardiologist',
      doctorImage: 'https://randomuser.me/api/portraits/men/54.jpg',
      service: 'Cardiology Consultation',
      date: '2025-12-15',
      time: '11:00 AM - 11:30 AM',
      status: 'completed',
      location: 'USTP Medical and Dental Clinic',
      duration: '30 minutes',
      appointmentNumber: 'AP-2026-004',
      notes: 'Completed successfully',
      createdAt: '2025-12-14',
    },
  ];

  const filters = [
    { id: 'upcoming', label: 'Upcoming', icon: 'calendar-outline' },
    { id: 'past', label: 'Past', icon: 'time-outline' },
    { id: 'cancelled', label: 'Cancelled', icon: 'close-circle-outline' },
    { id: 'all', label: 'All', icon: 'list-outline' },
  ];

  const loadAppointments = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadAppointments();
  };

  const filteredAppointments = selectedFilter === 'all' 
    ? mockAppointments 
    : mockAppointments.filter(apt => {
        if (selectedFilter === 'upcoming') {
          return apt.status === 'confirmed' && new Date(apt.date) >= new Date();
        }
        if (selectedFilter === 'past') {
          return apt.status === 'completed' || new Date(apt.date) < new Date();
        }
        if (selectedFilter === 'cancelled') {
          return apt.status === 'cancelled';
        }
        return true;
      });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'completed': return '#3B82F6';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return 'checkmark-circle';
      case 'completed': return 'checkmark-done-circle';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getServiceIcon = (service) => {
    return service.toLowerCase().includes('dental') ? 'fitness-outline' : 'medical-outline';
  };

  const getServiceColor = (service) => {
    return service.toLowerCase().includes('dental') ? '#10B981' : '#3B82F6';
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalVisible(true);
  };

  const confirmCancellation = () => {
    setCancelModalVisible(false);
    
    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel your appointment with ${selectedAppointment.doctorName}?`,
      [
        { text: 'No, Keep It', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // Simulate cancellation
            setTimeout(() => {
              Alert.alert(
                'Appointment Cancelled',
                `Your appointment on ${formatDate(selectedAppointment.date)} has been cancelled.`,
                [{ text: 'OK' }]
              );
              // In real app, update appointment status in backend
            }, 500);
          },
        },
      ]
    );
  };

  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailsModalVisible(true);
  };

  const renderAppointmentCard = ({ item: appointment }) => (
    <TouchableOpacity 
      style={styles.appointmentCard}
      onPress={() => viewAppointmentDetails(appointment)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.doctorInfo}>
          <Image 
            source={{ uri: appointment.doctorImage }} 
            style={styles.doctorImage}
          />
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{appointment.doctorName}</Text>
            <Text style={styles.doctorSpecialty}>{appointment.doctorSpecialty}</Text>
            <View style={styles.serviceBadge}>
              <Ionicons 
                name={getServiceIcon(appointment.service)} 
                size={14} 
                color={getServiceColor(appointment.service)} 
              />
              <Text style={styles.serviceText}>{appointment.service}</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) + '20' }]}>
          <Ionicons 
            name={getStatusIcon(appointment.status)} 
            size={14} 
            color={getStatusColor(appointment.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
            {appointment.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.appointmentDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#64748B" />
            <Text style={styles.detailLabel}>Date: </Text>
            <Text style={styles.detailValue}>{formatDate(appointment.date)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#64748B" />
            <Text style={styles.detailLabel}>Time: </Text>
            <Text style={styles.detailValue}>{appointment.time}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#64748B" />
            <Text style={styles.detailLabel}>Location: </Text>
            <Text style={styles.detailValue} numberOfLines={1}>{appointment.location}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardActions}>
        {appointment.status === 'confirmed' && new Date(appointment.date) >= new Date() && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={(e) => {
              e.stopPropagation();
              handleCancelAppointment(appointment);
            }}
          >
            <Ionicons name="close-circle" size={16} color="#EF4444" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={(e) => {
            e.stopPropagation();
            viewAppointmentDetails(appointment);
          }}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#2563EB" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading your appointments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Appointments</Text>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => navigation.navigate('StudentBooking')}
          >
            <Ionicons name="add-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {mockAppointments.filter(a => a.status === 'confirmed' && new Date(a.date) >= new Date()).length}
            </Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {mockAppointments.filter(a => a.status === 'completed' || new Date(a.date) < new Date()).length}
            </Text>
            <Text style={styles.statLabel}>Past</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {mockAppointments.filter(a => a.status === 'cancelled').length}
            </Text>
            <Text style={styles.statLabel}>Cancelled</Text>
          </View>
        </View>
      </View>

      {/* FILTERS */}
      <View style={styles.filtersContainer}>
        {filters.map((filter) => (
            <TouchableOpacity
            key={filter.id}
            style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
            >
            <Ionicons 
                name={filter.icon} 
                size={18} 
                color={selectedFilter === filter.id ? '#2563EB' : '#64748B'} 
            />
            <Text style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive,
            ]}>
                {filter.label}
            </Text>
            </TouchableOpacity>
        ))}
        </View>

      {/* APPOINTMENTS LIST */}
      <ScrollView
        style={styles.appointmentsContainer}
        contentContainerStyle={styles.appointmentsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563EB']}
            />
        }
        >
        <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
            {filteredAppointments.length} {selectedFilter === 'all' ? 'Appointments' : selectedFilter === 'upcoming' ? 'Upcoming' : selectedFilter === 'past' ? 'Past' : 'Cancelled'}
            </Text>
            <Text style={styles.listSubtitle}>
            Tap on any appointment to view details
            </Text>
        </View>

        {filteredAppointments.length === 0 ? (
            <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyStateTitle}>No Appointments</Text>
            <Text style={styles.emptyStateText}>
                {selectedFilter === 'upcoming' 
                ? "You don't have any upcoming appointments."
                : selectedFilter === 'past'
                ? "You don't have any past appointments."
                : selectedFilter === 'cancelled'
                ? "You haven't cancelled any appointments."
                : "You don't have any appointments yet."}
            </Text>
            <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('StudentBooking')}
            >
                <Ionicons name="add-circle" size={20} color="white" />
                <Text style={styles.emptyStateButtonText}>Book Appointment</Text>
            </TouchableOpacity>
            </View>
        ) : (
            filteredAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCardWrapper}>
                {renderAppointmentCard({ item: appointment })}
            </View>
            ))
        )}
        </ScrollView>

      {/* APPOINTMENT DETAILS MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Appointment Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedAppointment && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Doctor Info */}
                <View style={styles.modalDoctorInfo}>
                  <Image 
                    source={{ uri: selectedAppointment.doctorImage }} 
                    style={styles.modalDoctorImage}
                  />
                  <View style={styles.modalDoctorDetails}>
                    <Text style={styles.modalDoctorName}>{selectedAppointment.doctorName}</Text>
                    <Text style={styles.modalDoctorSpecialty}>{selectedAppointment.doctorSpecialty}</Text>
                    <View style={styles.modalServiceBadge}>
                      <Ionicons 
                        name={getServiceIcon(selectedAppointment.service)} 
                        size={16} 
                        color={getServiceColor(selectedAppointment.service)} 
                      />
                      <Text style={styles.modalServiceText}>{selectedAppointment.service}</Text>
                    </View>
                  </View>
                </View>

                {/* Status Banner */}
                <View style={[styles.statusBanner, { backgroundColor: getStatusColor(selectedAppointment.status) + '20' }]}>
                  <Ionicons 
                    name={getStatusIcon(selectedAppointment.status)} 
                    size={20} 
                    color={getStatusColor(selectedAppointment.status)} 
                  />
                  <Text style={[styles.statusBannerText, { color: getStatusColor(selectedAppointment.status) }]}>
                    {selectedAppointment.status.toUpperCase()}
                  </Text>
                  <Text style={styles.appointmentNumber}>
                    • {selectedAppointment.appointmentNumber}
                  </Text>
                </View>

                {/* Appointment Details */}
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Appointment Information</Text>
                  
                  <View style={styles.detailItemModal}>
                    <Ionicons name="calendar-outline" size={20} color="#64748B" />
                    <View style={styles.detailInfo}>
                      <Text style={styles.detailLabel}>Date</Text>
                      <Text style={styles.detailValue}>{formatDate(selectedAppointment.date)}</Text>
                    </View>
                  </View>

                  <View style={styles.detailItemModal}>
                    <Ionicons name="time-outline" size={20} color="#64748B" />
                    <View style={styles.detailInfo}>
                      <Text style={styles.detailLabel}>Time Slot</Text>
                      <Text style={styles.detailValue}>{selectedAppointment.time}</Text>
                    </View>
                  </View>

                  <View style={styles.detailItemModal}>
                    <Ionicons name="timer-outline" size={20} color="#64748B" />
                    <View style={styles.detailInfo}>
                      <Text style={styles.detailLabel}>Duration</Text>
                      <Text style={styles.detailValue}>{selectedAppointment.duration}</Text>
                    </View>
                  </View>

                  <View style={styles.detailItemModal}>
                    <Ionicons name="location-outline" size={20} color="#64748B" />
                    <View style={styles.detailInfo}>
                      <Text style={styles.detailLabel}>Location</Text>
                      <Text style={styles.detailValue}>{selectedAppointment.location}</Text>
                    </View>
                  </View>

                  {selectedAppointment.notes && (
                    <View style={styles.detailItemModal}>
                      <Ionicons name="document-text-outline" size={20} color="#64748B" />
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailLabel}>Notes</Text>
                        <Text style={styles.detailValue}>{selectedAppointment.notes}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.detailItemModal}>
                    <Ionicons name="calendar-outline" size={20} color="#64748B" />
                    <View style={styles.detailInfo}>
                      <Text style={styles.detailLabel}>Booked On</Text>
                      <Text style={styles.detailValue}>{formatDate(selectedAppointment.createdAt)}</Text>
                    </View>
                  </View>

                  {selectedAppointment.status === 'cancelled' && selectedAppointment.cancelledAt && (
                    <View style={styles.detailItemModal}>
                      <Ionicons name="close-circle-outline" size={20} color="#64748B" />
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailLabel}>Cancelled On</Text>
                        <Text style={styles.detailValue}>{formatDate(selectedAppointment.cancelledAt)}</Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Cancellation Policy */}
                {selectedAppointment.status === 'confirmed' && new Date(selectedAppointment.date) >= new Date() && (
                  <View style={styles.policySection}>
                    <Text style={styles.sectionTitle}>Cancellation Policy</Text>
                    <View style={styles.policyItem}>
                      <Ionicons name="information-circle" size={16} color="#F59E0B" />
                      <Text style={styles.policyText}>
                        You can cancel this appointment up to 24 hours before the scheduled time
                      </Text>
                    </View>
                    <View style={styles.policyItem}>
                      <Ionicons name="information-circle" size={16} color="#F59E0B" />
                      <Text style={styles.policyText}>
                        Late cancellations may affect your ability to book future appointments
                      </Text>
                    </View>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  {selectedAppointment.status === 'confirmed' && new Date(selectedAppointment.date) >= new Date() && (
                    <TouchableOpacity 
                      style={styles.cancelModalButton}
                      onPress={() => {
                        setDetailsModalVisible(false);
                        handleCancelAppointment(selectedAppointment);
                      }}
                    >
                      <Ionicons name="close-circle" size={20} color="#EF4444" />
                      <Text style={styles.cancelModalText}>Cancel Appointment</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.closeModalButton}
                    onPress={() => setDetailsModalVisible(false)}
                  >
                    <Text style={styles.closeModalText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* CANCEL CONFIRMATION MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={cancelModalVisible}
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContent}>
            <View style={styles.confirmModalIcon}>
              <Ionicons name="warning" size={48} color="#EF4444" />
            </View>
            
            <Text style={styles.confirmModalTitle}>Cancel Appointment?</Text>
            
            <Text style={styles.confirmModalText}>
              Are you sure you want to cancel your appointment with {selectedAppointment?.doctorName}?
            </Text>
            
            <Text style={styles.confirmModalDetails}>
              {selectedAppointment && formatDate(selectedAppointment.date)} • {selectedAppointment?.time}
            </Text>

            <View style={styles.confirmModalActions}>
              <TouchableOpacity 
                style={styles.confirmModalNoButton}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={styles.confirmModalNoText}>No, Keep It</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmModalYesButton}
                onPress={confirmCancellation}
              >
                <Text style={styles.confirmModalYesText}>Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
    minWidth:190
  },
  
  // HEADER
  header: {
    backgroundColor: '#0F172A',
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  bookButton: {
    padding: 8,
  },
  
  // STATS
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  
  // FILTERS
  filtersScroll: {
    marginTop: 16,
    marginBottom: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 100,
    flexShrink: 1,
  },
  filterButtonActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#2563EB',
  },
  
  // LIST HEADER
  listHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  
  // APPOINTMENTS LIST
  appointmentsList: {
    paddingBottom: 40,
  },
  
  // APPOINTMENT CARD
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  doctorInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
  },
  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  serviceText: {
    fontSize: 11,
    color: '#0EA5E9',
    fontWeight: '600',
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  
  // APPOINTMENT DETAILS
  appointmentDetails: {
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 8,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  
  // CARD ACTIONS
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 6,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  detailsButtonText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 13,
    marginRight: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
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
    marginBottom: 20,
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
  
  // STATUS BANNER
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  statusBannerText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  appointmentNumber: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // DETAILS SECTION
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  detailItemModal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailInfo: {
    flex: 1,
    marginLeft: 12,
  },
  
  // POLICY SECTION
  policySection: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  policyText: {
    fontSize: 13,
    color: '#92400E',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  
  // MODAL ACTIONS
  modalActions: {
    marginTop: 20,
  },
  cancelModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 12,
  },
  cancelModalText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  closeModalButton: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  closeModalText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 16,
  },
  
  // CONFIRMATION MODAL
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  confirmModalIcon: {
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  confirmModalText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  confirmModalDetails: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  confirmModalNoButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  confirmModalNoText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 15,
  },
  confirmModalYesButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 8,
  },
  confirmModalYesText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
});