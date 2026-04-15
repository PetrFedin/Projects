# Корневая папка `lib/` (не путать с `src/lib`)

В Next-проекте алиас **`@/lib/*`** настроен на **`src/lib/*`** (см. `tsconfig.json`). Эта директория **`lib/`** у корня — **legacy / демо-каталог** (узкий набор типов и `products`).

- Новые типы и бизнес-логика — только в **`src/lib/`**.
- Если нужен один канон для Product/UserProfile и т.д., правьте **`src/lib/types.ts`** (и связанные модули).

Подробнее: **`SOURCE_OF_TRUTH.md`** → раздел «Типы и каталоги».

## Domain events health contract (consumer quickstart)

Для внешних проверок/алертинга используйте канонический runtime-валидатор из
**`src/lib/server/domain-events-health.ts`**:

```ts
import { validateDomainEventsHealthContract } from '@/lib/server/domain-events-health';

const validation = validateDomainEventsHealthContract({
  payload: healthJson,
  headers: {
    'x-request-id': response.headers.get('x-request-id'),
    'x-domain-events-health-contract-version': response.headers.get(
      'x-domain-events-health-contract-version'
    ),
  },
});

if (!validation.ok) {
  console.error('health contract mismatch', validation.errors);
}
```

Канонические метаданные контракта:
- **`DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA.version`**
- **`DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA.requiredResponseKeys`**
- **`DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA.requiredHeaderKeys`**
- В **`thresholds`** сервер дублирует числовые пороги, включая **`recentFailureWarn`** (источник: env **`EVENTS_HEALTH_RECENT_FAILURES_WARN`**, по умолчанию `1`); список env и смысл сигналов — **`SOURCE_OF_TRUTH.md`**.
- В **`bus`** поле **`lastFailureAt`** — время последнего **trip** circuit breaker шины (не каждой ошибки handler’а); сбрасывается после стабильного успешного `publish` при закрытом breaker; см. **`DomainEventBusHealthSnapshot`** в **`src/lib/order/domain-events.ts`**.
- Live-probe контракта health: без **`DOMAIN_EVENTS_HEALTH_URL`** скрипт **`check:domain-events-health-contract`** **пропускается** (exit `0`); в CI задайте URL и при необходимости **`DOMAIN_EVENTS_HEALTH_CONTRACT_STRICT=1`**, чтобы отсутствие URL было ошибкой. Агрегатор **`npm run check:contracts`** теперь вызывает и этот шаг.

CI-проба endpoint (runtime-safe default): **`npm run check:domain-events-health-contract`**. Typed-вариант для локальной dev-диагностики: **`npm run check:domain-events-health-contract:typed`** (нужен `tsx`). Для читаемого вывода локально: **`DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT=pretty`**; только **`json`** или **`pretty`**, иначе используется **`json`** и печатается предупреждение **`output_format_invalid`**.
Согласованность typed/fallback раннеров: **`npm run check:domain-events-health-runner-parity`**.
