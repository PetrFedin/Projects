import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({ label, value, change, icon: Icon, trend = 'neutral', className }: StatCardProps) {
  const trendColors = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-rose-600 bg-rose-50',
    neutral: 'text-slate-600 bg-slate-50'
  };

  return (
    <div className={cn(
      "card-hover bg-white p-4 rounded-3xl border border-slate-100 shadow-soft",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "p-3 rounded-2xl transition-all",
          trendColors[trend]
        )}>
          <Icon className="h-5 w-5" />
        </div>
        {change && (
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
            trendColors[trend]
          )}>
            {change}
          </span>
        )}
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
        {label}
      </p>
      <p className="text-base font-black text-slate-900 tracking-tight">
        {value}
      </p>
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
