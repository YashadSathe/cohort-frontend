import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Award, CheckCircle2, Lock, Loader2, Users } from 'lucide-react';
import { cohortStudents } from '@/data/mentorMockData';
import { useToast } from '@/hooks/use-toast';

export default function MentorCertificates() {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<typeof cohortStudents[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const eligibleStudents = cohortStudents.filter(s => s.certificateStatus === 'eligible');
  const issuedStudents = cohortStudents.filter(s => s.certificateStatus === 'issued');
  const lockedStudents = cohortStudents.filter(s => s.certificateStatus === 'locked');

  const handleIssueCertificate = async () => {
    if (!selectedStudent) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Certificate Issued',
      description: `${selectedStudent.name} has been issued their certificate.`,
    });

    setIsLoading(false);
    setSelectedStudent(null);
  };

  const handleIssueAll = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Certificates Issued',
      description: `${eligibleStudents.length} certificates have been issued.`,
    });

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Certificate Issuance</h1>
          <p className="text-muted-foreground">Issue certificates to students who completed the course</p>
        </div>
        {eligibleStudents.length > 0 && (
          <Button 
            className="gradient-primary border-0"
            onClick={handleIssueAll}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Issue All ({eligibleStudents.length})
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-lg">
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-6 h-6 text-success mx-auto mb-1" />
            <p className="text-2xl font-bold">{issuedStudents.length}</p>
            <p className="text-xs text-muted-foreground">Issued</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-warning mx-auto mb-1" />
            <p className="text-2xl font-bold">{eligibleStudents.length}</p>
            <p className="text-xs text-muted-foreground">Eligible</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
            <p className="text-2xl font-bold">{lockedStudents.length}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Eligible Students */}
      {eligibleStudents.length > 0 && (
        <Card className="border-success/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Ready for Certification ({eligibleStudents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eligibleStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-success/5 border border-success/20"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{student.attendedClasses}/{student.totalClasses} classes</span>
                        <span>{student.assignmentsCompleted}/{student.totalAssignments} assignments</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="bg-success hover:bg-success/90"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <Award className="w-4 h-4 mr-2" /> Issue Certificate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issued Certificates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Issued Certificates ({issuedStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {issuedStudents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No certificates issued yet</p>
          ) : (
            <div className="space-y-3">
              {issuedStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                  <Badge className="bg-success">
                    <Award className="w-3 h-3 mr-1" /> Issued
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* In Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            In Progress ({lockedStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lockedStudents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">All students have completed</p>
          ) : (
            <div className="space-y-3">
              {lockedStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>Progress: {student.progress}%</span>
                        <span>Classes: {student.attendedClasses}/{student.totalClasses}</span>
                        <span>Assignments: {student.assignmentsCompleted}/{student.totalAssignments}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    <Lock className="w-3 h-3 mr-1" /> Locked
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Issue Certificate Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Certificate</DialogTitle>
            <DialogDescription>
              Confirm certificate issuance for {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={selectedStudent.avatar} />
                  <AvatarFallback>{selectedStudent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedStudent.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course Progress</span>
                  <span className="font-medium">{selectedStudent.progress}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Classes Attended</span>
                  <span className="font-medium">{selectedStudent.attendedClasses}/{selectedStudent.totalClasses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assignments Completed</span>
                  <span className="font-medium">{selectedStudent.assignmentsCompleted}/{selectedStudent.totalAssignments}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedStudent(null)}>
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-success hover:bg-success/90"
                  onClick={handleIssueCertificate}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Award className="w-4 h-4 mr-2" />}
                  Issue Certificate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
