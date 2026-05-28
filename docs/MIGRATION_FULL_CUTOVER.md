# Фронтенд Fashion OS — только `synth-1-full`

**Канон кода и CI:** **`_ai-share/synth-1-full`**. Субмодуль **`synth-1/`** удалён из монорепо; исторический репозиторий при необходимости смотрите отдельно (GitHub `PetrFedin/synth-1`). Весь продуктовый Next.js живёт только в **full**.

## Политика

- Политика и разработка: **`_ai-share/synth-1-full/docs/CANONICAL_FULL.md`**, **`_ai-share/synth-1-full/AGENTS.md`**, **`_ai-share/synth-1-full/docs/FULL_APP_DEVELOPMENT.md`**, **`_ai-share/synth-1-full/SOURCE_OF_TRUTH.md`**.

## Чеклист

### Разработка и деплой

- Локально: **`cd _ai-share/synth-1-full && npm ci && npm run dev`** (порт в `package.json`; конфликт порта — **`scripts/stop-stale-next-dev.sh`**).
- Все PR по фронту — только в **`_ai-share/synth-1-full`**.
- CI монорепо: **`synth-1-full-ci.yml`**, **`playwright-brand-surfaces.yml`**, job **`frontend-schemas`** в **`Synth-1 CI`** (см. **`.github/workflows/ci.yml`**) — пути **`_ai-share/synth-1-full`**.

### Документация в корне `Projects`

- В текстах указывать **`_ai-share/synth-1-full/src/...`**, без отсылок к удалённому **`synth-1/`**.

### Приёмка (в каталоге full)

- **`npm run smoke:fast`** или **`check:contracts:ci`**
- **`npm run test:e2e:light`**, при необходимости **`test:e2e:verification`** / **`test:e2e:api`**

### Команда и агенты

- Рабочее дерево по умолчанию в Cursor — **`Projects`** (корень монорепо) или **`_ai-share/synth-1-full`**.
- Правила: **`/.cursor/rules/synth-canonical-paths.mdc`**, **`_ai-share/synth-1-full/.cursor/rules/*`**.

## Локальный архив legacy

- Что можно убрать из повседневного контура и как архивировать: **`docs/ARCHIVE_AND_LEGACY_RU.md`**
- Скрипт: **`scripts/archive-local-legacy-frontend.sh`**

## Что не делать

- Не делать слепый **`cp`** сторонних деревьев поверх канона — только осознанный перенос по **`docs/CANONICAL_FULL.md`**.
