import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Users,
  FileText,
  Video,
  Award,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getMentorDashboard, 
  getMentorSessions, 
  updateSession,
  getCohortStudents,
  getPendingSubmissions,
} from '@/services/api';
import type { MentorSession, CohortStudent, StudentSubmission, Course } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';
import { MentorDashboardSkeleton } from '@/components/skeletons/DashboardSkeletons';

export default function MentorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<StudentSubmission[]>([]);
  const [cohortStudents, setCohortStudents] = useState<CohortStudent[]>([]);
  const [eligibleCount, setEligibleCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      try {
        const [dashboardData, sessionsData, studentsData, submissionsData] = await Promise.all([
          getMentorDashboard(user.id),
          getMentorSessions(user.id),
          getCohortStudents(user.id),
          getPendingSubmissions(user.id),
        ]);

        setAssignedCourses(dashboardData.assignedCourses);
        setSessions(sessionsData);
        setCohortStudents(studentsData);
        setPendingSubmissions(submissionsData);
        setEligibleCount(studentsData.filter(s => s.certificateStatus === 'eligible').length);
      } catch (error) {
        console.error('Error fetching mentor dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled');
  const liveSessions = sessions.filter(s => s.status === 'live');
  const totalStudents = cohortStudents.length;
  const activeStudents = cohortStudents.filter(s => {
    const lastActive = new Date(s.lastActive);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return lastActive >= weekAgo;
  }).length;

  const handleStartSession = async (sessionId: string) => {
    try {
      await updateSession(sessionId, { status: 'live' });
      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId ? { ...s, status: 'live' as const } : s
        )
      );
      toast({
        title: 'Session Started',
        description: 'Your live session is now active. Students can join.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start session.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <MentorDashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome, {user?.name?.split(' ')[0] || 'Mentor'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your courses and students.
          </p>
        </div>
        <Button onClick={() => navigate('/mentor/sessions')} className="gradient-primary border-0">
          Schedule New Session
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
              <p className="text-2xl font-bold">{assignedCourses.length}</p>
              <p className="text-sm text-muted-foreground">Courses</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalStudents}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingSubmissions.length}</p>
              <p className="text-sm text-muted-foreground">Pending Reviews</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{eligibleCount}</p>
              <p className="text-sm text-muted-foreground">Pending Certs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Session Alert */}
          {liveSessions.length > 0 && (
            <Card className="border-success/30 bg-gradient-to-r from-success/10 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-success animate-pulse" />
                  Live Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                {liveSessions.map((session) => (
                  <div key={session.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-lg">{session.title}</p>
                      <p className="text-sm text-muted-foreground">{session.description}</p>
                    </div>
                    <Button className="bg-success hover:bg-success/90 gap-2">
                      Join Session <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Next Session */}
          {upcomingSessions.length > 0 && (
            <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" />
                  Next Live Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-lg">{upcomingSessions[0].title}</p>
                    <p className="text-sm text-muted-foreground">{upcomingSessions[0].description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(upcomingSessions[0].date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {upcomingSessions[0].time}
                      </span>
                    </div>
                  </div>
                  <Button 
                    className="gradient-primary border-0"
                    onClick={() => handleStartSession(upcomingSessions[0].id)}
                  >
                    Start Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending Submissions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Pending Reviews
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/mentor/submissions')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {pendingSubmissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-success" />
                  <p>All submissions reviewed!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingSubmissions.slice(0, 3).map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => navigate('/mentor/submissions')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium">{submission.studentName}</p>
                          <p className="text-sm text-muted-foreground">
                            Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Review</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned Courses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Courses</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/mentor/courses')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignedCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => navigate(`/mentor/courses/${course.id}`)}
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-20 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.totalStudents} students enrolled</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                        {course.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Starts {new Date(course.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active this week</span>
                <span className="font-semibold">{activeStudents}/{totalStudents}</span>
              </div>
              <Progress value={totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0} className="h-2" />
              
              <div className="pt-4 space-y-3">
                <p className="text-sm font-medium">Recent Activity</p>
                {cohortStudents.slice(0, 3).map((student) => (
                  <div key={student.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {student.avatar ? (
                        <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-medium">{student.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.progress}% complete</p>
                    </div>
                  </div>
                ))}
              </div>
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
                onClick={() => navigate('/mentor/sessions')}
              >
                <Video className="w-4 h-4 mr-2" /> Schedule Session
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/mentor/assignments')}
              >
                <FileText className="w-4 h-4 mr-2" /> Create Assignment
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/mentor/certificates')}
              >
                <Award className="w-4 h-4 mr-2" /> Issue Certificates
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/mentor/communication')}
              >
                <Users className="w-4 h-4 mr-2" /> Email Students
              </Button>
            </CardContent>
          </Card>

          {/* Pending Certificates */}
          {eligibleCount > 0 && (
            <Card className="border-success/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-success" />
                  Ready for Certification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {eligibleCount} student(s) have completed all requirements.
                </p>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate('/mentor/certificates')}
                >
                  Review & Issue
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
