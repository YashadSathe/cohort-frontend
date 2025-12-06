import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  BookOpen,
  Users,
  Video,
  FileText,
  Award,
  Calendar,
  Clock,
  Plus,
} from 'lucide-react';
import { getCourseById } from '@/data/mockData';
import { 
  getSessionsByCourse, 
  getAssignmentsByCourse, 
  cohortStudents 
} from '@/data/mentorMockData';

export default function CourseManage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = getCourseById(courseId || '');
  const sessions = course ? getSessionsByCourse(course.id) : [];
  const assignments = course ? getAssignmentsByCourse(course.id) : [];

  if (!course) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <Button onClick={() => navigate('/mentor/courses')}>Back to Courses</Button>
      </div>
    );
  }

  const avgProgress = Math.round(
    cohortStudents.reduce((acc, s) => acc + s.progress, 0) / cohortStudents.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/mentor/courses')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.category} • {course.level}</p>
        </div>
        <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
          {course.status}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{cohortStudents.length}</p>
              <p className="text-sm text-muted-foreground">Students</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sessions.length}</p>
              <p className="text-sm text-muted-foreground">Sessions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{assignments.length}</p>
              <p className="text-sm text-muted-foreground">Assignments</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgProgress}%</p>
              <p className="text-sm text-muted-foreground">Avg Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">{new Date(course.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-medium">{new Date(course.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modules</span>
                  <span className="font-medium">{course.totalModules}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Topics</span>
                  <span className="font-medium">{course.totalTopics}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cohort Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Average Completion</span>
                    <span className="font-medium">{avgProgress}%</span>
                  </div>
                  <Progress value={avgProgress} className="h-2" />
                </div>
                
                <div className="pt-4 space-y-3">
                  {cohortStudents.slice(0, 4).map((student) => (
                    <div key={student.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {student.avatar ? (
                          <img src={student.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs">{student.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{student.name}</span>
                          <span>{student.progress}%</span>
                        </div>
                        <Progress value={student.progress} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Live Sessions</CardTitle>
              <Button onClick={() => navigate('/mentor/sessions')}>
                <Plus className="w-4 h-4 mr-2" /> New Session
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        session.status === 'completed' ? 'bg-success/10' : 'bg-primary/10'
                      }`}>
                        <Video className={`w-5 h-5 ${
                          session.status === 'completed' ? 'text-success' : 'text-primary'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{session.title}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={session.status === 'completed' ? 'secondary' : 'default'}>
                      {session.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Assignments</CardTitle>
              <Button onClick={() => navigate('/mentor/assignments')}>
                <Plus className="w-4 h-4 mr-2" /> New Assignment
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Due {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={assignment.status === 'published' ? 'default' : 'secondary'}>
                      {assignment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Enrolled Students</CardTitle>
              <Button variant="outline" onClick={() => navigate('/mentor/students')}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cohortStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {student.avatar ? (
                          <img src={student.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm">{student.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{student.progress}%</p>
                      <p className="text-xs text-muted-foreground">Progress</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
