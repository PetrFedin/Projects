# Pillar Capability Registry

**SoT в коде:** `src/lib/platform/pillar-capability-registry.ts`

Единый реестр возможностей из референсов **Onfinity, JOOR/NuOrder, Centric, Apparel Magic, Fast React, Aptos** и др., разложенных по **5 столпов × 4 роли**. Не создаёт параллельные экраны — каждая запись указывает **существующий маршрут для улучшения** (`improves`).

## Использование

| Задача | API |
|--------|-----|
| Cross-links на экране | `getPillarCapabilityCrossLinks(anchorId, ctx)` |
| Shop replenishment | `getShopReplenishmentWorkflowLinks(ctx)` |
| Brand W2 release | `getBrandDevelopmentReleaseLinks(ctx)` |
| UI strip | `PillarCapabilityCrossLinksStrip` |
| Platform audit | `shop-co-replenishment` и др. в `platform-core-readiness-sections/` |

## Принципы

1. **JOOR/NuOrder** — скелет `collection_order` (matrix, working order).
2. **Onfinity / ERP ops** — replenishment, ATP, inventory reconcile.
3. **PLM (Centric, Yunique)** — `development` + release gate.
4. **Phase 4** — `crm-segmentation` (planned).

## Связанные документы

- `INTEGRATION_MAP.md` → ADR-002
- `docs/B2B_AND_PRODUCTION_CORE_SPEC.md`

## Workspace (вкладки без новых маршрутов)

SoT: `src/lib/platform/pillar-capability-workspaces.ts`

| workspaceId | capability | live tab | stub/planned |
|-------------|------------|----------|--------------|
| `shop-replenishment` | co-replenishment-workspace | alerts | stock-atp, rules |
| `shop-wholesale-matrix` | co-wholesale-matrix | matrix | inspector, prepack |
| `brand-attribute-schema` | dev-attribute-schema | health | schemas, size-chart |
| `brand-release-gate` | sc-release-gate | checklist | syndication |
| `brand-production-ops` | op-cut-ticket-wip | operations | cut-ticket, qc-gate |
| `shop-inventory-ops` | op-inventory-atp | overview | reconcile |

UI: `PillarCapabilityWorkspaceChrome` · URL param `pcf` · hook `usePillarCapabilityWorkspace`.

Новая фича = строка в `features[]` + panel в `children` экрана — route не меняется.
