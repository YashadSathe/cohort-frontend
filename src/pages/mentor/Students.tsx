import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Users, Mail, Award, Download, MoreVertical, Eye, Loader2 } from 'lucide-react';
import { cohortStudents } from '@/data/mentorMockData';
import { courses } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function MentorStudents() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof cohortStudents[0] | null>(null);
  const [emailForm, setEmailForm] = useState({ subject: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const assignedCourses = courses.filter(c => c.mentorId === 'mentor-1');

  const filteredStudents = cohortStudents.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || student.courseId === courseFilter;
    return matchesSearch && matchesCourse;
  });

  const activeStudents = cohortStudents.filter(s => {
    const lastActive = new Date(s.lastActive);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return lastActive >= weekAgo;
  }).length;

  const avgProgress = Math.round(
    cohortStudents.reduce((acc, s) => acc + s.progress, 0) / cohortStudents.length
  );

  const handleViewStudent = (student: typeof cohortStudents[0]) => {
    setSelectedStudent(student);
    setIsViewOpen(true);
  };

  const handleEmailStudent = (student: typeof cohortStudents[0]) => {
    setSelectedStudent(student);
    setEmailForm({ subject: '', message: '' });
    setIsEmailOpen(true);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Email Sent',
      description: `Your email has been sent to ${selectedStudent?.name}.`,
    });
    
    setIsLoading(false);
    setIsEmailOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">View and manage students in your cohort</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" /> Export List
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{cohortStudents.length}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeStudents}</p>
              <p className="text-sm text-muted-foreground">Active This Week</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {cohortStudents.filter(s => s.certificateStatus === 'issued').length}
              </p>
              <p className="text-sm text-muted-foreground">Certified</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <span className="text-lg font-bold text-warning">{avgProgress}%</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{avgProgress}%</p>
              <p className="text-sm text-muted-foreground">Avg Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Student List</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {assignedCourses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead>Assignments</TableHead>
                  <TableHead>Certificate</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const lastActive = new Date(student.lastActive);
                  const isActive = (() => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return lastActive >= weekAgo;
                  })();

                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>{student.progress}%</span>
                          </div>
                          <Progress value={student.progress} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {student.attendedClasses}/{student.totalClasses}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {student.assignmentsCompleted}/{student.totalAssignments}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          student.certificateStatus === 'issued' ? 'default' :
                          student.certificateStatus === 'eligible' ? 'secondary' :
                          'outline'
                        }>
                          {student.certificateStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-success' : 'bg-muted-foreground'}`} />
                          <span className="text-sm text-muted-foreground">
                            {lastActive.toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewStudent(student)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEmailStudent(student)}>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Student Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedStudent.avatar} />
                  <AvatarFallback>{selectedStudent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedStudent.name}</h3>
                  <p className="text-muted-foreground">{selectedStudent.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-xl font-bold">{selectedStudent.progress}%</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Classes Attended</p>
                  <p className="text-xl font-bold">
                    {selectedStudent.attendedClasses}/{selectedStudent.totalClasses}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Assignments</p>
                  <p className="text-xl font-bold">
                    {selectedStudent.assignmentsCompleted}/{selectedStudent.totalAssignments}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Certificate</p>
                  <Badge variant={
                    selectedStudent.certificateStatus === 'issued' ? 'default' :
                    selectedStudent.certificateStatus === 'eligible' ? 'secondary' :
                    'outline'
                  }>
                    {selectedStudent.certificateStatus}
                  </Badge>
                </div>
              </div>

              <Button onClick={() => setIsViewOpen(false)} className="w-full">Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Student Dialog */}
      <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email to {selectedStudent?.name}</DialogTitle>
            <DialogDescription>
              Compose and send an email to this student
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject *</Label>
              <Input
                id="email-subject"
                placeholder="e.g., Assignment Feedback"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-message">Message *</Label>
              <Textarea
                id="email-message"
                placeholder="Write your message here..."
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                rows={6}
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEmailOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 gradient-primary border-0" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                Send Email
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
