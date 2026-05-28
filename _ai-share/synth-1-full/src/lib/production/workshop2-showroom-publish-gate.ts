/**
 * B2B шоурум: публикация только при валидной кампании в PG (wave 18 #62).
 */
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export type Workshop2ShowroomPublishInput = {
  published: boolean;
  wholesalePrice?: number | string;
  msrp?: number | string;
  moq?: number | string;
  windowStart?: string;
  windowEnd?: string;
  campaignName?: string;
};

export type Workshop2ShowroomPublishGateResult = {
  allowed: boolean;
  checks: Workshop2HandoffReadinessCheck[];
};

function parsePositiveNumber(value: number | string | undefined): number | null {
  if (value == null) return null;
  const n = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function evaluateWorkshop2ShowroomPublishGate(
  input: Workshop2ShowroomPublishInput
): Workshop2ShowroomPublishGateResult {
  const checks: Workshop2HandoffReadinessCheck[] = [];
  if (!input.published) {
    return { allowed: true, checks };
  }

  const wholesale = parsePositiveNumber(input.wholesalePrice);
  const msrp = parsePositiveNumber(input.msrp);
  const moq = parsePositiveNumber(input.moq);

  if (!wholesale) {
    checks.push({
      id: 'showroom.wholesale.invalid',
      severity: 'blocker',
      messageRu: 'Шоурум: укажите оптовую цену > 0 перед публикацией в PG.',
    });
  }
  if (!msrp) {
    checks.push({
      id: 'showroom.msrp.invalid',
      severity: 'blocker',
      messageRu: 'Шоурум: укажите MSRP > 0 перед публикацией.',
    });
  }
  if (!moq) {
    checks.push({
      id: 'showroom.moq.invalid',
      severity: 'blocker',
      messageRu: 'Шоурум: MOQ должен быть > 0.',
    });
  }
  if (!input.windowStart?.trim() || !input.windowEnd?.trim()) {
    checks.push({
      id: 'showroom.window.missing',
      severity: 'blocker',
      messageRu: 'Шоурум: укажите даты окна предзаказа (начало и конец).',
    });
  } else if (input.windowStart > input.windowEnd) {
    checks.push({
      id: 'showroom.window.order',
      severity: 'blocker',
      messageRu: 'Шоурум: дата начала не может быть позже даты окончания.',
    });
  }

  const blockers = checks.filter((c) => c.severity === 'blocker');
  return { allowed: blockers.length === 0, checks };
}

export function collectWorkshop2B2bPublishGateChecks(input: {
  dossier?: import('@/lib/production/workshop2-dossier-phase1.types').Workshop2DossierPhase1 | null;
  published?: boolean;
}): Workshop2ShowroomPublishGateResult {
  const mirror = input.dossier?.showroomPublishMirror;
  return evaluateWorkshop2ShowroomPublishGate({
    published: input.published ?? Boolean(mirror?.publishedAt),
    wholesalePrice: mirror?.wholesalePrice,
    msrp: mirror?.msrp,
    moq: mirror?.moq,
    windowStart: mirror?.windowStart,
    windowEnd: mirror?.windowEnd,
  });
}
