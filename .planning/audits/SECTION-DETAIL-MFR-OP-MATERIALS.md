# SECTION-DETAIL — mfr-op-materials (Закупка · поставщик)

> **Роль:** цех · столп 4 «Выпуск» · order 4  
> **Оценка:** 7.5 (live) · UAT e2e core-01/02  
> **Shared URL:** `/factory/production/materials?view=procurement` (+ `role=supplier` для write)  
> **Peer:** sup-op-procurement (write), brand procurement CTA, shop tracking (materials step)

## 1. Зачем цеху

| Обязательно | Не нужно |
|-------------|----------|
| BOM × PO qty read-only | PATCH material-request (поставщик) |
| materials_supplied / WMS badges | Редактирование BOM |
| Cross-links: PO, queue, dossier, tracking | Multi-article wizard (P1) |

## 2. Cross-role поток

```
brand handoff → PO qty в queue
       ↓
mfr materials view (read BOM×qty, chain badges)
       ↓
supplier role=supplier → bulk-confirm → materials_supplied step
       ↓
shop tracking + pillar badges (read)
```

## 3. Хорошо / плохо (честно)

| ✅ | ⚠️ |
|----|-----|
| Разделение manufacturer/supplier на одном URL | Один article per view |
| Context strip + chain badges | Live push слабый (poll only) |
| Confirm gated на role=supplier | Дубль с sup-op-* разделами аудита |

## 4. Было сломано / шум (волна 61)

| Проблема | Фикс |
|----------|------|
| Chrome всегда `highlightRole=supplier` | default manufacturer, `role=supplier` для write |
| Цех видел кнопку «Подтвердить поставку» | confirm только supplier |
| Нет context strip / badges | `mfr-op-materials-context-strip`, supplied/WMS |
| Hardcoded dossier href | `factoryProductionDossierContextHref` |
| Handoff error без retry | `materials-procurement-handoff-retry` |

## 5. Волна 61 — сделано

- Role split + supplier deep-link hint
- SECTION_AUDIT live 7.5 + core-01/02

## 6. P1+

- SSE materials_supplied на pillar/registry
- Multi-article procurement wizard
