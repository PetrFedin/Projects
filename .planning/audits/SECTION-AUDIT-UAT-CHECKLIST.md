# SECTION_AUDIT — UAT чеклист (честный)

> **Сгенерировано:** 2026-06-09 · **Путей:** 69
> **Автоматика:** `core-08` — HTTP < 500 + chrome. **Не покрывает:** клик CTA, PG save, cross-role peer.
> **Интерактив:** `npm run core:verify:interactive` — handoff UI + registry bulk accept.

## Протокол ручного UAT (на раздел)

1. Открыть href из hub «Аудит» или таблицы ниже.
2. Один context-bar / H1; cross-role compact внизу.
3. Primary CTA кликабелен; PG-действия с retry/ошибкой RU.
4. Peer cross-role → живой экран с тем же collection/order/article.

## Покрытие автоматикой

| Слой | Команда | Что ловит |
|------|---------|-----------|
| HTTP smoke | `test:e2e:core` → core-08 | 500, нет chrome |
| Golden path | core-02 | SS27 цепочка, ключевые CTA |
| Comms matrix | core-13 + core-14 | cross-nav 4 роли, banner dedupe, templates |
| Interactive | `core:verify:interactive` | handoff UI + registry bulk |
| No bootstrap | `core:verify:no-bootstrap` | banner no-seed |

## Чеклист разделов

### Бренд

- [ ] `brand-dev-w2-hub` — Цех разработки · коллекция (`development`) → `/brand/production/workshop2?w2col=SS27` · **фокус:** Новый артикул только через API/планировщик; Нет bulk-import SKU
- [ ] `brand-dev-dossier` — Досье артикула · техзадание (`development`) → `/brand/production/workshop2/c/SS27/a/demo-ss27-01?w2sec=general` · **фокус:** ~~e2e composition wizard 1–4 + fiber~~ (волны 32–37); investor-summary и PDF export — вручную
- [ ] `brand-dev-range` — Планировщик ассортимента (`development`) → `/brand/range-planner?collection=SS27` · **фокус:** EMPTY27 без плана; Margin не редактируется в UI
- [ ] `brand-dev-pg-sync` — Статус разработки · PG (`development`) → `/brand/production/workshop2?w2col=SS27&article=demo-ss27-01` · **фокус:** Бренд не видит приоритет очереди цеха; Нет единого progress %
- [ ] `brand-dev-cabinet` — Кабинет · карточка столпа (`development`) → `/brand/core?pillar=development&collection=SS27` · **фокус:** Дубль навигации aside + strip; Нет cross-role в карточке
- [ ] `brand-dev-cross` — Связь · цех и поставщик (`development`) → `/factory/production/dossier/demo-ss27-01` · **фокус:** ~~Нет CTA «передать образец»~~ (`brand-w2-sample-handoff-link`); Нет push статуса образца
- [ ] `brand-sc-linesheets` — Лайншиты · коллекция (`sample_collection`) → `/brand/linesheets?collection=SS27` · **фокус:** Empty PDF edge cases; Нет batch publish
- [ ] `brand-sc-showroom` — Витрина бренда (`sample_collection`) → `/brand/showroom?collection=SS27` · **фокус:** Дубль с linesheets по смыслу; Нет preview matrix inline
- [ ] `brand-sc-publish` — Публикация · PG (`sample_collection`) → `/brand/linesheets?collection=SS27` · **фокус:** Нет UI «снять с публикации» в core; Нет e2e unpublish
- [ ] `brand-sc-cross-matrix` — Cross-role · матрица магазина (`sample_collection`) → `/shop/b2b/matrix?collection=SS27` · **фокус:** ~~Нет deep-link на checkout~~ (волна 39); Нет preview qty в linesheet
- [ ] `brand-sc-cabinet` — Кабинет · лайншит и витрина (`sample_collection`) → `/brand/core?pillar=sample_collection&collection=SS27` · **фокус:** Нет e2e на counts API fail; Дубль showroom/linesheets в hub
- [ ] `brand-co-registry` — Реестр оптовых заказов (`collection_order`) → `/brand/b2b-orders` · **фокус:** ~~Нет SSE refetch при новом заказе~~ (волна 27 `registry-stream`); Фильтры ограничены preset collections
- [ ] `brand-co-detail` — Карточка заказа (`collection_order`) → `/brand/b2b-orders/B2B-DEMO-SHOP1-SS27` · **фокус:** Нет inline confirm; Pre-orders в tail
- [ ] `brand-co-retailers` — Сеть ритейлеров (`collection_order`) → `/brand/retailers` · **фокус:** Не все ритейлеры с PG заказами; Нет CRM depth
- [ ] `brand-co-chain` — Этапы цепочки · заказ (`collection_order`) → `/brand/b2b-orders/B2B-DEMO-SHOP1-SS27` · **фокус:** ~~Нет системного сообщения при submit~~ (волна 24); ~~Нет SSE push~~ (волна 27); ~~PG unread mock~~ (волна 28); ~~read-state localStorage~~ (волна 33 server receipts)
- [ ] `brand-co-cabinet` — Кабинет · приём заказов (`collection_order`) → `/brand/core?pillar=collection_order&collection=SS27` · **фокус:** Нет мини-матрицы в карточке; Дубль CTA реестр/hub
- [ ] `brand-op-handoff` — Передача в производство (`order_production`) → `/brand/b2b-orders/B2B-DEMO-SHOP1-SS27#production-handoff` · **фокус:** Retry UX слабый на 5xx; ~~Нет bulk handoff~~ (волна 26 `brand-b2b-bulk-handoff`)
- [ ] `brand-op-chain` — Статус цепочки · PO (`order_production`) → `/brand/b2b-orders/B2B-DEMO-SHOP1-SS27?pillar=order_production` · **фокус:** ~~Нет CTA на очередь цеха~~ (волна 56 context strip); materials_supplied только read; дубль strips
- [ ] `brand-op-dossier` — Досье · W2 бренда (`order_production`) → `/brand/b2b-orders/B2B-DEMO-SHOP1-SS27?pillar=order_production#production-dossier` · **фокус:** ~~Нет diff с handoff~~ (волна 40); ~~hardcoded dossier href~~ (волна 57); Нет lock полей W2 после PO (только бейдж)
- [ ] `brand-op-registry` — Реестр · контекст заказов (`order_production`) → `/brand/b2b-orders?pillar=order_production&filter=in_production` · **фокус:** ~~Нет колонки PO~~ (волна 58); ~~PO link в queue~~ (волна 58); Filter toggle без URL sync
- [ ] `brand-op-cabinet` — Кабинет · заказ→производство (`order_production`) → `/brand/core?pillar=order_production&collection=SS27` · **фокус:** ~~Нет peer CTA~~ (волна 59); Дубль с order detail/registry; Poll indicator без SSE
- [ ] `brand-cm-order-chat` — Чат · оптовый заказ (`comms`) → `/brand/messages?contextType=b2b_order&contextId=…` · **фокус:** ~~Нет context strip~~ (волна 68); Нет пользовательских шаблонов
- [ ] `brand-cm-article-chat` — Чат · артикул W2 (`comms`) → `/brand/messages?contextType=workshop2_article&contextId=SS27%3Ademo-ss27-01` · **фокус:** Нет файлов ТЗ в чате
- [ ] `brand-cm-calendar` — Календарь · заказ (`comms`) → `/brand/calendar?layers=tasks&order=B2B-DEMO-SHOP1-SS27` · **фокус:** Нет drag слотов
- [ ] `brand-cm-banner` — Контекст-баннер · URL (`comms`) → `/brand/messages?order=B2B-DEMO-SHOP1-SS27&orderId=B2B-DEMO-SHOP1-SS27` · **фокус:** ~~calHref syntha overlay~~ (волна 71); production-context banner ещё legacy
- [ ] `brand-cm-cabinet` — Кабинет · связь (`comms`) → `/brand/core?pillar=comms&collection=SS27` · **фокус:** ~~Нет po-inbox~~ (волна 73); Push/SSE unread

### Магазин

- [ ] `shop-sc-showroom` — Витрина коллекции (`sample_collection`) → `/shop/b2b/showroom?collection=SS27` · **фокус:** Cover hero vs partner PG; Нет e2e partner badge
- [ ] `shop-sc-partners` — Каталог партнёров (`sample_collection`) → `/shop/b2b/partners/discover` · **фокус:** Не все партнёры с коллекциями; Нет invite flow
- [ ] `shop-sc-matrix-entry` — Переход · матрица (`sample_collection`) → `/shop/b2b/matrix?collection=SS27` · **фокус:** ~~Нет qty hint~~ (волна 24: `shop-showroom-cart-qty-*`); Inline size picker P2
- [ ] `shop-sc-cabinet` — Кабинет · витрина (`sample_collection`) → `/shop/core?pillar=sample_collection&collection=SS27` · **фокус:** Дубль mini vs полная страница; Нет empty в mini
- [ ] `shop-co-matrix` — Матрица оптового заказа (`collection_order`) → `/shop/b2b/matrix?collection=SS27` · **фокус:** Зависимость от seed; Нет multi-collection matrix
- [ ] `shop-co-checkout` — Checkout · отправка бренду (`collection_order`) → `/shop/b2b/checkout?collection=SS27` · **фокус:** e2e golden matrix→checkout (волна 99); Резерв фейк на checkout; shop2 без seed
- [ ] `shop-co-registry` — Реестр оптовых заказов (`collection_order`) → `/shop/b2b/orders` · **фокус:** Нет export матрицы; Checkout без multi-tenant buyer
- [ ] `shop-co-detail` — Карточка заказа (`collection_order`) → `/shop/b2b/orders/B2B-DEMO-SHOP1-SS27` · **фокус:** structured amend API (волна 98 `shop-b2b-amend-request-submit`); Резерв фейк
- [ ] `shop-co-cabinet` — Кабинет · формирование заказа (`collection_order`) → `/shop/core?pillar=collection_order&collection=SS27` · **фокус:** Нет checkout shortcut; Дубль hub CTA
- [ ] `shop-op-tracking` — Трекинг цепочки (`order_production`) → `/shop/b2b/tracking` · **фокус:** ~~inventory_reserved только условно~~ (волна 29); ~~Нет действий магазина~~ (волна 39 CTA «Чат»); Poll не push
- [ ] `shop-op-order-status` — Карточка · статус PO (`order_production`) → `/shop/b2b/orders/B2B-DEMO-SHOP1-SS27` · **фокус:** Read-only only; Нет ETA производства
- [ ] `shop-op-registry` — Реестр · контекст (`order_production`) → `/shop/b2b/orders` · **фокус:** Нет фильтра «в производстве»; Нет PO column
- [ ] `shop-op-cabinet` — Кабинет · после отправки (`order_production`) → `/shop/core?pillar=order_production&collection=SS27` · **фокус:** Нет deep-link demo order в hub; Дубль tracking CTA
- [ ] `shop-cm-order-chat` — Чат · заказ (`comms`) → `/shop/messages?contextType=b2b_order&contextId=…` · **фокус:** ~~Нет context strip~~ (волна 68)
- [ ] `shop-cm-calendar-order` — Календарь · заказ (`comms`) → `/shop/calendar?layers=tasks&order=B2B-DEMO-SHOP1-SS27` · **фокус:** Два календаря в nav; Нет preview треда
- [ ] `shop-cm-calendar-logistics` — Календарь · закупки (`comms`) → `/shop/b2b/calendar?layers=orders,logistics` · **фокус:** Нет preview треда в календаре
- [ ] `shop-cm-cabinet` — Кабинет · связь (`comms`) → `/shop/core?pillar=comms&collection=SS27` · **фокус:** Нет article-level chat для shop; Нет notifications center

### Цех

- [ ] `mfr-dev-dossier` — Досье · read-only (`development`) → `/factory/production/dossier/demo-ss27-01` · **фокус:** Цех не редактирует состав; Нет e2e export meta
- [ ] `mfr-dev-sample-queue` — Очередь образцов (`development`) → `/factory/production` · **фокус:** Дубль входов в очередь
- [ ] `mfr-dev-status` — Статус коллекции · PG (`development`) → `/factory/production/dossier/demo-ss27-01` · **фокус:** Brand development на карточке шумит; Нет factory-scoped filter
- [ ] `mfr-dev-cabinet` — Кабинет · досье/образцы (`development`) → `/factory/production/core?pillar=development&collection=SS27` · **фокус:** Нет cross-role к бренду W2; Дубль nav
- [ ] `mfr-op-handoff-queue` — Очередь передачи (`order_production`) → `/factory/production?order=B2B-DEMO-SHOP1-SS27&factoryId=fact-1&collection=SS27#handoff-queue` · **фокус:** ERP live_failed без retry UI
- [ ] `mfr-op-production-orders` — Производственные заказы (`order_production`) → `/factory/production/orders` · **фокус:** Нет e2e MES на FW27/EMPTY27
- [ ] `mfr-op-dossier` — Досье · техзадание (`order_production`) → `/factory/production/dossier/demo-ss27-01?pillar=order_production&order=B2B-DEMO-SHOP1-SS27` · **фокус:** ~~Нет version label~~ (волна 60); Shop-floor PDF — P1; accept/reject без PG
- [ ] `mfr-op-materials` — Закупка · поставщик (`order_production`) → `/factory/production/materials?collection=SS27&article=demo-ss27-01&view=procurement&po=PO-B2B-B2B-DEMO-SHOP1-SS27&order=B2B-DEMO-SHOP1-SS27` · **фокус:** ~~Chrome supplier для цеха~~ (волна 61); ~~confirm у цеха~~ (волна 61); Multi-article wizard P1
- [ ] `mfr-op-cabinet` — Кабинет · выпуск (`order_production`) → `/factory/production/core?pillar=order_production&collection=SS27` · **фокус:** ~~Только 3 CTA~~ (волна 62); Queue snippet max 3; Poll indicator без SSE
- [ ] `mfr-cm-order` — Чат · заказ (`comms`) → `/factory/production/messages` · **фокус:** ~~Нет peer strip~~ (волна 68); Нет inbox по всем PO
- [ ] `mfr-cm-article` — Чат · артикул (`comms`) → `/factory/messages?contextType=workshop2_article&contextId=SS27%3Ademo-ss27-01` · **фокус:** Нет e2e один баннер; Нет attach TZ
- [ ] `mfr-cm-calendar` — Календарь · производство (`comms`) → `/factory/production/calendar?role=manufacturer&layers=tasks,orders,production` · **фокус:** События не из всех PO; Нет Gantt
- [ ] `mfr-cm-cabinet` — Кабинет · связь (`comms`) → `/factory/production/core?pillar=comms&collection=SS27` · **фокус:** Дубль CTA чат/hub; Нет supplier thread shortcut

### Поставщик

- [ ] `sup-dev-bom` — BOM · спецификация (`development`) → `/factory/production/materials?collection=SS27&article=demo-ss27-01&view=development` · **фокус:** Legacy suppliers hub вне core; Нет каталога в nav
- [ ] `sup-dev-materials` — Материалы · разработка (`development`) → `/factory/production/materials?collection=SS27&article=demo-ss27-01&view=development` · **фокус:** Журнал пуст без событий с ценами в PG
- [ ] `sup-dev-chat` — Чат · уточнение цены (`development`) → `/factory/supplier/messages?contextType=workshop2_article&contextId=SS27%3Ademo-ss27-01` · **фокус:** Нет structured quote в чате; Нет SLA ответа
- [ ] `sup-dev-cabinet` — Кабинет · BOM образца (`development`) → `/factory/supplier/core?pillar=development&collection=SS27` · **фокус:** Fill-rate без весов по критичности строк
- [ ] `sup-op-procurement` — Закупка · PATCH (`order_production`) → `/factory/production/materials?...&role=supplier` · **фокус:** ~~Нет context strip~~ (волна 63); Multi-article order — один article per view
- [ ] `sup-op-bom-po` — BOM × PO · прогресс (`order_production`) → `/factory/production/materials?collection=SS27&article=demo-ss27-01&view=procurement&po=PO-B2B-B2B-DEMO-SHOP1-SS27&order=B2B-DEMO-SHOP1-SS27&orderId=B2B-DEMO-SHOP1-SS27` · **фокус:** Progress cap сбивает инвестора; Нет multi-article order
- [ ] `sup-op-chain` — Этап · materials_supplied (`order_production`) → `/factory/supplier/core?pillar=order_production&collection=SS27` · **фокус:** ~~Нет SSE~~ (волна 65); Push notification бренду (P1)
- [ ] `sup-op-handoff-read` — Очередь передачи · read (`order_production`) → `/factory/production?order=…#handoff-queue` · **фокус:** ~~Старые testids~~ (волна 66); Dedicated queue SSE (P1)
- [ ] `sup-op-cabinet` — Кабинет · закупка (`order_production`) → `/factory/supplier/core?pillar=order_production&collection=SS27` · **фокус:** ~~Дубль CTA~~ (волна 67); Multi-article wizard
- [ ] `sup-cm-order` — Чат · заказ (`comms`) → `/factory/supplier/messages` · **фокус:** ~~Нет context strip~~ (волна 68); Quote templates (P1)
- [ ] `sup-cm-article` — Чат · артикул (`comms`) → `/factory/supplier/messages?contextType=workshop2_article&contextId=SS27%3Ademo-ss27-01` · **фокус:** Дубль с development chat; Нет quote template
- [ ] `sup-cm-calendar` — Календарь · логистика (`comms`) → `/factory/production/calendar?role=supplier&layers=tasks,orders,logistics` · **фокус:** Нет delivery confirm event; Нет map/logistics
- [ ] `sup-cm-cabinet` — Кабинет · связь (`comms`) → `/factory/supplier/core?pillar=comms&collection=SS27` · **фокус:** Нет push; Дубль hub comms

## Golden-path UAT — первые 10 пунктов (P0 sign-off)

Ручная сессия ~45–60 мин на прогретом `npm run dev:core` (:3001). Отмечать `[x]` только после клика и визуальной проверки.

1. [ ] **Hub SS27** — `/platform` → матрица 5×4, переход в кабинет бренда collection_order
2. [x] **Showroom → matrix → checkout** — магазин: матрица → checkout → новый `B2B-*` — **e2e core-02:2093 (волна 99)**
3. [ ] **Brand registry** — бренд: реестр видит новый заказ; SSE/refetch или refresh ≤15с
4. [ ] **Order detail chain** — карточка `B2B-DEMO-SHOP1-SS27`: 5 шагов chain-status, чат + календарь
5. [ ] **Handoff → factory queue** — бренд: передача в производство → очередь цеха `PO-B2B-*`
6. [ ] **Factory dossier read-only** — цех: досье `demo-ss27-01`, BOM без редактирования брендом
7. [ ] **Supplier procurement PATCH** — поставщик: подтверждение материалов → шаг `materials_supplied` в chain
8. [ ] **W2 dossier diff** — бренд order detail: бейдж `vN при передаче`; после правки ТЗ — `ТЗ изменилось` (если serial demo)
9. [ ] **Shop amend** — магазин order detail (status `submitted`): `shop-b2b-amend-request-submit` → бренд `brand-b2b-amend-approve`
10. [x] **Comms cross-nav** — любая роль: messages → calendar → messages — **e2e core-13 (4 роли)**

После 10/10 — расширять на оставшиеся 59 разделов по таблице выше.

## Критерий 9+ (не заявляем без)

- [ ] Все пункты выше отмечены вручную за одну сессию UAT
- [ ] `core:verify` + `core:verify:interactive` + `core:verify:no-bootstrap` зелёные
- [ ] Zero mock на активных ячейках SS27 (нет demo-notice на golden path)
