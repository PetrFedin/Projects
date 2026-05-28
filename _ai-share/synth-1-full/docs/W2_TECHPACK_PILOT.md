# Workshop2 tech pack — пилот с фабрикой

## 1. Обязательные переменные (prod)

| Переменная | Назначение |
|------------|------------|
| `W2_METRICS_S3_*` | Как для W2 metrics: bucket, region, ключи, префикс; объекты tech pack пишутся под `…/techpack/…`. |
| `W2_TECHPACK_API_SECRET` | Секрет для presign/complete/index/handoff и (по умолчанию) для read, если не задан отдельный read. |
| `W2_TECHPACK_FACTORY_READ_SECRET` | Опционально: только скачивание (`GET …/download`), выдать фабрике отдельно от write. |
| `DATABASE_URL` | Postgres для таблицы `w2_techpack_attachment_index`. |
| `W2_TECHPACK_ALLOW_SAME_ORIGIN_BROWSER=1` | Кабинет (браузер) вызывает API same-origin **без** публичного ключа в бандле; секрет остаётся на сервере. |
| `W2_TECHPACK_AUTH_DISABLED` | Только dev: `1` / `true` — отключить проверку (не для prod). |

Применение DDL: `npm run db:apply:w2-techpack-index` (нужен `DATABASE_URL`).

## 2. Наблюдаемость

- Структурные логи: `source: w2_techpack_ops` в stdout.
- Файл (ротация на стороне агента): `W2_TECHPACK_OPS_LOG_PATH`.
- Sentry: при `NODE_ENV=production` часть событий уходит как warning (см. `w2-tech-pack-ops-telemetry.ts`). В UI Sentry заведите алерты по `w2_techpack_ops:*` / `unauthorized` / `mismatch`.
- Datadog / прочие: забирайте JSON-строки из stdout или из файла лог-шиппером.

## 3. Фабрика: скачать тот же объект, что прошёл complete

После индексации:

```http
GET /api/brand/workshop2/tech-pack/download?collectionId=…&articleId=…&attachmentId=…
Authorization: Bearer <W2_TECHPACK_FACTORY_READ_SECRET или W2_TECHPACK_API_SECRET>
```

Ответ: `downloadUrl` (presigned GET), `objectKey`, `contentSha256Hex`, `etag`, …

Список вложений по артикулу (write-секрет или same-origin при флаге):

```http
GET /api/brand/workshop2/tech-pack/index?collectionId=…&articleId=…
```

## 4. Handoff

`POST /api/brand/workshop2/tech-pack/handoff` с телом JSON: `collectionId`, `articleId`, `attachmentId`, `handoffStatus` (допустимые значения по умолчанию: `none`, `pending`, `sent`, `ack`, `rejected`; набор можно сузить через `W2_TECHPACK_HANDOFF_STATUSES`), опционально `packageRevision`.

## 5. S3 lifecycle

Пример правила: `scripts/s3/w2-techpack-lifecycle.example.json`. Срок в днях согласовать с `W2_TECHPACK_RETENTION_DAYS` (см. `w2-tech-pack-retention-policy.ts`).

## 6. Кросс-origin / скрипты

Если вызов API не same-origin, передайте `Authorization: Bearer` или `x-w2-api-key` (тот же `W2_TECHPACK_API_SECRET`). В крайнем случае в закрытом билде: `NEXT_PUBLIC_W2_TECHPACK_API_KEY` (секрет виден в бандле — нежелательно, если тот же origin не используется).

## 7. Preflight и пример env

- Шаблон переменных: `env.w2-techpack.example` (скопировать в `.env.local`).
- Проверка: `npm run w2:techpack:preflight` — смотрит `.env` / `.env.local`, **HeadBucket** S3, наличие таблицы в Postgres.
- CI / релиз: `npm run w2:techpack:preflight:strict` — **exit 1**, если есть строки `NO` (ошибки/пропущенные обязательные вещи).

## 8. GitHub Actions (опционально)

Готовый workflow: `docs/ci/W2_TECHPACK_PREFLIGHT_GITHUB.yml` — скопируйте в **корень монорепо** `.github/workflows/w2-techpack-preflight.yml`.

В **Settings → Secrets and variables → Actions** добавьте: `W2_METRICS_S3_*`, `DATABASE_URL`, `W2_TECHPACK_API_SECRET`, при необходимости `W2_TECHPACK_ALLOW_SAME_ORIGIN_BROWSER` (`1`), `W2_TECHPACK_FACTORY_READ_SECRET`, опционально `W2_METRICS_S3_PREFIX`.

Если секретов нет, job выводит `Skip` и завершается успешно.
