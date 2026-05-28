# Субмодули

**Фронтенд Fashion OS (Next.js):** единственный код в репозитории — **`_ai-share/synth-1-full`** (см. **`docs/MIGRATION_FULL_CUTOVER.md`**). Отдельного субмодуля **`synth-1/`** в этом монорепо больше нет.

**E2E и Playwright** живут только во **`_ai-share/synth-1-full`** (`playwright.config.ts`, `npm run test:e2e*`). Отдельного субмодуля **`pw-demo`** нет — дублирующий шаблон Playwright вынесен из монорепо.

Файл **`.gitmodules`** задаёт:

| Путь     | Remote |
|----------|--------|
| `tools/superpowers` | `https://github.com/obra/superpowers.git` ([Superpowers](https://github.com/obra/superpowers) — skills / методология для агентов) |

Клон с субмодулями:

```bash
git clone --recurse-submodules https://github.com/PetrFedin/Projects.git
# или после clone:
git submodule update --init --recursive
```

Скрипт **`scripts/bootstrap-monorepo-dev.sh`** поднимает субмодули, **`npm ci`** в **`_ai-share/synth-1-full`** и вызывает **`scripts/normalize-gsd-cursor-paths.sh`**. После переустановки GSD при необходимости снова: **`bash scripts/normalize-gsd-cursor-paths.sh`** (см. **`docs/CURSOR_AGENT_TOOLKIT.md`**).

Обновить указатели после коммитов в субмодуле: push в репозиторий субмодуля, затем коммит в корне с новым SHA.

Сменить URL (форк, SSH), например для **superpowers**:

```bash
git config submodule.tools/superpowers.url git@github.com:YOU/superpowers.git
git submodule sync
```
