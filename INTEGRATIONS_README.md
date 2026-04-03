# Интеграции РФ — Подключение

Инфраструктура для подключения российских сервисов. Для работы нужны учётные данные в `.env`.

## Переменные окружения (.env)

См. `.env.example`. Скопируйте и заполните:

```bash
cp .env.example .env
```

## Честный ЗНАК (CRPT)

- **Переменные:** `CRPT_CLIENT_ID`, `CRPT_CLIENT_SECRET`
- **Сервис:** `app/integrations/crpt.py`
- **Использование:** ComplianceService вызывает CRPT при эмиссии кодов (`POST /compliance/marking/emit`)
- **Без настроек:** используется симуляция (локальная генерация кодов)

## ЭДО (Диадок/Контур)

- **Переменные:** `DIADOC_API_KEY` или `KONTUR_EDO_TOKEN`, `KONTUR_EDO_API_URL`
- **Сервис:** `app/integrations/edo.py`
- **Использование:** подписание документов (`POST /compliance/edo/{doc_id}/sign`)

## 1С

- **Переменные:** `C1C_BASE_URL`, `C1C_USER`, `C1C_PASSWORD`
- **Сервис:** `app/integrations/c1c.py`
- **Использование:** синхронизация заказов, остатков (API расширяется под ваш 1С HTTP-сервис)

## СДЭК

- **Переменные:** `CDEK_CLIENT_ID`, `CDEK_CLIENT_SECRET`
- **Сервис:** `app/integrations/cdek.py`
- **Использование:**
  - `POST /logistics/calculate-delivery` — расчёт доставки
  - `GET /logistics/shipments/{order_id}` — трекинг (при привязке CDEK UUID к заказу)

## Оплата (СБП / Тинькофф)

- **Переменные:** `TINKOFF_TERMINAL_KEY`, `TINKOFF_SECRET_KEY` или `SBP_MERCHANT_ID`
- **Сервис:** `app/integrations/payment.py`
- **Использование:**
  - `POST /fintech/payments/init` — создание платежа
  - `GET /fintech/payments/{payment_id}/status` — статус платежа

## Статус интеграций

`GET /brand/integrations/status/{brand_id}` — проверка настроек и доступности каждой интеграции.
