import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  FileText,
  Calendar,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import { studentSubmissions, mentorAssignments } from '@/data/mentorMockData';
import { useToast } from '@/hooks/use-toast';

export default function MentorSubmissions() {
  const { toast } = useToast();
  const [selectedSubmission, setSelectedSubmission] = useState<typeof studentSubmissions[0] | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pendingSubmissions = studentSubmissions.filter(s => s.status === 'pending');
  const approvedSubmissions = studentSubmissions.filter(s => s.status === 'approved');
  const rejectedSubmissions = studentSubmissions.filter(s => s.status === 'rejected');

  const getAssignmentTitle = (assignmentId: string) => {
    return mentorAssignments.find(a => a.id === assignmentId)?.title || 'Unknown';
  };

  const handleReview = async (action: 'approve' | 'reject') => {
    if (!selectedSubmission) return;
    
    if (action === 'reject' && !feedback.trim()) {
      toast({
        title: 'Feedback required',
        description: 'Please provide feedback when rejecting a submission.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: action === 'approve' ? 'Submission Approved' : 'Revision Requested',
      description: action === 'approve' 
        ? `${selectedSubmission.studentName}'s submission has been approved.`
        : `${selectedSubmission.studentName} has been notified to revise their submission.`,
    });

    setIsLoading(false);
    setSelectedSubmission(null);
    setFeedback('');
  };

  const SubmissionCard = ({ submission }: { submission: typeof studentSubmissions[0] }) => (
    <div
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
      onClick={() => {
        setSelectedSubmission(submission);
        setFeedback(submission.feedback || '');
      }}
    >
      <div className="flex items-start gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={submission.studentAvatar} />
          <AvatarFallback>{submission.studentName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{submission.studentName}</p>
          <p className="text-sm text-muted-foreground">{getAssignmentTitle(submission.assignmentId)}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Submitted {new Date(submission.submittedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-14 md:ml-0">
        <Badge variant={
          submission.status === 'approved' ? 'default' :
          submission.status === 'rejected' ? 'destructive' :
          'secondary'
        }>
          {submission.status === 'pending' ? 'Pending Review' : submission.status}
        </Badge>
        <Button variant="outline" size="sm">
          Review
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Submissions</h1>
        <p className="text-muted-foreground">Review and grade student assignment submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-lg">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-warning mx-auto mb-1" />
            <p className="text-2xl font-bold">{pendingSubmissions.length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-success mx-auto mb-1" />
            <p className="text-2xl font-bold">{approvedSubmissions.length}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="w-6 h-6 text-destructive mx-auto mb-1" />
            <p className="text-2xl font-bold">{rejectedSubmissions.length}</p>
            <p className="text-xs text-muted-foreground">Revision</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingSubmissions.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedSubmissions.length})</TabsTrigger>
          <TabsTrigger value="rejected">Needs Revision ({rejectedSubmissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-2" />
                  <p className="text-muted-foreground">All submissions reviewed!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingSubmissions.map(submission => (
                    <SubmissionCard key={submission.id} submission={submission} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Approved Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {approvedSubmissions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No approved submissions yet</p>
              ) : (
                <div className="space-y-3">
                  {approvedSubmissions.map(submission => (
                    <SubmissionCard key={submission.id} submission={submission} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                Needs Revision
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rejectedSubmissions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No rejected submissions</p>
              ) : (
                <div className="space-y-3">
                  {rejectedSubmissions.map(submission => (
                    <SubmissionCard key={submission.id} submission={submission} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
            <DialogDescription>
              {selectedSubmission?.studentName}'s submission for "{getAssignmentTitle(selectedSubmission?.assignmentId || '')}"
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedSubmission.studentAvatar} />
                  <AvatarFallback>{selectedSubmission.studentName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedSubmission.studentName}</p>
                  <p className="text-sm text-muted-foreground">{selectedSubmission.studentEmail}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Submission URL</Label>
                <a
                  href={selectedSubmission.submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  {selectedSubmission.submissionUrl}
                </a>
              </div>

              <div className="space-y-2">
                <Label>Submitted</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedSubmission.submittedAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback {selectedSubmission.status === 'pending' && '(required for rejection)'}</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide feedback for the student..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>

              {selectedSubmission.status === 'pending' && (
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleReview('reject')}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                    Request Revision
                  </Button>
                  <Button
                    className="flex-1 bg-success hover:bg-success/90"
                    onClick={() => handleReview('approve')}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
