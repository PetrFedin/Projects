# Design System (UI UX Pro Max)

Design system for **Synth-1 Fashion OS** is generated and maintained with [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).

- **Master:** [synth-1-fashion-os/MASTER.md](synth-1-fashion-os/MASTER.md) — global colors, typography, components, anti-patterns.
- **Page overrides:** [synth-1-fashion-os/pages/](synth-1-fashion-os/pages/) — optional per-page overrides (e.g. `dashboard.md`).

Implementation: `src/design/tokens.json` + `tailwind.config.ts`. Cursor rule `.cursor/rules/ui-ux-design-system.mdc` enforces use of this design system for all UI/UX work in the repo.

To regenerate or add a page:
```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Synth-1 Fashion OS" [--page "page-name"]
```
