import React, { useState } from 'react';
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
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Install: expo install expo-image-picker
import * as DocumentPicker from 'expo-document-picker'; // Install: expo install expo-document-picker

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [role, setRole] = useState(null); // 'student' | 'doctor'
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [clinicId, setClinicId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText1, setSecureText1] = useState(true);
  const [secureText2, setSecureText2] = useState(true);
  
  // File attachment states
  const [attachedFile, setAttachedFile] = useState(null);
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Request permissions for file access
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
        return prev + 10;
      });
    }, 100);
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

    // Format file size
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

  const handleRegister = async () => {
    // Validation checks
    if (!role || !fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (role === 'student' && !studentId) {
      Alert.alert('Error', 'Student ID is required');
      return;
    }

    if (role === 'doctor' && !clinicId) {
      Alert.alert('Error', 'Clinic/License ID is required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Only require file for doctors
    if (role === 'doctor' && !attachedFile) {
      Alert.alert(
        'Verification Required',
        'Doctors are required to upload verification documents. Please attach a file to continue.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);

    // Prepare registration data
    const userData = {
      role,
      fullName,
      email,
      studentId: role === 'student' ? studentId : null,
      clinicId: role === 'doctor' ? clinicId : null,
      hasVerificationFile: !!attachedFile,
      verificationFileName: attachedFile?.name,
    };

    console.log('Registration data:', userData);

    // MOCK REGISTER (replace with Supabase later)
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        attachedFile 
          ? 'Account created! Your verification is under review (24-48 hours).'
          : 'Account created successfully!',
        [{
          text: 'OK',
          onPress: () => {
            if (role === 'doctor') {
              navigation.navigate('ClinicDashboard');
            } else {
              navigation.navigate('StudentDashboard');
            }
          },
        }]
      );
    }, 1500);
  };

  const fileInfo = getFileInfo();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/qora_logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.tagline}>
                Healthcare access with clarity and dignity
              </Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join QORA in a few simple steps</Text>

              {/* ROLE SELECTION */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Register As</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.roleOption,
                      role === 'student' && styles.roleSelected,
                    ]}
                    onPress={() => setRole('student')}
                  >
                    <Ionicons
                      name="school-outline"
                      size={22}
                      color={role === 'student' ? '#2563EB' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.roleText,
                        role === 'student' && styles.roleTextSelected,
                      ]}
                    >
                      Student
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleOption,
                      role === 'doctor' && styles.roleSelected,
                    ]}
                    onPress={() => setRole('doctor')}
                  >
                    <Ionicons
                      name="medkit-outline"
                      size={22}
                      color={role === 'doctor' ? '#2563EB' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.roleText,
                        role === 'doctor' && styles.roleTextSelected,
                      ]}
                    >
                      Clinic
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* FULL NAME */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#94A3B8"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              {/* STUDENT ID (STUDENT ONLY) */}
              {role === 'student' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Student ID</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="card-outline" size={20} color="#94A3B8" />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your student ID"
                      placeholderTextColor="#94A3B8"
                      value={studentId}
                      onChangeText={setStudentId}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}

              {/* CLINIC ID (DOCTOR ONLY) */}
              {role === 'doctor' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Clinic / License ID</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="id-card-outline" size={20} color="#94A3B8" />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter clinic or license ID"
                      placeholderTextColor="#94A3B8"
                      value={clinicId}
                      onChangeText={setClinicId}
                    />
                  </View>
                </View>
              )}

              {/* EMAIL */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* PASSWORD */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Create a password"
                    placeholderTextColor="#94A3B8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureText1}
                  />
                  <TouchableOpacity onPress={() => setSecureText1(!secureText1)}>
                    <Ionicons
                      name={secureText1 ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* CONFIRM PASSWORD */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Repeat password"
                    placeholderTextColor="#94A3B8"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={secureText2}
                  />
                  <TouchableOpacity onPress={() => setSecureText2(!secureText2)}>
                    <Ionicons
                      name={secureText2 ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                </View>

                {password && confirmPassword && password !== confirmPassword && (
                  <Text style={styles.errorText}>Passwords do not match</Text>
                )}
              </View>

              {/* FILE ATTACHMENT FOR VERIFICATION */}
              <View style={styles.inputContainer}>
                <View style={styles.fileHeader}>
                  <Text style={styles.label}>
                    Verification Document {role === 'doctor' && '(Required)'}
                  </Text>
                  <Text style={styles.fileInfoText}>
                    {role === 'doctor' 
                      ? 'Upload license, ID card, or certificate' 
                      : 'Optional: Upload student ID for faster verification'}
                  </Text>
                </View>

                {!attachedFile ? (
                  <TouchableOpacity 
                    style={styles.attachButton}
                    onPress={handleFilePick}
                  >
                    <Ionicons name="attach-outline" size={24} color="#2563EB" />
                    <Text style={styles.attachButtonText}>
                      {role === 'doctor' 
                        ? 'Tap to attach verification file' 
                        : 'Tap to attach student ID (optional)'}
                    </Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#94A3B8" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.fileCard}>
                    <View style={styles.fileInfoContainer}>
                      <View style={styles.fileIconContainer}>
                        <Ionicons name="document-attach-outline" size={28} color="#2563EB" />
                      </View>
                      <View style={styles.fileDetails}>
                        <Text style={styles.fileName} numberOfLines={1}>
                          {fileInfo.name}
                        </Text>
                        <Text style={styles.fileMeta}>
                          {fileInfo.type} • {fileInfo.size}
                        </Text>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                              <View 
                                style={[
                                  styles.progressFill,
                                  { width: `${uploadProgress}%` }
                                ]} 
                              />
                            </View>
                            <Text style={styles.progressText}>{uploadProgress}%</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={removeFile}
                    >
                      <Ionicons name="close-circle" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                )}

                <Text style={styles.fileHint}>
                  Supported: JPG, PNG, PDF, DOC (Max 10MB)
                </Text>
              </View>

              {/* REGISTER BUTTON */}
              <TouchableOpacity
                style={[
                  styles.button,
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Create Account</Text>
                    <Ionicons name="person-add" size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>

              {/* LOGIN LINK */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}> Sign in here</Text>
                </TouchableOpacity>
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
                <Text style={styles.modalTitle}>Choose File Source</Text>
                <TouchableOpacity onPress={() => setFileModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Pressable style={styles.modalOption} onPress={pickImage}>
                <Ionicons name="images-outline" size={28} color="#2563EB" />
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>Gallery</Text>
                  <Text style={styles.modalOptionSubtitle}>Choose from photos</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </Pressable>

              <Pressable style={styles.modalOption} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={28} color="#2563EB" />
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>Camera</Text>
                  <Text style={styles.modalOptionSubtitle}>Take a photo</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </Pressable>

              <Pressable style={styles.modalOption} onPress={pickDocument}>
                <Ionicons name="document-outline" size={28} color="#2563EB" />
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>Files</Text>
                  <Text style={styles.modalOptionSubtitle}>Browse documents</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </Pressable>

              <TouchableOpacity 
                style={styles.modalCancel}
                onPress={() => setFileModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingBottom: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 40, marginTop: 60 },
  logo: { width: 140, height: 140 },
  tagline: { color: '#94A3B8', marginTop: 12, textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 24, elevation: 5 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
  subtitle: { textAlign: 'center', color: '#64748B', marginBottom: 24 },
  inputContainer: { marginBottom: 20 },
  label: { fontWeight: '600', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  input: { flex: 1, height: 44 },
  roleContainer: { flexDirection: 'row', gap: 12 },
  roleOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  roleSelected: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  roleText: { fontWeight: '600', color: '#64748B' },
  roleTextSelected: { color: '#2563EB' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 6 },
  
  // File attachment styles
  fileHeader: { marginBottom: 12 },
  fileInfoText: { fontSize: 12, color: '#64748B', marginTop: 2 },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  attachButtonText: {
    flex: 1,
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  fileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileDetails: { flex: 1 },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  fileMeta: {
    fontSize: 12,
    color: '#64748B',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
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
    color: '#64748B',
    fontWeight: '600',
    minWidth: 30,
  },
  removeButton: {
    padding: 4,
  },
  fileHint: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
  },
  
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: '#94A3B8' },
  buttonText: { color: '#fff', fontWeight: '600' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  loginText: { color: '#64748B' },
  loginLink: { color: '#2563EB', fontWeight: '600' },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
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
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 16,
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  modalOptionSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  modalCancel: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});