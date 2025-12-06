// Additional mock data for Mentor Portal

export interface MentorAssignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string;
  createdAt: string;
  status: 'draft' | 'published';
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  submissionUrl: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
}

export interface MentorSession {
  id: string;
  courseId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  meetingLink: string;
  reminderTiming: string[];
  status: 'scheduled' | 'completed' | 'cancelled' | 'live';
  createdAt: string;
}

export interface CohortStudent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
  attendedClasses: number;
  totalClasses: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  certificateStatus: 'locked' | 'eligible' | 'issued';
  lastActive: string;
}

// Mock Sessions
export const mentorSessions: MentorSession[] = [
  {
    id: 'session-1',
    courseId: 'course-1',
    title: 'Week 1: HTML & CSS Deep Dive',
    description: 'Introduction to semantic HTML and CSS layouts',
    date: '2024-12-15',
    time: '10:00 AM',
    duration: '2 hours',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    reminderTiming: ['1 week', '1 day', '1 hour'],
    status: 'scheduled',
    createdAt: '2024-12-01',
  },
  {
    id: 'session-2',
    courseId: 'course-1',
    title: 'Week 1: JavaScript Fundamentals',
    description: 'ES6+ features and DOM manipulation',
    date: '2024-12-17',
    time: '10:00 AM',
    duration: '2 hours',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    reminderTiming: ['1 day', '1 hour'],
    status: 'scheduled',
    createdAt: '2024-12-01',
  },
  {
    id: 'session-3',
    courseId: 'course-1',
    title: 'Introduction to Web Development',
    description: 'Course overview and setup',
    date: '2024-12-10',
    time: '10:00 AM',
    duration: '2 hours',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    reminderTiming: ['1 day'],
    status: 'completed',
    createdAt: '2024-11-25',
  },
];

// Mock Assignments for Mentor
export const mentorAssignments: MentorAssignment[] = [
  {
    id: 'assign-1',
    courseId: 'course-1',
    title: 'Build a Responsive Landing Page',
    description: 'Create a fully responsive landing page using HTML, CSS, and JavaScript.',
    instructions: `## Assignment Instructions

1. Create a landing page for a fictional product or service
2. The page must be fully responsive (mobile, tablet, desktop)
3. Include the following sections:
   - Hero section with CTA
   - Features section (at least 3 features)
   - Testimonials section
   - Footer with links

### Requirements:
- Use semantic HTML5 elements
- CSS Flexbox or Grid for layout
- At least one JavaScript interaction

### Submission:
Submit the GitHub repository URL or CodePen/CodeSandbox link.`,
    dueDate: '2024-12-20',
    createdAt: '2024-12-01',
    status: 'published',
  },
  {
    id: 'assign-2',
    courseId: 'course-1',
    title: 'React Todo Application',
    description: 'Build a todo app with React hooks, state management, and local storage.',
    instructions: `Build a Todo application with the following features...`,
    dueDate: '2024-12-25',
    createdAt: '2024-12-05',
    status: 'published',
  },
  {
    id: 'assign-3',
    courseId: 'course-1',
    title: 'REST API with Express',
    description: 'Create a RESTful API for a blog application.',
    instructions: `Build a REST API for a blog...`,
    dueDate: '2025-01-05',
    createdAt: '2024-12-10',
    status: 'draft',
  },
];

// Mock Student Submissions
export const studentSubmissions: StudentSubmission[] = [
  {
    id: 'sub-1',
    assignmentId: 'assign-1',
    studentId: 'student-1',
    studentName: 'John Doe',
    studentEmail: 'john.doe@example.com',
    studentAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    submissionUrl: 'https://github.com/johndoe/landing-page',
    submittedAt: '2024-12-18T14:30:00Z',
    status: 'pending',
  },
  {
    id: 'sub-2',
    assignmentId: 'assign-1',
    studentId: 'student-2',
    studentName: 'Jane Smith',
    studentEmail: 'jane.smith@example.com',
    studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    submissionUrl: 'https://github.com/janesmith/responsive-landing',
    submittedAt: '2024-12-17T10:15:00Z',
    status: 'approved',
    feedback: 'Excellent work! Clean code and great responsive design.',
  },
  {
    id: 'sub-3',
    assignmentId: 'assign-2',
    studentId: 'student-2',
    studentName: 'Jane Smith',
    studentEmail: 'jane.smith@example.com',
    studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    submissionUrl: 'https://github.com/janesmith/react-todo',
    submittedAt: '2024-12-20T09:00:00Z',
    status: 'pending',
  },
  {
    id: 'sub-4',
    assignmentId: 'assign-1',
    studentId: 'student-3',
    studentName: 'Mike Johnson',
    studentEmail: 'mike.johnson@example.com',
    submissionUrl: 'https://github.com/mikej/landing-v1',
    submittedAt: '2024-12-19T16:45:00Z',
    status: 'rejected',
    feedback: 'Good attempt, but missing the testimonials section. Please revise and resubmit.',
  },
];

// Mock Cohort Students
export const cohortStudents: CohortStudent[] = [
  {
    id: 'student-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    courseId: 'course-1',
    enrolledAt: '2024-10-15',
    progress: 50,
    attendedClasses: 4,
    totalClasses: 8,
    assignmentsCompleted: 1,
    totalAssignments: 3,
    certificateStatus: 'locked',
    lastActive: '2024-12-01',
  },
  {
    id: 'student-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    courseId: 'course-1',
    enrolledAt: '2024-10-20',
    progress: 75,
    attendedClasses: 6,
    totalClasses: 8,
    assignmentsCompleted: 2,
    totalAssignments: 3,
    certificateStatus: 'locked',
    lastActive: '2024-12-01',
  },
  {
    id: 'student-3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    courseId: 'course-1',
    enrolledAt: '2024-09-01',
    progress: 100,
    attendedClasses: 8,
    totalClasses: 8,
    assignmentsCompleted: 3,
    totalAssignments: 3,
    certificateStatus: 'eligible',
    lastActive: '2024-11-28',
  },
  {
    id: 'student-4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    courseId: 'course-4',
    enrolledAt: '2024-10-25',
    progress: 30,
    attendedClasses: 2,
    totalClasses: 8,
    assignmentsCompleted: 0,
    totalAssignments: 3,
    certificateStatus: 'locked',
    lastActive: '2024-11-25',
  },
  {
    id: 'student-5',
    name: 'Alex Wilson',
    email: 'alex.wilson@example.com',
    courseId: 'course-1',
    enrolledAt: '2024-10-18',
    progress: 100,
    attendedClasses: 8,
    totalClasses: 8,
    assignmentsCompleted: 3,
    totalAssignments: 3,
    certificateStatus: 'issued',
    lastActive: '2024-12-01',
  },
];

// Helper functions
export const getSessionsByCourse = (courseId: string) =>
  mentorSessions.filter(s => s.courseId === courseId);

export const getAssignmentsByCourse = (courseId: string) =>
  mentorAssignments.filter(a => a.courseId === courseId);

export const getSubmissionsByAssignment = (assignmentId: string) =>
  studentSubmissions.filter(s => s.assignmentId === assignmentId);

export const getPendingSubmissions = () =>
  studentSubmissions.filter(s => s.status === 'pending');

export const getStudentsByCohort = () => cohortStudents;

export const getEligibleStudents = () =>
  cohortStudents.filter(s => s.certificateStatus === 'eligible');
