# Dev-perf — ship checklist (2026-05-26)

## P0 — создать PR

```bash
# один раз
brew install gh   # или уже есть
gh auth login

bash scripts/create-dev-perf-pr.sh
# или: npm run pre-pr:dev-perf && открыть compare вручную
```

Compare: https://github.com/PetrFedin/Projects/compare/main...feat/dev-perf-optimization?expand=1  
Paste: `.planning/phases/dev-perf/PR_MANUAL_PASTE.txt`  
Scope: `.planning/phases/dev-perf/PR_SCOPE.md` (~198 commits)

## Pre-merge verify

```bash
export PATH="/Applications/Xcode.app/Contents/Developer/usr/bin:$PATH"
npm run pre-pr:dev-perf                    # static, 36 layout gates
npm run dev-perf:review-files              # focus paths для review
npm run pre-pr:dev-perf:e2e                # optional; локально может OOM
```

CI блокеры: `check:contracts:ci`, `test:e2e:light` (GitHub Actions).

## Post-merge (manual)

```bash
npm run dev:fast:clean
npm run dev:bench:routes                   # baseline `/`
npm run analyze:bundle                     # needs @next/bundle-analyzer во full
```

## Ops

- Не параллелить `:3000` (dev:fast) и `:3123` (e2e).
- Workshop2 WIP не коммитить в dev-perf PR — ломает `ai-client-boundary` / `test:layout:gates`.
- После e2e → `stop:stale-dev && dev:fast:clean` перед bench.
- Turbopack ENOENT → clean restart.

## Артефакты

| Файл | Назначение |
|------|------------|
| `PR_BODY.md` | описание PR |
| `PR_READY.md` | чеклист |
| `PR_SCOPE.md` | размер ветки |
| `REVIEW_FILES.txt` | focus paths vs main |
| `VERIFICATION.md` | результаты прогонов |
| `PLAN-05-home-rsc-zero-fetch.md` | следующая фаза |
