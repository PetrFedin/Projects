'use client';

import CheckoutForm from "@/components/checkout-form";
import OrderSummary from "@/components/order-summary";
import { UIStateProvider } from "@/providers/ui-state";

export default function CheckoutPage() {
    return (
        <UIStateProvider>
            <div className="bg-background">
                <div className="container mx-auto px-4 py-12">
                    <header className="text-center mb-12">
                        <h1 className="text-sm font-bold font-headline">Оформление заказа</h1>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
                        <div>
                            <CheckoutForm />
                        </div>
                        <div className="sticky top-24">
                            <OrderSummary />
                        </div>
                    </div>
                </div>
            </div>
        </UIStateProvider>
    );
}
