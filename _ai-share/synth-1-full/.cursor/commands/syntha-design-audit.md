# Syntha Design System Audit

## Overview

Проверка изменений на соответствие дизайн-системе Syntha: STYLE_GUIDE.md, tokens.json, Cursor rule ui-ux-design-system.

## Steps

1. **Типографика** — Page title: text-2xl font-bold text-slate-900; Section: text-base font-semibold; Block label: text-[10px] font-bold uppercase
2. **Компоненты** — Использовать SectionHeader, StatCard, WidgetCard из @/components/ui
3. **Кнопки** — Primary: bg-slate-900; Secondary: border border-slate-200
4. **Иконки** — Только Lucide, без emoji
5. **Routes** — Всегда ROUTES.* из @/lib/routes, не строки
6. **cn()** — Для merge классов

## Checklist

- [ ] Классы из STYLE_GUIDE
- [ ] ROUTES вместо хардкода
- [ ] Lucide иконки
- [ ] Responsive 375/768/1024
