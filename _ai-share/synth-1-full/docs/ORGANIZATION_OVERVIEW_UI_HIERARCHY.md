# Organization overview — дерево UI

Спецификация **только структуры** (без оценки дизайна и без соответствия UI Standard). Связанные документы: [аудит UI Standard](./ORGANIZATION_OVERVIEW_UI_STANDARD_AUDIT.md), [бэклог рефакторинга](./ORGANIZATION_OVERVIEW_REFACTOR_BACKLOG.md).

---

## Embed (`src/app/brand/organization/organization-overview-embed.tsx`)

| Аспект | Содержание |
|--------|------------|
| Роль | Сбор данных и локального состояния → единый дочерний корень `OrganizationOverviewContent`. |
| `SectionBlock` | **Нет** (импортируется только тип `HistoryEntry` из `@/components/brand/SectionBlock`). |
| Заметки | `useOrganizationHealth`, `useAttentionAlerts`, фильтрация активности, сборка `globalHistory`; эффект `resolved` в query + `router.replace` на профиль. |

---

## Content (`src/app/brand/organization/organization-overview-content.tsx`)

### Pre-section (вне `SectionBlock`)

- **Organization Hub header** — градиентная панель `rounded-2xl`: иконка/бейдж, popover-ы (организация, Elite, команда, онлайн), заголовок «Центр управления», хлебные крошки, **переключатель периода** 7d / 30d / календарь.

---

### `SectionBlock` (порядок сверху вниз)

1. **[Условно]** «Результаты бренда по ролям» — рендер только при `canSeeRoleReports` (`accentColor="indigo"`).
2. «Требует внимания» — `accentColor="rose"`, `history={globalHistory}`.
3. «Индекс здоровья» — `accentColor="indigo"`, `history={globalHistory}`.
4. «Недавняя активность» — `accentColor="slate"`, `history={globalHistory}`.

   Блоки **3** и **4** лежат в одной сетке: `grid grid-cols-1 lg:grid-cols-2 gap-4`.

5. «Партнёрская экосистема» — `accentColor="blue"`, `history={globalHistory}`.
6. «Разделы организации» — `accentColor="emerald"`, `history={globalHistory}`; обёртка с `id="sections-modules"` (`scroll-mt-4`).

---

### Внутри каждого `SectionBlock` (кратко)

| # | Заголовок | Основное содержимое |
|---|-----------|---------------------|
| 1 | Результаты бренда по ролям | `Card`: подсказка + кнопки ролей (`ROLE_REPORTS`); вне карты — `CeoReportSheet`. |
| 2 | Требует внимания | `Card`: горизонтальный скролл фиксированной высоты; карточки алертов (сертификаты, профиль, системы, задачи) или пустое состояние «Всё в порядке». |
| 3 | Индекс здоровья | `Card`: ошибка / скелетон / донут `overallHealth` + список `healthMetrics` с `Popover` деталями. |
| 4 | Недавняя активность | `Card`: подпись периода + переключатель участников (`ACTIVITY_PARTICIPANTS`); скролл-список `filteredActivities` (блокировка, комментарий, ссылки); футер — CTA «Все действия» → `/brand/team`. |
| 5 | Партнёрская экосистема | `Card` внутри `TooltipProvider`: три горизонтальных ряда — `PARTNER_COUNTS`, `PARTNER_BUSINESS_PROCESSES`, `PARTNER_ECOSYSTEM_BLOCKS` (мини-карточки, скролл по оси X). |
| 6 | Разделы организации | `Card`: горизонтальный скролл `NAVIGATION_CARDS` (кликабельные карточки разделов). |
