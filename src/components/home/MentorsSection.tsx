import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin } from 'lucide-react';

const mentorData = [
  {
    id: 'mentor-1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: 'Full-stack developer with 10+ years of experience. Former tech lead at Google and startup founder. Passionate about teaching and helping developers grow.',
    expertise: ['React', 'Node.js', 'System Design', 'TypeScript'],
    experience: '10+ years',
    linkedIn: 'https://linkedin.com/in/sarahchen',
  },
  {
    id: 'mentor-2',
    name: 'David Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Data scientist and ML engineer with expertise in Python, TensorFlow, and MLOps. Previously at Amazon AWS AI team.',
    expertise: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow'],
    experience: '8 years',
    linkedIn: 'https://linkedin.com/in/davidkumar',
  },
  {
    id: 'mentor-3',
    name: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    bio: 'Backend specialist with deep expertise in cloud architecture and DevOps. AWS certified solutions architect.',
    expertise: ['AWS', 'Docker', 'Kubernetes', 'Go'],
    experience: '7 years',
    linkedIn: 'https://linkedin.com/in/emilyrodriguez',
  },
  {
    id: 'mentor-4',
    name: 'Michael Park',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    bio: 'Senior software architect specializing in distributed systems and microservices. 12+ years building scalable platforms.',
    expertise: ['Java', 'Microservices', 'System Design', 'Kubernetes'],
    experience: '12 years',
    linkedIn: 'https://linkedin.com/in/michaelpark',
  },
];

export function MentorsSection() {
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
          {mentorData.map((mentor, index) => (
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
