import type { FactoryCommsEntityThreadKind } from '@/lib/fashion/factory-comms-entity-thread-attach-tz';

export async function attachFactoryCommsEntityThreadTz(input: {
  variant: 'manufacturer' | 'supplier';
  collectionId: string;
  articleId: string;
  threadKind: FactoryCommsEntityThreadKind;
}): Promise<{ ok: boolean; dossierHref?: string }> {
  const res = await fetch('/api/factory/comms/entity-threads/attach-tz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as { ok?: boolean; dossierHref?: string };
  if (!res.ok || !json.ok) return { ok: false };
  return { ok: true, dossierHref: json.dossierHref };
}
