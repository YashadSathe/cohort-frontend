import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Users,
  BookOpen,
  Video,
  FileText,
  Award,
  Download,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { cohortStudents, mentorAssignments, mentorSessions, studentSubmissions } from '@/data/mentorMockData';

export default function MentorReports() {
  // Calculate stats
  const totalStudents = cohortStudents.length;
  const avgProgress = Math.round(
    cohortStudents.reduce((acc, s) => acc + s.progress, 0) / totalStudents
  );
  const activeStudents = cohortStudents.filter(s => {
    const lastActive = new Date(s.lastActive);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return lastActive >= weekAgo;
  }).length;
  
  const completedSessions = mentorSessions.filter(s => s.status === 'completed').length;
  const totalSessions = mentorSessions.length;
  
  const totalSubmissions = studentSubmissions.length;
  const approvedSubmissions = studentSubmissions.filter(s => s.status === 'approved').length;
  const pendingSubmissions = studentSubmissions.filter(s => s.status === 'pending').length;
  
  const certifiedStudents = cohortStudents.filter(s => s.certificateStatus === 'issued').length;
  const eligibleStudents = cohortStudents.filter(s => s.certificateStatus === 'eligible').length;

  // Progress distribution
  const progressDistribution = [
    { range: '0-25%', count: cohortStudents.filter(s => s.progress <= 25).length },
    { range: '26-50%', count: cohortStudents.filter(s => s.progress > 25 && s.progress <= 50).length },
    { range: '51-75%', count: cohortStudents.filter(s => s.progress > 50 && s.progress <= 75).length },
    { range: '76-100%', count: cohortStudents.filter(s => s.progress > 75).length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Cohort analytics and progress reports</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{avgProgress}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-success">
              <TrendingUp className="w-3 h-3" />
              <span>+5% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold">{activeStudents}/{totalStudents}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-success" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <span>{Math.round((activeStudents / totalStudents) * 100)}% active rate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sessions Done</p>
                <p className="text-2xl font-bold">{completedSessions}/{totalSessions}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-accent" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <span>{totalSessions - completedSessions} upcoming</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Certified</p>
                <p className="text-2xl font-bold">{certifiedStudents}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-warning" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <span>{eligibleStudents} pending issuance</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progress Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {progressDistribution.map((item) => (
              <div key={item.range} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.range}</span>
                  <span className="font-medium">{item.count} students</span>
                </div>
                <Progress value={(item.count / totalStudents) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assignment Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span>Total Assignments</span>
              </div>
              <Badge variant="secondary">{mentorAssignments.length}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <span>Total Submissions</span>
              </div>
              <Badge variant="secondary">{totalSubmissions}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-success" />
                <span>Approved</span>
              </div>
              <Badge className="bg-success">{approvedSubmissions}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-warning" />
                <span>Pending Review</span>
              </div>
              <Badge variant="secondary" className="bg-warning/20 text-warning">
                {pendingSubmissions}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...cohortStudents]
                .sort((a, b) => b.progress - a.progress)
                .slice(0, 5)
                .map((student, index) => (
                  <div key={student.id} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-warning text-warning-foreground' :
                      index === 1 ? 'bg-muted-foreground/30' :
                      index === 2 ? 'bg-accent/30 text-accent' :
                      'bg-muted'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{student.name}</span>
                        <span className="text-sm font-semibold">{student.progress}%</span>
                      </div>
                      <Progress value={student.progress} className="h-1.5 mt-1" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Class Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cohortStudents.slice(0, 5).map((student) => {
              const attendanceRate = Math.round((student.attendedClasses / student.totalClasses) * 100);
              return (
                <div key={student.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{student.name}</span>
                    <span className="font-medium">{student.attendedClasses}/{student.totalClasses} classes</span>
                  </div>
                  <Progress 
                    value={attendanceRate} 
                    className={`h-2 ${attendanceRate < 50 ? '[&>div]:bg-destructive' : ''}`} 
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
