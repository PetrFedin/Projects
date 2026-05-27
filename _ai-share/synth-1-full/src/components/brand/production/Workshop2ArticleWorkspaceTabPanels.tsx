'use client';

import { Fragment, useMemo } from 'react';
import { findHandbookLeafById } from '@/lib/production/category-catalog';
import { W2_ARTICLE_SECTION_DOM } from '@/lib/production/workshop2-url';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { SectionFlashWrap } from '@/components/brand/production/workshop2-article-workspace-tab-panels-shell';
import { Workshop2ArticleSupplyPanel } from '@/components/brand/production/workshop2-article-workspace-supply-panel';
import { Workshop2ArticleFitGoldPanel } from '@/components/brand/production/workshop2-article-workspace-fit-gold-panel';
import { Workshop2ArticlePlanPoPanel } from '@/components/brand/production/workshop2-article-workspace-plan-po-panel';
import { Workshop2ArticleNestingPanel } from '@/components/brand/production/workshop2-article-workspace-nesting-panel';
import { Workshop2ArticleReleasePanel } from '@/components/brand/production/workshop2-article-workspace-release-panel';
import { Workshop2ArticleQcPanel } from '@/components/brand/production/workshop2-article-workspace-qc-panel';
import { Workshop2ArticleStockPanel } from '@/components/brand/production/workshop2-article-workspace-stock-panel';
import { Workshop2AQLInspectionPanel } from '@/components/brand/production/Workshop2AQLInspectionPanel';
import { Workshop2LogisticsPanel } from '@/components/brand/production/Workshop2LogisticsPanel';
import { Workshop2FactoryERPIntegrationPanel } from '@/components/brand/production/Workshop2FactoryERPIntegrationPanel';
import { Workshop2ArticleOperationalTzRibbon } from '@/components/brand/production/Workshop2ArticleOperationalTzRibbon';
import { Workshop2ArticleWorkspaceVaultPanel } from '@/components/brand/production/workshop2-article-workspace-vault-panel';

export type Workshop2ArticleWorkspaceMainTab =
  | 'supply'
  | 'fit'
  | 'plan'
  | 'release'
  | 'qc'
  | 'stock'
  | 'vault';

export function Workshop2ArticleWorkspaceTabPanels({
  tab,
  flashSectionId = null,
  dossier,
  categoryLeafId,
  articleUrlSegment,
}: {
  tab: Workshop2ArticleWorkspaceMainTab;
  flashSectionId?: string | null;
  dossier: Workshop2DossierPhase1 | null;
  categoryLeafId: string;
  articleUrlSegment: string;
}) {
  const { ref } = useArticleWorkspace();
  const articleIdStr = String(ref.articleId);
  const leaf = useMemo(() => findHandbookLeafById(categoryLeafId) ?? null, [categoryLeafId]);

  const ribbon = (
    <Workshop2ArticleOperationalTzRibbon
      tab={tab}
      dossier={dossier}
      leaf={leaf}
      articleUrlSegment={articleUrlSegment}
    />
  );

  switch (tab) {
    case 'supply':
      return (
        <div className="space-y-3">
          {ribbon}
          <SectionFlashWrap id={W2_ARTICLE_SECTION_DOM.supply} flashSectionId={flashSectionId}>
            <Workshop2ArticleSupplyPanel dossier={dossier} />
          </SectionFlashWrap>
        </div>
      );
    case 'fit':
      return (
        <div className="space-y-3">
          {ribbon}
          <SectionFlashWrap id={W2_ARTICLE_SECTION_DOM.fit} flashSectionId={flashSectionId}>
            <Workshop2ArticleFitGoldPanel dossier={dossier} />
          </SectionFlashWrap>
        </div>
      );
    case 'plan':
      return (
        <div className="space-y-3">
          {ribbon}
          <SectionFlashWrap id={W2_ARTICLE_SECTION_DOM.planPo} flashSectionId={flashSectionId}>
            <Workshop2ArticlePlanPoPanel dossier={dossier} articleId={articleIdStr} />
          </SectionFlashWrap>
          <SectionFlashWrap id={W2_ARTICLE_SECTION_DOM.planNest} flashSectionId={flashSectionId}>
            <Workshop2ArticleNestingPanel dossier={dossier} />
          </SectionFlashWrap>
        </div>
      );
    case 'release':
      return (
        <div className="space-y-3">
          {ribbon}
          <SectionFlashWrap id={W2_ARTICLE_SECTION_DOM.release} flashSectionId={flashSectionId}>
            <Workshop2ArticleReleasePanel dossier={dossier} />
          </SectionFlashWrap>
          <Workshop2LogisticsPanel dossier={dossier} />
          <Workshop2FactoryERPIntegrationPanel articleId={articleIdStr} dossier={dossier} />
        </div>
      );
    case 'qc':
      return (
        <div className="space-y-3">
          {ribbon}
          <SectionFlashWrap id={W2_ARTICLE_SECTION_DOM.qc} flashSectionId={flashSectionId}>
            <Workshop2ArticleQcPanel dossier={dossier} />
          </SectionFlashWrap>
          <Workshop2AQLInspectionPanel dossier={dossier} />
        </div>
      );
    case 'stock':
      return (
        <div className="space-y-3">
          {ribbon}
          <SectionFlashWrap id={W2_ARTICLE_SECTION_DOM.stock} flashSectionId={flashSectionId}>
            <Workshop2ArticleStockPanel dossier={dossier} />
          </SectionFlashWrap>
        </div>
      );
    case 'vault':
      return (
        <div className="space-y-3">
          {ribbon}
          <SectionFlashWrap id="w2article-section-vault" flashSectionId={flashSectionId}>
            <Workshop2ArticleWorkspaceVaultPanel dossier={dossier} />
          </SectionFlashWrap>
        </div>
      );
    default:
      return null;
  }
}
