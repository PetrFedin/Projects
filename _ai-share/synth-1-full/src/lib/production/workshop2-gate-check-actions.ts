/**
 * Deep links для gate checks — actionable blockers в Workshop2GateChecksBlock.
 */
import type { Workshop2ApiGateCheck } from '@/lib/production/workshop2-api-gate-messages';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';

export type Workshop2GateCheckAction = {
  labelRu: string;
  href: string;
};

const GATE_ACTION_LABELS_RU: Record<string, string> = {
  'vault.files.min': 'Открыть Vault',
  'tz.overall.min': 'Открыть ТЗ',
  'construction.pom.empty': 'Шаг «Мерки»',
  'cad.missing': 'Загрузить CAD',
  'supply.lab_dip.not_approved': 'Снабжение · lab dip',
  handoff_not_ready: 'Задание и handoff',
  lab_dip_pending: 'Снабжение · lab dip',
};

/** Куда вести пользователя по id gate check. */
export function resolveWorkshop2GateCheckAction(
  check: Workshop2ApiGateCheck,
  ctx: { collectionId: string; articleSegment: string }
): Workshop2GateCheckAction | null {
  const id = check.id?.trim();
  if (!id) return null;

  const labelRu = GATE_ACTION_LABELS_RU[id];
  if (!labelRu) return null;

  let href: string;
  switch (id) {
    case 'vault.files.min':
    case 'cad.missing':
      href = workshop2ArticleHref(ctx.collectionId, ctx.articleSegment, { w2pane: 'vault' });
      break;
    case 'construction.pom.empty':
      href = workshop2ArticleHref(ctx.collectionId, ctx.articleSegment, {
        w2pane: 'tz',
        w2sec: 'construction',
      });
      break;
    case 'supply.lab_dip.not_approved':
    case 'lab_dip_pending':
      href = workshop2ArticleHref(ctx.collectionId, ctx.articleSegment, { w2pane: 'supply' });
      break;
    case 'handoff_not_ready':
      href = workshop2ArticleHref(ctx.collectionId, ctx.articleSegment, {
        w2pane: 'tz',
        w2sec: 'assignment',
      });
      break;
    case 'tz.overall.min':
    default:
      href = workshop2ArticleHref(ctx.collectionId, ctx.articleSegment, { w2pane: 'tz' });
      break;
  }

  return { labelRu, href };
}
