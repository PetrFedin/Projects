# Design — Synth-1 Fashion OS

Дизайн интерфейса платформы **применяется автоматически**.

## Источник истины

- **Правила и палитра:** `design-system/synth-1-fashion-os/MASTER.md` (генерируется из UI UX Pro Max)
- **Токены в коде:** этот каталог, `tokens.json`
- **Шрифты:** Fira Sans (body), Fira Code (headings/mono) — подключены в `app/layout.tsx`

## Как это работает

1. **Tailwind** читает `tokens.json` в `tailwind.config.ts` — цвета, отступы, тени, шрифты.
2. **Layout** подключает Fira Sans и Fira Code через `next/font` — типографика совпадает с MASTER.md.
3. **globals.css** задаёт CSS-переменные из MASTER (--color-primary, --color-cta и т.д.).
4. При правках дизайна: обновить MASTER (или перегенерировать через UI UX Pro Max), затем синхронизировать `tokens.json` и при необходимости globals.css.

Обновлять токены под MASTER.md при смене палитры или стиля.
