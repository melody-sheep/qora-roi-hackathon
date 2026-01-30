import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      doctor: '',
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
      doctor: '',
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
      doctor: '',
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
      doctor: '',
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
      doctor: '',
      status: 'confirmed',
      duration: '30 mins',
      notes: 'Prescription refill',
    },
  ]);

  const [filter, setFilter] = useState('all');

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
  };

  const handleCompleteAppointment = (appointmentId) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
    ));
  };

  const filteredAppointments = filter === 'all' 
    ? appointments
    : filter === 'today'
    ? appointments
    : appointments.filter(apt => apt.status === 'confirmed');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Manage Appointments</Text>
              <Text style={styles.subtitle}>Control patient bookings</Text>
            </View>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{appointments.length} Total</Text>
            </View>
          </View>
        </View>

        {/* FILTERS */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'all' && styles.filterActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'today' && styles.filterActive]}
            onPress={() => setFilter('today')}
          >
            <Text style={[styles.filterText, filter === 'today' && styles.filterTextActive]}>
              Today
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

        {/* STATS */}
        <View style={styles.statsRow}>
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
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Appointments</Text>
            <Text style={styles.sectionCount}>{filteredAppointments.length}</Text>
          </View>

          {filteredAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyStateText}>No appointments found</Text>
            </View>
          ) : (
            <View style={styles.appointmentsList}>
              {filteredAppointments.map((appointment) => (
                <View key={appointment.id} style={styles.appointmentCard}>
                  {/* Time & Status */}
                  <View style={styles.timeStatusRow}>
                    <View style={styles.timeContainer}>
                      <Ionicons name="time-outline" size={16} color="#64748B" />
                      <Text style={styles.appointmentTime}>{appointment.time}</Text>
                      <Text style={styles.durationText}>· {appointment.duration}</Text>
                    </View>
                    
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(appointment.status)}20` }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(appointment.status) }
                      ]}>
                        {appointment.status.toUpperCase().replace('-', ' ')}
                      </Text>
                    </View>
                  </View>

                  {/* Patient Info */}
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{appointment.patient}</Text>
                    <Text style={styles.patientId}>{appointment.patientId}</Text>
                    <Text style={styles.doctorText}>{appointment.doctor}</Text>
                  </View>

                  {/* Service */}
                  <View style={styles.serviceContainer}>
                    <Text style={styles.serviceText}>+ {appointment.service}</Text>
                  </View>

                  {/* Notes */}
                  {appointment.notes ? (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesText}>[{appointment.notes}]</Text>
                    </View>
                  ) : null}

                  {/* Action Buttons - ALWAYS 3 BUTTONS */}
                  <View style={styles.actionButtons}>
                    {/* First Action Button - Changes based on status */}
                    {appointment.status === 'waiting' && (
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.actionButtonPrimary]}
                        onPress={() => handleStartConsultation(appointment.id)}
                      >
                        <Text style={styles.actionButtonText}>Start</Text>
                      </TouchableOpacity>
                    )}
                    
                    {appointment.status === 'in-progress' && (
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.actionButtonPrimary]}
                        onPress={() => handleCompleteAppointment(appointment.id)}
                      >
                        <Text style={styles.actionButtonText}>Complete</Text>
                      </TouchableOpacity>
                    )}
                    
                    {appointment.status === 'confirmed' && (
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.actionButtonSecondary]}
                        onPress={() => Alert.alert('Mark as Ready')}
                      >
                        <Text style={styles.actionButtonSecondaryText}>Ready</Text>
                      </TouchableOpacity>
                    )}
                    
                    {/* Reschedule Button - ALWAYS PRESENT */}
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.actionButtonSecondary]}
                      onPress={() => handleReschedule(appointment.id, appointment.patient)}
                    >
                      <Text style={styles.actionButtonSecondaryText}>Reschedule</Text>
                    </TouchableOpacity>

                    {/* Cancel Button - ALWAYS PRESENT */}
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.actionButtonDanger]}
                      onPress={() => handleCancelAppointment(appointment.id, appointment.patient)}
                    >
                      <Text style={styles.actionButtonDangerText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* AUTO-UPDATE INFO */}
        <View style={styles.infoCard}>
          <Ionicons name="sync-outline" size={20} color="#2563EB" />
          <Text style={styles.infoText}>Cancelled slots auto-release for other students</Text>
        </View>

        <View style={styles.footer} />
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
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 30,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 14,
  },
  headerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerBadgeText: {
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
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  filterActive: {
    backgroundColor: '#2563EB',
  },
  filterText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  
  // STATS
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  
  // SECTION
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // EMPTY STATE
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 12,
  },
  
  // APPOINTMENTS LIST
  appointmentsList: {
    marginBottom: 20,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  
  // TIME & STATUS
  timeStatusRow: {
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
    fontSize: 13,
    color: '#64748B',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  
  // PATIENT INFO
  patientInfo: {
    marginBottom: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  patientId: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  doctorText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  
  // SERVICE
  serviceContainer: {
    marginBottom: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  serviceText: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
  },
  
  // NOTES
  notesContainer: {
    marginBottom: 16,
  },
  notesText: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
  },
  
  // ACTION BUTTONS - FIXED: ALWAYS 3 BUTTONS
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: '#2563EB',
  },
  actionButtonSecondary: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionButtonDanger: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonSecondaryText: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonDangerText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // INFO CARD
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F0F9FF',
    marginHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#0C4A6E',
    marginLeft: 8,
    fontWeight: '500',
  },
  
  // FOOTER
  footer: {
    height: 30,
  },
});