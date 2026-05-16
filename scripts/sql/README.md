# SQL-патчи (операции / прод)

Короткий индекс ручных миграций вне Alembic. Диалект в скриптах — **PostgreSQL** (`IF NOT EXISTS`).

| Файл | Назначение |
|------|------------|
| [`inventory_sync_logs_organization_id.sql`](inventory_sync_logs_organization_id.sql) | Колонка **`organization_id`** + индекс на **`inventory_sync_logs`** — счётчики **`inventorySyncFailed30d`** / **`inventorySyncLastSuccessAt`** в [`app/api/v1/endpoints/brand.py`](../../app/api/v1/endpoints/brand.py); модель **`InventorySyncLog`** в [`app/db/models/intelligence.py`](../../app/db/models/intelligence.py). |
| [`organization_attention_dismiss_json.sql`](organization_attention_dismiss_json.sql) | JSON **`organizations.attention_dismiss_json`** для dismiss «Требует внимания» (хаб бренда). |

**Порядок:** патчи независимы; на пустой БД можно в любом порядке.

**После применения:** убедиться, что воркеры/сервисы при записи в **`inventory_sync_logs`** заполняют **`organization_id`** (иначе дашборд по бренду не увидит строки).

См. также: **`_ai-share/synth-1-full/src/app/brand/organization/NEXT_IMPROVEMENTS.md`** (раздел про SQL и хаб).
