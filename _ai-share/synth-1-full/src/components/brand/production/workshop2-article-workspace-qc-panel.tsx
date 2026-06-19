'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { workshop2MobileInspectorHref } from '@/lib/production/workshop2-mobile-inspector-checklist';
import { Workshop2AQLInspectionPanel } from '@/components/brand/production/Workshop2AQLInspectionPanel';
import { SupplierQcScorecard } from '@/components/brand/production/supplier-qc-scorecard';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export function Workshop2ArticleQcPanel({
  dossier = null,
}: { dossier?: Workshop2DossierPhase1 | null } = {}) {
  const { ref, bundle, loading } = useArticleWorkspace();
  const [href, setHref] = useState<string | null>(null);
  useEffect(() => {
    setHref(
      workshop2MobileInspectorHref({
        collectionId: ref.collectionId,
        articleId: String(ref.articleId),
        orderId: 'demo',
      })
    );
  }, [ref.articleId, ref.collectionId]);
  const aqlHref = useMemo(() => `#workshop2-qc-aql-cross-ref`, []);
  if (loading || !bundle) return <p className="text-text-secondary text-[12px]">Загрузка…</p>;
  return (
    <div className="space-y-4">
      <p className="text-text-secondary text-[12px]">
        Sample-order привязан — откройте PWA или сохраните отчёт в досье. supplierId в PO плана для
        scorecard.
      </p>
      {href ? (
        <Button asChild size="sm">
          <Link href={href} data-testid="workshop2-qc-inspector-deep-link">
            Inspector PWA
          </Link>
        </Button>
      ) : null}
      <div id="workshop2-qc-aql-cross-ref" data-testid="workshop2-qc-aql-cross-ref">
        <Workshop2AQLInspectionPanel dossier={dossier} />
      </div>
      <SupplierQcScorecard supplierId="supplier-demo" dossier={dossier} />
    </div>
  );
}
