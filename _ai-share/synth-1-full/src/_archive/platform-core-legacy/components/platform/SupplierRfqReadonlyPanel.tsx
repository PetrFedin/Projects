'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { factorySupplierMessagesWorkshop2ArticleContextHref } from '@/lib/routes';

type Props = {
  collectionId: string;
  articleId: string;
  compact?: boolean;
};

/** Read-only: нет RFQ-формы в core — уточнение цены через чат по артикулу. */
export function SupplierRfqReadonlyPanel({ collectionId, articleId, compact = false }: Props) {
  const chatHref = factorySupplierMessagesWorkshop2ArticleContextHref(collectionId, articleId);

  if (compact) {
    return (
      <Card data-testid="supplier-rfq-readonly-panel" className="border-blue-200/60">
        <CardContent className="space-y-1.5 p-3 text-xs">
          <p className="flex items-center gap-1.5 font-semibold">
            <MessageSquare className="h-3.5 w-3.5 text-blue-600" aria-hidden />
            Уточнение цены · read-only
          </p>
          <p className="text-text-muted">
            Без RFQ-формы — цена и сроки по материалам {articleId} через чат.
          </p>
          <Link
            href={chatHref}
            data-testid="supplier-rfq-readonly-chat-link"
            className="text-accent-primary font-medium hover:underline"
          >
            Уточнение через чат →
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="supplier-rfq-readonly-panel" className="border-blue-200/60">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-bold">
          <MessageSquare className="h-4 w-4 text-blue-600" aria-hidden />
          Запрос цены · read-only
        </CardTitle>
        <CardDescription className="text-xs">
          Без отдельной RFQ-формы — уточнение цены и сроков по материалам через чат по артикулу{' '}
          {articleId}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href={chatHref}
          data-testid="supplier-rfq-readonly-chat-link"
          className="text-accent-primary text-xs font-medium hover:underline"
        >
          Уточнение через чат →
        </Link>
      </CardContent>
    </Card>
  );
}
