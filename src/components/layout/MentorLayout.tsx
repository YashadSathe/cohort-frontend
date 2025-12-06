import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Video,
  FileText,
  Users,
  Award,
  Mail,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ClipboardCheck,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { getPendingSubmissions } from '@/data/mentorMockData';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/mentor/dashboard' },
  { icon: BookOpen, label: 'My Courses', href: '/mentor/courses' },
  { icon: Video, label: 'Sessions', href: '/mentor/sessions' },
  { icon: FileText, label: 'Assignments', href: '/mentor/assignments' },
  { icon: ClipboardCheck, label: 'Submissions', href: '/mentor/submissions', badge: true },
  { icon: Users, label: 'Students', href: '/mentor/students' },
  { icon: Award, label: 'Certificates', href: '/mentor/certificates' },
  { icon: Mail, label: 'Communication', href: '/mentor/communication' },
  { icon: BarChart3, label: 'Reports', href: '/mentor/reports' },
];

export function MentorLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pendingCount = getPendingSubmissions().length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 flex items-center px-4">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 hover:bg-muted rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block">LearnHub</span>
            <Badge variant="secondary" className="hidden sm:inline-flex">Mentor</Badge>
          </NavLink>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="gradient-primary text-primary-foreground text-sm">
                    {user?.name?.charAt(0) || 'M'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium">{user?.name || 'Mentor'}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/mentor/profile')}>
                <User className="w-4 h-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/mentor/settings')}>
                <Settings className="w-4 h-4 mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 bottom-0 w-64 bg-background border-r border-border z-40 transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.badge && pendingCount > 0 && (
                <Badge variant="secondary" className="ml-auto bg-accent text-accent-foreground">
                  {pendingCount}
                </Badge>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-1">
          <NavLink
            to="/mentor/profile"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </NavLink>
          <NavLink
            to="/mentor/settings"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </NavLink>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
