'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

type Props = {
  collectionId: string;
  articleId: string;
};

/** Wave D4 · Zedonk costing hint strip on article dossier (pillar 1). */
export function BrandZedonkCostingHintStrip({ collectionId, articleId }: Props) {
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const params = new URLSearchParams({ collectionId, articleId });
        const res = await fetch(`/api/integrations/v1/zedonk/enrich?${params.toString()}`, {
          cache: 'no-store',
        });
        const json = (await res.json()) as { data?: { hintRu?: string | null } };
        if (!cancelled) setHint(json.data?.hintRu ?? null);
      } catch {
        if (!cancelled) setHint(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [collectionId, articleId]);

  if (!hint) return null;

  return (
    <Badge
      variant="outline"
      className="border-sky-200 bg-sky-50 text-[9px] text-sky-900"
      data-testid="brand-dev-agent-costing-hint"
    >
      {hint}
    </Badge>
  );
}
