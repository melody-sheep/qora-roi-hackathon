import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';

export default function ClinicDashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Adjusted spacing for notch */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning, Dr. Santos</Text>
            <Text style={styles.date}>Friday, March 15, 2024</Text>
          </View>
        </View>

        {/* Rest of your content remains the same */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Total Appointments</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Waiting</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionTitle}>Set Availability</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionTitle}>Today's Queue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionTitle}>Add Emergency Slot</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionTitle}>Send Announcement</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.scheduleContainer}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          <View style={styles.appointmentsList}>
            <View style={styles.appointmentCard}>
              <Text style={styles.time}>9:00 AM</Text>
              <View style={styles.appointmentDetails}>
                <Text style={styles.patientName}>Maria Santos</Text>
                <Text style={styles.service}>Medical Consultation</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Completed</Text>
              </View>
            </View>
            <View style={styles.appointmentCard}>
              <Text style={styles.time}>10:00 AM</Text>
              <View style={styles.appointmentDetails}>
                <Text style={styles.patientName}>Juan Dela Cruz</Text>
                <Text style={styles.service}>Dental Checkup</Text>
              </View>
              <View style={[styles.statusBadge, styles.inProgress]}>
                <Text style={styles.statusText}>In Progress</Text>
              </View>
            </View>
            <View style={styles.appointmentCard}>
              <Text style={styles.time}>11:00 AM</Text>
              <View style={styles.appointmentDetails}>
                <Text style={styles.patientName}>Ana Reyes</Text>
                <Text style={styles.service}>Medical Consultation</Text>
              </View>
              <View style={[styles.statusBadge, styles.waiting]}>
                <Text style={styles.statusText}>Waiting</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.clinicStatusContainer}>
          <View style={styles.statusRow}>
            <View style={styles.clinicStatus}>
              <View style={styles.greenDot} />
              <Text style={styles.clinicStatusText}>Clinic: OPEN</Text>
            </View>
            <Text style={styles.availableSlots}>6 slots available today</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    // Adjusted padding top based on platform
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight + 16,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 24,
    marginTop: Platform.OS === 'ios' ? 8 : 0, // Less space for iOS, more for Android
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  date: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },
  scheduleContainer: {
    marginBottom: 24,
  },
  appointmentsList: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  time: {
    width: 80,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  appointmentDetails: {
    flex: 1,
    marginLeft: 16,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 4,
  },
  service: {
    fontSize: 14,
    color: '#64748B',
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inProgress: {
    backgroundColor: '#FEF3C7',
  },
  waiting: {
    backgroundColor: '#DBEAFE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#166534',
  },
  clinicStatusContainer: {
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clinicStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    marginRight: 8,
  },
  clinicStatusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
  },
  availableSlots: {
    fontSize: 14,
    color: '#64748B',
  },
});