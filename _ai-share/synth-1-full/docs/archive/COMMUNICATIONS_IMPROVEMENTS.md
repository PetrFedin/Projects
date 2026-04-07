# Коммуникации: Сообщения и Календарь — план улучшений

Текущая структура: `CommunicationsNavBar` (Сообщения | Календарь), `CommunicationsChatsStrip`, `CommunicationsUpcomingStrip`, данные в `communications-data.ts` и `calendar-events.ts`.

---

## 1. Связь Сообщения ↔ Календарь

### Сейчас
- Ссылки Tasks, Calendar, Events в SectionInfoCard на обеих страницах
- `CommunicationsUpcomingStrip` на Messages — статические UPCOMING_EVENTS
- `CommunicationsChatsStrip` на Calendar — статические RECENT_CHATS_PREVIEW
- В календаре: «Создать чат» у каждого дедлайна

### Что добавить
- **Единый источник дедлайнов**: `CommunicationsUpcomingStrip` на Messages брать из `getDefaultUpcomingDeadlines()` (как в календаре), а не из UPCOMING_EVENTS
- **Ссылки с контекстом**: при переходе из чата в календарь — передавать partner, role в URL (напр. `?partner=Podium&layers=orders`)
- **Чат из события**: при клике на событие в календаре — кнопка «Открыть чат» с prefill темы (партнёр, заказ)
- **Tasks → Calendar**: задачи из TaskHub при создании/редактировании — опция «Добавить в календарь» с датой

---

## 2. Сообщения (Messages)

### Сейчас
- Groups, ChatList, MessageList, Composer, TaskHub, WidgetsPanel
- CreateChat, TaskEdit, Alerts
- Ссылки на Calendar, Team, Documents, Live, Reviews, B2B

### Что добавить
- **Upcoming strip с реальными дедлайнами**: заменить UPCOMING_EVENTS на `getDefaultUpcomingDeadlines()` с лимитом 4–5
- **Быстрый переход к календарю по партнёру**: в заголовке чата — кнопка «Календарь Podium» → `/brand/calendar?partner=Podium`
- **Фильтр чатов по дедлайну**: «Чаты с дедлайнами на эту неделю» — если у чата есть связанный entity с датой
- **Inline-даты в сообщениях**: распознавать даты в тексте и делать их кликабельными → календарь
- **Напоминание из чата**: «Напомнить 28 января» → создание события/напоминания в календаре
- **Синхронизация непрочитанных**: RECENT_CHATS_PREVIEW — реальные unread из состояния (если есть API)
- **Поиск по чатам + календарю**: единый поиск, который ищет и в сообщениях, и в событиях

---

## 3. Календарь (Strategic Planner)

### Сейчас
- AI Advisor, Season Pipeline, Heat Map, Upcoming Deadlines
- Слои, пресеты, фильтры (партнёр, роль, коллекция)
- День/неделя/месяц, модалка дня, drag&drop

### Что добавить
- **CommunicationsUpcomingStrip на календаре**: сейчас только ChatsStrip; добавить полоску «Ближайшие» (deadlines) рядом или вместо, или комбинировать
- **Чат по событию**: в карточке события — «Чат» с переходом в `/brand/messages` и query (партнёр, контекст)
- **Создать событие из чата**: deep link `/brand/calendar?add=1&partner=Podium&title=...` — открыть форму добавления с prefill
- **Синхронизация с Messages**: если в чате упомянули дату/мероприятие — показывать в календаре (нужен слой «Из чатов» или теги)
- **Экспорт в чат**: «Поделиться днём» — копировать summary в буфер или создать черновик сообщения
- **Уведомления**: при приближении дедлайна — badge/индикатор в Messages или в navbar

---

## 4. Компоненты коммуникаций

### CommunicationsNavBar
- Добавить счётчики: `Сообщения (3)` — непрочитанные, `Календарь` — просроченные дедлайны
- Badge «Срочно» при наличии просроченных дедлайнов

### CommunicationsChatsStrip
- Данные из API/состояния вместо RECENT_CHATS_PREVIEW
- Ссылки с `?chat=id` для открытия конкретного чата
- Показывать 4–5 чатов вместо 3

### CommunicationsUpcomingStrip
- Использовать `getDefaultUpcomingDeadlines({ limit: 5 })` из calendar-events
- Единый формат дат, href — `buildCalendarUrl` с date и layers
- Показывать на обеих страницах (Messages и Calendar) — консистентность

### Единый CommunicationsShell
- Один layout: NavBar + условные полоски (Chats на Messages, Upcoming на обеих)
- Сохранять scroll/состояние при переключении Messages ↔ Calendar

---

## 5. Данные и API

### communications-data.ts
- RECENT_CHATS_PREVIEW — заменить на функцию, принимающую роль/контекст
- UPCOMING_EVENTS — убрать, использовать getDefaultUpcomingDeadlines

### calendar-events.ts
- Уже есть: ALL_CALENDAR_EVENTS, getUpcomingDeadlines, buildCalendarUrl, FASHION_SEASON_DATES
- Добавить: `getDeadlinesForPartner(partner)`, `getDeadlinesForChat(chatId)` — если есть связь чат ↔ entity

### Связь чат ↔ событие
- entityId в сообщении (order, task, event) → событие в календаре
- Обратная связь: событие в календаре → «Открыть чат по заказу X»

---

## 6. UX и навигация

- **Breadcrumbs**: Organization → Коммуникации → Сообщения | Календарь
- **Горячие клавиши**: `G M` (Messages), `G C` (Calendar) — если есть глобальные shortcuts
- **Мобильная версия**: ChatsStrip и UpcomingStrip — горизонтальный скролл, свайп
- **Печать**: улучшить `strategic-planner-print` — скрывать лишнее, оставлять календарь и дедлайны

---

## 7. Приоритеты внедрения

| Приоритет | Задача | Сложность |
|-----------|--------|-----------|
| 1 | UpcomingStrip на Messages — данные из getDefaultUpcomingDeadlines | Низкая |
| 2 | CommunicationsUpcomingStrip на Calendar (комбо с ChatsStrip) | Низкая |
| 3 | Счётчики в NavBar (непрочитанные, просроченные) | Средняя |
| 4 | Кнопка «Календарь [Partner]» в чате | Низкая |
| 5 | Deep link ?add=1 для создания события из чата | Средняя |
| 6 | Связь TaskHub → календарь (добавить в календарь) | Средняя |
| 7 | Inline-даты в сообщениях → календарь | Высокая |

---

## 8. Быстрые победы (можно сделать сейчас)

1. **Сообщения**: заменить UPCOMING_EVENTS на getDefaultUpcomingDeadlines в CommunicationsUpcomingStrip
2. **Календарь**: добавить CommunicationsUpcomingStrip под ChatsStrip (или объединить в одну полоску «Чаты · Ближайшие»)
3. **NavBar**: добавить prop `overdueCount` и показывать badge
4. **Ссылки**: в чатах передавать partner в href календаря при клике на «Calendar»
