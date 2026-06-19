# Phase: Platform Core Audit Remediation

**Goal:** Закрыть P0 честности demo и межролевых пробелов из [PLATFORM-CORE-AUDIT.md](../../PLATFORM-CORE-AUDIT.md) без раздувания legacy UI.

**Baseline (2026-06-12):** golden path SS27/FW27 на PG ✓ · `core:verify:no-bootstrap` 4/4 ✓ · `audit:platform-core-ui` 37/37 ✓ · nav unify 12/12 ✓

## P0 — честность demo (in progress)

| ID | Задача | Статус | Evidence |
|----|--------|--------|----------|
| P0-1 | Cart persist matrix→checkout (`b2b_cart_session` hydrate + debounced upsert) | **done** | `workshop2-cart-bridge.ts`, `CoreWholesaleMatrix.tsx` |
| P0-2 | Kanban: no `demo-stage-*` injection in core | **done** | `brand/tasks/page.tsx` |
| P0-3 | Placeholder registry: `/brand/merch/*`, merchandising | **done** | `platform-core-placeholder-surfaces.ts` |
| P0-4 | Checkout reserve copy (после handoff, не на checkout) | verify | `SHOP_B2B_CHECKOUT_INVENTORY_HOLD_RU` |
| P0-5 | Nav: archive stripped, «Цепочка · 5 столпов» | **done** | `filterNavGroupsForCoreSidebar`, nav unify |
| P0-6 | EMPTY27: onboarding only, no «full chain» CTA | audit | EMPTY27 panels |

## P1 — связи и доверие к кнопкам

| ID | Задача | §5.7 |
|----|--------|------|
| P1-1 | Dual-session comms E2E | чаты |
| P1-2 | Shop UI mirrors PATCH operational order status | B2B status |
| P1-3 | Push/SSE sample status, handoff queue | PO/handoff |
| P1-4 | Notification center min (shop/sup) or hub aggregate | — |
| P1-5 | RFQ-free: remove dead RFQ UI or RFQ create→brand | RFQ |

## P2 — без блокировки demo

Inline qty vitrine · Gantt factory · PDF empty collection · multi-buyer registry · WMS live push · calendar PG in dev.

## P3 — engineering

Wave **73+** dossier tail chrome decomposition · `typecheck:platform-core` green.

## Verify checklist

```bash
npm run core:verify          # full (:3001 + PG bootstrap)
npm run core:verify:no-bootstrap
npm run audit:platform-core-ui
npm test -- --testPathPattern='platform-core-nav-unify|platform-core-placeholder|workshop2-cart-bridge'
```

## Cross-role gaps (unchanged)

Dual-session chat · PO PATCH 2-actor UI · RFQ create→brand · shop status UI mirror · calendar cross-role · logistics tracking number.
