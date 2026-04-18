# UI Standard v1.0 Rollout (File-by-File)

## Rollout Order

## Wave 1 (P0 operational hubs)

- `src/app/brand/team/page.tsx`
- `src/app/brand/integrations/page.tsx`
- `src/app/brand/documents/page.tsx`
- `src/app/brand/products/page.tsx`
- `src/app/brand/logistics/page.tsx`

Goal: fix highest-traffic work surfaces first.

## Wave 2 (P1 core management surfaces)

- `src/app/brand/profile/page.tsx`
- `src/app/brand/settings/page.tsx` (consistency polish)
- `src/app/brand/control-center/page.tsx` (density/CTA polish)
- `src/app/brand/b2b-orders/page.tsx`
- `src/app/brand/retailers/page.tsx`
- `src/app/brand/suppliers/page.tsx`
- `src/app/brand/marketing/campaigns/page.tsx`
- `src/app/brand/media/page.tsx`

## Wave 3 (P2 analytics/finance/profitability)

- `src/app/brand/analytics-360/page.tsx`
- `src/app/brand/analytics-bi/page.tsx`
- `src/app/brand/finance/page.tsx`
- `src/app/brand/pricing/page.tsx`
- `src/app/brand/esg/page.tsx`

## Wave 4 (AI/academy/HR)

- `src/app/brand/ai-tools/page.tsx`
- `src/app/brand/academy/page.tsx`
- `src/app/brand/hr-hub/page.tsx`

---

## Shared cabinet UI tokens

Для вкладок, мета-бейджей и подсказок внутри кабинетов без дублирования классов используйте **`src/lib/ui/cabinet-surface.ts`** (`cabinetSurface.tabsList`, `tabsTrigger`, `tooltipContent`, `badgeMetaRow`, …). Подключено частично: профиль бренда, organization overview (ранее), ряд brand-хабов и дистрибьюторская аналитика — остальные страницы из волн ниже переносите по мере правок.

## Per-File Migration Checklist

1. Root wrapper
   - Replace legacy root layout with `RegistryPageShell` (or `OperationalPageChrome` for advanced pages).
2. Header 2.0
   - Implement `RegistryPageHeader` with one primary and one secondary action.
3. KPI strip
   - Keep only 3-4 business-impact KPIs.
4. Table toolbar/context
   - Ensure sticky context/filter row and explicit reset.
5. Action hierarchy
   - One dominant CTA; overflow for secondary row actions.
6. States
   - Normalize loading, empty, error, success.
7. Visual cleanup
   - Remove decorative noise and non-semantic icon clutter.
8. Validation
   - `npx tsc --noEmit`
   - lint on touched files
   - manual smoke for critical tab flows

---

## Wave 17 (integrations archive + inventory + IP)

- `src/app/brand/integrations/archive/joor/page.tsx`
- `src/app/brand/integrations/archive/colect/page.tsx`
- `src/app/brand/integrations/archive/fashion-cloud/page.tsx`
- `src/app/brand/integrations/archive/nuorder/page.tsx`
- `src/app/brand/integrations/archive/sparklayer/page.tsx`
- `src/app/brand/integrations/archive/zedonk/page.tsx`
- `src/app/brand/integrations/erp-plm/page.tsx`
- `src/app/brand/integrations/marketplace-card-health/page.tsx`
- `src/app/brand/inventory/archive/page.tsx`
- `src/app/brand/inventory/multi-location/page.tsx`
- `src/app/brand/ip-ledger/page.tsx`

---

## Wave 18 (Kickstarter hub + linesheets + live + logistics leaf)

- `src/app/brand/kickstarter/page.tsx`
- `src/app/brand/kickstarter/new/page.tsx`
- `src/app/brand/kickstarter/[campaignId]/page.tsx`
- `src/app/brand/kickstarter/[campaignId]/edit/page.tsx`
- `src/app/brand/kickstarter/[campaignId]/analytics/page.tsx`
- `src/app/brand/linesheets/page.tsx`
- `src/app/brand/live/page.tsx`
- `src/app/brand/logistics/consolidation/page.tsx`
- `src/app/brand/logistics/duty-calculator/page.tsx`
- `src/app/brand/logistics/live/page.tsx`
- `src/app/brand/logistics/shadow-inventory/page.tsx`

---

## Definition of Done

File is done when:

- It passes the checklist in `docs/UI_STANDARD_V1.md`
- No legacy root layout remains
- Header/action hierarchy is clear at first glance
- The page is measurably easier to operate (fewer clicks for top tasks)

