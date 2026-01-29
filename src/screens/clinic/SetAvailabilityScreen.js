import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function SetAvailabilityScreen() {
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    serviceType: 'medical',
    startDate: '2024-03-18',
    endDate: '2024-03-22',
    startTime: '09:00',
    endTime: '17:00',
    maxPatients: '4',
    isActive: true,
  });

  const serviceTypes = [
    { id: 'medical', label: 'Medical Consultation', icon: 'medkit-outline', color: '#3B82F6' },
    { id: 'dental', label: 'Dental Checkup', icon: 'fitness-outline', color: '#10B981' },
    { id: 'emergency', label: 'Emergency Slot', icon: 'alert-circle-outline', color: '#EF4444' },
  ];

  const daysOfWeek = [
    { id: 0, name: 'Monday', short: 'Mon', active: true },
    { id: 1, name: 'Tuesday', short: 'Tue', active: true },
    { id: 2, name: 'Wednesday', short: 'Wed', active: false },
    { id: 3, name: 'Thursday', short: 'Thu', active: true },
    { id: 4, name: 'Friday', short: 'Fri', active: true },
    { id: 5, name: 'Saturday', short: 'Sat', active: false },
    { id: 6, name: 'Sunday', short: 'Sun', active: false },
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleSubmit = () => {
    // Calculate generated slots
    const slotsGenerated = 32; // Example calculation
    
    navigation.goBack();
    // Show success message
    setTimeout(() => {
      alert(`✅ Success! Generated ${slotsGenerated} appointment slots`);
    }, 300);
  };

  const toggleDay = (dayId) => {
    // Toggle day logic would go here
    console.log('Toggle day:', dayId);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
              <Text style={styles.greeting}>Set Availability</Text>
              <Text style={styles.subtitle}>Auto-generate appointment slots</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="close-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SERVICE TYPE SELECTION */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="medkit-outline" size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Service Type</Text>
          </View>
          
          <View style={styles.serviceGrid}>
            {serviceTypes.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceOption,
                  formData.serviceType === service.id && styles.serviceSelected
                ]}
                onPress={() => handleInputChange('serviceType', service.id)}
              >
                <View style={[
                  styles.serviceIcon,
                  { backgroundColor: formData.serviceType === service.id ? `${service.color}20` : '#F8FAFC' }
                ]}>
                  <Ionicons 
                    name={service.icon} 
                    size={20} 
                    color={formData.serviceType === service.id ? service.color : '#64748B'} 
                  />
                </View>
                <Text style={[
                  styles.serviceLabel,
                  formData.serviceType === service.id && styles.serviceLabelSelected
                ]}>
                  {service.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* DATE RANGE */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar-outline" size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Date Range</Text>
          </View>
          
          <View style={styles.dateRangeContainer}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.inputLabel}>Start Date</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="calendar-outline" size={20} color="#64748B" />
                <Text style={styles.inputValue}>{formData.startDate}</Text>
              </View>
            </View>
            
            <Ionicons name="arrow-forward" size={20} color="#64748B" style={styles.dateArrow} />
            
            <View style={styles.dateInputContainer}>
              <Text style={styles.inputLabel}>End Date</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="calendar-outline" size={20} color="#64748B" />
                <Text style={styles.inputValue}>{formData.endDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* DAYS ACTIVE */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Days Active</Text>
          </View>
          
          <View style={styles.daysGrid}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayCard,
                  day.active && styles.dayCardActive
                ]}
                onPress={() => toggleDay(day.id)}
              >
                <Text style={[
                  styles.dayName,
                  day.active && styles.dayNameActive
                ]}>
                  {day.short}
                </Text>
                <View style={[
                  styles.dayStatus,
                  day.active && styles.dayStatusActive
                ]}>
                  {day.active ? (
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* TIME RANGE */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Time Range</Text>
          </View>
          
          <View style={styles.timeRangeContainer}>
            <View style={styles.timeInputContainer}>
              <Text style={styles.inputLabel}>Start Time</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="time-outline" size={20} color="#64748B" />
                <Text style={styles.inputValue}>{formData.startTime}</Text>
              </View>
            </View>
            
            <Text style={styles.timeTo}>to</Text>
            
            <View style={styles.timeInputContainer}>
              <Text style={styles.inputLabel}>End Time</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="time-outline" size={20} color="#64748B" />
                <Text style={styles.inputValue}>{formData.endTime}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* TIME SLOTS PREVIEW */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="list-outline" size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Time Slots Preview</Text>
          </View>
          
          <View style={styles.timeSlotsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.timeSlotsGrid}>
                {timeSlots.map((time, index) => (
                  <View key={index} style={styles.timeSlot}>
                    <Text style={styles.timeSlotText}>{time}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            <Text style={styles.slotsInfo}>8 slots/day × 4 days = 32 total slots</Text>
          </View>
        </View>

        {/* MAX PATIENTS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="people-outline" size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Max Patients</Text>
          </View>
          
          <View style={styles.capacityContainer}>
            <Text style={styles.inputLabel}>Patients per hour slot</Text>
            <View style={styles.capacityInput}>
              <Ionicons name="people-outline" size={20} color="#64748B" />
              <Text style={styles.capacityValue}>{formData.maxPatients}</Text>
              <Text style={styles.capacityUnit}>patients</Text>
            </View>
            <Text style={styles.capacityNote}>
              Limits how many patients can book each hour
            </Text>
          </View>
        </View>

        {/* ACTIVE STATUS */}
        <View style={styles.card}>
          <View style={styles.statusContainer}>
            <View>
              <Text style={styles.statusTitle}>Active Schedule</Text>
              <Text style={styles.statusSubtitle}>
                When off, no slots will be generated
              </Text>
            </View>
            <Switch
              value={formData.isActive}
              onValueChange={(value) => handleInputChange('isActive', value)}
              trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSubmit}
          >
            <Text style={styles.saveButtonText}>Save & Generate Slots</Text>
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* INFO FOOTER */}
        <View style={styles.footerCard}>
          <Ionicons name="information-circle-outline" size={16} color="#0C4A6E" />
          <Text style={styles.footerText}>
            ✅ Automatically generates slots based on your settings
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
  
  // CARDS
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 12,
  },
  
  // SERVICE GRID
  serviceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceOption: {
    width: '31%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  serviceSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  serviceLabelSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
  
  // DATE RANGE
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInputContainer: {
    flex: 1,
  },
  dateArrow: {
    marginHorizontal: 12,
    marginTop: 24,
  },
  
  // DAYS GRID
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCard: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dayCardActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#2563EB',
  },
  dayName: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  dayNameActive: {
    color: '#2563EB',
  },
  dayStatus: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E2E8F0',
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayStatusActive: {
    backgroundColor: '#2563EB',
  },
  
  // TIME RANGE
  timeRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeInputContainer: {
    flex: 1,
  },
  timeTo: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#64748B',
  },
  
  // INPUT STYLES
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputValue: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1E293B',
  },
  
  // TIME SLOTS
  timeSlotsContainer: {
    marginTop: 8,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
  },
  timeSlot: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#0C4A6E',
    fontWeight: '500',
  },
  slotsInfo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 12,
    textAlign: 'center',
  },
  
  // CAPACITY
  capacityContainer: {
    // Already defined in card
  },
  capacityInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  capacityValue: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1E293B',
  },
  capacityUnit: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  capacityNote: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    fontStyle: 'italic',
  },
  
  // STATUS
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  statusSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  
  // ACTIONS
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 18,
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 16,
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // FOOTER
  footerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  footerText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0C4A6E',
    lineHeight: 20,
  },
  
  footerSpacing: {
    height: 40,
  },
});