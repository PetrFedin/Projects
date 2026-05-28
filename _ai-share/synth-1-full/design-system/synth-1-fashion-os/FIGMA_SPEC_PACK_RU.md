# Figma Spec Pack — Личные кабинеты (RU)

Документ фиксирует единый стандарт для проектирования и вёрстки личных кабинетов платформы Synth-1.

Цель: единый визуальный язык для всех ролей (Client, Brand, Admin, Shop, Factory, Distributor), высокая скорость работы и премиальное ощущение продукта.

**PR по кабинетам:** для ревью используйте сжатый чеклист — `CABINET_PROFILE_PR_CHECKLIST_RU.md` (отмечать в описании PR; исключения — явно).

---

## 1) Структура Figma-файла

Использовать один мастер-файл:

- `00_Foundations`
- `01_Tokens`
- `02_Components`
- `03_Patterns`
- `04_RoleTemplates`
- `05_Screens_Production`
- `06_Checklists_QA`

Правило: ни один production-экран не рисуется напрямую без сборки из `02_Components` + `03_Patterns`.

---

## 2) Компоненты и variants (обязательный минимум)

### 2.1 App Shell

- `AppShell`
  - `role`: `client | brand | admin | shop | factory | distributor`
  - `density`: `comfortable | compact`
  - `leftNav`: `expanded | collapsed | mobile-sheet`
  - `utilityRail`: `on | off`

- `SidebarNavGroup`
  - `state`: `default | active | hover | disabled`
  - `badge`: `none | dot | count`

- `PageHeader`
  - `subtitle`: `on | off`
  - `actions`: `0 | 1 | 2 | many`
  - `statusBadge`: `on | off`

- `SectionRail`
  - `accent`: `primary | neutral | success | warning | danger`
  - `metaBadge`: `on | off`

### 2.2 Данные и аналитика

- `KpiCard`
  - `size`: `sm | md | lg`
  - `tone`: `neutral | primary | success | warning | danger`
  - `trend`: `up | down | flat | none`

- `DataTable`
  - `density`: `dense | default`
  - `rowState`: `default | hover | selected`
  - `statusCell`: `on | off`

- `ListRow`
  - `leading`: `icon | avatar | none`
  - `trailing`: `chevron | actions | none`
  - `state`: `default | hover | selected`

### 2.3 Статусы/бейджи/пустые состояния

- `StatusBadge`
  - `semantic`: `info | success | warning | danger | neutral`
  - `style`: `solid | soft | outline`
  - `size`: `xs | sm | md`

- `EmptyState`
  - `type`: `blank | no-results | no-access | error`
  - `cta`: `none | primary | primary+secondary`

- `InlineNotice`
  - `type`: `info | warning | danger`
  - `dismissible`: `true | false`

### 2.4 Локализация и сокращения

- `LocalizedTextSlot`
  - `lang`: `ru | en`
  - `overflow`: `truncate | wrap`

- `AcronymWithTooltip`
  - `abbr`: текст сокращения (`ROI`, `GMV`, `SKU`, `PO`, `KPI`, `RFM`)
  - `tooltip`: полная расшифровка на русском
  - `state`: `default | hover | focus`

---

## 3) Token map (что где применять)

Ниже карта применения токенов (семантический слой; не использовать raw-цвета на страницах).

### 3.1 Surface / layout

- `bg-bg-surface` — базовый фон страницы
- `bg-bg-surface2` — вторичные контейнеры, таблицы, блоки фильтров
- `border-border-subtle` — границы карточек/строк
- `border-border-default` — активные границы, более сильный контур

### 3.2 Typography

- `text-text-primary` — заголовки, основные числа, ключевые лейблы
- `text-text-secondary` — описания блоков
- `text-text-muted` — подписи, метаданные, helper text
- `text-text-inverse` — текст на тёмных/акцентных кнопках

### 3.3 Action / emphasis

- `bg-accent-primary` — primary action, active tabs, ключевые акценты
- `text-accent-primary` — акцентный текст и иконки
- `bg-accent-primary/10` — мягкая акцентная подложка
- `border-accent-primary/20` — мягкий акцентный контур

### 3.4 Semantic states

- Success: `bg-emerald-50`, `text-emerald-600`, `border-emerald-100`
- Warning: `bg-amber-50`, `text-amber-600`, `border-amber-100`
- Danger: `bg-rose-50`, `text-rose-600`, `border-rose-100`
- Info: `bg-blue-50`, `text-blue-600`, `border-blue-100`

### 3.5 Spacing / radius / density

- Базовый шаг: 4 px
- Основные внутренние отступы: 12/16/20/24
- `radius`: `md` для shell-контролов, `lg/xl` для контент-карточек
- Для таблиц и реестров использовать `dense` паттерн

---

## 4) Локализация (обязательные правила)

### 4.1 Язык интерфейса

- Все пользовательские тексты по умолчанию — на русском.
- Английский допускается только для:
  - официальных названий продукта/модуля,
  - общепринятых аббревиатур (см. ниже),
  - юридически фиксированных терминов интеграций.

### 4.2 Аббревиатуры

- Аббревиатуры оставляем на английском: `ROI`, `SKU`, `PO`, `RFM`, `KPI`, `GMV`, `LTV`, `AOV`.
- При первом появлении в экране — всегда `AcronymWithTooltip`:
  - `ROI` → «Возврат на инвестиции»
  - `SKU` → «Складская единица товара»
  - `PO` → «Заказ на закупку (Purchase Order)»
  - `RFM` → «Давность, частота и сумма покупок»
- Tooltip обязателен для `hover` и `focus` (клавиатура).

### 4.3 Текстовые ограничения

- Не использовать смешанный язык в одном control/label.
- Короткие действия: глагол + сущность («Создать список», «Экспорт CSV»).
- Для системных ошибок: причина + действие пользователя.

---

## 5) Чеклист приемки (на каждую страницу)

## 5.1 Shell Consistency

- [ ] Левый sidebar в том же стиле, что у остальных страниц роли
- [ ] Совпадает верхняя строка заголовка (`role title`, badge, section rail)
- [ ] Нет самовольных `container/max-w` расхождений без решения дизайн-системы
- [ ] Активный пункт навигации определяется корректно

## 5.2 Components Consistency

- [ ] Все KPI через единый `KpiCard`/его эквивалентный компонент
- [ ] Статусы — через `StatusBadge`, не hand-made class strings
- [ ] Пустые состояния — через `EmptyState`, не произвольные заглушки
- [ ] Таблицы соблюдают `dense/default` режим и единый row pattern

## 5.3 Tokens / Visual QA

- [ ] Используются семантические токены, нет raw hex в page-слое
- [ ] Контраст соответствует WCAG AA для текста и статусов
- [ ] Иконки/бейджи в статусах соответствуют semantic-тону
- [ ] Радиусы и отступы соответствуют `spacing/radius` токенам

## 5.4 Localization QA

- [ ] Все пользовательские тексты на русском (кроме допущенных аббревиатур)
- [ ] Для аббревиатур есть tooltip с русской расшифровкой
- [ ] Нет смешения RU/EN в одном label
- [ ] Placeholder/help/error тексты локализованы

## 5.5 Interaction QA

- [ ] Пустое, loading, error состояния заданы
- [ ] Фокус-стили для клавиатуры присутствуют
- [ ] Hover/active/disabled состояния консистентны
- [ ] Sticky actions/toolbar работают на длинных страницах

---

## 6) Чеклист по типам страниц

### 6.1 Реестры (Orders, Returns, Payments)

- [ ] `dense` плотность строк
- [ ] Массовые действия доступны в action bar
- [ ] Статус-колонка использует `StatusBadge`
- [ ] Быстрый переход в карточку сущности (chevron/action)

### 6.2 Dashboard / Overview

- [ ] KPI-сетка в 1 визуальном ритме
- [ ] Тренды единообразны (цвет, иконка, знак)
- [ ] Главное действие видно без скролла

### 6.3 Профиль и настройки

- [ ] Форма разбита на логические секции
- [ ] Критические действия отделены визуально
- [ ] Подписи и helper текст лаконичны и на русском

### 6.4 Академия / контентные каталоги

- [ ] Не ломает общий shell роли
- [ ] Карточки контента в едином паттерне
- [ ] Фильтры/поиск совпадают по стилю с платформой

---

## 7) Definition of Done для дизайна и вёрстки

Страница считается принятой только если:

- выполнены все пункты чеклистов (разделы 5 и 6),
- в Figma у страницы есть статус `Ready for Dev`,
- в коде нет локальных “одноразовых” паттернов, дублирующих системные компоненты,
- локализация и аббревиатуры соответствуют разделу 4.

