# PATH-AUDIT — Vertical (Agent A)

**Date:** 2026-06-09 · **Scope:** 15 active cells · SS27 golden  
**SoT:** `PLATFORM-CORE-PATH-PLAN.md`, `platform-core-readiness-audit.ts`

## Honest scores (/10 avg)

| Role | Avg | Weakest |
|------|-----|---------|
| Brand | 6.9 | development, order_production (~6.5) |
| Shop | 7.2 | order_production (7.0) |
| Manufacturer | 7.3 | order_production (7.2→7.4 after ERP ack) |
| Supplier | 7.1 | order_production (7.0) |
| **Chain** | **~7.1** | brand vertical depth |

## P0

- Shop reserve post-handoff (Wave D copy honest) — `platform-core-readiness-audit.ts` shop order_production
- Legacy `/brand/suppliers` mock — `src/app/brand/suppliers/page.tsx`

## P1 (updated after wave 4)

| Area | Status | Paths |
|------|--------|-------|
| Factory ERP on ack | **Done** — `postWorkshop2PurchaseOrderToErpOnCreate` in bulk ack | `workshop2-b2b-production-handoff.ts`, `FactoryWorkshop2ProductionHandoffPanel.tsx` |
| Supplier bulk BOM confirm | **Done** — `bulk-confirm` API | `workshop2-supplier-material-request-confirm.ts` |
| Shop calendar supplier events | **Done** — `b2b-materials-*` | `platform-core-calendar-bridge.ts` |
| ERP retry UI | **Done** — `retry-erp` | `FactoryWorkshop2ProductionHandoffPanel.tsx` |
| Sample queue priority | Open | `PlatformCoreDossierSampleQueueCard.tsx` |

## P2

| Area | Status | Paths |
|------|--------|-------|
| Price history time series | Partial — unitCostNet snapshot only | `platform-core-supplier-materials-reference.ts`, `materials-core.tsx` |
| Alt materials | **Done** — substitutes from BOM | same |
| SSE multi-instance | Open | `platform-core-chain-status-hub.ts` |

## Next code (ordered)

1. Supplier bulk confirm (batch PATCH)
2. Shop calendar `materials_supplied` events
3. Brand registry thread preview for all orders
4. ERP retry UI on handoff row error
5. Manufacturer dev peer → brand W2

**Verdict:** SS27 walkable e2e; ceiling ~7.1–7.3 until bulk supplier confirm + full calendar chain. 9+ blocked per PATH-PLAN §11.
