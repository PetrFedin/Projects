import * as React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type AnalyticsCardProps = {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

/** Карточка аналитики: заголовок, слот графика, опционально insight в footer. */
export function AnalyticsCard({
  title,
  description,
  footer,
  action,
  className,
  children,
}: AnalyticsCardProps) {
  return (
    <Card className={cn('border-border-default shadow-sm', className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-text-primary text-sm font-semibold leading-tight">
            {title}
          </CardTitle>
          {description ? <p className="text-text-secondary text-xs">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className="p-4 pt-0">{children}</CardContent>
      {footer ? (
        <CardFooter className="border-border-subtle text-text-secondary border-t px-4 py-3 text-xs">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}
