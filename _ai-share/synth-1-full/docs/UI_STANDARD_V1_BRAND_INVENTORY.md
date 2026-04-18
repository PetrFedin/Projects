# Brand center — инвентаризация UI Standard v1 (авто-сводка)

Сгенерировано для репо `_ai-share/synth-1-full`: только `src/app/brand/**/page.tsx`.

## Метрики (как пересчитать)

Из корня `synth-1-full`:

```bash
# всего страниц
find src/app/brand -name 'page.tsx' | wc -l

# с RegistryPageShell или RegistryPageHeader
find src/app/brand -name 'page.tsx' -exec grep -lE 'RegistryPageShell|RegistryPageHeader' {} \; | wc -l

# с «запрещёнными» корневыми паттернами (в т.ч. внутри вложенного layout)
find src/app/brand -name 'page.tsx' -exec grep -lE 'max-w-7xl|max-w-6xl|container mx-auto|pb-20' {} \; | wc -l

# без Registry (бэклог миграции)
find src/app/brand -name 'page.tsx' | sort | while read -r f; do
  grep -qE 'RegistryPageShell|RegistryPageHeader' "$f" || echo "$f"
done > docs/brand-page-inventory-no-registry.txt
```

Базовый прогон: **256** страниц. После волн 1–9 + Wave 10–**18** (2026-04): **145** с `RegistryPageShell`/`RegistryPageHeader`, **111** без (актуальный список — `brand-page-inventory-no-registry.txt`, перегенерируйте командой выше). По грубому grep запрещённых корневых/вложенных классов (`max-w-7xl|max-w-6xl|container mx-auto|pb-20`) после W18 остаётся **83** файла — пересчёт см. команду в разделе «Метрики».

## «Внутренний» долг: shell есть, legacy-классы остались

Первичный проход по семи хабам (analytics, analytics-bi, calendar, control-center, logistics, production/operations, team) закрыт: корневые `max-w-*` / `container mx-auto` / лишний `pb-20` убраны. Дальше — точечный grep по вложенным блокам и Suspense-fallback в остальных страницах.

## Статус волн из `UI_STANDARD_V1_ROLLOUT.md`

| Волна | Файл | Registry shell/header |
|-------|------|-------------------------|
| W1 | `team/page.tsx` | да |
| W1 | `integrations/page.tsx` | **да** (миграция 2026-04) |
| W1 | `documents/page.tsx` | **да** |
| W1 | `products/page.tsx` | да |
| W1 | `logistics/page.tsx` | да |
| W2 | `profile/page.tsx` | да |
| W2 | `settings/page.tsx` | да |
| W2 | `control-center/page.tsx` | да |
| W2 | `b2b-orders/page.tsx` | **да** |
| W2 | `retailers/page.tsx` | **да** |
| W2 | `suppliers/page.tsx` | **да** |
| W2 | `marketing/campaigns/page.tsx` | **да** |
| W2 | `media/page.tsx` | **да** |
| W3 | `analytics-360/page.tsx` | да |
| W3 | `analytics-bi/page.tsx` | да |
| W3 | `finance/page.tsx` | да |
| W3 | `pricing/page.tsx` | **да** |
| W3 | `esg/page.tsx` | **да** |
| W4 | `ai-tools/page.tsx` | **да** |
| W4 | `academy/page.tsx` | **да** |
| W4 | `hr-hub/page.tsx` | **да** |
| W5 | `dashboard/page.tsx` | **да** |
| W5 | `collections/page.tsx` | **да** |
| W5 | `production/page.tsx` | **да** (корневая оболочка) |
| W5 | `warehouse/page.tsx` | **да** |
| W5 | `inventory/page.tsx` | **да** |
| W6 | `analytics/budget-actual/page.tsx` | **да** |
| W6 | `analytics/external-sales/page.tsx` | **да** |
| W6 | `analytics/geo-demand/page.tsx` | **да** |
| W6 | `analytics/phase2/page.tsx` | **да** |
| W6 | `analytics/platform-sales/page.tsx` | **да** |
| W6 | `analytics/sell-through/page.tsx` | **да** |
| W6 | `analytics/unified/page.tsx` | **да** |
| W7 | `academy/clients/page.tsx` | **да** |
| W7 | `academy/knowledge/page.tsx` | **да** |
| W7 | `academy/platform/page.tsx` | **да** |
| W7 | `academy/stores/page.tsx` | **да** |
| W7 | `academy/team/page.tsx` | **да** |
| W7 | `ai-design/page.tsx` | **да** |
| W7 | `ai-design/body-scanner/page.tsx` | **да** (полный shell на отдельном URL; во вкладке `/brand/ai-design` — только контент) |
| W8 | `academy/clients/materials/page.tsx` | **да** |
| W8 | `academy/clients/materials/[id]/page.tsx` | **да** |
| W8 | `academy/collections/training/page.tsx` | **да** |
| W8 | `academy/collections/training/[id]/page.tsx` | **да** |
| W8 | `academy/courses/create/page.tsx` | **да** |
| W8 | `academy/courses/[id]/page.tsx` | **да** |
| W8 | `academy/knowledge/create/page.tsx` | **да** |
| W8 | `academy/knowledge/[id]/page.tsx` | **да** |
| W9 | `academy/platform/article/[id]/page.tsx` | **да** |
| W9 | `academy/platform/course/[id]/page.tsx` | **да** |
| W9 | `academy/platform/path/[id]/page.tsx` | **да** |
| W9 | `auctions/page.tsx` | **да** |
| W9 | `auctions/new/page.tsx` | **да** |
| W10 | `b2b-orders/[orderId]/page.tsx` | **да** |
| W10 | `b2b-orders/approval-live/page.tsx` | **да** |
| W10 | `b2b/buyer-applications/page.tsx` | **да** |
| W10 | `b2b/catalog-quality/page.tsx` | **да** |
| W10 | `b2b/linesheets/page.tsx` | **да** |
| W11 | `b2b/content-syndication/page.tsx` | **да** |
| W11 | `b2b/engagement/page.tsx` | **да** |
| W11 | `b2b/linesheets/create/page.tsx` | **да** |
| W11 | `b2b/lookbook-projects/page.tsx` | **да** |
| W11 | `b2b/partner-map/page.tsx` | **да** |
| W11 | `b2b/price-lists/page.tsx` | **да** |
| W11 | `b2b/private-invites/page.tsx` | **да** |
| W11 | `b2b/trade-shows/page.tsx` | **да** |
| W12 | `blog/page.tsx` | **да** |
| W12 | `bopis/page.tsx` | **да** |
| W12 | `brands/page.tsx` | **да** |
| W12 | `collaborations/page.tsx` | **да** |
| W13 | `circular-hub/page.tsx` | **да** |
| W13 | `cms/page.tsx` | **да** (shell на экране редиректа; `/brand/cms` → Content Factory) |
| W13 | `colors/page.tsx` | **да** |
| W13 | `content-hub/page.tsx` | **да** |
| W13 | `collections/new/page.tsx` | **да** |
| W13 | `collections/[id]/page.tsx` | **да** |
| W13 | `marketing/content-factory/page.tsx` | **да** (общий модуль CMS / маркетинг) |
| W14 | `compliance/page.tsx` | **да** |
| W14 | `compliance/stock/page.tsx` | **да** |
| W14 | `customer-activity/page.tsx` | **да** |
| W14 | `customer-intelligence/page.tsx` | **да** |
| W14 | `customers/page.tsx` | **да** |
| W14 | `customization/page.tsx` | **да** |
| W14 | `disputes/page.tsx` | **да** |
| W15 | `distributor/commissions/page.tsx` | **да** |
| W15 | `distributor/pre-order-quota/page.tsx` | **да** |
| W15 | `distributor/territory/page.tsx` | **да** |
| W15 | `events/page.tsx` | **да** |
| W15 | `factories/page.tsx` | **да** |
| W15 | `factories/[id]/page.tsx` | **да** |
| W15 | `factory-portal/page.tsx` | **да** |
| W16 | `finance/demand-auctions/page.tsx` | **да** |
| W16 | `finance/embedded-payment/page.tsx` | **да** |
| W16 | `finance/escrow-live/page.tsx` | **да** |
| W16 | `finance/landed-cost/page.tsx` | **да** |
| W16 | `finance/rf-terms/page.tsx` | **да** |
| W16 | `gift-registry/page.tsx` | **да** |
| W16 | `growth-hub/page.tsx` | **да** |
| W16 | `hr-hub/vacancies/page.tsx` | **да** |
| W17 | `integrations/archive/joor/page.tsx` | **да** |
| W17 | `integrations/archive/colect/page.tsx` | **да** |
| W17 | `integrations/archive/fashion-cloud/page.tsx` | **да** |
| W17 | `integrations/archive/nuorder/page.tsx` | **да** |
| W17 | `integrations/archive/sparklayer/page.tsx` | **да** |
| W17 | `integrations/archive/zedonk/page.tsx` | **да** |
| W17 | `integrations/erp-plm/page.tsx` | **да** |
| W17 | `integrations/marketplace-card-health/page.tsx` | **да** |
| W17 | `inventory/archive/page.tsx` | **да** |
| W17 | `inventory/multi-location/page.tsx` | **да** |
| W17 | `ip-ledger/page.tsx` | **да** |
| W18 | `kickstarter/page.tsx` | **да** |
| W18 | `kickstarter/new/page.tsx` | **да** |
| W18 | `kickstarter/[campaignId]/page.tsx` | **да** |
| W18 | `kickstarter/[campaignId]/edit/page.tsx` | **да** |
| W18 | `kickstarter/[campaignId]/analytics/page.tsx` | **да** |
| W18 | `linesheets/page.tsx` | **да** |
| W18 | `live/page.tsx` | **да** |
| W18 | `logistics/consolidation/page.tsx` | **да** |
| W18 | `logistics/duty-calculator/page.tsx` | **да** |
| W18 | `logistics/live/page.tsx` | **да** |
| W18 | `logistics/shadow-inventory/page.tsx` | **да** |

## Полный список без Registry

См. **`docs/brand-page-inventory-no-registry.txt`** (111 строк, пути относительно репо). Если файла нет в рабочей копии — сгенерируйте командой выше.

## План выправления (эпик)

1. **W1 → W18** по таблице выше: закрыть оставшиеся **TODO** в волнах первыми PR.
2. **Параллельно** пройти оставшиеся страницы с «shell + legacy» во вложенных блоках — убрать `max-w-*` / `pb-20` там, где это не осознанный layout виджета.
3. **Остальной бэклог** — порциями по директориям (`merch/`, `academy/`, `production/`, …) из `brand-page-inventory-no-registry.txt`.
4. **Опционально (отдельный PR):** общий layout-обёртчик для типовых brand-route + ESLint `no-restricted-syntax` на корневые классы в `page.tsx` под `src/app/brand`.

## Definition of Done (на файл)

Как в `UI_STANDARD_V1_ROLLOUT.md`: корень на `RegistryPageShell`, заголовок на `RegistryPageHeader`, нет legacy-корня, чеклист + smoke по критичным табам.
