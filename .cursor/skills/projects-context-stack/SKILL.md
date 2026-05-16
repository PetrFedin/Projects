---
name: projects-context-stack
description: "Краткий стек контекста для монорепо Projects: правила, skills, intel, артефакты — куда смотреть первым делом."
---

## Когда использовать

Пользователь или агент теряется в объёме монорепо, хочет «с чего начать» или усилить качество ответа без лишнего чтения.

## Порядок (не нарушай без причины)

1. **Правила** — `.cursor/rules/` (`alwaysApply` + `synth-canonical-paths`, `token-economy`, `domain-canon-pr`, …).
2. **Корневой контекст** — `AGENTS.md` в корне `Projects`.
3. **Фронт-канон** — `_ai-share/synth-1-full/AGENTS.md` и правки только в этом дереве для Next.js.
4. **GSD** — `.cursor/skills/gsd-help/SKILL.md` для маршрутизации команд; тяжёлые фазы — соответствующие `gsd-*` skills.
5. **Intel** — если `intel.enabled` в `.planning/config.json`: `.planning/intel/README.md` и `/gsd-intel`.
6. **Артефакты** — `.planning/ROADMAP.md`, фазовые каталоги; после итогов фазы — `gsd-extract_learnings`.

## Не делать

- Не читать огромные markdown целиком при наличии skills/workflow с якорями (см. `token-economy`).
- Не считать каноном пути вне `_ai-share/synth-1-full` для продуктового фронта.

## Обучение и эволюция (кратко)

- Ошибки не «запоминаются сами» — фиксируй урок в **артефакте / правиле / SKILL** (см. **`.cursor/rules/agent-context-stack.mdc`** §5–6).
- Улучшения архитектуры и стека — только **с опорой на канон** и **инкрементальным** следующим шагом; домен — через **`domain-canon-pr`** и при необходимости ADR.
