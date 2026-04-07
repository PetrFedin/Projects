'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickStatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

/**
 * Универсальный компонент для отображения быстрой статистики
 * Используется в разных разделах кабинета клиента
 */
export function QuickStatsCard({
  label,
  value,
  icon: Icon,
  iconColor = 'text-accent/60',
  trend,
  className,
}: QuickStatsCardProps) {
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString('ru-RU') 
    : value;

  return (
    <Card className={cn(
      "border-accent/20 hover:border-accent/40 transition-colors",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-sm font-bold">{formattedValue}</p>
            {trend && (
              <div className={cn(
                "flex items-center gap-1 text-xs mt-1",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                <span>{trend.isPositive ? '+' : '-'}{trend.value}</span>
              </div>
            )}
          </div>
          <Icon className={cn("h-8 w-8", iconColor)} />
        </div>
      </CardContent>
    </Card>
  );
}





