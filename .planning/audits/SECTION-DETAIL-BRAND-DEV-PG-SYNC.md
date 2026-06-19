# SECTION-DETAIL — brand-dev-pg-sync (Статус разработки · PG)

> **Роль:** бренд · столп 1 · order 4  
> **Оценка:** static 7.1 · live 7.2  
> **URL:** `/brand/production/workshop2?w2col=SS27&article=demo-ss27-01`  
> **SoT:** `platform-core-readiness-sections.ts` → `SECTION_AUDIT.brand.development[3]`

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| development-status API + шаги цепочки | Редактирование очереди цеха |
| Published-articles для витрины | MES execution |
| Прогресс % и позиция в sample queue | Supplier procurement UI |

**Summary:** development-status API, шаги цепочки, опубликованные артикулы.

## 2. Cross-role

```
brand-dev-pg-sync → mfr-dev-sample-queue (factory queue)
                  → brand-sc-showroom (published articles)
                  → sup-dev-bom (materials из dossier)
```

## 3. Good (из SECTION_AUDIT)

- API development-status
- Published-articles для витрины
- Sample queue в factory
- Бейдж статуса образца в DevelopmentPillarCard
- Позиция в очереди (`development-sample-queue-position`)
- workshop2-core-pg-sync-hint на W2 hub (core mode)
- core-02 столп 1 hub→W2→range→factory
- Прогресс % (`development-progress-pct`)

## 4. Bad / Fix

| Bad | Fix |
|-----|-----|
| Нет push при смене статуса образца | Push при смене статуса образца |

## 5. P1 / UAT

- [ ] UAT: статус образца совпадает с factory sample queue после ack
- [ ] E2E: `development-progress-pct` виден на W2 hub SS27
- [ ] Peer: клик → factory queue с тем же `demo-ss27-01`
