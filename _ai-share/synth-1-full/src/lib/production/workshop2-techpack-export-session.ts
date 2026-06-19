import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { shopMatrixWorkspaceTabHref } from '@/lib/b2b/shop-collection-order-hrefs';
import { brandOrderCommsTabHref } from '@/lib/b2b/brand-collection-order-hrefs';
import { buildBrandShowroomBuySession } from '@/lib/fashion/brand-showroom-buy';
import { buildSupplierMrpSupplySession } from '@/lib/fashion/supplier-mrp-supply';
import {
  factoryProductionDossierHref,
  brandMessagesWorkshop2ArticleContextHref,
  ROUTES,
  shopB2bWorkingOrderOrderContextHref,
} from '@/lib/routes';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';
import type { Workshop2TechPackExportSheetId } from '@/lib/production/workshop2-techpack-export-sheets';
import { WORKSHOP2_TECHPACK_EXPORT_SHEETS } from '@/lib/production/workshop2-techpack-export-sheets';

export type BrandTechPackCrossLink = {
  id: string;
  labelRu: string;
  summaryRu: string;
  href: string;
  pillarRu: string;
};

export type BrandTechPackExportSession = {
  articleId: string;
  collectionId: string;
  sku: string;
  orderId: string;
  sheetsTotal: number;
  factoryPackPreviewHref: string;
  dossierAssignmentHref: string;
  matrixQtyHref: string;
  prepackHref: string;
  workingOrderHref: string;
  brandHandoffHref: string;
  factoryDossierHref: string;
  showroomPreviewHref: string;
  syndicationHref: string;
  releaseGateHref: string;
  supplierMrpHref: string;
  materialPassportHref: string;
  sizeChartHref: string;
  sketchPinCommsHref: string;
  brandProductionOpsHref: string;
  crossLinks: BrandTechPackCrossLink[];
  sheetIds: Workshop2TechPackExportSheetId[];
};

function crossLink(
  id: string,
  labelRu: string,
  summaryRu: string,
  href: string,
  pillarRu: string
): BrandTechPackCrossLink {
  return { id, labelRu, summaryRu, href, pillarRu };
}

export function buildBrandTechPackExportSession(input: {
  articleId: string;
  collectionId?: string;
  sku?: string;
  orderId?: string;
}): BrandTechPackExportSession {
  const collectionId = input.collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId;
  const articleId = input.articleId.trim();
  const orderId = input.orderId?.trim() || PLATFORM_CORE_DEMO.demoOrderId;
  const sku = input.sku?.trim() || articleId;
  const dossierBase = workshop2ArticleHref(collectionId, articleId, {
    w2pane: 'tz',
    w2sec: 'assignment',
  });
  const dossierAssignmentHref = `${dossierBase}${dossierBase.includes('?') ? '&' : '?'}${PILLAR_CAPABILITY_FEATURE_PARAM}=factory-pack`;
  const showroom = buildBrandShowroomBuySession({ collectionId });
  const supplier = buildSupplierMrpSupplySession({ collectionId, articleId, orderId });
  const matrixQtyHref = shopMatrixWorkspaceTabHref('matrix', collectionId, orderId, articleId);
  const prepackHref = shopMatrixWorkspaceTabHref('prepack', collectionId, orderId);
  const workingOrderHref = `${shopB2bWorkingOrderOrderContextHref(orderId)}&collection=${encodeURIComponent(collectionId)}&${PILLAR_CAPABILITY_FEATURE_PARAM}=handoff`;
  const factoryDossierHref = factoryProductionDossierHref(articleId, { collectionId });
  const sketchPinCommsHref = `${brandMessagesWorkshop2ArticleContextHref(collectionId, articleId)}&q=${encodeURIComponent('sketch pin')}`;
  const sizeChartHref = `${ROUTES.brand.attributeHealth}?${PILLAR_CAPABILITY_FEATURE_PARAM}=size-chart&collection=${encodeURIComponent(collectionId)}`;
  const materialPassportHref = `${ROUTES.brand.fabricPassportRollup}?${PILLAR_CAPABILITY_FEATURE_PARAM}=certs&collection=${encodeURIComponent(collectionId)}`;
  const brandProductionOpsHref = `${ROUTES.brand.productionOperations}?${PILLAR_CAPABILITY_FEATURE_PARAM}=handoff&order=${encodeURIComponent(orderId)}&collection=${encodeURIComponent(collectionId)}`;

  const crossLinks: BrandTechPackCrossLink[] = [
    crossLink(
      'colorway-showroom',
      'Showroom · colorway',
      'development → sample_collection: preview после release.',
      showroom.previewHref,
      'sample_collection'
    ),
    crossLink(
      'syndication',
      'Linesheet / syndication',
      'Colect outbound после tech pack complete.',
      showroom.syndicationHref,
      'sample_collection'
    ),
    crossLink(
      'matrix-qty',
      'Shop matrix · qty',
      'collection_order: color×size SoT для листа 6.',
      matrixQtyHref,
      'collection_order'
    ),
    crossLink(
      'working-order',
      'Working order / PO',
      'NuOrder версия → production handoff.',
      workingOrderHref,
      'collection_order'
    ),
    crossLink(
      'factory-dossier',
      'Factory dossier',
      'development → order_production: read-only pack.',
      factoryDossierHref,
      'order_production'
    ),
    crossLink(
      'supplier-mrp',
      'Supplier MRP · BOM',
      'BOM/colorway → supply tab.',
      supplier.supplyTabHref,
      'order_production'
    ),
    crossLink(
      'sketch-comms',
      'Pin threads · comms',
      'factory ↔ brand правки по sketch pins.',
      sketchPinCommsHref,
      'comms'
    ),
    crossLink(
      'release-gate',
      'Release gate',
      '6 листов green → showroom / handoff.',
      showroom.releaseGateHref,
      'sample_collection'
    ),
  ];

  return {
    articleId,
    collectionId,
    sku,
    orderId,
    sheetsTotal: WORKSHOP2_TECHPACK_EXPORT_SHEETS.length,
    factoryPackPreviewHref: dossierAssignmentHref,
    dossierAssignmentHref,
    matrixQtyHref,
    prepackHref,
    workingOrderHref,
    brandHandoffHref: brandOrderCommsTabHref('handoff', orderId, collectionId),
    factoryDossierHref,
    showroomPreviewHref: showroom.previewHref,
    syndicationHref: showroom.syndicationHref,
    releaseGateHref: showroom.releaseGateHref,
    supplierMrpHref: supplier.supplyTabHref,
    materialPassportHref,
    sizeChartHref,
    sketchPinCommsHref,
    brandProductionOpsHref,
    crossLinks,
    sheetIds: WORKSHOP2_TECHPACK_EXPORT_SHEETS.map((s) => s.id),
  };
}

export function brandTechPackExportHubHref(collectionId?: string): string {
  const collection = collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId;
  return `${ROUTES.brand.productionWorkshop2}?collection=${encodeURIComponent(collection)}&${PILLAR_CAPABILITY_FEATURE_PARAM}=factory-pack`;
}
