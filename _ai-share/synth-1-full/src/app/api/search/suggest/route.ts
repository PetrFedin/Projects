import { NextRequest, NextResponse } from 'next/server';
import { repo } from '@/lib/repo';
import { suggestSearchQueries } from '@/ai/flows/suggest-search-queries';
import type { SearchSuggestItem } from '@/lib/repo/searchRepo';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') ?? '').trim();

  const [standard, llmQueries] = await Promise.all([
    repo.search.suggest(q),
    q.length >= 3 ? suggestSearchQueries(q) : Promise.resolve([]),
  ]);

  const seen = new Set((standard as SearchSuggestItem[]).map((it) => it.label.toLowerCase()));
  const llmItems: SearchSuggestItem[] = llmQueries
    .filter((s) => s && !seen.has(s.toLowerCase()))
    .map((s) => {
      seen.add(s.toLowerCase());
      return { type: 'query' as const, label: `Искать: «${s}»`, payload: { q: s } };
    });

  const data = [...(standard as SearchSuggestItem[]), ...llmItems].slice(0, 12);
  return NextResponse.json(data);
}
