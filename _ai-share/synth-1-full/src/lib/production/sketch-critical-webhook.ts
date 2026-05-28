import type { Workshop2Phase1CategorySketchAnnotation } from '@/lib/production/workshop2-dossier-phase1.types';
import { sketchPinBelongsToLeaf } from '@/lib/production/workshop2-sketch-pin-templates';

export type SketchCriticalWebhookPayload = {
  sentAt: string;
  pathLabel: string;
  sku?: string;
  leafId: string;
  criticalPins: {
    annotationId: string;
    xPct: number;
    yPct: number;
    text: string;
    annotationType?: string;
    linkedTaskId?: string;
    linkedAttributeId?: string;
    mesShiftId?: string;
    mesDefectCode?: string;
    linkedBomLineRef?: string;
    linkedMaterialNote?: string;
  }[];
};

/** POST JSON на URL из NEXT_PUBLIC_SKETCH_CRITICAL_WEBHOOK_URL (проксируйте через свой API при CORS). */
export async function postCriticalPinsWebhook(
  payload: SketchCriticalWebhookPayload
): Promise<{ ok: boolean; message?: string }> {
  const url =
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_SKETCH_CRITICAL_WEBHOOK_URL
      : undefined;
  if (!url?.trim()) {
    return { ok: false, message: 'URL не задан (NEXT_PUBLIC_SKETCH_CRITICAL_WEBHOOK_URL).' };
  }
  try {
    const res = await fetch(url.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return { ok: false, message: `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Сеть' };
  }
}

export function buildCriticalWebhookPayload(
  pathLabel: string,
  sku: string | undefined,
  leafId: string,
  annotations: Workshop2Phase1CategorySketchAnnotation[]
): SketchCriticalWebhookPayload {
  const criticalPins = annotations
    .filter((a) => sketchPinBelongsToLeaf(a, leafId) && a.priority === 'critical')
    .map((a) => ({
      annotationId: a.annotationId,
      xPct: a.xPct,
      yPct: a.yPct,
      text: (a.text ?? '').trim(),
      annotationType: a.annotationType,
      linkedTaskId: a.linkedTaskId,
      linkedAttributeId: a.linkedAttributeId,
      mesShiftId: a.mesShiftId,
      mesDefectCode: a.mesDefectCode,
      linkedBomLineRef: a.linkedBomLineRef,
      linkedMaterialNote: a.linkedMaterialNote,
    }));
  return {
    sentAt: new Date().toISOString(),
    pathLabel,
    sku,
    leafId,
    criticalPins,
  };
}
