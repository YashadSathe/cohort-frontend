import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Video,
  FileText,
  Award,
  Clock,
  ArrowRight,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { courses, getCourseById } from '@/data/mockData';
import { notifications, studentProgress, assignments, getProgressByCourse } from '@/data/studentMockData';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get enrolled courses (mock: first 2 courses)
  const enrolledCourses = courses.slice(0, 2);
  
  // Get upcoming class (mock)
  const upcomingClass = {
    courseTitle: 'Full-Stack Web Development',
    sessionTitle: 'Week 1: HTML & CSS Deep Dive',
    date: 'Dec 15, 2024',
    time: '10:00 AM',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
  };

  // Get recent notifications
  const recentNotifications = notifications.slice(0, 3);

  // Get pending assignments
  const pendingAssignments = assignments.filter(a => a.status === 'not-submitted' || a.status === 'rejected');

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your courses today.
          </p>
        </div>
        <Button onClick={() => navigate('/courses')} className="gradient-primary border-0">
          Browse More Courses
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{enrolledCourses.length}</p>
              <p className="text-sm text-muted-foreground">Enrolled Courses</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Video className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">4</p>
              <p className="text-sm text-muted-foreground">Classes Attended</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingAssignments.length}</p>
              <p className="text-sm text-muted-foreground">Pending Tasks</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-muted-foreground">Certificates</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Class */}
          <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Next Live Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-lg">{upcomingClass.sessionTitle}</p>
                  <p className="text-sm text-muted-foreground">{upcomingClass.courseTitle}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {upcomingClass.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {upcomingClass.time}
                    </span>
                  </div>
                </div>
                <Button className="gradient-primary border-0">
                  Join Class
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enrolled Courses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Courses</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/student/courses')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrolledCourses.map((course) => {
                const progress = getProgressByCourse(course.id);
                const progressPercent = progress 
                  ? Math.round((progress.completedTopics.length / progress.totalTopics) * 100)
                  : 0;
                
                return (
                  <div
                    key={course.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => navigate(`/student/courses/${course.id}`)}
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-20 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.duration}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{progressPercent}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Pending Assignments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Assignments</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/student/assignments')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {pendingAssignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-success" />
                  <p>All caught up! No pending assignments.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingAssignments.map((assignment) => {
                    const course = getCourseById(assignment.courseId);
                    const isOverdue = new Date(assignment.dueDate) < new Date();
                    
                    return (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => navigate(`/student/assignments/${assignment.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            assignment.status === 'rejected' ? 'bg-destructive/10' : 'bg-warning/10'
                          }`}>
                            {assignment.status === 'rejected' ? (
                              <AlertCircle className="w-5 h-5 text-destructive" />
                            ) : (
                              <FileText className="w-5 h-5 text-warning" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{assignment.title}</p>
                            <p className="text-sm text-muted-foreground">{course?.title}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={isOverdue ? 'destructive' : assignment.status === 'rejected' ? 'destructive' : 'secondary'}>
                            {assignment.status === 'rejected' ? 'Needs Revision' : isOverdue ? 'Overdue' : 'Pending'}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            Due {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/student/notifications')}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    notif.read ? 'bg-muted/30' : 'bg-primary/5 border border-primary/20'
                  }`}
                  onClick={() => notif.link && navigate(notif.link)}
                >
                  <div className="flex items-start gap-2">
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    )}
                    <div className={notif.read ? 'ml-4' : ''}>
                      <p className="font-medium text-sm">{notif.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/student/classes')}
              >
                <Video className="w-4 h-4 mr-2" /> View Schedule
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/student/certificates')}
              >
                <Award className="w-4 h-4 mr-2" /> My Certificates
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/student/profile')}
              >
                <FileText className="w-4 h-4 mr-2" /> Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
