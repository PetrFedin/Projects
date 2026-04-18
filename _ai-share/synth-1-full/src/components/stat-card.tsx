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
    <Card className="border-border-subtle hover:bg-bg-surface2/80 group shadow-sm transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1.5">
        <CardTitle className="text-text-secondary group-hover:text-text-primary text-[11px] font-bold uppercase tracking-wider transition-colors">
          {title}
        </CardTitle>
        <div className="bg-bg-surface2 text-text-muted group-hover:bg-accent-primary/10 group-hover:text-accent-primary rounded-lg p-1.5 shadow-sm transition-colors">
          <Icon className="h-3.5 w-3.5" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div
          className={cn(
            'text-text-primary font-bold tracking-tight',
            valueFontSize === 'text-base' ? 'text-sm' : 'text-base'
          )}
        >
          {value}
        </div>
        <p
          className={cn(
            'mt-1 text-[10px] font-bold uppercase tracking-tight',
            isPositive ? 'text-state-success' : isNegative ? 'text-state-error' : 'text-text-muted'
          )}
        >
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
