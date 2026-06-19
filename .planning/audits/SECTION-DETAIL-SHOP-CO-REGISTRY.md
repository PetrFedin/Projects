# SECTION-DETAIL — shop-co-registry (Реестр оптовых заказов)

> **Роль:** магазин · столп 3 «Оптовый заказ» · order 3  
> **Оценка:** 7.6 (live) · UAT e2e core-02  
> **Peer:** shop-op-registry (тот же URL, столп 4), brand-co-registry  
> **URL:** `/shop/b2b/orders`

## 1. Зачем магазину

| Обязательно | Не нужно |
|-------------|----------|
| Список отправленных заказов | Brand confirm / handoff write |
| Read-only chain badge + PO | Bulk acknowledge delivery |
| CTA: матрица, витрина (onboarding) | Mfr queue |
| Трекинг / чат на строке | |

## 2. Cross-role поток

```
shop-co-matrix → checkout → PG order
       ↓
shop-co-registry (мониторинг статуса)
       ↓
shop-co-detail (amend) · tracking read
```

## 3. Хорошо / плохо

| ✅ | ⚠️ |
|----|-----|
| Buyer-scoped list | Новый buyer — только onboarding |
| `shop-co-registry-context-strip` | Нет export матрицы |
| Empty onboarding → matrix/showroom | Дубль аудита с shop-op-registry |
| SSE refetch после submit | |

## 4. Волна 83 — сделано

- `shop-co-registry-panel` / `shop-co-registry-focus-row`
- Context strip: матрица, витрина, трекинг, демо-заказ, мост в производство
- Канон onboarding: `shop-co-registry-empty-onboarding`, `shop-co-registry-onboarding-*`
- `shopB2bOrdersCollectionRegistryHref()` в routes

## 5. P1+

- CRM/invite для новых партнёров
- Batch acknowledge delivery (tracking)
