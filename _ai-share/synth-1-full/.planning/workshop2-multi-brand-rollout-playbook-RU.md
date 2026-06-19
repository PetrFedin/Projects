# Workshop2 — Multi-brand rollout playbook (RU)

**Wave 56** — масштабирование после investor freeze Wave 55.

## 1. Tenant registry

1. Подготовьте `WORKSHOP2_BRAND_TENANT_REGISTRY_JSON` (см. `workshop2-brand-tenant-registry.ts`):
   ```json
   [
     { "brandId": "brand-a", "tenantId": "tenant-a", "labelRu": "Brand A SS27", "active": true },
     { "brandId": "brand-b", "tenantId": "tenant-b", "labelRu": "Brand B SS27", "active": true }
   ]
   ```
2. Staging: скопируйте в `.env.local`, проверьте `GET /api/workshop2/integration-probes` → brand registry checks.
3. Production: vault secret + cutover checklist ops signoff.

## 2. Rep switcher (B2B portal)

1. Rep входит с `repId` query на rep routes (`/api/shop/b2b/rep/share-link`, appointments).
2. При смене бренда — новая cart session per `brandId` (gate mixed-brand 409).
3. Offline pack: `GET /api/shop/b2b/rep/offline-pack?repId=...&brandId=...` перед выездом.

## 3. Split checkout (multi-brand cart)

1. UI: `B2bMultiBrandSplitCheckoutBanner` — раздельные заказы per brand.
2. API: `splitWorkshop2B2bCartByBrand` (Wave 33) — не смешивать brandId в одной сессии.
3. Export: `GET /api/shop/b2b/orders/export?tenantId=` — scope по tenant registry.

## 4. Rollout checklist

- [ ] Registry JSON в staging + prod vault
- [ ] UAT ops+product signoff (Wave 55 freeze)
- [ ] `node scripts/workshop2-wave55-ops-applied-checklist.mjs` → status JSON
- [ ] Pilot tenant: 1 brand → 2 brands → N
- [ ] Мониторинг: probe `wave56PostFreezeReady` ≥10

## 5. Откат

- Деактивировать brand: `"active": false` в registry JSON
- Перезапуск без деплоя: env reload / process restart
