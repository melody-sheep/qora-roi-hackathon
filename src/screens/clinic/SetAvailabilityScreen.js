import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { Calendar, Clock, Users } from 'lucide-react-native';

const SetAvailabilityScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    serviceType: '',
    date: '',
    startTime: '',
    endTime: '',
    maxPatients: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Service types options
  const serviceTypes = [
    { id: 'consultation', label: 'Consultation' },
    { id: 'follow-up', label: 'Follow-up' },
    { id: 'emergency', label: 'Emergency' },
    { id: 'routine', label: 'Routine Check' },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Please enter start time';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'Please enter end time';
    }
    
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    
    if (!formData.maxPatients) {
      newErrors.maxPatients = 'Please enter maximum patients';
    } else if (isNaN(formData.maxPatients) || parseInt(formData.maxPatients) <= 0) {
      newErrors.maxPatients = 'Please enter a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call to generate slots
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Availability Set Successfully!',
        'System has auto-generated appointment slots based on your availability.',
        [
          {
            text: 'View Slots',
            onPress: () => navigation.navigate('AppointmentSlots'),
          },
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Set Your Availability</Text>
          <Text style={styles.subtitle}>
            Enter your availability below. The system will auto-generate appointment slots.
          </Text>
        </View>

        <View style={styles.card}>
          {/* Service Type Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Service Type</Text>
            <View style={styles.roleContainer}>
              {serviceTypes.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.roleOption,
                    formData.serviceType === service.id && styles.roleSelected,
                  ]}
                  onPress={() => handleInputChange('serviceType', service.id)}
                >
                  <Text
                    style={[
                      styles.roleText,
                      formData.serviceType === service.id && styles.roleTextSelected,
                    ]}
                  >
                    {service.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.serviceType && (
              <Text style={styles.errorText}>{errors.serviceType}</Text>
            )}
          </View>

          {/* Date Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.inputWrapper}>
              <Calendar size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.date}
                onChangeText={(text) => handleInputChange('date', text)}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
          </View>

          {/* Time Inputs in Row */}
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Start Time</Text>
              <View style={styles.inputWrapper}>
                <Clock size={20} color="#64748B" />
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM"
                  value={formData.startTime}
                  onChangeText={(text) => handleInputChange('startTime', text)}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
              {errors.startTime && (
                <Text style={styles.errorText}>{errors.startTime}</Text>
              )}
            </View>

            <View style={{ width: 16 }} />

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>End Time</Text>
              <View style={styles.inputWrapper}>
                <Clock size={20} color="#64748B" />
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM"
                  value={formData.endTime}
                  onChangeText={(text) => handleInputChange('endTime', text)}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
              {errors.endTime && (
                <Text style={styles.errorText}>{errors.endTime}</Text>
              )}
            </View>
          </View>

          {/* Max Patients Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Maximum Patients</Text>
            <View style={styles.inputWrapper}>
              <Users size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="e.g., 10"
                value={formData.maxPatients}
                onChangeText={(text) => handleInputChange('maxPatients', text)}
                keyboardType="number-pad"
              />
            </View>
            {errors.maxPatients && (
              <Text style={styles.errorText}>{errors.maxPatients}</Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Generating Slots...' : 'Set Availability'}
            </Text>
          </TouchableOpacity>

          {/* Info Text */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              ✅ After submission, the system will automatically generate appointment slots
              based on your availability and maximum patients.
            </Text>
            <Text style={[styles.infoText, { marginTop: 8 }]}>
              📍 No manual scheduling required!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0F172A' 
  },
  scrollContent: { 
    flexGrow: 1, 
    padding: 20,
    paddingTop: 40 
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 8 
  },
  subtitle: { 
    textAlign: 'center', 
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20 
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 24, 
    elevation: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  inputContainer: { 
    marginBottom: 20 
  },
  label: { 
    fontWeight: '600', 
    marginBottom: 8,
    color: '#334155',
    fontSize: 14 
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    gap: 10,
    backgroundColor: '#F8FAFC',
  },
  input: { 
    flex: 1, 
    height: 44,
    color: '#1E293B',
    fontSize: 15 
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleContainer: { 
    flexDirection: 'row', 
    gap: 12,
    flexWrap: 'wrap' 
  },
  roleOption: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
  },
  roleSelected: { 
    borderColor: '#2563EB', 
    backgroundColor: '#EFF6FF' 
  },
  roleText: { 
    fontWeight: '600', 
    color: '#64748B',
    fontSize: 13 
  },
  roleTextSelected: { 
    color: '#2563EB' 
  },
  errorText: { 
    color: '#EF4444', 
    fontSize: 12,
    marginTop: 4 
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  buttonDisabled: { 
    backgroundColor: '#94A3B8' 
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '600',
    fontSize: 16 
  },
  infoContainer: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 10,
    marginTop: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  infoText: {
    color: '#0369A1',
    fontSize: 13,
    lineHeight: 18,
  },
});

export default SetAvailabilityScreen;