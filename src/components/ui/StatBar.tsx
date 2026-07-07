import { cn } from '@/lib/utils';

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  color?: string;
  className?: string;
  showValues?: boolean;
}

export const StatBar = ({
  label,
  value,
  max,
  color = 'bg-blue-500',
  className,
  showValues = true
}: StatBarProps) => {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold">
        <span className="text-gray-400">{label}</span>
        {showValues && (
          <span className="text-white">
            {value} <span className="text-gray-600">/ {max}</span>
          </span>
        )}
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div
          className={cn('h-full transition-all duration-1000 ease-out relative', color)}
          style={{ width: `${percentage}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
};
