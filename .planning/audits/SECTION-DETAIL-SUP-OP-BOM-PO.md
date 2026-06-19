# SECTION-DETAIL — sup-op-bom-po (BOM × PO · прогресс)

> **Роль:** поставщик · столп 4 «Выпуск» · order 2  
> **Оценка:** 7.4 (live) · UAT e2e core-01  
> **URL:** тот же procurement + `role=supplier`  
> **Surfaces:** hub `supplier-procurement-bom-progress` · workspace `sup-op-bom-po-progress`

## 1. Зачем поставщику

| Обязательно | Не нужно |
|-------------|----------|
| BOM fill-rate vs PO qty | Искусственный cap прогресса |
| Строки «на изделие × серия» | Редактирование BOM (бренд/цех) |
| Deep-link в досье при дозаполнении | Отдельный URL (достаточно якоря view) |

## 2. Cross-role

```
brand dossier BOM → supplier видит fill% + required qty (poQty из handoff)
       ↓
supplier confirm (sup-op-procurement) когда BOM+PO готовы
```

## 3. Хорошо / плохо

| ✅ | ⚠️ |
|----|-----|
| Реальный % без cap 40% | Multi-article — один article |
| Progress на hub и workspace | Дубль hub/workspace (осознанно) |

## 4. Волна 64

- `sup-op-bom-po-progress` + dossier link на workspace
- `data-audit-section` на hub progress

## 5. P1+

- Wizard по всем артикулам заказа
