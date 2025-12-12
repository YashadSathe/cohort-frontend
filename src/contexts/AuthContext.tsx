import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { login as apiLogin, registerStudent } from '@/services/api';
import type { AuthUser, RegisterData } from '@/services/api';

interface AuthContextType {
  user: AuthUser;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'student' | 'mentor' | 'admin') => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
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
    try {
      const foundUser = await apiLogin({ email, password, role });
      if (foundUser) {
        setUser(foundUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const newUser = await registerStudent(userData);
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const clearAllData = () => {
    localStorage.clear();
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