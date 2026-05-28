'use client';

import type { ShowroomSampleTagPayloadV1 } from '@/lib/fashion/showroom-sample-tag';

export async function registerShowroomSampleTag(
  payload: ShowroomSampleTagPayloadV1
): Promise<string> {
  const r = await fetch('/api/showroom-sample', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload }),
  });
  const j = (await r.json()) as { ok?: boolean; id?: string; error?: string };
  if (!r.ok || !j?.id) {
    throw new Error(j?.error ?? 'register_failed');
  }
  return j.id;
}

export async function fetchShowroomSampleByRegistryId(
  registryId: string
): Promise<ShowroomSampleTagPayloadV1 | null> {
  const r = await fetch(`/api/showroom-sample/${encodeURIComponent(registryId)}`);
  const j = (await r.json()) as { ok?: boolean; payload?: ShowroomSampleTagPayloadV1 };
  if (!r.ok || !j?.payload) return null;
  return j.payload;
}
