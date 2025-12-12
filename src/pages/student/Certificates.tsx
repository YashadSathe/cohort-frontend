import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Lock, Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getStudentCertificates, getEnrolledCourses, getCourseProgress, getCourseById } from '@/services/api';
import type { StudentProgress, Course } from '@/services/api';

interface CertificateData extends StudentProgress {
  course: Course | null;
}

export default function Certificates() {
  const { user } = useAuth();
  const [certificateData, setCertificateData] = useState<CertificateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCertificates = async () => {
      if (user?.id) {
        try {
          // Get enrolled courses and their progress
          const enrolledCourses = await getEnrolledCourses(user.id);
          
          const progressData = await Promise.all(
            enrolledCourses.map(async (course) => {
              const progress = await getCourseProgress(user.id, course.id);
              return {
                ...(progress || {
                  courseId: course.id,
                  completedTopics: [],
                  totalTopics: course.totalTopics,
                  attendedClasses: 0,
                  totalClasses: 8,
                  assignmentsCompleted: 0,
                  totalAssignments: 3,
                  certificateStatus: 'locked' as const,
                }),
                course,
              };
            })
          );

          setCertificateData(progressData);
        } catch (error) {
          console.error('Failed to load certificates:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadCertificates();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const issuedCertificates = certificateData.filter(c => c.certificateStatus === 'issued');
  const lockedCertificates = certificateData.filter(c => c.certificateStatus !== 'issued');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Certificates</h1>
        <p className="text-muted-foreground">View and download your earned certificates</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{issuedCertificates.length}</p>
              <p className="text-sm text-muted-foreground">Earned</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lockedCertificates.length}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earned Certificates */}
      {issuedCertificates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Award className="w-5 h-5 text-success" />
            Earned Certificates
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {issuedCertificates.map((cert) => (
              <Card key={cert.courseId} className="overflow-hidden border-success/30">
                <div className="gradient-primary p-6 text-primary-foreground">
                  <div className="flex items-center justify-between mb-4">
                    <Award className="w-12 h-12" />
                    <Badge className="bg-primary-foreground/20 text-primary-foreground">
                      Verified
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-1">Certificate of Completion</h3>
                  <p className="text-primary-foreground/80">{cert.course?.title}</p>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Issued Date</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-4 h-4" />
                      {cert.certificateIssuedAt 
                        ? new Date(cert.certificateIssuedAt).toLocaleDateString()
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="flex items-center gap-1 text-success font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </span>
                  </div>
                  <Button className="w-full gap-2">
                    <Download className="w-4 h-4" /> Download Certificate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Certificates */}
      {lockedCertificates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5 text-muted-foreground" />
            In Progress
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {lockedCertificates.map((cert) => {
              const progressPercent = Math.round(
                (cert.completedTopics.length / cert.totalTopics) * 100
              );
              
              return (
                <Card key={cert.courseId} className="overflow-hidden opacity-80">
                  <div className="bg-muted p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Lock className="w-12 h-12 text-muted-foreground" />
                      <Badge variant="secondary">Locked</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-1 text-muted-foreground">
                      Certificate of Completion
                    </h3>
                    <p className="text-muted-foreground">{cert.course?.title}</p>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Topics Completed</span>
                        <span className="font-medium">
                          {cert.completedTopics.length}/{cert.totalTopics}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Classes Attended</span>
                        <span className="font-medium">
                          {cert.attendedClasses}/{cert.totalClasses}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Assignments Approved</span>
                        <span className="font-medium">
                          {cert.assignmentsCompleted}/{cert.totalAssignments}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span className="font-medium">{progressPercent}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <Button variant="outline" className="w-full" disabled>
                      Complete Course to Unlock
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {certificateData.length === 0 && (
        <Card className="p-12 text-center">
          <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No certificates yet</h2>
          <p className="text-muted-foreground">
            Complete a course to earn your first certificate
          </p>
        </Card>
      )}
    </div>
  );
}
