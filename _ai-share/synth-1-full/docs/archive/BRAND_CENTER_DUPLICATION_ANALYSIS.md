# Анализ повторов и дублирования в Бренд-центре

## 1. Навигация (brand-navigation.ts)

### 1.1 Путаница в названиях «Центр управления»
- **Группа «Организация»**: первый пункт — **«Центр управления»** (`value: 'organization'`) → ведёт на `ROUTES.brand.organization`.
- **Группа «Центр управления»**: отдельная группа с пунктами «Стратегический хаб» (control-center) и «Операционный пульс» (dashboard).

Один и тот же термин «Центр управления» используется для двух разных разделов (организация vs стратегический хаб). Рекомендация: переименовать пункт в группе «Организация» в «Организация и профиль» или «Профиль компании», либо оставить только один «Центр управления» (стратегический хаб), а в «Организации» сделать акцент на команде и настройках.

### 1.2 Дублирование по смыслу в группах
- **Логистика**: «Складской учёт» (warehouse) и «Inventory» (inventory) — оба про остатки; разница в том, куда ведёт href (warehouse vs inventory). Стоит проверить, нужны ли два пункта или один общий «Склад и остатки».
- **B2B**: много пунктов (30+), часть дублирует разделы из «Дистрибьюторы» (Territory, Pre-Order Quota, Sub-Agent Commission есть и в B2B, и в отдельной логике дистрибуции). С точки зрения навигации это не дубль (один список), но в entity-links одни и те же ссылки повторяются в разных getXxxLinks.

---

## 2. Перекрёстные ссылки (entity-links.ts)

### 2.1 Часто повторяющиеся href в разных getXxxLinks

| Href / раздел | Количество функций, где встречается | Примеры функций |
|--------------|-------------------------------------|------------------|
| B2B Заказы (`/brand/b2b-orders`) | 20+ | getB2BLinks, getTradeShowLinks, getTerritoryProtectionLinks, getProductionLinks, getAnalyticsLinks, getFinanceLinks, getLogisticsLinks, getDocumentsLinks, getArbitrationLinks, getCommLinks, getAuctionLinks, getAnalyticsPhase2Links, getSupplierLinks, getOrderLinks, getBuyerOnboardingLinks, getLinesheetCampaignsLinks, getPreOrderQuotaLinks, getSubAgentCommissionLinks, getDistributorLinks |
| Партнёры (`/brand/retailers`) | 10+ | getB2BLinks, getTradeShowLinks, getTerritoryProtectionLinks, getSubAgentCommissionLinks, getDistributorLinks, getBuyerOnboardingLinks, getLinesheetCampaignsLinks, getAuctionLinks |
| Финансы (`/brand/finance`) | 10+ | getB2BLinks, getSubAgentCommissionLinks, getDistributorLinks, getProductionLinks, getFinanceLinks, getArbitrationLinks, getDocumentsLinks, getAnalyticsPhase2Links |
| Production (`/brand/production`) | 10+ | getB2BLinks, getSupplierLinks, getLogisticsLinks, getProductionLinks, getEsgLinks, getCommLinks, getAuctionLinks, getDocumentsLinks, getAnalyticsLinks, getAnalyticsPhase2Links |
| Виртуальные выставки (tradeShows) | 7+ | getB2BLinks, getTradeShowLinks, getBuyerOnboardingLinks, getLinesheetCampaignsLinks, getTerritoryProtectionLinks, getPreOrderQuotaLinks, getSubAgentCommissionLinks, getDistributorLinks |
| Заявки байеров (buyerApplications) | 7+ | те же B2B/дистрибуция-ориентированные функции |
| Центр управления (control-center) | 5+ | getAnalyticsLinks, getCommLinks, getAcademyLinks, getAuctionLinks, getHRHubLinks |
| Дистрибьюторы (distributors) | 4 | getTerritoryProtectionLinks, getPreOrderQuotaLinks, getSubAgentCommissionLinks, getDistributorLinks |

Итог: одни и те же разделы (B2B Заказы, Партнёры, Финансы, Production, Выставки, Заявки байеров) повторяются во многих списках ссылок. Для пользователя это не ошибка (контекстные блоки «Связанные разделы» на разных страницах), но ведёт к дублированию поддержки и риску расхождений при смене href.

### 2.2 Почти идентичные наборы ссылок
- **getTerritoryProtectionLinks**, **getPreOrderQuotaLinks**, **getSubAgentCommissionLinks** пересекаются на 70%+: B2B Заказы, Партнёры, Дистрибьюторы, Виртуальные выставки, Заявки байеров. Различие в 2–3 пунктах (Territory, Pre-Order Quota, Commission, Финансы).
- **getTradeShowLinks**, **getBuyerOnboardingLinks**, **getLinesheetCampaignsLinks** — сильное пересечение (Шоурум, B2B Заказы, Партнёры, Заявки байеров, Выставки, Календарь/События).

Рекомендация: ввести базовый набор «B2B & дистрибуция» (например, `getB2BDistributorBaseLinks()`) и в getTerritoryProtectionLinks / getPreOrderQuotaLinks / getSubAgentCommissionLinks добавлять только уникальные для раздела пункты.

### 2.3 Непоследовательное использование ROUTES
- Часть функций использует `ROUTES.brand.*` (getB2BLinks, getTradeShowLinks и др.).
- Часть — строковые пути: `/brand/team`, `/brand/b2b-orders`, `/brand/finance`, `/brand/control-center`, `/brand/analytics-bi` (getOrgLinks, getLogisticsLinks, getProductLinks, getMarketingLinks, getAnalyticsLinks, getFinanceLinks, getCommLinks, getAcademyLinks, getHRHubLinks, getDocumentsLinks, getIntegrationLinks).

Риск: при смене маршрута в `ROUTES` часть ссылок в entity-links не обновится. Рекомендация: везде заменить строковые пути на `ROUTES.brand.*` (или общие ROUTES).

---

## 3. Шаблон страниц (SectionInfoCard + RelatedModulesBlock)

### 3.1 Повторяющаяся структура
Почти все разделы бренд-центра строятся по одному шаблону:
- Заголовок + кнопка «Назад»
- **SectionInfoCard** (title, description, icon, badges с 2–4 кнопками)
- Контент (Card/таблицы/формы)
- **RelatedModulesBlock** с `getXxxLinks()`

Это не дубль контента, а единый UX-паттерн — нормально.

### 3.2 Повторяющиеся кнопки в badges SectionInfoCard
На разных страницах в badges часто одни и те же разделы:
- «B2B Заказы» — order-approval-workflow, order-amendments, territory, commissions, pre-order-quota, trade-shows, engagement, embedded-payment.
- «Партнёры» — territory, commissions, engagement.
- «Финансы» — commissions, embedded-payment.
- «Дистрибьюторы» — territory, pre-order-quota, commissions.
- «Production» / «Materials» / «Поставщики» — suppliers/rfq, production-*, bopis.

Рекомендация: не обязательно менять (это быстрые CTA), но можно вынести типовые наборы badge по контексту (B2B, Production, Finance) в константы или хелперы, чтобы не дублировать одни и те же Link-кнопки в десятках файлов.

---

## 4. Итоговые рекомендации

| Проблема | Действие |
|----------|----------|
| Два разных «Центр управления» в навбаре | Уточнить названия: например, в группе «Организация» — «Профиль и команда» или оставить один явный «Центр управления» только для controlCenter. |
| Один и тот же href в 20+ списках ссылок | Оставить как есть для контекста; при рефакторинге — базовые наборы (baseLinks) + доп. пункты по разделам. |
| Сильное пересечение getTerritoryProtectionLinks / getPreOrderQuotaLinks / getSubAgentCommissionLinks | Ввести общий getDistributorSectionLinks() или base + уникальные, чтобы не дублировать 5–7 одинаковых строк в трёх функциях. |
| Строковые пути вместо ROUTES в entity-links | Постепенно заменить `/brand/...` на ROUTES.brand.* в getOrgLinks, getLogisticsLinks, getProductLinks, getMarketingLinks, getAnalyticsLinks, getFinanceLinks, getCommLinks, getAcademyLinks, getHRHubLinks, getDocumentsLinks, getIntegrationLinks. |
| Два пункта «Склад/остатки» в группе Логистика | Уточнить разницу (warehouse vs inventory) в описаниях или объединить в один пункт с подразделами. |

---

## 5. Где нет дублирования

- **brand-navigation.ts**: значения `value` у ссылок уникальны в рамках группы, дублей по `value` нет (в отличие от shop-navigation, где был дубль `discover`).
- **Маршруты** в `ROUTES.brand` заданы один раз; дублирования путей в самом конфиге нет.
- **Содержимое страниц**: тексты описаний и контент разделов различаются; смыслового копипаста блоков не выявлено.

Анализ выполнен по состоянию репозитория: навигация, entity-links, типовой шаблон страниц бренд-центра.
