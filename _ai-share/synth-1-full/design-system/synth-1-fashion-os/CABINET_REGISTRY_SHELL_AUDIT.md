# Аудит: `RegistryPageShell` в кабинетах

**Цель:** страницы внутри ролевых кабинетов дают единый ритм шапки и контентной колонки (см. `CABINET_PROFILE_PR_CHECKLIST_RU.md`, `UI_STANDARD_V1.md`).

**Проверка:** в `page.tsx` есть импорт и использование `RegistryPageShell` из `@/components/design-system` (или явно согласованный эквивалент в PR).

---

## Shop (`src/app/shop/**/page.tsx`)

**Статус (2026-04):** все **109** файлов `src/app/shop/**/page.tsx` содержат `RegistryPageShell` — проверка:

```bash
find src/app/shop -name 'page.tsx' | while read -r f; do
  grep -q 'RegistryPageShell' "$f" || echo "$f"
done
```

Ожидаемый вывод: пусто.

**Особые случаи (классы на оболочке):** полноэкранные или кастомные корни (`workspace-map`, `stock-map`, `whiteboard`, `fitting-room/[id]`, `partners/discover`, `b2b/matrix`) используют `max-w-none`, при необходимости `!p-0` / `!mx-0`, чтобы не конфликтовать с базовым `registryFeedLayout.pageShell`.

---

## Brand (`src/app/brand/**/page.tsx`)

- **`/brand` (`src/app/brand/page.tsx`):** контент обёрнут в `RegistryPageShell` (`max-w-7xl space-y-6`); дублирующий внутренний `Breadcrumb` убран — крошки и заголовок секции в **`CabinetHubSectionBar`** внутри `src/app/brand/layout.tsx` (как у ритейл-кабинета в `shop/layout.tsx`).
- Остальные экраны бренда: большинство разделов уже на `RegistryPageShell`; полный инвентарь при необходимости — та же команда `find` с корнем `src/app/brand`.

---

## Хром кабинета (layout)

Для выравнивания с эталоном «ритейл-центр» / утверждённым hub-chrome:

- **`CabinetHubMain`** — колонка контента.
- **`CabinetHubTitleRow`** — строка узла (иконка, название хаба, поиск и т.д.).
- **`CabinetHubSectionBar`** — акцент-рейка + крошки + **H2 секции** + опциональный `trailing` (алерты, кнопки).

Бренд-центр: `src/app/brand/layout.tsx` переведён на **`CabinetHubSectionBar`** вместо отдельных `CabinetBreadcrumbs` + полосы алертов.

---

## П.3 — вкладки (`cabinetSurface`)

Для `TabsList` / `TabsTrigger` использовать `cabinetSurface.tabsList` и `cabinetSurface.tabsTrigger` (см. `src/lib/ui/cabinet-surface.ts`).

**Примеры в проекте:** `shop/b2b/partners/page.tsx`, `shop/b2b/partners/[brandId]/page.tsx`, `shop/b2b/selection-builder/page.tsx`, профиль бренда `src/app/brand/page.tsx` (вкладки профиля / B2B).

---

## Команды для других кабинетов

Аналогично для `src/app/admin`, `src/app/factory`, `src/app/distributor`, `src/app/client`, `src/app/u` — по подпапкам или порциями:

```bash
find src/app/<cabinet> -name 'page.tsx' | while read -r f; do
  grep -q 'RegistryPageShell' "$f" || echo "$f"
done
```
