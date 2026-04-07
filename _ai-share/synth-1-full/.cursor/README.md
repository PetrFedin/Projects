# Cursor Setup — Syntha

## Commands (/) 

Команды в `.cursor/commands/` — набирайте `/` в чате для быстрого доступа.

**Источник:** [hamzafer/cursor-commands](https://github.com/hamzafer/cursor-commands)

### Проектные команды Syntha

| Команда | Описание |
|---------|----------|
| `syntha-design-audit` | Проверка на соответствие STYLE_GUIDE |
| `syntha-b2b-feature` | Добавление B2B фичи по FEATURE_BENCHMARK |
| `syntha-sync-integration` | Синхронизация routes, entity-links |

### Общие команды

- `lint-fix`, `lint-suite` — линтинг (npm run lint:fix, format)
- `code-review` — код-ревью
- `refactor-code`, `optimize-performance`
- `security-audit`, `accessibility-audit`
- `git-commit`, `create-pr`
- и др. (см. полный список в чате по `/`)

## Rules (.cursor/rules/)

- `ui-ux-design-system.mdc` — дизайн-система, Tailwind, STYLE_GUIDE

## Расширения

Рекомендуемые в `.vscode/extensions.json`: Tailwind, ESLint, Prettier, Error Lens.
