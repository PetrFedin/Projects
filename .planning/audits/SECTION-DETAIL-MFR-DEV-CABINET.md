# SECTION-DETAIL — mfr-dev-cabinet (Кабинет · досье/образцы)

> **Роль:** manufacturer · столп 1 · order 4  
> **Оценка:** 7.5 (live)  
> **URL:** `/factory/production/core?pillar=development&collection=SS27`

## 1. Зачем цеху

| Обязательно | Не нужно |
|-------------|----------|
| Read ТЗ бренда (W2 peer) | Brand publish |
| Досье + очередь образцов | Shop orders |
| Context strip hub links | BOM edit write |

## 2. Cross-role

```
mfr-dev-cabinet → brand-dev-w2-hub (read)
                → mfr-dev-dossier / mfr-dev-sample-queue
```

## 3. Волна 92

- `mfr-dev-cabinet-panel` + context strip
- Канон testids `mfr-dev-cabinet-*`
- liveScore 7.3 → 7.5

## 4. P1

- Единый entry sample queue с production hub
- Factory-scoped development-status filter
