import { cn } from '@/lib/utils';

/**
 * Локальный «wholesale desk» (NuOrder / JOOR плотность) без смены глобальной темы.
 *
 * **Где использовать:** контур оптового заказа `/shop/b2b/*` (`ShopB2bNuOrderScope`); контент `/client/me`
 * (`UserCabinetLayout` + `canvas`); весь хаб **`/client/*`** (`ClientCabinetShell` + `clientCabinetHubScope`).
 *
 * **Политика акцента:** не трогаем семантические токены приложения — только потомки внутри
 * обёртки (`canvas`). «Везде как NuOrder» = отдельный проект на уровне темы + все кабинеты.
 *
 * **Первичный контур (пахнет NuOrder первым):** `order-mode`, `order-modes`, `create-order`,
 * `quick-order`, `working-order`, `orders`, `orders/[orderId]`, `ez-order`, `reorder`; матрица
 * `/shop/b2b/matrix` — обернуть в `ShopB2bNuOrderScope` при снятии `.cursorignore` с `matrix/page.tsx`.
 */
export const nuOrderDeskShell = {
  canvas: cn(
    'w-full max-w-[min(100%,1320px)] space-y-3 rounded-sm border border-[#c5ccd6] bg-[#e6e9ef] p-3 text-[13px] leading-snug text-slate-800 antialiased shadow-sm sm:p-4',
    '[&_h1]:text-[16px] [&_h1]:font-semibold [&_h1]:normal-case [&_h1]:tracking-tight [&_h1]:text-[#1a2433]',
    '[&_h2]:text-[15px] [&_h2]:font-semibold [&_h2]:normal-case [&_h2]:tracking-tight [&_h2]:text-[#1a2433]',
    '[&_.text-text-secondary]:text-[12px] [&_.text-text-secondary]:leading-snug [&_.text-text-secondary]:text-[#5b6675]',
    '[&_.text-text-muted]:text-[11px] [&_.text-text-muted]:text-[#6b7788]',
    '[&_.text-muted-foreground]:text-[#6b7788]',
    '[&_nav.text-text-muted]:text-[#6b7788]',
    '[&_nav_a]:font-medium [&_nav_a]:text-[#0b63ce] [&_nav_a:hover]:text-[#094d9e]',
    '[&_button]:text-[11px] [&_button]:font-semibold [&_button]:tracking-normal',
    '[&_button.h-8]:h-7 [&_button.h-9]:h-8',
    '[&_button.bg-primary]:bg-[#0b63ce] [&_button.bg-primary]:text-white [&_button.bg-primary:hover]:bg-[#0954b0]',
    '[&_button.border-input]:border-[#b8c0cc] [&_button.border-input]:bg-white [&_button.border-input]:text-[#1a2433]',
    '[&_[role=tablist]]:rounded-sm [&_[role=tablist]]:border-[#bcc3ce] [&_[role=tablist]]:bg-[#dde1e8] [&_[role=tablist]]:p-0.5',
    '[&_[role=tab]]:text-[11px] [&_[role=tab]]:font-medium [&_[role=tab]]:normal-case [&_[role=tab]]:tracking-normal [&_[role=tab]]:text-[#4a5568]',
    '[&_[role=tab][data-state=active]]:!bg-white [&_[role=tab][data-state=active]]:!text-[#0b63ce] [&_[role=tab][data-state=active]]:!shadow-none',
    '[&_.bg-card]:bg-white',
    '[&_.rounded-lg.border.bg-card]:rounded-sm [&_.rounded-lg.border.bg-card]:border-[#c5ccd6] [&_.rounded-lg.border.bg-card]:shadow-none',
    '[&_.border-border-subtle]:border-[#c5ccd6]',
    '[&_a.text-accent-primary]:text-[#0b63ce] [&_a.text-accent-primary:hover]:text-[#094d9e]',
    '[&_.text-accent-primary]:text-[#0b63ce]'
  ),
  /** Нижняя граница шапки — перекрывает `border-border-subtle` у `registryFeedLayout.headerRow`. */
  headerRow: '!border-[#c5ccd6]',

  /**
   * Корень `ClientCabinetShell` только для `pathname.startsWith('/client')`: фон приложения,
   * сайдбар, крошки хаба, H1 — в тон NuOrder/JOOR без смены глобальной темы.
   */
  clientCabinetHubScope: cn(
    '!bg-[#dfe2e8]',
    '[&>aside]:!border-[#bcc3ce] [&>aside]:lg:!bg-[#eef0f4]',
    '[&_.text-accent-primary]:!text-[#4a5fc8]',
    '[&_h1.truncate]:!text-[#1a2433] [&_h1.truncate]:!text-base [&_h1.truncate]:!font-semibold [&_h1.truncate]:!normal-case [&_h1.truncate]:!tracking-tight',
    '[&_.border-border-subtle]:border-[#c5ccd6]',
    '[&_.text-text-muted]:text-[#6b7788]',
    '[&_.text-text-secondary]:text-[#5b6675]'
  ),

  /**
   * Единый акцент личного кабинета клиента: между «синим NuOrder» (#0b63ce) и фиолетовым маркетингом,
   * чтобы панель и контент (в т.ч. академия) визуально согласованы.
   */
  clientCabinetAccentHex: '#4a5fc8',

  /** Плитка иконки хаба и вертикальный акцент у `CabinetHubSectionBar`. */
  clientCabinetHubIconTile:
    'bg-[#4a5fc8] text-white shadow-sm ring-1 ring-[#94a3b8]/40',
  clientCabinetHubAccentRail: 'bg-[#4a5fc8]',
} as const;
