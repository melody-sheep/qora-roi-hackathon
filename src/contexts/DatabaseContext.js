import React, { createContext, useContext, useEffect } from 'react';
import * as MockDB from '../services/mockDatabase';

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  useEffect(() => {
    // Initialize database on app start
    MockDB.initializeDatabase();
  }, []);

  const value = {
    // Services
    getServices: MockDB.getServices,
    getServiceById: MockDB.getServiceById,
    createService: MockDB.createService,
    updateService: MockDB.updateService,
    deleteService: MockDB.deleteService,

    // Documents
    uploadDocument: MockDB.uploadDocument,
    getDocuments: MockDB.getDocuments,
    getDocumentById: MockDB.getDocumentById,
    updateDocumentStatus: MockDB.updateDocumentStatus,
    deleteDocument: MockDB.deleteDocument,
    getRegistrationStatus: MockDB.getRegistrationStatus,

    // Profiles
    getUserProfile: MockDB.getUserProfile,
    updateUserProfile: MockDB.updateUserProfile,
    getClinicProfile: MockDB.getClinicProfile,
    getDoctorProfile: MockDB.getDoctorProfile,
    getClinicDoctors: MockDB.getClinicDoctors,

    // Appointments
    createAvailability: MockDB.createAvailability,
    getAvailability: MockDB.getAvailability,
    updateAvailability: MockDB.updateAvailability,
    deleteAvailability: MockDB.deleteAvailability,

    // FAQ
    getFAQ: MockDB.getFAQ,
    getFAQByCategory: MockDB.getFAQByCategory,
    getFAQCategories: MockDB.getFAQCategories,
    createFAQ: MockDB.createFAQ,
    updateFAQ: MockDB.updateFAQ,
    deleteFAQ: MockDB.deleteFAQ,
    searchFAQ: MockDB.searchFAQ,

    // Database utilities
    clearAllData: MockDB.clearAllData,
    exportData: MockDB.exportData,
    importData: MockDB.importData,
    syncData: MockDB.syncData,
    getDatabaseStats: MockDB.getDatabaseStats,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
