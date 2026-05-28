/**
 * API-слой по контрактам из src/lib. Фичи вызывают функции отсюда; при отсутствии бэкенда используются моки.
 */

export { get, post, api } from './client';
export { getFactTables, getBuyingSummary } from './analytics-phase2';
export { listCampaigns } from './style-me-upsell';
export { listRules } from './territory-protection';
export {
  listCampaigns as listPreOrderQuotaCampaigns,
  getCampaign as getPreOrderQuotaCampaign,
} from './pre-order-quota';
export { listRecords as listCommissionRecords, listAgents } from './sub-agent-commission';
export { listRfq, getRfq } from './supplier-rfq';
export { listSnapshots as listBudgetActualSnapshots } from './budget-actual';
export { listItems as listWardrobeItems, listLooks as listWardrobeLooks } from './digital-wardrobe';
export { listOrders as listTbybOrders } from './try-before-you-buy-b2c';
export { listTransactions as listBnplTransactions } from './bnpl-gateway';
export { listAssignments as listShipFromStoreAssignments } from './ship-from-store';
export { listRequests as listEndlessAisleRequests } from './endless-aisle-pos';
export { listSessions as listCycleCountSessions } from './cycle-counting';
export { listFeeds as listLiaFeeds } from './local-inventory-ads';
export { listLooks as listStylistLooks } from './endless-stylist';
export { listTradeShows, getTradeShow } from './trade-show';
export {
  listBuyerApplications,
  getBuyerApplication,
  submitBuyerApplication,
  approveBuyerApplication,
  rejectBuyerApplication,
} from './buyer-onboarding';
