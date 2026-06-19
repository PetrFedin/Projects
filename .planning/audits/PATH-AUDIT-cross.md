# PATH-AUDIT — Cross-role (Agent B)

**Date:** 2026-06-09 · **Scope:** peer links, order context, chain badges, inbox merge

## Peer links

| Layer | Path |
|-------|------|
| Resolver | `src/lib/platform-core-hub-matrix.ts` |
| UI | `RolePillarCrossRoleLinks.tsx`, `PlatformCoreListChrome.tsx`, `PlatformCoreOrderDetailChrome.tsx` |
| E2E | `core-01`, `core-02`, `core-06` |

**Gaps:** ~~manufacturer dev → brand W2 peer~~ ✓ `getCrossRolePeerDemoHrefForDemo`; dead-end guards only shop→brand / brand→mfr on order_production.

## Order context

| Layer | Path |
|-------|------|
| SoT | `workshop2-b2b-order-lifecycle.ts` |
| Chat | `useChatState.ts`, `brand-messages-pg-threads.ts` |
| Routes | `routes.ts` `*MessagesB2bOrderContextHref` |
| Banners | `PlatformCoreFactoryCommsContextBanner.tsx`, `CommunicationsEntityContextBanner.tsx` |

**Gaps:** ~~dossier header chat CTA~~ ✓ `factory-dossier-article-chat-link`; ~~banner dedupe e2e all roles~~ ✓ core-02.

## Chain badges

| Layer | Path |
|-------|------|
| Component | `B2bChainPhaseBadge.tsx` |
| Data | `use-workshop2-b2b-chain-summaries.ts`, SSE `chain-status-stream` |
| Surfaces | `b2b-orders-core.tsx`, `orders-core.tsx`, `FactoryWorkshop2ProductionHandoffPanel.tsx` |

**Gaps:** ~~shop tracking panel~~ ✓; ~~supplier procurement rows~~ ✓; ~~manufacturer production-orders list~~ ✓.

## Inbox merge

| Layer | Path |
|-------|------|
| Merge | `platform-core-b2b-inbox-merge.ts` |
| IDs | `use-platform-core-b2b-inbox-order-ids.ts` (brand, shop, manufacturer, **supplier**) |
| Wire | `useChatState.ts` |

**Gaps:** ~~supplier cabinet not merged~~ ✓; ~~banner dedupe e2e all 4 roles~~ ✓.

## Priority fixes

1. ~~Dossier/article chat entry~~ ✓
2. Infra P2: multi-instance SSE
3. PG price history journal
4. Handoff row → messages link (e2e assert)
5. Dossier/article chat entry
