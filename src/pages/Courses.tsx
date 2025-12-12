import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Clock, Users, Star, ArrowRight, Filter } from 'lucide-react';
import { getAllCourses, getMentorById } from '@/services/api';
import type { Course, Mentor } from '@/data/mockData';

const categories = ['All', 'Web Development', 'Data Science', 'Cloud Computing', 'System Design'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Courses() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [courses, setCourses] = useState<Course[]>([]);
  const [mentors, setMentors] = useState<Map<string, Mentor>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allCourses = await getAllCourses();
        setCourses(allCourses);

        // Load mentors for all courses
        const mentorMap = new Map<string, Mentor>();
        const uniqueMentorIds = [...new Set(allCourses.map(c => c.mentorId))];
        await Promise.all(
          uniqueMentorIds.map(async (mentorId) => {
            const mentor = await getMentorById(mentorId);
            if (mentor) mentorMap.set(mentorId, mentor);
          })
        );
        setMentors(mentorMap);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredCourses = useMemo(() => {
    let result = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });

    // Sort
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.totalStudents - a.totalStudents);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [courses, searchQuery, selectedCategory, selectedLevel, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <section className="py-16 bg-gradient-to-br from-secondary via-background to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Skeleton className="h-12 w-80 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-xl" />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-secondary via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Our <span className="gradient-text">Courses</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Find the perfect course to accelerate your career with cohort-based learning
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-16 bg-background/95 backdrop-blur z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search courses..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filters:</span>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredCourses.length}</span> courses
            </p>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No courses found matching your criteria</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => {
                const mentor = mentors.get(course.mentorId);
                return (
                  <Card 
                    key={course.id} 
                    className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl cursor-pointer animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
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
                          {course.totalStudents}
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
                            <p className="text-xs text-muted-foreground">{mentor.experience}</p>
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
                          View <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
