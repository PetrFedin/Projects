'use client';

import Link from 'next/link';
import { brandSampleLifecycleFeatureHref } from '@/lib/fashion/brand-sample-lifecycle-workspace';
import { brandAttributeSchemaFeatureHref } from '@/lib/fashion/brand-attribute-schema-workspace';
import {
  ROUTES,
  brandMessagesWorkshop2ArticleContextHref,
  factoryProductionDossierHref,
} from '@/lib/routes';
import { WORKSHOP2_COL_PARAM } from '@/lib/production/workshop2-url';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  articleId: string;
};

/** W2 hub · development-status peers — range, samples, factory, comms. */
export function BrandDevPgSyncPeerStrip({ collectionId, articleId }: Props) {
  const rangeHref = `${ROUTES.brand.rangePlanner}?collection=${encodeURIComponent(collectionId)}`;
  const w2ArticleHref = `${ROUTES.brand.productionWorkshop2}?${WORKSHOP2_COL_PARAM}=${encodeURIComponent(collectionId)}&article=${encodeURIComponent(articleId)}`;

  return (
    <div
      className={hubGadget.goldenPath}
      data-testid="brand-dev-pg-sync-peer-strip"
    >
      <Link href={rangeHref} data-testid="brand-dev-pg-sync-range-link" className={hubGadget.goldenLink}>
        План
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={brandSampleLifecycleFeatureHref('rounds', collectionId)}
        data-testid="brand-dev-pg-sync-sample-lifecycle-link"
        className={hubGadget.goldenLink}
      >
        Образцы
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={factoryProductionDossierHref(articleId, { collectionId })}
        data-testid="brand-dev-pg-sync-factory-dossier-link"
        className={hubGadget.goldenLink}
      >
        Досье цеха
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={brandAttributeSchemaFeatureHref('health', collectionId)}
        data-testid="brand-dev-pg-sync-schema-link"
        className={hubGadget.goldenLink}
      >
        Schema
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={brandMessagesWorkshop2ArticleContextHref(collectionId, articleId)}
        data-testid="brand-dev-pg-sync-article-comms-link"
        className={hubGadget.goldenLink}
      >
        Comms
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={w2ArticleHref} data-testid="brand-dev-pg-sync-w2-article-link" className={hubGadget.goldenLink}>
        W2 SKU
      </Link>
    </div>
  );
}
