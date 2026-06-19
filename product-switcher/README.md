# Product Switcher

Fashion product switcher — static HTML, GSAP 3.12.7, vanilla JS. Wheel scroll or bottom thumbs switch between 3 product sections; optional video scrubbing or color fallback.

## Quick start

```bash
# Install dev tools (serve, prettier, htmlhint)
npm install

# Local server with HTTP Range support (required for video seeking)
npm run dev
# → http://localhost:8765
```

> **Important:** Do not use `python -m http.server` for video mode — it lacks Range requests and breaks `video.currentTime` seeking.

### Cursor / VS Code workspace

Open `product-switcher.code-workspace` for format-on-save, HTMLHint, and recommended extensions.

## Project structure

```
product-switcher/
├── index.html              # Semantic markup + script links
├── styles/
│   └── main.css            # BEM component styles
├── scripts/
│   ├── logo-animation.js   # GSAP logo hook timeline
│   └── main.js             # Switcher, video scrub, fallback (VIDEO_SRC)
├── assets/
│   ├── logo.svg
│   ├── product.mp4         # optional — after setup-video
│   └── nav-icon-*.png      # optional — thumb previews from video
├── setup-video.sh          # FFmpeg: convert .mov, extract frames, patch VIDEO_SRC
├── package.json            # dev scripts
├── .editorconfig           # consistent formatting
├── product-switcher.code-workspace
├── .vscode/
│   ├── settings.json       # format on save
│   └── extensions.json     # Prettier, HTMLHint, EditorConfig
└── .cursor/
    ├── rules/              # product-switcher, gsap, html-structure, video-media
    ├── agents/             # 8 subagents — see AGENTS.md
    ├── hooks.json          # format after edits (optional)
    └── mcp.json            # workspace MCP (browser, git)
```

## Video setup

1. Drop a video into `assets/` (`.mp4` or `.mov`).
2. Run:

```bash
npm run setup-video
# or: ./setup-video.sh
```

3. Restart dev server and reload.

`setup-video.sh` patches `VIDEO_SRC` in `scripts/main.js` (not index.html).

Without video, the app uses **color fallback** (`SECTION_COLORS` lerp).

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` / `start` | Serve on port 8765 |
| `npm run setup-video` | FFmpeg pipeline + patch `VIDEO_SRC` in main.js |
| `npm run format` | Prettier: HTML, CSS, JS |
| `npm run lint:html` | HTMLHint on `index.html` |
| `npm run lint` | Alias for lint:html |
| `npm run verify` | Lint + Prettier check |

## Cursor setup

### Rules

| Rule | Scope |
|------|-------|
| `product-switcher.mdc` | Brand, BEM, switcher/video — always apply |
| `gsap-animation.mdc` | GSAP timelines, reduced-motion |
| `html-structure.mdc` | Semantics, landmarks, script order |
| `video-media.mdc` | FFmpeg, Range server, fallback colors |

### Custom agents

Invoke with **`/agent-name`** in Cursor chat or mention naturally (*"use gsap-reviewer on logo-animation.js"*).

| Agent | Invoke | Use when |
|-------|--------|----------|
| `ui-verifier` | `/ui-verifier` | Browser checklist: nav, logo, 3 sections, switcher |
| `gsap-reviewer` | `/gsap-reviewer` | Review logo hook animation in logo-animation.js |
| `a11y-reviewer` | `/a11y-reviewer` | ARIA, keyboard, focus, reduced-motion audit |
| `feature-integrator` | `/feature-integrator` | Cross-feature sync: switcher ↔ video ↔ sections ↔ logo |
| `verifier` | `/verifier` | Goal-backward: claimed done vs actually works |
| `code-reviewer` | `/code-reviewer` | JS/CSS/HTML quality, BEM, conventions |
| `browser-tester` | `/browser-tester` | Live browser MCP tests (snapshots, clicks) |
| `docs-writer` | `/docs-writer` | Sync README.md + AGENTS.md with codebase |

**Before PR (recommended):**

```
/ui-verifier + /gsap-reviewer + /a11y-reviewer + /code-reviewer  →  /verifier
```

See `AGENTS.md` and `.cursor/AGENTS.md` for full registry. Latest agent run: `.cursor/AGENT-RUN-REPORT.md`.

### GSAP official skills

The **GSAP plugin** is installed in Cursor (`gsap-core`, `gsap-timeline`, `gsap-performance`, `gsap-scrolltrigger`, etc.). Agents use these when editing animations.

### Optional: ScrollTrigger

**Not loaded** in current build — video scrub uses RAF + `video.currentTime`, not scroll-linked GSAP.

Add only when needed (e.g. parallax info panels, pinned sections):

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js"></script>
<script>gsap.registerPlugin(ScrollTrigger);</script>
```

See `.cursor/rules/video-media.mdc` and `gsap-scrolltrigger` skill before integrating.

### Hooks

After editing `index.html`, `styles/`, or `scripts/`, `.cursor/hooks/format-html.sh` runs Prettier if `node_modules` exists.

## Git

Repository not initialized — **Xcode license blocks `git`** on this machine.

To enable git after accepting the license:

```bash
sudo xcodebuild -license   # accept Apple SDK license
cd /Users/petr/Projects/product-switcher
git init
git add .
git status
```

## License

Private / project use.
