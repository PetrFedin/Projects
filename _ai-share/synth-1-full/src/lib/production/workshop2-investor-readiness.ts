/**
 * Wave 6 P1: investor demo readiness — агрегация wave1–5 probes + SS27 fill + PG-only + tests.
 */
import {
  buildWorkshop2Wave1HorizontalProbes,
  buildWorkshop2Wave2HorizontalProbes,
  buildWorkshop2Wave3HorizontalProbes,
  buildWorkshop2Wave4HorizontalProbes,
  buildWorkshop2Wave5HorizontalProbes,
  buildWorkshop2Wave6HorizontalProbes,
  buildWorkshop2Wave7HorizontalProbes,
  workshop2ReadyForInvestorDemo,
  type Workshop2ProcessEnvLike,
} from '@/lib/production/workshop2-live-integration-probes-env';
import { isWorkshop2PgOnlyMode } from '@/lib/production/workshop2-hub-pg-only-policy';
import { getWorkshop2ReadinessSnapshot } from '@/lib/production/workshop2-readiness-snapshot';
import {
  formatWorkshop2InvestorReadinessStagingNoteRu,
  isWorkshop2StagingContractModeEnabled,
} from '@/lib/production/workshop2-staging-contract-mode';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { getWorkshop2MarketProfile } from '@/lib/production/workshop2-market-profile';
import { buildWorkshop2Wave9RuHorizontalProbes } from '@/lib/production/workshop2-live-integration-probes-env';

export type Workshop2InvestorReadinessReport = {
  readyForInvestorDemo: boolean;
  reasons: string[];
  generatedAt: string;
  probes: {
    wave1Horizontal: ReturnType<typeof buildWorkshop2Wave1HorizontalProbes>;
    wave2Horizontal: ReturnType<typeof buildWorkshop2Wave2HorizontalProbes>;
    wave3Horizontal: ReturnType<typeof buildWorkshop2Wave3HorizontalProbes>;
    wave4Horizontal: ReturnType<typeof buildWorkshop2Wave4HorizontalProbes>;
    wave5Horizontal: ReturnType<typeof buildWorkshop2Wave5HorizontalProbes>;
    wave6Horizontal: ReturnType<typeof buildWorkshop2Wave6HorizontalProbes>;
    wave7Horizontal: ReturnType<typeof buildWorkshop2Wave7HorizontalProbes>;
    wave9RuHorizontal?: ReturnType<typeof buildWorkshop2Wave9RuHorizontalProbes>;
    ceilingsReady: boolean;
    market: 'ru' | 'global';
  };
  ss27: {
    articleCount: number;
    avgTzFillPct: number | null;
    minFillThreshold: number;
  };
  pgOnly: boolean;
  unitTests: {
    expectedMin: number;
    flagSet: boolean;
    messageRu: string;
  };
  stagingMode: boolean;
  stagingNoteRu: string;
};

export function summarizeWorkshop2Ss27DossierFill(input: { dossiers: Workshop2DossierPhase1[] }): {
  articleCount: number;
  avgTzFillPct: number | null;
} {
  if (!input.dossiers.length) return { articleCount: 0, avgTzFillPct: null };
  const pcts = input.dossiers.map(
    (d) => getWorkshop2ReadinessSnapshot({ dossier: d }).tzOverallPct
  );
  const avgTzFillPct = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
  return { articleCount: input.dossiers.length, avgTzFillPct };
}

export function buildWorkshop2InvestorReadinessReport(input?: {
  env?: Workshop2ProcessEnvLike;
  ss27Dossiers?: Workshop2DossierPhase1[];
}): Workshop2InvestorReadinessReport {
  const env = input?.env ?? process.env;
  const market = getWorkshop2MarketProfile(env);
  const reasons: string[] = [];
  const ceilingsReady = workshop2ReadyForInvestorDemo(env);
  if (!ceilingsReady) {
    reasons.push(
      'Integration ceilings: localhost configured без prod live — см. /api/workshop2/integration-probes.'
    );
  }

  const pgOnly = isWorkshop2PgOnlyMode();
  if (pgOnly) {
    reasons.push(
      'WORKSHOP2_PG_ONLY активен — убедитесь что PostgreSQL доступен для investor walkthrough.'
    );
  }

  const ss27Fill = summarizeWorkshop2Ss27DossierFill({ dossiers: input?.ss27Dossiers ?? [] });
  const minFillThreshold =
    Number(String(env.WORKSHOP2_INVESTOR_MIN_SS27_FILL_PCT ?? '40').trim()) || 40;
  if (ss27Fill.articleCount === 0) {
    reasons.push('SS27: нет загруженных dossier для расчёта fill % — seed или PG.');
  } else if (ss27Fill.avgTzFillPct != null && ss27Fill.avgTzFillPct < minFillThreshold) {
    reasons.push(`SS27 avg TZ fill ${ss27Fill.avgTzFillPct}% ниже порога ${minFillThreshold}%.`);
  }

  const expectedMin = Number(String(env.WORKSHOP2_UNIT_TEST_MIN ?? '900').trim()) || 900;
  const testsFlag = String(env.WORKSHOP2_UNIT_TESTS_PASSING ?? '')
    .trim()
    .toLowerCase();
  const flagSet = testsFlag === 'true' || testsFlag === '1';
  if (!flagSet && process.env.NODE_ENV !== 'test') {
    reasons.push(
      `Unit tests: задайте WORKSHOP2_UNIT_TESTS_PASSING=true после npm run test:workshop2:unit (ожидается ≥${expectedMin}).`
    );
  }

  const wave4 = buildWorkshop2Wave4HorizontalProbes(env);
  if (
    market === 'global' &&
    wave4.shopifyOAuth.configured &&
    wave4.shopifyOAuth.status === 'not_connected'
  ) {
    reasons.push(
      'Shopify OAuth scaffold готов, но магазин not_connected — завершите OAuth callback.'
    );
  }

  /** Wave 11 RU: не блокировать investor demo global-only причинами в ru market. */
  const ruFilteredReasons =
    market === 'ru'
      ? reasons.filter((r) => !/shopify|joor|nuorder|us_edi|eu_dpp|slack|teams/i.test(r))
      : reasons;

  const stagingMode = isWorkshop2StagingContractModeEnabled(env);
  const stagingNoteRu = formatWorkshop2InvestorReadinessStagingNoteRu(env);

  const readyForInvestorDemo = ruFilteredReasons.length === 0 && ceilingsReady;

  return {
    readyForInvestorDemo,
    reasons: ruFilteredReasons,
    generatedAt: new Date().toISOString(),
    probes: {
      wave1Horizontal: buildWorkshop2Wave1HorizontalProbes(env),
      wave2Horizontal: buildWorkshop2Wave2HorizontalProbes(env),
      wave3Horizontal: buildWorkshop2Wave3HorizontalProbes(env),
      wave4Horizontal: wave4,
      wave5Horizontal: buildWorkshop2Wave5HorizontalProbes(env),
      wave6Horizontal: buildWorkshop2Wave6HorizontalProbes(env),
      wave7Horizontal: buildWorkshop2Wave7HorizontalProbes(env),
      wave9RuHorizontal: buildWorkshop2Wave9RuHorizontalProbes(env),
      ceilingsReady,
      market,
    },
    ss27: {
      articleCount: ss27Fill.articleCount,
      avgTzFillPct: ss27Fill.avgTzFillPct,
      minFillThreshold,
    },
    pgOnly,
    unitTests: {
      expectedMin,
      flagSet,
      messageRu: flagSet
        ? `Unit tests flag OK (≥${expectedMin} expected).`
        : `Установите WORKSHOP2_UNIT_TESTS_PASSING после green test:workshop2:unit.`,
    },
    stagingMode,
    stagingNoteRu,
  };
}
