// Re-export all types from mock data files for use across the application
// These types will remain consistent whether using mock or real API

export type {
  User,
  Student,
  Mentor,
  Admin,
  Course,
  Module,
  Topic,
  ClassSchedule,
  Cohort,
  Coupon,
} from '@/data/mockData';

export type {
  Assignment,
  Notification,
  StudentProgress,
  Payment,
} from '@/data/studentMockData';

export type {
  MentorAssignment,
  StudentSubmission,
  MentorSession,
  CohortStudent,
} from '@/data/mentorMockData';

export type {
  SystemStats,
  MentorInvitation,
  SystemSetting,
} from '@/data/adminMockData';

// API Response Types

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Dashboard Data Types

export interface StudentDashboardData {
  enrolledCourses: import('@/data/mockData').Course[];
  upcomingClass: {
    courseTitle: string;
    sessionTitle: string;
    date: string;
    time: string;
    meetingLink: string;
  } | null;
  recentNotifications: import('@/data/studentMockData').Notification[];
  pendingAssignments: import('@/data/studentMockData').Assignment[];
  stats: {
    enrolledCoursesCount: number;
    classesAttended: number;
    pendingTasksCount: number;
    certificatesCount: number;
  };
}

export interface MentorDashboardData {
  assignedCourses: import('@/data/mockData').Course[];
  upcomingSessions: import('@/data/mentorMockData').MentorSession[];
  pendingSubmissions: import('@/data/mentorMockData').StudentSubmission[];
  recentActivity: { id: string; action: string; time: string }[];
  stats: {
    totalStudents: number;
    activeCourses: number;
    pendingReviews: number;
    sessionsThisWeek: number;
  };
}

export interface AdminDashboardData {
  systemStats: import('@/data/adminMockData').SystemStats;
  recentActivity: { id: number; action: string; user: string; time: string; course?: string; assignment?: string; amount?: string }[];
  topCourses: {
    course: import('@/data/mockData').Course;
    mentor: import('@/data/mockData').Mentor;
    revenue: number;
  }[];
}

// Payment Types

export interface CouponValidationResult {
  valid: boolean;
  discountedPrice: number;
  discountAmount: number;
  coupon?: import('@/data/mockData').Coupon;
  error?: string;
}

export interface PaymentPayload {
  courseId: string;
  studentId: string;
  amount: number;
  discount: number;
  couponCode?: string;
  paymentMethod: 'full' | 'emi-3' | 'emi-6' | 'upi';
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Auth Types

export type AuthUser = import('@/data/mockData').Student | import('@/data/mockData').Mentor | import('@/data/mockData').Admin | null;

export interface LoginCredentials {
  email: string;
  password: string;
  role: 'student' | 'mentor' | 'admin';
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  college?: string;
}
