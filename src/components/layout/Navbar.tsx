import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/courses" 
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              Courses
            </Link>
            <Link 
              to="/#how-it-works" 
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link 
              to="/#mentors" 
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              Mentors
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  Login <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/login')}>
                  Student Login
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/mentor/login')}>
                  Mentor Login
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/login')}>
                  Admin Login
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => navigate('/signup')} className="gradient-primary border-0">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link 
                to="/courses" 
                className="text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Courses
              </Link>
              <Link 
                to="/#how-it-works" 
                className="text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                to="/#mentors" 
                className="text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Mentors
              </Link>
              <hr className="border-border/50" />
              <Link 
                to="/login" 
                className="text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Student Login
              </Link>
              <Link 
                to="/mentor/login" 
                className="text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Mentor Login
              </Link>
              <Link 
                to="/admin/login" 
                className="text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Admin Login
              </Link>
              <Button onClick={() => { navigate('/signup'); setIsOpen(false); }} className="gradient-primary border-0 w-full">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
