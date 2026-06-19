# Agents — Product Switcher

Project-scoped Cursor subagents registry. Files live in `.cursor/agents/*.md` (YAML frontmatter + prompt body per [Cursor subagents docs](https://cursor.com/docs/subagents.md)).

## Quick invoke

Use `/agent-name` in chat or natural language: *"Use the gsap-reviewer subagent on logo-animation.js"*.

| Command | Agent |
|---------|-------|
| `/ui-verifier` | Visual & interaction checklist in browser |
| `/gsap-reviewer` | GSAP timeline quality & reduced-motion |
| `/a11y-reviewer` | Accessibility audit (WCAG 2.2 AA practical) |
| `/feature-integrator` | Cross-feature sync: switcher ↔ video ↔ logo |
| `/verifier` | Goal-backward: claimed done vs actually works |
| `/code-reviewer` | JS/CSS/HTML quality & conventions |
| `/browser-tester` | Live browser MCP test runner |
| `/docs-writer` | Sync README.md + AGENTS.md with codebase |

## Agent registry

### Verification & QA

| Agent | When to call | Mode |
|-------|--------------|------|
| **verifier** | After phase complete, before ship — skeptical end-to-end validation | readonly |
| **ui-verifier** | UI changes, before PR — nav, logo, 3 sections, switcher | inherit |
| **browser-tester** | Need live MCP proof — snapshots, clicks, scroll tests | inherit |
| **code-reviewer** | After JS/CSS/HTML edits — bugs, BEM, IIFE conventions | readonly |

### Specialists

| Agent | When to call | Mode |
|-------|--------------|------|
| **gsap-reviewer** | Changes to `scripts/logo-animation.js` or new GSAP tweens | readonly |
| **a11y-reviewer** | HTML structure changes, new interactive controls | readonly |
| **feature-integrator** | Refactoring `scripts/`, `SECTION_COUNT`, video pipeline | inherit |

### Documentation

| Agent | When to call | Mode |
|-------|--------------|------|
| **docs-writer** | New agent/rule/script — keep README + AGENTS in sync | inherit |

## Recommended workflows

### Before PR

```
Parallel: /ui-verifier + /gsap-reviewer + /a11y-reviewer + /code-reviewer
Then: /verifier
```

### After feature integration

```
/feature-integrator → /verifier → /docs-writer (if registry changed)
```

### Animation change

```
/gsap-reviewer → /ui-verifier (logo replay check)
```

## Rules (`.cursor/rules/`)

| Rule | alwaysApply | Globs |
|------|-------------|-------|
| **product-switcher.mdc** | ✅ true | `index.html`, `styles/**`, `scripts/**`, `assets/**`, `setup-video.sh` |
| **gsap-animation.mdc** | false | `scripts/logo-animation.js`, `scripts/**/*.js`, `index.html` |
| **html-structure.mdc** | false | `index.html`, `styles/**/*.css` |
| **video-media.mdc** | false | `scripts/main.js`, `setup-video.sh`, `assets/**`, `index.html` |

## Source layout

| File | Responsibility |
|------|----------------|
| `index.html` | Markup, GSAP CDN, script/style links |
| `styles/main.css` | All component styles (BEM) |
| `scripts/logo-animation.js` | `window.ProductSwitcherLogo` — hook timeline |
| `scripts/main.js` | `VIDEO_SRC`, wheel/thumb nav, video/fallback RAF loop |

**Script order:** GSAP CDN → `logo-animation.js` → `main.js`

## Official GSAP plugin skills

Installed via Cursor GSAP plugin. Available to all agents:

- `gsap-core`, `gsap-timeline`, `gsap-performance`
- `gsap-scrolltrigger` (optional — not loaded in CDN yet)
- `gsap-plugins`, `gsap-utils`, `gsap-react`, `gsap-frameworks`

## MCP (`.cursor/mcp.json`)

| Server | Used by | Purpose |
|--------|---------|---------|
| **agent-browser** | `ui-verifier`, `browser-tester`, `verifier` | Live browser automation (`npx agent-browser-mcp`) |
| **git** | — | Repo ops after `git init` (blocked: Xcode license on macOS) |

Cursor IDE also provides **cursor-ide-browser** globally — `browser-tester` prefers it when available.

No API keys in project MCP config.

## Hooks (`.cursor/hooks.json`)

`afterFileEdit` → `.cursor/hooks/format-html.sh` runs Prettier on `index.html`, `styles/`, `scripts/`.

## Editor / workspace

- `.editorconfig` — 2-space indent, LF
- `.vscode/settings.json` + `.cursor/settings.json` — format on save (Prettier)
- `product-switcher.code-workspace` — recommended extensions

## Verification commands

```bash
npm run lint          # HTMLHint
npm run format        # Prettier write
npm run verify        # lint + format check
npm run dev           # http://localhost:8765
```

## Agent run reports

Latest simulated agent run: `.cursor/AGENT-RUN-REPORT.md`
