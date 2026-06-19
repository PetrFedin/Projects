# SECTION-DETAIL — mfr-op-dossier (Досье · техзадание)

> **Роль:** цех · столп 4 «Выпуск» · order 3  
> **Оценка:** 7.6 (live) · UAT e2e core-01/02  
> **Peer:** brand-op-dossier (write W2), mfr-op-production-orders, sup BOM  
> **URL:** `/factory/production/dossier/[articleId]?pillar=order_production&order=…`

## 1. Зачем цеху

| Обязательно | Не нужно |
|-------------|----------|
| Read-only ТЗ/BOM для выпуска | Редактирование brand W2 |
| Version label при handoff | Shop amend |
| Cross-links: PO, queue, procurement | Bulk handoff write (brand) |
| Печать для цеха | Полноценный shop-floor PDF (P1) |

## 2. Cross-role поток

```
brand W2 dossier → handoff → dossierVersionAtHandoff в PO
       ↓
factory dossier read (HTML export) + pins/comments
       ↓
prod-orders / procurement / shop tracking (peer read)
```

## 3. Хорошо / плохо (честно)

| ✅ | ⚠️ |
|----|-----|
| Один экран, два pillar (`development` vs `order_production`) | Sample queue только в development pillar |
| chain-status version + changed badge | Shop-floor PDF bundle — P1 |
| Context strip + print | Accept/reject TZ — demo UX без PG persist |

## 4. Было сломано / шум (волна 60)

| Проблема | Фикс |
|----------|------|
| Chrome всегда pillar development | `?pillar=order_production` |
| resolveHref без order context | `factoryProductionDossierContextHref` |
| Нет version label | `mfr-op-dossier-version-badge` из chain-status |
| Prod-orders «Досье» без pillar | context href + testid |
| Hub link без pillar | `mfr-op-dossier-hub-link` + pillar query |
| Нет print | `mfr-op-dossier-print-btn` |

## 5. Волна 60 — сделано

- `factoryProductionDossierContextHref`, `factoryCoreOrderProductionCabinetHref`
- `mfr-op-dossier-context-strip` + version/changed badges
- FactoryDossierCoreChrome pillar-aware back link
- SECTION_AUDIT + core-01 asserts

## 6. P1+

- Shop floor PDF export (не только window.print)
- Persist accept/reject TZ в PG
