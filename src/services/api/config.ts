// API Configuration
// TODO: Replace with actual API base URL in production
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Flag to switch between mock and real API
// Set VITE_USE_MOCK_API=false in .env to use real API
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Helper for simulating network delay in mock implementations
export const simulateNetworkDelay = (ms: number = 300): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

// Default delay for mock API calls
export const DEFAULT_DELAY = 300;

// Retry configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};

// Errors that should trigger a retry
const RETRYABLE_ERRORS = ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ENETUNREACH', 'fetch failed'];

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error, delay: number) => void;
}

/**
 * Determines if an error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    // Check for network errors
    if (RETRYABLE_ERRORS.some(e => error.message.toLowerCase().includes(e.toLowerCase()))) {
      return true;
    }
    // Check for fetch AbortError (timeout)
    if (error.name === 'AbortError') {
      return true;
    }
  }
  return false;
}

/**
 * Determines if a response status code is retryable
 */
function isRetryableStatusCode(status: number): boolean {
  return RETRY_CONFIG.retryableStatusCodes.includes(status);
}

/**
 * Calculates delay with exponential backoff and jitter
 */
function calculateDelay(attempt: number, options: Required<Pick<RetryOptions, 'baseDelay' | 'maxDelay' | 'backoffMultiplier'>>): number {
  const exponentialDelay = options.baseDelay * Math.pow(options.backoffMultiplier, attempt - 1);
  // Add jitter (±25%) to prevent thundering herd
  const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1);
  return Math.min(exponentialDelay + jitter, options.maxDelay);
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wraps an async function with retry logic using exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = RETRY_CONFIG.maxRetries,
    baseDelay = RETRY_CONFIG.baseDelay,
    maxDelay = RETRY_CONFIG.maxDelay,
    backoffMultiplier = RETRY_CONFIG.backoffMultiplier,
    onRetry,
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on the last attempt
      if (attempt > maxRetries) {
        break;
      }

      // Check if error is retryable
      const shouldRetry = isRetryableError(error);
      
      if (!shouldRetry) {
        throw lastError;
      }

      // Calculate delay with exponential backoff
      const delay = calculateDelay(attempt, { baseDelay, maxDelay, backoffMultiplier });

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(attempt, lastError, delay);
      }

      console.warn(`Retry attempt ${attempt}/${maxRetries} after ${Math.round(delay)}ms:`, lastError.message);

      // Wait before retrying
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Enhanced fetch with retry logic and timeout
 */
export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit & { timeout?: number; retryOptions?: RetryOptions }
): Promise<Response> {
  const { timeout = 30000, retryOptions, ...fetchInit } = init || {};

  return withRetry(async () => {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(input, {
        ...fetchInit,
        signal: controller.signal,
      });

      // Check if status code is retryable
      if (isRetryableStatusCode(response.status)) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        throw error;
      }

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }, retryOptions);
}

/**
 * Wrapper for API calls that handles common error scenarios
 */
export async function apiCall<T>(
  fn: () => Promise<T>,
  options?: RetryOptions & { fallback?: T }
): Promise<T> {
  try {
    return await withRetry(fn, options);
  } catch (error) {
    if (options?.fallback !== undefined) {
      console.warn('API call failed, using fallback:', error);
      return options.fallback;
    }
    throw error;
  }
}
