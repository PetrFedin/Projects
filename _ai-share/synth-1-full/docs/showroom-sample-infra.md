# Showroom sample tags — инфраструктура

## Где в коде

| Что | Путь |
|-----|------|
| Типы payload бирки | `src/lib/fashion/showroom-sample-tag.ts` |
| Клиент: POST регистрация + GET резолв | `src/lib/fashion/showroom-sample-client.ts` |
| API POST id | `src/app/api/showroom-sample/route.ts` |
| API GET payload | `src/app/api/showroom-sample/[id]/route.ts` |
| In-memory store (демо) | `src/lib/server/showroom-sample-memory-store.ts` |
| UI: печать бирки (бренд) | `src/components/brand/marketing/showroom-sample-tag-dialog.tsx` |
| UI: сканер (байер) | `src/app/shop/b2b/scanner/page.tsx` |
| Внутренний артикул у образца | поле `internalArticleCode` в `src/lib/types/samples.ts` |
| Типы сессии (заготовка под прод) | `src/lib/fashion/showroom-scan-session.types.ts` |

## Как пользоваться (сейчас)

1. В **маркетинге / образцах** открыть «Бирка QR / штрихкод» по образцу — при открытии диалога вызывается `POST /api/showroom-sample` с payload образца (включая `internalArticleCode`, если задан в данных).
2. В sessionStorage кэшируется `srs-…` на ключ `synth1.showroomRegistryIdForSample.<id образца>` — повторное открытие не плодит новые id до очистки кэша / «Повторить регистрацию».
3. **QR** ведёт на `ROUTES.shop.b2bScanner` с `?sampleId=srs-…`.
4. **Штрихкод** кодирует только `srs-…`; на сканере вводится эта строка → `GET /api/showroom-sample/:id` → строка в списке с именем/SKU и т.д. с сервера.
5. Legacy: `?add=<base64url>` и строка `SYNTH1|…` по-прежнему обрабатываются на сканере.

## Прод (чеклист)

- Заменить in-memory store на **БД или Redis** (TTL, индекс по id, при необходимости привязка к `buyer_session_id` / заказу).
- Защита **POST** (роль бренда / API key), лимиты и аудит.
- **Синхронизация списка** между устройствами — отдельная сущность сессии + API append/list; типы-заготовки в `showroom-scan-session.types.ts`.
- При горизонтальном масштабировании — общий стор для `srs-` id, не локальная память процесса.

