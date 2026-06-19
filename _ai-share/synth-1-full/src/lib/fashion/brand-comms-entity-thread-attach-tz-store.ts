import type { BrandCommsEntityThreadKind } from '@/lib/fashion/brand-comms-entity-threads';

export async function attachBrandCommsEntityThreadTz(input: {
  collectionId: string;
  articleId: string;
  threadKind: BrandCommsEntityThreadKind;
}): Promise<{ ok: boolean; dossierHref?: string }> {
  const res = await fetch('/api/brand/comms/entity-threads/attach-tz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as { ok?: boolean; dossierHref?: string };
  if (!res.ok || !json.ok) return { ok: false };
  return { ok: true, dossierHref: json.dossierHref };
}
