import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Play,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { getCourseById, getMentorById } from '@/data/mockData';
import { getProgressByCourse, getAssignmentsByCourse } from '@/data/studentMockData';

export default function CourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = getCourseById(courseId || '');
  const mentor = course ? getMentorById(course.mentorId) : null;
  const progress = course ? getProgressByCourse(course.id) : null;
  const assignments = course ? getAssignmentsByCourse(course.id) : [];

  if (!course) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <Button onClick={() => navigate('/student/courses')}>Back to Courses</Button>
      </div>
    );
  }

  const progressPercent = progress 
    ? Math.round((progress.completedTopics.length / progress.totalTopics) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/student/courses')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.category} • {course.level}</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Topics</p>
              <p className="font-semibold">
                {progress?.completedTopics.length || 0}/{progress?.totalTopics || course.totalTopics}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Classes</p>
              <p className="font-semibold">
                {progress?.attendedClasses || 0}/{progress?.totalClasses || 8}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assignments</p>
              <p className="font-semibold">
                {progress?.assignmentsCompleted || 0}/{progress?.totalAssignments || assignments.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Certificate</p>
              <p className="font-semibold capitalize">{progress?.certificateStatus || 'Locked'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Overall Progress</span>
            <span className="text-lg font-bold text-primary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="curriculum" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="certificate">Certificate</TabsTrigger>
        </TabsList>

        {/* Curriculum Tab */}
        <TabsContent value="curriculum">
          <Card>
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {course.curriculum.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-2">
                  {course.curriculum.map((module) => (
                    <AccordionItem
                      key={module.id}
                      value={module.id}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                            {module.order}
                          </div>
                          <div>
                            <p className="font-medium">{module.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {module.topics.length} topics
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="space-y-2 ml-11">
                          {module.topics.map((topic) => {
                            const isCompleted = progress?.completedTopics.includes(topic.id);
                            return (
                              <div
                                key={topic.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                              >
                                <div className="flex items-center gap-3">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-muted-foreground" />
                                  )}
                                  <span className={isCompleted ? 'text-muted-foreground' : ''}>
                                    {topic.title}
                                  </span>
                                </div>
                                <span className="text-sm text-muted-foreground">{topic.duration}</span>
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Curriculum details coming soon
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Live Classes Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {course.schedule.length > 0 ? (
                <div className="space-y-3">
                  {course.schedule.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Play className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{session.title}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(session.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {session.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={session.status === 'upcoming' ? 'secondary' : 'default'}>
                          {session.status}
                        </Badge>
                        {session.status === 'upcoming' && (
                          <Button size="sm" className="gap-1">
                            Join <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No scheduled classes yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length > 0 ? (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => navigate(`/student/assignments/${assignment.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          assignment.status === 'approved' ? 'bg-success/10' :
                          assignment.status === 'rejected' ? 'bg-destructive/10' :
                          assignment.status === 'submitted' ? 'bg-primary/10' :
                          'bg-warning/10'
                        }`}>
                          <FileText className={`w-6 h-6 ${
                            assignment.status === 'approved' ? 'text-success' :
                            assignment.status === 'rejected' ? 'text-destructive' :
                            assignment.status === 'submitted' ? 'text-primary' :
                            'text-warning'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{assignment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Due {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        assignment.status === 'approved' ? 'default' :
                        assignment.status === 'rejected' ? 'destructive' :
                        'secondary'
                      }>
                        {assignment.status === 'not-submitted' ? 'Pending' : assignment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No assignments yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificate Tab */}
        <TabsContent value="certificate">
          <Card>
            <CardContent className="p-8 text-center">
              {progress?.certificateStatus === 'issued' ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-10 h-10 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Certificate Earned!</h3>
                  <p className="text-muted-foreground mb-6">
                    Congratulations! You've completed this course.
                  </p>
                  <Button className="gradient-primary border-0">
                    Download Certificate
                  </Button>
                </>
              ) : progress?.certificateStatus === 'eligible' ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-10 h-10 text-warning" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Certificate Pending</h3>
                  <p className="text-muted-foreground mb-6">
                    You've completed all requirements. Your mentor will issue your certificate soon.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Certificate Locked</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete all modules and assignments to unlock your certificate.
                  </p>
                  <div className="max-w-xs mx-auto space-y-2 text-sm text-left">
                    <div className="flex items-center justify-between">
                      <span>Topics Completed</span>
                      <span className="font-medium">
                        {progress?.completedTopics.length || 0}/{progress?.totalTopics || course.totalTopics}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Classes Attended</span>
                      <span className="font-medium">
                        {progress?.attendedClasses || 0}/{progress?.totalClasses || 8}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Assignments Approved</span>
                      <span className="font-medium">
                        {progress?.assignmentsCompleted || 0}/{progress?.totalAssignments || assignments.length}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mentor Info */}
      {mentor && (
        <Card>
          <CardHeader>
            <CardTitle>Your Mentor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{mentor.name}</h3>
                <p className="text-sm text-muted-foreground">{mentor.experience} experience</p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{mentor.bio}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {mentor.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
