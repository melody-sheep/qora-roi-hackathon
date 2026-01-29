import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ClinicDashboard() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Today's data
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentTime = today.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Mock clinic data
  const clinicData = {
    doctorName: 'Dr. Maria Santos',
    clinicStatus: 'OPEN',
    todayStats: {
      totalAppointments: 12,
      completed: 2,
      inProgress: 1,
      waiting: 3,
      availableSlots: 6,
      cancellations: 1,
    },
    todaySchedule: [
      { id: '1', time: '8:30 AM', patient: 'Pedro Gomez', service: 'Medical Consultation', status: 'completed', doctor: 'Dr. Santos' },
      { id: '2', time: '9:00 AM', patient: 'Sofia Lim', service: 'Dental Checkup', status: 'completed', doctor: 'Dr. Cruz' },
      { id: '3', time: '9:15 AM', patient: 'Maria Santos', service: 'Medical Consultation', status: 'in-progress', doctor: 'Dr. Santos' },
      { id: '4', time: '9:30 AM', patient: 'Juan Dela Cruz', service: 'Dental Checkup', status: 'waiting', doctor: 'Dr. Cruz' },
      { id: '5', time: '9:30 AM', patient: 'Ana Reyes', service: 'Medical Consultation', status: 'waiting', doctor: 'Dr. Reyes' },
      { id: '6', time: '10:00 AM', patient: 'Miguel Tan', service: 'Follow-up', status: 'scheduled', doctor: 'Dr. Santos' },
      { id: '7', time: '2:00 PM', patient: 'Harry Inidal', service: 'Dental Checkup', status: 'scheduled', doctor: 'Dr. Cruz' },
      { id: '8', time: '3:00 PM', patient: 'Carla Lopez', service: 'Medical Consultation', status: 'scheduled', doctor: 'Dr. Santos' },
    ],
    clinicHours: {
      open: '8:00 AM',
      close: '5:00 PM',
      nextOpening: 'Tomorrow 8:00 AM'
    },
    quickUpdates: [
      { id: '1', time: '2 min ago', message: 'Harry Inidal booked 2:00 PM dental slot', type: 'booking' },
      { id: '2', time: '5 min ago', message: 'Appointment cancelled for 10:30 AM', type: 'cancellation' },
      { id: '3', time: '15 min ago', message: 'Clinic opened for the day', type: 'status' },
    ],
  };

  const loadDashboardData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in-progress': return '#F59E0B';
      case 'waiting': return '#3B82F6';
      case 'scheduled': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'in-progress': return 'time-outline';
      case 'waiting': return 'person-outline';
      case 'scheduled': return 'calendar-outline';
      default: return 'help-circle';
    }
  };

  const handleViewQueue = () => {
    navigation.navigate('Appointments');
  };

  const handleSetAvailability = () => {
    navigation.navigate('Availability');
  };

  const handleAddEmergencySlot = () => {
    Alert.alert(
      'Add Emergency Slot',
      'This feature will allow you to add priority slots for urgent cases.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Add emergency slot') },
      ]
    );
  };

  const handleSendAnnouncement = () => {
    navigation.navigate('Broadcast');
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading clinic dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563EB']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.doctorName} numberOfLines={1} ellipsizeMode="tail">
                {clinicData.doctorName}
              </Text>
              <Text style={styles.dateTime}>{formattedDate}</Text>
              <Text style={styles.currentTime}>Current time: {currentTime}</Text>
            </View>
            <View style={styles.clinicStatusIndicator}>
              <View style={[
                styles.statusDot, 
                { backgroundColor: clinicData.clinicStatus === 'OPEN' ? '#10B981' : '#EF4444' }
              ]} />
              <Text style={styles.clinicStatusText}>
                {clinicData.clinicStatus}
              </Text>
            </View>
          </View>
        </View>

        {/* TODAY'S OVERVIEW STATS */}
        <View style={styles.statsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Overview</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View Details</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{clinicData.todayStats.totalAppointments}</Text>
              <Text style={styles.statLabel} numberOfLines={1}>Total</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{clinicData.todayStats.completed}</Text>
              <Text style={styles.statLabel} numberOfLines={1}>Completed</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{clinicData.todayStats.inProgress}</Text>
              <Text style={styles.statLabel} numberOfLines={1}>In Progress</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{clinicData.todayStats.waiting}</Text>
              <Text style={styles.statLabel} numberOfLines={1}>Waiting</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{clinicData.todayStats.availableSlots}</Text>
              <Text style={styles.statLabel} numberOfLines={1}>Available</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{clinicData.todayStats.cancellations}</Text>
              <Text style={styles.statLabel} numberOfLines={1}>Cancelled</Text>
            </View>
          </View>
        </View>

        {/* QUICK ACCESS TO AVAILABILITY SETUP */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionBox}
            onPress={handleSetAvailability}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="calendar-outline" size={24} color="#2563EB" />
            </View>
            <Text style={styles.actionText} numberOfLines={2} adjustsFontSizeToFit>
              Set Availability
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionBox}
            onPress={handleViewQueue}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F0F9FF' }]}>
              <Ionicons name="people-outline" size={24} color="#0EA5E9" />
            </View>
            <Text style={styles.actionText} numberOfLines={2} adjustsFontSizeToFit>
              Today's Queue
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionBox}
            onPress={handleAddEmergencySlot}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="medical-outline" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.actionText} numberOfLines={2} adjustsFontSizeToFit>
              Emergency Slot
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionBox}
            onPress={handleSendAnnouncement}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="megaphone-outline" size={24} color="#10B981" />
            </View>
            <Text style={styles.actionText} numberOfLines={2} adjustsFontSizeToFit>
              Send Announcement
            </Text>
          </TouchableOpacity>
        </View>

        {/* TODAY'S SCHEDULE - Main Focus */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          <TouchableOpacity onPress={handleViewQueue}>
            <Text style={styles.viewAllText}>View All ({clinicData.todaySchedule.length})</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.scheduleCard}>
          {clinicData.todaySchedule.slice(0, 4).map((appointment) => (
            <View key={appointment.id} style={styles.appointmentItem}>
              <View style={styles.appointmentTimeContainer}>
                <Text style={styles.appointmentTime}>{appointment.time}</Text>
              </View>
              
              <View style={styles.appointmentDetails}>
                <Text style={styles.patientName} numberOfLines={1}>
                  {appointment.patient}
                </Text>
                <View style={styles.appointmentMeta}>
                  <Text style={styles.serviceText} numberOfLines={1}>
                    {appointment.service}
                  </Text>
                  <Text style={styles.doctorText} numberOfLines={1}>
                    • {appointment.doctor}
                  </Text>
                </View>
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
                  styles.statusBadgeText,
                  { color: getStatusColor(appointment.status) }
                ]} numberOfLines={1}>
                  {appointment.status.replace('-', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* CLINIC HOURS AND CAPACITY */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color="#2563EB" />
              <Text style={styles.infoLabel}>Hours:</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {clinicData.clinicHours.open} - {clinicData.clinicHours.close}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={16} color="#2563EB" />
              <Text style={styles.infoLabel}>Next:</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {clinicData.clinicHours.nextOpening}
              </Text>
            </View>
          </View>
          
          <View style={styles.capacityInfo}>
            <Ionicons name="information-circle-outline" size={14} color="#0C4A6E" />
            <Text style={styles.capacityText} numberOfLines={1}>
              {clinicData.todayStats.availableSlots} slots available • {clinicData.todayStats.totalAppointments} booked
            </Text>
          </View>
        </View>

        {/* LIVE UPDATES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Live Updates</Text>
        </View>
        
        <View style={styles.updatesCard}>
          {clinicData.quickUpdates.map((update) => (
            <View key={update.id} style={styles.updateItem}>
              <Ionicons 
                name={update.type === 'booking' ? 'add-circle-outline' : 
                      update.type === 'cancellation' ? 'remove-circle-outline' : 'alert-circle-outline'} 
                size={14} 
                color="#64748B" 
              />
              <View style={styles.updateContent}>
                <Text style={styles.updateMessage} numberOfLines={2}>
                  {update.message}
                </Text>
                <Text style={styles.updateTime}>{update.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SYSTEM STATUS */}
        <View style={styles.systemStatus}>
          <View style={styles.systemStatusItem}>
            <Ionicons name="shield-checkmark-outline" size={14} color="#6B7280" />
            <Text style={styles.systemStatusText} numberOfLines={1}>
              System: Operational
            </Text>
          </View>
          <View style={styles.systemStatusItem}>
            <Ionicons name="sync-outline" size={14} color="#6B7280" />
            <Text style={styles.systemStatusText} numberOfLines={1}>
              Updated: Just now
            </Text>
          </View>
        </View>

        {/* Footer Spacing */}
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
  scrollContent: {
    paddingBottom: 30,
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
  },
  
  // HEADER SECTION
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
  headerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  greeting: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 4,
  },
  doctorName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    maxWidth: width - 150,
  },
  dateTime: {
    color: '#CBD5E1',
    fontSize: 13,
    marginBottom: 4,
  },
  currentTime: {
    color: '#94A3B8',
    fontSize: 12,
  },
  clinicStatusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  clinicStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // SECTION HEADERS
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  viewAllText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 13,
  },
  
  // TODAY'S OVERVIEW STATS
  statsSection: {
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '31%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 70,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    width: '100%',
  },
  
  // QUICK ACTIONS
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  actionBox: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 100,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 16,
    minHeight: 32,
  },
  
  // TODAY'S SCHEDULE
  scheduleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    minHeight: 60,
  },
  appointmentTimeContainer: {
    width: 70,
  },
  appointmentTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  appointmentDetails: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  appointmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  serviceText: {
    fontSize: 12,
    color: '#64748B',
    flexShrink: 1,
  },
  doctorText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
    flexShrink: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 70,
    justifyContent: 'center',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // INFO CARD
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 12,
    marginLeft: 6,
    marginRight: 4,
    width: 40,
  },
  infoValue: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  capacityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  capacityText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#0C4A6E',
    fontWeight: '500',
  },
  
  // LIVE UPDATES
  updatesCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  updateItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  updateContent: {
    flex: 1,
    marginLeft: 10,
  },
  updateMessage: {
    fontSize: 13,
    color: '#1E293B',
    marginBottom: 4,
    lineHeight: 16,
  },
  updateTime: {
    fontSize: 11,
    color: '#64748B',
  },
  
  // SYSTEM STATUS
  systemStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  systemStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  systemStatusText: {
    color: '#64748B',
    fontSize: 11,
    marginLeft: 6,
    flex: 1,
  },
  
  // FOOTER
  footer: {
    height: 30,
  },
});