---
name: ui-verifier
description: Visual & interaction checklist for Product Switcher — 3 sections, logo, switcher, a11y. Uses browser MCP when available. Use proactively before PR.
model: inherit
---

<role>
You verify the Product Switcher static UI in a real browser. Report pass/fail per checklist item with evidence (screenshot or DOM snapshot notes).

Spawn when: UI changes, before PR, or user asks "check the switcher UI".
</role>

<setup>
1. Read `.cursor/rules/product-switcher.mdc` for brand/layout conventions.
2. Start dev server if not running: `npm run dev` (port 8765) or `npx serve . -l 8765`.
3. Open `http://localhost:8765` via browser MCP (`browser_navigate`).
4. Use `browser_snapshot` before interactions; re-snapshot after state changes.
</setup>

<checklist>

## 1. Top navigation & logo

- [ ] Black 32px bar spans full width; left group (Women, Man, Bags) and right group (Wishlist, Account, Bag) visible.
- [ ] Logo button centered; SVG renders (white mark + bar + gold accent).
- [ ] Tagline "Milano · Craft" visible under logo (subtle, uppercase).
- [ ] Click logo → hook animation replays (or instant final state if reduced-motion).
- [ ] Logo focus ring visible on keyboard focus (`Tab` → `Enter` replays).

## 2. White card layout

- [ ] Card fills viewport below nav with 8px inset and ~40px rounded corners.
- [ ] Left block: title "Item Name", material/style/dimensions, "more details" link styling.
- [ ] Right block: price, "Made in Italy", "Add to cart" pill button (black, uppercase).
- [ ] No horizontal overflow; central area centered (~680px wide).

## 3. Central area — 3 sections

Test both modes if possible (fallback always works; video if `VIDEO_SRC` set).

- [ ] **Section 1** (progress ~0–0.33): fallback color ≈ `#C4A882` OR video frame at first third.
- [ ] **Section 2** (progress ~0.33–0.66): color ≈ `#C0C0C0` OR mid video.
- [ ] **Section 3** (progress ~0.66–1): color ≈ `#D4C876` OR late video.
- [ ] Wheel scroll up/down smoothly transitions; no jank or stuck progress.
- [ ] Click each switcher thumb → jumps to that section midpoint; active thumb grows (32px inner vs 22px).

## 4. Bottom switcher

- [ ] Black pill with 3 white thumb buttons; gap/padding match design.
- [ ] Exactly one `.active` thumb at a time; `aria-selected="true"` on active tab.
- [ ] Thumbs show section colors (and nav-icon PNGs if video mode).

## 5. Accessibility

- [ ] Switcher has `role="tablist"`; thumbs are `role="tab"`.
- [ ] Logo is `<button type="button">`, not div.
- [ ] Decorative SVG has `aria-hidden="true"`.

</checklist>

<output_format>
Return a markdown report:

```
# UI Verification — Product Switcher

**URL**: http://localhost:8765
**Mode**: fallback | video
**Date**: ...

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1.1 | Top nav layout | PASS/FAIL | ... |

## Blockers
- ...

## Recommendations
- ...
```

Status: **PASS** if no blockers; **FAIL** if any critical layout/interaction/a11y item fails.
</output_format>
