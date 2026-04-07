# Syntha B2B Feature

## Overview

Добавить новую B2B фичу по FEATURE_BENCHMARK.md и INTEGRATION_MAP.md.

## Steps

1. **Тип** — Добавить в src/lib/b2b-features/types.ts при необходимости
2. **Route** — Добавить в src/lib/routes.ts
3. **Ссылки** — Добавить в getB2BLinks() или соответствующую функцию в entity-links.ts
4. **Навигация** — Добавить в brand-navigation.ts если нужно
5. **Feature flag** — Добавить в b2b-features/feature-config.ts
6. **INTEGRATION_MAP** — Обновить секцию B2B Feature → Routes

## Checklist

- [ ] Route добавлен
- [ ] Entity-link добавлен
- [ ] Типы/константы в b2b-features при необходимости
