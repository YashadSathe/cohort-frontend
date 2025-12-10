import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Student, Mentor, Admin } from '@/data/mockData';

const API_URL = 'http://localhost:3000';

type AuthUser = Student | Mentor | Admin | null;

interface AuthContextType {
  user: AuthUser;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<Student>) => Promise<boolean>;
  clearAllData: () => void;
}

const AUTH_STORAGE_KEY = 'learnhub_auth_user';
const TOKEN_STORAGE_KEY = 'learnhub_auth_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Failed to parse stored auth', e);
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [user, token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login failed:', data.message);
        return false;
      }

      setUser(data.data.user);
      setToken(data.data.token);
      
      return true;
    } catch (error) {
      console.error('Network error during login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };


  const register = async (userData: Partial<Student>): Promise<boolean> => {
    try {
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'student', // Defaulting to student for public signup
      };

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Registration failed:', data.message);
        return false;
      }

      // Auto login after signup (depends on backend tho)
      if (data.data && data.data.token) {
         setUser(data.data.user);
         setToken(data.data.token);
      }
      
      return true;
    } catch (error) {
      console.error('Network error during registration:', error);
      return false;
    }
  };

  const clearAllData = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout, register, clearAllData }}>
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