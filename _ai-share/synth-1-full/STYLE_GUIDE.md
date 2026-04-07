# Synth-1 Design System — JOOR-style B2B

Единый стиль оформления разделов, кнопок, виджетов и блоков.  
Референс: **JOOR** — чистый, профессиональный B2B wholesale interface.

---

## Принципы

1. **Профессионализм** — минимум декора, акцент на данные и действия
2. **Иерархия** — чёткие уровни: страница → раздел → блок → элемент
3. **Воздух** — достаточные отступы, не перегружать экран
4. **Консистентность** — одни и те же паттерны везде

---

## Типографика

| Уровень | Класс | Где |
|---------|-------|-----|
| **Page title** | `text-2xl sm:text-3xl font-bold text-slate-900` | H1 |
| **Section title** | `text-base font-semibold text-slate-900` | H2 |
| **Block label** | `text-[10px] font-bold uppercase tracking-widest text-slate-500` | H3 |
| **Body** | `text-sm text-slate-600` | p |
| **Caption** | `text-xs text-slate-500` | span |

---

## Секции и блоки

### Section (раздел)
- Контейнер: `space-y-6` или `space-y-8`
- Заголовок: иконка + текст

### Card
- `rounded-xl border border-slate-200/80 bg-white shadow-sm`
- Padding: `p-5` или `p-6`
- Hover: `hover:border-slate-300 hover:shadow-md transition-all`

### Stat card (KPI)
- `rounded-xl border border-slate-100 p-4`
- Число: `text-2xl font-bold tabular-nums text-slate-900`
- Метка: `text-xs font-medium text-slate-500 uppercase tracking-wider`

### Info block
- Иконка 40×40px, заголовок + описание
- `flex items-start gap-4`

---

## Кнопки

| Тип | Стиль |
|-----|-------|
| **Primary** | `bg-slate-900 text-white hover:bg-slate-800 rounded-lg` |
| **Secondary** | `border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg` |
| **Ghost** | `text-slate-600 hover:bg-slate-100 rounded-lg` |
| **Tab active** | `bg-white shadow-sm border border-slate-200 rounded-xl` |
| **Tab inactive** | `text-slate-500 hover:bg-white/70 rounded-xl` |

---

## Акценты

- Primary: `slate-900`
- Accent: `indigo-600`
- Иконки: `bg-{color}-50 text-{color}-600`

---

## Компоненты

```tsx
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { WidgetCard } from '@/components/ui/widget-card';
```

- **SectionHeader** — заголовок секции (icon + title + description + badges/actions)
- **StatCard** — KPI-карточка (число + метка, опционально link)
- **WidgetCard** — блок с заголовком, описанием, actions и контентом
- **SectionBlock** / **SectionInfoCard** — расширенные (история, meta)
- **RelatedModulesBlock** — связанные разделы
- **EmptyStateB2B** — пустое состояние (иконка, заголовок, описание, кнопка)
- **Breadcrumb** — навигационная цепочка
- **PageSkeleton** — loading: header + grid
- **TableSkeleton** — loading: строки таблицы

---

## Таблицы

| Элемент | Класс |
|---------|-------|
| **Заголовок** | `text-xs font-bold uppercase tracking-wider text-slate-500` |
| **Ячейка основная** | `text-sm text-slate-900` |
| **Ячейка второстепенная** | `text-sm text-slate-600` |
| **Строка** | `border-b border-slate-100`, `hover:bg-slate-50` |
| **Контейнер** | `rounded-xl border border-slate-200 overflow-x-auto` (мобильный скролл) |
| **Мобильный (768px)** | `min-w-[640px]` для таблицы внутри overflow-x-auto — горизонтальный скролл |

---

## Контейнеры и сетка

| Тип | max-width | Где |
|-----|-----------|-----|
| **Дашборды** | `max-w-7xl` | Brand page, Control Center |
| **Списки/формы** | `max-w-5xl` или `max-w-4xl` | Academy, интеграции |
| **Детали** | `max-w-3xl` или `max-w-2xl` | Карточка, настройки |

---

## Формы

| Элемент | Стиль |
|---------|-------|
| **Input** | `rounded-lg border-slate-200 h-11` |
| **Label** | `text-sm font-medium text-slate-700` |
| **Error** | `text-xs text-rose-600` |
| **Select** | `rounded-lg border-slate-200 h-11 px-3` |

---

## Обновлённые разделы (2025-03)

- **Brand Academy**: knowledge, team, clients, stores, courses — SectionHeader + WidgetCard
- **Shop B2B**: чистый header, табы, карточки
- **Shop Inventory, Orders**: SectionHeader + WidgetCard
- **RelatedModulesBlock**: slate-палитра, единый стиль
