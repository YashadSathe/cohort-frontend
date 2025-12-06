import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Video,
  FileText,
  Megaphone,
  Award,
  CheckCheck,
  Circle,
} from 'lucide-react';
import { notifications } from '@/data/studentMockData';

export default function Notifications() {
  const navigate = useNavigate();
  const [notificationList, setNotificationList] = useState(notifications);

  const unreadCount = notificationList.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'class':
        return <Video className="w-5 h-5 text-primary" />;
      case 'assignment':
        return <FileText className="w-5 h-5 text-accent" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-warning" />;
      case 'certificate':
        return <Award className="w-5 h-5 text-success" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    // Mark as read
    setNotificationList(prev =>
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );

    // Navigate if link exists
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` 
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} className="gap-2">
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            All Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2">{unreadCount} new</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notificationList.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notificationList.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
                    notification.read
                      ? 'bg-muted/30 hover:bg-muted/50'
                      : 'bg-primary/5 border border-primary/20 hover:bg-primary/10'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notification.read ? 'bg-muted' : 'bg-primary/10'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Circle className="w-2 h-2 fill-primary text-primary flex-shrink-0" />
                        )}
                        <p className={`font-medium ${notification.read ? 'text-muted-foreground' : ''}`}>
                          {notification.title}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
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
