# SECTION-DETAIL — sup-dev-comms-peer (Чат · уточнение цены)

> **Роль:** supplier · столп 1 · order 3  
> **Оценка:** static 7.0 · live 7.3  
> **URL:** `/factory/supplier/messages?contextType=workshop2_article&contextId=SS27%3Ademo-ss27-01`  
> **SoT:** `platform-core-readiness-sections.ts` → `SECTION_AUDIT.supplier.development[2]`

## 1. Зачем поставщику

| Обязательно | Не нужно |
|-------------|----------|
| Article-price-quote шаблон | RFQ legacy forms |
| sup-cm-article-chat-link unified | Дубль полного inbox столпа 5 |
| Workshop2 article context thread | Brand handoff UI |

**Summary:** Alias entry sup-cm-article (столп 1 development).

## 2. Cross-role

```
sup-dev-comms-peer ↔ brand-cm-article-chat (W2 article thread)
                   ↔ mfr-cm-article
                   → sup-dev-materials (price context)
```

## 3. Good (из SECTION_AUDIT)

- RFQ→[] в core
- sup-cm-article-chat-link unified (волна 69)
- Шаблон article-price-quote (волна 45)

## 4. Bad / Fix

| Bad | Fix |
|-----|-----|
| Дубль nav столп 1 vs 5 (осознанный alias) | SLA timer P2 |
| Нет SLA ответа | — |

## 5. P1 / UAT

- [ ] UAT: шаблон «уточнение цены» вставляется в тред
- [ ] UAT: context banner показывает article + collection SS27
- [ ] Cross-nav: materials → messages с тем же contextId
