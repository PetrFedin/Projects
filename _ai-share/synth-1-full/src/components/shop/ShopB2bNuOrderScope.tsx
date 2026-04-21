'use client';

import type { ComponentProps } from 'react';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { nuOrderDeskShell } from '@/lib/ui/nuorder-desk-shell';
import { cn } from '@/lib/utils';

export type ShopB2bNuOrderScopeProps = ComponentProps<typeof CabinetPageContent> & {
  /** Доп. класс на внутренний canvas. */
  canvasClassName?: string;
};

/**
 * Оболочка B2B-контура заказа: серый холст, плотная типографика, синий акцент — без глобальных токенов.
 * См. `nuorder-desk-shell.ts`.
 */
export function ShopB2bNuOrderScope({
  children,
  className,
  maxWidth = 'full',
  canvasClassName,
  ...rest
}: ShopB2bNuOrderScopeProps) {
  return (
    <CabinetPageContent
      maxWidth={maxWidth}
      className={cn('space-y-4 px-0 py-2 pb-16', className)}
      {...rest}
    >
      <div
        className={cn(nuOrderDeskShell.canvas, canvasClassName)}
        data-testid="shop-b2b-nuorder-scope"
      >
        {children}
      </div>
    </CabinetPageContent>
  );
}
