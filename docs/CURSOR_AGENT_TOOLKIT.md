# Cursor: Superpowers, GSD, agent-browser, deep research

Краткий гид по инструментам, которые вы просили подключить. Часть — **плагины/навыки Cursor**, часть — **MCP** в `.cursor/mcp.json`, часть — **CLI** на машине.

**Для агентов в этом репо:** обязательное правило **`/.cursor/rules/gsd-superpowers-mcp-monorepo.mdc`** (`alwaysApply: true`) + корневой **`/AGENTS.md`**. Соблюдай их вместе с этим файлом.

### Портативность GSD

В ссылках на workflow/skills используются пути **от корня репозитория** (например `@.cursor/get-shit-done/...`, `node .cursor/get-shit-done/bin/gsd-tools.cjs`). Открывайте воркспейс **`Projects`**, а не вложенную папку, чтобы пути совпадали. После **`npx get-shit-done-cc@latest --local --cursor`** при необходимости выполните **`bash scripts/normalize-gsd-cursor-paths.sh`** из корня репо (убирает префиксы вида `/Users/…/Projects/` и `/home/…/Projects/` в `*.md` / `*.mdc` / `*.json` / `*.yml` под **`.cursor/`**). Проверка перед коммитом: **`bash scripts/check-gsd-cursor-paths.sh`** (тот же шаг в корневом GitHub Actions **`Synth-1 CI`**).

## 1. Superpowers (obra)

Методология и набор skills для агента: планирование, TDD, субагенты, worktrees. Исходники: [https://github.com/obra/superpowers.git](https://github.com/obra/superpowers.git).

### В монорепо

Подключён **git submodule** **`tools/superpowers`** → тот же репозиторий. Удобно смотреть skills и доки локально (`tools/superpowers/skills/`, `tools/superpowers/.cursor-plugin/`).

После `git clone` без субмодулей:

```bash
git submodule update --init tools/superpowers
```

### В Cursor (рекомендуется для агента)

В чате агента: **`/add-plugin superpowers`** или Marketplace → **Superpowers** (см. [README в upstream](https://github.com/obra/superpowers#cursor-via-plugin-marketplace)).

Плагин и submodule **дополняют друг друга**: submodule — зафиксированная копия исходников, плагин — то, что Cursor подхватывает как расширение.

## 2. Get Shit Done (GSD)

Уже установлено **локально в этот репозиторий** командой:

```bash
npx get-shit-done-cc@latest --local --cursor
```

Файлы лежат в **`.cursor/`** (skills, `get-shit-done/`, агенты и т.д.). В чате используйте навыки/команды GSD по их документации (например **`gsd-help`** / упоминание skill из `.cursor/skills/`).

Обновление:

```bash
npx get-shit-done-cc@latest --local --cursor
```

## 3. agent-browser (Vercel) + MCP

**CLI** (один раз на машине, нужен для MCP-сервера):

```bash
npm install -g agent-browser
agent-browser install
```

**MCP:** в корне репозитория добавлен **`.cursor/mcp.json`** с сервером **`agent-browser`** (`npx -y agent-browser-mcp`). После установки CLI перезапустите Cursor или перезагрузите MCP.

Проверка в терминале: `agent-browser open example.com` → `agent-browser snapshot` → `agent-browser close`.

## 4. Deep research

Готового «одного» официального MCP нет; распространённые варианты:

| Вариант | Установка | Ключи |
|--------|-----------|--------|
| [@pinkpixel/deep-research-mcp](https://www.npmjs.com/package/@pinkpixel/deep-research-mcp) | `npx -y @pinkpixel/deep-research-mcp` | **Tavily** API |
| [mcp-deepwebresearch](https://www.npmjs.com/package/mcp-deepwebresearch) | `npx -y mcp-deepwebresearch` | см. README пакета (часто поиск + Chromium) |
| [RivalSearchMCP](https://github.com/damionrashford/RivalSearchMCP) | clone + `npm run build` | заявлено без платных ключей для базового поиска |

Чтобы не коммитить секреты, добавьте блок в **локальный** `~/.cursor/mcp.json` или в проектный `.cursor/mcp.json` **у себя** (не в git), например:

```json
"deep-research": {
  "command": "npx",
  "args": ["-y", "@pinkpixel/deep-research-mcp"],
  "env": {
    "TAVILY_API_KEY": "ваш_ключ"
  }
}
```

В репозиторий ключи **не** кладём.

Полная генерация **проектного** `.cursor/mcp.json` и **`~/.cursor/mcp.json`** (stdio + remote MCP + Semgrep при наличии CLI):

```bash
REPO_ROOT=/path/to/Projects python3 scripts/cursor-mcp-sync.py
# или
bash scripts/install-cursor-user-mcp.sh
```

Опционально в окружении перед запуском: **`TAVILY_API_KEY`** (deep-research), **`DD_API_KEY`**, **`DD_APPLICATION_KEY`**, **`DD_MCP_DOMAIN`** (Datadog). Без них соответствующие серверы не добавляются.

## 5. Файлы в этом репозитории

| Путь | Назначение |
|------|------------|
| `tools/superpowers/` | Submodule [obra/superpowers](https://github.com/obra/superpowers) — исходники skills / `.cursor-plugin` |
| `.cursor/mcp.json` | MCP: filesystem (npm), git/fetch (**Python** `python3 -m mcp_server_*`), **agent-browser** (npm). См. примечание про git/fetch ниже. |
| `scripts/cursor-mcp-sync.py`, `scripts/install-cursor-user-mcp.sh`, `scripts/mcp-run-semgrep.sh` | Синхронизируют **`.cursor/mcp.json`** и **`~/.cursor/mcp.json`**: filesystem, git, fetch, agent-browser, **Exa / Figma / Sentry / Linear** (remote), **Semgrep** через обёртку (без user-specific `PATH` в JSON), опционально Tavily / Datadog по env. |
| `.cursor/skills/`, `.cursor/get-shit-done/`, … | **GSD** (после `npx get-shit-done-cc … --local --cursor`) |

**Git / Fetch MCP:** пакеты `@modelcontextprotocol/server-git` и `server-fetch` **сняты с npm**; используются PyPI-пакеты **`mcp-server-git`** и **`mcp-server-fetch`** (`pip3 install --user …`). Конфиг в репозитории уже переведён на `python3 -m mcp_server_git` / `mcp_server_fetch`. Альтернатива upstream: `uvx mcp-server-git` / `uvx mcp-server-fetch`.

Если Cursor не подхватывает проектный MCP, проверьте настройки: использование **Project MCP** и путь к корню воркспейса **`Projects`**.
