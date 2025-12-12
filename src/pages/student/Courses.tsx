import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock, Users, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getEnrolledCourses, getCourseProgress, getMentorById } from '@/services/api';
import type { Course, Mentor, StudentProgress } from '@/services/api';

export default function StudentCourses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      if (user?.id) {
        try {
          const courses = await getEnrolledCourses(user.id);
          setEnrolledCourses(courses);
        } catch (error) {
          console.error('Failed to load courses:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadCourses();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">Track your progress and continue learning</p>
        </div>
        <Button onClick={() => navigate('/courses')} variant="outline">
          Browse More Courses
        </Button>
      </div>

      {enrolledCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No courses yet</h2>
          <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course</p>
          <Button onClick={() => navigate('/courses')} className="gradient-primary border-0">
            Browse Courses
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              userId={user?.id || ''} 
              navigate={navigate} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, userId, navigate }: { course: Course; userId: string; navigate: (path: string) => void }) {
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [mentorData, progressData] = await Promise.all([
        getMentorById(course.mentorId),
        getCourseProgress(userId, course.id),
      ]);
      setMentor(mentorData);
      setProgress(progressData);
    };
    loadData();
  }, [course.mentorId, course.id, userId]);

  const progressPercent = progress 
    ? Math.round((progress.completedTopics.length / progress.totalTopics) * 100)
    : 0;

  return (
    <Card
      className="overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer"
      onClick={() => navigate(`/student/courses/${course.id}`)}
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-40 object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-success">
          Enrolled
        </Badge>
      </div>
      <CardContent className="p-5 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Badge variant="outline">{course.level}</Badge>
            <span>•</span>
            <span>{course.category}</span>
          </div>
          <h3 className="text-lg font-semibold">{course.title}</h3>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {course.totalStudents} students
          </span>
        </div>

        {mentor && (
          <div className="flex items-center gap-3">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">{mentor.name}</p>
              <p className="text-xs text-muted-foreground">Mentor</p>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <Button className="w-full" variant="outline">
          Continue Learning <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
