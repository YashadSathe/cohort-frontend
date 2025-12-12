import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Clock, Users, Star, Calendar, CheckCircle2, Play, FileText, Award, 
  ArrowLeft, Linkedin, BookOpen, Target, UserCheck, ListChecks
} from 'lucide-react';
import { getCourseBySlug, getMentorById } from '@/services/api';
import { PaymentModal } from '@/components/payment/PaymentModal';
import type { Course, Mentor } from '@/data/mockData';

export default function CourseDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const courseData = await getCourseBySlug(slug || '');
        setCourse(courseData);

        if (courseData) {
          const mentorData = await getMentorById(courseData.mentorId);
          setMentor(mentorData);
        }
      } catch (error) {
        console.error('Failed to load course:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [slug]);

  // Course overview data (mock - would come from API in real app)
  const courseOverview = {
    whatYouLearn: [
      'Build real-world projects from scratch',
      'Master industry best practices and patterns',
      'Learn to debug and solve complex problems',
      'Collaborate effectively in team environments',
      'Prepare for technical interviews',
      'Create a professional portfolio',
    ],
    targetAudience: [
      'Beginners looking to start a career in tech',
      'Developers wanting to upgrade their skills',
      'Career changers from non-tech backgrounds',
      'Students seeking practical, hands-on experience',
    ],
    requirements: [
      'Basic computer literacy',
      'A laptop with internet connection',
      'Dedication to learn and practice regularly',
      'No prior programming experience required',
    ],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <section className="py-16 bg-gradient-to-br from-secondary via-background to-background">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-32 mb-6" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-96 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-secondary via-background to-background">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/courses')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                  {course.status === 'active' ? 'Enrolling Now' : 'Coming Soon'}
                </Badge>
                <Badge variant="outline">{course.level}</Badge>
                <Badge variant="outline">{course.category}</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                {course.title}
              </h1>

              <p className="text-lg text-muted-foreground">
                {course.longDescription}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-warning fill-warning" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-muted-foreground">({course.totalStudents} students)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-5 h-5" />
                  {course.totalModules} modules • {course.totalTopics} topics
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  Starts {new Date(course.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              {/* Mentor */}
              {mentor && (
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <img 
                    src={mentor.avatar} 
                    alt={mentor.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Your Mentor</p>
                    <p className="font-semibold text-lg">{mentor.name}</p>
                    <p className="text-sm text-muted-foreground">{mentor.experience} experience</p>
                  </div>
                  {mentor.linkedIn && (
                    <a 
                      href={mentor.linkedIn} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar - Pricing Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 overflow-hidden border-primary/20">
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  {course.originalPrice > course.price && (
                    <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground text-sm">
                      {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold">${course.price}</span>
                    {course.originalPrice > course.price && (
                      <span className="text-xl text-muted-foreground line-through">
                        ${course.originalPrice}
                      </span>
                    )}
                  </div>

                  <Button 
                    className="w-full gradient-primary border-0 h-12 text-lg"
                    onClick={() => setIsPaymentOpen(true)}
                  >
                    Enroll Now
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    30-day money-back guarantee
                  </p>

                  <hr className="border-border" />

                  <div className="space-y-3">
                    <p className="font-semibold">This course includes:</p>
                    {course.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Course Overview</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* What You'll Learn */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-primary" />
                    What You'll Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {courseOverview.whatYouLearn.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Target Audience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserCheck className="w-5 h-5 text-accent" />
                    Who This Course Is For
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {courseOverview.targetAudience.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Users className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ListChecks className="w-5 h-5 text-warning" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {courseOverview.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Course Curriculum</h2>

            {course.curriculum.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {course.curriculum.map((module) => (
                  <AccordionItem 
                    key={module.id} 
                    value={module.id}
                    className="border border-border rounded-xl px-6 data-[state=open]:border-primary/50"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-semibold text-primary">{module.order}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{module.title}</h3>
                          <p className="text-sm text-muted-foreground">{module.topics.length} topics</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-4 ml-14">{module.description}</p>
                      <div className="space-y-2 ml-14">
                        {module.topics.map((topic) => (
                          <div key={topic.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Play className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{topic.title}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{topic.duration}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Curriculum details coming soon</p>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      {course.schedule.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">Upcoming Sessions</h2>
              <div className="space-y-4">
                {course.schedule.map((session) => (
                  <Card key={session.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Play className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{session.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {session.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{session.duration}</Badge>
                        <Badge variant={session.status === 'upcoming' ? 'secondary' : 'default'}>
                          {session.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="gradient-primary p-8 md:p-12 text-center">
            <Award className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Join {course.totalStudents}+ students already enrolled in this course and transform your career.
            </p>
            <Button 
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 px-8"
              onClick={() => setIsPaymentOpen(true)}
            >
              Enroll Now - ${course.price}
            </Button>
          </Card>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        course={course}
      />
    </div>
  );
}
