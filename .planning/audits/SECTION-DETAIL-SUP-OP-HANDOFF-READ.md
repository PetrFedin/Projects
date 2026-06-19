# SECTION-DETAIL — sup-op-handoff-read (Очередь передачи · read)

> **Роль:** поставщик · столп 4 · order 4  
> **Оценка:** 7.4 (live)  
> **URL:** `factoryHandoffQueueHrefForDemo` → `/factory/production?order=…#handoff-queue`

## 1. Зачем

| Обязательно | Не нужно |
|-------------|----------|
| Видеть PO в очереди до закупки | Ack/write (цех) |
| Счётчик + deep-link на PO | Handoff POST |

## 2. Cross-role

```
brand handoff POST → queue API
       ↓
supplier read: count, PO link, qty → procurement confirm gate
```

## 3. Волна 66 / 77

- Канон testids: `sup-op-handoff-read-*` (strip, queue-count, po-link, queue-link)
- Queue refresh на chain poll tick
- Legacy alias: `data-audit-legacy="sup-op-handoff-queue-count"`

## 4. P1+

- Dedicated handoff-queue SSE (сейчас poll через chain tick) — P2
