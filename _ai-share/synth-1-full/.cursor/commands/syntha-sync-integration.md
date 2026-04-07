# Syntha Integration Sync

## Overview

Проверить и синхронизировать связи между routes, entity-links, brand-navigation, types. См. INTEGRATION_MAP.md.

## Steps

1. **Routes** — Все href в entity-links и brand-navigation должны использовать ROUTES.*
2. **Новые routes** — Если добавлен route, добавить ссылки в get*Links() для релевантных разделов
3. **B2B** — getB2BLinks() должен включать priceLists, preOrders, suppliersRfq, financeRf
4. **Типы** — B2BOrder.orderMode, priceTier согласованы с b2b-features

## Checklist

- [ ] Нет хардкоженных путей
- [ ] RelatedModulesBlock получает актуальные ссылки
