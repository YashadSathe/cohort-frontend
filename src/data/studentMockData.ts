// Additional mock data for Student Portal

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string;
  status: 'not-submitted' | 'submitted' | 'approved' | 'rejected';
  submissionUrl?: string;
  submittedAt?: string;
  feedback?: string;
}

export interface Notification {
  id: string;
  type: 'class' | 'assignment' | 'announcement' | 'certificate';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface StudentProgress {
  courseId: string;
  completedTopics: string[];
  totalTopics: number;
  attendedClasses: number;
  totalClasses: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  certificateStatus: 'locked' | 'eligible' | 'issued';
  certificateIssuedAt?: string;
}

export interface Payment {
  id: string;
  courseId: string;
  amount: number;
  discount: number;
  couponCode?: string;
  status: 'pending' | 'completed' | 'refunded';
  paidAt?: string;
  method?: string;
}

// Mock Assignments
export const assignments: Assignment[] = [
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
- At least one JavaScript interaction (e.g., mobile menu, form validation)
- Optimize images for web

### Submission:
Submit the GitHub repository URL or CodePen/CodeSandbox link.`,
    dueDate: '2024-12-20',
    status: 'not-submitted',
  },
  {
    id: 'assign-2',
    courseId: 'course-1',
    title: 'React Todo Application',
    description: 'Build a todo app with React hooks, state management, and local storage.',
    instructions: `## Assignment Instructions

Build a Todo application with the following features:

1. Add new todos
2. Mark todos as complete
3. Delete todos
4. Filter todos (All, Active, Completed)
5. Persist todos to localStorage

### Technical Requirements:
- Use React functional components
- Use useState and useEffect hooks
- Style with CSS or Tailwind CSS

Submit your GitHub repository URL.`,
    dueDate: '2024-12-25',
    status: 'submitted',
    submissionUrl: 'https://github.com/johndoe/react-todo-app',
    submittedAt: '2024-12-18',
  },
  {
    id: 'assign-3',
    courseId: 'course-1',
    title: 'REST API with Express',
    description: 'Create a RESTful API for a blog application with CRUD operations.',
    instructions: `## Assignment Instructions

Build a REST API for a blog with:
- Posts (CRUD operations)
- Comments (CRUD operations)
- User authentication (JWT)

Submit your GitHub repository URL.`,
    dueDate: '2025-01-05',
    status: 'approved',
    submissionUrl: 'https://github.com/johndoe/blog-api',
    submittedAt: '2024-12-15',
    feedback: 'Excellent work! Clean code structure and proper error handling. Well done!',
  },
  {
    id: 'assign-4',
    courseId: 'course-2',
    title: 'Data Analysis with Pandas',
    description: 'Analyze a real-world dataset using Pandas and create visualizations.',
    instructions: `Analyze the provided dataset and create at least 5 meaningful visualizations.`,
    dueDate: '2025-01-10',
    status: 'rejected',
    submissionUrl: 'https://github.com/janesmith/pandas-analysis',
    submittedAt: '2024-12-20',
    feedback: 'Good start, but missing the correlation analysis. Please revise and resubmit.',
  },
];

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'class',
    title: 'Live Class Tomorrow',
    message: 'Don\'t forget! "HTML & CSS Deep Dive" class is scheduled for tomorrow at 10:00 AM.',
    timestamp: '2024-12-01T10:00:00Z',
    read: false,
    link: '/student/courses/course-1/classes',
  },
  {
    id: 'notif-2',
    type: 'assignment',
    title: 'Assignment Approved',
    message: 'Your "REST API with Express" assignment has been approved! Great work!',
    timestamp: '2024-11-30T15:30:00Z',
    read: false,
    link: '/student/courses/course-1/assignments/assign-3',
  },
  {
    id: 'notif-3',
    type: 'announcement',
    title: 'Holiday Schedule',
    message: 'Classes will be paused from Dec 24-26 for the holidays. Happy holidays!',
    timestamp: '2024-11-28T09:00:00Z',
    read: true,
  },
  {
    id: 'notif-4',
    type: 'assignment',
    title: 'Assignment Due Soon',
    message: '"Build a Responsive Landing Page" is due in 3 days. Don\'t forget to submit!',
    timestamp: '2024-11-27T12:00:00Z',
    read: true,
    link: '/student/courses/course-1/assignments/assign-1',
  },
  {
    id: 'notif-5',
    type: 'certificate',
    title: 'Certificate Available',
    message: 'Congratulations! Your certificate for "Advanced React" is ready to download.',
    timestamp: '2024-11-25T14:00:00Z',
    read: true,
    link: '/student/certificates',
  },
];

// Mock Student Progress
export const studentProgress: StudentProgress[] = [
  {
    courseId: 'course-1',
    completedTopics: ['t1', 't2', 't3', 't4', 't5', 't6'],
    totalTopics: 12,
    attendedClasses: 4,
    totalClasses: 8,
    assignmentsCompleted: 1,
    totalAssignments: 3,
    certificateStatus: 'locked',
  },
  {
    courseId: 'course-4',
    completedTopics: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12'],
    totalTopics: 12,
    attendedClasses: 12,
    totalClasses: 12,
    assignmentsCompleted: 4,
    totalAssignments: 4,
    certificateStatus: 'issued',
    certificateIssuedAt: '2024-11-20',
  },
];

// Mock Payments
export const payments: Payment[] = [
  {
    id: 'payment-1',
    courseId: 'course-1',
    amount: 499,
    discount: 250,
    couponCode: 'LAUNCH50',
    status: 'completed',
    paidAt: '2024-10-15',
    method: 'Credit Card',
  },
  {
    id: 'payment-2',
    courseId: 'course-4',
    amount: 399,
    discount: 0,
    status: 'completed',
    paidAt: '2024-09-01',
    method: 'Credit Card',
  },
];

// Helper functions
export const getAssignmentsByCourse = (courseId: string): Assignment[] =>
  assignments.filter(a => a.courseId === courseId);

export const getAssignmentById = (id: string): Assignment | undefined =>
  assignments.find(a => a.id === id);

export const getProgressByCourse = (courseId: string): StudentProgress | undefined =>
  studentProgress.find(p => p.courseId === courseId);

export const getUnreadNotificationsCount = (): number =>
  notifications.filter(n => !n.read).length;
