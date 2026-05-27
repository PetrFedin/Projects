import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { buildPomMeasurementsFromTemplate } from '@/lib/production/workshop2-pom-template-apply';
import { listWorkshop2RefPomTemplates } from '@/lib/server/workshop2-references-repository';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export const dynamic = 'force-dynamic';

/**
 * POST: строки табеля мер из POM-шаблона для leaf (клиент мержит в досье).
 * body: { leafId, templateLabel?, mode?: 'merge' | 'replace' }
 */
export async function POST(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }
  const b = body as { leafId?: string; templateLabel?: string; mode?: 'merge' | 'replace' };
  const leafId = b.leafId?.trim() ?? '';
  if (!leafId) {
    return jsonWorkshop2ErrorRu(400, 'leaf_id_required');
  }

  const { items } = await listWorkshop2RefPomTemplates(leafId);
  if (!items.length) {
    return jsonWorkshop2ErrorRu(404, 'no_templates');
  }

  const label = b.templateLabel?.trim();
  const tpl = label ? items.find((t) => t.label === label) : items[0];
  if (!tpl) {
    return jsonWorkshop2ErrorRu(404, 'template_not_found');
  }

  const measurements = buildPomMeasurementsFromTemplate(tpl);
  return NextResponse.json({
    ok: true,
    leafId,
    template: tpl,
    mode: b.mode === 'replace' ? 'replace' : 'merge',
    measurements,
  });
}
