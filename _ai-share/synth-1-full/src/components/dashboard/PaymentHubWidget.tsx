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
      <CardHeader className="border-border-subtle border-b bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-text-primary text-sm font-black uppercase tracking-tight">
              Payment & Credit
            </CardTitle>
            <p className="text-text-secondary text-[10px] font-medium">Your financial overview</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-4">
        {/* Credit Line */}
        <div className="space-y-3">
          <h4 className="text-text-muted flex items-center gap-2 text-xs font-black uppercase tracking-widest">
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
                <p className="text-text-secondary text-sm font-black tabular-nums tracking-tight">
                  {creditLine.limit.toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-text-secondary text-[10px] font-bold uppercase">Total Limit</p>
              </div>
            </div>

            <Progress value={(creditLine.used / creditLine.limit) * 100} className="mb-2 h-2" />

            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-[10px] font-bold">
                {creditLine.used.toLocaleString('ru-RU')} ₽ used
              </span>
              <Link
                href={ROUTES.shop.b2bFinanceIncreaseLimit}
                className="text-[10px] font-black uppercase text-blue-600 hover:underline"
              >
                Increase Limit →
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-border-subtle space-y-3 border-t pt-4">
          <h4 className="text-text-muted text-xs font-black uppercase tracking-widest">
            Pay This Order
          </h4>

          <RadioGroup defaultValue={paymentMethods[0]?.id}>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="border-border-subtle flex cursor-pointer items-center space-x-3 rounded-xl border-2 p-3 transition-colors hover:border-blue-300"
              >
                <RadioGroupItem value={method.id} id={method.id} />
                <Label
                  htmlFor={method.id}
                  className="flex flex-1 cursor-pointer items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary text-sm font-bold">{method.name}</span>
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
                    <span className="text-text-secondary text-[10px]">Due {method.dueDate}</span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Outstanding Invoices */}
        <div className="border-border-subtle space-y-3 border-t pt-4">
          <h4 className="text-text-muted flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            <Clock className="h-4 w-4 text-amber-600" />
            Outstanding Invoices
          </h4>

          <div className="space-y-2">
            {outstandingInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className={cn(
                  'flex items-center justify-between rounded-xl p-3',
                  invoice.isOverdue ? 'border-2 border-rose-200 bg-rose-50' : 'bg-bg-surface2'
                )}
              >
                <div className="flex items-center gap-2">
                  {invoice.isOverdue && (
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 text-rose-600" />
                  )}
                  <div>
                    <p className="text-text-primary text-sm font-bold">{invoice.number}</p>
                    <p className="text-text-secondary text-[10px]">
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
