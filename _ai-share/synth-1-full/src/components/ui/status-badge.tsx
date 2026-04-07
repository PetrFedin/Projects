import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'busy' | 'away';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ 
  status, 
  label, 
  size = 'md', 
  showDot = true,
  className 
}: StatusBadgeProps) {
  const statusConfig = {
    online: {
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      label: label || 'Online'
    },
    offline: {
      color: 'bg-slate-400',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-600',
      label: label || 'Offline'
    },
    busy: {
      color: 'bg-rose-500',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-700',
      label: label || 'Busy'
    },
    away: {
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      label: label || 'Away'
    }
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const paddingSizes = {
    sm: 'px-2 py-0.5',
    md: 'px-3 py-1',
    lg: 'px-4 py-1.5'
  };

  const config = statusConfig[status];

  return (
    <div className={cn(
      "inline-flex items-center gap-2 rounded-full font-bold uppercase tracking-wide",
      config.bgColor,
      config.textColor,
      paddingSizes[size],
      textSizes[size],
      className
    )}>
      {showDot && (
        <span className={cn(
          "rounded-full animate-pulse",
          config.color,
          dotSizes[size]
        )} style={{
          boxShadow: status === 'online' || status === 'busy' ? `0 0 0 2px ${config.color}20` : 'none'
        }} />
      )}
      {config.label}
    </div>
  );
}

// Usage example:
// <StatusBadge status="online" size="md" />
// <StatusBadge status="busy" label="В эфире" showDot={true} />
