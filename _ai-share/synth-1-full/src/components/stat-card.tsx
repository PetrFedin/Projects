import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  let isPositive = description.startsWith('+');
  let isNegative = description.startsWith('-');

  if (title === 'Возвраты') {
    isPositive = description.startsWith('-');
    isNegative = description.startsWith('+');
  }

  const valueFontSize = title === 'Сред. время просмотра' ? 'text-sm' : 'text-base';

  return (
<<<<<<< HEAD
    <Card className="group border-slate-100 shadow-sm transition-all duration-200 hover:bg-slate-50/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1.5">
        <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-colors group-hover:text-slate-900">
          {title}
        </CardTitle>
        <div className="rounded-lg bg-slate-50 p-1.5 text-slate-400 shadow-sm transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
=======
    <Card className="border-border-subtle hover:bg-bg-surface2/80 group shadow-sm transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1.5">
        <CardTitle className="text-text-secondary group-hover:text-text-primary text-[11px] font-bold uppercase tracking-wider transition-colors">
          {title}
        </CardTitle>
        <div className="bg-bg-surface2 text-text-muted group-hover:bg-accent-primary/10 group-hover:text-accent-primary rounded-lg p-1.5 shadow-sm transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
          <Icon className="h-3.5 w-3.5" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div
          className={cn(
<<<<<<< HEAD
            'font-bold tracking-tight text-slate-900',
=======
            'text-text-primary font-bold tracking-tight',
>>>>>>> recover/cabinet-wip-from-stash
            valueFontSize === 'text-base' ? 'text-sm' : 'text-base'
          )}
        >
          {value}
        </div>
        <p
          className={cn(
            'mt-1 text-[10px] font-bold uppercase tracking-tight',
<<<<<<< HEAD
            isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-600' : 'text-slate-400'
=======
            isPositive ? 'text-state-success' : isNegative ? 'text-state-error' : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
          )}
        >
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
