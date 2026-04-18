import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface DataCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  footer?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DataCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  footer,
  variant = 'default',
  size = 'md',
  className,
}: DataCardProps) {
  const variants = {
<<<<<<< HEAD
    default: 'bg-white border-slate-200',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-blue-100',
=======
    default: 'bg-white border-border-default',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-accent-primary/10 border-blue-100',
>>>>>>> recover/cabinet-wip-from-stash
    minimal: 'bg-transparent border-transparent',
  };

  const sizes = {
    sm: {
      container: 'p-4',
      icon: 'h-8 w-8 p-2',
      iconSize: 'h-4 w-4',
      title: 'text-xs',
      value: 'text-base',
      subtitle: 'text-xs',
    },
    md: {
      container: 'p-4',
      icon: 'h-12 w-12 p-3',
      iconSize: 'h-6 w-6',
      title: 'text-sm',
      value: 'text-base',
      subtitle: 'text-sm',
    },
    lg: {
      container: 'p-4',
      icon: 'h-12 w-12 p-4',
      iconSize: 'h-8 w-8',
      title: 'text-base',
      value: 'text-sm',
      subtitle: 'text-base',
    },
  };

  const s = sizes[size];

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
        'card-hover shadow-soft rounded-3xl border',
        variants[variant],
        s.container,
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        {Icon && (
          <div
            className={cn(
<<<<<<< HEAD
              'flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg',
=======
              'to-accent-primary flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 shadow-lg',
>>>>>>> recover/cabinet-wip-from-stash
              s.icon
            )}
          >
            <Icon className={cn(s.iconSize, 'text-white')} />
          </div>
        )}
        {trend && (
          <span
            className={cn(
              'rounded-full px-3 py-1 font-bold uppercase tracking-wider',
              s.subtitle,
              trendColors[trend.direction]
            )}
          >
            {trend.value}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
<<<<<<< HEAD
        <h3 className={cn('font-bold uppercase tracking-wider text-slate-500', s.title)}>
          {title}
        </h3>
        <p className={cn('font-black tracking-tight text-slate-900', s.value)}>{value}</p>
        {subtitle && <p className={cn('font-medium text-slate-400', s.subtitle)}>{subtitle}</p>}
      </div>

      {/* Footer */}
      {footer && <div className="mt-4 border-t border-slate-100 pt-4">{footer}</div>}
=======
        <h3 className={cn('text-text-secondary font-bold uppercase tracking-wider', s.title)}>
          {title}
        </h3>
        <p className={cn('text-text-primary font-black tracking-tight', s.value)}>{value}</p>
        {subtitle && <p className={cn('text-text-muted font-medium', s.subtitle)}>{subtitle}</p>}
      </div>

      {/* Footer */}
      {footer && <div className="border-border-subtle mt-4 border-t pt-4">{footer}</div>}
>>>>>>> recover/cabinet-wip-from-stash
    </div>
  );
}

// Usage example:
// <DataCard
//   title="Total Revenue"
//   value="€1.2M"
//   subtitle="This month"
//   icon={TrendingUp}
//   trend={{ value: "+18%", direction: "up" }}
//   footer={<Button variant="ghost" size="sm">View Details</Button>}
//   variant="gradient"
//   size="md"
// />
