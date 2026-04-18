'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CreditCard, TrendingUp, Clock, AlertTriangle, DollarSign, Loader2 } from 'lucide-react';
import { usePaymentData } from '@/hooks/usePaymentData';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export function PaymentHubWidget() {
  const { creditLine, paymentMethods, outstandingInvoices, isLoading } = usePaymentData();

  if (isLoading) {
    return (
      <Card className="rounded-xl border-2 border-blue-100 shadow-xl">
        <CardContent className="flex items-center justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border-2 border-blue-100 shadow-xl">
<<<<<<< HEAD
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-cyan-50">
=======
      <CardHeader className="border-border-subtle border-b bg-gradient-to-r from-blue-50 to-cyan-50">
>>>>>>> recover/cabinet-wip-from-stash
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-text-primary text-sm font-black uppercase tracking-tight">
              Payment & Credit
            </CardTitle>
<<<<<<< HEAD
            <p className="text-[10px] font-medium text-slate-500">Your financial overview</p>
=======
            <p className="text-text-secondary text-[10px] font-medium">Your financial overview</p>
>>>>>>> recover/cabinet-wip-from-stash
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-4">
        {/* Credit Line */}
        <div className="space-y-3">
<<<<<<< HEAD
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
=======
          <h4 className="text-text-muted flex items-center gap-2 text-xs font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Your Credit Line
          </h4>

          <div className="rounded-xl bg-blue-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-base font-black tabular-nums tracking-tight text-blue-900">
                  {creditLine.available.toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-[10px] font-bold uppercase text-blue-600">Available Credit</p>
              </div>

              <div className="text-right">
<<<<<<< HEAD
                <p className="text-sm font-black tabular-nums tracking-tight text-slate-600">
                  {creditLine.limit.toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-[10px] font-bold uppercase text-slate-500">Total Limit</p>
=======
                <p className="text-text-secondary text-sm font-black tabular-nums tracking-tight">
                  {creditLine.limit.toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-text-secondary text-[10px] font-bold uppercase">Total Limit</p>
>>>>>>> recover/cabinet-wip-from-stash
              </div>
            </div>

            <Progress value={(creditLine.used / creditLine.limit) * 100} className="mb-2 h-2" />

            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-[10px] font-bold">
                {creditLine.used.toLocaleString('ru-RU')} ₽ used
              </span>
              <Link
<<<<<<< HEAD
                href="/shop/b2b/finance/increase-limit"
=======
                href={ROUTES.shop.b2bFinanceIncreaseLimit}
>>>>>>> recover/cabinet-wip-from-stash
                className="text-[10px] font-black uppercase text-blue-600 hover:underline"
              >
                Increase Limit →
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
<<<<<<< HEAD
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
=======
        <div className="border-border-subtle space-y-3 border-t pt-4">
          <h4 className="text-text-muted text-xs font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Pay This Order
          </h4>

          <RadioGroup defaultValue={paymentMethods[0]?.id}>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
<<<<<<< HEAD
                className="flex cursor-pointer items-center space-x-3 rounded-xl border-2 border-slate-100 p-3 transition-colors hover:border-blue-300"
=======
                className="border-border-subtle flex cursor-pointer items-center space-x-3 rounded-xl border-2 p-3 transition-colors hover:border-blue-300"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <RadioGroupItem value={method.id} id={method.id} />
                <Label
                  htmlFor={method.id}
                  className="flex flex-1 cursor-pointer items-center justify-between"
                >
                  <div className="flex items-center gap-2">
<<<<<<< HEAD
                    <span className="text-sm font-bold text-slate-900">{method.name}</span>
=======
                    <span className="text-text-primary text-sm font-bold">{method.name}</span>
>>>>>>> recover/cabinet-wip-from-stash
                    {method.badge && (
                      <Badge
                        className={cn(
                          'border-none text-[7px] font-black uppercase',
                          method.badgeColor || 'bg-emerald-100 text-emerald-700'
                        )}
                      >
                        {method.badge}
                      </Badge>
                    )}
                  </div>
                  {method.dueDate && (
<<<<<<< HEAD
                    <span className="text-[10px] text-slate-500">Due {method.dueDate}</span>
=======
                    <span className="text-text-secondary text-[10px]">Due {method.dueDate}</span>
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Outstanding Invoices */}
<<<<<<< HEAD
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
=======
        <div className="border-border-subtle space-y-3 border-t pt-4">
          <h4 className="text-text-muted flex items-center gap-2 text-xs font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            <Clock className="h-4 w-4 text-amber-600" />
            Outstanding Invoices
          </h4>

          <div className="space-y-2">
            {outstandingInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className={cn(
                  'flex items-center justify-between rounded-xl p-3',
<<<<<<< HEAD
                  invoice.isOverdue ? 'border-2 border-rose-200 bg-rose-50' : 'bg-slate-50'
=======
                  invoice.isOverdue ? 'border-2 border-rose-200 bg-rose-50' : 'bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
                )}
              >
                <div className="flex items-center gap-2">
                  {invoice.isOverdue && (
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 text-rose-600" />
                  )}
                  <div>
<<<<<<< HEAD
                    <p className="text-sm font-bold text-slate-900">{invoice.number}</p>
                    <p className="text-[10px] text-slate-500">
=======
                    <p className="text-text-primary text-sm font-bold">{invoice.number}</p>
                    <p className="text-text-secondary text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                      {invoice.amount.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {invoice.isOverdue ? (
                    <Badge className="bg-rose-600 text-[7px] font-black uppercase text-white">
                      Overdue {invoice.daysOverdue}d
                    </Badge>
                  ) : (
                    <span className="text-text-secondary text-[10px] font-bold">
                      Due in {invoice.daysUntilDue} days
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {outstandingInvoices.length > 0 && (
            <Button className="h-11 w-full rounded-xl text-[10px] font-black uppercase">
              <DollarSign className="mr-2 h-4 w-4" />
              Pay All Outstanding
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
