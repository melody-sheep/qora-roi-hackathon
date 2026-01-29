import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function StudentDashboardScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, verified, rejected
  const [nextAppointment, setNextAppointment] = useState(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    cancellations: 0,
    completionRate: '0%',
  });


  const mockData = {
    studentName: 'Harry Inidal',
    studentId: '2023301940',
    yearLevel: '3rd Year',
    verification: {
      corStatus: 'verified',
      schoolIdStatus: 'verified',
    },
    nextAppointment: {
      id: '1',
      service: 'Dental Check-up',
      doctor: 'Dr. Maria Santos',
      date: 'Feb 8, 2026',
      time: '2:00 PM - 2:30 PM',
      status: 'confirmed',
    },
    stats: {
      totalAppointments: 7,
      upcomingAppointments: 1,
      cancellations: 1,
      completionRate: '5',
    },
    recentActivity: [
      { id: '1', date: 'Jan 30', action: 'Dental appointment booked', type: 'booking' },
      { id: '3', date: 'Dec 5', action: 'CoR document uploaded', type: 'upload' },
      { id: '2', date: 'Dec 6', action: 'Medical consultation completed', type: 'completed' },
      { id: '4', date: 'Dec 1', action: 'Account verified', type: 'verification' },
    ],
    availableSlots: {
      medical: 3,
      dental: 1,
    },
    notifications: [
      { id: '1', message: 'Appointment reminder tomorrow', type: 'reminder', read: false },
    ],
    progress: {
      completed: 2,
      total: 4,
    },
  };

  const loadDashboardData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setVerificationStatus(mockData.verification.corStatus);
      setNextAppointment(mockData.nextAppointment);
      setStats(mockData.stats);
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
      // Refresh data when screen comes into focus
      loadDashboardData();
    }, [])
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return 'checkmark-circle';
      case 'pending': return 'time-outline';
      case 'rejected': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const handleBookAppointment = () => {
    navigation.navigate('StudentBooking');
  };

  const handleViewAppointments = () => {
    navigation.navigate('StudentAppointment');
  };

  const handleUploadDocuments = () => {
    Alert.alert(
      'Upload Verification',
      'You can upload your Certificate of Registration (CoR) for faster verification.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upload Now', onPress: () => navigation.navigate('DocumentUpload') },
      ]
    );
  };

  const handleCancelAppointment = (appointmentId) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => {
            // Handle cancellation
            setNextAppointment(null);
            Alert.alert('Cancelled', 'Your appointment has been cancelled.');
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      <ScrollView 
        style={styles.container}
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
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.studentName}>{mockData.studentName}</Text>
              <Text style={styles.studentId}>ID: {mockData.studentId}</Text>
            </View>
            <View style={styles.statusIndicator}>
              <View style={[
                styles.statusDot, 
                { backgroundColor: verificationStatus === 'verified' ? '#10B981' : '#F59E0B' }
              ]} />
              <Text style={styles.statusText}>
                {verificationStatus === 'verified' ? 'Verified' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        {/* VERIFICATION STATUS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text-outline" size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Verification Status</Text>
          </View>
          
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Ionicons 
                name={getStatusIcon(mockData.verification.corStatus)} 
                size={20} 
                color={getStatusColor(mockData.verification.corStatus)} 
              />
              <Text style={styles.statusItemText}>CoR: </Text>
              <Text style={[
                styles.statusItemValue,
                { color: getStatusColor(mockData.verification.corStatus) }
              ]}>
                {mockData.verification.corStatus.toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.statusItem}>
              <Ionicons 
                name={getStatusIcon(mockData.verification.schoolIdStatus)} 
                size={20} 
                color={getStatusColor(mockData.verification.schoolIdStatus)} 
              />
              <Text style={styles.statusItemText}>School ID: </Text>
              <Text style={[
                styles.statusItemValue,
                { color: getStatusColor(mockData.verification.schoolIdStatus) }
              ]}>
                {mockData.verification.schoolIdStatus.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Ionicons name="school-outline" size={20} color="#6B7280" />
              <Text style={styles.statusItemText}>Year Level: </Text>
              <Text style={styles.statusItemValue}>{mockData.yearLevel}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Ionicons name="time-outline" size={20} color="#6B7280" />
              <Text style={styles.statusItemText}>Updated: </Text>
              <Text style={styles.statusItemValue}>Today</Text>
            </View>
          </View>
          
          {verificationStatus === 'pending' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleUploadDocuments}
            >
              <Ionicons name="cloud-upload-outline" size={20} color="#2563EB" />
              <Text style={styles.actionButtonText}>Upload Documents</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* QUICK STATS WIDGET */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber1}>{stats.totalAppointments}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber2}>{stats.upcomingAppointments}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber3}>{stats.cancellations}</Text>
            <Text style={styles.statLabel}>Cancelled</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber4}>{stats.completionRate}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* QUICK ACTIONS GRID */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionBox}
            onPress={handleBookAppointment}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="calendar-outline" size={28} color="#2563EB" />
            </View>
            <Text style={styles.actionText}>View Available Slots</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionBox}
            onPress={handleViewAppointments}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F0F9FF' }]}>
              <Ionicons name="person-outline" size={28} color="#0EA5E9" />
            </View>
            <Text style={styles.actionText}>My Appointments</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionBox}
            onPress={() => navigation.navigate('FAQ')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="help-circle-outline" size={28} color="#F59E0B" />
            </View>
            <Text style={styles.actionText}>FAQ & Help</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionBox}
            onPress={() => navigation.navigate('Documents')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="document-text-outline" size={28} color="#10B981" />
            </View>
            <Text style={styles.actionText}>My Documents</Text>
          </TouchableOpacity>
        </View>

        {/* NEXT APPOINTMENT CARD */}
        {nextAppointment && (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Next Appointment</Text>
          </View>
        )}
        
        {nextAppointment && (
          <View style={[styles.card, styles.appointmentCard]}>
            <View style={styles.appointmentHeader}>
              <View style={styles.serviceBadge}>
                <Ionicons name="medkit-outline" size={16} color="#2563EB" />
                <Text style={styles.serviceText}>{nextAppointment.service}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: nextAppointment.status === 'confirmed' ? '#D1FAE5' : '#FEF3C7' }
              ]}>
                <Ionicons 
                  name={nextAppointment.status === 'confirmed' ? 'checkmark-circle' : 'time-outline'} 
                  size={14} 
                  color={nextAppointment.status === 'confirmed' ? '#10B981' : '#F59E0B'} 
                />
                <Text style={[
                  styles.statusBadgeText,
                  { color: nextAppointment.status === 'confirmed' ? '#10B981' : '#F59E0B' }
                ]}>
                  {nextAppointment.status.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.appointmentDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={18} color="#6B7280" />
                <Text style={styles.detailLabel}>Doctor: </Text>
                <Text style={styles.detailValue}>{nextAppointment.doctor}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                <Text style={styles.detailLabel}>Date: </Text>
                <Text style={styles.detailValue}>{nextAppointment.date}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={18} color="#6B7280" />
                <Text style={styles.detailLabel}>Time: </Text>
                <Text style={styles.detailValue}>{nextAppointment.time}</Text>
              </View>
            </View>
            
            <View style={styles.appointmentActions}>
              <TouchableOpacity 
                style={styles.viewButton}
                onPress={() => navigation.navigate('StudentAppointment', { id: nextAppointment.id })}
              >
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => handleCancelAppointment(nextAppointment.id)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* SERVICE AVAILABILITY QUICK VIEW */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Now</Text>
        </View>
        
        <View style={styles.availabilityCard}>
          <View style={styles.availabilityItem}>
            <View style={styles.availabilityIcon}>
              <Ionicons name="medical-outline" size={24} color="#3B82F6" />
            </View>
            <View style={styles.availabilityDetails}>
              <Text style={styles.availabilityService}>Medical</Text>
              <Text style={styles.availabilitySlots}>
                {mockData.availableSlots.medical} slots today
              </Text>
            </View>
          </View>
          
          <View style={styles.availabilityItem}>
            <View style={styles.availabilityIcon}>
              <Ionicons name="fitness-outline" size={24} color="#10B981" />
            </View>
            <View style={styles.availabilityDetails}>
              <Text style={styles.availabilityService}>Dental</Text>
              <Text style={styles.availabilitySlots}>
                {mockData.availableSlots.dental} slot tomorrow
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.bookNowButton}
            onPress={handleBookAppointment}
          >
            <Text style={styles.bookNowText}>Book Now</Text>
            <Ionicons name="arrow-forward" size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* NOTIFICATIONS SECTION */}
        <View style={styles.sectionHeader}>
          <View style={styles.notificationsHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <TouchableOpacity>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.notificationsCard}>
          {mockData.notifications.map((notification) => (
            <View key={notification.id} style={styles.notificationItem}>
              <Ionicons 
                name={notification.type === 'warning' ? 'warning-outline' : 'notifications-outline'} 
                size={20} 
                color={notification.type === 'warning' ? '#F59E0B' : '#2563EB'} 
              />
              <Text style={[
                styles.notificationText,
                !notification.read && styles.notificationUnread
              ]}>
                {notification.message}
              </Text>
            </View>
          ))}
        </View>

        {/* RECENT ACTIVITY (Optional - can be hidden if too long) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.activityCard}>
          {mockData.recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons 
                  name={
                    activity.type === 'booking' ? 'calendar-outline' :
                    activity.type === 'upload' ? 'cloud-upload-outline' :
                    activity.type === 'completed' ? 'checkmark-done-outline' :
                    'checkmark-circle-outline'
                  } 
                  size={16} 
                  color="#6B7280" 
                />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityDate}>{activity.date}</Text>
                <Text style={styles.activityAction}>{activity.action}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SYSTEM STATUS */}
        <View style={styles.systemStatus}>
          <View style={styles.systemStatusItem}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.systemStatusText}>Clinic Hours: 8AM-5PM</Text>
          </View>
          <View style={styles.systemStatusItem}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.systemStatusText}>Next Available: Today 3:00 PM</Text>
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
    minWidth:170
  },
  
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
    marginTop:30,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 4,
  },
  studentName: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  studentId: {
    color: '#CBD5E1',
    fontSize: 14,
  },
  statusIndicator: {
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
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // CARDS
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: -10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 12,
  },
  
  // STATUS ROWS
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusItemText: {
    color: '#64748B',
    fontSize: 14,
    marginLeft: 8,
  },
  statusItemValue: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // ACTION BUTTON
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  actionButtonText: {
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // STATS
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber1: {
    fontSize: 35,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  statNumber2: {
    fontSize: 35,
    fontWeight: '700',
    color: '#5a98fc',
    marginBottom: 4,
  },
  statNumber3: {
    fontSize: 35,
    fontWeight: '700',
    color: '#ff3939',
    marginBottom: 4,
  },
  statNumber4: {
    fontSize: 35,
    fontWeight: '700',
    color: '#00bb38',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    minWidth: 100
  },
  
  // SECTIONS
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
  viewAllText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // QUICK ACTIONS
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionBox: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: '1%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  
  // APPOINTMENT CARD
  appointmentCard: {
    marginTop: 0,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  serviceText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  appointmentDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#64748B',
    fontSize: 14,
    marginLeft: 8,
    marginRight: 4,
  },
  detailValue: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '500',
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  viewButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  
  // AVAILABILITY
  availabilityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  availabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  availabilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  availabilityDetails: {
    flex: 1,
  },
  availabilityService: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  availabilitySlots: {
    fontSize: 14,
    color: '#64748B',
  },
  bookNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
  },
  bookNowText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  
  // NOTIFICATIONS
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  markAllText: {
    color: '#2563EB',
    fontSize: 14,
    minWidth:90
  },
  notificationsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  notificationText: {
    flex: 1,
    marginLeft: 12,
    color: '#64748B',
    fontSize: 14,
  },
  notificationUnread: {
    color: '#1E293B',
    fontWeight: '500',
  },
  
  // PROGRESS
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 16,
  },
  progressCount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563EB',
  },
  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressMilestone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressComplete: {
    backgroundColor: '#2563EB',
  },
  progressIncomplete: {
    backgroundColor: '#E2E8F0',
  },
  milestoneNumber: {
    color: '#64748B',
    fontWeight: '600',
  },
  progressNote: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  
  // ACTIVITY
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  activityIcon: {
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityDate: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  activityAction: {
    fontSize: 14,
    color: '#1E293B',
  },
  
  // SYSTEM STATUS
  systemStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  systemStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  systemStatusText: {
    color: '#64748B',
    fontSize: 12,
    marginLeft: 6,
  },
  
  // FOOTER
  footer: {
    height: 40,
  },
});