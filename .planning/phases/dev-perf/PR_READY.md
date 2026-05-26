# Dev-perf — PR ready checklist (2026-05-26)

## Pre-flight (локально)

```bash
export PATH="/Applications/Xcode.app/Contents/Developer/usr/bin:$PATH"
git checkout feat/dev-perf-optimization
git pull origin feat/dev-perf-optimization

# Workshop2 WIP ломает verify (ai-client-boundary) — не смешивать с PR:
git status _ai-share/synth-1-full   # должен быть clean или только dev-perf файлы

npm run verify:dev-perf             # PASS: contracts + 36 layout gates
bash scripts/dev-perf-review-files.sh main HEAD   # focus paths для review
```

## Создать PR

```bash
gh auth login
# или: export GITHUB_TOKEN=ghp_…
bash scripts/create-dev-perf-pr.sh
# без auth: откроет compare + body в буфер (pbcopy на macOS)
```

Compare: https://github.com/PetrFedin/Projects/compare/main...feat/dev-perf-optimization?expand=1

Body: `.planning/phases/dev-perf/PR_BODY.md`

## CI (блокеры merge)

| Check | Ожидание |
|-------|----------|
| `check:contracts:ci` | PASS (incl. `test:layout:gates` 36 + package guard) |
| `test:e2e:light` | 36/36 (CI); локально OOM `Killed: 9` — не блокер |
| Review | `RootClientProviders`, `AuthProviderGate`, `/shop` B2B hub |

## После merge

1. `npm run dev:fast:clean` — daily dev
2. Manual: `workflow_dispatch` → `unified-ecosystem-e2e-dispatch.yml`
3. Фаза 5: `.planning/phases/dev-perf/PLAN-05-home-rsc-zero-fetch.md`

## Ops (не забыть)

- Не параллелить `:3000` (dev:fast) и `:3123` (e2e)
- После e2e → `stop:stale-dev && dev:fast:clean` перед bench
- Turbopack ENOENT → clean restart
