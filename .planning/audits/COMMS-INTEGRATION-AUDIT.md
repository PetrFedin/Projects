# Comms integration audit (чат ↔ календарь)

Дата: 2026-06-04. Контур: Platform Core, 4 роли, столп «Связь».

## Закрыто в этой волне

| Область | Было | Стало |
|---------|------|-------|
| `CommsPillarCard` supplier | messages/calendar шли в manufacturer | `factorySupplierMessagesB2bOrderContextHref` + `factorySupplierCalendarB2bOrderContextHref` |
| Supplier calendar href | `/factory/production/calendar` → RouteGuard redirect | `/factory/calendar?role=supplier` (вне production ACL) |
| `PlatformCoreCommsCrossNav` | orderId только из demo | + `order`/`orderId` из URL (`useSearchParams`) |
| Brand calendar | `b2b-events` без единого API | `usePlatformCoreCalendarEvents` (как shop/factory) + w2-events |
| `b2b-events` API | без `targetChatId` на сервере | обогащение `targetChatId` (parity с platform-core) |
| B2B реестры brand/shop | «Нет сообщений» — тупик | `B2bOrderThreadPreviewHint` → «Начать чат» |
| E2e | cross-nav не матричный | `core-13` + `core-14` (banner dedupe, templates) |
| B2B шаблоны | `onSmartReply` no-op в slimCore | `PlatformCoreB2bMessageTemplates` (4+2 шаблона) |

## Golden path (работает)

- Cross-nav на messages/calendar workspace (brand, shop, manufacturer, supplier)
- Calendar event → чат по `targetChatId` (`calendar-event-chat-button`)
- Factory inbox merge + placeholder B2B threads
- `core-02` столп 5 + `core-13` cross-nav matrix

## Остаток (честно, не 9+)

| Приоритет | Пробел |
|-----------|--------|
| P1 | Ручной UAT 69 разделов (`SECTION-AUDIT-UAT-CHECKLIST.md`) |
| P1 | Полный `core:verify` без flaky (hub cold-start, legacy redirect 30s timeouts) |
| P2 | Push-уведомления, пользовательские шаблоны, shop retail calendar copy |
| P2 | Shop «два календаря» (retail vs b2b) — документировать в UI |
| P2 | Рабочее название артикула (article line) — round-trip в PG из UI W2 |

## Проверка

```bash
npm run dev:core
npm run db:core:bootstrap
npm run test:e2e:core   # включает core-02 + core-13
```
