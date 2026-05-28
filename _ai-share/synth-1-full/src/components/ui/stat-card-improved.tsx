import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  className,
}: StatCardProps) {
  const trendColors = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-rose-600 bg-rose-50',
    neutral: 'text-text-secondary bg-bg-surface2',
  };

  return (
    <div
      className={cn(
        'card-hover border-border-subtle shadow-soft rounded-3xl border bg-white p-4',
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className={cn('rounded-2xl p-3 transition-all', trendColors[trend])}>
          <Icon className="h-5 w-5" />
        </div>
        {change && (
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',
              trendColors[trend]
            )}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-text-muted mb-1 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className="text-text-primary text-base font-black tracking-tight">{value}</p>
    </div>
  );
}

// Usage example:
// <StatCard
//   label="Total Revenue"
//   value="€1.2M"
//   change="+18%"
//   icon={TrendingUp}
//   trend="up"
// />
