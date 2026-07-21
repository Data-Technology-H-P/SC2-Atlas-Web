import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

export const GlassPanel = ({ children, className, hoverable = false, style }: GlassPanelProps) => {
  return (
    <div
      style={style}
      className={cn(
        'relative overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300',
        hoverable &&
          'hover:border-white/20 hover:bg-black/50 hover:shadow-2xl hover:shadow-blue-500/10',
        className,
      )}
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent" />

      <div className="relative z-10 p-4">{children}</div>
    </div>
  );
};
