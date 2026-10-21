import React from 'react';
import { cn } from '@/lib/utils';
import { MemberStatus, PlanStatus, PaymentStatus } from '@/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'active' | 'expiring' | 'expired' | 'frozen' | 'lime' | 'outline' | 'neutral';
  status?: MemberStatus | PlanStatus | PaymentStatus;
}

export function Badge({ className, variant = 'default', status, children, ...props }: BadgeProps) {
  let computedVariant = variant;

  if (status) {
    if (status === 'active' || status === 'completed') computedVariant = 'active';
    else if (status === 'expiring' || status === 'pending') computedVariant = 'expiring';
    else if (status === 'expired' || status === 'archived' || status === 'failed') computedVariant = 'expired';
    else if (status === 'frozen') computedVariant = 'neutral';
  }

  const variants = {
    default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    active: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50',
    expiring: 'bg-amber-950/80 text-amber-300 border-amber-700/50',
    expired: 'bg-rose-950/80 text-rose-300 border-rose-700/50',
    frozen: 'bg-sky-950/80 text-sky-300 border-sky-700/50',
    lime: 'bg-lime-950/80 text-lime-400 border-lime-700/60 font-semibold',
    neutral: 'bg-zinc-800/80 text-zinc-400 border-zinc-700',
    outline: 'border border-zinc-700 text-zinc-300 bg-transparent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variants[computedVariant],
        className
      )}
      {...props}
    >
      <span
        className={cn('w-1.5 h-1.5 rounded-full shrink-0', {
          'bg-emerald-400': computedVariant === 'active',
          'bg-amber-400': computedVariant === 'expiring',
          'bg-rose-400': computedVariant === 'expired',
          'bg-lime-400': computedVariant === 'lime',
          'bg-sky-400': computedVariant === 'frozen',
          'bg-zinc-400': computedVariant === 'default' || computedVariant === 'neutral' || computedVariant === 'outline',
        })}
      />
      {children}
    </span>
  );
}
