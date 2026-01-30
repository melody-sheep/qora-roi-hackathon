import AsyncStorage from '@react-native-async-storage/async-storage';
import { TABLES, DEFAULT_CLINICS, DEFAULT_DOCTORS } from './constants';

export const getUserProfile = async (userId, userType = 'student') => {
  try {
    const key = `${TABLES.PROFILES}_${userType}_${userId}`;
    const profile = await AsyncStorage.getItem(key);
    
    if (profile) {
      return JSON.parse(profile);
    }
    
    // Return default profile if not found
    if (userType === 'clinic') {
      const defaultClinic = DEFAULT_CLINICS.find(c => c.id === userId);
      if (defaultClinic) {
        return { ...defaultClinic, type: 'clinic' };
      }
    }
    
    if (userType === 'doctor') {
      const defaultDoctor = DEFAULT_DOCTORS.find(d => d.id === userId);
      if (defaultDoctor) {
        return { ...defaultDoctor, type: 'doctor' };
      }
    }
    
    // Student profile (create default)
    const defaultStudent = {
      id: userId,
      type: 'student',
      name: 'Student User',
      email: 'student@university.edu',
      studentId: userId.startsWith('SID-') ? userId : `SID-${new Date().getFullYear()}-${userId}`,
      yearLevel: '3rd Year',
      course: 'Computer Science',
      phone: '(555) 123-4567',
      address: 'University Dormitory',
      emergencyContact: 'Parent (555) 987-6543',
      healthConditions: '',
      allergies: '',
      medications: '',
      lastCheckup: null,
      yearlyAppointments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save default profile
    await AsyncStorage.setItem(key, JSON.stringify(defaultStudent));
    
    return defaultStudent;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId, userType, updates) => {
  try {
    const key = `${TABLES.PROFILES}_${userType}_${userId}`;
    const existing = await AsyncStorage.getItem(key);
    
    let profile;
    if (existing) {
      profile = JSON.parse(existing);
    } else {
      // Get default profile first
      profile = await getUserProfile(userId, userType);
    }
    
    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(key, JSON.stringify(updatedProfile));
    return { success: true, profile: updatedProfile };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

export const getClinicProfile = async (clinicId = 'clinic_1') => {
  try {
    const key = `${TABLES.PROFILES}_clinic_${clinicId}`;
    const profile = await AsyncStorage.getItem(key);
    
    if (profile) {
      return JSON.parse(profile);
    }
    
    // Return default clinic profile
    const defaultClinic = DEFAULT_CLINICS.find(c => c.id === clinicId) || DEFAULT_CLINICS[0];
    const clinicProfile = {
      ...defaultClinic,
      type: 'clinic',
      doctors: DEFAULT_DOCTORS.filter(d => d.clinicId === clinicId),
      services: ['1', '2', '3'], // Default service IDs
      hours: {
        monday: '8:00 AM - 5:00 PM',
        tuesday: '8:00 AM - 5:00 PM',
        wednesday: '8:00 AM - 5:00 PM',
        thursday: '8:00 AM - 5:00 PM',
        friday: '8:00 AM - 5:00 PM',
        saturday: '9:00 AM - 1:00 PM',
        sunday: 'Closed'
      },
      contact: {
        email: defaultClinic.email,
        phone: defaultClinic.phone,
        emergency: '(555) 911-9111'
      },
      description: 'University Health Center providing comprehensive medical services to students.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save default profile
    await AsyncStorage.setItem(key, JSON.stringify(clinicProfile));
    
    return clinicProfile;
  } catch (error) {
    console.error('Error getting clinic profile:', error);
    return null;
  }
};

export const getDoctorProfile = async (doctorId) => {
  try {
    const key = `${TABLES.PROFILES}_doctor_${doctorId}`;
    const profile = await AsyncStorage.getItem(key);
    
    if (profile) {
      return JSON.parse(profile);
    }
    
    // Return default doctor profile
    const defaultDoctor = DEFAULT_DOCTORS.find(d => d.id === doctorId);
    if (defaultDoctor) {
      const doctorProfile = {
        ...defaultDoctor,
        type: 'doctor',
        specialty: defaultDoctor.specialization,
        qualifications: ['MD', 'Board Certified'],
        yearsExperience: 8,
        availability: 'Mon, Tue, Thu, Fri',
        rating: 4.8,
        patientReviews: 124,
        bio: `Dr. ${defaultDoctor.name.split(' ')[1]} specializes in ${defaultDoctor.specialization} with extensive experience in student healthcare.`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await AsyncStorage.setItem(key, JSON.stringify(doctorProfile));
      return doctorProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting doctor profile:', error);
    return null;
  }
};

// Get all doctors for a clinic
export const getClinicDoctors = async (clinicId = 'clinic_1') => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const doctorKeys = keys.filter(key => 
      key.startsWith(`${TABLES.PROFILES}_doctor_`)
    );
    const items = await AsyncStorage.multiGet(doctorKeys);
    
    let doctors = items.map(([key, value]) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }).filter(item => item !== null && item.clinicId === clinicId);
    
    // If no doctors found, use default doctors
    if (doctors.length === 0) {
      doctors = DEFAULT_DOCTORS
        .filter(d => d.clinicId === clinicId)
        .map(d => ({
          ...d,
          type: 'doctor',
          specialty: d.specialization
        }));
      
      // Save default doctors
      for (const doctor of doctors) {
        await AsyncStorage.setItem(
          `${TABLES.PROFILES}_doctor_${doctor.id}`,
          JSON.stringify(doctor)
        );
      }
    }
    
    return doctors;
  } catch (error) {
    console.error('Error getting clinic doctors:', error);
    return DEFAULT_DOCTORS.filter(d => d.clinicId === clinicId);
  }
};