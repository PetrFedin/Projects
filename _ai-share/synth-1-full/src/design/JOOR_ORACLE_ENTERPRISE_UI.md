# JOOR + Oracle enterprise fashion dashboard — полный бриф для Cursor

Стек: **shadcn/ui**, **Radix**, **Tailwind**, **@tanstack/react-table**, **recharts**, **lucide-react**. Примитивы: `@/components/design-system`.

---

Act as a Senior Enterprise UI Architect, Fashion B2B Dashboard Designer, and Frontend Refactoring Engineer.

IMPORTANT:
This project already exists.
It already has pages, routes, sections, navigation, business logic, and backend modules.

Your task is NOT to redesign the application from scratch.
Your task is to transform the UI so it feels like a premium Fashion B2B operating platform in the style of:

- JOOR
- Oracle enterprise dashboards
- high-end merchandising / planning systems

You must preserve:

- existing pages
- existing navigation
- existing routes
- existing workflows
- existing product structure

You must NOT:

- break routing
- remove sections
- rebuild the application from scratch
- introduce random design ideas
- create inconsistent one-off components

All improvements must be:

- additive
- consistent
- enterprise-grade
- compact
- workflow-friendly

==================================================
GLOBAL DESIGN GOAL
==================================================

The product should feel like a serious fashion commerce and planning platform.

Target UI qualities:

- dense and professional
- structured and business-like
- premium but restrained
- clear hierarchy
- easy to scan quickly
- optimized for daily work
- suitable for analytics, planning, buying, showroom, and order workflows

The UI must combine:

JOOR qualities:

- clean wholesale presentation
- elegant product/showroom blocks
- buyer-friendly browsing
- polished brand-facing sections

Oracle dashboard qualities:

- compact KPI areas
- dense tables
- strong business hierarchy
- planning panels
- analytics widgets
- operational control feeling

==================================================
VISUAL STYLE RULES
==================================================

The visual language must be:

- clean
- structured
- restrained
- premium
- compact
- enterprise

Avoid:

- playful startup visuals
- oversized cards
- decorative gradients
- unnecessary shadows
- excessive roundness
- visual clutter
- too many colors
- too much whitespace

Prefer:

- subtle surfaces
- strong alignment
- compact containers
- calm spacing
- readable data hierarchy
- information-first design

==================================================
LAYOUT SYSTEM
==================================================

Create or refine a reusable layout system with these primitives:

1. PageContainer — max width, responsive padding, title/actions/toolbar/content.
2. SectionContainer — title, optional subtitle, right actions, compact header.
3. DashboardGrid — responsive KPI / analytics / planning rows, dense but readable.
4. DataPanel — tables; filters + actions on top; enterprise look.
5. PlanningPanel — budgets, assortment, targets, seasonal planning, KPI + controls.
6. CommercePanel — showrooms, linesheets, orders, buyer/brand blocks.

==================================================
COMPONENT SYSTEM
==================================================

Standardize: PageHeader, SectionHeader, KPIWidget, MetricCard, AnalyticsCard, PlanningCard, DataTableContainer, FilterToolbar, StatusBadge, InsightPanel, EmptyState, LoadingState, ErrorState.

Same spacing family, border treatment, title hierarchy, action alignment.

==================================================
DESIGN TOKENS
==================================================

Spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48. Radius: 6, 8, 12.

Typography roles: page title, section title, KPI number, card title, body, caption, table header/cell.

Hierarchy: page title strong; section clear; KPI stands out; metadata quiet; secondary never competes with primary.

==================================================
COLOR AND SURFACE RULES
==================================================

Neutral surfaces, strong text contrast, one main accent, subtle status colors. Status: success, warning, danger, info, neutral. Cards: subtle borders, no loud fills, operational premium feel.

==================================================
TABLES — ORACLE STYLE
==================================================

Compact rows, strong headers, numeric alignment, right-aligned actions, sticky header when useful, hover optional. Support search, filters, sort, pagination, empty/loading/error. Analytics/planning: grouped headers, dense comparison columns, status/trend badges. Use DataTableContainer.

==================================================
DASHBOARDS — ORACLE + JOOR STYLE
==================================================

Rows: (1) KPI — orders, brands, GMV, sell-through, budget, inventory risk, collection, showroom. (2) Analytics — bars, histograms, trends, category/brand. (3) Planning — budget, assortment, OTB, reorders, approvals. (4) Operational — draft orders, appointments, buyer/brand tasks, approval queue. Blocks compact and information-dense.

==================================================
CHARTS / HISTOGRAMS
==================================================

Enterprise analytical, not decorative. Shared containers: bar, histogram, line, stacked bar, KPI sparkline. Clean labels, restrained legends, compact titles, optional insight footer, no decoration clutter.

==================================================
JOOR-STYLE WHOLESALE PAGES
==================================================

Showrooms, collections, linesheets, buyer/brand workspace: polished cards, strong product metadata, image/info/action layout, buyer scanability, premium calm hierarchy — aligned with dashboard system.

==================================================
PLANNING PAGES
==================================================

Oracle-style: summary KPIs on top, compact planning controls, dense tables, charts visible, exception alerts, decision-first layout.

==================================================
FILTERS / TOOLBARS
==================================================

[Search] [Filter] [Segment] [Date/Season] [Sort] … [Primary Action]. Dense horizontal rows; one primary action per toolbar.

==================================================
FORMS
==================================================

Structured, grouped fields, consistent labels, calm dense spacing, clear validation — no oversized whitespace.

==================================================
ICONS / TYPOGRAPHY
==================================================

Single icon set (Lucide), single UI font, icons only for clarity. Business-grade readable type for data-heavy screens.

==================================================
IMPLEMENTATION STACK
==================================================

Shared layout primitives, dashboard widgets, table shell, chart wrappers, badge system. One enterprise table shell; shared chart cards.

==================================================
WORKFLOW
==================================================

Inspect UI → weak dashboard vs weak wholesale → propose JOOR+Oracle refinements → safe incremental implementation → reuse patterns → visual QA.

==================================================
OUTPUT FORMAT
==================================================

Return: (1) existing UI (2) unchanged (3) layout system (4) JOOR improvements (5) Oracle improvements (6) tables (7) charts (8) reusable components (9) files created (10) files updated (11) stronger UX. Then stop.

---

## Короткое дополнение (после основного промпта)

Use a premium enterprise B2B style. Prioritize: compact dashboards, dense analytics tables, structured planning panels, polished showroom cards, clean KPI widgets. Do not redesign the application. Only improve and standardize what already exists.

## Библиотеки

shadcn/ui, Radix UI, Tailwind CSS, @tanstack/react-table, recharts, lucide-react.
