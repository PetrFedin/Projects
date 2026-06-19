# Platform Core — архив legacy page-split

Файлы из `PLATFORM_CORE_LEGACY_PAGE_SPLITS` (`src/lib/platform-core-legacy-manifest.ts`) остаются в `src/app/**` до поэтапного переноса сюда.

## Правило переноса

1. Переместить `*-legacy.tsx` в зеркальный путь под `src/_archive/platform-core-legacy/app/…`
2. В `page.tsx` оставить dynamic import на архивный путь
3. Core-path (`isPlatformCoreMode()`) не трогать — только `*-core.tsx`
4. Прогон: `npm test -- --testPathPattern=platform-core` + `npm run test:e2e:core`

## Статус

- Инвентарь: **51** page-split (манифест в репо)
- Физический перенос: **51/51** (все page-split в `_archive/platform-core-legacy/app/…`)
- Не смонтированные hub-компоненты: **6** в `components/platform/` (Scorecard, DemoTrail, HubDemoContext, PillarRoleMap, InvestorWalkthrough, SupplierRfqReadonlyPanel)
