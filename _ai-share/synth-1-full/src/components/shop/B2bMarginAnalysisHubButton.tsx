'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  /** По умолчанию — как в отчёте по марже */
  label?: string;
};

/** Ссылка на хаб `/shop/b2b/margin-analysis` (единая точка среза «Маржа»). */
export function B2bMarginAnalysisHubButton({ className, label = 'Анализ маржи' }: Props) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn('text-xs font-black uppercase', className)}
      asChild
    >
      <Link href={ROUTES.shop.b2bMarginAnalysis} data-testid="b2b-margin-analysis-hub-link">
        {label}
      </Link>
    </Button>
  );
}
