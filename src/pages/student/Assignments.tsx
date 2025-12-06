import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Calendar, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { assignments } from '@/data/studentMockData';
import { getCourseById } from '@/data/mockData';

export default function Assignments() {
  const navigate = useNavigate();

  const pendingAssignments = assignments.filter(a => a.status === 'not-submitted');
  const submittedAssignments = assignments.filter(a => a.status === 'submitted');
  const approvedAssignments = assignments.filter(a => a.status === 'approved');
  const rejectedAssignments = assignments.filter(a => a.status === 'rejected');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'submitted':
        return <Clock className="w-5 h-5 text-primary" />;
      default:
        return <AlertCircle className="w-5 h-5 text-warning" />;
    }
  };

  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = new Date(dueDate) < new Date() && status === 'not-submitted';
    
    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    switch (status) {
      case 'approved':
        return <Badge className="bg-success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Needs Revision</Badge>;
      case 'submitted':
        return <Badge variant="secondary">Under Review</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const AssignmentCard = ({ assignment }: { assignment: typeof assignments[0] }) => {
    const course = getCourseById(assignment.courseId);
    
    return (
      <div
        className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
        onClick={() => navigate(`/student/assignments/${assignment.id}`)}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            assignment.status === 'approved' ? 'bg-success/10' :
            assignment.status === 'rejected' ? 'bg-destructive/10' :
            assignment.status === 'submitted' ? 'bg-primary/10' :
            'bg-warning/10'
          }`}>
            {getStatusIcon(assignment.status)}
          </div>
          <div>
            <p className="font-medium">{assignment.title}</p>
            <p className="text-sm text-muted-foreground">{course?.title}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        {getStatusBadge(assignment.status, assignment.dueDate)}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">View and submit your course assignments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingAssignments.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{submittedAssignments.length}</p>
              <p className="text-sm text-muted-foreground">Under Review</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{approvedAssignments.length}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{rejectedAssignments.length}</p>
              <p className="text-sm text-muted-foreground">Needs Revision</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({assignments.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingAssignments.length + rejectedAssignments.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submittedAssignments.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedAssignments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                All Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No assignments yet</p>
              ) : (
                assignments.map(assignment => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Pending Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...pendingAssignments, ...rejectedAssignments].length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No pending assignments</p>
              ) : (
                [...pendingAssignments, ...rejectedAssignments].map(assignment => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submitted">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Submitted (Under Review)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {submittedAssignments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No assignments under review</p>
              ) : (
                submittedAssignments.map(assignment => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Approved Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {approvedAssignments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No approved assignments yet</p>
              ) : (
                approvedAssignments.map(assignment => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
