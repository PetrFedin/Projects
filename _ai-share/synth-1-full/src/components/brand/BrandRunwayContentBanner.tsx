'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { collectBrandRunwayContentIssues } from '@/lib/runway/runway-brand-content-alerts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface BrandRunwayContentBannerProps {
  brandName: string;
  brandSlug?: string;
  onOpenRunwayPreview?: () => void;
}

/** Предупреждения о неполном runway-контенте в brand profile. */
export function BrandRunwayContentBanner({
  brandName,
  brandSlug,
  onOpenRunwayPreview,
}: BrandRunwayContentBannerProps) {
  const [issues, setIssues] = useState<ReturnType<typeof collectBrandRunwayContentIssues>>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/data/products.json')
      .then((r) => r.json() as Promise<Product[]>)
      .then((products) => {
        if (cancelled) return;
        setIssues(collectBrandRunwayContentIssues(products, brandName));
      })
      .catch(() => {
        if (!cancelled) setIssues([]);
      });
    return () => {
      cancelled = true;
    };
  }, [brandName]);

  const previewHref = useMemo(() => {
    const qs = new URLSearchParams({ tab: 'runway-preview' });
    if (brandSlug) qs.set('group', 'profile');
    return `/brand/profile?${qs.toString()}`;
  }, [brandSlug]);

  if (issues.length === 0) return null;

  const totalIssues = issues.reduce((sum, row) => sum + row.issues.length, 0);

  return (
    <Alert
      variant="destructive"
      className="border-amber-500/40 bg-amber-50 text-amber-950 dark:bg-amber-950/20 dark:text-amber-100"
      data-runway-content-banner
    >
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Runway: неполный контент ({issues.length} SKU)</AlertTitle>
      <AlertDescription className="space-y-3">
        <p className="text-sm">
          У бренда есть scroll-video товары без обязательных секций, story или изображений. Всего{' '}
          {totalIssues} замечаний по validateScrollVideoContent.
        </p>
        <ul className="max-h-32 space-y-2 overflow-y-auto text-xs">
          {issues.map((row) => (
            <li
              key={row.slug}
              className="rounded-md border border-amber-500/20 bg-background/60 p-2"
            >
              <span className="font-semibold">{row.productName}</span>
              <span className="ml-2 font-mono text-muted-foreground">{row.slug}</span>
              <ul className="mt-1 list-disc pl-4 text-muted-foreground">
                {row.issues.slice(0, 3).map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
                {row.issues.length > 3 ? <li>…ещё {row.issues.length - 3}</li> : null}
              </ul>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" asChild>
            <Link href={previewHref} onClick={() => onOpenRunwayPreview?.()}>
              Исправить в Runway preview
            </Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
