import AsyncStorage from '@react-native-async-storage/async-storage';
import { TABLES } from './constants';

// Generate unique ID
const generateId = () => `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Document statuses: 'pending', 'verified', 'rejected', 'expired'
// Document types: 'registration_certificate', 'student_id', 'insurance_card', 'medical_history'

export const uploadDocument = async (documentData) => {
  try {
    const id = generateId();
    const document = {
      id,
      ...documentData,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(
      `${TABLES.DOCUMENTS}_${id}`,
      JSON.stringify(document)
    );
    
    // Create notification for clinic
    await createNotification({
      id: `notif_${Date.now()}`,
      type: 'new_document',
      title: 'New Document Uploaded',
      message: `New ${documentData.type} uploaded by student`,
      clinicId: 'clinic_1', // Default clinic
      studentId: documentData.studentId,
      documentId: id,
      read: false,
      createdAt: new Date().toISOString()
    });
    
    return { success: true, id, document };
  } catch (error) {
    console.error('Error uploading document:', error);
    return { success: false, error: error.message };
  }
};

export const getDocuments = async (filters = {}) => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const documentKeys = keys.filter(key => key.startsWith(TABLES.DOCUMENTS));
    const items = await AsyncStorage.multiGet(documentKeys);
    
    let documents = items.map(([key, value]) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }).filter(item => item !== null);
    
    // Apply filters
    if (filters.studentId) {
      documents = documents.filter(doc => doc.studentId === filters.studentId);
    }
    
    if (filters.clinicId) {
      documents = documents.filter(doc => doc.clinicId === filters.clinicId);
    }
    
    if (filters.type) {
      documents = documents.filter(doc => doc.type === filters.type);
    }
    
    if (filters.status) {
      documents = documents.filter(doc => doc.status === filters.status);
    }
    
    // Sort by upload date (newest first)
    documents.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    
    return documents;
  } catch (error) {
    console.error('Error getting documents:', error);
    return [];
  }
};

export const getDocumentById = async (documentId) => {
  try {
    const key = `${TABLES.DOCUMENTS}_${documentId}`;
    const document = await AsyncStorage.getItem(key);
    return document ? JSON.parse(document) : null;
  } catch (error) {
    console.error('Error getting document by ID:', error);
    return null;
  }
};

export const updateDocumentStatus = async (documentId, status, notes = '') => {
  try {
    const key = `${TABLES.DOCUMENTS}_${documentId}`;
    const existing = await AsyncStorage.getItem(key);
    
    if (!existing) {
      return { success: false, error: 'Document not found' };
    }
    
    const document = JSON.parse(existing);
    const updatedDocument = {
      ...document,
      status,
      notes: notes || document.notes,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(key, JSON.stringify(updatedDocument));
    
    // Create notification for student
    await createNotification({
      id: `notif_${Date.now()}`,
      type: 'document_status',
      title: 'Document Status Updated',
      message: `Your ${document.type} has been ${status}`,
      studentId: document.studentId,
      documentId: documentId,
      read: false,
      createdAt: new Date().toISOString()
    });
    
    return { success: true, document: updatedDocument };
  } catch (error) {
    console.error('Error updating document status:', error);
    return { success: false, error: error.message };
  }
};

export const deleteDocument = async (documentId) => {
  try {
    await AsyncStorage.removeItem(`${TABLES.DOCUMENTS}_${documentId}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { success: false, error: error.message };
  }
};

// Get student's registration certificate status
export const getRegistrationStatus = async (studentId) => {
  try {
    const documents = await getDocuments({ studentId, type: 'registration_certificate' });
    
    if (documents.length === 0) {
      return { 
        status: 'not_uploaded', 
        message: 'Registration certificate not uploaded' 
      };
    }
    
    // Get the most recent registration certificate
    const latestDoc = documents[0];
    
    return {
      status: latestDoc.status,
      document: latestDoc,
      message: `Registration certificate is ${latestDoc.status}`
    };
  } catch (error) {
    console.error('Error getting registration status:', error);
    return { status: 'error', message: 'Unable to check status' };
  }
};

// Helper function
const createNotification = async (notificationData) => {
  try {
    await AsyncStorage.setItem(
      `${TABLES.NOTIFICATIONS}_${notificationData.id}`,
      JSON.stringify(notificationData)
    );
    return { success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false };
  }
};