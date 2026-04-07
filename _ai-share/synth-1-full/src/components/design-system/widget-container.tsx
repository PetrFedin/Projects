import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type WidgetContainerProps = {
  title: string;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

/** Плотный виджет (как боковой KPI / статус). */
export function WidgetContainer({ title, action, className, children }: WidgetContainerProps) {
  return (
    <Card className={cn('border-slate-200 shadow-sm', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</CardTitle>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className="p-3 pt-0">{children}</CardContent>
    </Card>
  );
}
