# Syntha — Карта интеграций и связей

> Вертикальные (data → UI) и горизонтальные (модуль ↔ модуль) связи для максимальной продуктивности.

---

## 1. Источники правды

| Сущность | Файл | Описание |
|----------|------|----------|
| **Routes** | `src/lib/routes.ts` | Все href — использовать ROUTES.*, не строки |
| **Types** | `src/lib/types.ts` | Brand, Order, Product, B2BOrder, TeamMember |
| **B2B Features** | `src/lib/b2b-features/` | ShipWindow, PriceList, RFQ, Credit, ExclusionZone |
| **Design Tokens** | `src/design/tokens.json` | Цвета, шрифты, отступы |
| **Style Guide** | `STYLE_GUIDE.md` | Tailwind-классы, компоненты |
| **Profile Schema** | `BRAND_PROFILE_SCHEMA.md` | Структура профиля бренда |
| **Brand Profile** | `src/app/brand/page.tsx` | Профиль: brand, contacts, brandInfo, legalData, brandContacts |

---

## 2. Вертикальные связи (Data → UI)

```
tokens.json ─────┬──► tailwind.config.ts ──► className в компонентах
                 └──► globals.css (--color-*)

types.ts ────────┬──► Компоненты (props)
                 └──► b2b-features/types.ts (расширение B2B)

routes.ts ───────┬──► Link href={ROUTES.brand.xyz}
                 ├──► entity-links.ts
                 └──► brand-navigation.ts

b2b-features/ ───┬──► B2BOrder.orderMode, priceTier
                 ├──► Price lists UI, RFQ UI
                 └──► Ship window selectors

BRAND_PROFILE_SCHEMA ─► brand/page.tsx (структура, порядок, источники данных)
```

---

## 3. Горизонтальные связи (модуль ↔ модуль)

| Откуда | Куда | Связь |
|--------|------|-------|
| `entity-links.ts` | `routes.ts` | href из ROUTES |
| `brand-navigation.ts` | `routes.ts` | href из ROUTES |
| `brand-navigation.ts` | `entity-links.ts` | Переиспользование EntityLink[] |
| `shop-navigation-normalized.ts` | `routes.ts` | ROUTES.shop.* |
| `b2b-features` | `types.ts` | B2BOrder.orderMode → ShipWindowType |
| `b2b-features` | `brand/page.tsx` | Контакты, showroom |
| `design-system` | `AGENTS.md`, Cursor rules | STYLE_GUIDE, MASTER |

---

## 4. B2B Feature → Routes

| Фича | Route | Файл |
|------|-------|------|
| Ship windows | preOrders, b2bOrders | brand/pre-orders, brand/b2b-orders |
| Price lists | priceLists | brand/b2b/price-lists |
| RFQ | suppliersRfq, b2bRfq | brand/suppliers/rfq, shop/b2b/tenders |
| Credit / Net terms | financeRf | brand/finance/rf-terms |
| Linesheets | b2bLinesheets | brand/b2b/linesheets |
| Showroom | showroom | brand/showroom |
| Trade shows | tradeShows | brand/b2b/trade-shows |

---

## 5. Провайдеры (верхний уровень)

```
layout.tsx
  ├── B2BStateProvider
  ├── BrandCenterProvider
  ├── AuthProvider
  ├── QueryProvider
  ├── UIStateProvider
  └── NotificationsProvider
```

---

## 6. Добавление новой фичи

1. Добавить тип в `b2b-features/types.ts` или `lib/types.ts`
2. Добавить route в `routes.ts`
3. Добавить ссылку в `entity-links.ts` или `brand-navigation.ts`
4. Обновить `docs/archive/FEATURE_BENCHMARK.md` при необходимости
5. Добавить flag в `b2b-features/feature-config.ts` если нужен toggle
