import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileText, Calendar, Plus, Loader2, Eye, Users, Edit2 } from 'lucide-react';
import { mentorAssignments, getSubmissionsByAssignment, MentorAssignment } from '@/data/mentorMockData';
import { courses } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function MentorAssignments() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assignments, setAssignments] = useState(mentorAssignments);
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

  const assignedCourses = courses.filter(c => c.mentorId === 'mentor-1');
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

    await new Promise(resolve => setTimeout(resolve, 1000));

    const newAssignment: MentorAssignment = {
      id: `assign-${Date.now()}`,
      courseId: formData.courseId,
      title: formData.title,
      description: formData.description,
      instructions: formData.instructions,
      dueDate: formData.dueDate,
      status: formData.status,
      createdAt: new Date().toISOString(),
    };

    setAssignments(prev => [...prev, newAssignment]);

    toast({
      title: formData.status === 'published' ? 'Assignment Published' : 'Draft Saved',
      description: formData.status === 'published' 
        ? 'Students can now see this assignment.' 
        : 'Your assignment has been saved as draft.',
    });

    setIsLoading(false);
    setIsOpen(false);
    resetForm();
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
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingAssignment) {
      setAssignments(prev =>
        prev.map(a =>
          a.id === editingAssignment.id
            ? {
                ...a,
                title: formData.title,
                description: formData.description,
                instructions: formData.instructions,
                dueDate: formData.dueDate,
                status: formData.status,
              }
            : a
        )
      );
    }

    toast({
      title: 'Assignment Updated',
      description: 'Your assignment has been updated successfully.',
    });

    setIsLoading(false);
    setIsEditOpen(false);
    setEditingAssignment(null);
    resetForm();
  };

  const handlePublishDraft = async (assignmentId: string) => {
    setAssignments(prev =>
      prev.map(a =>
        a.id === assignmentId ? { ...a, status: 'published' as const } : a
      )
    );

    toast({
      title: 'Assignment Published',
      description: 'Students can now see this assignment.',
    });
  };

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
                const submissions = getSubmissionsByAssignment(assignment.id);
                const pendingCount = submissions.filter(s => s.status === 'pending').length;
                
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
                            {submissions.length} submissions
                          </span>
                          {pendingCount > 0 && (
                            <Badge variant="secondary" className="bg-warning/10 text-warning">
                              {pendingCount} pending review
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
