'use client';

import * as React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type ChartCardProps = {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

/** Обёртка для Recharts: единые отступы и иерархия заголовка. */
export function ChartCard({
  title,
  description,
  footer,
  action,
  className,
  children,
}: ChartCardProps) {
  return (
    <Card className={cn('border-slate-200 shadow-sm', className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-sm font-semibold text-slate-900">{title}</CardTitle>
          {description ? <p className="text-xs text-slate-500">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className="p-4 pt-0">{children}</CardContent>
      {footer ? (
        <CardFooter className="border-t border-slate-100 px-4 py-2.5 text-xs text-slate-600">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}
