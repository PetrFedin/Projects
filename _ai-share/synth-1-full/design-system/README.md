# Design System (UI UX Pro Max)

Design system for **Synth-1 Fashion OS** is generated and maintained with [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).

- **Master:** [synth-1-fashion-os/MASTER.md](synth-1-fashion-os/MASTER.md) — global colors, typography, components, anti-patterns.
- **Figma spec pack (RU):** [synth-1-fashion-os/FIGMA_SPEC_PACK_RU.md](synth-1-fashion-os/FIGMA_SPEC_PACK_RU.md) — компоненты/variants, token map, чеклисты приемки, локализация и аббревиатуры.
- **Чеклист PR (кабинеты):** [synth-1-fashion-os/CABINET_PROFILE_PR_CHECKLIST_RU.md](synth-1-fashion-os/CABINET_PROFILE_PR_CHECKLIST_RU.md) — что отмечать в описании PR при изменениях UI кабинетов.
- **Аудит RegistryPageShell:** [synth-1-fashion-os/CABINET_REGISTRY_SHELL_AUDIT.md](synth-1-fashion-os/CABINET_REGISTRY_SHELL_AUDIT.md) — страницы без оболочки, приоритеты, команда `find`.
- **Implementation pack (RU):** [synth-1-fashion-os/IMPLEMENTATION_PACK_RU.md](synth-1-fashion-os/IMPLEMENTATION_PACK_RU.md) — конкретные файлы для `AcronymWithTooltip` и матрица кабинетов с расхождениями.
- **Page overrides:** [synth-1-fashion-os/pages/](synth-1-fashion-os/pages/) — optional per-page overrides (e.g. `dashboard.md`).

Implementation: `src/design/tokens.json` + `tailwind.config.ts`. Cursor rule `.cursor/rules/ui-ux-design-system.mdc` enforces use of this design system for all UI/UX work in the repo.

To regenerate or add a page:
```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Synth-1 Fashion OS" [--page "page-name"]
```
