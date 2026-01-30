import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
  ActivityIndicator,
  TextInput, // ADDED: For direct input
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { useDatabase } from '../../contexts/DatabaseContext';

export default function SetAvailabilityScreen() {
  const navigation = useNavigation();
  const { createAvailability, getServices } = useDatabase();
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingField, setSavingField] = useState(null);
  
  // Date/Time Pickers
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  // Days state - updated to show 2-character format
  const [activeDays, setActiveDays] = useState([0, 1, 3, 4]); // Mo, Tu, Th, Fr
  
  const [formData, setFormData] = useState({
    serviceType: '1',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    maxPatients: '4',
    isActive: true,
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const servicesData = await getServices();
      setServices(servicesData);
      
      if (servicesData.length > 0 && !formData.serviceType) {
        setFormData(prev => ({ ...prev, serviceType: servicesData[0].id }));
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setServices([
        { id: '1', name: 'Medical Consultation', color: '#3B82F6' },
        { id: '2', name: 'Dental Checkup', color: '#10B981' },
        { id: '3', name: 'Emergency Slot', color: '#EF4444' },
      ]);
    }
  };

  const calculateSlots = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
    
    const duration = endTotal - startTotal;
    return Math.floor(duration / 60);
  };

  // UPDATED: Better fitting icons for service types
  const serviceTypes = services.map(service => ({
    id: service.id,
    label: service.name,
    // UPDATED: More appropriate icons for each service type
    icon: service.id === 'medical' ? 'medkit-outline' :  // Medical Consultation - medical kit
           service.id === 'dental' ? 'create-outline' : // Dental Checkup - dental tools
           'alert-circle-outline', // Emergency - alert circle
    color: service.color || '#3B82F6'
  }));

  // UPDATED: Changed to 2-character format for clarity
  const daysOfWeek = [
    { id: 0, name: 'Monday', short: 'Mo' },
    { id: 1, name: 'Tuesday', short: 'Tu' },
    { id: 2, name: 'Wednesday', short: 'We' },
    { id: 3, name: 'Thursday', short: 'Th' },
    { id: 4, name: 'Friday', short: 'Fr' },
    { id: 5, name: 'Saturday', short: 'Sa' },
    { id: 6, name: 'Sunday', short: 'Su' },
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Date/Time picker handlers
  const handleStartDateChange = (date) => {
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      handleFieldSave('startDate', dateStr);
    }
    setShowStartDatePicker(false);
  };

  const handleEndDateChange = (date) => {
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      handleFieldSave('endDate', dateStr);
    }
    setShowEndDatePicker(false);
  };

  const handleStartTimeChange = (date) => {
    if (date) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;
      handleFieldSave('startTime', timeStr);
    }
    setShowStartTimePicker(false);
  };

  const handleEndTimeChange = (date) => {
    if (date) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;
      handleFieldSave('endTime', timeStr);
    }
    setShowEndTimePicker(false);
  };

  const handleFieldSave = async (field, value) => {
    setSavingField(field);
    try {
      // Simulate async save
      await new Promise(resolve => setTimeout(resolve, 500));
      setFormData(prev => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error('Error saving field:', error);
      Alert.alert('Error', 'Failed to save changes');
    } finally {
      setSavingField(null);
    }
  };

  const toggleDay = async (dayId) => {
    setSavingField(`day_${dayId}`);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      if (activeDays.includes(dayId)) {
        setActiveDays(activeDays.filter(d => d !== dayId));
      } else {
        setActiveDays([...activeDays, dayId].sort());
      }
    } catch (error) {
      console.error('Error toggling day:', error);
    } finally {
      setSavingField(null);
    }
  };

  // UPDATED: Handles direct text input for max patients
  const handleMaxPatientsChange = async (newValue) => {
    // Allow empty string temporarily during typing
    if (newValue === '') {
      setFormData(prev => ({ ...prev, maxPatients: '' }));
      return;
    }
    
    const numValue = parseInt(newValue) || 1;
    const clamped = Math.max(1, Math.min(10, numValue));
    await handleFieldSave('maxPatients', clamped.toString());
  };

  // NEW: Handles when user finishes editing the input
  const handleMaxPatientsBlur = async () => {
    if (formData.maxPatients === '') {
      // If empty after blur, set to minimum value
      await handleFieldSave('maxPatients', '1');
    } else {
      const numValue = parseInt(formData.maxPatients) || 1;
      const clamped = Math.max(1, Math.min(10, numValue));
      if (clamped.toString() !== formData.maxPatients) {
        await handleFieldSave('maxPatients', clamped.toString());
      }
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      
      const totalDays = daysDiff * (activeDays.length / 7);
      const slotsPerDay = calculateSlots(formData.startTime, formData.endTime);
      const totalSlots = Math.round(totalDays * slotsPerDay * parseInt(formData.maxPatients));
      
      const result = await createAvailability({
        clinicId: 'clinic_1',
        doctorId: 'doc_1',
        serviceId: formData.serviceType,
        date: formData.startDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        maxPatientsPerSlot: formData.maxPatients,
        activeDays: activeDays,
        isActive: formData.isActive,
      });
      
      if (result.success) {
        navigation.goBack();
        setTimeout(() => {
          Alert.alert(
            '✅ Success!', 
            `Generated ${result.slotsGenerated || totalSlots} appointment slots`,
            [{ text: 'OK' }]
          );
        }, 300);
      } else {
        Alert.alert('Error', result.error || 'Failed to create availability');
      }
    } catch (error) {
      console.error('Error submitting availability:', error);
      Alert.alert('Error', 'Failed to save availability');
    } finally {
      setLoading(false);
    }
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
                onPress={() => handleFieldSave('serviceType', service.id)}
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
                {/* UPDATED: Added multiline support and centered text */}
                <Text 
                  style={[
                    styles.serviceLabel,
                    formData.serviceType === service.id && styles.serviceLabelSelected
                  ]}
                  numberOfLines={2}
                  textAlign="center"
                >
                  {service.label.replace('Consultation', '\nConsultation')} {/* Breaks "Medical Consultation" */}
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
              <TouchableOpacity 
                style={styles.inputWrapper}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#2563EB" />
                {savingField === 'startDate' ? (
                  <ActivityIndicator size="small" color="#2563EB" style={{ marginLeft: 8 }} />
                ) : (
                  <Text style={styles.inputValue}>{formData.startDate}</Text>
                )}
              </TouchableOpacity>
            </View>
            
            <Ionicons name="arrow-forward" size={20} color="#64748B" style={styles.dateArrow} />
            
            <View style={styles.dateInputContainer}>
              <Text style={styles.inputLabel}>End Date</Text>
              <TouchableOpacity 
                style={styles.inputWrapper}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#2563EB" />
                {savingField === 'endDate' ? (
                  <ActivityIndicator size="small" color="#2563EB" style={{ marginLeft: 8 }} />
                ) : (
                  <Text style={styles.inputValue}>{formData.endDate}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Date Pickers */}
        <DateTimePicker
          isVisible={showStartDatePicker}
          mode="date"
          date={formData.startDate ? new Date(formData.startDate + 'T00:00:00') : new Date()}
          onConfirm={handleStartDateChange}
          onCancel={() => setShowStartDatePicker(false)}
        />
        <DateTimePicker
          isVisible={showEndDatePicker}
          mode="date"
          date={formData.endDate ? new Date(formData.endDate + 'T00:00:00') : new Date()}
          onConfirm={handleEndDateChange}
          onCancel={() => setShowEndDatePicker(false)}
        />

        {/* DAYS ACTIVE */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar-number-outline" size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Days Active</Text>
          </View>
          
          {/* UPDATED: Visual hierarchy improvements */}
          <View style={styles.daysGrid}>
            <View style={styles.daysRow}>
              {daysOfWeek.slice(0, 4).map((day) => {
                const isActive = activeDays.includes(day.id);
                return (
                  <View key={day.id} style={styles.dayWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.dayCard,
                        isActive && styles.dayCardActive
                      ]}
                      onPress={() => toggleDay(day.id)}
                    >
                      {savingField === `day_${day.id}` ? (
                        <ActivityIndicator size="small" color={isActive ? '#FFFFFF' : '#2563EB'} />
                      ) : (
                        <Text style={[
                          styles.dayName,
                          isActive && styles.dayNameActive
                        ]}>
                          {day.short}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
            <View style={styles.daysRow}>
              {daysOfWeek.slice(4).map((day) => {
                const isActive = activeDays.includes(day.id);
                return (
                  <View key={day.id} style={styles.dayWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.dayCard,
                        isActive && styles.dayCardActive
                      ]}
                      onPress={() => toggleDay(day.id)}
                    >
                      {savingField === `day_${day.id}` ? (
                        <ActivityIndicator size="small" color={isActive ? '#FFFFFF' : '#2563EB'} />
                      ) : (
                        <Text style={[
                          styles.dayName,
                          isActive && styles.dayNameActive
                        ]}>
                          {day.short}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
          {/* UPDATED: Added legend for clarity */}
          <Text style={styles.daysLegend}>
            Selected: {activeDays.map(id => daysOfWeek.find(d => d.id === id)?.short).join(', ')}
          </Text>
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
              <TouchableOpacity 
                style={styles.inputWrapper}
                onPress={() => setShowStartTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color="#2563EB" />
                {savingField === 'startTime' ? (
                  <ActivityIndicator size="small" color="#2563EB" style={{ marginLeft: 8 }} />
                ) : (
                  <Text style={styles.inputValue}>{formData.startTime}</Text>
                )}
              </TouchableOpacity>
            </View>
            
            <Text style={styles.timeTo}>to</Text>
            
            <View style={styles.timeInputContainer}>
              <Text style={styles.inputLabel}>End Time</Text>
              <TouchableOpacity 
                style={styles.inputWrapper}
                onPress={() => setShowEndTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color="#2563EB" />
                {savingField === 'endTime' ? (
                  <ActivityIndicator size="small" color="#2563EB" style={{ marginLeft: 8 }} />
                ) : (
                  <Text style={styles.inputValue}>{formData.endTime}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Time Pickers */}
        <DateTimePicker
          isVisible={showStartTimePicker}
          mode="time"
          date={formData.startTime ? new Date(`2024-01-01T${formData.startTime}:00`) : new Date()}
          onConfirm={handleStartTimeChange}
          onCancel={() => setShowStartTimePicker(false)}
        />
        <DateTimePicker
          isVisible={showEndTimePicker}
          mode="time"
          date={formData.endTime ? new Date(`2024-01-01T${formData.endTime}:00`) : new Date()}
          onConfirm={handleEndTimeChange}
          onCancel={() => setShowEndTimePicker(false)}
        />

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
            <Text style={styles.slotsInfo}>
              {calculateSlots(formData.startTime, formData.endTime)} slots/day × {activeDays.length} days = {calculateSlots(formData.startTime, formData.endTime) * activeDays.length} total slots
            </Text>
          </View>
        </View>

        {/* MAX PATIENTS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="people-outline" size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Max Patients Per Slot</Text>
          </View>
          
          <View style={styles.capacityContainer}>
            <Text style={styles.inputLabel}>Patients per time slot</Text>
            {/* UPDATED: Added TextInput for direct input */}
            <View style={styles.capacityInputContainer}>
              <TouchableOpacity
                style={styles.capacityButton}
                onPress={() => handleMaxPatientsChange((parseInt(formData.maxPatients) - 1).toString())}
              >
                <Ionicons name="remove" size={20} color="#2563EB" />
              </TouchableOpacity>
              
              {savingField === 'maxPatients' ? (
                <ActivityIndicator size="small" color="#2563EB" style={{ flex: 1 }} />
              ) : (
                <TextInput
                  style={styles.capacityInput}
                  value={formData.maxPatients}
                  onChangeText={handleMaxPatientsChange}
                  onBlur={handleMaxPatientsBlur}
                  keyboardType="numeric"
                  maxLength={2}
                  selectTextOnFocus
                  textAlign="center"
                />
              )}
              
              <TouchableOpacity
                style={styles.capacityButton}
                onPress={() => handleMaxPatientsChange((parseInt(formData.maxPatients) + 1).toString())}
              >
                <Ionicons name="add" size={20} color="#2563EB" />
              </TouchableOpacity>
            </View>
            <Text style={styles.capacityNote}>
              Limits how many patients can book each time slot (1-10)
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
              onValueChange={(value) => handleFieldSave('isActive', value)}
              trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.saveButton, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save & Generate Slots</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* INFO FOOTER */}
        <View style={styles.footerCard}>
          <Ionicons name="information-circle-outline" size={16} color="#0C4A6E" />
          <Text style={styles.footerText}>
            ✅ All changes are auto-saved. Click save to generate slots.
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
  
  // SERVICE GRID - UPDATED for multiline text
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
    lineHeight: 16, // Better for multiline
    minHeight: 32, // Ensure consistent height
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
  
  // DAYS GRID - UPDATED for better visual hierarchy
  daysGrid: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  dayWrapper: {
    width: '14.28%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  dayCard: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    padding: 4,
  },
  dayCardActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1E40AF',
  },
  dayName: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  dayNameActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dayStatus: {
    display: 'none',
  },
  dayStatusActive: {
    display: 'none',
  },
  daysLegend: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center',
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
    marginTop: 24,
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
    fontWeight: '500',
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
  
  // CAPACITY - UPDATED for TextInput
  capacityContainer: {
    // Already defined in card
  },
  capacityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  capacityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // UPDATED: New style for TextInput
  capacityInput: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 0, // Remove default padding
    minHeight: 30, // Ensure proper touch area
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
    marginHorizontal: 8,
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