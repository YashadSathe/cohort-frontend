import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Users, User, Loader2, Send } from 'lucide-react';
import { cohortStudents } from '@/data/mentorMockData';
import { useToast } from '@/hooks/use-toast';

export default function MentorCommunication() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recipientType, setRecipientType] = useState<'all' | 'selected'>('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === cohortStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(cohortStudents.map(s => s.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in both subject and message.',
        variant: 'destructive',
      });
      return;
    }

    if (recipientType === 'selected' && selectedStudents.length === 0) {
      toast({
        title: 'No recipients',
        description: 'Please select at least one student.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const recipientCount = recipientType === 'all' ? cohortStudents.length : selectedStudents.length;

    toast({
      title: 'Email Sent',
      description: `Your message has been sent to ${recipientCount} student(s).`,
    });

    setIsLoading(false);
    setFormData({ subject: '', message: '' });
    setSelectedStudents([]);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Communication</h1>
        <p className="text-muted-foreground">Send emails to your students</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Compose Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Compose Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <RadioGroup
                    value={recipientType}
                    onValueChange={(value) => setRecipientType(value as 'all' | 'selected')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <label htmlFor="all" className="flex items-center gap-2 cursor-pointer">
                        <Users className="w-4 h-4" />
                        All Students ({cohortStudents.length})
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="selected" id="selected" />
                      <label htmlFor="selected" className="flex items-center gap-2 cursor-pointer">
                        <User className="w-4 h-4" />
                        Select Students
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Important: Upcoming Live Session"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={10}
                    required
                  />
                </div>

                <Button type="submit" className="w-full gradient-primary border-0" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Student Selection */}
          <div className="lg:col-span-1">
            <Card className={recipientType === 'all' ? 'opacity-50' : ''}>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-lg">Select Students</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={recipientType === 'all'}
                >
                  {selectedStudents.length === cohortStudents.length ? 'Deselect All' : 'Select All'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {cohortStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedStudents.includes(student.id) ? 'bg-primary/10' : 'hover:bg-muted'
                      }`}
                      onClick={() => recipientType === 'selected' && handleStudentToggle(student.id)}
                    >
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        disabled={recipientType === 'all'}
                        onCheckedChange={() => handleStudentToggle(student.id)}
                      />
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {recipientType === 'selected' && selectedStudents.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    {selectedStudents.length} student(s) selected
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
