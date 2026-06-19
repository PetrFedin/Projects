# Workshop2 green — экспорт без git

На этой машине `/usr/bin/git` недоступен без лицензии Xcode; каталога `.git` в копии проекта нет. Коммит и `git diff` недоступны.

## Сводка изменений (sample-shop / unit-green)

- E2E: `e2e/workshop2-sample-shop-flow.spec.ts` — основной flow fit → release order + 4 overflow sub-tabs (`floor`, `cut`, `logistics`, `timeline`).
- E2E helpers: `e2e/helpers/w2-release-order-nav.ts` — tab strip, order sub-tab, overflow deep-links.
- UI: `workshop2-release-sub-nav.tsx`, `Workshop2ArticleSamplePanel.tsx` — sub-tabs и ссылка на release.
- Unit gate: `scripts/workshop2-unit-green.mjs` (jest `--json`).
- CI: `scripts/ci-workshop2-sample-shop-e2e.sh` + npm `test:e2e:sample-shop:external`.
- Phase1 unit: `workshop2-sample-shop-phase1.test.ts`.

Полный список недавних путей: `/tmp/workshop2-changed-files.txt` (если сгенерирован ранее).

## Артефакты

| Файл | Назначение |
|------|------------|
| `/tmp/workshop2-green-export-20260529.tar.gz` | Ключевые файлы green-пакета |
| `/tmp/workshop2-green-snapshot-20260529-v2.tar.gz` | Более широкий снимок (если есть) |

### Применить без git

```bash
cd /path/to/synth-1-full
tar -xzf /tmp/workshop2-green-export-20260529.tar.gz
# или распаковать v2 snapshot поверх дерева с бэкапом
```

Не копируйте `.env` / секреты с другой машины.

## Проверка

```bash
source ~/.nvm/nvm.sh && nvm use 22
export WORKSHOP2_DATABASE_URL=postgresql://workshop2:workshop2_dev@127.0.0.1:5433/workshop2
docker compose -f docker-compose.workshop2.yml up -d
npm run db:apply:workshop2-migrations
node scripts/workshop2-unit-green.mjs
bash scripts/ci-workshop2-sample-shop-e2e.sh
```

Ожидание unit-green: `PASS >=1445`, 0 failed.

## Git позже (без Xcode)

- Установить standalone git: [git-scm.com](https://git-scm.com/) или Homebrew (`brew install git`) — не требует `xcodebuild -license`.
- `git init` / clone remote и закоммитить распакованные файлы.

## Тесты runway-iteration7

`runway-iteration7.test.ts` в дереве нет. Близкие dedup-тесты: `runway-phase13.test.ts`, `runway-phase19.test.ts`. Восстановление iteration7 возможно только из бэкапа/истории remote.
