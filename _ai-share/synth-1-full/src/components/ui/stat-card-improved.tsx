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
<<<<<<< HEAD
    neutral: 'text-slate-600 bg-slate-50',
=======
    neutral: 'text-text-secondary bg-bg-surface2',
>>>>>>> recover/cabinet-wip-from-stash
  };

  return (
    <div
      className={cn(
<<<<<<< HEAD
        'card-hover shadow-soft rounded-3xl border border-slate-100 bg-white p-4',
=======
        'card-hover border-border-subtle shadow-soft rounded-3xl border bg-white p-4',
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-base font-black tracking-tight text-slate-900">{value}</p>
=======
      <p className="text-text-muted mb-1 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className="text-text-primary text-base font-black tracking-tight">{value}</p>
>>>>>>> recover/cabinet-wip-from-stash
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
