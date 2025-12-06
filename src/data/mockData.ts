// Mock Data for Cohort-Based Learning Platform

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  college?: string;
  avatar?: string;
  role: 'student' | 'mentor' | 'admin';
  createdAt: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive?: string;
}

export interface Mentor extends User {
  role: 'mentor';
  bio: string;
  expertise: string[];
  experience: string;
  linkedIn?: string;
  assignedCourses: string[];
}

export interface Student extends User {
  role: 'student';
  enrolledCourses: string[];
  completedCourses: string[];
  paymentStatus: 'paid' | 'pending' | 'refunded';
}

export interface Admin extends User {
  role: 'admin';
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  price: number;
  originalPrice: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  mentorId: string;
  totalStudents: number;
  rating: number;
  totalModules: number;
  totalTopics: number;
  status: 'active' | 'upcoming' | 'completed' | 'paused';
  startDate: string;
  endDate: string;
  features: string[];
  curriculum: Module[];
  schedule: ClassSchedule[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  order: number;
}

export interface Topic {
  id: string;
  title: string;
  duration: string;
  order: number;
}

export interface ClassSchedule {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  meetingLink: string;
  status: 'upcoming' | 'live' | 'completed';
}

export interface Cohort {
  id: string;
  courseId: string;
  name: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  enrolledStudents: number;
  status: 'active' | 'upcoming' | 'completed';
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'expired' | 'disabled';
  applicableCourses: string[] | 'all';
}

// Mock Mentors
export const mentors: Mentor[] = [
  {
    id: 'mentor-1',
    email: 'sarah.chen@example.com',
    password: 'mentor123',
    name: 'Sarah Chen',
    phone: '+1 555-0101',
    city: 'San Francisco',
    state: 'California',
    country: 'USA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    role: 'mentor',
    bio: 'Full-stack developer with 10+ years of experience. Former tech lead at Google and startup founder. Passionate about teaching and helping developers grow.',
    expertise: ['React', 'Node.js', 'System Design', 'TypeScript'],
    experience: '10+ years',
    linkedIn: 'https://linkedin.com/in/sarahchen',
    assignedCourses: ['course-1', 'course-4'],
    createdAt: '2024-01-15',
    status: 'active',
    lastActive: '2024-12-01',
  },
  {
    id: 'mentor-2',
    email: 'david.kumar@example.com',
    password: 'mentor123',
    name: 'David Kumar',
    phone: '+1 555-0102',
    city: 'Austin',
    state: 'Texas',
    country: 'USA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    role: 'mentor',
    bio: 'Data scientist and ML engineer with expertise in Python, TensorFlow, and MLOps. Previously at Amazon AWS AI team.',
    expertise: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow'],
    experience: '8 years',
    linkedIn: 'https://linkedin.com/in/davidkumar',
    assignedCourses: ['course-2'],
    createdAt: '2024-02-01',
    status: 'active',
    lastActive: '2024-11-30',
  },
  {
    id: 'mentor-3',
    email: 'emily.rodriguez@example.com',
    password: 'mentor123',
    name: 'Emily Rodriguez',
    phone: '+1 555-0103',
    city: 'Seattle',
    state: 'Washington',
    country: 'USA',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    role: 'mentor',
    bio: 'Backend specialist with deep expertise in cloud architecture and DevOps. AWS certified solutions architect.',
    expertise: ['AWS', 'Docker', 'Kubernetes', 'Go'],
    experience: '7 years',
    linkedIn: 'https://linkedin.com/in/emilyrodriguez',
    assignedCourses: ['course-3', 'course-5'],
    createdAt: '2024-03-10',
    status: 'active',
    lastActive: '2024-12-01',
  },
];

// Mock Courses
export const courses: Course[] = [
  {
    id: 'course-1',
    title: 'Full-Stack Web Development Bootcamp',
    slug: 'full-stack-web-development',
    description: 'Master modern web development with React, Node.js, and PostgreSQL. Build real-world projects with industry best practices.',
    longDescription: 'This comprehensive bootcamp takes you from beginner to job-ready full-stack developer. Learn React for frontend, Node.js for backend, and PostgreSQL for databases. Work on 5+ real-world projects including an e-commerce platform and social media app.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
    price: 499,
    originalPrice: 799,
    duration: '12 weeks',
    level: 'Beginner',
    category: 'Web Development',
    mentorId: 'mentor-1',
    totalStudents: 156,
    rating: 4.8,
    totalModules: 6,
    totalTopics: 48,
    status: 'active',
    startDate: '2024-12-15',
    endDate: '2025-03-08',
    features: [
      '48 live sessions with mentor',
      '6 real-world projects',
      'Job placement assistance',
      'Certificate of completion',
      '1-on-1 code reviews',
      'Discord community access',
    ],
    curriculum: [
      {
        id: 'mod-1',
        title: 'HTML, CSS & JavaScript Fundamentals',
        description: 'Build a strong foundation in web technologies',
        order: 1,
        topics: [
          { id: 't1', title: 'HTML5 Semantic Elements', duration: '2 hours', order: 1 },
          { id: 't2', title: 'CSS Flexbox & Grid', duration: '3 hours', order: 2 },
          { id: 't3', title: 'JavaScript ES6+ Features', duration: '4 hours', order: 3 },
          { id: 't4', title: 'DOM Manipulation', duration: '2 hours', order: 4 },
        ],
      },
      {
        id: 'mod-2',
        title: 'React Fundamentals',
        description: 'Learn modern React with hooks and context',
        order: 2,
        topics: [
          { id: 't5', title: 'Components & JSX', duration: '2 hours', order: 1 },
          { id: 't6', title: 'State Management with Hooks', duration: '3 hours', order: 2 },
          { id: 't7', title: 'React Router', duration: '2 hours', order: 3 },
          { id: 't8', title: 'Context API & State Patterns', duration: '3 hours', order: 4 },
        ],
      },
      {
        id: 'mod-3',
        title: 'Backend with Node.js',
        description: 'Build robust APIs with Express and Node.js',
        order: 3,
        topics: [
          { id: 't9', title: 'Node.js Fundamentals', duration: '2 hours', order: 1 },
          { id: 't10', title: 'Express.js REST APIs', duration: '4 hours', order: 2 },
          { id: 't11', title: 'Authentication & Authorization', duration: '3 hours', order: 3 },
          { id: 't12', title: 'Error Handling & Middleware', duration: '2 hours', order: 4 },
        ],
      },
    ],
    schedule: [
      { id: 's1', title: 'Week 1: HTML & CSS Deep Dive', date: '2024-12-15', time: '10:00 AM', duration: '2 hours', meetingLink: 'https://meet.google.com/abc-defg-hij', status: 'upcoming' },
      { id: 's2', title: 'Week 1: JavaScript Fundamentals', date: '2024-12-17', time: '10:00 AM', duration: '2 hours', meetingLink: 'https://meet.google.com/abc-defg-hij', status: 'upcoming' },
    ],
  },
  {
    id: 'course-2',
    title: 'Machine Learning & AI Fundamentals',
    slug: 'machine-learning-ai-fundamentals',
    description: 'Learn machine learning from scratch. Master Python, scikit-learn, and TensorFlow with hands-on projects.',
    longDescription: 'Dive deep into the world of AI and machine learning. This course covers everything from basic statistics to advanced neural networks. Build 8 ML projects including image classification, sentiment analysis, and recommendation systems.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop',
    price: 599,
    originalPrice: 999,
    duration: '10 weeks',
    level: 'Intermediate',
    category: 'Data Science',
    mentorId: 'mentor-2',
    totalStudents: 89,
    rating: 4.9,
    totalModules: 5,
    totalTopics: 40,
    status: 'active',
    startDate: '2025-01-06',
    endDate: '2025-03-15',
    features: [
      '40 live sessions',
      '8 ML projects',
      'GPU cloud credits included',
      'Certificate of completion',
      'Career mentorship',
      'Kaggle competition prep',
    ],
    curriculum: [
      {
        id: 'mod-1',
        title: 'Python for Data Science',
        description: 'Master Python fundamentals for ML',
        order: 1,
        topics: [
          { id: 't1', title: 'NumPy & Pandas', duration: '3 hours', order: 1 },
          { id: 't2', title: 'Data Visualization', duration: '2 hours', order: 2 },
          { id: 't3', title: 'Statistical Analysis', duration: '3 hours', order: 3 },
        ],
      },
      {
        id: 'mod-2',
        title: 'Machine Learning Basics',
        description: 'Core ML algorithms and concepts',
        order: 2,
        topics: [
          { id: 't4', title: 'Supervised Learning', duration: '4 hours', order: 1 },
          { id: 't5', title: 'Unsupervised Learning', duration: '3 hours', order: 2 },
          { id: 't6', title: 'Model Evaluation', duration: '2 hours', order: 3 },
        ],
      },
    ],
    schedule: [],
  },
  {
    id: 'course-3',
    title: 'Cloud Architecture & DevOps',
    slug: 'cloud-architecture-devops',
    description: 'Master AWS, Docker, Kubernetes, and CI/CD pipelines. Become a certified cloud professional.',
    longDescription: 'Learn to design, deploy, and manage scalable cloud infrastructure. This course covers AWS services, containerization with Docker, orchestration with Kubernetes, and modern DevOps practices.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
    price: 549,
    originalPrice: 899,
    duration: '8 weeks',
    level: 'Intermediate',
    category: 'Cloud Computing',
    mentorId: 'mentor-3',
    totalStudents: 67,
    rating: 4.7,
    totalModules: 4,
    totalTopics: 32,
    status: 'upcoming',
    startDate: '2025-01-20',
    endDate: '2025-03-15',
    features: [
      '32 live sessions',
      'AWS free tier included',
      'Real deployment projects',
      'Certificate of completion',
      'Interview preparation',
      '24/7 Discord support',
    ],
    curriculum: [
      {
        id: 'mod-1',
        title: 'AWS Fundamentals',
        description: 'Core AWS services and best practices',
        order: 1,
        topics: [
          { id: 't1', title: 'EC2 & VPC', duration: '3 hours', order: 1 },
          { id: 't2', title: 'S3 & CloudFront', duration: '2 hours', order: 2 },
          { id: 't3', title: 'RDS & DynamoDB', duration: '3 hours', order: 3 },
        ],
      },
    ],
    schedule: [],
  },
  {
    id: 'course-4',
    title: 'Advanced React & TypeScript',
    slug: 'advanced-react-typescript',
    description: 'Take your React skills to the next level with TypeScript, testing, and advanced patterns.',
    longDescription: 'This advanced course is designed for developers who already know React basics. Master TypeScript integration, testing strategies, performance optimization, and advanced architectural patterns.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    price: 399,
    originalPrice: 599,
    duration: '6 weeks',
    level: 'Advanced',
    category: 'Web Development',
    mentorId: 'mentor-1',
    totalStudents: 45,
    rating: 4.9,
    totalModules: 4,
    totalTopics: 24,
    status: 'active',
    startDate: '2024-12-01',
    endDate: '2025-01-12',
    features: [
      '24 live sessions',
      'Code review sessions',
      'Open source contribution',
      'Certificate of completion',
      'Portfolio projects',
    ],
    curriculum: [],
    schedule: [],
  },
  {
    id: 'course-5',
    title: 'System Design Masterclass',
    slug: 'system-design-masterclass',
    description: 'Learn to design scalable systems. Perfect preparation for senior engineering interviews.',
    longDescription: 'Master the art of designing large-scale distributed systems. Learn from real-world case studies of companies like Netflix, Uber, and Twitter. Perfect for interview preparation.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    price: 449,
    originalPrice: 699,
    duration: '8 weeks',
    level: 'Advanced',
    category: 'System Design',
    mentorId: 'mentor-3',
    totalStudents: 78,
    rating: 4.8,
    totalModules: 5,
    totalTopics: 30,
    status: 'upcoming',
    startDate: '2025-02-01',
    endDate: '2025-03-29',
    features: [
      '30 live sessions',
      'Mock interviews',
      'Real case studies',
      'Certificate of completion',
      'Interview strategies',
    ],
    curriculum: [],
    schedule: [],
  },
];

// Mock Students
export const students: Student[] = [
  {
    id: 'student-1',
    email: 'john.doe@example.com',
    password: 'student123',
    name: 'John Doe',
    phone: '+1 555-0201',
    city: 'New York',
    state: 'New York',
    country: 'USA',
    college: 'NYU',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    role: 'student',
    enrolledCourses: ['course-1'],
    completedCourses: [],
    paymentStatus: 'paid',
    createdAt: '2024-10-15',
    status: 'active',
    lastActive: '2024-12-01',
  },
  {
    id: 'student-2',
    email: 'jane.smith@example.com',
    password: 'student123',
    name: 'Jane Smith',
    phone: '+1 555-0202',
    city: 'Los Angeles',
    state: 'California',
    country: 'USA',
    college: 'UCLA',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    role: 'student',
    enrolledCourses: ['course-1', 'course-2'],
    completedCourses: [],
    paymentStatus: 'paid',
    createdAt: '2024-10-20',
    status: 'active',
    lastActive: '2024-11-30',
  },
  {
    id: 'student-3',
    email: 'mike.johnson@example.com',
    password: 'student123',
    name: 'Mike Johnson',
    phone: '+1 555-0203',
    city: 'Chicago',
    state: 'Illinois',
    country: 'USA',
    college: 'University of Chicago',
    role: 'student',
    enrolledCourses: ['course-2'],
    completedCourses: ['course-4'],
    paymentStatus: 'paid',
    createdAt: '2024-09-01',
    status: 'active',
    lastActive: '2024-11-28',
  },
];

// Mock Admin
export const admins: Admin[] = [
  {
    id: 'admin-1',
    email: 'admin@learnhub.com',
    password: 'admin123',
    name: 'Admin User',
    phone: '+1 555-0001',
    city: 'San Francisco',
    state: 'California',
    country: 'USA',
    role: 'admin',
    createdAt: '2024-01-01',
    status: 'active',
    lastActive: '2024-12-01',
  },
];

// Mock Coupons
export const coupons: Coupon[] = [
  {
    id: 'coupon-1',
    code: 'LAUNCH50',
    type: 'percentage',
    value: 50,
    validFrom: '2024-11-01',
    validUntil: '2024-12-31',
    usageLimit: 100,
    usedCount: 45,
    status: 'active',
    applicableCourses: 'all',
  },
  {
    id: 'coupon-2',
    code: 'FLAT100',
    type: 'flat',
    value: 100,
    validFrom: '2024-11-15',
    validUntil: '2025-01-15',
    usageLimit: 50,
    usedCount: 12,
    status: 'active',
    applicableCourses: ['course-1', 'course-2'],
  },
  {
    id: 'coupon-3',
    code: 'EXPIRED20',
    type: 'percentage',
    value: 20,
    validFrom: '2024-09-01',
    validUntil: '2024-10-31',
    usageLimit: 100,
    usedCount: 78,
    status: 'expired',
    applicableCourses: 'all',
  },
];

// Mock Cohorts
export const cohorts: Cohort[] = [
  {
    id: 'cohort-1',
    courseId: 'course-1',
    name: 'Full-Stack Dec 2024',
    startDate: '2024-12-15',
    endDate: '2025-03-08',
    maxStudents: 30,
    enrolledStudents: 24,
    status: 'upcoming',
  },
  {
    id: 'cohort-2',
    courseId: 'course-2',
    name: 'ML Jan 2025',
    startDate: '2025-01-06',
    endDate: '2025-03-15',
    maxStudents: 25,
    enrolledStudents: 18,
    status: 'upcoming',
  },
];

// Helper functions
export const getMentorById = (id: string): Mentor | undefined => 
  mentors.find(m => m.id === id);

export const getCourseById = (id: string): Course | undefined => 
  courses.find(c => c.id === id);

export const getCourseBySlug = (slug: string): Course | undefined => 
  courses.find(c => c.slug === slug);

export const getStudentById = (id: string): Student | undefined => 
  students.find(s => s.id === id);

export const getCouponByCode = (code: string): Coupon | undefined => 
  coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
