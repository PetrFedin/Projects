# Отчёт по оптимизации токенов и производительности

## Выявленные монстры (>400 строк)

### Frontend (synth-1) — приоритет 1
| Файл | Строк | Действие |
|------|-------|----------|
| `_ai-share/synth-1-full/src/app/brand/page.tsx` | **2650** | Разбить на табы-компоненты |
| `_ai-share/synth-1-full/src/app/brand/production/production-page-content.tsx` | 1980 | Разбить на панели |
| `_ai-share/synth-1-full/src/app/brand/production/tech-pack/[id]/page.tsx` | 1462 | Вынести подкомпоненты |
| `_ai-share/synth-1-full/src/app/brand/organization/organization-overview-content.tsx` | 1367 | Разбить |
| `_ai-share/synth-1-full/src/app/project-info/product-display/page.tsx` | 1134 | Разбить |
| `_ai-share/synth-1-full/src/app/brand/production/page.tsx` | 1095 | Вынести контент |
| `_ai-share/synth-1-full/src/app/brand/organization/page-data.ts` | 983 | OK — данные |
| `_ai-share/synth-1-full/src/app/project-info/page.tsx` | 964 | Разбить |

### Backend (app)
| Файл | Строк | Действие |
|------|-------|----------|
| `app/api/v1/endpoints/plm/routes.py` | **1095** | Разбить на под-роутеры |
| `app/db/models/factory/models.py` | 853 | Разбить по доменам |
| `app/core/project_registry.py` | 598 | Вынести модули |
| `app/db/models/product.py` | 459 | Возможное разбиение |

## Уже в .cursorignore
- `.ai_context/`, `.ai_reports/` — исключены
- `node_modules`, `.venv`, `__pycache__`
- Сборка Next.js (`.next/`)

## Выполненные меры
1. **.cursorignore**: добавлены `__pycache__`, `*.pyc`, `pytest_cache`, `fix_*.py`, `move_*.py`, etc.
2. **brand/page.tsx**: DNA tab извлечён в `BrandDnaTab.tsx` (~320 строк). Страница: 2650 → 2208 строк (−442)
3. **plm/routes.py**: Pydantic-модели вынесены в `models_plm.py` (177 строк). routes.py: 1095 → 952 строк (−143)

## Рекомендации на будущее
- **production-page-content.tsx** (1980 строк): вынести панели в отдельные компоненты
- **factory/models.py** (853 строки): разбить на machine_*, production_*, capacity_* модули
