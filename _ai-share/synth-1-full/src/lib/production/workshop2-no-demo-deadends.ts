/**
 * Workshop2: guardrails против demo/stub dead-ends (professional-only surfaces).
 * Pure helpers — покрыты `workshop2-no-demo-deadends.test.ts`.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { isWorkshop2SmartRoutingDemoAllowed } from '@/lib/production/workshop2-smart-routing-demo';
import { buildWorkshop2SmartRoutingMirror } from '@/lib/production/workshop2-smart-routing-dossier-persist';

export type Workshop2DataMode = 'local' | 'http';

export type Workshop2ErpDialogSyncResponse = {
  success?: boolean;
  configured?: boolean;
  noOp?: boolean;
  messageRu?: string;
  errors?: string[];
};

export type Workshop2LegacyRequisitionMigration = {
  isLegacy: boolean;
  status: number;
  titleRu: string;
  messageRu: string;
  canonicalPath?: string;
};

export type Workshop2ShowroomLocalPublishedUi = {
  /** Что показывать в «Статус витрины» — не «Опубликован» без PG. */
  vitrineLabel: 'Черновик' | 'Local (не PG)' | 'Опубликован (PG)';
  showPublicLink: boolean;
  blockedReasonRu?: string;
};

export type Workshop2MatchmakerSyncUi = {
  label: string;
  tone: 'muted' | 'amber' | 'emerald';
  mirrorInPg: boolean;
};

/** Smart routing: demo_template в production только с WORKSHOP2_SMART_ROUTING_DEMO. */
export function isWorkshop2SmartRoutingDemoBlockedInProduction(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return !isWorkshop2SmartRoutingDemoAllowed(env);
}

export function resolveWorkshop2SmartRoutingProductionEngineKind(input: {
  dossier: Workshop2DossierPhase1;
  env?: NodeJS.ProcessEnv;
}): NonNullable<Workshop2DossierPhase1['smartRoutingMirror']>['engineKind'] {
  const mirror = buildWorkshop2SmartRoutingMirror(input.dossier);
  const blocked =
    Boolean(input.dossier.smartRoutingFromDemo) &&
    isWorkshop2SmartRoutingDemoBlockedInProduction(input.env);
  if (blocked && mirror.engineKind === 'demo_template') {
    return 'empty';
  }
  return mirror.engineKind;
}

export function shouldShowWorkshop2SmartRoutingDemoWarning(input: {
  dossier: Workshop2DossierPhase1;
  env?: NodeJS.ProcessEnv;
}): boolean {
  return (
    Boolean(input.dossier.smartRoutingFromDemo) &&
    isWorkshop2SmartRoutingDemoBlockedInProduction(input.env)
  );
}

/** Nesting simulate: UI success только при ok API (prod stub → fail-closed). */
export function isWorkshop2NestingSimulationUiSuccessAllowed(input: {
  ok: boolean;
  error?: string;
}): boolean {
  if (!input.ok) return false;
  if (input.error === 'nesting_stub_disabled_in_production') return false;
  return true;
}

/** Showroom B2B: local «published» без PG campaign — blocked для ссылки и статуса. */
export function evaluateWorkshop2ShowroomLocalPublishedUi(input: {
  localPublished: boolean;
  hasPersistedCampaign: boolean;
  dataMode: Workshop2DataMode;
}): Workshop2ShowroomLocalPublishedUi {
  if (!input.localPublished) {
    return { vitrineLabel: 'Черновик', showPublicLink: false };
  }
  if (input.dataMode === 'http' && input.hasPersistedCampaign) {
    return { vitrineLabel: 'Опубликован (PG)', showPublicLink: true };
  }
  const blockedReasonRu =
    input.dataMode !== 'http'
      ? 'Режим local — сохранение кампании только через API (http).'
      : 'Отметка «опубликован» в браузере без кампании в PG — нажмите «Опубликовать в PG (journal)».';
  return {
    vitrineLabel: 'Local (не PG)',
    showPublicLink: false,
    blockedReasonRu,
  };
}

/** B2B/ERP integrations dialog: success toast только если configured. */
export function isWorkshop2ProductionErpDialogSyncSuccess(
  response: Workshop2ErpDialogSyncResponse
): boolean {
  return response.success === true && response.configured === true;
}

export function summarizeWorkshop2ProductionErpDialogSyncOutcome(
  response: Workshop2ErpDialogSyncResponse
): { ok: boolean; titleRu: string; descriptionRu: string; destructive: boolean } {
  if (isWorkshop2ProductionErpDialogSyncSuccess(response)) {
    return {
      ok: true,
      titleRu: 'ERP синхронизация',
      descriptionRu: 'Данные получены с внешнего ERP.',
      destructive: false,
    };
  }
  return {
    ok: false,
    titleRu: response.noOp ? 'ERP не настроен' : 'ERP синхронизация',
    descriptionRu:
      response.messageRu ?? response.errors?.[0] ?? 'Синхронизация не подтверждена (fail-closed).',
    destructive: true,
  };
}

/** Vendor bidding: без артикула / без PG bids — только placeholder. */
export function shouldShowWorkshop2VendorBiddingPlaceholder(input: {
  articleId?: string | null;
  bidsCount: number;
  hasDossierBidLink?: boolean;
}): boolean {
  if (!input.articleId?.trim()) return true;
  if (input.bidsCount > 0 && input.hasDossierBidLink) return false;
  return true;
}

/** Matchmaker: без matchmakerMirror в PG — не «synced». */
export function summarizeWorkshop2MatchmakerSyncUi(input: {
  hasMatchmakerResult: boolean;
  hasMatchmakerMirror: boolean;
  lastRunAt?: string;
}): Workshop2MatchmakerSyncUi {
  if (!input.hasMatchmakerResult) {
    return {
      label: 'Подбор не выполнен',
      tone: 'muted',
      mirrorInPg: false,
    };
  }
  if (!input.hasMatchmakerMirror) {
    return {
      label: 'В досье · mirror не в PG',
      tone: 'amber',
      mirrorInPg: false,
    };
  }
  const ts = input.lastRunAt ? new Date(input.lastRunAt).toLocaleString('ru-RU') : undefined;
  return {
    label: ts ? `Mirror в PG · ${ts}` : 'Mirror в PG',
    tone: 'emerald',
    mirrorInPg: true,
  };
}

/** Legacy requisitions POST 410 → migration path для UI. */
export function parseWorkshop2LegacyRequisitionResponse(input: {
  status: number;
  body: Record<string, unknown>;
}): Workshop2LegacyRequisitionMigration {
  if (input.status === 410) {
    const message =
      typeof input.body.message === 'string' ? input.body.message : 'Расчёт calculated удалён.';
    const canonical = typeof input.body.canonical === 'string' ? input.body.canonical : undefined;
    return {
      isLegacy: true,
      status: 410,
      titleRu: 'Legacy API удалён (410)',
      messageRu: `${message} Используйте POST …/sample-material-request.`,
      canonicalPath: canonical,
    };
  }
  if (input.status === 308) {
    const redirect = typeof input.body.redirect === 'string' ? input.body.redirect : undefined;
    return {
      isLegacy: true,
      status: 308,
      titleRu: 'Перенаправление на sample-material-request',
      messageRu:
        typeof input.body.message === 'string'
          ? input.body.message
          : 'Создайте заявку через sample-material-request (PG).',
      canonicalPath: redirect,
    };
  }
  return {
    isLegacy: false,
    status: input.status,
    titleRu: '',
    messageRu: '',
  };
}

/** dataMode badge: единственное место — workspace header. */
export function shouldRenderWorkshop2DataModeBadgeInPanel(): boolean {
  return false;
}

export function formatWorkshop2DataModeBadgeLabel(dataMode: Workshop2DataMode): string {
  return dataMode === 'http' ? 'API' : 'local';
}
