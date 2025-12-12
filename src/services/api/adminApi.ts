import { simulateNetworkDelay, USE_MOCK_API, API_BASE_URL } from './config';
import { students, mentors, courses, Student, Mentor, Course } from '@/data/mockData';
import {
  systemStats,
  mentorInvitations,
  systemSettings,
  recentActivity,
  SystemStats,
  MentorInvitation,
  SystemSetting,
} from '@/data/adminMockData';
import type { AdminDashboardData } from './types';

// Local mutable copies for mock operations
let mockStudents = [...students];
let mockMentors = [...mentors];
let mockInvitations = [...mentorInvitations];
let mockSettings = [...systemSettings];

/**
 * Get system statistics
 * 
 * Suggested endpoint: GET /api/admin/stats
 * Response: SystemStats
 */
export async function getSystemStats(): Promise<SystemStats> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return { ...systemStats };
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }
}

/**
 * Get admin dashboard data
 * 
 * Suggested endpoint: GET /api/admin/dashboard
 * Response: AdminDashboardData
 */
export async function getAdminDashboard(): Promise<AdminDashboardData> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const topCourses = courses.slice(0, 5).map(course => {
      const mentor = mentors.find(m => m.id === course.mentorId);
      return {
        course,
        mentor: mentor!,
        revenue: course.price * course.totalStudents,
      };
    });

    return {
      systemStats: { ...systemStats },
      recentActivity: [...recentActivity],
      topCourses,
    };
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return res.json();
  }
}

/**
 * Get recent activity
 * 
 * Suggested endpoint: GET /api/admin/activity
 * Query params: ?limit=10
 * Response: Activity[]
 */
export async function getRecentActivity(limit: number = 10): Promise<typeof recentActivity> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return recentActivity.slice(0, limit);
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/activity?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch activity');
    return res.json();
  }
}

/**
 * Get all students
 * 
 * Suggested endpoint: GET /api/admin/students
 * Query params: ?status=active&search=john
 * Response: Student[]
 */
export async function getAllStudents(): Promise<Student[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return [...mockStudents];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/students`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  }
}

/**
 * Update a student
 * 
 * Suggested endpoint: PUT /api/admin/students/:id
 * Request body: Partial<Student>
 * Response: Student
 */
export async function updateStudent(studentId: string, data: Partial<Student>): Promise<Student> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const index = mockStudents.findIndex(s => s.id === studentId);
    if (index === -1) throw new Error('Student not found');

    mockStudents[index] = { ...mockStudents[index], ...data };
    return mockStudents[index];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update student');
    return res.json();
  }
}

/**
 * Get all mentors
 * 
 * Suggested endpoint: GET /api/admin/mentors
 * Response: Mentor[]
 */
export async function getAllMentors(): Promise<Mentor[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return [...mockMentors];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/mentors`);
    if (!res.ok) throw new Error('Failed to fetch mentors');
    return res.json();
  }
}

/**
 * Update a mentor
 * 
 * Suggested endpoint: PUT /api/admin/mentors/:id
 * Request body: Partial<Mentor>
 * Response: Mentor
 */
export async function updateMentor(mentorId: string, data: Partial<Mentor>): Promise<Mentor> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const index = mockMentors.findIndex(m => m.id === mentorId);
    if (index === -1) throw new Error('Mentor not found');

    mockMentors[index] = { ...mockMentors[index], ...data };
    return mockMentors[index];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/mentors/${mentorId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update mentor');
    return res.json();
  }
}

/**
 * Get mentor invitations
 * 
 * Suggested endpoint: GET /api/admin/invitations
 * Response: MentorInvitation[]
 */
export async function getMentorInvitations(): Promise<MentorInvitation[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return [...mockInvitations];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/invitations`);
    if (!res.ok) throw new Error('Failed to fetch invitations');
    return res.json();
  }
}

/**
 * Send a mentor invitation
 * 
 * Suggested endpoint: POST /api/admin/invitations
 * Request body: { email: string, name: string }
 * Response: MentorInvitation
 */
export async function sendMentorInvitation(email: string, name: string): Promise<MentorInvitation> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const newInvitation: MentorInvitation = {
      id: `inv-${Date.now()}`,
      email,
      name,
      status: 'pending',
      invitedAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    mockInvitations.push(newInvitation);
    return newInvitation;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/invitations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    if (!res.ok) throw new Error('Failed to send invitation');
    return res.json();
  }
}

/**
 * Resend a mentor invitation
 * 
 * Suggested endpoint: POST /api/admin/invitations/:id/resend
 * Response: MentorInvitation
 */
export async function resendMentorInvitation(invitationId: string): Promise<MentorInvitation> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const index = mockInvitations.findIndex(i => i.id === invitationId);
    if (index === -1) throw new Error('Invitation not found');

    mockInvitations[index] = {
      ...mockInvitations[index],
      invitedAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
    };

    return mockInvitations[index];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/invitations/${invitationId}/resend`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to resend invitation');
    return res.json();
  }
}

/**
 * Delete a mentor invitation
 * 
 * Suggested endpoint: DELETE /api/admin/invitations/:id
 * Response: { success: boolean }
 */
export async function deleteMentorInvitation(invitationId: string): Promise<void> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    mockInvitations = mockInvitations.filter(i => i.id !== invitationId);
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/invitations/${invitationId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete invitation');
  }
}

/**
 * Get system settings
 * 
 * Suggested endpoint: GET /api/admin/settings
 * Response: SystemSetting[]
 */
export async function getSystemSettings(): Promise<SystemSetting[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return [...mockSettings];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  }
}

/**
 * Update a system setting
 * 
 * Suggested endpoint: PUT /api/admin/settings/:key
 * Request body: { value: string }
 * Response: SystemSetting
 */
export async function updateSystemSetting(key: string, value: string): Promise<SystemSetting> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const index = mockSettings.findIndex(s => s.key === key);
    if (index === -1) throw new Error('Setting not found');

    mockSettings[index] = { ...mockSettings[index], value };
    return mockSettings[index];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/settings/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    if (!res.ok) throw new Error('Failed to update setting');
    return res.json();
  }
}

/**
 * Save multiple system settings
 * 
 * Suggested endpoint: PUT /api/admin/settings
 * Request body: { settings: { key: string, value: string }[] }
 * Response: SystemSetting[]
 */
export async function saveSystemSettings(settings: { key: string; value: string }[]): Promise<SystemSetting[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    settings.forEach(({ key, value }) => {
      const index = mockSettings.findIndex(s => s.key === key);
      if (index !== -1) {
        mockSettings[index] = { ...mockSettings[index], value };
      }
    });

    return [...mockSettings];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    });
    if (!res.ok) throw new Error('Failed to save settings');
    return res.json();
  }
}

/**
 * Clear all cache (admin action)
 * 
 * Suggested endpoint: POST /api/admin/cache/clear
 * Response: { success: boolean }
 */
export async function clearCache(): Promise<void> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    // Mock: Just simulate success
    return;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/cache/clear`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to clear cache');
  }
}

/**
 * Export all data (admin action)
 * 
 * Suggested endpoint: GET /api/admin/export
 * Response: Blob (CSV/ZIP file)
 */
export async function exportAllData(): Promise<{
  students: Student[];
  mentors: Mentor[];
  courses: Course[];
}> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call that returns downloadable file
    await simulateNetworkDelay();
    return {
      students: [...mockStudents],
      mentors: [...mockMentors],
      courses: [...courses],
    };
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/export`);
    if (!res.ok) throw new Error('Failed to export data');
    return res.json();
  }
}
