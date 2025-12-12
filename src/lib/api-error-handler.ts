import { toast } from '@/hooks/use-toast';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Error messages for common HTTP status codes
const STATUS_MESSAGES: Record<number, string> = {
  400: 'Invalid request. Please check your input.',
  401: 'Please log in to continue.',
  403: 'You don\'t have permission to perform this action.',
  404: 'The requested resource was not found.',
  408: 'Request timed out. Please try again.',
  409: 'A conflict occurred. Please refresh and try again.',
  422: 'Invalid data provided. Please check your input.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Server error. Please try again later.',
  502: 'Server is temporarily unavailable. Please try again.',
  503: 'Service unavailable. Please try again later.',
  504: 'Request timed out. Please try again.',
};

// Default error messages for common scenarios
const ERROR_PATTERNS: { pattern: RegExp; message: string }[] = [
  { pattern: /network|fetch failed|failed to fetch/i, message: 'Network error. Please check your connection.' },
  { pattern: /timeout|aborted/i, message: 'Request timed out. Please try again.' },
  { pattern: /unauthorized|unauthenticated/i, message: 'Please log in to continue.' },
  { pattern: /forbidden|permission/i, message: 'You don\'t have permission for this action.' },
  { pattern: /not found/i, message: 'The requested resource was not found.' },
];

/**
 * Extracts a user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred.';

  // Handle Error objects
  if (error instanceof Error) {
    // Check for HTTP status in error
    const statusMatch = error.message.match(/HTTP (\d{3})/);
    if (statusMatch) {
      const status = parseInt(statusMatch[1], 10);
      if (STATUS_MESSAGES[status]) {
        return STATUS_MESSAGES[status];
      }
    }

    // Check for known error patterns
    for (const { pattern, message } of ERROR_PATTERNS) {
      if (pattern.test(error.message)) {
        return message;
      }
    }

    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle API error objects
  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    
    if (typeof err.message === 'string') {
      return err.message;
    }
    
    if (typeof err.status === 'number' && STATUS_MESSAGES[err.status]) {
      return STATUS_MESSAGES[err.status];
    }
    
    if (typeof err.error === 'string') {
      return err.error;
    }
  }

  return 'An unexpected error occurred.';
}

/**
 * Shows an error toast notification
 */
export function showErrorToast(error: unknown, title?: string): void {
  const message = getErrorMessage(error);
  
  toast({
    variant: 'destructive',
    title: title || 'Error',
    description: message,
  });
}

/**
 * Shows a success toast notification
 */
export function showSuccessToast(message: string, title?: string): void {
  toast({
    title: title || 'Success',
    description: message,
  });
}

/**
 * Shows a warning toast notification
 */
export function showWarningToast(message: string, title?: string): void {
  toast({
    title: title || 'Warning',
    description: message,
  });
}

/**
 * Wraps an async function and shows error toast on failure
 */
export async function withErrorToast<T>(
  fn: () => Promise<T>,
  options?: {
    errorTitle?: string;
    successMessage?: string;
    successTitle?: string;
    showSuccessToast?: boolean;
  }
): Promise<T | null> {
  try {
    const result = await fn();
    
    if (options?.showSuccessToast && options?.successMessage) {
      showSuccessToast(options.successMessage, options.successTitle);
    }
    
    return result;
  } catch (error) {
    showErrorToast(error, options?.errorTitle);
    return null;
  }
}

/**
 * Hook-friendly error handler that can be used with useAsyncData
 */
export function handleApiError(error: Error | null, context?: string): void {
  if (error) {
    const title = context ? `Failed to ${context}` : 'Error';
    showErrorToast(error, title);
  }
}
