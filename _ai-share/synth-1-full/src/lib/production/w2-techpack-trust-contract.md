# Контракт доверия: tech pack, Пульс, фабрика

**Статус:** целевой контракт; реализация — клиент (localStorage + IndexedDB) + опционально S3 (presign → PUT → `complete`).

## В проде «истина» для цеха и аудита

| Слой               | Роль                                                                              |
| ------------------ | --------------------------------------------------------------------------------- |
| Локальное досье    | Черновик и UX.                                                                    |
| Объект в хранилище | Байты; ключ с SHA-256 64 hex — новое содержимое = новый ключ.                     |
| Сервер `complete`  | Проверка размера, magic, типа; `eTag` + `canonicalSource: object_store_verified`. |
| БД (след. шаг)     | Метаданные и ACL, ссылка на объект.                                               |

## Пульс

- `tech_pack_integrity` — печать к производству / целостность.
- `tech_pack_handoff` / `tech_pack_factory_response` — передача и ответ фабрики.

## Фабрика

Пакет с `techPackFactoryHandoffs` + внешние каналы (портал/email/EDI). PDF в бренд-системе не редактирует фабрика.

## Мультиюзер

`NEXT_PUBLIC_W2_DOSSIER_TARGET=server` — баннер; API ` /api/brand/workshop2/phase1-dossier`. `collaborationMergeNote` — ручной merge.

## Операции

`logW2TechPackOps` в stdout. Env: `W2_TECHPACK_RETENTION_DAYS`, `W2_TECHPACK_MAX_BYTES`.
