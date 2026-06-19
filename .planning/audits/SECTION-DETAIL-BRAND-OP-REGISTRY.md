# SECTION-DETAIL — brand-op-registry (Реестр · контекст заказов)

> **Роль:** бренд · столп 4 «Выпуск» · order 4  
> **Оценка:** 7.7 (live) · UAT e2e core-01/02  
> **Peer:** brand-co-registry (тот же URL, столп 3), shop-op-registry, brand-op-handoff  
> **URL:** `/brand/b2b-orders?pillar=order_production&filter=in_production`

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| Список заказов + PO + chain badge | Shop amend |
| Фильтры awaiting_handoff / in_production | MES advance |
| Bulk handoff + CSV | Ack очереди цеха |
| Cross-links: tracking shop, calendar | |

## 2. Cross-role поток

```
brand list API + chain-status-batch
       ↓
filter in_production ↔ handoff write ↔ mfr prod-orders (PO link)
       ↓
shop tracking read · calendar comms
```

## 3. Хорошо / плохо (честно)

| ✅ | ⚠️ |
|----|-----|
| Shared b2b-orders-core с brand-co-registry | Два раздела аудита — один экран |
| PO → prod-orders (не handoff queue) | Дубль аудита с brand-co-registry |
| URL sync фильтров + focus `?order=` (волна 78) | |
| Production context strip | |

## 4. Было сломано / шум (волна 58)

| Проблема | Фикс |
|----------|------|
| PO link вёл в handoff queue | `factoryProductionOrdersOrderContextHref` |
| Нет фильтра in_production | `brand-b2b-filter-in-production` |
| resolveHref без pillar/filter | `brandB2bOrdersProductionRegistryHref` |
| HandedOff order → generic detail | `brandB2bOrderChainContextHref` |
| Context strip только handoff | + tracking, calendar, in_production |

## 5. Волна 58 — сделано

- `brandB2bOrdersProductionRegistryHref()`
- `brand-registry-production-context-strip`
- SECTION_AUDIT live 7.5 + core-01/02 testid sync

## 6. Волна 78 — сделано

- `brandB2bOrdersRegistryHref` — builder URL
- Toggle фильтров → `router.replace` с `filter=` / `pillar=`
- `brand-op-registry-focus-row` при `?order=`
- Канон testids: `brand-op-registry-filter-*`

## 7. P1+

- Merge section scores с brand-co-registry в hub matrix (P2)
