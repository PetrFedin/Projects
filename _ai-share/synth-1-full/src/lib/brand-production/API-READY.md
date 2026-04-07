# Подключение API

Замените вызовы `loadBrandProductionState` / `saveBrandProductionState` на:

- `GET /api/v1/brand/production/state` → `BrandProductionState`
- `PATCH /api/v1/brand/production/articles/:id/lifecycle` → тело `{ stage }`, ответ `{ state }` или ошибка с `reason`
- `PATCH /api/v1/brand/production/integration` → `IntegrationConfigEntity`

Аудит и проверки правил выполняются на сервере; клиент только отображает ответы.
