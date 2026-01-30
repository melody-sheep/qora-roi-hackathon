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
import AsyncStorage from '@react-native-async-storage/async-storage';



const { width } = Dimensions.get('window');

export default function ClinicDashboard() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [doctorName, setDoctorName] = useState(''); // Add state for doctor name
  
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

  // Function to get doctor's name from storage
  const getDoctorName = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        // Add "Dr." prefix if not already there
        let name = user.fullName || '';
        if (name && !name.startsWith('Dr.')) {
          name = `Dr. ${name}`;
        }
        setDoctorName(name);
      }
    } catch (error) {
      console.error('Error getting doctor name:', error);
      setDoctorName('Doctor'); // Fallback name
    }
  };

  const loadDashboardData = () => {
    setLoading(true);
    // Get doctor name first
    getDoctorName().then(() => {
      // Simulate API call for other data
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 1000);
    });
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
      case 'scheduled': return '#94A3B8';
      default: return '#94A3B8';
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
        { text: 'Continue', onPress: () => navigation.navigate('EmergencySlots') },
      ]
    );
  };

  const handleSendAnnouncement = () => {
    navigation.navigate('Broadcast');
  };

  const handleViewProfile = () => {
  navigation.navigate('Profile');
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
  <View style={styles.headerTop}>
    <View>
      <Text style={styles.greeting}>Good morning,</Text>
      <TouchableOpacity onPress={handleViewProfile}>
        <View style={styles.doctorNameContainer}>
          <Text style={styles.doctorName}>
            {doctorName || 'Loading...'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="white" style={styles.profileArrow} />
        </View>
      </TouchableOpacity>
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
  <Text style={styles.dateTime}>{formattedDate}</Text>
  <Text style={styles.currentTime}>Current time: {currentTime}</Text>
</View>

        {/* TODAY'S OVERVIEW STATS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Overview</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Details</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{clinicData.todayStats.totalAppointments}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            
            <View style={[styles.statCard, styles.statCardPrimary]}>
              <Text style={[styles.statNumber, { color: '#10B981' }]}>{clinicData.todayStats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            
            <View style={[styles.statCard, styles.statCardPrimary]}>
              <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{clinicData.todayStats.inProgress}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            
            <View style={[styles.statCard, styles.statCardPrimary]}>
              <Text style={[styles.statNumber, { color: '#3B82F6' }]}>{clinicData.todayStats.waiting}</Text>
              <Text style={styles.statLabel}>Waiting</Text>
            </View>
            
            <View style={[styles.statCard, styles.statCardSuccess]}>
              <Text style={[styles.statNumber, { color: '#10B981' }]}>{clinicData.todayStats.availableSlots}</Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
            
            <View style={[styles.statCard, styles.statCardError]}>
              <Text style={[styles.statNumber, { color: '#EF4444' }]}>{clinicData.todayStats.cancellations}</Text>
              <Text style={styles.statLabel}>Cancelled</Text>
            </View>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleSetAvailability}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="calendar-outline" size={22} color="#2563EB" />
              </View>
              <Text style={styles.actionText}>Set Availability</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleViewQueue}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="people-outline" size={22} color="#16A34A" />
              </View>
              <Text style={styles.actionText}>Today's Queue</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleAddEmergencySlot}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="medical-outline" size={22} color="#F59E0B" />
              </View>
              <Text style={styles.actionText}>Emergency Slot</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleSendAnnouncement}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F0F9FF' }]}>
                <Ionicons name="megaphone-outline" size={22} color="#0EA5E9" />
              </View>
              <Text style={styles.actionText}>Send Announcement</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TODAY'S SCHEDULE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity onPress={handleViewQueue}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.scheduleCard}>
            {clinicData.todaySchedule.slice(0, 4).map((appointment) => (
              <View key={appointment.id} style={styles.appointmentItem}>
                <View style={styles.appointmentTimeContainer}>
                  <Text style={styles.appointmentTime}>{appointment.time}</Text>
                </View>
                
                <View style={styles.appointmentDetails}>
                  <Text style={styles.patientName}>{appointment.patient}</Text>
                  <Text style={styles.serviceText}>{appointment.service}</Text>
                </View>
                
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(appointment.status)}15` }
                ]}>
                  <View style={[
                    styles.statusDotSmall,
                    { backgroundColor: getStatusColor(appointment.status) }
                  ]} />
                  <Text style={[
                    styles.statusBadgeText,
                    { color: getStatusColor(appointment.status) }
                  ]}>
                    {appointment.status.replace('-', ' ')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* CLINIC INFORMATION - FIXED */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clinic Information</Text>
          <View style={styles.infoCard}>
            {/* Clinic Hours Row */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={18} color="#64748B" style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Clinic Hours</Text>
                  <Text style={styles.infoValue}>
                    {clinicData.clinicHours.open} - {clinicData.clinicHours.close}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoDivider} />
              
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={18} color="#64748B" style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Next Opening</Text>
                  <Text style={styles.infoValue}>
                    {clinicData.clinicHours.nextOpening}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Capacity Summary */}
            <View style={styles.capacityContainer}>
              <View style={styles.capacityItem}>
                <Text style={styles.capacityNumber}>{clinicData.todayStats.availableSlots}</Text>
                <Text style={styles.capacityLabel}>Available Slots</Text>
              </View>
              
              <View style={styles.capacityDivider} />
              
              <View style={styles.capacityItem}>
                <Text style={styles.capacityNumber}>{clinicData.todayStats.totalAppointments}</Text>
                <Text style={styles.capacityLabel}>Total Booked</Text>
              </View>
              
              <View style={styles.capacityDivider} />
              
              <View style={styles.capacityItem}>
                <Text style={styles.capacityNumber}>{clinicData.todayStats.waiting}</Text>
                <Text style={styles.capacityLabel}>Currently Waiting</Text>
              </View>
            </View>
          </View>
        </View>

        {/* LIVE UPDATES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Updates</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.updatesCard}>
            {clinicData.quickUpdates.map((update) => (
              <View key={update.id} style={styles.updateItem}>
                <View style={[
                  styles.updateIcon,
                  { backgroundColor: update.type === 'booking' ? '#D1FAE5' : 
                                 update.type === 'cancellation' ? '#FEE2E2' : '#DBEAFE' }
                ]}>
                  <Ionicons 
                    name={update.type === 'booking' ? 'add' : 
                          update.type === 'cancellation' ? 'remove' : 'alert'} 
                    size={14} 
                    color={update.type === 'booking' ? '#10B981' : 
                           update.type === 'cancellation' ? '#EF4444' : '#3B82F6'} 
                  />
                </View>
                <View style={styles.updateContent}>
                  <Text style={styles.updateMessage}>{update.message}</Text>
                  <Text style={styles.updateTime}>{update.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* FOOTER SPACING */}
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
    paddingBottom: 20,
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
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  greeting: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 4,
  },
  doctorName: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  dateTime: {
    color: '#CBD5E1',
    fontSize: 14,
    marginBottom: 4,
  },
  currentTime: {
    color: '#94A3B8',
    fontSize: 13,
  },
  clinicStatusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
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
  
  // SECTIONS
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
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
  viewAllText: {
    color: '#2563EB',
    fontWeight: '500',
    fontSize: 14,
  },
  
  // STATS GRID
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statCardPrimary: {
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statCardSuccess: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  statCardError: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
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
    fontWeight: '500',
  },
  
  // QUICK ACTIONS
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  
  // SCHEDULE CARD
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
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
    marginRight: 12,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  serviceText: {
    fontSize: 13,
    color: '#64748B',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  
  // INFO CARD - FIXED
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '600',
  },
  infoDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  
  // CAPACITY CONTAINER
  capacityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacityItem: {
    flex: 1,
    alignItems: 'center',
  },
  capacityNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  capacityLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  capacityDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  
  // UPDATES CARD
  updatesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  updateItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  updateIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  updateContent: {
    flex: 1,
  },
  updateMessage: {
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 4,
    lineHeight: 20,
  },
  updateTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  
  // FOOTER
  footer: {
    height: 20,
  },
  doctorNameContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  },
  profileArrow: {
  marginLeft: 6,
  },

});