# SECTION-DETAIL — shop-sc-partners (Каталог партнёров)

> **Роль:** магазин · столп 2 · order 2  
> **Оценка:** 7.5 (live)  
> **URL:** `/shop/b2b/partners/discover`

## 1. Зачем магазину

| Обязательно | Не нужно |
|-------------|----------|
| Список подключённых брендов + коллекции | Brand publish / unpublish |
| CTA: витрина, матрица per brand | Factory dossier |
| Invite для неподключённых (чат) | Production handoff |
| Hub-навигация к заказу коллекции | Supplier procurement |

## 2. Cross-role

```
shop-sc-partners → shop-sc-showroom → shop-sc-matrix → shop-co-checkout
       ↑ read
brand retailers / brand-sc-showroom (peer)
```

## 3. Что работает

- PG partnerships API + fallback catalog
- `shop-sc-partners-panel` + context strip (showroom/matrix/checkout/registry)
- Per-brand cards с collection badges
- Connected: showroom + matrix CTA; disconnected: invite chat

## 4. Слабые стороны / P1

- Invite — демо через messages, нет полного onboarding
- Не все бренды в каталоге с коллекциями
- UAT partners→showroom→matrix path

## 5. Волна 89

- Убран тупик «Мои заказы» → `shopB2bOrdersCollectionRegistryHref()`
- Дублирующие top-buttons заменены context strip
- Канон testids `shop-sc-partners-*`
- liveScore 7.3 → 7.5
