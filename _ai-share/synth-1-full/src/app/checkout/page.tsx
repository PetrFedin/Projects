'use client';

import CheckoutForm from '@/components/checkout-form';
import OrderSummary from '@/components/order-summary';
import { UIStateProvider } from '@/providers/ui-state';
<<<<<<< HEAD
=======
import { RegistryPageShell } from '@/components/design-system';
>>>>>>> recover/cabinet-wip-from-stash

export default function CheckoutPage() {
  return (
    <UIStateProvider>
      <div className="bg-background">
<<<<<<< HEAD
        <div className="container mx-auto px-4 py-12">
=======
        <RegistryPageShell className="py-12 pb-16">
>>>>>>> recover/cabinet-wip-from-stash
          <header className="mb-12 text-center">
            <h1 className="font-headline text-sm font-bold">Оформление заказа</h1>
          </header>

          <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
            <div>
              <CheckoutForm />
            </div>
            <div className="sticky top-24">
              <OrderSummary />
            </div>
          </div>
<<<<<<< HEAD
        </div>
=======
        </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
      </div>
    </UIStateProvider>
  );
}
