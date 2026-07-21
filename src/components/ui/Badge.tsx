import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'glow' | 'race';
  raceId?: 'protoss' | 'terran' | 'zerg';
  className?: string;
}

export const Badge = ({ children, variant = 'default', raceId, className }: BadgeProps) => {
  const variants = {
    default: 'bg-white/10 text-white',
    outline: 'border border-white/20 text-gray-300',
    glow: 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
    race:
      raceId === 'protoss'
        ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
        : raceId === 'terran'
          ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
          : 'bg-purple-500/20 text-purple-500 border border-purple-500/30',
  };

  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest inline-flex items-center',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};
