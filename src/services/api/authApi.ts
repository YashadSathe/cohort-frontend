import { simulateNetworkDelay, USE_MOCK_API, API_BASE_URL } from './config';
import { students, mentors, admins, Student } from '@/data/mockData';
import type { AuthUser, LoginCredentials, RegisterData } from './types';

/**
 * Authenticate a user with email, password, and role
 * 
 * Suggested endpoint: POST /api/auth/login
 * Request body: { email: string, password: string, role: 'student' | 'mentor' | 'admin' }
 * Response: { user: User, token: string } | { error: string }
 */
export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  const { email, password, role } = credentials;

  if (USE_MOCK_API) {
    // TODO: Replace this mock implementation with a real fetch call:
    // const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password, role }),
    // });
    // const data = await res.json();
    // return data.user;

    await simulateNetworkDelay();

    let foundUser: AuthUser = null;

    if (role === 'student') {
      foundUser = students.find(s => s.email === email && s.password === password) || null;
    } else if (role === 'mentor') {
      foundUser = mentors.find(m => m.email === email && m.password === password) || null;
    } else if (role === 'admin') {
      foundUser = admins.find(a => a.email === email && a.password === password) || null;
    }

    return foundUser;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data.user;
  }
}

/**
 * Register a new student account
 * 
 * Suggested endpoint: POST /api/auth/register
 * Request body: RegisterData
 * Response: { user: Student, token: string }
 */
export async function registerStudent(userData: RegisterData): Promise<Student> {
  if (USE_MOCK_API) {
    // TODO: Replace this mock implementation with a real fetch call:
    // const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(userData),
    // });
    // const data = await res.json();
    // return data.user;

    await simulateNetworkDelay();

    const newUser: Student = {
      id: `student-${Date.now()}`,
      email: userData.email,
      password: userData.password,
      name: userData.name,
      phone: userData.phone,
      city: userData.city,
      state: userData.state,
      country: userData.country,
      college: userData.college,
      role: 'student',
      enrolledCourses: [],
      completedCourses: [],
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    return newUser;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data.user;
  }
}

/**
 * Log out the current user
 * 
 * Suggested endpoint: POST /api/auth/logout
 * Response: { success: boolean }
 */
export async function logout(): Promise<void> {
  if (USE_MOCK_API) {
    // TODO: Replace this mock implementation with a real fetch call:
    // await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST' });

    await simulateNetworkDelay(100);
    // Mock: Just return, actual logout logic is handled in AuthContext
    return;
  } else {
    await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST' });
  }
}

/**
 * Validate a mentor invitation token
 * 
 * Suggested endpoint: GET /api/auth/validate-invite/:token
 * Response: { valid: boolean, email?: string, name?: string }
 */
export async function validateMentorInvite(token: string): Promise<{ valid: boolean; email?: string; name?: string }> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    
    // Mock: Accept any token that starts with 'invite-'
    if (token.startsWith('invite-')) {
      return { valid: true, email: 'invited@example.com', name: 'Invited Mentor' };
    }
    return { valid: false };
  } else {
    const res = await fetch(`${API_BASE_URL}/api/auth/validate-invite/${token}`);
    return res.json();
  }
}
