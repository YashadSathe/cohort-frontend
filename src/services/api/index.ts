// API Layer - Barrel Export
// This file provides a clean interface for all API operations

// Configuration & Utilities
export { 
  API_BASE_URL, 
  USE_MOCK_API, 
  simulateNetworkDelay,
  withRetry,
  fetchWithRetry,
  apiCall,
  RETRY_CONFIG,
  type RetryOptions,
} from './config';

// Types - Re-export all types for easy access
export * from './types';

// Auth API
export {
  login,
  registerStudent,
  logout,
  validateMentorInvite,
} from './authApi';

// Course API
export {
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  getCoursesByMentor,
  createCourse,
  updateCourse,
  deleteCourse,
  updateCourseCurriculum,
  getMentorById,
  getAllMentors,
} from './courseApi';

// Student API
export {
  getStudentDashboard,
  getEnrolledCourses,
  getCourseProgress,
  updateTopicCompletion,
  getStudentAssignments,
  getAssignmentById,
  submitAssignment,
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationRead,
  markAllNotificationsRead,
  getStudentCertificates,
  enrollInCourse,
} from './studentApi';

// Mentor API
export {
  getMentorById as getMentorProfile,
  getMentorDashboard,
  getMentorCourses,
  getMentorSessions,
  createSession,
  updateSession,
  deleteSession,
  getCohortStudents,
  getMentorAssignments,
  createAssignment,
  updateAssignment,
  getAssignmentSubmissions,
  getPendingSubmissions,
  getPendingSubmissionsCount,
  reviewSubmission,
  issueCertificate,
  updateMentorProfile,
} from './mentorApi';

// Admin API
export {
  getSystemStats,
  getAdminDashboard,
  getRecentActivity,
  getAllStudents,
  updateStudent,
  getAllMentors as getAdminMentors,
  updateMentor,
  getMentorInvitations,
  sendMentorInvitation,
  resendMentorInvitation,
  deleteMentorInvitation,
  getSystemSettings,
  updateSystemSetting,
  saveSystemSettings,
  clearCache,
  exportAllData,
} from './adminApi';

// Payment API
export {
  validateCoupon,
  processPayment,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
} from './paymentApi';
