# UI Sprint Plan

## Scope and Constraints

- This plan covers homepage UX and global navigation behavior.
- Sprint 1 must avoid architecture rewrites and route migrations.
- Sprint 2 can introduce role-aware homepage behavior and personalization.
- B2B role capability canon: `B2B_CATALOG_ROLE_CAPABILITY_MATRIX.md`.
- The following sections are visual references and must remain unchanged:
  - `PARTNERS_b2c`
  - `SHOWCASE_b2c`
  - `LABORATORY_B2C`
  - `MEDIA_ECOSYSTEM_b2c`

## Sprint 1 — Quick UX Wins (No Architecture Break)

### A. Navigation and information architecture

- [ ] Keep stable B2C top menu: `АССОРТИМЕНТ`, `БРЕНДЫ`, `LIVE`, `ЛОЯЛЬНОСТЬ`.
- [ ] Keep B2B top menu as platform entry layer, not cabinet duplicates.
- [ ] Remove duplicate semantic entries across top navigation.
- [ ] Keep desktop/mobile nav labels synchronized.

Acceptance criteria:

- No duplicated top-level meaning in navigation.
- B2C/B2B switch changes only global top entries.
- No runtime warnings for menu links.

### B. Above-the-fold hierarchy

- [ ] Keep first-screen order: ad banner -> selector row -> primary content.
- [ ] Normalize vertical spacing rhythm in first two screen heights.
- [ ] Reduce competing animation accents in first viewport.

Acceptance criteria:

- Primary action path is understandable within 3 seconds.
- No overlap/jumps between header, selector row, and first section.

### C. Visual consistency and interaction polish

- [ ] Normalize button hierarchy (primary/secondary/ghost).
- [ ] Keep `LIVE` accent without border artifacts.
- [ ] Remove decorative effects that lower readability.

Acceptance criteria:

- Active/inactive states are clear and stable.
- No visual artifacts from animation on header controls.

### D. Related links noise reduction

- [ ] Use compact mode for related links (top set + expand).
- [ ] Drop invalid links before render.

Acceptance criteria:

- No `href` runtime errors in related blocks.
- Related blocks remain scannable and non-dominant.

## Sprint 2 — Role-Aware Home + Personalization + Smart Search

### E. Role-aware homepage

- [ ] Add role-specific first-screen modules for `client`, `shop`, `brand`, `factory`, `supplier`, `admin`.
- [ ] Keep one shared visual shell and vary only role content.

Acceptance criteria:

- Each role gets relevant first actions with minimal navigation.
- Shared style remains aligned with locked reference sections.

### F. Personalization

- [ ] Add `Continue where left off`.
- [ ] Add `Pinned modules`.
- [ ] Add `Recent activity`.

Acceptance criteria:

- Returning user can resume the last important flow in one click.
- Pinned modules persist between sessions for the same user.

### G. Smart global search

- [ ] Add one search entry point for brands, modules, orders, and SKU.
- [ ] Add quick actions directly from results.
- [ ] Define loading/empty/no-access states.

Acceptance criteria:

- Search returns mixed entity types with visible type labels.
- Keyboard flow works for open -> navigate -> submit.

## QA Checklist

- [ ] No React key warnings on main pages and sidebars.
- [ ] No `Link href=undefined` runtime errors.
- [ ] B2C/B2B switch is stable on desktop and mobile.
- [ ] Header and selector rows remain stable after hard refresh.
- [ ] Locked reference sections are visually unchanged.

## Rollout

### Sprint 1 rollout

- [ ] Product + design review.
- [ ] Smoke checks on `/`, `/u`, `/brand`, `/shop`.
- [ ] Release through normal deployment flow.

### Sprint 2 rollout

- [ ] Figma role variants approved.
- [ ] Incremental rollout by role.
- [ ] Track engagement and time-to-first-action.
