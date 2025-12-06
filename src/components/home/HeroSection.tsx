import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Users, Star, Clock } from 'lucide-react';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Star className="w-4 h-4 fill-primary" />
              Rated 4.9/5 by 10,000+ learners
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Learn Together,{' '}
              <span className="gradient-text">Grow Together</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Join cohort-based courses with live sessions, expert mentors, and a community of motivated learners. Transform your career in weeks, not years.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="gradient-primary border-0 text-lg h-14 px-8"
                onClick={() => navigate('/courses')}
              >
                Explore Courses <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg h-14 px-8 gap-2"
              >
                <Play className="w-5 h-5" /> Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">10K+</p>
                  <p className="text-sm text-muted-foreground">Active Learners</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4.9</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">95%</p>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-3xl rotate-3 scale-105 opacity-20" />
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                alt="Students learning together"
                className="relative rounded-3xl shadow-2xl"
              />
              
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-xl border border-border animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Live Cohorts</p>
                    <p className="text-sm text-muted-foreground">Join 500+ peers</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-card p-4 rounded-2xl shadow-xl border border-border animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-warning fill-warning" />
                  <Star className="w-5 h-5 text-warning fill-warning" />
                  <Star className="w-5 h-5 text-warning fill-warning" />
                  <Star className="w-5 h-5 text-warning fill-warning" />
                  <Star className="w-5 h-5 text-warning fill-warning" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">1,200+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
