import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Users, ArrowRight, Calendar, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getMentorCourses, getCohortStudents } from '@/services/api';
import type { Course, CohortStudent } from '@/services/api/types';

export default function MentorCourses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<CohortStudent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      try {
        const [coursesData, studentsData] = await Promise.all([
          getMentorCourses(user.id),
          getCohortStudents(user.id),
        ]);
        setAssignedCourses(coursesData);
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-40 w-full" />
              <CardContent className="p-5 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground">Manage your assigned courses and cohorts</p>
      </div>

      {assignedCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No courses assigned</h2>
          <p className="text-muted-foreground">You haven't been assigned to any courses yet.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {assignedCourses.map((course) => {
            const enrolledCount = students.length;
            const activeCount = students.filter(s => {
              const lastActive = new Date(s.lastActive);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return lastActive >= weekAgo;
            }).length;

            return (
              <Card
                key={course.id}
                className="overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                  <Badge 
                    className="absolute top-3 left-3"
                    variant={course.status === 'active' ? 'default' : 'secondary'}
                  >
                    {course.status}
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

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {enrolledCount} enrolled
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(course.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-muted-foreground">{activeCount} active</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1"
                      onClick={() => navigate(`/mentor/courses/${course.id}`)}
                    >
                      Manage <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/mentor/courses/${course.id}/curriculum`)}
                    >
                      Curriculum
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
