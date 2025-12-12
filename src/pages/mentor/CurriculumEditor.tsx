import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  BookOpen,
  Clock,
  Save,
  Loader2,
} from 'lucide-react';
import { getCourseById, updateCourseCurriculum } from '@/services/api';
import type { Course, Module, Topic } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';

export default function CurriculumEditor() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingTopic, setEditingTopic] = useState<{ moduleId: string; topic: Topic } | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [moduleForm, setModuleForm] = useState({ title: '', description: '' });
  const [topicForm, setTopicForm] = useState({ title: '', duration: '' });

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      try {
        const courseData = await getCourseById(courseId);
        if (courseData) {
          setCourse(courseData);
          setModules(courseData.curriculum || []);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (isPageLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="flex-1">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <Button onClick={() => navigate('/mentor/courses')}>Back to Courses</Button>
      </div>
    );
  }

  // Module handlers
  const handleAddModule = () => {
    setEditingModule(null);
    setModuleForm({ title: '', description: '' });
    setIsModuleModalOpen(true);
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setModuleForm({ title: module.title, description: module.description });
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = () => {
    if (!moduleForm.title.trim()) {
      toast({ title: 'Error', description: 'Module title is required', variant: 'destructive' });
      return;
    }

    if (editingModule) {
      // Edit existing module
      setModules(prev =>
        prev.map(m =>
          m.id === editingModule.id
            ? { ...m, title: moduleForm.title, description: moduleForm.description }
            : m
        )
      );
      toast({ title: 'Module Updated', description: 'Module has been updated successfully.' });
    } else {
      // Add new module
      const newModule: Module = {
        id: `mod-${Date.now()}`,
        title: moduleForm.title,
        description: moduleForm.description,
        order: modules.length + 1,
        topics: [],
      };
      setModules(prev => [...prev, newModule]);
      toast({ title: 'Module Added', description: 'New module has been added.' });
    }

    setIsModuleModalOpen(false);
    setModuleForm({ title: '', description: '' });
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
    toast({ title: 'Module Deleted', description: 'Module has been removed.' });
  };

  // Topic handlers
  const handleAddTopic = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setEditingTopic(null);
    setTopicForm({ title: '', duration: '' });
    setIsTopicModalOpen(true);
  };

  const handleEditTopic = (moduleId: string, topic: Topic) => {
    setSelectedModuleId(moduleId);
    setEditingTopic({ moduleId, topic });
    setTopicForm({ title: topic.title, duration: topic.duration });
    setIsTopicModalOpen(true);
  };

  const handleSaveTopic = () => {
    if (!topicForm.title.trim() || !selectedModuleId) {
      toast({ title: 'Error', description: 'Topic title is required', variant: 'destructive' });
      return;
    }

    if (editingTopic) {
      // Edit existing topic
      setModules(prev =>
        prev.map(m =>
          m.id === selectedModuleId
            ? {
                ...m,
                topics: m.topics.map(t =>
                  t.id === editingTopic.topic.id
                    ? { ...t, title: topicForm.title, duration: topicForm.duration || '1 hour' }
                    : t
                ),
              }
            : m
        )
      );
      toast({ title: 'Topic Updated', description: 'Topic has been updated successfully.' });
    } else {
      // Add new topic
      const module = modules.find(m => m.id === selectedModuleId);
      const newTopic: Topic = {
        id: `t-${Date.now()}`,
        title: topicForm.title,
        duration: topicForm.duration || '1 hour',
        order: (module?.topics.length || 0) + 1,
      };

      setModules(prev =>
        prev.map(m =>
          m.id === selectedModuleId
            ? { ...m, topics: [...m.topics, newTopic] }
            : m
        )
      );
      toast({ title: 'Topic Added', description: 'New topic has been added.' });
    }

    setIsTopicModalOpen(false);
    setTopicForm({ title: '', duration: '' });
  };

  const handleDeleteTopic = (moduleId: string, topicId: string) => {
    setModules(prev =>
      prev.map(m =>
        m.id === moduleId
          ? { ...m, topics: m.topics.filter(t => t.id !== topicId) }
          : m
      )
    );
    toast({ title: 'Topic Deleted', description: 'Topic has been removed.' });
  };

  const handleSaveCurriculum = async () => {
    setIsSaving(true);
    
    try {
      if (courseId) {
        await updateCourseCurriculum(courseId, modules);
      }
      toast({ title: 'Curriculum Saved', description: 'All changes have been saved successfully.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save curriculum.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const totalTopics = modules.reduce((acc, m) => acc + m.topics.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/mentor/courses')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Curriculum Editor</h1>
          <p className="text-muted-foreground">{course.title}</p>
        </div>
        <Button onClick={handleSaveCurriculum} className="gradient-primary border-0" disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{modules.length}</p>
              <p className="text-sm text-muted-foreground">Modules</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalTopics}</p>
              <p className="text-sm text-muted-foreground">Topics</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modules List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Modules</CardTitle>
          <Button onClick={handleAddModule}>
            <Plus className="w-4 h-4 mr-2" /> Add Module
          </Button>
        </CardHeader>
        <CardContent>
          {modules.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No modules yet. Add your first module to get started.</p>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-3">
              {modules.map((module, index) => (
                <AccordionItem
                  key={module.id}
                  value={module.id}
                  className="border rounded-xl px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3 text-left">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{module.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {module.topics.length} topics
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-4 pt-2">
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditModule(module)}>
                          <Edit2 className="w-4 h-4 mr-1" /> Edit Module
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteModule(module.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>

                      {/* Topics */}
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Topics</h4>
                          <Button variant="ghost" size="sm" onClick={() => handleAddTopic(module.id)}>
                            <Plus className="w-4 h-4 mr-1" /> Add Topic
                          </Button>
                        </div>
                        
                        {module.topics.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-4 text-center">
                            No topics in this module yet.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {module.topics.map((topic, topicIndex) => (
                              <div
                                key={topic.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 group"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-muted-foreground w-6">
                                    {index + 1}.{topicIndex + 1}
                                  </span>
                                  <span className="text-sm">{topic.title}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ({topic.duration})
                                  </span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleEditTopic(module.id, topic)}
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteTopic(module.id, topic.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Module Modal */}
      <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingModule ? 'Edit Module' : 'Add New Module'}</DialogTitle>
            <DialogDescription>
              {editingModule ? 'Update the module details below.' : 'Create a new module for your course.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="moduleTitle">Module Title *</Label>
              <Input
                id="moduleTitle"
                placeholder="e.g., Introduction to React"
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moduleDescription">Description</Label>
              <Textarea
                id="moduleDescription"
                placeholder="Brief description of this module"
                value={moduleForm.description}
                onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModuleModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveModule} className="flex-1 gradient-primary border-0">
                {editingModule ? 'Update Module' : 'Add Module'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Topic Modal */}
      <Dialog open={isTopicModalOpen} onOpenChange={setIsTopicModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTopic ? 'Edit Topic' : 'Add New Topic'}</DialogTitle>
            <DialogDescription>
              {editingTopic ? 'Update the topic details below.' : 'Add a new topic to this module.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topicTitle">Topic Title *</Label>
              <Input
                id="topicTitle"
                placeholder="e.g., Components & JSX"
                value={topicForm.title}
                onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topicDuration">Duration</Label>
              <Input
                id="topicDuration"
                placeholder="e.g., 2 hours"
                value={topicForm.duration}
                onChange={(e) => setTopicForm({ ...topicForm, duration: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsTopicModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveTopic} className="flex-1 gradient-primary border-0">
                {editingTopic ? 'Update Topic' : 'Add Topic'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
