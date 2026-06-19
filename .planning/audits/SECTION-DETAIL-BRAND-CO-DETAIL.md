# SECTION-DETAIL — brand-co-detail (Карточка заказа)

> **Роль:** бренд · столп 3 «Приём заказов» · order 2  
> **Оценка:** 7.4 (live) · UAT e2e core-01/02  
> **Peer:** brand-op-chain, brand-op-dossier (тот же URL + `?pillar=order_production`)  
> **URL:** `/brand/b2b-orders/B2B-DEMO-SHOP1-SS27`

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| Факты PG + строки матрицы | Shop amend write |
| Chain card + confirm/handoff | MES advance |
| Досье W2 до передачи | PO production strips без pillar |
| Cross-links: реестр, ритейлеры, чат | |

## 2. Cross-role

```
shop checkout → brand-co-detail (confirm, handoff, dossier check)
       ↓
handoff → brand-op-chain / mfr queue
       ↓
shop tracking read
```

## 3. Хорошо / плохо

| ✅ | ⚠️ |
|----|-----|
| Chain первым блоком | Дубль с brand-op-* на одном URL |
| `brand-co-detail-context-strip` | Pre-orders вне golden |
| Production UI скрыт без pillar | Нет inline confirm API |
| Досье + diff после handoff | |

## 4. Волна 84

- `brand-co-detail-panel`, context strip, cross-links
- `usePlatformCoreOrderDetailPillarId` — shared hook
- PO/chain production strips только при `?pillar=order_production`

## 5. P1+

- Prebook seed e2e
- Server-side confirm без scroll к handoff
