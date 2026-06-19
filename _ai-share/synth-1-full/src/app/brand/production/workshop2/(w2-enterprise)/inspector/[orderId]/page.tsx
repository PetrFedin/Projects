'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { loadWorkshop2DossierFromApi } from '@/lib/production/workshop2-api-client';
import {
  fetchWorkshop2InspectorReport,
  saveWorkshop2InspectorReport,
} from '@/lib/production/workshop2-inspector-report-client';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/** Mobile inspector PWA — reload dossier before QC mirror (Wave W28). */
export default function Workshop2InspectorOrderPage() {
  const params = useParams();
  const orderId = decodeURIComponent(String(params.orderId ?? ''));
  const [collectionId] = useState('SS27');
  const [articleId] = useState('demo-ss27-01');
  const [dossierForMirror, setDossierForMirror] = useState<Workshop2DossierPhase1 | null>(null);
  const [checked, setChecked] = useState<string[]>([]);

  const reload = useCallback(async () => {
    const loaded = await loadWorkshop2DossierFromApi(collectionId, articleId);
    setDossierForMirror(loaded.ok ? loaded.data.dossier : null);
    const report = await fetchWorkshop2InspectorReport({
      collectionId,
      articleId,
      sampleOrderId: orderId,
    });
    setChecked(report.report?.checkedItemIds ?? []);
  }, [collectionId, articleId, orderId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <div className="space-y-4 p-4" data-testid="workshop2-inspector-order-page">
      <p className="text-sm">Inspector · order {orderId}</p>
      <p className="text-xs text-muted-foreground">
        Dossier mirror: {dossierForMirror ? 'loaded' : 'pending'}
      </p>
      <button
        type="button"
        className="rounded border px-3 py-1 text-sm"
        onClick={() =>
          void saveWorkshop2InspectorReport({
            collectionId,
            articleId,
            sampleOrderId: orderId,
            checkedItemIds: checked,
          }).then(() => reload())
        }
      >
        Save checklist
      </button>
    </div>
  );
}
