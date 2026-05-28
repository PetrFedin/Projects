import { NextRequest, NextResponse } from 'next/server';
import { w2TechPackRemoteUploadServerConfigured } from '@/lib/server/w2-tech-pack-remote-s3';
import { listW2TechPackIndexForArticle } from '@/lib/server/w2-tech-pack-index';
import { logW2TechPackOps } from '@/lib/server/w2-tech-pack-ops-telemetry';
import { verifyW2TechPackWriteRequest } from '@/lib/server/w2-tech-pack-api-auth';

/**
 * Список вложений по артикулу (индекс): Pulse и внутренние инструменты с тем же секретом, что presign/complete.
 */
export async function GET(req: NextRequest) {
  if (!w2TechPackRemoteUploadServerConfigured()) {
    return NextResponse.json({ error: 'remote_disabled' }, { status: 503 });
  }
  const auth = verifyW2TechPackWriteRequest(req);
  if (!auth.ok) {
    logW2TechPackOps('index_list_unauthorized', { status: auth.status });
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { searchParams } = new URL(req.url);
  const collectionId = String(searchParams.get('collectionId') ?? '').trim();
  const articleId = String(searchParams.get('articleId') ?? '').trim();
  if (!collectionId || !articleId) {
    return NextResponse.json({ error: 'ids_required' }, { status: 400 });
  }
  const attachments = await listW2TechPackIndexForArticle(collectionId, articleId);
  return NextResponse.json({ collectionId, articleId, attachments });
}
