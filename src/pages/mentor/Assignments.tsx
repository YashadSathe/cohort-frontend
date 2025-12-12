import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileText, Calendar, Plus, Loader2, Eye, Users, Edit2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getMentorAssignments, 
  getMentorCourses, 
  createAssignment, 
  updateAssignment,
  getAssignmentSubmissions,
} from '@/services/api';
import type { MentorAssignment, Course, StudentSubmission } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';

export default function MentorAssignments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [assignments, setAssignments] = useState<MentorAssignment[]>([]);
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [submissionCounts, setSubmissionCounts] = useState<Record<string, { total: number; pending: number }>>({});
  const [viewingAssignment, setViewingAssignment] = useState<MentorAssignment | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<MentorAssignment | null>(null);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    instructions: '',
    dueDate: '',
    status: 'draft' as 'draft' | 'published',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      try {
        const [assignmentsData, coursesData] = await Promise.all([
          getMentorAssignments(user.id),
          getMentorCourses(user.id),
        ]);
        setAssignments(assignmentsData);
        setAssignedCourses(coursesData);

        // Fetch submission counts for each published assignment
        const counts: Record<string, { total: number; pending: number }> = {};
        await Promise.all(
          assignmentsData
            .filter(a => a.status === 'published')
            .map(async (assignment) => {
              const submissions = await getAssignmentSubmissions(assignment.id);
              counts[assignment.id] = {
                total: submissions.length,
                pending: submissions.filter(s => s.status === 'pending').length,
              };
            })
        );
        setSubmissionCounts(counts);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const publishedAssignments = assignments.filter(a => a.status === 'published');
  const draftAssignments = assignments.filter(a => a.status === 'draft');

  const resetForm = () => {
    setFormData({
      courseId: '',
      title: '',
      description: '',
      instructions: '',
      dueDate: '',
      status: 'draft',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newAssignment = await createAssignment({
        courseId: formData.courseId,
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        dueDate: formData.dueDate,
        status: formData.status,
      });

      setAssignments(prev => [...prev, newAssignment]);

      toast({
        title: formData.status === 'published' ? 'Assignment Published' : 'Draft Saved',
        description: formData.status === 'published' 
          ? 'Students can now see this assignment.' 
          : 'Your assignment has been saved as draft.',
      });

      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create assignment.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAssignment = (assignment: MentorAssignment) => {
    setViewingAssignment(assignment);
    setIsViewOpen(true);
  };

  const handleEditAssignment = (assignment: MentorAssignment) => {
    setEditingAssignment(assignment);
    setFormData({
      courseId: assignment.courseId,
      title: assignment.title,
      description: assignment.description,
      instructions: assignment.instructions || '',
      dueDate: assignment.dueDate,
      status: assignment.status,
    });
    setIsEditOpen(true);
  };

  const handleUpdateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;
    
    setIsLoading(true);

    try {
      const updated = await updateAssignment(editingAssignment.id, {
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        dueDate: formData.dueDate,
        status: formData.status,
      });

      setAssignments(prev =>
        prev.map(a => a.id === editingAssignment.id ? updated : a)
      );

      toast({
        title: 'Assignment Updated',
        description: 'Your assignment has been updated successfully.',
      });

      setIsEditOpen(false);
      setEditingAssignment(null);
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update assignment.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishDraft = async (assignmentId: string) => {
    try {
      await updateAssignment(assignmentId, { status: 'published' });
      setAssignments(prev =>
        prev.map(a =>
          a.id === assignmentId ? { ...a, status: 'published' as const } : a
        )
      );

      toast({
        title: 'Assignment Published',
        description: 'Students can now see this assignment.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish assignment.',
        variant: 'destructive',
      });
    }
  };

  if (isPageLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">Create and manage course assignments</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0">
              <Plus className="w-4 h-4 mr-2" /> Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>
                Create a new assignment for your students
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value) => setFormData({ ...formData, courseId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignedCourses.map(course => (
                      <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Assignment Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Build a Responsive Landing Page"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the assignment"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Detailed Instructions *</Label>
                <Textarea
                  id="instructions"
                  placeholder="Provide detailed instructions, requirements, and submission guidelines..."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  rows={8}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  You can use markdown formatting for better readability.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  variant="outline" 
                  className="flex-1"
                  disabled={isLoading}
                  onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                >
                  Save as Draft
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 gradient-primary border-0" 
                  disabled={isLoading}
                  onClick={() => setFormData(prev => ({ ...prev, status: 'published' }))}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Publish
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* View Assignment Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingAssignment?.title}</DialogTitle>
            <DialogDescription>
              Due: {viewingAssignment?.dueDate ? new Date(viewingAssignment.dueDate).toLocaleDateString() : 'N/A'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-muted-foreground">{viewingAssignment?.description}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Instructions</h4>
              <div className="p-4 rounded-lg bg-muted/50 whitespace-pre-wrap">
                {viewingAssignment?.instructions || 'No detailed instructions provided.'}
              </div>
            </div>
            <Button onClick={() => setIsViewOpen(false)} className="w-full">Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Assignment Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogDescription>
              Update the assignment details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateAssignment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Assignment Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Short Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-instructions">Detailed Instructions *</Label>
              <Textarea
                id="edit-instructions"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={8}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dueDate">Due Date *</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 gradient-primary border-0" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Update Assignment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Published Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Published Assignments ({publishedAssignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {publishedAssignments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No published assignments</p>
          ) : (
            <div className="space-y-3">
              {publishedAssignments.map((assignment) => {
                const counts = submissionCounts[assignment.id] || { total: 0, pending: 0 };
                
                return (
                  <div
                    key={assignment.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-muted/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{assignment.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Due {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            {counts.total} submissions
                          </span>
                          {counts.pending > 0 && (
                            <Badge variant="secondary" className="bg-warning/10 text-warning">
                              {counts.pending} pending review
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-16 md:ml-0">
                      <Button variant="outline" size="sm" onClick={() => handleViewAssignment(assignment)}>
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => navigate('/mentor/submissions')}
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Draft Assignments */}
      {draftAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              Drafts ({draftAssignments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {draftAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{assignment.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(assignment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Draft</Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEditAssignment(assignment)}>
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" onClick={() => handlePublishDraft(assignment.id)}>
                      Publish
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
