# B2B РФ: связи модулей

## Lib (`src/lib/b2b/`)

| Модуль | Связи |
|--------|--------|
| `customer-groups` | → price tier, net days, first order %, VAT |
| `price-lists` | `customerGroupIds` + `getPriceWithPromotions(..., group)` |
| `volume-discounts` | `customerGroupIds` + `getVolumeDiscountRules(..., group)` |
| `net-terms`, `first-order-discount`, `vat-exemption` | РФ финансы |
| `company-accounts` | Юрлицо + роли, группа, НДС |
| `rma-workflow` | `returns-claims` |
| `multi-location-inventory` | ERP |
| `trade-show-*` | Календарь ↔ запись байера |
| `consolidated-order-draft` | Мультибренд |

## Routes

`customerGroups`, `companyAccounts`, `financeRf`, `inventoryMultiLocation`, `priceLists`, `tradeShows`, `b2bTradeShowAppointments`, `integrationsErpPlm`.
