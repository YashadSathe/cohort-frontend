import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Student, Mentor, Admin, students, mentors, admins } from '@/data/mockData';

type AuthUser = Student | Mentor | Admin | null;

interface AuthContextType {
  user: AuthUser;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'student' | 'mentor' | 'admin') => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<Student>) => Promise<boolean>;
  clearAllData: () => void;
}

const AUTH_STORAGE_KEY = 'learnhub_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(() => {
    // Initialize from localStorage on mount
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse stored auth', e);
    }
    return null;
  });

  // Persist user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string, role: 'student' | 'mentor' | 'admin'): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let foundUser: AuthUser = null;

    if (role === 'student') {
      foundUser = students.find(s => s.email === email && s.password === password) || null;
    } else if (role === 'mentor') {
      foundUser = mentors.find(m => m.email === email && m.password === password) || null;
    } else if (role === 'admin') {
      foundUser = admins.find(a => a.email === email && a.password === password) || null;
    }

    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const register = async (userData: Partial<Student>): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would create a new user
    // For mock purposes, we'll just return success
    const newUser: Student = {
      id: `student-${Date.now()}`,
      email: userData.email || '',
      password: userData.password || '',
      name: userData.name || '',
      phone: userData.phone || '',
      city: userData.city || '',
      state: userData.state || '',
      country: userData.country || '',
      college: userData.college,
      role: 'student',
      enrolledCourses: [],
      completedCourses: [],
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    
    setUser(newUser);
    return true;
  };

  const clearAllData = () => {
    // Clear all localStorage data
    localStorage.clear();
    
    // Reset user state
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register, clearAllData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}