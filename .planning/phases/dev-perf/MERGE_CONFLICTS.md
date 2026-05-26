# Merge status: feat/dev-perf-optimization → main (2026-05-26)

## Блокер перед merge PR

**~102 файла** в conflict при merge `origin/main` → `feat/dev-perf-optimization` (dry-run `git merge-tree`).

Проверка:
```bash
bash scripts/check-dev-perf-merge-conflicts.sh
```

## Dev-perf core (без conflict в dry-run)

| Файл | Статус |
|------|--------|
| `src/app/layout.tsx` | ok |
| `RootClientProviders` / gates | ok |
| `src/app/page.tsx` | ok |
| `next.config.ts` | ok |
| `playwright.config.ts` | ok |
| **`package.json`** | **CONFLICT** — при merge сохранить `test:layout:gates` + `check:layout-gates-package` |

## Локальный WIP

`git merge origin/main` **abort** если есть uncommitted changes (workshop2). Перед merge:

```bash
git stash push -m "w2-wip" -- _ai-share/synth-1-full
git merge origin/main
# resolve conflicts; package.json — обязательно gates
npm run verify:dev-perf
git push origin feat/dev-perf-optimization
git stash pop   # отдельно от dev-perf PR
```

## Порядок приоритетов

1. **Создать PR** — `bash scripts/create-dev-perf-pr.sh` (можно до merge main; GitHub покажет conflicts)
2. **Merge main** в ветку — снять 102 conflicts (или rebase; трудоёмко)
3. **CI green** → merge PR

## Альтернатива

Merge as-is если `main` устарел и команда принимает разрешение conflicts в GitHub UI (не рекомендуется для 102 files).
