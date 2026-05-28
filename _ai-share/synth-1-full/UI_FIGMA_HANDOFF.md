# UI Figma Handoff

## Purpose

Define a stable handoff structure for homepage UX updates in Sprint 1 and Sprint 2.

## File Structure in Figma

- `00_Cover`
- `01_Current_State`
- `02_Sprint_1_Quick_Wins`
- `03_Sprint_2_Role_Aware`
- `04_Personalization`
- `05_Smart_Search`
- `99_Locked_References`

## Naming Rules

- Frames: `HOME/<mode>/<section>/<state>`
  - Example: `HOME/B2C/HERO/default`
  - Example: `HOME/B2B/NAV/active-live`
- Components: `CMP/<group>/<name>/<variant>`
  - Example: `CMP/Nav/TopLink/live`
- Variables:
  - `color.*`
  - `space.*`
  - `radius.*`
  - `motion.*`

## Locked vs Editable

### Locked (do not redesign)

- `PARTNERS_b2c`
- `SHOWCASE_b2c`
- `LABORATORY_B2C`
- `MEDIA_ECOSYSTEM_b2c`

Rules:

- No changes to visual language, card proportions, or typography hierarchy.
- Only content-level edits are allowed (text/media updates), no style drift.

### Editable

- Header top navigation behavior and labels.
- Selector rows under ad banner (B2C categories and B2B section buttons).
- First-screen hierarchy, spacing rhythm, and CTA hierarchy.
- Compact mode for related links.
- Role-aware first-screen blocks (Sprint 2).
- Personalization widgets and smart search UX (Sprint 2).

## Design Checklist

- [ ] Navigation has no duplicate semantic entries.
- [ ] B2C/B2B switch behavior is explicit and predictable.
- [ ] One dominant action path per viewport.
- [ ] Motion does not reduce readability or border clarity.
- [ ] States defined: default, hover, active, disabled, loading, empty.

## Handoff Deliverables

- Annotated frame for each changed section.
- Component specs with spacing and state notes.
- Interaction notes for hover/focus/active behavior.
- Before/after comparison for Sprint 1 quick wins.
- Role matrix (client/shop/brand/factory/supplier/admin) for Sprint 2.

## Engineering Notes

- Keep existing route structure and role cabinet boundaries.
- Avoid introducing new visual primitives when current design-system ones exist.
- Keep locked sections as canonical visual references during all future updates.
