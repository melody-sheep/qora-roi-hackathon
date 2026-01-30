import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { authService } from '../services/auth';

const { width, height } = Dimensions.get('window');

// Particle Component for animated background
const Particle = ({ size, duration, delay, startX, startY }) => {
  const translateX = useRef(new Animated.Value(startX)).current;
  const translateY = useRef(new Animated.Value(startY)).current;
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const animateParticle = () => {
      translateX.setValue(startX);
      translateY.setValue(startY);
      opacity.setValue(0.8);

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
          toValue: 1.0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.8,
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
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
  const particles = Array.from({ length: 25 }).map((_, index) => {
    const size = 4 + Math.random() * 8;
    const duration = 3000 + Math.random() * 3000;
    const delay = Math.random() * 1000;
    const startX = Math.random() * width;
    const startY = 50 + Math.random() * 250;

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

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [clinicId, setClinicId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText1, setSecureText1] = useState(true);
  const [secureText2, setSecureText2] = useState(true);
  const [fullNameFocused, setFullNameFocused] = useState(false);
  const [studentIdFocused, setStudentIdFocused] = useState(false);
  const [clinicIdFocused, setClinicIdFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  
  const [attachedFile, setAttachedFile] = useState(null);
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to upload files.');
      return false;
    }
    return true;
  };

  const handleFilePick = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setFileModalVisible(true);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const file = {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName || 'verification_image.jpg',
          type: 'image/jpeg',
          size: result.assets[0].fileSize || 0,
        };
        setAttachedFile(file);
        simulateUpload(file);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setFileModalVisible(false);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf', 'application/msword'],
      });

      if (result.assets && result.assets.length > 0) {
        const file = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType,
          size: result.assets[0].size || 0,
        };
        setAttachedFile(file);
        simulateUpload(file);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    } finally {
      setFileModalVisible(false);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const file = {
          uri: result.assets[0].uri,
          name: 'verification_photo.jpg',
          type: 'image/jpeg',
          size: result.assets[0].fileSize || 0,
        };
        setAttachedFile(file);
        simulateUpload(file);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setFileModalVisible(false);
    }
  };

  const simulateUpload = (file) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          Alert.alert('Success', 'Verification file uploaded successfully!');
          return 100;
        }
        return prev + Math.random() * 30 + 10; // Random increment between 10-40%
      });
    }, 200); // Increased from 100ms to 200ms to reduce flickering
  };

  const removeFile = () => {
    Alert.alert(
      'Remove File',
      'Are you sure you want to remove this file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setAttachedFile(null);
            setUploadProgress(0);
          },
        },
      ]
    );
  };

  const getFileInfo = () => {
    if (!attachedFile) return null;

    const fileName = attachedFile.name;
    const fileSize = attachedFile.size;
    const fileType = attachedFile.type;

    const formatSize = (bytes) => {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / 1048576).toFixed(1) + ' MB';
    };

    return {
      name: fileName,
      size: formatSize(fileSize),
      type: fileType.split('/')[1]?.toUpperCase() || 'FILE',
    };
  };

  const validateStep1 = () => {
    if (!role) {
      Alert.alert('Error', 'Please select a role');
      return false;
    }
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (role === 'student' && !studentId.trim()) {
      Alert.alert('Error', 'Student ID is required');
      return false;
    }
    if (role === 'doctor' && !clinicId.trim()) {
      Alert.alert('Error', 'Clinic/License ID is required');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!password) {
      Alert.alert('Error', 'Please create a password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBackStep = () => {
    setStep(1);
  };

  const handleRegister = async () => {
    if (!validateStep2()) return;

    setLoading(true);

    const userData = {
      fullName,
      role,
      studentId: role === 'student' ? studentId : null,
      clinicId: role === 'doctor' ? clinicId : null,
    };

    console.log('Starting registration...', { email, userData });

    // Register WITH file info (no upload)
    const result = await authService.register(email, password, userData, attachedFile);

    setLoading(false);

    if (result.success) {
      Alert.alert(
        '✅ Success!',
        'Account created successfully!' + 
        (attachedFile ? '\n\nVerification document recorded.' : ''),
        [{
          text: 'OK',
          onPress: () => {
            // Navigate based on role
            if (role === 'doctor') {
              navigation.navigate('ClinicMain');
            } else {
              navigation.navigate('StudentDashboard');
            }
          },
        }]
      );
    } else {
      Alert.alert('❌ Registration Failed', result.error || 'Please try again');
    }
  };

  const fileInfo = getFileInfo();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* Decorative Background Elements */}
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />
      
      {/* Particle Background */}
      <ParticleBackground />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => step === 1 ? navigation.goBack() : handleBackStep()}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Image
              source={require('../../assets/qora_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeTitle}>
              {step === 1 ? 'Create Account' : 'Account Details'}
            </Text>
            <Text style={styles.welcomeSubtitle}>
              {step === 1 ? 'Step 1: Basic Information' : 'Step 2: Account Security'}
            </Text>
            
            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
              <View style={styles.stepLine} />
              <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
            </View>
          </View>

          {/* Form - Full width with rounded top only */}
          <View style={styles.formWrapper}>
            <View style={styles.formCard}>
              {step === 1 ? (
                <>
                  {/* Role Selection */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>I am a</Text>
                    <View style={styles.roleContainer}>
                      <TouchableOpacity
                        style={[styles.roleCard, role === 'student' && styles.roleCardSelected]}
                        onPress={() => setRole('student')}
                        activeOpacity={0.8}
                      >
                        <View style={[styles.roleIcon, role === 'student' && styles.roleIconSelected]}>
                          <Ionicons name="school-outline" size={24} color={role === 'student' ? '#3B82F6' : '#6B7280'} />
                        </View>
                        <Text style={[styles.roleText, role === 'student' && styles.roleTextSelected]}>
                          Student
                        </Text>
                        <Text style={styles.roleDescription}>
                          Access healthcare services
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.roleCard, role === 'doctor' && styles.roleCardSelected]}
                        onPress={() => setRole('doctor')}
                        activeOpacity={0.8}
                      >
                        <View style={[styles.roleIcon, role === 'doctor' && styles.roleIconSelected]}>
                          <Ionicons name="medkit-outline" size={24} color={role === 'doctor' ? '#3B82F6' : '#6B7280'} />
                        </View>
                        <Text style={[styles.roleText, role === 'doctor' && styles.roleTextSelected]}>
                          Clinic
                        </Text>
                        <Text style={styles.roleDescription}>
                          Provide healthcare services
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Full Name */}
                  <View style={styles.inputSection}>
                    <View style={styles.inputLabelRow}>
                      <Ionicons name="person-outline" size={18} color="#6B7280" />
                      <Text style={styles.inputLabel}>Full Name</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.inputFieldTouchable,
                        fullNameFocused && styles.inputFieldFocused
                      ]}
                      activeOpacity={1}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="Alther Yecyec"
                        placeholderTextColor="#9CA3AF"
                        value={fullName}
                        onChangeText={setFullName}
                        onFocus={() => setFullNameFocused(true)}
                        onBlur={() => setFullNameFocused(false)}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Student ID or Clinic ID */}
                  {role === 'student' && (
                    <View style={styles.inputSection}>
                      <View style={styles.inputLabelRow}>
                        <Ionicons name="card-outline" size={18} color="#6B7280" />
                        <Text style={styles.inputLabel}>Student ID</Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.inputFieldTouchable,
                          studentIdFocused && styles.inputFieldFocused
                        ]}
                        activeOpacity={1}
                      >
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your student ID"
                          placeholderTextColor="#9CA3AF"
                          value={studentId}
                          onChangeText={setStudentId}
                          keyboardType="numeric"
                          onFocus={() => setStudentIdFocused(true)}
                          onBlur={() => setStudentIdFocused(false)}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  {role === 'doctor' && (
                    <View style={styles.inputSection}>
                      <View style={styles.inputLabelRow}>
                        <Ionicons name="business-outline" size={18} color="#6B7280" />
                        <Text style={styles.inputLabel}>Clinic / License ID</Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.inputFieldTouchable,
                          clinicIdFocused && styles.inputFieldFocused
                        ]}
                        activeOpacity={1}
                      >
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your professional ID"
                          placeholderTextColor="#9CA3AF"
                          value={clinicId}
                          onChangeText={setClinicId}
                          onFocus={() => setClinicIdFocused(true)}
                          onBlur={() => setClinicIdFocused(false)}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Next Button */}
                  <TouchableOpacity
                    style={[styles.nextButton, (!role || !fullName) && styles.nextButtonDisabled]}
                    onPress={handleNextStep}
                    disabled={!role || !fullName}
                  >
                    <Text style={styles.nextButtonText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* Email */}
                  <View style={styles.inputSection}>
                    <View style={styles.inputLabelRow}>
                      <Ionicons name="mail-outline" size={18} color="#6B7280" />
                      <Text style={styles.inputLabel}>Email Address</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.inputFieldTouchable,
                        emailFocused && styles.inputFieldFocused
                      ]}
                      activeOpacity={1}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="you@example.com"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Password */}
                  <View style={styles.inputSection}>
                    <View style={styles.inputLabelRow}>
                      <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
                      <Text style={styles.inputLabel}>Create Password</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.inputFieldTouchable,
                        passwordFocused && styles.inputFieldFocused
                      ]}
                      activeOpacity={1}
                    >
                      <View style={styles.passwordInputWrapper}>
                        <TextInput
                          style={styles.passwordInput}
                          placeholder="••••••••"
                          placeholderTextColor="#9CA3AF"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={secureText1}
                          autoCapitalize="none"
                          onFocus={() => setPasswordFocused(true)}
                          onBlur={() => setPasswordFocused(false)}
                        />
                        <TouchableOpacity 
                          style={styles.eyeButton}
                          onPress={() => setSecureText1(!secureText1)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Ionicons
                            name={secureText1 ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color="#6B7280"
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Confirm Password */}
                  <View style={styles.inputSection}>
                    <View style={styles.inputLabelRow}>
                      <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
                      <Text style={styles.inputLabel}>Confirm Password</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.inputFieldTouchable,
                        confirmPasswordFocused && styles.inputFieldFocused
                      ]}
                      activeOpacity={1}
                    >
                      <View style={styles.passwordInputWrapper}>
                        <TextInput
                          style={styles.passwordInput}
                          placeholder="••••••••"
                          placeholderTextColor="#9CA3AF"
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          secureTextEntry={secureText2}
                          autoCapitalize="none"
                          onFocus={() => setConfirmPasswordFocused(true)}
                          onBlur={() => setConfirmPasswordFocused(false)}
                        />
                        <TouchableOpacity 
                          style={styles.eyeButton}
                          onPress={() => setSecureText2(!secureText2)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Ionicons
                            name={secureText2 ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color="#6B7280"
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                    {password && confirmPassword && password !== confirmPassword && (
                      <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={14} color="#EF4444" />
                        <Text style={styles.errorText}>Passwords do not match</Text>
                      </View>
                    )}
                  </View>

                  {/* Password Requirements */}
                  <View style={styles.passwordRequirements}>
                    <Text style={styles.requirementsTitle}>Password must contain:</Text>
                    <View style={styles.requirementItem}>
                      <Ionicons 
                        name={password.length >= 6 ? "checkmark-circle" : "ellipse-outline"} 
                        size={14} 
                        color={password.length >= 6 ? "#10B981" : "#6B7280"} 
                      />
                      <Text style={[styles.requirementText, password.length >= 6 && styles.requirementMet]}>
                        At least 6 characters
                      </Text>
                    </View>
                  </View>

                  {/* File Upload */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>
                        Verification Document {role === 'doctor' && '*'}
                      </Text>
                      <Text style={styles.sectionSubtitle}>
                        {role === 'doctor' 
                          ? 'Upload license, ID card, or certificate' 
                          : 'Optional: Upload student ID for faster verification'}
                      </Text>
                    </View>

                    {!attachedFile ? (
                      <TouchableOpacity 
                        style={styles.uploadCard}
                        onPress={handleFilePick}
                        activeOpacity={0.8}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <View style={styles.uploadIcon}>
                          <Ionicons name="cloud-upload-outline" size={32} color="#3B82F6" />
                        </View>
                        <Text style={styles.uploadTitle}>
                          {role === 'doctor' 
                            ? 'Upload Verification File' 
                            : 'Upload Student ID (Optional)'}
                        </Text>
                        <Text style={styles.uploadSubtitle}>
                          Drag & drop or tap to browse
                        </Text>
                        <Text style={styles.uploadHint}>
                          Supported: JPG, PNG, PDF, DOC • Max 10MB
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.fileCard}>
                        <View style={styles.fileHeader}>
                          <View style={styles.fileIcon}>
                            <Ionicons name="document-text-outline" size={24} color="#3B82F6" />
                          </View>
                          <View style={styles.fileInfo}>
                            <Text style={styles.fileName} numberOfLines={1}>
                              {getFileInfo()?.name}
                            </Text>
                            <Text style={styles.fileDetails}>
                              {getFileInfo()?.type} • {getFileInfo()?.size}
                            </Text>
                            {uploadProgress > 0 && uploadProgress < 100 && (
                              <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                  <View 
                                    style={[styles.progressFill, { width: `${uploadProgress}%` }]} 
                                  />
                                </View>
                                <Text style={styles.progressText}>{uploadProgress}%</Text>
                              </View>
                            )}
                          </View>
                          <TouchableOpacity 
                            style={styles.removeButton}
                            onPress={removeFile}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          >
                            <Ionicons name="close-circle" size={24} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>

                  {/* Register Buttons */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.backButtonSecondary}
                      onPress={handleBackStep}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="arrow-back" size={18} color="#3B82F6" />
                      <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                      onPress={handleRegister}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <>
                          <Text style={styles.registerButtonText}>Create Account</Text>
                          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Login Link */}
              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginLinkText}>Already have an account?</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Login')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.loginLink}> Sign in</Text>
                </TouchableOpacity>
              </View>

              {/* Footer Inside White Form */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>© 2024 QORA Healthcare. All rights reserved.</Text>
                <View style={styles.footerLinks}>
                  <TouchableOpacity 
                    onPress={() => Alert.alert('Terms', 'Terms of service')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.footerLink}>Terms</Text>
                  </TouchableOpacity>
                  <Text style={styles.footerSeparator}>•</Text>
                  <TouchableOpacity 
                    onPress={() => Alert.alert('Privacy', 'Privacy policy')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.footerLink}>Privacy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* File Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={fileModalVisible}
        onRequestClose={() => setFileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Source</Text>
              <TouchableOpacity 
                onPress={() => setFileModalVisible(false)}
                style={styles.modalCloseButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Pressable style={styles.modalOption} onPress={pickImage}>
              <View style={[styles.modalOptionIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="images-outline" size={24} color="#3B82F6" />
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Photo Library</Text>
                <Text style={styles.modalOptionSubtitle}>Choose from your gallery</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>

            <Pressable style={styles.modalOption} onPress={takePhoto}>
              <View style={[styles.modalOptionIcon, { backgroundColor: '#F0F9FF' }]}>
                <Ionicons name="camera-outline" size={24} color="#0EA5E9" />
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Take Photo</Text>
                <Text style={styles.modalOptionSubtitle}>Use camera</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>

            <Pressable style={styles.modalOption} onPress={pickDocument}>
              <View style={[styles.modalOptionIcon, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="document-outline" size={24} color="#8B5CF6" />
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Browse Files</Text>
                <Text style={styles.modalOptionSubtitle}>Select from device storage</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>

            <TouchableOpacity 
              style={styles.modalCancel}
              onPress={() => setFileModalVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350,
    zIndex: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
  },
  topCircle: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    zIndex: 0,
  },
  bottomCircle: {
    position: 'absolute',
    bottom: -150,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
    zIndex: 0,
  },
  keyboardView: {
    flex: 1,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 24,
    zIndex: 5,
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 60,
    padding: 8,
    zIndex: 6,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
    zIndex: 6,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    zIndex: 6,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 16,
    zIndex: 6,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    zIndex: 6,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#94A3B8',
  },
  stepDotActive: {
    backgroundColor: '#3B82F6',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#94A3B8',
    marginHorizontal: 8,
  },
  formWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 0,
    overflow: 'hidden',
    zIndex: 10,
  },
  formCard: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    zIndex: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  roleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleIconSelected: {
    backgroundColor: '#DBEAFE',
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  roleTextSelected: {
    color: '#1E40AF',
  },
  roleDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  inputFieldTouchable: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 50,
    justifyContent: 'center',
  },
  inputFieldFocused: {
    borderColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
    height: 26,
    width: '100%',
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
    height: 26,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
  },
  passwordRequirements: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 13,
    color: '#6B7280',
  },
  requirementMet: {
    color: '#10B981',
  },
  uploadCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  uploadHint: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  fileCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  fileDetails: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    minWidth: 30,
  },
  removeButton: {
    padding: 4,
  },
  nextButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  backButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 12,
  },
  backButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    flex: 2,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: 32,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
    marginTop: 0,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerLink: {
    fontSize: 12,
    color: '#6B7280',
  },
  footerSeparator: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 16,
  },
  modalOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalOptionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalCancel: {
    marginTop: 24,
    padding: 18,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});