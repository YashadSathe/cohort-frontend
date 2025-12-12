import { simulateNetworkDelay, USE_MOCK_API, API_BASE_URL } from './config';
import { courses, mentors, Course, Mentor } from '@/data/mockData';
import {
  mentorSessions,
  mentorAssignments,
  studentSubmissions,
  cohortStudents,
  MentorSession,
  MentorAssignment,
  StudentSubmission,
  CohortStudent,
} from '@/data/mentorMockData';
import type { MentorDashboardData } from './types';

// Local mutable copies for mock operations
let mockSessions = [...mentorSessions];
let mockAssignments = [...mentorAssignments];
let mockSubmissions = [...studentSubmissions];
let mockStudents = [...cohortStudents];

/**
 * Get mentor by ID
 * 
 * Suggested endpoint: GET /api/mentors/:id
 * Response: Mentor | null
 */
export async function getMentorById(id: string): Promise<Mentor | null> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay(100);
    return mentors.find(m => m.id === id) || null;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/mentors/${id}`);
    if (!res.ok) return null;
    return res.json();
  }
}

/**
 * Get mentor dashboard data
 * 
 * Suggested endpoint: GET /api/mentors/:id/dashboard
 * Response: MentorDashboardData
 */
export async function getMentorDashboard(mentorId: string): Promise<MentorDashboardData> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const mentor = mentors.find(m => m.id === mentorId);
    const assignedCourses = courses.filter(c => c.mentorId === mentorId);
    const upcomingSessions = mockSessions.filter(s => s.status === 'scheduled').slice(0, 3);
    const pendingSubmissions = mockSubmissions.filter(s => s.status === 'pending');

    return {
      assignedCourses,
      upcomingSessions,
      pendingSubmissions,
      recentActivity: [
        { id: '1', action: 'New submission from John Doe', time: '5 minutes ago' },
        { id: '2', action: 'Session scheduled for tomorrow', time: '1 hour ago' },
        { id: '3', action: 'Assignment approved for Jane Smith', time: '2 hours ago' },
      ],
      stats: {
        totalStudents: mockStudents.length,
        activeCourses: assignedCourses.filter(c => c.status === 'active').length,
        pendingReviews: pendingSubmissions.length,
        sessionsThisWeek: upcomingSessions.length,
      },
    };
  } else {
    const res = await fetch(`${API_BASE_URL}/api/mentors/${mentorId}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return res.json();
  }
}

/**
 * Get courses assigned to a mentor
 * 
 * Suggested endpoint: GET /api/mentors/:id/courses
 * Response: Course[]
 */
export async function getMentorCourses(mentorId: string): Promise<Course[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return courses.filter(c => c.mentorId === mentorId);
  } else {
    const res = await fetch(`${API_BASE_URL}/api/mentors/${mentorId}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  }
}

/**
 * Get sessions for a mentor
 * 
 * Suggested endpoint: GET /api/mentors/:id/sessions
 * Query params: ?courseId=course-1&status=scheduled
 * Response: MentorSession[]
 */
export async function getMentorSessions(mentorId: string, courseId?: string): Promise<MentorSession[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    let sessions = [...mockSessions];
    if (courseId) {
      sessions = sessions.filter(s => s.courseId === courseId);
    }
    return sessions;
  } else {
    const url = new URL(`${API_BASE_URL}/api/mentors/${mentorId}/sessions`);
    if (courseId) url.searchParams.set('courseId', courseId);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return res.json();
  }
}

/**
 * Create a new session
 * 
 * Suggested endpoint: POST /api/sessions
 * Request body: Partial<MentorSession>
 * Response: MentorSession
 */
export async function createSession(session: Partial<MentorSession>): Promise<MentorSession> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const newSession: MentorSession = {
      id: `session-${Date.now()}`,
      courseId: session.courseId || '',
      title: session.title || 'New Session',
      description: session.description || '',
      date: session.date || new Date().toISOString().split('T')[0],
      time: session.time || '10:00 AM',
      duration: session.duration || '1 hour',
      meetingLink: session.meetingLink || 'https://meet.google.com/new',
      reminderTiming: session.reminderTiming || ['1 day', '1 hour'],
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    mockSessions.push(newSession);
    return newSession;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
    if (!res.ok) throw new Error('Failed to create session');
    return res.json();
  }
}

/**
 * Update a session
 * 
 * Suggested endpoint: PUT /api/sessions/:id
 * Request body: Partial<MentorSession>
 * Response: MentorSession
 */
export async function updateSession(sessionId: string, data: Partial<MentorSession>): Promise<MentorSession> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const index = mockSessions.findIndex(s => s.id === sessionId);
    if (index === -1) throw new Error('Session not found');

    mockSessions[index] = { ...mockSessions[index], ...data };
    return mockSessions[index];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update session');
    return res.json();
  }
}

/**
 * Delete a session
 * 
 * Suggested endpoint: DELETE /api/sessions/:id
 * Response: { success: boolean }
 */
export async function deleteSession(sessionId: string): Promise<void> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    mockSessions = mockSessions.filter(s => s.id !== sessionId);
  } else {
    const res = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete session');
  }
}

/**
 * Get students in mentor's cohort
 * 
 * Suggested endpoint: GET /api/mentors/:id/students
 * Query params: ?courseId=course-1
 * Response: CohortStudent[]
 */
export async function getCohortStudents(mentorId: string, courseId?: string): Promise<CohortStudent[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    let students = [...mockStudents];
    if (courseId) {
      students = students.filter(s => s.courseId === courseId);
    }
    return students;
  } else {
    const url = new URL(`${API_BASE_URL}/api/mentors/${mentorId}/students`);
    if (courseId) url.searchParams.set('courseId', courseId);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  }
}

/**
 * Get assignments created by mentor
 * 
 * Suggested endpoint: GET /api/mentors/:id/assignments
 * Response: MentorAssignment[]
 */
export async function getMentorAssignments(mentorId: string): Promise<MentorAssignment[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return [...mockAssignments];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/mentors/${mentorId}/assignments`);
    if (!res.ok) throw new Error('Failed to fetch assignments');
    return res.json();
  }
}

/**
 * Create a new assignment
 * 
 * Suggested endpoint: POST /api/assignments
 * Request body: Partial<MentorAssignment>
 * Response: MentorAssignment
 */
export async function createAssignment(assignment: Partial<MentorAssignment>): Promise<MentorAssignment> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const newAssignment: MentorAssignment = {
      id: `assign-${Date.now()}`,
      courseId: assignment.courseId || '',
      title: assignment.title || 'New Assignment',
      description: assignment.description || '',
      instructions: assignment.instructions || '',
      dueDate: assignment.dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      status: assignment.status || 'draft',
    };

    mockAssignments.push(newAssignment);
    return newAssignment;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignment),
    });
    if (!res.ok) throw new Error('Failed to create assignment');
    return res.json();
  }
}

/**
 * Update an assignment
 * 
 * Suggested endpoint: PUT /api/assignments/:id
 * Request body: Partial<MentorAssignment>
 * Response: MentorAssignment
 */
export async function updateAssignment(assignmentId: string, data: Partial<MentorAssignment>): Promise<MentorAssignment> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const index = mockAssignments.findIndex(a => a.id === assignmentId);
    if (index === -1) throw new Error('Assignment not found');

    mockAssignments[index] = { ...mockAssignments[index], ...data };
    return mockAssignments[index];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/assignments/${assignmentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update assignment');
    return res.json();
  }
}

/**
 * Get submissions for an assignment
 * 
 * Suggested endpoint: GET /api/assignments/:id/submissions
 * Response: StudentSubmission[]
 */
export async function getAssignmentSubmissions(assignmentId: string): Promise<StudentSubmission[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return mockSubmissions.filter(s => s.assignmentId === assignmentId);
  } else {
    const res = await fetch(`${API_BASE_URL}/api/assignments/${assignmentId}/submissions`);
    if (!res.ok) throw new Error('Failed to fetch submissions');
    return res.json();
  }
}

/**
 * Get all pending submissions for a mentor
 * 
 * Suggested endpoint: GET /api/mentors/:id/submissions/pending
 * Response: StudentSubmission[]
 */
export async function getPendingSubmissions(mentorId: string): Promise<StudentSubmission[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return mockSubmissions.filter(s => s.status === 'pending');
  } else {
    const res = await fetch(`${API_BASE_URL}/api/mentors/${mentorId}/submissions/pending`);
    if (!res.ok) throw new Error('Failed to fetch pending submissions');
    return res.json();
  }
}

/**
 * Get pending submissions count
 * 
 * Suggested endpoint: GET /api/mentors/:id/submissions/pending-count
 * Response: { count: number }
 */
export async function getPendingSubmissionsCount(mentorId: string): Promise<number> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay(100);
    return mockSubmissions.filter(s => s.status === 'pending').length;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/mentors/${mentorId}/submissions/pending-count`);
    if (!res.ok) throw new Error('Failed to fetch count');
    const data = await res.json();
    return data.count;
  }
}

/**
 * Review a submission (approve or reject)
 * 
 * Suggested endpoint: PUT /api/submissions/:id/review
 * Request body: { status: 'approved' | 'rejected', feedback?: string }
 * Response: StudentSubmission
 */
export async function reviewSubmission(
  submissionId: string,
  status: 'approved' | 'rejected',
  feedback?: string
): Promise<StudentSubmission> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const index = mockSubmissions.findIndex(s => s.id === submissionId);
    if (index === -1) throw new Error('Submission not found');

    mockSubmissions[index] = {
      ...mockSubmissions[index],
      status,
      feedback,
    };

    return mockSubmissions[index];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/submissions/${submissionId}/review`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, feedback }),
    });
    if (!res.ok) throw new Error('Failed to review submission');
    return res.json();
  }
}

/**
 * Issue a certificate to a student
 * 
 * Suggested endpoint: POST /api/students/:studentId/courses/:courseId/certificate
 * Response: { success: boolean, certificateId: string }
 */
export async function issueCertificate(studentId: string, courseId: string): Promise<{ success: boolean; certificateId: string }> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    // Update student's certificate status
    const studentIndex = mockStudents.findIndex(s => s.id === studentId && s.courseId === courseId);
    if (studentIndex !== -1) {
      mockStudents[studentIndex].certificateStatus = 'issued';
    }

    return { success: true, certificateId: `cert-${Date.now()}` };
  } else {
    const res = await fetch(`${API_BASE_URL}/api/students/${studentId}/courses/${courseId}/certificate`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to issue certificate');
    return res.json();
  }
}

/**
 * Update mentor profile
 * 
 * Suggested endpoint: PUT /api/mentors/:id
 * Request body: Partial<Mentor>
 * Response: Mentor
 */
export async function updateMentorProfile(mentorId: string, data: Partial<Mentor>): Promise<Mentor> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    
    const mentor = mentors.find(m => m.id === mentorId);
    if (!mentor) throw new Error('Mentor not found');
    
    return { ...mentor, ...data };
  } else {
    const res = await fetch(`${API_BASE_URL}/api/mentors/${mentorId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  }
}
