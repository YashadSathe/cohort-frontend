import { useLoading } from '@/contexts/LoadingContext';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlobalLoadingOverlayProps {
  /** Only show for specific loading keys */
  keys?: string[];
  /** Custom loading text */
  text?: string;
  /** Show as fullscreen overlay */
  fullscreen?: boolean;
  /** Blur background content */
  blur?: boolean;
}

export function GlobalLoadingOverlay({
  keys,
  text,
  fullscreen = true,
  blur = true,
}: GlobalLoadingOverlayProps) {
  const { isLoading, loadingKeys, isLoadingKey } = useLoading();

  // Check if we should show based on keys filter
  const shouldShow = keys 
    ? keys.some(key => isLoadingKey(key))
    : isLoading;

  if (!shouldShow) return null;

  return (
    <div
      className={cn(
        'z-[100] flex items-center justify-center bg-background/80',
        fullscreen ? 'fixed inset-0' : 'absolute inset-0',
        blur && 'backdrop-blur-sm'
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="relative w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
        {text && (
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  text?: string;
  blur?: boolean;
  className?: string;
}

export function LoadingOverlay({ 
  loading, 
  children, 
  text, 
  blur = true,
  className 
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {loading && (
        <div
          className={cn(
            'absolute inset-0 z-50 flex items-center justify-center bg-background/80',
            blur && 'backdrop-blur-sm'
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            {text && (
              <p className="text-sm font-medium text-muted-foreground">{text}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface InlineLoadingProps {
  loading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function InlineLoading({ loading, children, fallback }: InlineLoadingProps) {
  if (loading) {
    return fallback || <LoadingSpinner size="sm" />;
  }
  return <>{children}</>;
}
