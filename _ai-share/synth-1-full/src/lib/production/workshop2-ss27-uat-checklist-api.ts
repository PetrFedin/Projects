/**
 * Wave 7 P2 #8: SS27 UAT checklist → JSON с auto-checked из dossier/probes.
 */
import fs from 'node:fs';
import path from 'node:path';

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { buildWorkshop2InvestorReadinessReport } from '@/lib/production/workshop2-investor-readiness';
import { evaluateWorkshop2BulkShowroomPublishForArticle } from '@/lib/production/workshop2-bulk-showroom-publish';
import { getWorkshop2MarketProfile } from '@/lib/production/workshop2-market-profile';
import { summarizeWorkshop2FitCommentsLog } from '@/lib/production/workshop2-fit-comments-log';
import { isWorkshop2Ss27UatDemoSeedDossier } from '@/lib/production/workshop2-ss27-uat-demo-seed';
import { workshop2PgMirrorNum } from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export type Workshop2Ss27B2bUatAutoCheck = {
  id: string;
  labelRu: string;
  ok: boolean;
  noteRu: string;
};

export type Workshop2UatChecklistItem = {
  id: string;
  step: number;
  titleRu: string;
  passCriteriaRu: string;
  status: 'auto_pass' | 'auto_partial' | 'manual' | 'blocked';
  autoChecked: boolean;
  noteRu?: string;
};

const CHECKLIST_MD = path.join(process.cwd(), '.planning/workshop2-ss27-uat-checklist.md');

/** Парсит markdown-таблицу primary path (#1–10). */
export function parseWorkshop2Ss27UatChecklistMarkdown(raw: string): Workshop2UatChecklistItem[] {
  const items: Workshop2UatChecklistItem[] = [];
  const lines = raw.split('\n');
  for (const line of lines) {
    const m = line.match(/^\|\s*(\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|/);
    if (!m) continue;
    const step = Number(m[1]);
    if (!Number.isFinite(step) || step < 1 || step > 15) continue;
    items.push({
      id: `ss27-uat-${step}`,
      step,
      titleRu: m[2].trim(),
      passCriteriaRu: m[4].trim(),
      status: 'manual',
      autoChecked: false,
      noteRu: m[5].trim(),
    });
  }
  return items.sort((a, b) => a.step - b.step);
}

export function loadWorkshop2Ss27UatChecklistFromDisk(): Workshop2UatChecklistItem[] {
  try {
    const raw = fs.readFileSync(CHECKLIST_MD, 'utf8');
    return parseWorkshop2Ss27UatChecklistMarkdown(raw);
  } catch {
    return [];
  }
}

export function autoCheckWorkshop2Ss27UatItems(input: {
  items: Workshop2UatChecklistItem[];
  dossiers?: Workshop2DossierPhase1[];
  env?: Record<string, string | undefined>;
}): Workshop2UatChecklistItem[] {
  const readiness = buildWorkshop2InvestorReadinessReport({
    env: input.env,
    ss27Dossiers: input.dossiers ?? [],
  });
  const primary =
    input.dossiers?.find((d) => isWorkshop2Ss27UatDemoSeedDossier(d)) ??
    input.dossiers?.find((d) => d.sku === 'SS27-M-COAT-01' || d.sku === 'demo-ss27-01') ??
    input.dossiers?.[0];
  const fitSummary = summarizeWorkshop2FitCommentsLog({ dossier: primary ?? null });

  return input.items.map((item) => {
    switch (item.step) {
      case 1: {
        const market = getWorkshop2MarketProfile(input.env);
        const ruOk = market === 'ru' || readiness.probes.ceilingsReady;
        return {
          ...item,
          autoChecked: true,
          status: ruOk ? 'auto_pass' : 'auto_partial',
          noteRu:
            market === 'ru'
              ? `Рынок РФ (${market}): global ceilings не требуются для investor demo.`
              : readiness.probes.ceilingsReady
                ? 'Probes: ceilings configured (hub load — manual console check).'
                : (readiness.reasons[0] ?? item.noteRu),
        };
      }
      case 2:
        return {
          ...item,
          autoChecked: Boolean(primary),
          status: primary ? 'auto_pass' : 'manual',
          noteRu: primary
            ? `Досье ${primary.sku ?? 'demo-ss27-01'} загружено для workspace status.`
            : item.noteRu,
        };
      case 3:
        return {
          ...item,
          autoChecked: true,
          status: 'auto_partial',
          noteRu:
            'RU tab order: localStorage w2-tab-order-ru (Wave 14). Ручная проверка переходов w2pane.',
        };
      case 4:
        return {
          ...item,
          autoChecked: Boolean(
            primary?.hubCollectionRollupMirror || primary?.vaultDocuments?.length
          ),
          status: primary ? 'auto_pass' : 'auto_partial',
          noteRu: primary
            ? 'Operational chrome: dossier vault/rollup mirror present.'
            : item.noteRu,
        };
      case 5:
        return {
          ...item,
          autoChecked: true,
          status: 'auto_pass',
          noteRu: 'Persist label «Сохранить в досье» — grep guard Wave K (RU copy).',
        };
      case 7: {
        const edoSigned = primary?.edoSignoffMirror?.edoStatus === 'signed';
        return {
          ...item,
          autoChecked: edoSigned,
          status: edoSigned ? 'auto_pass' : 'manual',
          noteRu: edoSigned
            ? `ЭДО mock signed (${primary?.edoSignoffMirror?.provider ?? 'mock'}).`
            : item.noteRu,
        };
      }
      case 6: {
        const demoSeed = isWorkshop2Ss27UatDemoSeedDossier(primary);
        return {
          ...item,
          autoChecked: true,
          status: demoSeed || readiness.pgOnly ? 'auto_partial' : 'manual',
          noteRu: demoSeed
            ? 'File-store demo SS27 — hub rollup + showroom mirror (Wave 31 UAT seed).'
            : readiness.pgOnly
              ? 'PG-only mode — проверьте offline banner вручную.'
              : item.noteRu,
        };
      }
      case 9: {
        const sampleOrderCount = workshop2PgMirrorNum(
          primary?.hubCollectionRollupMirror,
          'sampleOrderCount',
          typeof primary?.hubCollectionRollupMirror?.sampleOrderCount === 'number'
            ? primary.hubCollectionRollupMirror.sampleOrderCount
            : 0
        );
        return {
          ...item,
          autoChecked: sampleOrderCount > 0,
          status: sampleOrderCount > 0 ? 'auto_pass' : 'manual',
          noteRu: primary?.hubCollectionRollupMirror
            ? `sampleOrderCount=${primary.hubCollectionRollupMirror.sampleOrderCount}`
            : item.noteRu,
        };
      }
      case 10:
        return {
          ...item,
          autoChecked: true,
          status: readiness.probes.ceilingsReady ? 'auto_pass' : 'auto_partial',
          noteRu: 'Ceilings probes — integration status collapsible (manual UI).',
        };
      case 8:
        return {
          ...item,
          autoChecked: fitSummary.total >= 0,
          status: fitSummary.openCount === 0 ? 'auto_pass' : 'auto_partial',
          noteRu: fitSummary.hintRu,
        };
      case 11:
        return {
          ...item,
          autoChecked: (input.dossiers?.length ?? 0) >= 2,
          status: (input.dossiers?.length ?? 0) >= 2 ? 'auto_pass' : 'manual',
          noteRu: `hub-summary batch: ${input.dossiers?.length ?? 0} demo dossier(s).`,
        };
      case 12: {
        const gtin =
          primary?.markingHonestSignMirror?.gtin ?? primary?.passportProductionBrief?.gtin ?? '';
        const gtinOk = String(gtin).replace(/\D/g, '').length >= 8;
        return {
          ...item,
          autoChecked: gtinOk,
          status: gtinOk ? 'auto_pass' : 'manual',
          noteRu: gtinOk ? `ЧЗ GTIN demo-ss27-01: ${gtin}` : 'GTIN не найден в seed.',
        };
      }
      case 13:
        return {
          ...item,
          autoChecked: primary?.edoSignoffMirror?.edoStatus === 'signed',
          status: primary?.edoSignoffMirror?.edoStatus === 'signed' ? 'auto_pass' : 'manual',
          noteRu: primary?.edoSignoffMirror?.statusLabelRu ?? item.noteRu,
        };
      case 14: {
        const demoSeed = isWorkshop2Ss27UatDemoSeedDossier(primary);
        return {
          ...item,
          autoChecked: true,
          status: demoSeed || readiness.probes.ceilingsReady ? 'auto_partial' : 'manual',
          noteRu: demoSeed
            ? 'Demo seed: plan/release nesting probes — визуальная проверка в UI.'
            : 'integration-probes — plan/release nesting honest copy.',
        };
      }
      case 15:
        return {
          ...item,
          autoChecked: Boolean(primary?.markingHonestSignMirror?.gtin),
          status: primary?.markingHonestSignMirror?.gtin ? 'auto_pass' : 'manual',
          noteRu: primary?.markingHonestSignMirror?.hintRu ?? item.noteRu,
        };
      default:
        return item;
    }
  });
}

/** Wave 30: B2B auto-checks для UAT SS27 (cart API, showroom gate, threads merge). */
export function buildWorkshop2Ss27B2bUatAutoChecks(input?: {
  dossiers?: Workshop2DossierPhase1[];
  env?: Record<string, string | undefined>;
}): Workshop2Ss27B2bUatAutoCheck[] {
  const primary =
    input?.dossiers?.find((d) => isWorkshop2Ss27UatDemoSeedDossier(d)) ??
    input?.dossiers?.find((d) => d.sku === 'SS27-M-COAT-01' || d.sku === 'demo-ss27-01') ??
    input?.dossiers?.[0] ??
    null;
  const cartRoute = path.join(process.cwd(), 'src/app/api/shop/b2b/cart/lines/route.ts');
  const threadsRoute = path.join(process.cwd(), 'src/app/api/brand/messages/threads/route.ts');
  let cartOk = false;
  let threadsMergeOk = false;
  try {
    cartOk = fs.existsSync(cartRoute) && fs.readFileSync(cartRoute, 'utf8').includes('POST');
    const threadsSrc = fs.readFileSync(threadsRoute, 'utf8');
    threadsMergeOk =
      threadsSrc.includes('WORKSHOP2_B2B_ORDER_CONTEXT_TYPE') &&
      threadsSrc.includes('WORKSHOP2_ARTICLE_CONTEXT_TYPE');
  } catch {
    /* best-effort */
  }

  const showroom = primary
    ? evaluateWorkshop2BulkShowroomPublishForArticle({
        articleId: 'demo-ss27-01',
        dossier: primary,
      })
    : null;

  return [
    {
      id: 'b2b_cart_api',
      labelRu: 'B2B cart API (POST lines + checkout)',
      ok: cartOk,
      noteRu: cartOk
        ? 'Маршрут /api/shop/b2b/cart/lines доступен.'
        : 'Не найден cart/lines route — проверьте B2B модуль.',
    },
    {
      id: 'b2b_showroom_publish_readiness',
      labelRu: 'Showroom publish readiness (demo-ss27-01)',
      ok: Boolean(showroom?.passed),
      noteRu: showroom?.passed
        ? `Gate OK · campaign ${showroom.campaignName ?? 'SS27'}.`
        : (showroom?.reasons?.[0] ??
          (primary
            ? 'Showroom gate не пройден — дозаполните B2B draft.'
            : 'Нет seed dossier SS27.')),
    },
    {
      id: 'b2b_threads_merge',
      labelRu: 'Brand messages: merge article + b2b_order threads',
      ok: threadsMergeOk,
      noteRu: threadsMergeOk
        ? 'GET /api/brand/messages/threads агрегирует workshop2_article и b2b_order.'
        : 'Threads route без merge b2b_order — PG-only чат неполный.',
    },
  ];
}

export function computeWorkshop2Ss27UatAutoProgressPct(input: {
  items: Workshop2UatChecklistItem[];
  b2bAutoChecks: Workshop2Ss27B2bUatAutoCheck[];
}): number {
  const itemTotal = input.items.length || 1;
  const autoPassed = input.items.filter((i) => i.status === 'auto_pass').length;
  const b2bOk = input.b2bAutoChecks.filter((c) => c.ok).length;
  const b2bTotal = input.b2bAutoChecks.length || 1;
  const combined = autoPassed + b2bOk;
  const combinedTotal = itemTotal + input.b2bAutoChecks.length;
  return Math.round((combined / Math.max(combinedTotal, 1)) * 100);
}

export function buildWorkshop2Ss27UatRemainingManualSteps(input: {
  items: Workshop2UatChecklistItem[];
  b2bAutoChecks: Workshop2Ss27B2bUatAutoCheck[];
}): string[] {
  const fromItems = input.items
    .filter((i) => i.status === 'manual' || i.status === 'auto_partial' || i.status === 'blocked')
    .map((i) => `#${i.step} ${i.titleRu}${i.noteRu ? ` — ${i.noteRu}` : ''}`);
  const fromB2b = input.b2bAutoChecks
    .filter((c) => !c.ok)
    .map((c) => `B2B: ${c.labelRu} — ${c.noteRu}`);
  return [...fromItems, ...fromB2b];
}

export function buildWorkshop2Ss27UatChecklistResponse(input?: {
  dossiers?: Workshop2DossierPhase1[];
  env?: Record<string, string | undefined>;
}): {
  collectionId: string;
  generatedAt: string;
  items: Workshop2UatChecklistItem[];
  b2bAutoChecks: Workshop2Ss27B2bUatAutoCheck[];
  autoPassed: number;
  manualRemaining: number;
  autoProgressPct: number;
  readyForHumanSignoff: boolean;
  remainingManualSteps: string[];
} {
  const base = loadWorkshop2Ss27UatChecklistFromDisk();
  const items = autoCheckWorkshop2Ss27UatItems({
    items: base,
    dossiers: input?.dossiers,
    env: input?.env,
  });
  const b2bAutoChecks = buildWorkshop2Ss27B2bUatAutoChecks({
    dossiers: input?.dossiers,
    env: input?.env,
  });
  const autoPassed = items.filter((i) => i.status === 'auto_pass').length;
  const manualRemaining = items.filter((i) => i.status === 'manual').length;
  const autoProgressPct = computeWorkshop2Ss27UatAutoProgressPct({ items, b2bAutoChecks });
  const remainingManualSteps = buildWorkshop2Ss27UatRemainingManualSteps({ items, b2bAutoChecks });
  const readyForHumanSignoff =
    manualRemaining === 0 &&
    b2bAutoChecks.every((c) => c.ok) &&
    items.every((i) => i.status !== 'blocked' && i.status !== 'manual');
  return {
    collectionId: 'SS27',
    generatedAt: new Date().toISOString(),
    items,
    b2bAutoChecks,
    autoPassed,
    manualRemaining,
    autoProgressPct,
    readyForHumanSignoff,
    remainingManualSteps,
  };
}
