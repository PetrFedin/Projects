import { NextRequest, NextResponse } from 'next/server';
import { inferProductTags } from '@/ai/flows/infer-product-tags';
import { readJsonBody } from '@/lib/http/read-json-body';

export async function POST(req: NextRequest) {
  try {
    const { name, category, description, color } = await readJsonBody<{
      name?: string;
      category?: string;
      description?: string;
      color?: string;
    }>(req);
    if (!name || !category) {
      return NextResponse.json({ error: 'name and category are required' }, { status: 400 });
    }
    const result = await inferProductTags({ name, category, description, color });
    return NextResponse.json(result);
  } catch (e) {
    console.error('[infer-tags] Failed:', e);
    return NextResponse.json({ error: 'Failed to infer tags' }, { status: 500 });
  }
}
