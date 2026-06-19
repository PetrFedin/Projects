/**
 * Честные подписи для integration ceilings (wave 30) — не выдавать mock за success.
 */

export const WORKSHOP2_LIVE_INTEGRATION_LABELS = {
  dpp: 'Требуется live EU DPP registry / certified LCA feed — сейчас только JSON-LD заготовка из досье.',
  sustainability:
    'Требуется live certified LCA / EU registry — сейчас расчёт из BOM досье без write-back.',
  fit3d: 'Требуется live Vault .glb / CAD ingest — placeholder.glb не считается production path.',
  nesting:
    'Требуется live WORKSHOP2_NESTING_API_URL / CAD nesting engine — симуляция stub не в счёт.',
  erp: 'Требуется live WORKSHOP2_FACTORY_ERP_BASE_URL + erpOrderId ACK — synced без external id блокируется.',
  showroom:
    'Требуется live showroom PG-кампания (Joor/Brandboom webhook) — ссылка только после publish.',
  plmTransport:
    'Требуется live external PLM ACK — outbox без WORKSHOP2_PLM_AUTO_ACK остаётся manual.',
  b2b: 'Требуется live B2B PG orders / showroom campaign — сейчас snapshot или journal.',
} as const;

export type Workshop2LiveIntegrationKind = keyof typeof WORKSHOP2_LIVE_INTEGRATION_LABELS;
