import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Linkedin } from 'lucide-react';
import { getAllMentors } from '@/services/api';
import type { Mentor } from '@/data/mockData';

export function MentorsSection() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMentors = async () => {
      try {
        const data = await getAllMentors();
        setMentors(data.slice(0, 4)); // Show first 4 mentors
      } catch (error) {
        console.error('Failed to load mentors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMentors();
  }, []);

  if (isLoading) {
    return (
      <section id="mentors" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Skeleton className="h-6 w-32 mx-auto mb-4" />
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="mentors" className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">Expert Mentors</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Learn from Industry Leaders
          </h2>
          <p className="text-lg text-muted-foreground">
            Our mentors are experienced professionals who are passionate about teaching and helping you succeed in your career.
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor, index) => (
            <Card 
              key={mentor.id} 
              className="overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <img 
                    src={mentor.avatar} 
                    alt={mentor.name}
                    className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-primary/20"
                  />
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{mentor.name}</h3>
                    {mentor.linkedIn && (
                      <a 
                        href={mentor.linkedIn} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{mentor.experience} experience</p>
                </div>

                <p className="text-muted-foreground mt-4 text-sm leading-relaxed line-clamp-3">
                  {mentor.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
                  {mentor.expertise.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
