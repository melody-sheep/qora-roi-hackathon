import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../services/supabase';
import { appointmentService } from '../../utils/appointmentService';

const { width } = Dimensions.get('window');

// Particle Component for animated background
const Particle = ({ size, duration, delay, startX, startY }) => {
  const translateX = useRef(new Animated.Value(startX)).current;
  const translateY = useRef(new Animated.Value(startY)).current;
  const opacity = useRef(new Animated.Value(0.8)).current; // CHANGED: Increased from 0.3 to 0.8

  useEffect(() => {
    const animateParticle = () => {
      // Reset to start position
      translateX.setValue(startX);
      translateY.setValue(startY);
      opacity.setValue(0.8); // CHANGED: Increased from 0.3 to 0.8

      // Create random movement
      const randomX = startX + (Math.random() * 80 - 40);
      const randomY = startY + (Math.random() * 80 - 40);

      const moveX = Animated.timing(translateX, {
        toValue: randomX,
        duration: duration,
        useNativeDriver: true,
        delay: delay,
      });

      const moveY = Animated.timing(translateY, {
        toValue: randomY,
        duration: duration,
        useNativeDriver: true,
        delay: delay,
      });

      const fadeInOut = Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1.0, // CHANGED: Increased from 0.7 to 1.0 (fully opaque)
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.8, // CHANGED: Increased from 0.3 to 0.8
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]);

      Animated.parallel([moveX, moveY, fadeInOut]).start(() => {
        setTimeout(() => {
          animateParticle();
        }, 500);
      });
    };

    const startDelay = setTimeout(() => {
      animateParticle();
    }, delay);

    return () => clearTimeout(startDelay);
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // CHANGED: Increased from 0.6 to 0.9
          position: 'absolute',
          left: 0,
          top: 0,
          transform: [{ translateX }, { translateY }],
          opacity: opacity,
        },
      ]}
    />
  );
};

const ParticleBackground = () => {
  const particles = Array.from({ length: 25 }).map((_, index) => { // CHANGED: Increased from 20 to 25 particles
    const size = 4 + Math.random() * 8; // CHANGED: Increased from 3-9px to 4-12px
    const duration = 3000 + Math.random() * 3000; // CHANGED: Faster movement
    const delay = Math.random() * 1000; // CHANGED: Shorter delay

    // Scatter particles across the entire header frame, avoiding text areas
    let startX, startY;

    // Create safe zones avoiding text areas - more scattered distribution
    const safeZones = [
      // Top left corner (above greeting, avoiding name area)
      { x: [20, width * 0.3], y: [20, 50] },
      // Top right corner (above status area)
      { x: [width * 0.7, width - 20], y: [20, 50] },
      // Middle left (below name area)
      { x: [20, width * 0.35], y: [140, 180] },
      // Middle right (below status area)
      { x: [width * 0.65, width - 20], y: [140, 180] },
      // Center top (between greeting and date)
      { x: [width * 0.35, width * 0.65], y: [70, 110] },
      // Bottom left (below date/time)
      { x: [20, width * 0.4], y: [190, 220] },
      // Bottom right (below date/time)
      { x: [width * 0.6, width - 20], y: [190, 220] },
    ];

    // Randomly select a safe zone
    const selectedZone = safeZones[Math.floor(Math.random() * safeZones.length)];

    startX = selectedZone.x[0] + Math.random() * (selectedZone.x[1] - selectedZone.x[0]);
    startY = selectedZone.y[0] + Math.random() * (selectedZone.y[1] - selectedZone.y[0]);

    return (
      <Particle
        key={index}
        size={size}
        duration={duration}
        delay={delay}
        startX={startX}
        startY={startY}
      />
    );
  });

  return <View style={styles.particleContainer}>{particles}</View>;
};

export default function StudentDashboardScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('verified');
  const [nextAppointment, setNextAppointment] = useState(null);
  const [studentName, setStudentName] = useState('Loading...');
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    cancellations: 0,
    completionRate: 0,
  });
  const [availability, setAvailability] = useState({
    medical: 3,
    dental: 1,
  });
  const [notifications, setNotifications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const mockUserData = {
    studentName: 'Harry Inidal',
    studentId: '2023301940',
    yearLevel: '3rd Year',
    verification: {
      corStatus: 'verified',
      schoolIdStatus: 'verified',
    },
  };

  // Mock doctors data for availability check
  const mockDoctors = [
    {
      id: '1',
      name: 'Dr. Maria Santos',
      specialty: 'Dentist',
      service: 'dental',
      availableSlots: [
        { id: 's1', date: '2026-01-31', time: '09:00 AM - 09:30 AM', available: true },
        { id: 's2', date: '2026-01-31', time: '10:00 AM - 10:30 AM', available: true },
      ],
    },
    {
      id: '2',
      name: 'Dr. James Wilson',
      specialty: 'General Physician',
      service: 'medical',
      availableSlots: [
        { id: 's5', date: '2026-01-31', time: '08:30 AM - 09:00 AM', available: true },
        { id: 's6', date: '2026-01-31', time: '01:00 PM - 01:30 PM', available: true },
      ],
    },
  ];

  // Function to get logged-in user's display name
  const getStudentName = async () => {
    try {
      // Prefer cached user in AsyncStorage (check both keys used in app)
      const storedCurrent = await AsyncStorage.getItem('currentUser');
      const storedUser = await AsyncStorage.getItem('user');
      if (storedCurrent) {
        try {
          const parsed = JSON.parse(storedCurrent);
          if (parsed.fullName || parsed.full_name || parsed.name) {
            setStudentName(parsed.fullName || parsed.full_name || parsed.name);
            return;
          }
        } catch (e) {
          // ignore parse errors and continue
        }
      }
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.full_name || parsed.name) {
            setStudentName(parsed.full_name || parsed.name);
            return;
          }
        } catch (e) {
          // ignore parse errors and continue
        }
      }

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
      }

      if (!session || !session.user) {
        console.log('No session found');
        setStudentName('Student');
        return;
      }

      // Try to fetch user profile from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('full_name, email, role')
        .eq('email', session.user.email)
        .single();

      let name = null;
      if (!userError && userData && userData.full_name) {
        name = userData.full_name;
      }

      // Fallbacks: session metadata or email local-part
      if (!name && session.user.user_metadata && session.user.user_metadata.full_name) {
        name = session.user.user_metadata.full_name;
      }
      if (!name && session.user.email) {
        name = session.user.email.split('@')[0];
      }
      if (!name) name = 'Student';

      setStudentName(name);

      // Cache for next time
      await AsyncStorage.setItem('user', JSON.stringify({ full_name: name, email: session.user.email }));

    } catch (error) {
      console.error('Error in getStudentName:', error);
      setStudentName('Student');
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Get student name first
      await getStudentName();

      // Get real appointments from service
      const appointments = await appointmentService.getAppointments();

      // Get booked slots to check availability
      const bookedSlots = await appointmentService.getBookedSlots();

      // Calculate stats from real data
      const calculatedStats = calculateRealStats(appointments);
      setStats({
        totalAppointments: calculatedStats.total,
        upcomingAppointments: calculatedStats.upcoming,
        cancellations: calculatedStats.cancelled,
        completionRate: `${calculatedStats.completionRate}`,
      });

      // Get next upcoming appointment
      const nextAppt = getNextAppointment(appointments);
      setNextAppointment(nextAppt);

      // Calculate real-time availability
      const availableSlots = checkRealTimeAvailability(bookedSlots);
      setAvailability(availableSlots);

      // Generate real notifications
      const realNotifications = getRealNotifications(appointments);
      setNotifications(realNotifications);

      // Generate recent activity
      const activity = getRecentActivity(appointments);
      setRecentActivity(activity);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateRealStats = (appointments) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const upcoming = appointments.filter(a => 
      a.status === 'confirmed' && new Date(a.date) >= now
    ).length;
    
    const past = appointments.filter(a => 
      (a.status === 'completed' || new Date(a.date) < now) && a.status !== 'cancelled'
    ).length;
    
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    
    const total = appointments.length;
    
    const completionRate = total > 0 ? Math.round((past / total) * 100) : 0;
    
    return { upcoming, past, cancelled, total, completionRate };
  };

  const getNextAppointment = (appointments) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const upcomingAppointments = appointments
      .filter(a => a.status === 'confirmed' && new Date(a.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return upcomingAppointments[0] || null;
  };

  const checkRealTimeAvailability = (bookedSlots) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    let medicalSlots = 3;
    let dentalSlots = 1;
    
    // Check mock doctors for today's availability
    mockDoctors.forEach(doctor => {
      doctor.availableSlots.forEach(slot => {
        // Only count slots for today that aren't booked
        if (slot.date === todayStr && slot.available) {
          const isBooked = bookedSlots.some(booked => booked.slotId === slot.id);
          if (!isBooked) {
            if (doctor.service === 'medical') {
              medicalSlots++;
            } else if (doctor.service === 'dental') {
              dentalSlots++;
            }
          }
        }
      });
    });
    
    return {
      medical: medicalSlots,
      dental: dentalSlots,
    };
  };

  const getRealNotifications = (appointments) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const notifications = [];
    
    // Check for appointments tomorrow
    const tomorrowAppointments = appointments.filter(a => {
      if (a.status !== 'confirmed') return false;
      const appointmentDate = new Date(a.date);
      return appointmentDate.toDateString() === tomorrow.toDateString();
    });
    
    tomorrowAppointments.forEach(apt => {
      notifications.push({
        id: `reminder-${apt.id}`,
        message: `Reminder: Appointment with ${apt.doctorName} tomorrow`,
        type: 'reminder',
        read: false,
      });
    });
    
    // Add verification notification if pending
    if (verificationStatus === 'pending') {
      notifications.push({
        id: 'verify',
        message: 'Complete your verification to book appointments',
        type: 'warning',
        read: false,
      });
    }
    
    // If no appointments, suggest booking
    if (appointments.length === 0) {
      notifications.push({
        id: 'welcome',
        message: 'Welcome! Book your first appointment to get started',
        type: 'info',
        read: false,
      });
    }
    
    return notifications;
  };

  const getRecentActivity = (appointments) => {
    // Sort by date (newest first) and take last 4
    const sortedAppointments = [...appointments]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4);
    
    return sortedAppointments.map(apt => {
      let type = 'booking';
      let action = `${apt.service} booked`;
      
      if (apt.status === 'cancelled') {
        type = 'cancel';
        action = 'Appointment cancelled';
      } else if (apt.status === 'completed') {
        type = 'completed';
        action = `${apt.service} completed`;
      }
      
      return {
        id: apt.id,
        date: formatDate(apt.date).split(',')[0], // Just get month and day
        action: action,
        type: type,
      };
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.split(' - ')[0];
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

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Add your actual logout logic here
            console.log('User logged out');
            // Navigate to login screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        },
      ]
    );
  };

  const handleBookAppointment = () => {
    navigation.navigate('Book');
  };

  const handleViewAppointments = () => {
    navigation.navigate('Appointments');
  };

  const handleUploadDocuments = () => {
    Alert.alert(
      'Upload Verification',
      'You can upload your Certificate of Registration (CoR) for faster verification.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upload Now', onPress: () => navigation.navigate('MyDocument') },
      ]
    );
  };

  const handleCancelAppointment = async (appointmentId) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            try {
              await appointmentService.updateAppointmentStatus(
                appointmentId,
                'cancelled',
                'Cancelled by student from dashboard'
              );
              
              // Refresh dashboard data
              loadDashboardData();
              
              Alert.alert('Cancelled', 'Your appointment has been cancelled.');
            } catch (error) {
              console.error('Cancellation error:', error);
              Alert.alert('Error', 'Failed to cancel appointment');
            }
          }
        },
      ]
    );
  };

  const handleMarkAllNotificationsRead = () => {
    // In a real app, you would update notification status in your database
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    Alert.alert('Success', 'All notifications marked as read');
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
          {/* Particle Background */}
          <ParticleBackground />

          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.studentName}>{studentName}</Text>
              <Text style={styles.studentId}>ID: {mockUserData.studentId}</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.statusIndicator}>
                <View style={[
                  styles.statusDot, 
                  { backgroundColor: verificationStatus === 'verified' ? '#10B981' : '#F59E0B' }
                ]} />
                <Text style={styles.statusText}>
                  {verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={20} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* VERIFICATION STATUS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text-outline" size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Verification Status</Text>
          </View>
          
          {/* PRIMARY VERIFICATION STATUS */}
          <View style={styles.verificationSection}>
            <Text style={styles.sectionLabel}>Document Verification</Text>
            <View style={styles.primaryStatusRow}>
              <View style={styles.primaryStatusItem}>
                <View style={styles.statusIconContainer}>
                  <Ionicons
                    name={getStatusIcon(mockUserData.verification.corStatus)}
                    size={24}
                    color={getStatusColor(mockUserData.verification.corStatus)}
                  />
                </View>
                <View style={styles.statusTextContainer}>
                  <Text style={styles.primaryStatusLabel}>Certificate of Registration</Text>
                  <Text style={[
                    styles.primaryStatusValue,
                    { color: getStatusColor(mockUserData.verification.corStatus) }
                  ]}>
                    {mockUserData.verification.corStatus.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.primaryStatusItem}>
                <View style={styles.statusIconContainer}>
                  <Ionicons
                    name={getStatusIcon(mockUserData.verification.schoolIdStatus)}
                    size={24}
                    color={getStatusColor(mockUserData.verification.schoolIdStatus)}
                  />
                </View>
                <View style={styles.statusTextContainer}>
                  <Text style={styles.primaryStatusLabel}>School ID</Text>
                  <Text style={[
                    styles.primaryStatusValue,
                    { color: getStatusColor(mockUserData.verification.schoolIdStatus) }
                  ]}>
                    {mockUserData.verification.schoolIdStatus.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* SECONDARY INFORMATION */}
          <View style={styles.secondarySection}>
            <Text style={styles.sectionLabel}>Student Information</Text>
            <View style={styles.secondaryInfoRow}>
              <View style={styles.secondaryInfoItem}>
                <Ionicons name="school-outline" size={18} color="#6B7280" />
                <View style={styles.secondaryTextContainer}>
                  <Text style={styles.secondaryInfoLabel}>Year Level</Text>
                  <Text style={styles.secondaryInfoValue}>{mockUserData.yearLevel}</Text>
                </View>
              </View>

              <View style={styles.secondaryInfoItem}>
                <Ionicons name="time-outline" size={18} color="#6B7280" />
                <View style={styles.secondaryTextContainer}>
                  <Text style={styles.secondaryInfoLabel}>Last Updated</Text>
                  <Text style={styles.secondaryInfoValue}>Today</Text>
                </View>
              </View>
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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber1}>{stats.totalAppointments}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber2}>{stats.upcomingAppointments}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          
          <View style={[styles.statCard, styles.statCardError]}>
            <Text style={styles.statNumber3}>{stats.cancellations}</Text>
            <Text style={styles.statLabel}>Cancelled</Text>
          </View>
          
          <View style={[styles.statCard, styles.statCardSuccess]}>
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
            <Text style={styles.actionText}>Book Appointment</Text>
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
            onPress={() => navigation.navigate('FAQScreen')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="help-circle-outline" size={28} color="#F59E0B" />
            </View>
            <Text style={styles.actionText}>FAQ & Help</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionBox}
            onPress={() => navigation.navigate('MyDocument')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="document-text-outline" size={28} color="#10B981" />
            </View>
            <Text style={styles.actionText}>My Documents</Text>
          </TouchableOpacity>
        </View>

        {/* NEXT APPOINTMENT CARD */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Next Appointment</Text>
        </View>
        
        {nextAppointment ? (
          <View style={[styles.card, styles.appointmentCard]}>
            <View style={styles.appointmentHeader}>
              <View style={styles.serviceBadge}>
                <Ionicons 
                  name={nextAppointment.service?.toLowerCase().includes('dental') ? 'fitness-outline' : 'medical-outline'} 
                  size={16} 
                  color="#2563EB" 
                />
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
                  {nextAppointment.status?.toUpperCase() || 'CONFIRMED'}
                </Text>
              </View>
            </View>
            
            <View style={styles.appointmentDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={18} color="#6B7280" />
                <Text style={styles.detailLabel}>Doctor: </Text>
                <Text style={styles.detailValue}>{nextAppointment.doctorName}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                <Text style={styles.detailLabel}>Date: </Text>
                <Text style={styles.detailValue}>
                  {formatDate(nextAppointment.date)}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={18} color="#6B7280" />
                <Text style={styles.detailLabel}>Time: </Text>
                <Text style={styles.detailValue}>
                  {formatTime(nextAppointment.time)}
                </Text>
              </View>
            </View>
            
            <View style={styles.appointmentActions}>
              <TouchableOpacity 
                style={styles.viewButton}
                onPress={() => navigation.navigate('Appointments')}
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
        ) : (
          <View style={[styles.card, styles.noAppointmentCard]}>
            <Ionicons name="calendar-outline" size={48} color="#CBD5E1" />
            <Text style={styles.noAppointmentText}>No upcoming appointments</Text>
            <TouchableOpacity 
              style={styles.bookNowButtonSmall}
              onPress={handleBookAppointment}
            >
              <Text style={styles.bookNowButtonText}>Book Appointment</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SERVICE AVAILABILITY QUICK VIEW */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Today</Text>
        </View>
        
        <View style={styles.availabilityCard}>
          <View style={styles.availabilityItem}>
            <View style={styles.availabilityIcon}>
              <Ionicons name="medical-outline" size={24} color="#3B82F6" />
            </View>
            <View style={styles.availabilityDetails}>
              <Text style={styles.availabilityService}>Medical</Text>
              <Text style={styles.availabilitySlots}>
                {availability.medical} {availability.medical === 1 ? 'slot' : 'slots'} available
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
                {availability.dental} {availability.dental === 1 ? 'slot' : 'slots'} available
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.bookNowButton}
            onPress={handleBookAppointment}
            disabled={availability.medical === 0 && availability.dental === 0}
          >
            <Text style={styles.bookNowText}>
              {availability.medical === 0 && availability.dental === 0 
                ? 'No Slots Available' 
                : 'Book Now'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* NOTIFICATIONS SECTION */}
        <View style={styles.sectionHeader}>
          <View style={styles.notificationsHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            {notifications.length > 0 && (
              <TouchableOpacity onPress={handleMarkAllNotificationsRead}>
                <Text style={styles.markAllText}>Mark all read</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {notifications.length > 0 ? (
          <View style={styles.notificationsCard}>
            {notifications.map((notification) => (
              <View key={notification.id} style={styles.notificationItem}>
                <Ionicons 
                  name={notification.type === 'warning' ? 'warning-outline' : 
                        notification.type === 'info' ? 'information-circle-outline' : 
                        'notifications-outline'} 
                  size={20} 
                  color={notification.type === 'warning' ? '#F59E0B' : 
                         notification.type === 'info' ? '#3B82F6' : '#2563EB'} 
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
        ) : (
          <View style={[styles.card, styles.noNotificationsCard]}>
            <Ionicons name="notifications-off-outline" size={32} color="#CBD5E1" />
            <Text style={styles.noNotificationsText}>No notifications</Text>
          </View>
        )}

        {/* RECENT ACTIVITY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={handleViewAppointments}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {recentActivity.length > 0 ? (
          <View style={styles.activityCard}>
            {recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons 
                    name={
                      activity.type === 'booking' ? 'calendar-outline' :
                      activity.type === 'completed' ? 'checkmark-done-outline' :
                      'close-circle-outline'
                    } 
                    size={16} 
                    color={
                      activity.type === 'booking' ? '#2563EB' :
                      activity.type === 'completed' ? '#10B981' :
                      '#EF4444'
                    } 
                  />
                </View>
                <View style={styles.activityDetails}>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.card, styles.noActivityCard]}>
            <Ionicons name="time-outline" size={32} color="#CBD5E1" />
            <Text style={styles.noActivityText}>No recent activity</Text>
            <TouchableOpacity 
              style={styles.bookNowButtonSmall}
              onPress={handleBookAppointment}
            >
              <Text style={styles.bookNowButtonText}>Book Your First Appointment</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SYSTEM STATUS */}
        <View style={styles.systemStatus}>
          <View style={styles.systemStatusItem}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.systemStatusText}>Clinic Hours: 8AM-5PM</Text>
          </View>
          <View style={styles.systemStatusItem}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.systemStatusText}>Last Updated: Just now</Text>
          </View>
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
    minWidth: 170
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
    marginTop: 30,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerRight: {
    alignItems: 'flex-end',
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
    marginBottom: 12,
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
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
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
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
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
    minWidth: 150
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
  
  // NO APPOINTMENT CARD
  noAppointmentCard: {
    alignItems: 'center',
    padding: 30,
    marginTop: 0,
  },
  noAppointmentText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  bookNowButtonSmall: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookNowButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
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
    minWidth: 85
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
  noNotificationsCard: {
    alignItems: 'center',
    padding: 30,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  noNotificationsText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
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
  noActivityCard: {
    alignItems: 'center',
    padding: 30,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  noActivityText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
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
    marginLeft: 3,
    minWidth: 168
  },
  
  // VERIFICATION STATUS HIERARCHY
  verificationSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  primaryStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  primaryStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  statusIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusTextContainer: {
    flex: 1,
  },
  primaryStatusLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 3,
    fontWeight: '500',
    lineHeight: 13,
  },
  primaryStatusValue: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },

  // SECONDARY INFORMATION
  secondarySection: {
    marginBottom: 16,
  },
  secondaryInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  secondaryTextContainer: {
    marginLeft: 8,
  },
  secondaryInfoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  secondaryInfoValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

  // FOOTER
  footer: {
    height: 40,
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
  },
});
