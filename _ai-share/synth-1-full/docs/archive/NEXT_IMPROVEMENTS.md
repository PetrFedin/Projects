# Следующие 10 пунктов для развития проекта

Рекомендуемый порядок улучшений MVP Syntha после текущей интеграции.

---

## 1. Реальные API вместо моков
Подключить бэкенд (FastAPI) к Brand Profile, B2B Orders, Retailers, Integrations. Заменить локальный state на данные из `fastApiService` / React Query. Добавить пагинацию и фильтры на стороне сервера.

---

## 2. Обработка ошибок и Loading — частично сделано
- Error boundaries на роутах: brand, admin, shop, factory, distributor
- Skeleton-компоненты уже есть (`@/components/ui/skeleton`); подключить к Brand Profile, B2B при загрузке
- Retry для API: `fetchFromApi` — retry при 5xx и network fail (до 2 попыток)
- 404: `app/not-found.tsx`; 500: `app/error.tsx` с `reportError`

---

## 3. Аутентификация и права
- Разграничение по ролям (admin, brand, shop, etc.) — RolePanel, useAuth
- `RouteGuard` в `@/components/route-guard` — подключить в layout для admin/brand
- Проверка `profile.role` перед доступом к sensitive-разделам
- Сессия: refresh token, logout, redirect на login

---

## 4. Интеграции (1С, CDEK, Ozon)
- `useBrandProfileSync` + `retryIntegration` для ручного retry
- Реальная синхронизация через FastAPI, лог ошибок
- Webhooks для входящих событий
- Маппинг полей (attributes, prices, stock)

---

## 5. Маркировка и Compliance (Честный ЗНАК)
- Подключение к ГИС МТ
- Синхронизация остатков (КИЗ)
- ЭДО: отправка УПД, счёт-фактура
- Уведомления при расхождениях

---

## 6. E2E-тесты
- Playwright: `playwright.config.ts`, `e2e/brand-profile.spec.ts`, `npm run test:e2e`
- Добавить: Brand Profile → Retailers, B2B Orders, Production, auth, смена роли
- CI: `playwright test` перед деплоем

---

## 7. P&L и финансы
- P&L отчёт из FastAPI
- Escrow: этапы оплаты, статусы
- Landed Cost: расчёт себестоимости
- Экспорт в PDF/Excel

---

## 8. Уведомления
- `useNotificationPolling(brandId)` — polling на Brand Profile каждые 90 сек
- Toast при росте openB2bOrders
- WebSocket, настройки: email, push, in-app

---

## 9. Мобильная версия
- Класс `.touch-target` (min 44px) в `globals.css` — подключать к кнопкам
- Адаптивная верстка основных экранов
- PWA / офлайн-режим для критичных операций

---

## 10. Мониторинг и логирование
- `@/lib/logger`: `reportError`, `logApiError` — используется в ErrorBoundary и error.tsx
- API-ошибки логируются через fastapi-service
- TODO: Sentry, метрики (время ответа, успешность)
