# План очистки проекта Synth-1

Пошаговый план деблоата. Рекомендуется выполнять по фазам с проверкой после каждого шага.

---

## Фаза 1: Быстрые победы (≈30 мин)

### 1.1 Добавить `__pycache__` в .gitignore

```gitignore
# Добавить в .gitignore:
__pycache__/
*.py[cod]
*$py.class
*.pyc
.Python
```

Затем удалить из git (файлы останутся на диске):
```bash
find . -type d -name "__pycache__" -exec git rm -r --cached {} + 2>/dev/null
find . -name "*.pyc" -exec git rm --cached {} + 2>/dev/null
```

### 1.2 Добавить .ai_reports в .gitignore (опционально)

Если отчёты генерируются и не нужны в репо:
```gitignore
.ai_reports/
```

---

## Фаза 2: Архивация root-скриптов (≈15 мин)

### 2.1 Создать архив и удалить

Скрипты для архивации (одноразовые fix/refactor):
- `fix_brand_page.py`, `fix_brand_page_v2.py` … `fix_brand_page_v6.py`
- `fix_brand_page_final.py`, `fix_brand_page_final_v2.py`
- `fix_misplaced_block.py`, `fix_team_management.py`, `fix_user_page.py`
- `move_logic_block.py`, `move_logic_block_v2.py`
- `refactor_home_page.py`
- `replace_dialogs.py`, `replace_jsx_blocks.py`
- `check_page.py`

```bash
mkdir -p scripts/archive
mv fix_*.py move_*.py refactor_*.py replace_*.px check_*.py scripts/archive/ 2>/dev/null
```

**Альтернатива:** удалить полностью, если уверены, что не понадобятся.

---

## Фаза 3: Объединение AI-роутов (≈1 ч)

### 3.1 Текущая ситуация

| Файл | Префикс | Эндпоинты |
|------|---------|-----------|
| `ai.py` | `/ai` | trends, similar-products, pricing-recommendation, sku-prediction, demand-forecast |
| `ai_routes.py` | `/ai-intelligence` | trends, similar-products, visual-search, demand-forecast, inventory-replenishment, sku-performance, brand-score |

**Дублирование:** `trends`, `similar-products`, `demand-forecast` (разная сигнатура и реализация).

### 3.2 План объединения

1. **Оставить один роутер** — в `ai_routes.py` (он богаче по функционалу).
2. **Перенести уникальное из ai.py:**
   - `GET /pricing-recommendation/{product_id}` — PricingAIService (реальный сервис)
   - `GET /sku-prediction/{product_id}` — можно оставить как mock или удалить
3. **Удалить** `app/api/v1/endpoints/ai.py`.
4. **В routes.py:** заменить два include на один:
   ```python
   router.include_router(ai_routes.router, prefix="/ai", tags=["ai"])
   # удалить ai_intelligence
   ```
5. **Проверить фронтенд** — искать вызовы `/ai-intelligence/*` и заменить на `/ai/*`.

---

## Фаза 4: Документация synth-1 (опционально, ≈1 ч)

### 4.1 Проблема

66 `.md` файлов в `synth-1/` — много аудитов, B2B-матриц, roadmap-документов. Часть устарела.

### 4.2 Действия

1. **Оставить ключевые:** `README.md`, `STYLE_GUIDE.md`, `ARCHITECTURE.md`, `INTEGRATION_MAP.md`, `AGENTS.md`, `MASTER_PLAN.md`.
2. **Архивировать** остальные в `synth-1/docs/archive/`:
   ```bash
   mkdir -p synth-1/docs/archive
   mv synth-1/B2B_*.md synth-1/CONTROL_CENTER*.md synth-1/*_AUDIT*.md synth-1/docs/archive/ 2>/dev/null
   # и т.д. — составить список по содержимому
   ```
3. **node_modules** — уже в .gitignore (проверить). 1.2 GB не в репо.

---

## Фаза 5: Аудит неиспользуемых эндпоинтов (≈2–4 ч)

### 5.1 Методология

1. Включить сбор: `ENABLE_ENDPOINT_STATS=true` в `.env`
2. Запустить приложение на 1–2 недели (staging/prod)
3. Периодически смотреть: `GET /api/v1/admin/endpoint-stats` (platform_admin)
4. Выявить эндпоинты с 0 запросов — кандидаты на deprecate

### 5.2 Кандидаты на deprecate (требуют проверки)

Потенциально малоиспользуемые домены:
- `wardrobe`, `circular`, `custom`, `expansion`
- `smart_contracts`, `auctions`
- `global_compliance` vs `compliance` — возможно дублирование
- `sustainability` vs `esg` — overlap

**Действие:** не удалять сразу. Добавить заголовок `X-Deprecated: true` и комментарий в коде, планировать удаление через квартал.

---

## Фаза 6: AI-агенты (опционально, ≈2 ч)

### 6.1 Список агентов

Проверить, какие реально вызываются:
- `orchestrator_agent`, `code_agent`, `docs_agent` — скорее всего используются
- `tech_debt_agent`, `ui_improvement_agent`, `competitor_benchmark_agent` — возможно только для отчётов

### 6.2 Действие

1. Найти точки вызова каждого агента (grep по имени).
2. Неиспользуемые — вынести в `app/agents/deprecated/` или удалить.
3. Упростить `agent_runner.py`, убрав регистрацию мёртвых агентов.

---

## Чеклист выполнения

| Фаза | Задача | Статус |
|------|--------|--------|
| 1.1 | pycache в .gitignore + rm --cached | [x] |
| 1.2 | .ai_reports в .gitignore (опц.) | [x] |
| 2.1 | Архивация root-скриптов | [x] |
| 3.1–3.5 | Объединение ai.py + ai_routes.py | [x] |
| 4.1–4.3 | Чистка docs в synth-1 | [x] |
| 4.4 | Архивация root-отчётов (AUDIT, MODULE_AUDIT, TOKEN_OPTIMIZATION) | [x] |
| 5.1–5.2 | Аудит эндпоинтов | [x] инфраструктура готова |
| 6.1–6.3 | Аудит AI-агентов | [x] пропуск — все агенты используются |
| 7 | Добавить X-Deprecated для /ai-intelligence | [x] |
| 7 | Исправить tags tasks → tasks | [x] |

---

## Ожидаемый эффект

- **Git:** −300+ файлов (pycache), −16 root-скриптов
- **API:** один AI-роутер вместо двух, меньше путаницы
- **Документация:** структурированный архив вместо 66 файлов в корне
- **Поддержка:** проще навигация, меньше дублирования
