# Dev-perf — ship checklist

## Блокер git (обход без `sudo xcodebuild -license`)

Если `/usr/bin/git` пишет про Xcode license, но Xcode установлен:

```bash
export PATH="/Applications/Xcode.app/Contents/Developer/usr/bin:$PATH"
bash scripts/ship-dev-perf.sh feat/dev-perf-optimization
```

## Ship (одна команда)

```bash
bash scripts/ship-dev-perf.sh feat/dev-perf-optimization
```

4 коммита → push → PR (`PR_BODY.md`).

## Верификация перед merge

```bash
npm run smoke                          # ~5s, CI gates + layout 22 tests
npm run test:e2e:light                 # ~10 min, 36 routes
npm run stop:stale-dev
npm run dev:fast:clean                 # один процесс :3000
# Ready + 3s
npm run dev:bench:ci                   # 9 hubs strict
npm run dev:bench:routes               # 38 URL (отдельный clean, не подряд с ci)
npm run test:e2e:verification          # ✅ 5/5 (~2 min после prepare; 1 flaky допустим)
```

## Ops

- Не параллелить `:3000` (dev:fast / workshop2) и `:3123` (e2e).
- После e2e → `dev:fast:clean` перед bench.
- Turbopack ENOENT → clean restart, не патчить код.

## Артефакты

| Файл | Назначение |
|------|------------|
| `.planning/phases/dev-perf/PR_BODY.md` | описание PR |
| `.planning/phases/dev-perf/VERIFICATION.md` | результаты прогонов |
| `.planning/research/dev-perf-next-milestone.md` | фаза 4 roadmap |
