# B2B Catalog Role Capability Matrix

## Purpose

Define `B2B КАТАЛОГ` as a cross-role capability layer embedded into role cabinets, not as an isolated surface.

## Canonical Model

- `B2B КАТАЛОГ` = shared business process:
  - discover assortment
  - curate selection
  - create/approve order
  - execute fulfillment
  - control compliance and finance
- Every role sees the same entities with role-specific actions and permissions.
- Admin has full end-to-end supervision and audit.

## Role Matrix

| Role                 | Primary B2B goals                                                | Cabinet entry routes                                                                                    | Must-have capabilities                                                                 | Cross-role interactions                                                              |
| -------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Shop (buyer)         | Find brands/SKU, compose and place wholesale orders              | `/shop/b2b/catalog`, `/shop/b2b/discover`, `/shop/b2b/create-order`, `/shop/b2b/orders`                 | Catalog browsing, assortment planning, quick/grid/working order, docs/payment tracking | Creates order to Brand; sends change requests; tracks fulfillment from Brand/Factory |
| Brand (seller)       | Publish offer, manage terms, process inbound B2B demand          | `/brand/showroom`, `/brand/b2b/linesheets`, `/brand/b2b-orders`, `/brand/b2b/price-lists`               | Offer management, line sheets, approval workflow, shipments, partner account rules     | Receives orders from Shop/Distributor; hands execution to Factory/Supplier           |
| Production (factory) | Execute approved demand and confirm output/quality               | `/factory/production`, `/factory/orders`, `/factory/inventory`, `/factory/documents`                    | Order intake, production status, inventory allocation, quality checkpoints, docs       | Receives production tasks from Brand; status feeds back to Brand/Shop                |
| Supplier             | Provide materials and upstream availability/compliance           | `/supplier/circular-hub` (current), supplier-linked flows via Brand/Factory                             | Material readiness, compliance signals, circular traceability                          | Supports Factory/Brand availability and compliance states                            |
| Distributor          | Aggregate demand, support partner channels, coordinate contracts | `/distributor/orders`, `/distributor/matrix`, `/distributor/contracts`, `/distributor/brands`           | Multi-brand ordering, contract ops, territory/account handling, retailer coordination  | Bridges Shop demand and Brand supply; may operate as buyer proxy                     |
| Admin                | End-to-end control, policy enforcement, observability            | `/admin`, `/admin/audit`, `/admin/disputes`, `/admin/integrations`, `/admin/production/dossier-metrics` | Cross-role monitoring, override, audit trail, SLA/watchdog, integration governance     | Supervises all role transitions and exception flows                                  |

## Capability Coverage (Current vs Target)

### 1) Discover and selection

- Current:
  - Shop: strong coverage via `/shop/b2b/catalog`, `/shop/b2b/discover`, `/shop/b2b/selection-builder`.
  - Brand: strong coverage via showroom/line sheets in `/brand/*`.
- Target:
  - Keep both views role-specific but aligned by shared product/order identifiers.

### 2) Order composition and submission

- Current:
  - Shop: multiple order surfaces exist (`create-order`, `quick-order`, `grid-ordering`, `working-order`).
  - Brand: inbound order processing exists in `/brand/b2b-orders`.
- Target:
  - Promote one canonical buyer path and one canonical seller processing path.

### 3) Fulfillment and production handoff

- Current:
  - Brand has shipment and approval routes; Factory has production and order routes.
- Target:
  - Explicit status bridge between `/brand/b2b-orders` and `/factory/orders`/`/factory/production`.

### 4) Documents, finance, compliance

- Current:
  - Shop has `/shop/b2b/documents`, `/shop/b2b/payment`, `/shop/b2b/finance`.
  - Brand has `/brand/documents`, `/brand/finance`, `/brand/compliance`.
  - Admin has audit/compliance/disputes surfaces.
- Target:
  - Unified policy + event visibility for all transitions and overrides.

## UX Integration Rules (Required)

- B2B functionality must be visible inside each role cabinet sidebar and section hierarchy.
- Global top menu points to platform entry only; operational depth lives in role cabinets.
- No duplicate semantic entries in top-level navigation.
- Cross-role links must be contextual and permission-safe.

## Admin Control Requirements

- Unified cross-role timeline for order lifecycle and state transitions.
- Audit event visibility for create/update/approve/reject actions.
- Exception handling surfaces for disputes, SLA breaches, and integration failures.
- Read-only cross-cabinet drill-down + controlled override actions.

## Immediate Implementation Backlog

1. Build one canonical B2B navigation map per role (shop/brand/factory/supplier/distributor/admin).
2. Mark canonical route per lifecycle stage (discover, compose, approve, fulfill, close).
3. Add explicit cross-role jump links on order/entity detail pages.
4. Add admin “B2B lifecycle control” dashboard section wired to same entities.
5. Remove orphan/duplicate B2B entry points from global top navigation.

## Acceptance Criteria

- Every role can complete its B2B responsibilities from its own cabinet.
- Cross-role interactions are available via explicit, guarded links.
- Admin can observe and audit the full lifecycle without switching hidden contexts.
- No runtime navigation errors (`href`, duplicate keys) on B2B entry and related blocks.
