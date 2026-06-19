# SECTION-DETAIL — brand-co-registry (Реестр оптовых заказов)

> **Роль:** бренд · столп 3 «Приём заказов» · order 1  
> **Оценка:** 7.3 (live) · UAT e2e core-02  
> **Peer:** brand-op-registry (тот же URL, столп 4), shop-co-registry  
> **URL:** `/brand/b2b-orders`

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| Список PG заказов + статусы W2 | MES / PO advance |
| Фильтр коллекции + партнёр | Shop amend write |
| Confirm / передача (deep link) | Bulk handoff как основной UX столпа 3 |
| Cross-links: ритейлеры, пребук, чат | |

## 2. Cross-role поток

```
shop checkout (matrix) → PG order
       ↓
brand-co-registry (приём, confirm, handoff CTA)
       ↓
brand-co-detail → handoff → mfr prod-orders
```

## 3. Хорошо / плохо

| ✅ | ⚠️ |
|----|-----|
| Shared b2b-orders-core | Два раздела аудита — один экран |
| `brand-co-registry-context-strip` | Фильтр коллекции — preset only |
| SSE registry bump | Динамические коллекции из PG — P1 |
| Thread preview на строке | |

## 4. Волна 83 — сделано

- `brand-co-registry-panel` / `brand-co-registry-focus-row`
- Context strip: демо-заказ, ритейлеры, пребук, чат, мост в производство
- Канон testids: `brand-co-registry-filter-*`, `brand-co-registry-export-csv`, `brand-co-registry-collection-filter`
- `brandB2bOrdersCollectionRegistryHref()` в routes

## 5. P1+

- Динамические коллекции из PG
- Merge hub scores с brand-op-registry (P2)
