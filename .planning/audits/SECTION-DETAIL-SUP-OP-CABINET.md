# SECTION-DETAIL — sup-op-cabinet (Кабинет · закупка)

> **Роль:** поставщик · столп 4 · order 5  
> **Оценка:** 7.5 (live) · UAT e2e core-01/02  
> **URL:** `/factory/supplier/core?pillar=order_production`  
> **Компонент:** `SupplierProcurementPillarCard`

## 1. Зачем

| Обязательно | Не нужно |
|-------------|----------|
| Агрегат: BOM, chain, queue, CTA | Дубль full card (убран в 48) |
| Peer links: procurement, queue, чаты | Отдельный registry |

## 2. Cross-role hub

```
sup-op-cabinet (hub) → procurement workspace / handoff queue / messages
```

## 3. Волны 65–67

- SSE chain poll + materials badge
- `sup-op-cabinet-*` CTA canon
- **Столп 4 supplier: 5/5**

## 4. P1+

- Multi-article wizard
- Свести pillar nav к hub-only
