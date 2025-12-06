import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';

// Generate more class sessions for demo with attendance tracking
const allClasses = [
  {
    id: 'class-1',
    courseId: 'course-1',
    courseTitle: 'Full-Stack Web Development Bootcamp',
    title: 'Week 1: HTML & CSS Deep Dive',
    date: '2024-12-15',
    time: '10:00 AM',
    duration: '2 hours',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'upcoming' as const,
    attended: null as boolean | null,
  },
  {
    id: 'class-2',
    courseId: 'course-1',
    courseTitle: 'Full-Stack Web Development Bootcamp',
    title: 'Week 1: JavaScript Fundamentals',
    date: '2024-12-17',
    time: '10:00 AM',
    duration: '2 hours',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'upcoming' as const,
    attended: null as boolean | null,
  },
  {
    id: 'class-3',
    courseId: 'course-1',
    courseTitle: 'Full-Stack Web Development Bootcamp',
    title: 'Week 2: React Components',
    date: '2024-12-20',
    time: '10:00 AM',
    duration: '2 hours',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'upcoming' as const,
    attended: null as boolean | null,
  },
  {
    id: 'class-4',
    courseId: 'course-1',
    courseTitle: 'Full-Stack Web Development Bootcamp',
    title: 'Introduction to Web Development',
    date: '2024-12-10',
    time: '10:00 AM',
    duration: '2 hours',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'completed' as const,
    attended: true,
  },
  {
    id: 'class-5',
    courseId: 'course-1',
    courseTitle: 'Full-Stack Web Development Bootcamp',
    title: 'Setting Up Your Development Environment',
    date: '2024-12-12',
    time: '10:00 AM',
    duration: '1.5 hours',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'completed' as const,
    attended: true,
  },
  {
    id: 'class-6',
    courseId: 'course-1',
    courseTitle: 'Full-Stack Web Development Bootcamp',
    title: 'Git & Version Control Basics',
    date: '2024-12-08',
    time: '10:00 AM',
    duration: '1.5 hours',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'completed' as const,
    attended: false, // Missed this class
  },
  {
    id: 'class-7',
    courseId: 'course-1',
    courseTitle: 'Full-Stack Web Development Bootcamp',
    title: 'Command Line Fundamentals',
    date: '2024-12-05',
    time: '10:00 AM',
    duration: '1 hour',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'completed' as const,
    attended: true,
  },
];

export default function LiveClasses() {
  const upcomingClasses = allClasses.filter(c => c.status === 'upcoming');
  const completedClasses = allClasses.filter(c => c.status === 'completed');
  
  const attendedCount = completedClasses.filter(c => c.attended).length;
  const missedCount = completedClasses.filter(c => !c.attended).length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Live Classes</h1>
        <p className="text-muted-foreground">View and join your scheduled live sessions</p>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingClasses.length}</p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{attendedCount}</p>
              <p className="text-sm text-muted-foreground">Attended</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{missedCount}</p>
              <p className="text-sm text-muted-foreground">Missed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <span className="text-sm font-bold text-accent">
                {completedClasses.length > 0 ? Math.round((attendedCount / completedClasses.length) * 100) : 0}%
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold">{completedClasses.length}</p>
              <p className="text-sm text-muted-foreground">Total Classes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Class Highlight */}
      {upcomingClasses.length > 0 && (
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Video className="w-5 h-5" />
              <span className="font-medium">Next Class</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{upcomingClasses[0].title}</h2>
                <p className="text-muted-foreground">{upcomingClasses[0].courseTitle}</p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(upcomingClasses[0].date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {upcomingClasses[0].time}
                  </span>
                </div>
              </div>
              <Button className="gradient-primary border-0 gap-2">
                Join Class <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Upcoming Classes ({upcomingClasses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingClasses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No upcoming classes scheduled
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingClasses.map((session) => (
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
                      <p className="text-sm text-muted-foreground">{session.courseTitle}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(session.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.time}
                        </span>
                        <Badge variant="outline">{session.duration}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2 flex-shrink-0">
                    Join <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Completed Classes ({completedClasses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedClasses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No completed classes yet
            </p>
          ) : (
            <div className="space-y-3">
              {completedClasses.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-muted/30"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      session.attended ? 'bg-success/10' : 'bg-destructive/10'
                    }`}>
                      {session.attended ? (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-muted-foreground">{session.courseTitle}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(session.date)}
                        </span>
                        {session.attended ? (
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            Attended
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                            Missed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
