import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import { showErrorToast, showSuccessToast } from '@/lib/api-error-handler';
import type { RegisterData } from '@/services/api';

const AUTH_LOADING_KEYS = {
  login: 'auth:login',
  logout: 'auth:logout',
  register: 'auth:register',
} as const;

interface UseAuthWithLoadingResult {
  login: (email: string, password: string, role: 'student' | 'mentor' | 'admin') => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isRegistering: boolean;
  isAuthLoading: boolean;
}

export function useAuthWithLoading(): UseAuthWithLoadingResult {
  const auth = useAuth();
  const { startLoading, stopLoading, isLoadingKey } = useLoading();
  
  const [localLoggingIn, setLocalLoggingIn] = useState(false);
  const [localLoggingOut, setLocalLoggingOut] = useState(false);
  const [localRegistering, setLocalRegistering] = useState(false);

  const login = useCallback(async (
    email: string, 
    password: string, 
    role: 'student' | 'mentor' | 'admin'
  ): Promise<boolean> => {
    startLoading(AUTH_LOADING_KEYS.login);
    setLocalLoggingIn(true);
    
    try {
      const success = await auth.login(email, password, role);
      
      if (success) {
        showSuccessToast('Welcome back!', 'Login successful');
      } else {
        showErrorToast('Invalid email or password. Please try again.', 'Login failed');
      }
      
      return success;
    } catch (error) {
      showErrorToast(error, 'Login failed');
      return false;
    } finally {
      stopLoading(AUTH_LOADING_KEYS.login);
      setLocalLoggingIn(false);
    }
  }, [auth, startLoading, stopLoading]);

  const logout = useCallback(() => {
    startLoading(AUTH_LOADING_KEYS.logout);
    setLocalLoggingOut(true);
    
    try {
      auth.logout();
      showSuccessToast('You have been logged out.', 'Goodbye!');
    } finally {
      stopLoading(AUTH_LOADING_KEYS.logout);
      setLocalLoggingOut(false);
    }
  }, [auth, startLoading, stopLoading]);

  const register = useCallback(async (userData: RegisterData): Promise<boolean> => {
    startLoading(AUTH_LOADING_KEYS.register);
    setLocalRegistering(true);
    
    try {
      const success = await auth.register(userData);
      
      if (success) {
        showSuccessToast('Your account has been created successfully!', 'Registration complete');
      } else {
        showErrorToast('Registration failed. Please try again.', 'Registration failed');
      }
      
      return success;
    } catch (error) {
      showErrorToast(error, 'Registration failed');
      return false;
    } finally {
      stopLoading(AUTH_LOADING_KEYS.register);
      setLocalRegistering(false);
    }
  }, [auth, startLoading, stopLoading]);

  const isLoggingIn = localLoggingIn || isLoadingKey(AUTH_LOADING_KEYS.login);
  const isLoggingOut = localLoggingOut || isLoadingKey(AUTH_LOADING_KEYS.logout);
  const isRegistering = localRegistering || isLoadingKey(AUTH_LOADING_KEYS.register);
  const isAuthLoading = isLoggingIn || isLoggingOut || isRegistering;

  return {
    login,
    logout,
    register,
    isLoggingIn,
    isLoggingOut,
    isRegistering,
    isAuthLoading,
  };
}

// Export loading keys for external use
export { AUTH_LOADING_KEYS };
