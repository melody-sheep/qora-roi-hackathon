// Export all functions from services module
export {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from './services';

// Export all functions from availability module
export {
  createAvailability,
  getAvailability,
  updateAvailability,
  deleteAvailability,
  getDoctorAvailability,
  getClinicAvailability,
  checkSlotAvailability,
} from './availability';

// Export all functions from documents module
export {
  uploadDocument,
  getDocuments,
  getDocumentById,
  updateDocumentStatus,
  deleteDocument,
  getRegistrationStatus,
} from './documents';

// Export all functions from profiles module
export {
  getUserProfile,
  updateUserProfile,
  getClinicProfile,
  getDoctorProfile,
  getClinicDoctors,
} from './profiles';

// Export all functions from FAQ module
export {
  getFAQ,
  getFAQByCategory,
  getFAQCategories,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  searchFAQ,
} from './faq';

// Export all functions from notifications module
export {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
} from './notifications';

// Export all utility functions from sync and init
export {
  syncData,
  exportData,
  importData,
} from './sync';

export {
  initializeDatabase,
  clearAllData,
  getDatabaseStats,
} from './init';

// Export constants
export { TABLES, SEED_DATA } from './constants';
