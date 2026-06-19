# SECTION-DETAIL — shop-co-buyer-tracking (Трекинг покупателя · PO)

> **Роль:** shop · столп 3 · order 5  
> **Оценка:** static 7.8 · live 8.1  
> **URL:** `/shop/b2b/tracking?order=B2B-DEMO-SHOP1-SS27#shop-co-buyer-tracking`  
> **SoT:** `platform-core-readiness-sections.ts` → `SECTION_AUDIT.shop.collection_order[4]`

## 1. Зачем магазину

| Обязательно | Не нужно |
|-------------|----------|
| ShopProductionVisibility policy (none/milestones/full) | Редактирование PO цеха |
| Chain steps после handoff | Brand handoff POST |
| Materials/PO strips по disclosure | W2 dossier edit |

**Summary:** Canonical buyer path — visibility policy в chain-status-batch buyerView (волна 25).

## 2. Cross-role

```
shop-co-buyer-tracking ← brand-op-handoff (handoff POST)
                       ← mfr-op-production-orders (PO queue)
                       → shop-cm-order-chat (tracking chat deep-link)
                       → brand retailers disclosure policy
```

## 3. Good (из SECTION_AUDIT)

- shopB2bTrackingOrderHref / #shop-co-buyer-tracking
- ShopProductionVisibility none/milestones/full (core-16 e2e)
- Brand disclosure preview strip (core-21/29/44)
- core-19 clean PG buyer-tracking после handoff
- core-44: brand disclosure link → tracking chain steps на B2B-\d+
- chain-status-batch buyerView + PG order testids (волна 25)
- Tracking chat link ?pillar&section=shop-co-buyer-tracking (core-46)
- Legacy ?pillar=order_production redirect
- Materials/PO strips по visibility policy
- e2e core-01/06: shop-co primary testids (волна 26)
- SSE chain status на tracking panel

## 4. Bad / Fix

| Bad | Fix |
|-----|-----|
| Acknowledge delivery batch отсутствует | Batch acknowledge delivery (P1) |

## 5. P1 / UAT

- [ ] UAT: policy `none` скрывает production_po (core-16)
- [ ] UAT: policy `full` после handoff показывает PO id
- [ ] UAT: per-order override в brand retailers panel
