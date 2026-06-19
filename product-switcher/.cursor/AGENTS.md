# Cursor Agent Discovery — Product Switcher

Index for Cursor subagent auto-delegation. Full registry: [`../AGENTS.md`](../AGENTS.md).

## Subagents (`.cursor/agents/`)

| name | description |
|------|-------------|
| `ui-verifier` | Visual & interaction checklist — 3 sections, logo, switcher, a11y. Browser MCP. |
| `gsap-reviewer` | GSAP timeline hygiene, reduced-motion, performance in logo-animation.js. |
| `a11y-reviewer` | ARIA, keyboard, focus, semantics, reduced-motion audit. |
| `feature-integrator` | Switcher ↔ video ↔ sections ↔ logo integration & constants alignment. |
| `verifier` | Goal-backward validation — done vs actually works. |
| `code-reviewer` | JS/CSS/HTML quality, BEM, conventions. |
| `browser-tester` | Browser MCP test runner (agent-browser / cursor-ide-browser). |
| `docs-writer` | README.md + AGENTS.md sync with codebase. |

## Invoke

```
/ui-verifier
/gsap-reviewer
/a11y-reviewer
/feature-integrator
/verifier
/code-reviewer
/browser-tester
/docs-writer
```

## Rules

See `.cursor/rules/*.mdc` — `product-switcher.mdc` always applies.

## MCP

`.cursor/mcp.json` — `agent-browser`, `git`.
