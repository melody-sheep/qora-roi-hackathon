import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function ClinicProfile() {
  const navigation = useNavigation();
  
  // Clinic profile data
  const [clinicProfile, setClinicProfile] = useState({
    id: '1',
    name: 'Metro Health Clinic',
    tagline: 'Quality Healthcare for All',
    doctorName: 'Dr. Maria Santos',
    specialty: 'General Medicine & Family Practice',
    email: 'dr.maria@metrohealth.com',
    phone: '+63 912 345 6789',
    address: 'USTP, Lapasan, CDO',
    clinicHours: {
      monday: { open: '8:00 AM', close: '5:00 PM', closed: false },
      tuesday: { open: '8:00 AM', close: '5:00 PM', closed: false },
      wednesday: { open: '8:00 AM', close: '5:00 PM', closed: false },
      thursday: { open: '8:00 AM', close: '5:00 PM', closed: false },
      friday: { open: '8:00 AM', close: '5:00 PM', closed: false },
      saturday: { open: '9:00 AM', close: '2:00 PM', closed: false },
      sunday: { open: 'Closed', close: 'Closed', closed: true },
    },
    services: [
      'Medical Consultation',
      'Dental Checkup',
      'Follow-up Visits',
      'Vaccination',
      'Health Screening',
      'Emergency Care',
    ],
    consultationFee: 500,
    rating: 4.8,
    totalReviews: 245,
    establishedYear: 2015,
    clinicSize: 'Medium (10-15 patients/day)',
    licenseNumber: 'PRC-123456',
    taxId: '123-456-789-000',
    clinicDescription: 'Metro Health Clinic provides comprehensive healthcare services with a patient-centered approach. We believe in accessible, quality healthcare for all members of the community.',
    profileImage: 'https://via.placeholder.com/150', // Replace with actual image URL
  });

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');

  // Load clinic profile data
  const loadClinicProfile = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadClinicProfile();
  }, []);

  const handleEdit = () => {
    setEditData({ ...clinicProfile });
    setEditing(true);
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API update
    setTimeout(() => {
      setClinicProfile(editData);
      setEditing(false);
      setLoading(false);
      Alert.alert('Success', 'Profile updated successfully');
    }, 1000);
  };

  const handleCancel = () => {
    setEditing(false);
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', onPress: () => setEditing(false) },
      ]
    );
  };

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleServiceToggle = (service) => {
    const updatedServices = editData.services.includes(service)
      ? editData.services.filter(s => s !== service)
      : [...editData.services, service];
    
    setEditData({ ...editData, services: updatedServices });
  };

  const handleImagePick = async (fromCamera) => {
    try {
      const permissionResult = fromCamera 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission required', 'Permission to access camera or gallery is required!');
        return;
      }

      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        setEditData({ ...editData, profileImage: selectedImage.uri });
        setModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error('Image pick error:', error);
    }
  };

  const handleClinicHoursToggle = (day) => {
    const updatedHours = { ...editData.clinicHours };
    updatedHours[day] = {
      ...updatedHours[day],
      closed: !updatedHours[day].closed
    };
    setEditData({ ...editData, clinicHours: updatedHours });
  };

  const updateClinicHour = (day, field, value) => {
    const updatedHours = { ...editData.clinicHours };
    updatedHours[day] = {
      ...updatedHours[day],
      [field]: value
    };
    setEditData({ ...editData, clinicHours: updatedHours });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : i <= Math.floor(rating) ? 'star-half' : 'star-outline'}
          size={16}
          color="#F59E0B"
          style={styles.starIcon}
        />
      );
    }
    return stars;
  };

  const renderEditField = (label, value, field, multiline = false) => (
    <View style={styles.editField}>
      <Text style={styles.editLabel}>{label}</Text>
      <TextInput
        style={[styles.editInput, multiline && styles.multilineInput]}
        value={editData[field]}
        onChangeText={(text) => setEditData({ ...editData, [field]: text })}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );

  if (loading && !editing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading clinic profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clinic Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={editing ? handleSave : handleEdit}
        >
          <Ionicons 
            name={editing ? "checkmark" : "create-outline"} 
            size={22} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* PROFILE HEADER */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: editing ? editData.profileImage : clinicProfile.profileImage }} 
              style={styles.avatar} 
            />
            <TouchableOpacity 
              style={styles.avatarEdit}
              onPress={() => openModal('avatar')}
              disabled={!editing}
            >
              <Ionicons name="camera" size={18} color="#2563EB" />
            </TouchableOpacity>
          </View>
          
          {editing ? (
            <View style={styles.editNameContainer}>
              <TextInput
                style={styles.editClinicName}
                value={editData.name}
                onChangeText={(text) => setEditData({ ...editData, name: text })}
                placeholder="Clinic Name"
              />
              <TextInput
                style={styles.editTagline}
                value={editData.tagline}
                onChangeText={(text) => setEditData({ ...editData, tagline: text })}
                placeholder="Tagline"
              />
            </View>
          ) : (
            <>
              <Text style={styles.clinicName}>{clinicProfile.name}</Text>
              <Text style={styles.clinicTagline}>{clinicProfile.tagline}</Text>
            </>
          )}
          
          <View style={styles.ratingContainer}>
            {renderStars(clinicProfile.rating)}
            <Text style={styles.ratingText}>
              {clinicProfile.rating} ({clinicProfile.totalReviews} reviews)
            </Text>
          </View>
        </View>

        {/* DOCTOR INFORMATION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="medical-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Doctor Information</Text>
          </View>
          
          <View style={styles.infoCard}>
            {editing ? (
              <>
                {renderEditField('Doctor Name', editData.doctorName, 'doctorName')}
                {renderEditField('Specialty', editData.specialty, 'specialty')}
                {renderEditField('Email', editData.email, 'email')}
                {renderEditField('Phone', editData.phone, 'phone')}
              </>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <Ionicons name="person-outline" size={18} color="#64748B" />
                  <Text style={styles.infoLabel}>Doctor:</Text>
                  <Text style={styles.infoValue}>{clinicProfile.doctorName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="briefcase-outline" size={18} color="#64748B" />
                  <Text style={styles.infoLabel}>Specialty:</Text>
                  <Text style={styles.infoValue}>{clinicProfile.specialty}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={18} color="#64748B" />
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{clinicProfile.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={18} color="#64748B" />
                  <Text style={styles.infoLabel}>Phone:</Text>
                  <Text style={styles.infoValue}>{clinicProfile.phone}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* CLINIC DETAILS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="business-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Clinic Details</Text>
          </View>
          
          <View style={styles.infoCard}>
            {editing ? (
              <>
                {renderEditField('Address', editData.address, 'address', true)}
                {renderEditField('Established Year', editData.establishedYear.toString(), 'establishedYear')}
                {renderEditField('Clinic Size', editData.clinicSize, 'clinicSize')}
              </>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={18} color="#64748B" />
                  <Text style={styles.infoLabel}>Address:</Text>
                  <Text style={styles.infoValue}>{clinicProfile.address}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={18} color="#64748B" />
                  <Text style={styles.infoLabel}>Established:</Text>
                  <Text style={styles.infoValue}>{clinicProfile.establishedYear}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="people-outline" size={18} color="#64748B" />
                  <Text style={styles.infoLabel}>Clinic Size:</Text>
                  <Text style={styles.infoValue}>{clinicProfile.clinicSize}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* SERVICES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="medkit-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Services Offered</Text>
            {editing && (
              <TouchableOpacity 
                style={styles.addServiceButton}
                onPress={() => openModal('addService')}
              >
                <Ionicons name="add" size={18} color="#2563EB" />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.servicesGrid}>
            {clinicProfile.services.map((service, index) => (
              <View key={index} style={styles.serviceChip}>
                {editing && (
                  <TouchableOpacity 
                    style={styles.removeService}
                    onPress={() => handleServiceToggle(service)}
                  >
                    <Ionicons name="close" size={14} color="#EF4444" />
                  </TouchableOpacity>
                )}
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CLINIC HOURS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Clinic Hours</Text>
          </View>
          
          <View style={styles.hoursCard}>
            {Object.entries(clinicProfile.clinicHours).map(([day, hours]) => (
              <View key={day} style={styles.hourRow}>
                <Text style={styles.dayText}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Text>
                
                {editing ? (
                  <View style={styles.editHourRow}>
                    <Switch
                      value={!editData.clinicHours[day].closed}
                      onValueChange={() => handleClinicHoursToggle(day)}
                      trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                      thumbColor="#FFFFFF"
                    />
                    
                    {!editData.clinicHours[day].closed ? (
                      <>
                        <TextInput
                          style={styles.timeInput}
                          value={editData.clinicHours[day].open}
                          onChangeText={(text) => updateClinicHour(day, 'open', text)}
                          placeholder="Open"
                        />
                        <Text style={styles.timeSeparator}>-</Text>
                        <TextInput
                          style={styles.timeInput}
                          value={editData.clinicHours[day].close}
                          onChangeText={(text) => updateClinicHour(day, 'close', text)}
                          placeholder="Close"
                        />
                      </>
                    ) : (
                      <Text style={styles.closedText}>Closed</Text>
                    )}
                  </View>
                ) : (
                  <Text style={[
                    styles.timeText,
                    hours.closed && styles.closedText
                  ]}>
                    {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* ABOUT CLINIC */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>About Clinic</Text>
          </View>
          
          <View style={styles.aboutCard}>
            {editing ? (
              <TextInput
                style={styles.editDescription}
                value={editData.clinicDescription}
                onChangeText={(text) => setEditData({ ...editData, clinicDescription: text })}
                multiline
                numberOfLines={4}
                placeholder="Describe your clinic..."
              />
            ) : (
              <Text style={styles.descriptionText}>{clinicProfile.clinicDescription}</Text>
            )}
          </View>
        </View>

        {/* LICENSE & REGISTRATION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>License & Registration</Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#64748B" />
              <Text style={styles.infoLabel}>PRC License:</Text>
              <Text style={styles.infoValue}>{clinicProfile.licenseNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={18} color="#64748B" />
              <Text style={styles.infoLabel}>Tax ID:</Text>
              <Text style={styles.infoValue}>{clinicProfile.taxId}</Text>
            </View>
          </View>
        </View>

        {editing && (
          <View style={styles.editActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* FOOTER SPACING */}
        <View style={styles.footer} />
      </ScrollView>

      {/* MODAL FOR ADDING SERVICES */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible && modalType === 'addService'}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Service</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <TextInput
                style={styles.serviceInput}
                placeholder="Enter service name"
                autoFocus
              />
              <TouchableOpacity style={styles.modalAddButton}>
                <Text style={styles.modalAddButtonText}>Add Service</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL FOR AVATAR UPLOAD */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible && modalType === 'avatar'}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Profile Picture</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <TouchableOpacity 
                style={styles.imageOption}
                onPress={() => handleImagePick(true)}
              >
                <Ionicons name="camera" size={24} color="#2563EB" />
                <Text style={styles.imageOptionText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.imageOption}
                onPress={() => handleImagePick(false)}
              >
                <Ionicons name="images" size={24} color="#2563EB" />
                <Text style={styles.imageOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  
  // HEADER
  header: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  
  // PROFILE HEADER
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#E2E8F0',
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2563EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clinicName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  clinicTagline: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  editNameContainer: {
    width: '100%',
    marginBottom: 16,
  },
  editClinicName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editTagline: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginHorizontal: 1,
  },
  ratingText: {
    marginLeft: 8,
    color: '#64748B',
    fontSize: 14,
  },
  
  // SECTIONS
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  addServiceButton: {
    marginLeft: 'auto',
    backgroundColor: '#EFF6FF',
    padding: 6,
    borderRadius: 20,
  },
  
  // CARDS
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
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
    marginRight: 8,
    width: 80,
  },
  infoValue: {
    flex: 1,
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '500',
  },
  
  // SERVICES
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    position: 'relative',
  },
  removeService: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  serviceText: {
    marginLeft: 6,
    color: '#065F46',
    fontSize: 13,
    fontWeight: '500',
  },
  
  // CLINIC HOURS
  hoursCard: {
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
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    width: 100,
  },
  timeText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  closedText: {
    color: '#94A3B8',
  },
  editHourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  timeInput: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 8,
    width: 80,
    fontSize: 14,
    textAlign: 'center',
  },
  timeSeparator: {
    color: '#64748B',
    marginHorizontal: 4,
  },
  
  // ABOUT CLINIC
  aboutCard: {
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
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  editDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    minHeight: 100,
    textAlignVertical: 'top',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  
  // EDIT FIELDS
  editField: {
    marginBottom: 16,
  },
  editLabel: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  editInput: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 15,
    color: '#1E293B',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  
  // EDIT ACTIONS
  editActions: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  modalBody: {
    paddingBottom: 20,
  },
  serviceInput: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
    marginBottom: 16,
  },
  modalAddButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalAddButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  imageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  imageOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  
  // FOOTER
  footer: {
    height: 20,
  },
});