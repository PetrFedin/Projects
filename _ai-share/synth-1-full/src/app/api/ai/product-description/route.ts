import { NextRequest, NextResponse } from 'next/server';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { readJsonBody } from '@/lib/http/read-json-body';

function toOptionalStringArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v.filter((x): x is string => typeof x === 'string');
  return out.length ? out : undefined;
}

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      brand,
      category,
      color,
      composition,
      tags,
      sustainability,
      existingDescription,
      includeSeo,
    } = await readJsonBody<{
      name?: string;
      brand?: string;
      category?: string;
      color?: string;
      composition?: unknown;
      tags?: unknown;
      sustainability?: unknown;
      existingDescription?: unknown;
      includeSeo?: unknown;
    }>(req);

    if (!name || !brand || !category || !color) {
      return NextResponse.json(
        { error: 'name, brand, category, color are required' },
        { status: 400 }
      );
    }

    const result = await generateProductDescription(
      {
        name,
        brand,
        category,
        color,
        composition: typeof composition === 'string' ? composition : undefined,
        tags: toOptionalStringArray(tags),
        sustainability: toOptionalStringArray(sustainability),
        existingDescription:
          typeof existingDescription === 'string' ? existingDescription : undefined,
      },
      { includeSeo: !!includeSeo }
    );

    if (typeof result === 'string') {
      return NextResponse.json({ description: result });
    }
    return NextResponse.json(result);
  } catch (e) {
    console.error('[product-description] Failed:', e);
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
  }
}
