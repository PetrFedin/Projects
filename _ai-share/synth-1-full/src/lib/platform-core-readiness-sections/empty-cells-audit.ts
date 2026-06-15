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
        liveScore: 7.4,
        summary: 'ShopDevelopmentBridge: шаги development-status + published badge.',
        good: [
          'usePillarSnapshot development BFF',
          'shop-development-bridge + core-31 e2e',
          'Nav peer pillar «контекст»',
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
        liveScore: 7.3,
        summary: 'Peer CTA → W2 hub бренда по коллекции.',
        good: ['shop-development-bridge-brand-w2', 'Prefetch W2 на hover'],
        bad: ['Нет inline preview dossier'],
        fix: ['Modal preview dossier'],
        resolveHref: (d) =>
          `${ROUTES.brand.productionWorkshop2}?${WORKSHOP2_COL_PARAM}=${encodeURIComponent(d.collectionId)}`,
      },
      {
        id: 'shop-empty-dev-showroom',
        label: 'Витрина · коллекция',
        order: 3,
        staticScore: 7.3,
        liveScore: 7.4,
        summary: 'Следующий шаг golden path — showroom после готовности бренда.',
        good: ['shop-development-bridge-showroom', 'readyForBuyers badge'],
        bad: ['Зависит от publish бренда'],
        fix: [],
        resolveHref: (d) => shopShowroomHrefForDemo(d),
      },
      {
        id: 'shop-empty-dev-cross',
        label: 'Cross-role · peer роли',
        order: 4,
        staticScore: 7.3,
        liveScore: 7.4,
        summary: 'RolePillarCrossRoleLinks + expanded comms/co/op peers.',
        good: [
          'embedCrossRole в PlatformCoreEmptyCellPanels',
          'getCrossRolePeerDemoHref merged PG orderId',
        ],
        bad: ['Multi-buyer weak'],
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
        liveScore: 7.4,
        summary: 'ManufacturerSampleCollectionStatus: published/linesheet таблица.',
        good: [
          'manufacturer-sample-collection-pg-table',
          'usePillarSnapshot sample_collection BFF',
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
        liveScore: 7.3,
        summary: 'Peer CTA → linesheet бренда.',
        good: ['manufacturer-sample-collection-brand-linesheet'],
        bad: [],
        fix: [],
        resolveHref: (d) => brandLinesheetsHrefForDemo(d),
      },
      {
        id: 'mfr-empty-sc-cross',
        label: 'Cross-role · peer роли',
        order: 3,
        staticScore: 7.2,
        liveScore: 7.3,
        summary: 'RolePillarCrossRoleLinks compact в insight-панели.',
        good: ['RolePillarCrossRoleLinks compact'],
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
        liveScore: 7.4,
        summary: 'ManufacturerPoExpectation: handoff queue + procurement peer.',
        good: ['manufacturer-po-expectation', 'usePillarSnapshot collection_order BFF'],
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
        liveScore: 7.3,
        summary: 'Chain steps shop_sent/brand_confirmed в insight.',
        good: ['Poll/SSE refresh'],
        bad: [],
        fix: [],
        resolveHref: (d) => factoryHandoffQueueHrefForDemo(d),
      },
      {
        id: 'mfr-empty-co-cross',
        label: 'Cross-role · peer роли',
        order: 3,
        staticScore: 7.2,
        liveScore: 7.3,
        summary: 'Peer CTA brand/shop collection_order.',
        good: ['RolePillarCrossRoleLinks compact'],
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
        liveScore: 7.4,
        summary: 'SupplierBomPreview: nav peer + development BFF.',
        good: ['supplier-bom-preview-mini', 'usePillarSnapshot BOM'],
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
        liveScore: 7.3,
        summary: 'Nav peer pillar sample_collection + empty panel.',
        good: ['RolePillarCrossRoleLinks compact'],
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
        liveScore: 7.4,
        summary: 'SupplierCollectionOrderForecast: collection_order BFF.',
        good: ['supplier-collection-order-forecast', 'usePillarSnapshot BFF'],
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
        liveScore: 7.3,
        summary: 'Handoff queue + manufacturer peer context.',
        good: ['RolePillarCrossRoleLinks compact'],
        bad: [],
        fix: [],
        resolveHref: (d) =>
          `${ROUTES.factory.supplierCoreCabinet}?pillar=collection_order&collection=${encodeURIComponent(d.collectionId)}`,
      },
    ],
  },
};
