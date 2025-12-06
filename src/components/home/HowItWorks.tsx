import { Badge } from '@/components/ui/badge';
import { Search, CreditCard, Video, FileText, Award } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Explore Courses',
    description: 'Browse our curated selection of cohort-based courses taught by industry experts. Find the perfect course that matches your career goals.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: CreditCard,
    title: 'Enroll & Pay',
    description: 'Choose your preferred payment method - full payment, EMI, or UPI. Apply coupon codes for instant discounts on enrollment.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Video,
    title: 'Attend Live Classes',
    description: 'Join interactive live sessions with your mentor and cohort peers. Get real-time feedback, ask questions, and learn collaboratively.',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: FileText,
    title: 'Submit Assignments',
    description: 'Complete hands-on projects and submit your work via public links (GitHub, Google Drive). Get personalized feedback from mentors.',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    icon: Award,
    title: 'Get Certified',
    description: 'Upon completing all modules and assignments, receive your certificate of completion. Showcase your achievement to employers.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Learning Journey
          </h2>
          <p className="text-lg text-muted-foreground">
            A simple 5-step process to transform your career through cohort-based learning
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${step.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Connector Line (hidden on last item and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}