/**
 * @generated split from platform-core-readiness-sections.ts — do not edit monolith; edit role file.
 */
import type { CoreChainRoleId, CoreHubPillarId } from '@/lib/platform-core-hub-matrix';
import {
  brandLinesheetsHrefForDemo,
  brandShowroomHrefForDemo,
  factoryHandoffQueueHrefForDemo,
  factoryMaterialsHrefForDemo,
  factoryMaterialsProcurementHrefForDemo,
  platformCoreRolePillarHref,
  shopShowroomHrefForDemo,
} from '@/lib/platform-core-hub-matrix';
import {
  ROUTES,
  brandB2bOrderChainContextHref,
  brandB2bOrderDossierContextHref,
  brandB2bOrderHandoffContextHref,
  brandB2bOrderHref,
  brandB2bOrdersAwaitingHandoffRegistryHref,
  brandB2bOrdersProductionRegistryHref,
  brandCoreOrderProductionCabinetHref,
  brandCalendarB2bOrderContextHref,
  brandMessagesB2bOrderContextHref,
  brandMessagesWorkshop2ArticleContextHref,
  brandW2ProductionTzHref,
  factoryMessagesB2bOrderContextHref,
  factoryMessagesWorkshop2ArticleContextHref,
  factoryCoreOrderProductionCabinetHref,
  factorySupplierCoreOrderProductionCabinetHref,
  factoryProductionDossierContextHref,
  factoryProductionDossierHref,
  factoryProductionOrdersOrderContextHref,
  factorySupplierMessagesB2bOrderContextHref,
  factorySupplierMessagesWorkshop2ArticleContextHref,
  shopB2bOrderHref,
  shopB2bOrderProductionContextHref,
  shopB2bOrdersProductionRegistryHref,
  shopB2bTrackingOrderHref,
  shopCalendarB2bOrderContextHref,
  shopMessagesB2bOrderContextHref,
} from '@/lib/routes';
import { WORKSHOP2_COL_PARAM, workshop2ArticleHref } from '@/lib/production/workshop2-url';
import type { SectionAuditTemplate } from './types';

export const EMPTY_SECTION_AUDIT: Partial<
  Record<CoreChainRoleId, Partial<Record<CoreHubPillarId, readonly SectionAuditTemplate[]>>>
> = {
  shop: {
    development: [
      {
        id: 'shop-empty-dev-status',
        label: 'Прогресс разработки · read-only',
        order: 1,
        staticScore: 7.3,
        liveScore: 8.0,
        summary: 'ShopDevelopmentBridge: шаги development-status + published badge + greenfield CRM.',
        good: [
          'usePillarSnapshot development BFF',
          'shop-development-bridge + core-31 e2e',
          'Nav peer pillar «контекст»',
          'Greenfield buyer CRM strip PG segment (`shop-development-bridge-greenfield-crm-strip`)',
        ],
        bad: ['Read-only — нет редактирования ТЗ'],
        fix: [],
        resolveHref: (d) =>
          `${ROUTES.shop.coreCabinet}?pillar=development&collection=${encodeURIComponent(d.collectionId)}`,
      },
      {
        id: 'shop-empty-dev-brand-w2',
        label: 'Техпак бренда',
        order: 2,
        staticScore: 7.2,
        liveScore: 8.0,
        summary: 'Peer CTA → W2 hub + inline dossier preview dialog.',
        good: [
          'shop-development-bridge-brand-w2',
          'Prefetch W2 на hover',
          'Inline preview dialog (`shop-development-bridge-dossier-preview-dialog`)',
          'Preview steps + W2/checkout CTA в footer',
        ],
        bad: [],
        fix: [],
        resolveHref: (d) =>
          `${ROUTES.brand.productionWorkshop2}?${WORKSHOP2_COL_PARAM}=${encodeURIComponent(d.collectionId)}`,
      },
      {
        id: 'shop-empty-dev-showroom',
        label: 'Витрина · коллекция',
        order: 3,
        staticScore: 7.3,
        liveScore: 8.0,
        summary: 'Showroom + matrix/checkout CTA когда readyForBuyers.',
        good: [
          'shop-development-bridge-showroom',
          'readyForBuyers badge',
          'Matrix + checkout peers при publish (`shop-development-bridge-matrix`, `shop-development-bridge-checkout`)',
          'Greenfield CRM checkout link (`shop-dev-bridge-crm-checkout-link`)',
        ],
        bad: ['Зависит от publish бренда'],
        fix: [],
        resolveHref: (d) => shopShowroomHrefForDemo(d),
      },
      {
        id: 'shop-empty-dev-cross',
        label: 'Cross-role · peer роли',
        order: 4,
        staticScore: 7.3,
        liveScore: 8.0,
        summary: 'RolePillarCrossRoleLinks + greenfield CRM monetization spine.',
        good: [
          'embedCrossRole в PlatformCoreEmptyCellPanels',
          'getCrossRolePeerDemoHref merged PG orderId',
          'Greenfield CRM strip showroom/matrix/partners/checkout (`shop-development-bridge-greenfield-crm-strip`)',
        ],
        bad: [],
        fix: [],
        resolveHref: (d) =>
          `${ROUTES.shop.coreCabinet}?pillar=development&collection=${encodeURIComponent(d.collectionId)}`,
      },
    ],
  },
  manufacturer: {
    sample_collection: [
      {
        id: 'mfr-empty-sc-status',
        label: 'Статус коллекции · PG',
        order: 1,
        staticScore: 7.3,
        liveScore: 8.0,
        summary: 'ManufacturerSampleCollectionStatus: published/linesheet таблица + spine peers.',
        good: [
          'manufacturer-sample-collection-pg-table',
          'usePillarSnapshot sample_collection BFF',
          'Spine peer shop showroom/matrix + sample queue (`mfr-empty-sc-peer-strip`)',
        ],
        bad: [],
        fix: [],
        resolveHref: (d) =>
          `${ROUTES.factory.productionCoreCabinet}?pillar=sample_collection&collection=${encodeURIComponent(d.collectionId)}`,
      },
      {
        id: 'mfr-empty-sc-brand-linesheet',
        label: 'Linesheet бренда · peer',
        order: 2,
        staticScore: 7.2,
        liveScore: 8.0,
        summary: 'Peer CTA → linesheet бренда + shop monetization spine.',
        good: [
          'manufacturer-sample-collection-brand-linesheet',
          'mfr-empty-sc-brand-linesheet-link в spine strip',
        ],
        bad: [],
        fix: [],
        resolveHref: (d) => brandLinesheetsHrefForDemo(d),
      },
      {
        id: 'mfr-empty-sc-cross',
        label: 'Cross-role · peer роли',
        order: 3,
        staticScore: 7.2,
        liveScore: 8.0,
        summary: 'RolePillarCrossRoleLinks + shop/brand spine strip.',
        good: [
          'RolePillarCrossRoleLinks compact',
          'mfr-empty-sc-peer-strip shop showroom/matrix',
        ],
        bad: [],
        fix: [],
        resolveHref: (d) =>
          `${ROUTES.factory.productionCoreCabinet}?pillar=sample_collection&collection=${encodeURIComponent(d.collectionId)}`,
      },
    ],
    collection_order: [
      {
        id: 'mfr-empty-co-po',
        label: 'Ожидание PO · handoff',
        order: 1,
        staticScore: 7.3,
        liveScore: 8.0,
        summary: 'ManufacturerPoExpectation: handoff queue + procurement + CO spine peers.',
        good: [
          'manufacturer-po-expectation',
          'usePillarSnapshot collection_order BFF',
          'CO spine brand handoff/tracking/matrix (`mfr-empty-co-peer-strip`)',
        ],
        bad: [],
        fix: [],
        resolveHref: (d) =>
          `${ROUTES.factory.productionCoreCabinet}?pillar=collection_order&collection=${encodeURIComponent(d.collectionId)}`,
      },
      {
        id: 'mfr-empty-co-chain',
        label: 'Chain steps · read-only',
        order: 2,
        staticScore: 7.2,
        liveScore: 8.0,
        summary: 'Chain steps shop_sent/brand_confirmed + spine cross-links.',
        good: [
          'Poll/SSE refresh',
          'mfr-empty-co-handoff-queue-link + shop tracking в spine strip',
        ],
        bad: [],
        fix: [],
        resolveHref: (d) => factoryHandoffQueueHrefForDemo(d),
      },
      {
        id: 'mfr-empty-co-cross',
        label: 'Cross-role · peer роли',
        order: 3,
        staticScore: 7.2,
        liveScore: 8.0,
        summary: 'Peer CTA brand/shop collection_order + spine strip.',
        good: [
          'RolePillarCrossRoleLinks compact',
          'mfr-empty-co-peer-strip brand/shop handoff',
        ],
        bad: [],
        fix: [],
        resolveHref: (d) =>
          `${ROUTES.factory.productionCoreCabinet}?pillar=collection_order&collection=${encodeURIComponent(d.collectionId)}`,
      },
    ],
  },
  supplier: {
    sample_collection: [
      {
        id: 'sup-empty-sc-bom',
        label: 'BOM образца · peer',
        order: 1,
        staticScore: 7.3,
        liveScore: 8.0,
        summary: 'SupplierBomPreview: nav peer + dev cabinet spine strip.',
        good: [
          'supplier-bom-preview-mini',
          'usePillarSnapshot BOM',
          'Brand BOM peer (`sup-dev-bom-brand-peer-link`)',
          'Dev cabinet spine BOM/RFQ/CRM (`sup-dev-cabinet-spine-peer-strip`)',
        ],
        bad: [],
        fix: [],
        resolveHref: (d) =>
          `${ROUTES.factory.supplierCoreCabinet}?pillar=sample_collection&collection=${encodeURIComponent(d.collectionId)}`,
      },
      {
        id: 'sup-empty-sc-cross',
        label: 'Cross-role · peer роли',
        order: 2,
        staticScore: 7.2,
        liveScore: 8.0,
        summary: 'Nav peer pillar sample_collection + dev spine strip.',
        good: [
          'RolePillarCrossRoleLinks compact',
          'sup-dev-cabinet-spine-peer-strip на empty panel',
        ],
        bad: [],
        fix: [],
        resolveHref: (d) =>
          `${ROUTES.factory.supplierCoreCabinet}?pillar=sample_collection&collection=${encodeURIComponent(d.collectionId)}`,
      },
    ],
    collection_order: [
      {
        id: 'sup-empty-co-forecast',
        label: 'Прогноз закупок · peer',
        order: 1,
        staticScore: 7.3,
        liveScore: 8.0,
        summary: 'SupplierCollectionOrderForecast: BFF + mfr handoff peer + CO spine.',
        good: [
          'supplier-collection-order-forecast',
          'usePillarSnapshot BFF',
          'Replenishment ATP back-link (`supplier-forecast-replenishment-atp-link`)',
          'Manufacturer handoff SSE peer (`supplier-manufacturer-handoff-peer-strip`)',
          'CO spine mfr/procurement/forecast/tracking (`sup-empty-co-peer-strip`)',
        ],
        bad: [],
        fix: [],
        resolveHref: (d) =>
          `${ROUTES.factory.supplierCoreCabinet}?pillar=collection_order&collection=${encodeURIComponent(d.collectionId)}`,
      },
      {
        id: 'sup-empty-co-cross',
        label: 'Cross-role · peer роли',
        order: 2,
        staticScore: 7.2,
        liveScore: 8.0,
        summary: 'Handoff queue + manufacturer peer + CO spine context.',
        good: [
          'RolePillarCrossRoleLinks compact',
          'sup-empty-co-peer-strip + supplier-manufacturer-handoff-peer-strip',
        ],
        bad: [],
        fix: [],
        resolveHref: (d) =>
          `${ROUTES.factory.supplierCoreCabinet}?pillar=collection_order&collection=${encodeURIComponent(d.collectionId)}`,
      },
    ],
  },
};
