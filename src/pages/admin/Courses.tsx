import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  Star,
  Pause,
  Play,
  Loader2,
  Clock,
  BookOpen,
} from 'lucide-react';
import { getAllCourses, getAllMentors, createCourse, updateCourse, deleteCourse } from '@/services/api';
import type { Course, Mentor } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function AdminCourses() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [pauseDates, setPauseDates] = useState({ from: '', to: '' });
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    mentorId: '',
    price: '',
    duration: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
  });

  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    mentorId: '',
    price: '',
    duration: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [courses, mentorsList] = await Promise.all([
          getAllCourses(),
          getAllMentors(),
        ]);
        setCoursesData(courses);
        setMentors(mentorsList);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load courses',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [toast]);

  const filteredCourses = coursesData.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCourse = async () => {
    setIsSubmitting(true);
    try {
      const created = await createCourse({
        title: newCourse.title,
        description: newCourse.description,
        mentorId: newCourse.mentorId,
        price: parseInt(newCourse.price) || 0,
        duration: newCourse.duration,
        level: newCourse.level,
      });
      
      setCoursesData(prev => [created, ...prev]);
      toast({
        title: 'Course created',
        description: `${newCourse.title} has been created successfully`,
      });
      setIsCreateOpen(false);
      setNewCourse({
        title: '',
        description: '',
        mentorId: '',
        price: '',
        duration: '',
        level: 'Beginner',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create course',
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsViewOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setEditForm({
      title: course.title,
      description: course.description,
      mentorId: course.mentorId,
      price: course.price.toString(),
      duration: course.duration,
      level: course.level,
    });
    setIsEditOpen(true);
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;
    
    setIsSubmitting(true);
    try {
      const updated = await updateCourse(selectedCourse.id, {
        title: editForm.title,
        description: editForm.description,
        mentorId: editForm.mentorId,
        price: parseInt(editForm.price) || selectedCourse.price,
        duration: editForm.duration,
        level: editForm.level,
      });
      
      setCoursesData(prev => prev.map(c => c.id === selectedCourse.id ? updated : c));
      toast({
        title: 'Course updated',
        description: `${editForm.title} has been updated successfully`,
      });
      setIsEditOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update course',
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    try {
      await deleteCourse(courseId);
      setCoursesData(prev => prev.filter(c => c.id !== courseId));
      toast({
        title: 'Course deleted',
        description: `${courseTitle} has been deleted`,
        variant: 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete course',
        variant: 'destructive',
      });
    }
  };

  const handlePauseCourse = (course: Course) => {
    setSelectedCourse(course);
    setPauseDates({ from: '', to: '' });
    setIsPauseOpen(true);
  };

  const handleConfirmPause = async () => {
    if (!selectedCourse) return;
    
    setIsSubmitting(true);
    try {
      const updated = await updateCourse(selectedCourse.id, { status: 'paused' as const });
      setCoursesData(prev => prev.map(c => c.id === selectedCourse.id ? updated : c));
      
      toast({
        title: 'Course paused',
        description: `${selectedCourse?.title} has been paused from ${pauseDates.from} to ${pauseDates.to}`,
      });
      setIsPauseOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to pause course',
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  const handleResumeCourse = async (courseId: string, courseTitle: string) => {
    try {
      const updated = await updateCourse(courseId, { status: 'active' as const });
      setCoursesData(prev => prev.map(c => c.id === courseId ? updated : c));
      toast({
        title: 'Course resumed',
        description: `${courseTitle} is now active`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resume course',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Course Management</h1>
          <p className="text-muted-foreground">Create and manage all courses</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0">
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Course Title</Label>
                <Input
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="Enter course title"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Enter course description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Assign Mentor</Label>
                  <Select
                    value={newCourse.mentorId}
                    onValueChange={(value) => setNewCourse({ ...newCourse, mentorId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mentors.map((mentor) => (
                        <SelectItem key={mentor.id} value={mentor.id}>
                          {mentor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select
                    value={newCourse.level}
                    onValueChange={(value) => setNewCourse({ ...newCourse, level: value as 'Beginner' | 'Intermediate' | 'Advanced' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                    placeholder="499"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    placeholder="12 weeks"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCourse} className="gradient-primary border-0" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Create Course
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const mentor = mentors.find((m) => m.id === course.mentorId);
          return (
            <Card 
              key={course.id} 
              className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                course.status === 'paused' ? 'opacity-60' : ''
              }`}
              onClick={() => handleViewCourse(course)}
            >
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <Badge
                  className="absolute top-2 left-2"
                  variant={course.status === 'active' ? 'default' : course.status === 'paused' ? 'destructive' : 'secondary'}
                >
                  {course.status}
                </Badge>
                <Badge
                  className="absolute top-2 right-2"
                  variant={course.level === 'Beginner' ? 'secondary' : 'default'}
                >
                  {course.level}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  by {mentor?.name || 'Unknown'}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.totalStudents}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning" />
                    <span>{course.rating}</span>
                  </div>
                  <span className="font-semibold text-foreground">${course.price}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <Badge variant="outline" className="text-xs">
                    {course.category}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewCourse(course); }}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditCourse(course); }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Course
                      </DropdownMenuItem>
                      {course.status === 'paused' ? (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleResumeCourse(course.id, course.title); }}>
                          <Play className="w-4 h-4 mr-2" />
                          Resume
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handlePauseCourse(course); }}>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id, course.title); }}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View Course Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.title}</DialogTitle>
            <DialogDescription>Course details and information</DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-4">
              <img
                src={selectedCourse.thumbnail}
                alt={selectedCourse.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              
              <div className="flex flex-wrap gap-2">
                <Badge variant={selectedCourse.status === 'active' ? 'default' : 'secondary'}>
                  {selectedCourse.status}
                </Badge>
                <Badge variant="outline">{selectedCourse.level}</Badge>
                <Badge variant="outline">{selectedCourse.category}</Badge>
              </div>

              <p className="text-muted-foreground">{selectedCourse.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs">Students</span>
                  </div>
                  <p className="font-semibold">{selectedCourse.totalStudents}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Star className="w-4 h-4" />
                    <span className="text-xs">Rating</span>
                  </div>
                  <p className="font-semibold">{selectedCourse.rating}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Duration</span>
                  </div>
                  <p className="font-semibold">{selectedCourse.duration}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xs">Modules</span>
                  </div>
                  <p className="font-semibold">{selectedCourse.totalModules}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{new Date(selectedCourse.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">{new Date(selectedCourse.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">${selectedCourse.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Original Price</p>
                  <p className="font-medium line-through text-muted-foreground">${selectedCourse.originalPrice}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewOpen(false)} className="flex-1">
                  Close
                </Button>
                <Button onClick={() => { setIsViewOpen(false); handleEditCourse(selectedCourse); }} className="flex-1">
                  Edit Course
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update course details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Course Title</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assign Mentor</Label>
                <Select
                  value={editForm.mentorId}
                  onValueChange={(value) => setEditForm({ ...editForm, mentorId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mentors.map((mentor) => (
                      <SelectItem key={mentor.id} value={mentor.id}>
                        {mentor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Level</Label>
                <Select
                  value={editForm.level}
                  onValueChange={(value) => setEditForm({ ...editForm, level: value as 'Beginner' | 'Intermediate' | 'Advanced' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={editForm.duration}
                  onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCourse} className="gradient-primary border-0" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Update Course
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pause Course Dialog */}
      <Dialog open={isPauseOpen} onOpenChange={setIsPauseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pause Course</DialogTitle>
            <DialogDescription>
              Specify the pause period for "{selectedCourse?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={pauseDates.from}
                  onChange={(e) => setPauseDates({ ...pauseDates, from: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={pauseDates.to}
                  onChange={(e) => setPauseDates({ ...pauseDates, to: e.target.value })}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              The course will be marked as paused and won't accept new enrollments during this period.
            </p>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsPauseOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmPause} variant="destructive" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Pause Course
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
