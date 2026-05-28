# UI Standard v1.0 (Operational Cabinets)

## Goal

Create one predictable, low-noise, high-throughput UX language across all internal profiles and cabinet sections:

- Brand
- Shop
- Distributor
- Factory
- Admin
- Client operational surfaces

Primary target: faster decisions, fewer errors, higher profit-impact visibility.

---

## Core Principles

1. One screen = one primary decision.
2. Show only context needed for the next action.
3. Critical vs secondary signals must be visually non-equal.
4. States must always answer: what happened, why, what to do next.
5. Layout and interaction patterns are consistent across roles; defaults vary by role.

---

## Page Skeleton (Mandatory)

Every operational page must follow this structure:

1. `Header 2.0`
2. `KPI Strip` (optional only if no measurable KPI exists)
3. `Context Bar` (filters, period, scope, reset)
4. `Main Work Surface` (table/cards/kanban/forms)
5. `System State Layer` (loading/empty/error/success)

Use:

- `RegistryPageShell` for root content spacing and width
- `RegistryPageHeader` for title/lead/actions
- `registryFeedLayout` tokens for typography/rhythm/table styles

Disallowed at root:

- `container mx-auto`
- ad-hoc `max-w-* mx-auto px-* pb-*` patterns

---

## Header 2.0 Rules

## Structure

- Left: title + one-line lead (why this screen exists)
- Right: max 2 exposed actions
  - 1 primary action
  - 1 secondary action
  - all others in overflow menu

## Content limits

- Title: max 56 chars
- Lead: max 110 chars, plain language, no marketing text
- No decorative cards inside header area

## Status chip

Exactly one summary status chip in header zone when relevant:

- `Healthy`
- `At Risk`
- `Blocked`
- `Attention Required`

---

## KPI Strip Rules

Show only 3-4 KPIs tied to business outcomes:

- Revenue / margin / sell-through / stock aging / SLA

Each KPI card must include:

1. Metric label
2. Current value
3. Trend (`+/- %` or delta)
4. Threshold state (`ok/warn/critical`)
5. Optional drill-down action

No more than one accent color per module. Status colors reserved for state semantics only.

---

## Table Toolbar Rules

Toolbar order (left to right):

1. Search
2. Scope filters (brand/season/channel/status)
3. Date/period
4. Saved preset selector
5. `Reset`
6. Bulk actions / export

Mandatory behavior:

- Sticky toolbar on long pages
- Sticky first column for operational tables
- Compact mode toggle for power users
- Saved filter presets per role
- Bulk actions visible only when rows selected

---

## Action Hierarchy Rules

Per screen:

- Exactly 1 dominant CTA
- Secondary actions = neutral buttons
- Destructive actions only in confirmation context

Per row (tables/cards):

- Max 2 inline actions
- Everything else in row overflow

Primary CTA must map to business intent:

- Create order
- Approve
- Publish
- Replenish
- Resolve dispute

---

## Empty/Error/Loading/Success States

## Loading

- Skeleton or progressive placeholders
- No layout shift
- If over 3s: show "still working" hint

## Empty

Must include:

1. Why empty (no data / filters too strict / no access)
2. Recommended next action
3. One direct CTA

Bad: "No data"
Good: "No active orders for this season. Clear filters or create a new order."

## Error

Must include:

1. Human-readable cause
2. Retry action
3. Fallback path (open docs/contact owner)
4. Optional error ID for support

## Success

- Quiet confirmation (toast or inline)
- Link to next best step if available

---

## Role-Based Default Views

Shared skeleton, role-specific defaults:

- Merch: assortment, sell-through, markdown impact
- Ops: SLA, blockers, cycle-time, exception queue
- Sales/B2B: open pipeline, conversion, at-risk orders
- Finance: margin bridge, overdue, landed cost variance
- Compliance: risk queue, due dates, unresolved violations

Role defaults can change:

- default tab
- default KPI set
- default filters

Role defaults must not change global pattern.

---

## Visual Discipline

- Uppercase only for short labels/chips, not long headings
- Reduce icon noise in dense rows
- Minimize heavy shadows in operational surfaces
- One accent color per module, consistent across tabs
- Typography hierarchy must clearly separate:
  - section title
  - control labels
  - data values
  - helper text

---

## Profitability Layer (Required for operational modules)

Each relevant module should expose at least one of:

- Revenue-at-risk widget
- Margin impact widget
- SLA delay cost signal
- Forecast confidence + fallback suggestion

And one `Next Best Action` block:

- "Do X now because Y risk/opportunity"

---

## Acceptance Checklist (Per File)

Page is compliant only if all are true:

- Uses `RegistryPageShell` or `OperationalPageChrome`
- Uses `RegistryPageHeader` pattern (or approved equivalent wrapper)
- Has one clear primary action
- Header/KPI/toolbar hierarchy is visually unambiguous
- Empty/error/loading states follow standard copy/CTA structure
- Table pages have sticky context + compact mode path
- No legacy root layout classes

---

## KPI for UX Rollout

Track before/after per module:

- Time-to-first-action
- Time-to-complete key task
- Misclick/rework rate
- % sessions with filter reset/rebuild
- % actions taken from next-best-action prompts

Target: lift internal UX from ~7.8 to 9.2 without visual overload.

