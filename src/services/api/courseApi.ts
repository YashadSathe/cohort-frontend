import { simulateNetworkDelay, USE_MOCK_API, API_BASE_URL } from './config';
import { courses, mentors, Course, Module, Mentor } from '@/data/mockData';

// Local mutable copy of courses for mock CRUD operations
let mockCourses = [...courses];

/**
 * Get all courses
 * 
 * Suggested endpoint: GET /api/courses
 * Query params: ?status=active&category=Web+Development
 * Response: Course[]
 */
export async function getAllCourses(): Promise<Course[]> {
  if (USE_MOCK_API) {
    // TODO: Replace this mock implementation with a real fetch call:
    // const res = await fetch(`${API_BASE_URL}/api/courses`);
    // return res.json();

    await simulateNetworkDelay();
    return [...mockCourses];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  }
}

/**
 * Get a course by ID
 * 
 * Suggested endpoint: GET /api/courses/:id
 * Response: Course | null
 */
export async function getCourseById(id: string): Promise<Course | null> {
  if (USE_MOCK_API) {
    // TODO: Replace this mock implementation with a real fetch call:
    // const res = await fetch(`${API_BASE_URL}/api/courses/${id}`);
    // return res.json();

    await simulateNetworkDelay();
    return mockCourses.find(c => c.id === id) || null;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}`);
    if (!res.ok) return null;
    return res.json();
  }
}

/**
 * Get a course by slug
 * 
 * Suggested endpoint: GET /api/courses/slug/:slug
 * Response: Course | null
 */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  if (USE_MOCK_API) {
    // TODO: Replace this mock implementation with a real fetch call:
    // const res = await fetch(`${API_BASE_URL}/api/courses/slug/${slug}`);
    // return res.json();

    await simulateNetworkDelay();
    return mockCourses.find(c => c.slug === slug) || null;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/courses/slug/${slug}`);
    if (!res.ok) return null;
    return res.json();
  }
}

/**
 * Get courses by mentor ID
 * 
 * Suggested endpoint: GET /api/mentors/:mentorId/courses
 * Response: Course[]
 */
export async function getCoursesByMentor(mentorId: string): Promise<Course[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return mockCourses.filter(c => c.mentorId === mentorId);
  } else {
    const res = await fetch(`${API_BASE_URL}/api/mentors/${mentorId}/courses`);
    if (!res.ok) throw new Error('Failed to fetch mentor courses');
    return res.json();
  }
}

/**
 * Create a new course
 * 
 * Suggested endpoint: POST /api/courses
 * Request body: Partial<Course>
 * Response: Course
 */
export async function createCourse(data: Partial<Course>): Promise<Course> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: data.title || 'New Course',
      slug: data.slug || `new-course-${Date.now()}`,
      description: data.description || '',
      longDescription: data.longDescription || '',
      thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
      price: data.price || 0,
      originalPrice: data.originalPrice || 0,
      duration: data.duration || '8 weeks',
      level: data.level || 'Beginner',
      category: data.category || 'General',
      mentorId: data.mentorId || '',
      totalStudents: 0,
      rating: 0,
      totalModules: 0,
      totalTopics: 0,
      status: 'upcoming',
      startDate: data.startDate || new Date().toISOString(),
      endDate: data.endDate || new Date().toISOString(),
      features: data.features || [],
      curriculum: data.curriculum || [],
      schedule: data.schedule || [],
    };

    mockCourses.push(newCourse);
    return newCourse;
  } else {
    const res = await fetch(`${API_BASE_URL}/api/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create course');
    return res.json();
  }
}

/**
 * Update a course
 * 
 * Suggested endpoint: PUT /api/courses/:id
 * Request body: Partial<Course>
 * Response: Course
 */
export async function updateCourse(id: string, data: Partial<Course>): Promise<Course> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const index = mockCourses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Course not found');

    mockCourses[index] = { ...mockCourses[index], ...data };
    return mockCourses[index];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update course');
    return res.json();
  }
}

/**
 * Delete a course
 * 
 * Suggested endpoint: DELETE /api/courses/:id
 * Response: { success: boolean }
 */
export async function deleteCourse(id: string): Promise<void> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    mockCourses = mockCourses.filter(c => c.id !== id);
  } else {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete course');
  }
}

/**
 * Update course curriculum
 * 
 * Suggested endpoint: PUT /api/courses/:id/curriculum
 * Request body: { modules: Module[] }
 * Response: Course
 */
export async function updateCourseCurriculum(id: string, modules: Module[]): Promise<Course> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();

    const index = mockCourses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Course not found');

    mockCourses[index] = {
      ...mockCourses[index],
      curriculum: modules,
      totalModules: modules.length,
      totalTopics: modules.reduce((acc, m) => acc + m.topics.length, 0),
    };
    return mockCourses[index];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}/curriculum`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modules }),
    });
    if (!res.ok) throw new Error('Failed to update curriculum');
    return res.json();
  }
}

/**
 * Get mentor by ID (helper for course pages)
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
 * Get all mentors
 * 
 * Suggested endpoint: GET /api/mentors
 * Response: Mentor[]
 */
export async function getAllMentors(): Promise<Mentor[]> {
  if (USE_MOCK_API) {
    // TODO: Replace with real fetch call
    await simulateNetworkDelay();
    return [...mentors];
  } else {
    const res = await fetch(`${API_BASE_URL}/api/mentors`);
    if (!res.ok) throw new Error('Failed to fetch mentors');
    return res.json();
  }
}
