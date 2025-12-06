import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { getAssignmentById } from '@/data/studentMockData';
import { getCourseById } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function AssignmentDetail() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignment = getAssignmentById(assignmentId || '');
  const course = assignment ? getCourseById(assignment.courseId) : null;

  if (!assignment) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Assignment not found</h1>
        <Button onClick={() => navigate('/student/assignments')}>Back to Assignments</Button>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (assignment.status) {
      case 'approved':
        return <CheckCircle2 className="w-6 h-6 text-success" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-destructive" />;
      case 'submitted':
        return <Clock className="w-6 h-6 text-primary" />;
      default:
        return <AlertCircle className="w-6 h-6 text-warning" />;
    }
  };

  const getStatusBadge = () => {
    const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status === 'not-submitted';
    
    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    switch (assignment.status) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!submissionUrl.trim()) {
      toast({
        title: 'URL Required',
        description: 'Please enter a valid submission URL.',
        variant: 'destructive',
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(submissionUrl);
    } catch {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL starting with http:// or https://',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Assignment Submitted!',
      description: 'Your assignment has been submitted successfully.',
    });
    
    setIsSubmitting(false);
    navigate('/student/assignments');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/student/assignments')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <h1 className="text-2xl font-bold">{assignment.title}</h1>
          </div>
          <p className="text-muted-foreground mt-1">{course?.title}</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Assignment Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}</span>
            </div>
            {assignment.submittedAt && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Submitted: {new Date(assignment.submittedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {assignment.instructions}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Feedback (if rejected or approved) */}
      {assignment.feedback && (
        <Card className={assignment.status === 'rejected' ? 'border-destructive/50' : 'border-success/50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Mentor Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{assignment.feedback}</p>
          </CardContent>
        </Card>
      )}

      {/* Submission Section */}
      <Card>
        <CardHeader>
          <CardTitle>Submission</CardTitle>
        </CardHeader>
        <CardContent>
          {assignment.status === 'approved' ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
              <p className="font-medium">Assignment Approved!</p>
              <p className="text-sm text-muted-foreground mt-1">Great work on this assignment.</p>
              {assignment.submissionUrl && (
                <a
                  href={assignment.submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline mt-4 text-sm"
                >
                  View Submission <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ) : assignment.status === 'submitted' ? (
            <div className="text-center py-6">
              <Clock className="w-12 h-12 text-primary mx-auto mb-3" />
              <p className="font-medium">Submission Under Review</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your mentor will review your submission soon.
              </p>
              {assignment.submissionUrl && (
                <a
                  href={assignment.submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline mt-4 text-sm"
                >
                  View Submission <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {assignment.status === 'rejected' && (
                <div className="p-4 bg-destructive/10 rounded-lg text-sm">
                  <p className="font-medium text-destructive">Revision Required</p>
                  <p className="text-muted-foreground mt-1">
                    Please review the feedback above and resubmit your assignment.
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="submission-url">Submission URL *</Label>
                <Input
                  id="submission-url"
                  type="url"
                  placeholder="https://github.com/username/repo"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter a GitHub repository URL, CodePen link, or any public URL to your work.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-primary border-0" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  assignment.status === 'rejected' ? 'Resubmit Assignment' : 'Submit Assignment'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
