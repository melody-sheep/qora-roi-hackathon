import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export default function MyDocumentationScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('approved');

  // Simulate fetching user data and documents
  useEffect(() => {
    fetchUserDocuments();
  }, []);

  const fetchUserDocuments = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // COR documents for a student
      const corFiles = [
        {
          id: '1',
          name: '3rd Year First Sem COR.pdf',
          type: 'pdf',
          size: 1456789,
          uri: 'file://mock/cor_first_sem.pdf',
          uploadDate: '2025-08-15',
          status: 'approved',
          semester: 'First Semester',
          academicYear: '2025-2026',
          documentType: 'COR',
        },
        {
          id: '2',
          name: '3rd Year Second Sem COR.jpg',
          type: 'jpg',
          size: 856789,
          uri: 'file://mock/cor_second_sem.jpg',
          uploadDate: '2026-01-10',
          status: 'approved',
          semester: 'Second Semester',
          academicYear: '2025-2026',
          documentType: 'COR',
        },
      ];
      setAttachedFiles(corFiles);
      setVerificationStatus('approved');
      setLoading(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserDocuments();
    setRefreshing(false);
  };

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
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const file = {
          id: Date.now().toString(),
          name: `COR_${new Date().toLocaleDateString()}.jpg`,
          type: 'image/jpeg',
          size: result.assets[0].fileSize || 0,
          uri: result.assets[0].uri,
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'pending',
          semester: 'Current Semester',
          academicYear: '2026-2025',
          documentType: 'COR',
        };
        handleFileUpload(file);
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
        type: ['image/*', 'application/pdf'],
      });

      if (result.assets && result.assets.length > 0) {
        const file = {
          id: Date.now().toString(),
          name: result.assets[0].name || `COR_${new Date().toLocaleDateString()}.pdf`,
          type: result.assets[0].mimeType,
          size: result.assets[0].size || 0,
          uri: result.assets[0].uri,
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'pending',
          semester: 'Current Semester',
          academicYear: '2026-2027',
          documentType: 'COR',
        };
        handleFileUpload(file);
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
          id: Date.now().toString(),
          name: `COR_${new Date().toLocaleDateString()}.jpg`,
          type: 'image/jpeg',
          size: result.assets[0].fileSize || 0,
          uri: result.assets[0].uri,
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'pending',
          semester: 'Current Semester',
          academicYear: '2026-2027',
          documentType: 'COR',
        };
        handleFileUpload(file);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setFileModalVisible(false);
    }
  };

  const handleFileUpload = (file) => {
    // Start upload progress
    setUploadProgress(prev => ({
      ...prev,
      [file.id]: 0
    }));

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[file.id] || 0;
        const newProgress = currentProgress + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Add file to list (prepend to show newest first)
          setAttachedFiles(prev => [file, ...prev]);
          
          // Show success message
          setTimeout(() => {
            Alert.alert(
              'Upload Complete',
              'Your COR has been uploaded successfully and is pending verification.',
              [{ text: 'OK' }]
            );
          }, 300);
          
          return { ...prev, [file.id]: 100 };
        }
        
        return { ...prev, [file.id]: newProgress };
      });
    }, 200);
  };

  const removeFile = (fileId) => {
    Alert.alert(
      'Remove COR',
      'Are you sure you want to remove this COR?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
            Alert.alert('Success', 'COR removed successfully.');
          },
        },
      ]
    );
  };

  const viewFileDetails = (file) => {
    Alert.alert(
      'COR Details',
      `Name: ${file.name}\nType: ${file.type.toUpperCase()}\nSemester: ${file.semester}\nAcademic Year: ${file.academicYear}\nUploaded: ${file.uploadDate}\nStatus: ${getStatusText(file.status)}`,
      [
        { text: 'OK' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFile(file.id) },
      ]
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Verified';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending Review';
      default: return 'Unknown';
    }
  };

  const getVerificationStatusMessage = () => {
    switch (verificationStatus) {
      case 'approved':
        return 'Your account is fully verified with COR documents!';
      case 'rejected':
        return 'Please upload a valid COR document.';
      case 'pending':
        return 'Your COR documents are under review (24-48 hours)';
      default:
        return 'Verification status unknown';
    }
  };

  const getSemesterBadgeColor = (semester) => {
    if (semester.includes('First')) return '#3B82F6';
    if (semester.includes('Second')) return '#10B981';
    return '#8B5CF6';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My COR Documents</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563EB']}
          />
        }
      >
        {/* Verification Status Banner */}
        <View style={[
          styles.statusBanner,
          { backgroundColor: verificationStatus === 'approved' ? '#D1FAE5' : 
                           verificationStatus === 'rejected' ? '#FEE2E2' : '#FEF3C7' }
        ]}>
          <Ionicons 
            name={verificationStatus === 'approved' ? 'checkmark-circle' : 
                  verificationStatus === 'rejected' ? 'alert-circle' : 'time-outline'} 
            size={24} 
            color={verificationStatus === 'approved' ? '#10B981' : 
                   verificationStatus === 'rejected' ? '#EF4444' : '#F59E0B'} 
          />
          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>
              {verificationStatus === 'approved' ? 'Verified Student' : 
               verificationStatus === 'rejected' ? 'Verification Required' : 'Verification Pending'}
            </Text>
            <Text style={styles.statusMessage}>
              {getVerificationStatusMessage()}
            </Text>
          </View>
        </View>

        {/* Required Document Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Document</Text>
          <View style={styles.corInfoCard}>
            <View style={styles.corIconContainer}>
              <Ionicons name="school-outline" size={32} color="#2563EB" />
            </View>
            <View style={styles.corInfoContent}>
              <Text style={styles.corTitle}>Certificate of Registration (COR)</Text>
              <Text style={styles.corDescription}>
                Upload your current COR document to verify your student status. Ensure the document is clear and shows your name, student ID, and current semester.
              </Text>
              <View style={styles.corRequirements}>
                <Text style={styles.requirementsTitle}>Requirements:</Text>
                <View style={styles.requirementItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.requirementText}>Clear photo/scan of COR</Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.requirementText}>Current academic year</Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.requirementText}>File size under 10MB</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Upload New COR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload New COR</Text>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleFilePick}
          >
            <View style={styles.uploadButtonContent}>
              <Ionicons name="document-attach-outline" size={28} color="#2563EB" />
              <View style={styles.uploadButtonText}>
                <Text style={styles.uploadButtonTitle}>Upload COR Document</Text>
                <Text style={styles.uploadButtonSubtitle}>
                  JPG, PNG, PDF (Max 10MB)
                </Text>
              </View>
            </View>
            <Ionicons name="add-circle" size={24} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Uploaded COR Documents */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My COR Documents</Text>
            <Text style={styles.docCount}>{attachedFiles.length} uploaded</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
          ) : attachedFiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={64} color="#E2E8F0" />
              <Text style={styles.emptyStateTitle}>No COR documents uploaded</Text>
              <Text style={styles.emptyStateText}>
                Upload your Certificate of Registration to verify your student status
              </Text>
            </View>
          ) : (
            <View style={styles.documentsList}>
              {attachedFiles.map((file) => {
                const progress = uploadProgress[file.id] || 0;
                const isUploading = progress > 0 && progress < 100;
                
                return (
                  <TouchableOpacity
                    key={file.id}
                    style={styles.documentCard}
                    onPress={() => viewFileDetails(file)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.documentInfo}>
                      <View style={[
                        styles.documentIcon,
                        { backgroundColor: file.status === 'approved' ? '#EFF6FF' : 
                                         file.status === 'rejected' ? '#FEF2F2' : '#FFFBEB' }
                      ]}>
                        <Ionicons 
                          name="school" 
                          size={24} 
                          color={getStatusColor(file.status)} 
                        />
                      </View>
                      <View style={styles.documentDetails}>
                        <View style={styles.documentHeader}>
                          <Text style={styles.documentName} numberOfLines={1}>
                            {file.name}
                          </Text>
                          <View style={[
                            styles.semesterBadge,
                            { backgroundColor: getSemesterBadgeColor(file.semester) + '20' }
                          ]}>
                            <Text style={[
                              styles.semesterText,
                              { color: getSemesterBadgeColor(file.semester) }
                            ]}>
                              {file.semester.split(' ')[0]}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.documentMeta}>
                          {file.academicYear} • {file.documentType}
                        </Text>
                        <View style={styles.documentFooter}>
                          <Text style={styles.documentSize}>
                            {formatFileSize(file.size)}
                          </Text>
                          <Text style={styles.documentSeparator}>•</Text>
                          <Text style={styles.documentDate}>
                            Uploaded: {file.uploadDate}
                          </Text>
                        </View>
                        {isUploading && (
                          <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                              <View 
                                style={[
                                  styles.progressFill,
                                  { width: `${progress}%` }
                                ]} 
                              />
                            </View>
                            <Text style={styles.progressText}>{progress}%</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={styles.documentActions}>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(file.status) + '20' }
                      ]}>
                        <Ionicons 
                          name={file.status === 'approved' ? 'checkmark-circle' : 
                                file.status === 'rejected' ? 'close-circle' : 'time-outline'} 
                          size={14} 
                          color={getStatusColor(file.status)} 
                        />
                        <Text style={[
                          styles.statusText,
                          { color: getStatusColor(file.status) }
                        ]}>
                          {getStatusText(file.status)}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => removeFile(file.id)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Quick Upload Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Upload</Text>
          <View style={styles.quickOptions}>
            <TouchableOpacity style={styles.quickOption} onPress={takePhoto}>
              <View style={[styles.quickOptionIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="camera" size={24} color="#2563EB" />
              </View>
              <Text style={styles.quickOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickOption} onPress={pickImage}>
              <View style={[styles.quickOptionIcon, { backgroundColor: '#F0F9FF' }]}>
                <Ionicons name="images" size={24} color="#0EA5E9" />
              </View>
              <Text style={styles.quickOptionText}>From Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickOption} onPress={pickDocument}>
              <View style={[styles.quickOptionIcon, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="document-text" size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.quickOptionText}>Browse Files</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Help Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>COR Upload Guidelines</Text>
          <View style={styles.helpCard}>
            <Ionicons name="information-circle-outline" size={24} color="#2563EB" />
            <View style={styles.helpContent}>
              <Text style={styles.helpText}>
                • Ensure COR shows your full name and student ID{'\n'}
                • Current semester/year must be visible{'\n'}
                • Photo should be clear and well-lit{'\n'}
                • File must be under 10MB{'\n'}
                • Verification usually takes 24-48 hours
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* File Source Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={fileModalVisible}
        onRequestClose={() => setFileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload COR Document</Text>
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
                <Text style={styles.modalOptionSubtitle}>Take a new photo</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </Pressable>

            <Pressable style={styles.modalOption} onPress={pickDocument}>
              <Ionicons name="document-outline" size={28} color="#2563EB" />
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Files</Text>
                <Text style={styles.modalOptionSubtitle}>Browse PDF or images</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#0F172A',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    gap: 12,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  statusMessage: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  docCount: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  corInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    gap: 16,
  },
  corIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corInfoContent: {
    flex: 1,
  },
  corTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  corDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  corRequirements: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 13,
    color: '#64748B',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  uploadButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  uploadButtonText: {
    flex: 1,
  },
  uploadButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 2,
  },
  uploadButtonSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  loader: {
    marginVertical: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  documentsList: {
    gap: 12,
  },
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentDetails: {
    flex: 1,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  semesterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  semesterText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  documentMeta: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },
  documentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  documentSize: {
    fontSize: 12,
    color: '#64748B',
  },
  documentSeparator: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  documentDate: {
    fontSize: 12,
    color: '#64748B',
    minWidth: 150
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    minWidth: 30,
  },
  documentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  actionButton: {
    padding: 4,
  },
  quickOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickOption: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  helpContent: {
    flex: 1,
  },
  helpText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },
  footerSpacer: {
    height: 40,
  },
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