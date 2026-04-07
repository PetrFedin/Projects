/**
 * Собранные URL для вторичных кнопок на карточках хаба коллекции (`CollectionWorkshopStageChain`).
 * Собираются в `app/brand/production/page.tsx` с учётом `collectionId`.
 */
export type CollectionChainDeepLinkHrefs = {
  productionGantt: string;
  productionOperations: string;
  productionNesting: string;
  productionQcApp: string;
  productionReadyMade: string;
  productionGoldSample: string;
  productionFitComments: string;
  logistics: string;
  b2bOrders: string;
  vmi: string;
  b2bLinesheetsCreate: string;
  liveLogistics: string;
  collections: string;
  collectionsNew: string;
  pricing: string;
  suppliers: string;
  suppliersRfq: string;
  materialsReservation: string;
  contentHub: string;
  integrationsErpPlm: string;
  messages: string;
  calendar: string;
  tasks: string;
  teamTasks: string;
  compliance: string;
  circularHub: string;
  warehouse: string;
};
