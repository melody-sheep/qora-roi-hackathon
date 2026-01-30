import * as MockDB from './mockDatabase';

export const Database = {
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
