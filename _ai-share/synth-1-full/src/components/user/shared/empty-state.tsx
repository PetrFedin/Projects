'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

/**
 * Универсальный компонент для пустых состояний
 * Используется когда у пользователя нет данных в разделе
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Icon className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-sm font-semibold">{title}</h3>
        <p className="mb-6 max-w-md text-center text-muted-foreground">{description}</p>
        {actionLabel &&
          (actionHref ? (
            <Button asChild>
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          ) : onAction ? (
            <Button onClick={onAction}>{actionLabel}</Button>
          ) : null)}
      </CardContent>
    </Card>
  );
}
