import { useState, useEffect, useCallback, useRef } from 'react';
import { showErrorToast } from '@/lib/api-error-handler';

interface UseAsyncDataOptions {
  /** Show toast on error */
  showToast?: boolean;
  /** Custom error title for toast */
  errorTitle?: string;
  /** Context message for error (e.g., "load courses") */
  errorContext?: string;
  /** Skip initial fetch */
  skip?: boolean;
}

interface UseAsyncDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: UseAsyncDataOptions = {}
): UseAsyncDataResult<T> {
  const { showToast = true, errorTitle, errorContext, skip = false } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<Error | null>(null);
  const toastShownRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (skip) return;
    
    try {
      setLoading(true);
      setError(null);
      toastShownRef.current = false;
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('An error occurred');
      setError(errorObj);
      console.error('useAsyncData error:', err);
      
      // Show toast only once per fetch attempt
      if (showToast && !toastShownRef.current) {
        const title = errorTitle || (errorContext ? `Failed to ${errorContext}` : 'Error loading data');
        showErrorToast(errorObj, title);
        toastShownRef.current = true;
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFn, showToast, errorTitle, errorContext, skip]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// Hook for multiple async calls
interface UseMultipleAsyncDataOptions extends UseAsyncDataOptions {
  /** Only show one combined error toast instead of per-error */
  combineErrors?: boolean;
}

interface UseMultipleAsyncDataResult<T extends Record<string, unknown>> {
  data: Partial<T>;
  loading: boolean;
  errors: Partial<Record<keyof T, Error>>;
  hasErrors: boolean;
  refetch: () => Promise<void>;
}

export function useMultipleAsyncData<T extends Record<string, unknown>>(
  fetchers: { [K in keyof T]: () => Promise<T[K]> },
  dependencies: React.DependencyList = [],
  options: UseMultipleAsyncDataOptions = {}
): UseMultipleAsyncDataResult<T> {
  const { showToast = true, errorTitle, errorContext, combineErrors = true, skip = false } = options;
  
  const [data, setData] = useState<Partial<T>>({});
  const [loading, setLoading] = useState(!skip);
  const [errors, setErrors] = useState<Partial<Record<keyof T, Error>>>({});
  const toastShownRef = useRef(false);

  const fetchAll = useCallback(async () => {
    if (skip) return;
    
    setLoading(true);
    setErrors({});
    toastShownRef.current = false;

    const keys = Object.keys(fetchers) as (keyof T)[];
    const results: Partial<T> = {};
    const newErrors: Partial<Record<keyof T, Error>> = {};

    await Promise.all(
      keys.map(async (key) => {
        try {
          results[key] = await fetchers[key]();
        } catch (err) {
          const errorObj = err instanceof Error ? err : new Error('An error occurred');
          newErrors[key] = errorObj;
          console.error(`useMultipleAsyncData error for ${String(key)}:`, err);
          
          // Show individual error toasts if not combining
          if (showToast && !combineErrors) {
            showErrorToast(errorObj, `Failed to load ${String(key)}`);
          }
        }
      })
    );

    setData(results);
    setErrors(newErrors);
    setLoading(false);
    
    // Show combined error toast
    const errorCount = Object.keys(newErrors).length;
    if (showToast && combineErrors && errorCount > 0 && !toastShownRef.current) {
      const title = errorTitle || (errorContext ? `Failed to ${errorContext}` : 'Error loading data');
      const message = errorCount === 1 
        ? Object.values(newErrors)[0]?.message 
        : `${errorCount} items failed to load`;
      showErrorToast(new Error(message), title);
      toastShownRef.current = true;
    }
  }, [fetchers, showToast, errorTitle, errorContext, combineErrors, skip]);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const hasErrors = Object.keys(errors).length > 0;

  return { data, loading, errors, hasErrors, refetch: fetchAll };
}
