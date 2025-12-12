import { simulateNetworkDelay, USE_MOCK_API, API_BASE_URL } from './config';
import { courses, Course } from '@/data/mockData';
import {
  assignments,
  notifications,
  studentProgress,
  Assignment,
  Notification,
  StudentProgress,
} from '@/data/studentMockData';
import type { StudentDashboardData } from './types';

// Local mutable copies for mock operations
let mockAssignments = [...assignments];
let mockNotifications = [...notifications];
let mockProgress = [...studentProgress];

/**
 * Get student dashboard data
 * 
 * Suggested endpoint: GET /api/students/:id/dashboard
 * Response: StudentDashboardData
 */
export async function getStudentDashboard(studentId: string): Promise<StudentDashboardData> {
  if (USE_MOCK_API) {
    // TODO: Replace this mock implementation with a real fetch call:
    // const res = await fetch(`${API_BASE_URL}/api/students/${studentId}/dashboard`);
    // return res.json();

    await simulateNetworkDelay();

    const enrolledCourses = courses.slice(0, 2);
    const pendingAssignments = mockAssignments.filter(
      a => a.status === 'not-submitted' || a.status === 'rejected'
    );
    const recentNotifications = mockNotifications.slice(0, 3);

    const upcomingClass = {
      courseTitle: 'Full-Stack Web Development',
      sessionTitle: 'Week 1: HTML & CSS Deep Dive',
      date: 'Dec 15, 2024',
      time: '10:00 AM',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
    };

    return {
      enrolledCourses,
      upcomingClass,
      recentNotifications,
      pendingAssignments,
      stats: {
        enrolledCoursesCount: enrolledCourses.length,
        classesAttended: 4,
        pendingTasksCount: pendingAssignments.length,
        certificatesCount: 1,
      },
    };
  } else {
    const res = await fetch(`${API_BASE_URL}/api/students/${studentId}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return res.json();
  }
}

/**
 * Get enrolled courses for a student
 * 
 * Suggested endpoint: GET /api/students/:id/courses
 * Response: Course[]
 */
export async function getEnrolledCourses(studentId: string): Promise<Course[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    // Mock: Return first 2 courses
    return courses.slice(0, 2);
  } else {
    const res = await fetch(`${API_BASE_URL}/api/students/${studentId}/courses`);
    if (!res.ok) throw new Error('Failed to fetch enrolled courses');
    return res.json();
  }
}

/**
 * Get course progress for a student
 * 
 * Suggested endpoint: GET /api/students/:studentId/progress/:courseId
 * Response: StudentProgress | null
 */
export async function getCourseProgress(studentId: string, courseId: string): Promise<StudentProgress | null> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay(100);
    return mockProgress.find(p => p.courseId === courseId) || null;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/students/${studentId}/progress/${courseId}`);
    if (!res.ok) return null;
    return res.json();
  }
}

/**
 * Update topic completion status
 * 
 * Suggested endpoint: POST /api/students/:studentId/progress/:courseId/topics/:topicId
 * Request body: { completed: boolean }
 * Response: StudentProgress
 */
export async function updateTopicCompletion(
  studentId: string,
  courseId: string,
  topicId: string,
  completed: boolean
): Promise<StudentProgress> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const progressIndex = mockProgress.findIndex(p => p.courseId === courseId);
    if (progressIndex === -1) {
      // Create new progress entry
      const newProgress: StudentProgress = {
        courseId,
        completedTopics: completed ? [topicId] : [],
        totalTopics: 12,
        attendedClasses: 0,
        totalClasses: 8,
        assignmentsCompleted: 0,
        totalAssignments: 3,
        certificateStatus: 'locked',
      };
      mockProgress.push(newProgress);
      return newProgress;
    }

    if (completed) {
      if (!mockProgress[progressIndex].completedTopics.includes(topicId)) {
        mockProgress[progressIndex].completedTopics.push(topicId);
      }
    } else {
      mockProgress[progressIndex].completedTopics = mockProgress[progressIndex].completedTopics.filter(
        t => t !== topicId
      );
    }

    return mockProgress[progressIndex];
  } else {
    const res = await fetch(
      `${API_BASE_URL}/api/students/${studentId}/progress/${courseId}/topics/${topicId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      }
    );
    if (!res.ok) throw new Error('Failed to update progress');
    return res.json();
  }
}

/**
 * Get all assignments for a student
 * 
 * Suggested endpoint: GET /api/students/:id/assignments
 * Response: Assignment[]
 */
export async function getStudentAssignments(studentId: string): Promise<Assignment[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return [...mockAssignments];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/students/${studentId}/assignments`);
    if (!res.ok) throw new Error('Failed to fetch assignments');
    return res.json();
  }
}

/**
 * Get a specific assignment by ID
 * 
 * Suggested endpoint: GET /api/assignments/:id
 * Response: Assignment | null
 */
export async function getAssignmentById(id: string): Promise<Assignment | null> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return mockAssignments.find(a => a.id === id) || null;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/assignments/${id}`);
    if (!res.ok) return null;
    return res.json();
  }
}

/**
 * Submit an assignment
 * 
 * Suggested endpoint: POST /api/assignments/:id/submit
 * Request body: { submissionUrl: string }
 * Response: Assignment
 */
export async function submitAssignment(assignmentId: string, submissionUrl: string): Promise<Assignment> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const index = mockAssignments.findIndex(a => a.id === assignmentId);
    if (index === -1) throw new Error('Assignment not found');

    mockAssignments[index] = {
      ...mockAssignments[index],
      status: 'submitted',
      submissionUrl,
      submittedAt: new Date().toISOString(),
    };

    return mockAssignments[index];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/assignments/${assignmentId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionUrl }),
    });
    if (!res.ok) throw new Error('Failed to submit assignment');
    return res.json();
  }
}

/**
 * Get all notifications for a student
 * 
 * Suggested endpoint: GET /api/students/:id/notifications
 * Response: Notification[]
 */
export async function getNotifications(studentId: string): Promise<Notification[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return [...mockNotifications];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/students/${studentId}/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  }
}

/**
 * Get unread notification count
 * 
 * Suggested endpoint: GET /api/students/:id/notifications/unread-count
 * Response: { count: number }
 */
export async function getUnreadNotificationsCount(studentId: string): Promise<number> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay(100);
    return mockNotifications.filter(n => !n.read).length;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/students/${studentId}/notifications/unread-count`);
    if (!res.ok) throw new Error('Failed to fetch notification count');
    const data = await res.json();
    return data.count;
  }
}

/**
 * Mark a notification as read
 * 
 * Suggested endpoint: PUT /api/notifications/:id/read
 * Response: Notification
 */
export async function markNotificationRead(notificationId: string): Promise<void> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay(100);
    const index = mockNotifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      mockNotifications[index].read = true;
    }
  } else {
    await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, { method: 'PUT' });
  }
}

/**
 * Mark all notifications as read
 * 
 * Suggested endpoint: PUT /api/students/:id/notifications/read-all
 * Response: { success: boolean }
 */
export async function markAllNotificationsRead(studentId: string): Promise<void> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    mockNotifications = mockNotifications.map(n => ({ ...n, read: true }));
  } else {
    await fetch(`${API_BASE_URL}/api/students/${studentId}/notifications/read-all`, { method: 'PUT' });
  }
}

/**
 * Get student certificates (courses with issued certificates)
 * 
 * Suggested endpoint: GET /api/students/:id/certificates
 * Response: StudentProgress[]
 */
export async function getStudentCertificates(studentId: string): Promise<StudentProgress[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return mockProgress.filter(p => p.certificateStatus === 'issued');
  } else {
    const res = await fetch(`${API_BASE_URL}/api/students/${studentId}/certificates`);
    if (!res.ok) throw new Error('Failed to fetch certificates');
    return res.json();
  }
}

/**
 * Enroll student in a course
 * 
 * Suggested endpoint: POST /api/courses/:courseId/enroll
 * Request body: { studentId: string }
 * Response: { success: boolean }
 */
export async function enrollInCourse(studentId: string, courseId: string): Promise<void> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    // Mock: Just simulate success
    return;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    });
    if (!res.ok) throw new Error('Failed to enroll');
  }
}
