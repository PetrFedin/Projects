/**
 * GET /api/b2b/archive/apparel-magic/orders — upstream list for spine import.
 */
import {
  archiveUpstreamNotConfiguredResponse,
  parseArchiveUpstreamQuery,
} from '@/lib/integrations/spine/archive-upstream-orders.server';

function isApparelMagicConfigured(): boolean {
  return Boolean(
    process.env.APPAREL_MAGIC_API_BASE?.trim() && process.env.APPAREL_MAGIC_API_TOKEN?.trim()
  );
}

export async function GET(request: Request) {
  parseArchiveUpstreamQuery(request);
  if (!isApparelMagicConfigured()) {
    return archiveUpstreamNotConfiguredResponse('ERP · закупки');
  }

  return Response.json([]);
}
