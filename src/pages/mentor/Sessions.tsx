import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Video, Calendar, Clock, Plus, ExternalLink, Loader2, CheckCircle2, Edit2 } from 'lucide-react';
import { mentorSessions, MentorSession } from '@/data/mentorMockData';
import { courses } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const reminderOptions = [
  { id: '1-week', label: '1 week before' },
  { id: '1-day', label: '1 day before' },
  { id: '1-hour', label: '1 hour before' },
  { id: '30-min', label: '30 minutes before' },
];

export default function MentorSessions() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState(mentorSessions);
  const [editingSession, setEditingSession] = useState<MentorSession | null>(null);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '2 hours',
    meetingLink: '',
    reminders: ['1-day', '1-hour'],
  });

  const assignedCourses = courses.filter(c => c.mentorId === 'mentor-1');
  const upcomingSessions = sessions.filter(s => s.status === 'scheduled');
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const liveSessions = sessions.filter(s => s.status === 'live');

  const handleReminderChange = (reminderId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      reminders: checked
        ? [...prev.reminders, reminderId]
        : prev.reminders.filter(r => r !== reminderId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Session Scheduled',
      description: 'Your live session has been created successfully.',
    });

    setIsLoading(false);
    setIsOpen(false);
    setFormData({
      courseId: '',
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '2 hours',
      meetingLink: '',
      reminders: ['1-day', '1-hour'],
    });
  };

  const handleEditSession = (session: MentorSession) => {
    setEditingSession(session);
    setFormData({
      courseId: session.courseId,
      title: session.title,
      description: session.description || '',
      date: session.date,
      time: session.time,
      duration: session.duration,
      meetingLink: session.meetingLink,
      reminders: ['1-day', '1-hour'],
    });
    setIsEditOpen(true);
  };

  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingSession) {
      setSessions(prev =>
        prev.map(s =>
          s.id === editingSession.id
            ? {
                ...s,
                title: formData.title,
                description: formData.description,
                date: formData.date,
                time: formData.time,
                duration: formData.duration,
                meetingLink: formData.meetingLink,
              }
            : s
        )
      );
    }

    toast({
      title: 'Session Updated',
      description: 'Your session has been updated successfully.',
    });

    setIsLoading(false);
    setIsEditOpen(false);
    setEditingSession(null);
  };

  const handleStartSession = (sessionId: string) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId ? { ...s, status: 'live' as const } : s
      )
    );
    toast({
      title: 'Session Started',
      description: 'Your live session is now active.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Live Sessions</h1>
          <p className="text-muted-foreground">Schedule and manage your live classes</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0">
              <Plus className="w-4 h-4 mr-2" /> Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Schedule New Session</DialogTitle>
              <DialogDescription>
                Create a new live session for your course
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
                <Label htmlFor="title">Session Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Week 1: Introduction to React"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the session"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 minutes">30 minutes</SelectItem>
                    <SelectItem value="1 hour">1 hour</SelectItem>
                    <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                    <SelectItem value="2 hours">2 hours</SelectItem>
                    <SelectItem value="3 hours">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingLink">Meeting Link *</Label>
                <Input
                  id="meetingLink"
                  placeholder="https://meet.google.com/..."
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Email Reminders</Label>
                <div className="grid grid-cols-2 gap-2">
                  {reminderOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={formData.reminders.includes(option.id)}
                        onCheckedChange={(checked) => handleReminderChange(option.id, checked as boolean)}
                      />
                      <label htmlFor={option.id} className="text-sm cursor-pointer">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 gradient-primary border-0" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Schedule
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Session Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
            <DialogDescription>
              Update the session details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSession} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Session Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time">Time *</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duration</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 minutes">30 minutes</SelectItem>
                  <SelectItem value="1 hour">1 hour</SelectItem>
                  <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                  <SelectItem value="2 hours">2 hours</SelectItem>
                  <SelectItem value="3 hours">3 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-meetingLink">Meeting Link *</Label>
              <Input
                id="edit-meetingLink"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 gradient-primary border-0" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Update Session
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Live Sessions */}
      {liveSessions.length > 0 && (
        <Card className="border-success/30 bg-gradient-to-r from-success/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success animate-pulse" />
              Live Now ({liveSessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {liveSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-success/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                      <Video className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-muted-foreground">{session.description}</p>
                    </div>
                  </div>
                  <Button className="bg-success hover:bg-success/90 gap-1">
                    Join <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Upcoming Sessions ({upcomingSessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No upcoming sessions</p>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-muted/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Video className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-muted-foreground">{session.description}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(session.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.time}
                        </span>
                        <Badge variant="outline">{session.duration}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-16 md:ml-0">
                    <Button variant="outline" size="sm" onClick={() => handleEditSession(session)}>
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" className="gap-1" onClick={() => handleStartSession(session.id)}>
                      Start <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Completed Sessions ({completedSessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedSessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No completed sessions</p>
          ) : (
            <div className="space-y-3">
              {completedSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                        <span>{session.time}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
