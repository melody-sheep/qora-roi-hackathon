import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ManageAppointmentsScreen() {
  const navigation = useNavigation();
  
  const [appointments, setAppointments] = useState([
    { 
      id: '1', 
      time: '9:15 AM', 
      patient: 'Maria Santos', 
      patientId: 'SID-2022-045',
      service: 'Medical Consultation', 
      doctor: 'Dr. Santos',
      status: 'in-progress',
      duration: '30 mins',
      notes: '',
    },
    { 
      id: '2', 
      time: '9:30 AM', 
      patient: 'Juan Dela Cruz', 
      patientId: 'SID-2023-012',
      service: 'Dental Checkup', 
      doctor: 'Dr. Cruz',
      status: 'waiting',
      duration: '45 mins',
      notes: 'Follow-up appointment',
    },
    { 
      id: '3', 
      time: '10:00 AM', 
      patient: 'Ana Reyes', 
      patientId: 'SID-2022-089',
      service: 'Medical Consultation', 
      doctor: 'Dr. Reyes',
      status: 'waiting',
      duration: '30 mins',
      notes: '',
    },
    { 
      id: '4', 
      time: '2:00 PM', 
      patient: 'Harry Inidal', 
      patientId: 'SID-2023-001',
      service: 'Dental Checkup', 
      doctor: 'Dr. Cruz',
      status: 'confirmed',
      duration: '45 mins',
      notes: 'Routine checkup',
    },
    { 
      id: '5', 
      time: '3:00 PM', 
      patient: 'Carla Lopez', 
      patientId: 'SID-2023-056',
      service: 'Medical Consultation', 
      doctor: 'Dr. Santos',
      status: 'confirmed',
      duration: '30 mins',
      notes: 'Prescription refill',
    },
  ]);

  const [filter, setFilter] = useState('all'); // all, today, upcoming

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return '#F59E0B';
      case 'waiting': return '#3B82F6';
      case 'confirmed': return '#10B981';
      case 'completed': return '#6B7280';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-progress': return 'time-outline';
      case 'waiting': return 'person-outline';
      case 'confirmed': return 'checkmark-circle-outline';
      case 'completed': return 'checkmark-done-outline';
      case 'cancelled': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const handleCancelAppointment = (appointmentId, patientName) => {
    Alert.alert(
      'Cancel Appointment',
      `Cancel appointment for ${patientName}?`,
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => {
            setAppointments(prev => prev.map(apt => 
              apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
            ));
            Alert.alert(
              '✅ Appointment Cancelled',
              'Slot has been auto-released for other students',
              [{ text: 'OK' }]
            );
          }
        },
      ]
    );
  };

  const handleReschedule = (appointmentId, patientName) => {
    Alert.alert(
      'Reschedule Appointment',
      `Reschedule appointment for ${patientName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Find New Slot', 
          onPress: () => {
            Alert.alert(
              'Find Available Slot',
              'Searching for available slots...',
              [{ text: 'OK' }]
            );
          }
        },
      ]
    );
  };

  const handleStartConsultation = (appointmentId) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'in-progress' } : apt
    ));
    Alert.alert('Consultation Started', 'Patient status updated to "In Progress"');
  };

  const handleCompleteAppointment = (appointmentId) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
    ));
    Alert.alert('Appointment Completed', 'Slot auto-updated in system');
  };

  const handleViewPatient = (patientId) => {
    navigation.navigate('PatientDetails', { id: patientId });
  };

  const filteredAppointments = filter === 'today' 
    ? appointments
    : filter === 'upcoming'
    ? appointments.filter(apt => apt.status === 'confirmed')
    : appointments;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Manage Appointments</Text>
              <Text style={styles.subtitle}>Control and update patient bookings</Text>
            </View>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>{appointments.length} Total</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FILTER BUTTONS */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'all' && styles.filterActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All Appointments
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'today' && styles.filterActive]}
            onPress={() => setFilter('today')}
          >
            <Text style={[styles.filterText, filter === 'today' && styles.filterTextActive]}>
              Today Only
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'upcoming' && styles.filterActive]}
            onPress={() => setFilter('upcoming')}
          >
            <Text style={[styles.filterText, filter === 'upcoming' && styles.filterTextActive]}>
              Upcoming
            </Text>
          </TouchableOpacity>
        </View>

        {/* STATS OVERVIEW */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {appointments.filter(a => a.status === 'in-progress' || a.status === 'waiting').length}
            </Text>
            <Text style={styles.statLabel}>Active Now</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {appointments.filter(a => a.status === 'confirmed').length}
            </Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {appointments.filter(a => a.status === 'cancelled').length}
            </Text>
            <Text style={styles.statLabel}>Cancelled</Text>
          </View>
        </View>

        {/* APPOINTMENTS LIST */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {filter === 'today' ? "Today's Appointments" : 
             filter === 'upcoming' ? 'Upcoming Appointments' : 'All Appointments'}
          </Text>
          <Text style={styles.sectionCount}>{filteredAppointments.length}</Text>
        </View>

        <View style={styles.appointmentsList}>
          {filteredAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              {/* Appointment Header */}
              <View style={styles.appointmentHeader}>
                <View style={styles.timeContainer}>
                  <Ionicons name="time-outline" size={16} color="#64748B" />
                  <Text style={styles.appointmentTime}>{appointment.time}</Text>
                  <Text style={styles.durationText}>• {appointment.duration}</Text>
                </View>
                
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(appointment.status)}20` }
                ]}>
                  <Ionicons 
                    name={getStatusIcon(appointment.status)} 
                    size={12} 
                    color={getStatusColor(appointment.status)} 
                  />
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(appointment.status) }
                  ]}>
                    {appointment.status.replace('-', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Patient Info */}
              <TouchableOpacity 
                style={styles.patientInfo}
                onPress={() => handleViewPatient(appointment.patientId)}
              >
                <View style={styles.patientIcon}>
                  <Ionicons name="person-circle-outline" size={24} color="#2563EB" />
                </View>
                <View style={styles.patientDetails}>
                  <Text style={styles.patientName}>{appointment.patient}</Text>
                  <Text style={styles.patientId}>{appointment.patientId}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#64748B" />
              </TouchableOpacity>

              {/* Appointment Details */}
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="medkit-outline" size={14} color="#64748B" />
                  <Text style={styles.detailLabel}>Service:</Text>
                  <Text style={styles.detailValue}>{appointment.service}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Ionicons name="person-outline" size={14} color="#64748B" />
                  <Text style={styles.detailLabel}>Doctor:</Text>
                  <Text style={styles.detailValue}>{appointment.doctor}</Text>
                </View>
              </View>

              {/* Notes */}
              {appointment.notes ? (
                <View style={styles.notesContainer}>
                  <Ionicons name="document-text-outline" size={14} color="#64748B" />
                  <Text style={styles.notesText}>{appointment.notes}</Text>
                </View>
              ) : null}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {appointment.status === 'waiting' && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.startButton]}
                    onPress={() => handleStartConsultation(appointment.id)}
                  >
                    <Ionicons name="play-circle-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.startButtonText}>Start Consultation</Text>
                  </TouchableOpacity>
                )}
                
                {appointment.status === 'in-progress' && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.completeButton]}
                    onPress={() => handleCompleteAppointment(appointment.id)}
                  >
                    <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.completeButtonText}>Complete</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity 
                  style={[styles.actionButton, styles.rescheduleButton]}
                  onPress={() => handleReschedule(appointment.id, appointment.patient)}
                >
                  <Ionicons name="calendar-outline" size={16} color="#2563EB" />
                  <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => handleCancelAppointment(appointment.id, appointment.patient)}
                >
                  <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* AUTO-UPDATE INFO */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="sync-outline" size={20} color="#2563EB" />
            <Text style={styles.infoTitle}>Slot Auto-Update System</Text>
          </View>
          <Text style={styles.infoText}>
            ✅ Cancelled slots are automatically released for other students
          </Text>
          <Text style={styles.infoText}>
            ✅ Status changes update in real-time across all devices
          </Text>
          <Text style={styles.infoText}>
            ✅ Completed appointments free up the schedule instantly
          </Text>
        </View>

        <View style={styles.footerSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // HEADER
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 14,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // FILTERS
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  filterActive: {
    backgroundColor: '#2563EB',
  },
  filterText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  
  // STATS
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  
  // SECTION HEADER
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  sectionCount: {
    fontSize: 14,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // APPOINTMENTS LIST
  appointmentsList: {
    paddingHorizontal: 20,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 6,
  },
  durationText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // PATIENT INFO
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  patientIcon: {
    marginRight: 12,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  patientId: {
    fontSize: 12,
    color: '#64748B',
  },
  
  // DETAILS
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 6,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '500',
  },
  
  // NOTES
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notesText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  
  // ACTION BUTTONS
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    minWidth: '48%',
  },
  startButton: {
    backgroundColor: '#F59E0B',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  completeButton: {
    backgroundColor: '#10B981',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  rescheduleButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  rescheduleButtonText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  cancelButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  
  // INFO CARD
  infoCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C4A6E',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#0C4A6E',
    marginBottom: 6,
    lineHeight: 18,
  },
  
  footerSpacing: {
    height: 40,
  },
});