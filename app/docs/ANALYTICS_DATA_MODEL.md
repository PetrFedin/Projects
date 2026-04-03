# Fashion Planning & Procurement Analytics — Data Model & Architecture

## 1. Current project analysis

### Existing product/SKU models

- **Product/catalog:** `ShowroomItem`, `LinesheetItem` (product_name, sku, brand_name, color, size_range, wholesale_price). No central `products` table; SKU used as business key across order items, inventory, linesheets.
- **Tech pack / SKU:** `TechPackVersion`, `ProductDimension`, `SKUProductionArchive`, `SKUSalesSync` (product.py). `FinishedGoodsStock` (inventory) has sku_id, color, size, warehouse_id, qty_on_hand.

### Existing orders

- **Order:** `Order` (organization_id, buyer_id, status, total_amount, items_json), `OrderItem` (order_id, sku, quantity, wholesale_price). B2B: `B2BDiscount`, `OrderLog`, `WholesaleMessage`, `CreditLimit`, `SeasonalCredit`, `Linesheet` (wholesale).

### Existing inventory

- **Finished goods:** `FinishedGoodsStock` (sku_id, warehouse_id, qty_on_hand, qty_allocated). **Store:** `StoreInventory` (store_id, sku_id, quantity). **Raw:** `FabricRoll`, `MaterialLot`, `RawMaterialTransaction`, `StockAllocation`.

### Existing collections / seasons

- **Collections:** `CollectionDrop`, `Lookbook` (brand_id, season). **Seasons:** Referenced as string (e.g. season in Linesheet, Showroom, FinanceBudget). No central `seasons` table.

### Existing analytics tables

- **Retail:** `CategorySellThrough` (brand_id, category, sold_qty, stock_initial, sell_through_pct). `POSTransaction` (store_id, items_json, total_amount). **Intelligence:** `DemandForecast` (organization_id, sku_id, season, predicted_demand), `SizeCurve` (sku_id, region, curve_json), `RegionalPerformance` (region, total_sales, order_count). **Finance:** `FinanceBudget` (brand_id, season, budget_type, limit_amount, spent_amount).

### Existing dashboards (frontend synth-1)

- Brand: analytics-bi, finance (BudgetControl, BudgetVsActual), planning (AssortmentPlanningGrid), showroom (PlanningDashboard). Shop: B2B budget, margin analysis. Components: B2BFinancialPerformance, SkuAnalytics.

### Summary

| Area | Exists | Reuse / extend |
|------|--------|-----------------|
| Products/SKUs | SKU as key in OrderItem, ShowroomItem, FinishedGoodsStock, StoreInventory | Reuse sku_id, store_id, brand_id, season as business keys; no FK to existing tables |
| Orders | Order, OrderItem | ETL into fact_orders |
| Inventory | FinishedGoodsStock, StoreInventory | ETL into fact_inventory, snapshot_inventory |
| Collections/Seasons | String season in budget, linesheet, lookbook | dim_seasons, dim_collections as reference |
| Analytics | CategorySellThrough, DemandForecast, SizeCurve, FinanceBudget | Keep; add analytics_* as warehouse layer fed by ETL |
| Dashboards | analytics-bi, finance, planning, B2B | Feed from new analytics API (Phase 2+) |

**Missing for analytics:** Central dimension and fact layer for reporting; snapshot tables for sell-through, budget, assortment, category/brand performance; metrics catalog and API layer (Phase 2+).

---

## 2. Analytics architecture

- **Dimension tables:** Stable reference (products, SKUs, brands, categories, collections, seasons, stores, regions, suppliers, buyers). Attributes + metadata; SCD-style valid_from/valid_to where needed.
- **Fact tables:** Append-only events (sales, orders, inventory snapshots, purchases, returns). Link by business keys (sku_id, store_id, etc.).
- **Snapshot tables:** Periodically computed state (sell-through, inventory, budget, assortment, category/brand performance). Used for dashboards and planning.
- **Metrics layer (Phase 2):** Reusable metrics (sellthrough_rate, inventory_turn, gross_margin, etc.) defined in code/API; computed from facts and snapshots.

Relationships: Facts and snapshots reference dimensions by business key (e.g. sku_id, brand_id, season_id). No FK constraints to existing operational tables; ETL jobs populate from Order, OrderItem, FinishedGoodsStock, StoreInventory, POSTransaction, FinanceBudget, CategorySellThrough, etc.

---

## 3. Dimension tables

| Table | Business key | Purpose |
|-------|--------------|---------|
| analytics_dim_products | product_id | Product master (name, category, brand, collection) |
| analytics_dim_skus | sku_id | SKU master (product, color, size, category, brand, season) |
| analytics_dim_brands | brand_id | Brand master |
| analytics_dim_categories | category_id | Category hierarchy |
| analytics_dim_collections | collection_id | Collection (season, brand) |
| analytics_dim_seasons | season_id | Season (e.g. FW26, SS27; optional start/end date) |
| analytics_dim_stores | store_id | Store (region) |
| analytics_dim_regions | region_id | Region hierarchy |
| analytics_dim_suppliers | supplier_id | Supplier master |
| analytics_dim_buyers | buyer_id | Buyer (org/user) |

All have: id (PK), name, attributes (JSON), metadata_json; dimensions that can change over time have valid_from, valid_to, is_current.

---

## 4. Fact tables

| Table | Key fields | Purpose |
|-------|------------|---------|
| analytics_fact_sales | sku_id, store_id, sale_date, units_sold, revenue, discount, margin | Sales transactions (from POS/orders) |
| analytics_fact_orders | order_id, brand_id, buyer_id, season_id, order_date, order_value, order_units | B2B order summary |
| analytics_fact_inventory | sku_id, warehouse_id, snapshot_date, stock_units, stock_value, reserved_units | Daily inventory position |
| analytics_fact_purchases | purchase_order_id, supplier_id, brand_id, sku_id, purchase_date, cost, units | Procurement |
| analytics_fact_returns | sku_id, store_id, return_date, return_units, return_value | Returns |

Relationships: All reference dimensions by business key (e.g. sku_id → dim_skus.sku_id). source_id / order_id link back to operational system for traceability.

---

## 5. Snapshot tables

| Table | Key fields | Purpose |
|-------|------------|---------|
| analytics_snapshot_sellthrough | sku_id, season_id, store_id?, snapshot_date, sold_units, received_units, sellthrough_rate, days_on_sale | Sell-through by SKU/season |
| analytics_snapshot_inventory | sku_id, warehouse_id, snapshot_date, stock_units, stock_value, weeks_of_supply | Inventory position for planning |
| analytics_snapshot_budget | brand_id, season_id, category_id?, snapshot_date, planned_budget, actual_spend, remaining_budget, utilization_pct | Budget vs actual |
| analytics_snapshot_assortment | store_id?, category_id?, season_id, snapshot_date, option_count, total_units, target_* | Assortment planning state |
| analytics_snapshot_category_performance | category_id, brand_id?, season_id, store_id?, snapshot_date, revenue, units_sold, sellthrough_pct, margin_pct | Category performance |
| analytics_snapshot_brand_performance | brand_id, season_id, region_id?, snapshot_date, revenue, order_count, order_units, sellthrough_pct, margin_pct | Brand performance |

Snapshot logic: Run periodically (e.g. nightly or weekly). Aggregate from fact_sales, fact_orders, fact_inventory and from operational tables (FinanceBudget, CategorySellThrough); write current state into snapshot_* for fast dashboard queries.

---

## 6. Buying analytics module design (Phase 2)

- **Engine:** buying_analytics_engine — category performance, brand performance, sell-through monitoring, overstock/underperforming SKU detection, margin analysis.
- **API:** `/analytics/categories`, `/analytics/brands`, `/analytics/sku-performance`, `/analytics/sellthrough`. Queries: aggregate from fact_sales, fact_orders, snapshot_sellthrough, snapshot_category_performance, snapshot_brand_performance.

---

## 7. Budget module design (Phase 2)

- **Tables (optional extension):** budget_plans, budget_allocations, budget_spend, budget_controls — or keep using existing FinanceBudget and snapshot_budget for “plan vs actual”.
- **Logic:** Allocation by season/category/brand; overspend detection; utilization dashboards.
- **API:** `/budgets`, `/budgets/allocation`, `/budgets/status`.

---

## 8. Assortment planning design (Phase 2)

- **Tables (optional):** assortment_plans, assortment_targets, assortment_allocations, assortment_rules — or snapshot_assortment + new plan tables.
- **Logic:** Option count, depth, size curve, store-level assortment.
- **API:** `/assortment/plans`, `/assortment/recommendations`.

---

## 9. Forecasting architecture (Phase 2)

- **Engine:** forecast_engine; tables: forecast_demand, forecast_sellthrough, forecast_reorder (or reuse DemandForecast and extend).
- **Features:** SKU demand prediction, reorder prediction, inventory risk. ML-friendly: feature generation from fact_sales, fact_inventory, snapshot_sellthrough.

---

## 10. Dashboard metrics layer (Phase 2)

- **metrics_catalog:** sellthrough_rate, inventory_turn, gross_margin, sellthrough_velocity, weeks_of_supply, stock_coverage. Implemented as functions/views over facts and snapshots; reused across Executive, Buying, Brand, Category, SKU dashboards.

---

## 11. Implementation plan

- **Phase 1 (done):** Analytics data model — dimension, fact, snapshot tables; migration creates analytics_* only.
- **Phase 2:** Buying analytics engine + API; ETL from Order, OrderItem, StoreInventory, POSTransaction, FinanceBudget, CategorySellThrough into facts/snapshots.
- **Phase 3:** Budget planning API and allocation logic.
- **Phase 4:** Assortment planning API and rules.
- **Phase 5:** Forecasting engine and forecast tables/API.

---

## 12. Phase 1 implementation

- **Created:** `app/db/models/analytics.py` (all dimension, fact, snapshot tables).
- **Registered:** In `app/db/models/base.py` and `app/db/models/__init__.py`.
- **Migration:** `app/db/migrations/create_analytics_tables.py` — creates only analytics_* tables (checkfirst=True). Run from repo root: `python3 -m app.db.migrations.create_analytics_tables`.
- **Existing tables:** Unchanged. No FK from analytics_* to existing schema; reference by business keys only.

---

## 13–16. Files created / updated / migrations / next phase

- **Files created:** `app/db/models/analytics.py`, `app/db/migrations/create_analytics_tables.py`, `app/db/migrations/README.md`, `app/docs/ANALYTICS_DATA_MODEL.md`.
- **Files updated:** `app/db/models/base.py` (imports + __all__), `app/db/models/__init__.py` (from .analytics import *).
- **Migrations created:** One script creating 21 analytics tables (10 dim, 5 fact, 6 snapshot).
- **Next phase recommendation:** Phase 2 — ETL jobs to populate fact_* and snapshot_* from Order, FinishedGoodsStock, StoreInventory, POSTransaction, FinanceBudget, CategorySellThrough; then buying analytics API endpoints and dashboard wiring.
