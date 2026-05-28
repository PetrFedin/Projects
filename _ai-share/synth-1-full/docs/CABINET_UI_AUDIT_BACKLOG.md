# Аудит оформления кабинетов — backlog

**Цель:** свести экраны под `/admin`, `/brand`, `/shop`, `/factory`, `/distributor`, `/client`, `/u` к одному паттерну (токены, оболочки, состояния).

**Чеклист для PR:** `design-system/synth-1-fashion-os/CABINET_PROFILE_PR_CHECKLIST_RU.md`  
**Spec:** `design-system/synth-1-fashion-os/FIGMA_SPEC_PACK_RU.md`

## Как вести таблицу

- Заполняйте по мере прохода разделов; статус: `ok` | `частично` | `нет` | `n/a`.
- «Оболочка»: `CabinetHub*` / `RegistryPageShell` / согласованный аналог + заголовок/крошки.
- «Токены»: нет сырых hex/rgb в странице; поверхности из семантических классов.

| Маршрут (пример) | Роль | Оболочка | Токены | Табы (`cabinetSurface`) | empty / loading / error | Примечание |
|------------------|------|----------|--------|-------------------------|---------------------------|------------|
| `/brand/messages` | brand | RegistryPageShell | да | n/a | Suspense fallback | оболочка + sticky comms |
| `/shop/inventory` | shop | RegistryPageShell | да | n/a | в контенте | карточка: `bg-bg-surface2` |
| `/brand/calendar` | brand | RegistryPageShell | да | n/a | Suspense | sticky comms + shell |
| `/brand/reviews` | brand | RegistryPageShell | да | n/a | в карточках | оболочка страницы |
| `/brand/tasks` | brand | RegistryPageShell | да | n/a | Suspense | Kanban + RelatedModules |
| `/brand/materials` | brand | RegistryPageShell | да | n/a | — | поиск: surface token |
| `/brand/quality` | brand | RegistryPageShell | да | n/a | — | оболочка маршрута |
| `/brand/showroom/collaborative` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/suppliers/live` | brand | RegistryPageShell | да | n/a | — | карточки: border-subtle |
| `/brand/showroom/ai-search` | brand | RegistryPageShell | да | n/a | — | stub, shell |
| `/brand/showroom/banners` | brand | RegistryPageShell | да | n/a | — | stub, shell |
| `/brand/showroom/video-consultation` | brand | RegistryPageShell | да | n/a | — | stub, shell |
| `/brand/retailers/volume-rules` | brand | RegistryPageShell | да | n/a | — | stub, shell |
| `/brand/retailers/favorites` | brand | RegistryPageShell | да | n/a | — | stub, shell |
| `/brand/retailers/order-lists` | brand | RegistryPageShell | да | n/a | — | stub, shell |
| `/brand/retailers/multi-cart` | brand | RegistryPageShell | да | n/a | — | stub, shell |
| `/brand/retailers/dealer-cabinet` | brand | RegistryPageShell | да | n/a | — | stub, shell |
| `/brand/retailers/smart-replenishment` | brand | RegistryPageShell | да | n/a | — | stub, shell |
| `/brand/production/gantt` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/production/ready-made` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/production/gold-sample` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/marketing/style-me-upsell` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/pricing/price-comparison` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/range-planner` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/production/fit-comments` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/pricing/elasticity` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/products/digital-passport` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/products/create-ready` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/weather-collections` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/marketing/local-inventory-ads` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/marketing/heritage-timeline` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/production/milestones-video` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/production/qc-app` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/marketing/trend-sentiment` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/production/worker-skills` | brand | RegistryPageShell | да | n/a | — | max-w-4xl, shell |
| `/brand/production/daily-output` | brand | RegistryPageShell | да | n/a | — | max-w-4xl, shell |
| `/brand/production/subcontractor` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/settings/api-hub` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/merchandising` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/marketing/samples` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/virtual-tryon/glasses` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/products/digital-twin-testing` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/pricing/markdown` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/materials/reservation` | brand | RegistryPageShell | да | n/a | — | max-w-4xl, shell |
| `/brand/marketing/design-copyright` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/planning` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/products/footwear-360` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/products/matrix` | brand | RegistryPageShell | да | n/a | — | было `container` |
| `/brand/production/tech-pack/[id]` | brand | RegistryPageShell | да | n/a | — | внутри TooltipProvider |
| `/admin/...` | admin | | | | | |
| `/client/...` | client | | | | | |

## Следующие шаги (коротко)

1. Пройти 5–10 самых частых маршрутов на клик и отметить таблицу.
2. PR-пачками выровнять разделы со статусом `нет` / `частично` (см. чеклист в описании PR).
3. Локально перед пушем: `npm run typecheck` и `npm run lint:errors`.
