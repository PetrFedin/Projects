
'use client';
import { PaymentMethods } from "@/components/user/payment-methods";
import { LoyaltyStatus } from "@/components/user/loyalty-status";
import { SavedComparisons } from "@/components/user/saved-comparisons";
import { MyPreorders } from "@/components/user/my-preorders";

export default function PaymentsPage() {
    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-base font-bold font-headline">Оплата и бонусы</h1>
                <p className="text-muted-foreground">Управляйте вашими способами оплаты и бонусным счетом.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
                <div className="lg:col-span-2">
                    <PaymentMethods />
                </div>
                <div className="lg:col-span-1">
                    <LoyaltyStatus />
                </div>
            </div>
            
        </div>
    );
}
