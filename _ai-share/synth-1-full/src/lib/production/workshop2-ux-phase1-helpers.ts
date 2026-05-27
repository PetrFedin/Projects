/**
 * Phase 1A UX — pure helpers for status chips / collapsible (testable, no gate logic).
 */
import {
  workshop2ArticleHref,
  workshop2ArticlePath,
  workshop2CollectionListHref,
} from '@/lib/production/workshop2-url';
import type { Workshop2WorkspaceHandoffChecklistStatus } from '@/lib/production/workshop2-workspace-handoff-checklist-status';
import type { Workshop2WorkspaceHeaderPulseStatus } from '@/lib/production/workshop2-workspace-header-pulse-status';
import type { Workshop2MainTabStripStatus } from '@/lib/production/workshop2-main-tab-strip-status';
import type { Workshop2VaultPanelStatus } from '@/lib/production/workshop2-vault-panel-status';
import type { Workshop2DocumentsIndexStatus } from '@/lib/production/workshop2-documents-index-status';
import type { Workshop2TzExportBundleStatus } from '@/lib/production/workshop2-tz-export-bundle-status';
import type { Workshop2SupplyBundleStatus } from '@/lib/production/workshop2-supply-bundle-status';
import type { Workshop2TaMilestonesStatus } from '@/lib/production/workshop2-ta-milestones-status';
import type { Workshop2LabDipStatusSummary } from '@/lib/production/workshop2-lab-dip-status';
import type { Workshop2HubArticlesListStatus } from '@/lib/production/workshop2-hub-articles-list-status';
import type { Workshop2HubFilterStatus } from '@/lib/production/workshop2-hub-filter-status';
import type { Workshop2SampleOrderStatus } from '@/lib/production/workshop2-sample-order-status';
import type { Workshop2GoldSampleSummary } from '@/lib/production/workshop2-gold-sample-status';
import type { Workshop2FitSessionsStatus } from '@/lib/production/workshop2-fit-sessions-status';
import type { Workshop2ArticleDevelopmentStateDisplay } from '@/lib/production/workshop2-article-development-state-display';

export type Workshop2UxChipTone = 'neutral' | 'amber' | 'emerald' | 'rose';

export type Workshop2UxStatusChip = {
  id: string;
  label: string;
  hintRu?: string;
  detailRu?: string;
  tone: Workshop2UxChipTone;
};

export function mapBannerToneToChipTone(
  tone: 'amber' | 'emerald' | 'rose' | undefined
): Workshop2UxChipTone {
  if (tone === 'emerald') return 'emerald';
  if (tone === 'rose') return 'rose';
  if (tone === 'amber') return 'amber';
  return 'neutral';
}

export function shouldWorkspaceStatusCollapseDefault(input: {
  tabStrip: Workshop2MainTabStripStatus;
  pulse: Workshop2WorkspaceHeaderPulseStatus;
  handoff: Workshop2WorkspaceHandoffChecklistStatus | null;
}): boolean {
  const tabsOk = (input.tabStrip.hiddenTabIds?.length ?? 0) === 0;
  const pulseOk = input.pulse.state === 'ready' || input.pulse.state === 'aligned';
  const handoffOk = !input.handoff || input.handoff.state === 'ready';
  return tabsOk && pulseOk && handoffOk;
}

export function buildWorkshop2WorkspaceStatusChips(input: {
  tabStrip: Workshop2MainTabStripStatus;
  pulse: Workshop2WorkspaceHeaderPulseStatus;
  handoff: Workshop2WorkspaceHandoffChecklistStatus | null;
  /** Wave R — critical path из articleDevelopmentStateMirror (hub parity). */
  development?: Workshop2ArticleDevelopmentStateDisplay | null;
}): Workshop2UxStatusChip[] {
  const chips: Workshop2UxStatusChip[] = [
    {
      id: 'tabs',
      label: `Вкладки ${input.tabStrip.visibleTabCount}/${input.tabStrip.totalTabCount}`,
      hintRu: input.tabStrip.hintRu,
      tone: input.tabStrip.hiddenTabIds.length > 0 ? 'amber' : 'emerald',
    },
    {
      id: 'pulse',
      label: `ТЗ ${input.pulse.tzOverallPct}% · Пульс ${input.pulse.preflightScore}`,
      hintRu: input.pulse.hintRu,
      detailRu:
        input.pulse.state !== 'ready'
          ? `Блокеров ${input.pulse.preflightBlockerCount} · предупреждений ${input.pulse.preflightWarningCount}`
          : undefined,
      tone:
        input.pulse.preflightBlockerCount > 0
          ? 'rose'
          : input.pulse.state === 'ready'
            ? 'emerald'
            : 'amber',
    },
  ];
  if (input.development) {
    chips.push({
      id: 'development-path',
      label: input.development.labelRu,
      hintRu: input.development.hintRu,
      detailRu: input.development.fromMirror
        ? `Шагов ${input.development.stepsDone}/${input.development.stepsTotal} · mirror PG/file`
        : `Шагов ${input.development.stepsDone}/${input.development.stepsTotal} · пересчёт UI`,
      tone: input.development.tone,
    });
  }
  if (input.handoff) {
    chips.push({
      id: 'handoff',
      label: `Handoff ${input.handoff.handoff.score10}/10`,
      hintRu: input.handoff.hintRu,
      detailRu: `Vault ${input.handoff.handoff.vaultFileCount} · блокеров ${input.handoff.blockerCount}`,
      tone:
        input.handoff.state === 'ready'
          ? 'emerald'
          : input.handoff.state === 'blocked'
            ? 'rose'
            : 'amber',
    });
  }
  return chips;
}

function stateToChipTone(state: string): Workshop2UxChipTone {
  if (state === 'ready' || state === 'complete') return 'emerald';
  if (state === 'blocked' || state === 'empty') return state === 'blocked' ? 'rose' : 'amber';
  return 'amber';
}

export function buildWorkshop2VaultPanelChips(input: {
  vault: Workshop2VaultPanelStatus;
  index: Workshop2DocumentsIndexStatus;
  tzBundle: Workshop2TzExportBundleStatus;
}): Workshop2UxStatusChip[] {
  return [
    {
      id: 'vault',
      label: 'Vault',
      hintRu: input.vault.hintRu,
      detailRu:
        input.vault.state !== 'ready'
          ? `Документов ${input.vault.totalDocs} · storage_path ${input.vault.withStoragePath}`
          : undefined,
      tone: stateToChipTone(input.vault.state),
    },
    {
      id: 'index',
      label: 'Индекс',
      hintRu: input.index.hintRu,
      detailRu: `Ссылок ${input.index.staticEntryCount}`,
      tone: stateToChipTone(input.index.state),
    },
    {
      id: 'tz-zip',
      label: 'ZIP ТЗ',
      hintRu: input.tzBundle.hintRu,
      tone: stateToChipTone(input.tzBundle.state),
    },
  ];
}

export function buildWorkshop2SupplyPanelMeta(input: {
  supply: Workshop2SupplyBundleStatus;
  ta: Workshop2TaMilestonesStatus;
  labDip: Workshop2LabDipStatusSummary | null;
  blockers?: string[];
}): {
  summary?: string;
  readiness?: string;
  nextAction?: string;
  blockers?: string[];
} {
  return {
    summary: input.supply.hintRu,
    readiness: `${input.ta.hintRu ?? 'T&A'} · ${input.labDip?.hintRu ?? 'Lab dip'}`,
    nextAction:
      input.supply.state === 'ready' && input.labDip?.state === 'ready'
        ? 'Сохраните снабжение и lab dip в досье при изменениях'
        : 'Заполните BOM и lab dip перед образцом',
    blockers: input.blockers?.length ? input.blockers : undefined,
  };
}

export function buildWorkshop2FitPanelMeta(input: {
  fitSessions: Workshop2FitSessionsStatus;
  fit3dHintRu?: string;
  fit3dIntegrationRu?: string;
  vaultHintRu?: string;
  /** Wave I #8: Floor chip из PG mirror (floorBridgeMirror). */
  floorChipLabelRu?: string;
}): {
  summary?: string;
  readiness?: string;
  nextAction?: string;
} {
  const readinessParts = [input.floorChipLabelRu, input.fit3dHintRu].filter(Boolean);
  return {
    summary: input.fitSessions.hintRu,
    readiness: readinessParts.length ? readinessParts.join(' · ') : undefined,
    nextAction: input.fit3dIntegrationRu ?? input.vaultHintRu,
  };
}

export function buildWorkshop2HubToolbarChips(input: {
  list: Workshop2HubArticlesListStatus;
  filter: Workshop2HubFilterStatus;
}): Workshop2UxStatusChip[] {
  return [
    {
      id: 'list',
      label: `Артикулы ${input.list.visibleArticleCount}`,
      hintRu: input.list.hintRu,
      tone: stateToChipTone(input.list.state),
    },
    {
      id: 'filter',
      label: input.filter.advancedActive ? 'Фильтр · расширенный' : 'Фильтр',
      hintRu: input.filter.hintRu,
      tone: input.filter.advancedActive ? 'amber' : 'emerald',
    },
  ];
}

export function buildWorkshop2SamplePanelMeta(input: {
  order: Workshop2SampleOrderStatus;
  gold: Workshop2GoldSampleSummary;
}): {
  summary?: string;
  readiness?: string;
  nextAction?: string;
} {
  return {
    summary: input.order.hintRu,
    readiness: input.gold.hintRu,
    nextAction: input.gold.approved
      ? 'Эталон утверждён — синхронизация с цехом'
      : 'Создайте заказ образца или утвердите эталон',
  };
}

export function buildWorkshop2CreateArticleSubmitTooltip(input: {
  formHintRu?: string;
  assemblyHintRu?: string;
  canSubmit: boolean;
  attachError?: string | null;
}): string {
  if (input.attachError) return input.attachError;
  if (!input.canSubmit) {
    return (
      [input.formHintRu, input.assemblyHintRu].filter(Boolean).join(' · ') || 'Форма не готова'
    );
  }
  const parts = [input.formHintRu, input.assemblyHintRu].filter(Boolean);
  return parts.length ? parts.join(' · ') : 'Готово к сохранению';
}

/** Стабильный снимок chips для unit-тестов (без функций/undefined). */
export function serializeWorkshop2UxChipsForSnapshot(chips: Workshop2UxStatusChip[]): Array<{
  id: string;
  label: string;
  tone: Workshop2UxChipTone;
  hintRu?: string;
  detailRu?: string;
}> {
  return chips.map((c) => ({
    id: c.id,
    label: c.label,
    tone: c.tone,
    ...(c.hintRu ? { hintRu: c.hintRu } : {}),
    ...(c.detailRu ? { detailRu: c.detailRu } : {}),
  }));
}

/** Deep links для панелей Phase 1A (href builders, без gate-логики). */
export function buildWorkshop2UxPhase1ArticleHrefs(
  collectionId: string,
  articleSegment: string
): {
  supplyPane: string;
  fitPane: string;
  fitSection: string;
  vaultUpload: string;
  hubList: string;
} {
  return {
    supplyPane: workshop2ArticleHref(collectionId, articleSegment, { w2pane: 'supply' }),
    fitPane: workshop2ArticleHref(collectionId, articleSegment, { w2pane: 'fit' }),
    fitSection: workshop2ArticleHref(collectionId, articleSegment, {
      w2pane: 'fit',
      hash: 'w2article-section-fit',
    }),
    /** Вкладка Vault пока без `w2pane` — путь артикула + ручной переход на «Документы». */
    vaultUpload: workshop2ArticlePath(collectionId, articleSegment),
    hubList: workshop2CollectionListHref(collectionId),
  };
}
