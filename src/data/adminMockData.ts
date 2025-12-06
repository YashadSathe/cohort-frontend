// Admin-specific mock data

export interface SystemStats {
  totalStudents: number;
  totalMentors: number;
  totalCourses: number;
  totalRevenue: number;
  activeEnrollments: number;
  completionRate: number;
}

export interface MentorInvitation {
  id: string;
  email: string;
  name: string;
  status: 'pending' | 'accepted' | 'expired';
  invitedAt: string;
  expiresAt: string;
}

export interface SystemSetting {
  key: string;
  value: string;
  label: string;
  description: string;
  type: 'text' | 'number' | 'boolean' | 'email';
}

export const systemStats: SystemStats = {
  totalStudents: 1247,
  totalMentors: 23,
  totalCourses: 12,
  totalRevenue: 2458900,
  activeEnrollments: 892,
  completionRate: 78.5,
};

export const mentorInvitations: MentorInvitation[] = [
  {
    id: 'inv-1',
    email: 'david.wilson@example.com',
    name: 'David Wilson',
    status: 'pending',
    invitedAt: '2024-01-10',
    expiresAt: '2024-01-17',
  },
  {
    id: 'inv-2',
    email: 'emma.brown@example.com',
    name: 'Emma Brown',
    status: 'accepted',
    invitedAt: '2024-01-05',
    expiresAt: '2024-01-12',
  },
  {
    id: 'inv-3',
    email: 'alex.johnson@example.com',
    name: 'Alex Johnson',
    status: 'expired',
    invitedAt: '2023-12-20',
    expiresAt: '2023-12-27',
  },
];

export const systemSettings: SystemSetting[] = [
  {
    key: 'platform_name',
    value: 'LearnHub',
    label: 'Platform Name',
    description: 'The name displayed across the platform',
    type: 'text',
  },
  {
    key: 'support_email',
    value: 'support@learnhub.com',
    label: 'Support Email',
    description: 'Email address for student support inquiries',
    type: 'email',
  },
  {
    key: 'max_cohort_size',
    value: '50',
    label: 'Max Cohort Size',
    description: 'Maximum number of students per cohort',
    type: 'number',
  },
  {
    key: 'allow_registrations',
    value: 'true',
    label: 'Allow New Registrations',
    description: 'Enable or disable new student registrations',
    type: 'boolean',
  },
  {
    key: 'certificate_prefix',
    value: 'LH',
    label: 'Certificate Prefix',
    description: 'Prefix for certificate serial numbers',
    type: 'text',
  },
  {
    key: 'session_reminder_hours',
    value: '24',
    label: 'Session Reminder (Hours)',
    description: 'Hours before a session to send reminder emails',
    type: 'number',
  },
];

export const recentActivity = [
  { id: 1, action: 'New student registered', user: 'Mike Chen', time: '5 minutes ago' },
  { id: 2, action: 'Course enrollment', user: 'Sarah Lee', course: 'Full Stack Web Development', time: '12 minutes ago' },
  { id: 3, action: 'Assignment submitted', user: 'John Doe', assignment: 'Build REST API', time: '25 minutes ago' },
  { id: 4, action: 'Certificate issued', user: 'Emily Wang', course: 'Data Science Fundamentals', time: '1 hour ago' },
  { id: 5, action: 'Payment received', user: 'Alex Kim', amount: '₹14,999', time: '2 hours ago' },
];
