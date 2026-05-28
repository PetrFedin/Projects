# Phase 13: Collaborative Workspace - Discovery

## Current State
- We have basic chat functionality (`StageChatPanel`, `order-chat.ts`, `OrderChatBot.tsx`).
- We have a basic notification center (`NotificationsCenter.tsx`, `WebSocketNotificationsBridge.tsx`).
- We have a vendor connect mock (`vendor-connect.ts`).

## Goal
Связь всех участников цепочки (бренд, конструктор, поставщик, швея) в едином контексте артикула.

## Requirements
1. **Contextual Threading:** Привязка веток чата к конкретному шву, строке BOM или точке на 3D-аватаре.
2. **External Vendor Portal:** Ограниченный веб-доступ для фабрик и поставщиков (просмотр ТЗ, загрузка сертификатов, внесение предложений без доступа к экономике бренда).
3. **Event Notification Hub:** Push/Email уведомления о смене статуса PO, задержках сырья или результатах ОТК.

## Proposed Architecture

### 1. Contextual Threading
- Extend `LiveProcessComment` or create a new `ContextualThread` model.
- Add `contextType` (e.g., 'seam', 'bom_row', '3d_point') and `contextId` (e.g., BOM item ID, seam ID).
- UI component: `ContextualChatThread.tsx` that can be embedded next to BOM rows or 3D viewer.

### 2. External Vendor Portal
- New layout/route: `/vendor/...` or `/b2b/vendor/...`
- RBAC: Vendor role (`VENDOR`).
- Features:
  - View Tech Pack (read-only, no pricing).
  - Upload certificates (file upload mock).
  - Submit proposals/bids.
- Components: `VendorPortalLayout.tsx`, `VendorTechPackView.tsx`, `VendorDocumentUpload.tsx`.

### 3. Event Notification Hub
- Extend existing `WebSocketNotificationsBridge` and `NotificationsCenter`.
- Add specific event triggers for PO status change, raw material delays, QC results.
- Create a mock email/push service or just log to console for now, but show in the UI notification center.
- Add notification preferences for users (Email, Push, In-App).

## Dependencies
- Phase 10 (QC) for QC results.
- Phase 1 (Tech Pack) for Tech Pack viewing.
- Phase 8 (BOM) for BOM rows.
