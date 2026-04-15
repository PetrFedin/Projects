# PR Split Plan (synth-1-full)

Цель: разрезать большой diff на логические и безопасные партии, чтобы ревью и откаты были управляемыми.

## 0) Предусловия

- Работать только внутри `_ai-share/synth-1-full`.
- Проверка перед каждой партией:
  - `npm run typecheck`
  - `npm run check:contracts`
  - при изменении page-контрактов: `npm run typecheck:next-pages`

## 1) Партия A — AI boundary + typecheck contracts

**Содержимое:**
- `src/app/api/ai/**`
- `src/components/ai/**`
- `src/lib/repo/ai-stylist-repo-instance.ts`
- `src/lib/repo/aiStylistRepo.stub.ts`
- `src/lib/repo/index.ts`
- `scripts/ci/ai-client-boundary-guard.mjs`
- `src/lib/data/mock-promotions.ts`
- page-контрактные правки (`src/app/**/page.tsx`) из P0
- `tsconfig.typecheck.json`, `tsconfig.next-pages.json`, `package.json` (typecheck scripts)

**Проверки:**
- `npm run typecheck`
- `npm run check:ai-client-boundary`
- `npm run typecheck:next-pages`

## 2) Партия B — Domain events / contracts

**Содержимое:**
- `src/lib/order/**`
- `src/lib/server/domain-events-*`
- `src/lib/server/observe-api-route.ts`
- `src/app/api/ops/**`
- `src/app/api/cron/domain-event-outbox-drain/**`
- `scripts/ci/check-domain-events-health-*`

**Проверки:**
- `npm run check:contracts`
- `npm run test:contracts:b2b`

## 3) Партия C — Build/runtime infra

**Содержимое:**
- `next.config.ts` (`NEXT_DIST_DIR`)
- `.gitignore` (`.next-isolated`)
- `scripts/ensure-supported-node.mjs`
- `.nvmrc`, `.npmrc`
- `.github/workflows/ci.yml` (если в этом репо)
- docs про build/typecheck режимы

**Проверки:**
- `npm run build:isolated`
- `npm run typecheck`

## 4) Партия D — e2e + docs

**Содержимое:**
- `e2e/**`
- `docs/**`
- `README.md`, `SOURCE_OF_TRUTH.md`, `INTEGRATION_MAP.md`

**Проверки:**
- `npm run test:e2e:light`
- при необходимости: `npm run test:e2e:heavy`

## 5) Что исключать из PR по умолчанию

- Любые файлы вне `_ai-share/synth-1-full` (`../../...`).
- Случайные IDE/runtime артефакты.
- Нерелевантные массовые UI-правки, не относящиеся к цели PR.

## 6) Проверка legacy удаления `src/pages/_app.tsx` и `src/pages/_document.tsx`

- В `src/` отсутствует директория `pages/`.
- Для текущего App Router это допустимо.
- Если нужен rollback для совместимости со старым Pages Router — возвращать отдельной партией, не смешивать с boundary/domain задачами.
