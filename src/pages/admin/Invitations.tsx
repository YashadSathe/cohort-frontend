import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  UserPlus,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  RefreshCw,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  getMentorInvitations,
  sendMentorInvitation,
  resendMentorInvitation,
  deleteMentorInvitation,
} from '@/services/api';
import type { MentorInvitation } from '@/data/adminMockData';
import { useToast } from '@/hooks/use-toast';

export default function AdminInvitations() {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<MentorInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const loadInvitations = async () => {
      try {
        const data = await getMentorInvitations();
        setInvitations(data);
      } catch (error) {
        console.error('Failed to load invitations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load invitations',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadInvitations();
  }, [toast]);

  const handleSendInvitation = async () => {
    if (!newInvite.email || !newInvite.name) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const invitation = await sendMentorInvitation(newInvite.email, newInvite.name);
      setInvitations([invitation, ...invitations]);
      setIsInviteOpen(false);
      setNewInvite({ name: '', email: '' });

      toast({
        title: 'Invitation sent',
        description: `Invitation sent to ${newInvite.email}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  const handleResendInvitation = async (invitation: MentorInvitation) => {
    try {
      const updated = await resendMentorInvitation(invitation.id);
      setInvitations(invitations.map((i) => (i.id === invitation.id ? updated : i)));
      toast({
        title: 'Invitation resent',
        description: `New invitation sent to ${invitation.email}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend invitation',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteInvitation = async (id: string) => {
    try {
      await deleteMentorInvitation(id);
      setInvitations(invitations.filter((inv) => inv.id !== id));
      toast({
        title: 'Invitation deleted',
        description: 'The invitation has been removed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete invitation',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: MentorInvitation['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'accepted':
        return (
          <Badge variant="secondary" className="bg-success/10 text-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Accepted
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="secondary" className="bg-destructive/10 text-destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
    }
  };

  const pendingCount = invitations.filter((i) => i.status === 'pending').length;
  const acceptedCount = invitations.filter((i) => i.status === 'accepted').length;
  const expiredCount = invitations.filter((i) => i.status === 'expired').length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mentor Invitations</h1>
          <p className="text-muted-foreground">Invite new mentors to join the platform</p>
        </div>

        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Mentor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New Mentor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={newInvite.name}
                  onChange={(e) => setNewInvite({ ...newInvite, name: e.target.value })}
                  placeholder="Enter mentor's full name"
                />
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={newInvite.email}
                  onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                  placeholder="mentor@example.com"
                />
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  An invitation email will be sent with a link to complete registration.
                  The invitation will expire in 7 days.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendInvitation} className="gradient-primary border-0" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                  Send Invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/10">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{acceptedCount}</p>
              <p className="text-sm text-muted-foreground">Accepted</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{expiredCount}</p>
              <p className="text-sm text-muted-foreground">Expired</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invitations List */}
      <Card>
        <CardHeader>
          <CardTitle>All Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No invitations sent yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {invitation.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{invitation.name}</p>
                      <p className="text-sm text-muted-foreground">{invitation.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Invited: {invitation.invitedAt}</p>
                      <p className="text-muted-foreground">Expires: {invitation.expiresAt}</p>
                    </div>
                    {getStatusBadge(invitation.status)}
                    <div className="flex gap-2">
                      {invitation.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResendInvitation(invitation)}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteInvitation(invitation.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
