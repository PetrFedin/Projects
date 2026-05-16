# Investor demo runbook (три столба: W2 → B2B → comms)

**Назначение:** один согласованный сценарий живой презентации Fashion OS (кабинет бренда + при необходимости shop), с **честными подписями** demo / localStorage / env-gated и без «случайных» уходов в архивный хвост меню.  
**Канон стратегии и фаз:** `.planning/research/` — `FOCUS_ONE_PAGER.md`, `GAP_ANALYSIS_USER_FLOW_COLLECTION_B2B_CHAT_CALENDAR.md`, `PLAN_RESTRUCTURE_THREE_PILLARS.md` (§3, §7, §8), `FINAL_DIAGRAMS_AND_PAGES_RU.md` (диаграммы, **Приложение F**).  
**Код:** репозиторий `_ai-share/synth-1-full`. **Маршруты:** `src/lib/routes.ts` (`ROUTES`).

**Синхрон с каноном:** нумерация и состав URL в **§5** ниже должны соответствовать **`PLAN_RESTRUCTURE_THREE_PILLARS.md` §7.7** (п.1–9). При любом изменении **§7.7** или порядка шагов демо — обновить этот runbook **в том же или парном PR**; в трекере — label **`docs-runbook`** (см. `PLAN` §9.3, `GAP` §9.1 п.6). После правок навигации во full — **`npm run validate:cabinet-nav`**.

---

## 1. Роли на встрече

| Роль | Обязанность |
|------|----------------|
| **Ведущий (бренд)** | Говорит нарратив, кликает только по spine; не обещает то, что не показано. |
| **Тех. модератор** | Node/env, вкладки, сброс LS при «залипании» демо, при необходимости — `npm run smoke` / preflight до звонка. |
| **Наблюдатель** | Задаёт вопросы «demo vs prod»; получает прямые ответы из §3 настоящего файла. |

---

## 2. Pre-flight (до звонка, ~15 мин)

1. **Node:** 20.x–23.x (см. `.nvmrc`, корневой `AGENTS.md` монорепо).  
2. **Зависимости:** `npm ci` в каталоге full (или bootstrap монорепо).  
3. **Сервер:** `npm run dev` → `http://localhost:3000`.  
4. **Демо-логин:** `src/lib/auth/demo-hub-email.ts`; детали tenant — `docs/UNIFIED_ECOSYSTEM_VERIFICATION.md` / `e2e/README.md`.  
5. **Контрактные смоки (целевой поднабор):** из корня монорепо `npm run smoke`; во full — `npm run test:e2e:light`, `npm run test:e2e:verification`, `playwright test e2e/workshop2-smoke.spec.ts` (см. `PLAN` §6).  
6. **Investor spine (если включён на стенде):** в `.env.local` во full — флаги из **`env.cabinet-nav.example`** (`NEXT_PUBLIC_BRAND_NAV_INVESTOR_SPINE`, `NEXT_PUBLIC_SHOP_NAV_INVESTOR_SPINE`, `NEXT_PUBLIC_FACTORY_NAV_INVESTOR_SPINE`, `NEXT_PUBLIC_DISTRIBUTOR_NAV_INVESTOR_SPINE`; см. **`src/lib/cabinet-nav-env.ts`**, **`PLAN_RESTRUCTURE_THREE_PILLARS.md` §8.1–8.4`). Перед звонком: **`npm run validate:cabinet-nav`** (в т.ч. `validate:syntha-core-groups` — ядро и id investor-порядка). Если в питче заходите в **дистрибутора** — явно включите **`NEXT_PUBLIC_DISTRIBUTOR_NAV_INVESTOR_SPINE=1`** или проверьте, что ведущий не уходит в «архив» меню без сценария.  
7. **Tech pack (опционально):** только если зелёный `npm run w2:techpack:preflight` и env по `env.w2-techpack.example` — см. `docs/W2_TECHPACK_PILOT.md`. Иначе **не** открывать пилотный шаг в питче.

---

## 3. Честные подписи (произносить вслух при первом касании)

| Тема | Фраза |
|------|--------|
| **W2 досье** | «Досье фазы 1 в демо может жить в **localStorage** ключа вроде `synth.brand.workshop2Phase1Dossier.v1` — это осознанно для стабильного стенда, не обещаем тот же режим в прод без отдельной персистенции.» |
| **Organization / метрики** | «Часть сводок — **mock / demo seed**, не операционный дашборд продакшена.» |
| **Tech pack** | «Пилот **env-gated** (S3/DB); без preflight показываем только UX-оболочку или пропускаем шаг.» |
| **Календарь** | «**Канон демо** — `/brand/calendar` (сроки сделки и встречи бренда). Другие календари (shop delivery, фабрика) — **отдельные семантики**, не смешиваем легенду на одном экране.» |
| **Чат** | «**Два уровня:** полноформатный `/brand/messages` и вкладка на полу производства — разные поверхности до ADR конвергенции (`GAP` §8).» |
| **B2B operational** | «Список и карточка — **read-model** и v1 API с fallback; не второй источник правды в UI.» |

---

## 4. Целевое время и порядок столбов

- **Цель:** один проход **A → B → C** за **≤25 минут** (жёсткий ориентир из `FOCUS` / `PLAN` §6).  
- **Столб A:** W2 + опционально tech pack.  
- **Столб B:** коллекции → витрина → operational orders.  
- **Столб C:** messages → calendar.  
- **Опционально в конце:** `/shop/b2b-orders` как зеркало (ещё ~3 мин).

---

## 5. Пошаговый сценарий (URL = чеклист `PLAN` §7.7 п.1–9)

Тайминг ориентировочный; если обсуждение — урезать «украшения», не выходить в архив меню.

### Столб A — W2 (~10–12 мин)

| Шаг | URL / действие | Что сказать (1 фраза) |
|-----|----------------|------------------------|
| A1 | `/brand/profile` | «Точка входа бренда после редиректа с `/brand`.» |
| A2 | `/brand/production/workshop2` | «Хаб артикулов и коллекций для ТЗ фазы 1; смок-контракт **SS27**.» |
| A3 | `/brand/production/workshop2/c/SS27/a/demo-ss27-01` | «Рабочее место артикула; при необходимости deep-link секции ТЗ — `?w2pane=tz` (уточнить в UI).» |
| A4 | *(внутри артикула)* | «Signoff, merge, lifecycle — договорённость с фабрикой вместо PDF в почте.» |
| A5 *(опц.)* | Tech pack маршрут из продукта / `docs/W2_TECHPACK_PILOT.md` | Только если preflight зелёный; иначе **пропустить** с фразой из §3. |

**Fallback:** если досье «пустое» — модератор: очистить LS-ключ W2 досье (см. e2e / `AGENTS.md`), обновить страницу, повторить A2→A3.

### Столб B — коллекции и B2B (~8–10 мин)

| Шаг | URL / действие | Что сказать |
|-----|----------------|-------------|
| B1 | `/brand/collections` | «Сезон как контейнер; стадии review — узкий порт API.» |
| B2 | **`/brand/showroom`** (канон; альт. **`/brand/b2b/linesheets`**) | «**Канон витрины** для опта перед operational order (`GAP` §7.1).» |
| B3 | `/brand/b2b-orders` → открыть **одну** карточку `/brand/b2b-orders/[orderId]` | «Operational orders v1, единый BFF; строки — DTO из `GAP` §7.2.» |
| B4 | `/brand/integrations` | «Карта коннекторов; каталог-summary — с подписью demo-источника.» |

**Не делать:** уводить в `/brand/integrations/archive/*`, JOOR/NuORDER deep-dive, весь хвост `/brand/b2b/*` без отдельного решения.

### Столб C — comms (~4–5 мин)

| Шаг | URL | Что сказать |
|-----|-----|-------------|
| C1 | `/brand/messages` | «Inbox бренда; кросс-рольный слой переговоров.» |
| C2 | `/brand/calendar` | «Канон календаря демо на квартал — бренд; другие слои подписываем отдельно.» |

### Опционально (~3 мин)

| Шаг | URL | Примечание |
|-----|-----|--------------|
| O1 | `/shop/b2b-orders` | Зеркало OO; только если релевантно аудитории. |

---

## 6. Fallback-скрипт (если что-то сломалось mid-demo)

| Ситуация | Действие |
|----------|-----------|
| W2 не грузится | Hub → проверить slug SS27 / `demo-ss27-01`; LS reset; см. `e2e/workshop2-smoke.spec.ts`. |
| B2B API ошибка | Показать реестр + карточку в UI; перейти на integrations; **не** обещать live ERP. |
| Tech pack недоступен | Одна фраза: «Пилот env, шаг пропускаем» — `PLAN` §7.5. |
| Пустые messages/calendar | Empty states — норма; не выдумывать данные. |
| Ушли в «архив» меню | Вернуться на `/brand/profile` и spine; **не** кликать в Academy / client sewing / аналитику как в центр питча. |

---

## 7. После демо (5 мин с командой)

- [ ] Зафиксировать вопросы инвестора → тикеты с метками `spine-p0`, `phase*` (`PLAN` §9.3).  
- [ ] Если менялись обещания по продукту — проверить нужен ли **ADR** (`GAP` §7.6).  
- [ ] Обновить **`GAP` §2/§5** при закрытии пробела (`GAP` §9.1).  
- [ ] Обновить **`FINAL` Приложение F** при смене статуса узла.

---

## 8. Связанные документы во full

| Документ | Зачем |
|----------|--------|
| `docs/UNIFIED_ECOSYSTEM_VERIFICATION.md` | Матрица маршрутов и приёмка экосистемы. |
| `docs/W2_TECHPACK_PILOT.md` | Tech pack пилот. |
| `docs/B2B_AND_PRODUCTION_CORE_SPEC.md` | SoT B2B / производство при смене канона. |
| `e2e/README.md` | Запуск смоков и контракты slug. |
| `INTEGRATION_MAP.md` | Связи модулей. |

---

*Версия runbook для Фазы 3 `PLAN_RESTRUCTURE_THREE_PILLARS.md`; при расхождении с кодом первичны маршруты и тесты в репозитории.*
