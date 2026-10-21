import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'lime';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98] cursor-pointer';

    const variants = {
      primary:
        'bg-lime-500 hover:bg-lime-400 text-zinc-950 font-semibold shadow-md shadow-lime-500/20 hover:shadow-lime-500/30',
      lime:
        'bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold shadow-lg shadow-lime-500/25 hover:shadow-lime-500/40',
      secondary:
        'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-100 border border-zinc-700/60 shadow-sm',
      outline:
        'border border-zinc-700 hover:border-lime-500/50 bg-transparent text-zinc-200 hover:bg-zinc-800/50 hover:text-white',
      ghost:
        'hover:bg-zinc-800/60 text-zinc-300 hover:text-white',
      destructive:
        'bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-sm shadow-rose-600/30',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5 font-semibold',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
