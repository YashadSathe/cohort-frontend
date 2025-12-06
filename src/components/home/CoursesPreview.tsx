import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, Users, Star } from 'lucide-react';
import { courses, getMentorById } from '@/data/mockData';

export function CoursesPreview() {
  const navigate = useNavigate();
  const featuredCourses = courses.slice(0, 3);

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">Featured Courses</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Learning Journey
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose from our carefully designed cohort-based courses taught by industry experts
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course, index) => {
            const mentor = getMentorById(course.mentorId);
            return (
              <Card 
                key={course.id} 
                className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl cursor-pointer animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/courses/${course.slug}`)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge 
                    className="absolute top-3 left-3"
                    variant={course.status === 'active' ? 'default' : 'secondary'}
                  >
                    {course.status === 'active' ? 'Enrolling Now' : 'Coming Soon'}
                  </Badge>
                  {course.originalPrice > course.price && (
                    <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                      {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{course.level}</Badge>
                    <span>•</span>
                    <span>{course.category}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.totalStudents} students
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      {course.rating}
                    </div>
                  </div>

                  {mentor && (
                    <div className="flex items-center gap-3 pt-2 border-t border-border">
                      <img 
                        src={mentor.avatar} 
                        alt={mentor.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{mentor.name}</p>
                        <p className="text-xs text-muted-foreground">{mentor.experience} experience</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">${course.price}</span>
                      {course.originalPrice > course.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${course.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button size="sm" variant="ghost" className="group-hover:text-primary">
                      View Details <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate('/courses')}
          >
            View All Courses <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
