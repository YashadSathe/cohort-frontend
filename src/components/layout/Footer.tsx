import { Link } from 'react-router-dom';
import { GraduationCap, Twitter, Linkedin, Youtube, Mail } from 'lucide-react';

// Social links configuration - only show icons with valid URLs
const socialLinks = {
  twitter: '', // Empty = hidden
  linkedin: 'https://linkedin.com/company/learnhub',
  youtube: 'https://youtube.com/@learnhub',
  email: 'mailto:contact@learnhub.com',
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-background">LearnHub</span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Transform your career with cohort-based learning. Join thousands of learners mastering new skills with expert mentors.
            </p>
            <div className="flex gap-4">
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-background transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-background transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-background transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {socialLinks.email && (
                <a href={socialLinks.email} className="text-background/70 hover:text-background transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Courses */}
          <div className="space-y-4">
            <h4 className="font-semibold text-background">Courses</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-background/70 hover:text-background transition-colors text-sm">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/courses?category=web-development" className="text-background/70 hover:text-background transition-colors text-sm">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/courses?category=data-science" className="text-background/70 hover:text-background transition-colors text-sm">
                  Data Science
                </Link>
              </li>
              <li>
                <Link to="/courses?category=cloud" className="text-background/70 hover:text-background transition-colors text-sm">
                  Cloud Computing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-background">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-background/70 hover:text-background transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-background transition-colors text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-background transition-colors text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-background transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-background">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-background/70 hover:text-background transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-background transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-background transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-background transition-colors text-sm">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-background/20 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
          <p>© 2024 LearnHub. All rights reserved.</p>
          <p>Made with ❤️ for learners worldwide</p>
        </div>
      </div>
    </footer>
  );
}