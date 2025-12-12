import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

interface LoadingContextType {
  isLoading: boolean;
  loadingKeys: string[];
  startLoading: (key?: string) => void;
  stopLoading: (key?: string) => void;
  isLoadingKey: (key: string) => boolean;
  withLoading: <T>(fn: () => Promise<T>, key?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

const DEFAULT_KEY = '__global__';

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingState, setLoadingState] = useState<LoadingState>({});

  const startLoading = useCallback((key: string = DEFAULT_KEY) => {
    setLoadingState(prev => ({ ...prev, [key]: true }));
  }, []);

  const stopLoading = useCallback((key: string = DEFAULT_KEY) => {
    setLoadingState(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const isLoadingKey = useCallback((key: string) => {
    return !!loadingState[key];
  }, [loadingState]);

  const withLoading = useCallback(async <T,>(fn: () => Promise<T>, key: string = DEFAULT_KEY): Promise<T> => {
    startLoading(key);
    try {
      return await fn();
    } finally {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  const loadingKeys = Object.keys(loadingState);
  const isLoading = loadingKeys.length > 0;

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingKeys,
        startLoading,
        stopLoading,
        isLoadingKey,
        withLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

// Hook for component-level loading with automatic cleanup
export function useLoadingState(key: string) {
  const { isLoadingKey, startLoading, stopLoading, withLoading } = useLoading();
  
  return {
    isLoading: isLoadingKey(key),
    start: () => startLoading(key),
    stop: () => stopLoading(key),
    wrap: <T,>(fn: () => Promise<T>) => withLoading(fn, key),
  };
}
