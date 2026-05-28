import { NextRequest, NextResponse } from 'next/server';
import { readJsonBody } from '@/lib/http/read-json-body';

export async function POST(req: NextRequest) {
  try {
    const { id } = await readJsonBody<{ id?: string }>(req);
    // MVP: просто подтверждаем. Реально это будет LooksRepo.like(id).
    return NextResponse.json({ success: true, id });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
