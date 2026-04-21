# Projects — инструкции для людей и AI-агентов

Монорепозиторий: бэкенд (Python), фронт **только** в **`_ai-share/synth-1-full`**, субмодули **`pw-demo/`**, **`tools/superpowers`**.

## Обязательный контур агента (Cursor)

В чате агента действует правило **`.cursor/rules/gsd-superpowers-mcp-monorepo.mdc`** (`alwaysApply: true`):

1. **GSD** — для крупных и неоднозначных задач: сначала карта/план/фазы через навыки в **`.cursor/skills/`** и **`.cursor/get-shit-done/`**, а не сразу большой дифф. Справка по командам: навык **`gsd-help`**.
2. **Superpowers** — уточнение цели, план, TDD где уместно; локально см. **`tools/superpowers/`** ([obra/superpowers](https://github.com/obra/superpowers)). В IDE: **`/add-plugin superpowers`**.
3. **MCP** — **`scripts/cursor-mcp-sync.py`** обновляет **`.cursor/mcp.json`** и **`~/.cursor/mcp.json`** (stdio + remote: Exa, Figma, Sentry, Linear, Semgrep при наличии CLI). Подробности: **`docs/CURSOR_AGENT_TOOLKIT.md`**.

## Документы

| Документ | Назначение |
|----------|------------|
| **`docs/CURSOR_AGENT_TOOLKIT.md`** | Установка, MCP, Superpowers, GSD, deep research |
| **`docs/SUBMODULES.md`** | Субмодули и `git submodule update` |
| **`docs/MIGRATION_FULL_CUTOVER.md`** | Канон full, отказ от субмодуля `synth-1/` |

## Фронтенд

Разработка и CI — **`_ai-share/synth-1-full`** (см. **`_ai-share/synth-1-full/AGENTS.md`**).

## Bootstrap после clone

```bash
bash scripts/bootstrap-monorepo-dev.sh
```

Скрипт bootstrap вызывает **`scripts/normalize-gsd-cursor-paths.sh`** и **`scripts/cursor-mcp-sync.py`**. После **`npx get-shit-done-cc@latest --local --cursor`** при появлении абсолютных путей в ссылках запустите normalize снова. Контроль: **`bash scripts/check-gsd-cursor-paths.sh`** (в CI — job **GSD portable paths**).

GSD и субмодули (`pw-demo`, **`tools/superpowers`**) должны быть на месте; MCP — перегенерировать **`python3 scripts/cursor-mcp-sync.py`** и включить серверы в настройках Cursor.
