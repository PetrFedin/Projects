/**
 * Wave 3 P1: full-text vault index — filename + metadata search.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2VaultSearchHit = {
  id: string;
  title: string;
  type?: string;
  storagePath?: string | null;
  score: number;
  matchedFields: string[];
};

function tokenize(q: string): string[] {
  return q
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 2);
}

function scoreDoc(
  doc: {
    id: string;
    title?: string;
    type?: string;
    storagePath?: string | null;
    metadata?: Record<string, unknown> | null;
  },
  tokens: string[]
): { score: number; matchedFields: string[] } {
  if (!tokens.length) return { score: 0, matchedFields: [] };
  const fields: Array<{ name: string; value: string }> = [
    { name: 'title', value: String(doc.title ?? '') },
    { name: 'id', value: doc.id },
    { name: 'type', value: String(doc.type ?? '') },
    { name: 'storagePath', value: String(doc.storagePath ?? '') },
  ];
  const meta = doc.metadata ?? {};
  for (const [k, v] of Object.entries(meta)) {
    if (typeof v === 'string' || typeof v === 'number') {
      fields.push({ name: `metadata.${k}`, value: String(v) });
    }
  }
  let score = 0;
  const matchedFields = new Set<string>();
  for (const token of tokens) {
    for (const f of fields) {
      const hay = f.value.toLowerCase();
      if (hay.includes(token)) {
        score += f.name === 'title' ? 3 : 1;
        matchedFields.add(f.name);
      }
    }
  }
  return { score, matchedFields: [...matchedFields] };
}

export function searchWorkshop2VaultDocuments(input: {
  dossier: Workshop2DossierPhase1;
  query: string;
  limit?: number;
}): Workshop2VaultSearchHit[] {
  const tokens = tokenize(input.query);
  const limit = input.limit ?? 20;
  const docs = input.dossier.vaultDocuments ?? [];
  const hits: Workshop2VaultSearchHit[] = [];
  for (const d of docs) {
    const ext = d as {
      storagePath?: string | null;
      metadata?: Record<string, unknown> | null;
    };
    const { score, matchedFields } = scoreDoc(
      {
        id: d.id,
        title: typeof d.title === 'string' ? d.title : undefined,
        type: typeof d.type === 'string' ? d.type : undefined,
        storagePath: ext.storagePath,
        metadata: ext.metadata,
      },
      tokens
    );
    if (score <= 0) continue;
    hits.push({
      id: d.id,
      title: String(d.title ?? d.id),
      type: typeof d.type === 'string' ? d.type : undefined,
      storagePath: ext.storagePath,
      score,
      matchedFields,
    });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
