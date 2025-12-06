import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  MoreVertical,
  Mail,
  Ban,
  Users,
  GraduationCap,
  Shield,
  Loader2,
} from 'lucide-react';
import { students as initialStudents, mentors as initialMentors, admins, Student, Mentor } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsers() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('students');
  const [students, setStudents] = useState(initialStudents);
  const [mentorsData, setMentorsData] = useState(initialMentors);
  
  // Modal states
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Student | Mentor | null>(null);
  const [emailForm, setEmailForm] = useState({ subject: '', message: '' });
  const [suspendReason, setSuspendReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMentors = mentorsData.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAdmins = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendEmail = (user: Student | Mentor) => {
    setSelectedUser(user);
    setEmailForm({ subject: '', message: '' });
    setIsEmailOpen(true);
  };

  const handleSuspendUser = (user: Student | Mentor) => {
    setSelectedUser(user);
    setSuspendReason('');
    setIsSuspendOpen(true);
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Email Sent',
      description: `Email has been sent to ${selectedUser?.name}.`,
    });
    
    setIsLoading(false);
    setIsEmailOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmSuspend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (selectedUser && 'enrolledCourses' in selectedUser) {
      // It's a student
      setStudents(prev =>
        prev.map(s =>
          s.id === selectedUser.id
            ? { ...s, status: 'inactive' as const, enrolledCourses: [] }
            : s
        )
      );
    } else if (selectedUser) {
      // It's a mentor
      setMentorsData(prev =>
        prev.map(m =>
          m.id === selectedUser.id
            ? { ...m, status: 'inactive' as const }
            : m
        )
      );
    }
    
    toast({
      title: 'User Suspended',
      description: `${selectedUser?.name} has been suspended.`,
    });
    
    setIsLoading(false);
    setIsSuspendOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all platform users</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{students.length}</p>
              <p className="text-sm text-muted-foreground">Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <GraduationCap className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mentorsData.length}</p>
              <p className="text-sm text-muted-foreground">Mentors</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <Shield className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{admins.length}</p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
          <TabsTrigger value="mentors">Mentors ({mentorsData.length})</TabsTrigger>
          <TabsTrigger value="admins">Admins ({admins.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Student
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Email
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                        Enrolled Courses
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b border-border/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {student.email}
                        </td>
                        <td className="py-3 px-4 text-center text-sm">
                          {student.enrolledCourses.length}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge 
                            variant="secondary" 
                            className={student.status === 'active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}
                          >
                            {student.status === 'active' ? 'Active' : 'Suspended'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleSendEmail(student)}>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSuspendUser(student)}
                                className="text-destructive"
                                disabled={student.status === 'inactive'}
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mentors" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Mentor
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Expertise
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                        Courses
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                        Experience
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMentors.map((mentor) => (
                      <tr key={mentor.id} className="border-b border-border/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={mentor.avatar} />
                              <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{mentor.name}</p>
                              <p className="text-xs text-muted-foreground">{mentor.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {mentor.expertise.slice(0, 2).map((exp) => (
                              <Badge key={exp} variant="outline" className="text-xs">
                                {exp}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center text-sm">
                          {mentor.assignedCourses.length}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary">{mentor.experience}</Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge 
                            variant="secondary" 
                            className={mentor.status === 'active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}
                          >
                            {mentor.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleSendEmail(mentor)}>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSuspendUser(mentor)}
                                className="text-destructive"
                                disabled={mentor.status === 'inactive'}
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Deactivate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Admin
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Email
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                        Role
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((admin) => (
                      <tr key={admin.id} className="border-b border-border/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={admin.avatar} />
                              <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{admin.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {admin.email}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="destructive">Super Admin</Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            Active
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Email Modal */}
      <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email to {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Compose and send an email to this user
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject *</Label>
              <Input
                id="email-subject"
                placeholder="e.g., Account Update"
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

      {/* Suspend Modal */}
      <Dialog open={isSuspendOpen} onOpenChange={setIsSuspendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              This will suspend the user's account and remove them from active courses.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConfirmSuspend} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="suspend-reason">Reason for Suspension *</Label>
              <Textarea
                id="suspend-reason"
                placeholder="Please provide a reason for suspending this user..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                rows={4}
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsSuspendOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="destructive" className="flex-1" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Ban className="w-4 h-4 mr-2" />}
                Confirm Suspend
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
