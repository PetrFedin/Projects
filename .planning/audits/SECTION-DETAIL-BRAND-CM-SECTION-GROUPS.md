# SECTION-DETAIL — brand-cm-section-groups (Группы по разделам)

> **Роль:** бренд · столп 5 · order 5  
> **Оценка:** static 7.5 · live 8.1  
> **URL:** `/brand/core?pillar=comms&collection=SS27&section=brand-co-registry`  
> **SoT:** `platform-core-readiness-sections.ts` → `SECTION_AUDIT.brand.comms[4]`

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| Section-groups picker + deep-link `?section=` | CRM массовых рассылок |
| PG read-state / unread на chip | AI-бот заказа |
| Auto-thread по section context | Дубль universal inbox |

**Summary:** Section-groups: clean PG four-role deep-link + PG read SoT (волна 22).

## 2. Cross-role

```
brand-cm-section-groups ↔ shop-cm-order-chat (тот же B2B order thread)
                        ↔ mfr-cm-order / sup-cm-order
                        → brand-co-registry (default section anchor)
```

## 3. Good (из SECTION_AUDIT)

- brand-cm-section-groups-picker UI
- Deep-link ?pillar=&section= (core-21 e2e)
- Clean PG B2B-\d+ deep-link 4 roles (core-40)
- Section contextual auto-thread (core-30)
- Order detail / tracking chat → section deep-link (core-46)
- Registry SSE bump на contextual message (волна 15)
- comms-pillar-sse-live-badge на hub (core-35)
- Unread badge на section-group chip (волна 16)
- Section visit cursor local + POST section-read-state (волна 18–21)
- PG mirror в workshop2_contextual_read_state (b2b_order_section)
- PG-primary skip file mirror (волна 22)
- Audit guard comms-canon
- Исключение meta-section из picker

## 4. Bad / Fix

| Bad | Fix |
|-----|-----|
| Calendar tasks still memory-only when PG URL unset in dev | PG calendar task store prod (волна 23 migration 030) |

## 5. P1 / UAT

- [ ] UAT: chip unread сбрасывается после visit + POST read-state
- [ ] UAT: deep-link из tracking → `section=shop-co-buyer-tracking` на shop
- [ ] E2E: core-21 four-role section deep-link
