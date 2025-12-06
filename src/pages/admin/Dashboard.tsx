import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  GraduationCap,
  BookOpen,
  IndianRupee,
  TrendingUp,
  Award,
  Activity,
} from 'lucide-react';
import { systemStats, recentActivity } from '@/data/adminMockData';
import { students, mentors, courses } from '@/data/mockData';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Students',
      value: systemStats.totalStudents.toLocaleString(),
      change: '+12%',
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Active Mentors',
      value: systemStats.totalMentors,
      change: '+3',
      icon: GraduationCap,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Total Courses',
      value: systemStats.totalCourses,
      change: '+2',
      icon: BookOpen,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      title: 'Total Revenue',
      value: `₹${(systemStats.totalRevenue / 100000).toFixed(1)}L`,
      change: '+18%',
      icon: IndianRupee,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <Badge variant="secondary" className="text-success">
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Engagement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Active Enrollments</p>
                <p className="text-2xl font-bold">{systemStats.activeEnrollments}</p>
              </div>
              <Activity className="w-8 h-8 text-primary/50" />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{systemStats.completionRate}%</p>
              </div>
              <Award className="w-8 h-8 text-success/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">{mentors.length}</p>
                <p className="text-xs text-muted-foreground">Registered Mentors</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-accent">{courses.length}</p>
                <p className="text-xs text-muted-foreground">Published Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user}
                      {activity.course && ` • ${activity.course}`}
                      {activity.assignment && ` • ${activity.assignment}`}
                      {activity.amount && ` • ${activity.amount}`}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Course
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Mentor
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    Enrollments
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    Rating
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.slice(0, 5).map((course) => {
                  const mentor = mentors.find((m) => m.id === course.mentorId);
                  return (
                    <tr key={course.id} className="border-b border-border/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span className="font-medium text-sm">{course.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {mentor?.name || 'Unknown'}
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {course.totalStudents}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="secondary">{course.rating} ⭐</Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-medium">
                        ₹{((course.price * course.totalStudents) / 1000).toFixed(0)}K
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
