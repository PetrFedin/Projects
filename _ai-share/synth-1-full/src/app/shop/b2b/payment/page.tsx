'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreditCard, ArrowLeft, DollarSign, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { getCreditForCurrentPartner } from '@/lib/b2b/credit-check';
import { getPartnerFinanceRollup } from '@/lib/b2b/partner-finance-rollup';
import { recordPayment } from '@/lib/b2b/credit-store';
import { parseAmount } from '@/lib/b2b/partner-finance-rollup';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { useToast } from '@/hooks/use-toast';

export default function B2BPaymentPage() {
  const searchParams = useSearchParams();
  const orderIdFromQuery = searchParams.get('orderId');
  const { toast } = useToast();
  const [paymentsVersion, setPaymentsVersion] = useState(0);
  const [payDialogOrderId, setPayDialogOrderId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');

  const credit = getCreditForCurrentPartner();
  const rollup = getPartnerFinanceRollup();
  const formatMoney = (n: number) => n.toLocaleString('ru-RU', { maximumFractionDigits: 0 }) + ' ₽';

  const refresh = useCallback(() => setPaymentsVersion((v) => v + 1), []);

  const handleOpenPayDialog = (orderId: string, orderTotal: number) => {
    setPayDialogOrderId(orderId);
    setPayAmount(String(Math.min(orderTotal, credit.available)));
  };

  const handleConfirmPayment = () => {
    if (!payDialogOrderId || !payAmount.trim()) return;
    const amount = parseFloat(payAmount.replace(/\s/g, '').replace(',', '.')) || 0;
    if (amount <= 0) {
      toast({ title: 'Введите сумму', variant: 'destructive' });
      return;
    }
    if (amount > credit.available) {
      toast({ title: 'Сумма превышает доступный лимит', variant: 'destructive' });
      return;
    }
    recordPayment(payDialogOrderId, amount);
    refresh();
    setPayDialogOrderId(null);
    setPayAmount('');
    toast({ title: 'Оплата проведена', description: `${formatMoney(amount)} за заказ ${payDialogOrderId}` });
  };

  const awaiting = rollup.ordersAwaitingPayment;
  const orderIdToTotal = Object.fromEntries(
    awaiting.map((o) => [o.order, parseAmount(o.amount ?? '0 ₽')])
  );

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6" /> JOOR Pay
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Оплата заказов внутри платформы. Кредитный лимит обновляется в реальном времени после оплаты.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-indigo-600" /> Доступный лимит
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-black text-slate-900">{formatMoney(credit.available)}</p>
            <p className="text-xs text-slate-500">из {formatMoney(credit.limit)} · использовано {formatMoney(credit.used)}</p>
            {credit.blocked && (
              <Badge variant="destructive" className="mt-2 text-[9px] font-black">Лимит исчерпан</Badge>
            )}
          </CardContent>
        </Card>
        <Card className="border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-600" /> Ожидает оплаты
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-black text-amber-700">{formatMoney(rollup.awaitingPayment)}</p>
            <p className="text-xs text-slate-500">{rollup.ordersAwaitingPayment.length} заказ(ов)</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase">Оплатить заказы</CardTitle>
          <CardDescription>
            Выберите заказ и введите сумму. После оплаты лимит и список «ожидает оплаты» обновятся (realtime).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {awaiting.length === 0 ? (
            <p className="text-slate-500 text-sm">Нет заказов, ожидающих оплаты.</p>
          ) : (
            <ul className="space-y-2">
              {awaiting.map((o) => {
                const orderTotal = orderIdToTotal[o.order] ?? 0;
                const isHighlight = orderIdFromQuery === o.order;
                return (
                  <li
                    key={o.order}
                    className={`flex items-center justify-between py-3 px-4 rounded-xl border ${isHighlight ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-100 bg-slate-50/50'}`}
                  >
                    <div>
                      <span className="font-mono font-bold">{o.order}</span>
                      <span className="text-slate-500 ml-2">{o.brand}</span>
                      <span className="ml-2 font-medium text-amber-700">{o.amount}</span>
                      {o.paidAmount != null && o.paidAmount > 0 && (
                        <span className="ml-2 text-xs text-slate-500">оплачено {formatMoney(o.paidAmount)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="rounded-lg font-black uppercase text-[10px]"
                        onClick={() => handleOpenPayDialog(o.order, orderTotal)}
                      >
                        <CreditCard className="h-3.5 w-3.5 mr-1" /> Оплатить
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-lg text-[10px]" asChild>
                        <Link href={`${ROUTES.shop.b2bOrders}/${o.order}`}>Детали</Link>
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <Button variant="outline" className="rounded-xl mt-2" asChild>
            <Link href={ROUTES.shop.b2bFinance}>Финансы партнёра</Link>
          </Button>
        </CardContent>
      </Card>

      <Dialog open={!!payDialogOrderId} onOpenChange={(open) => !open && setPayDialogOrderId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Оплата заказа {payDialogOrderId}</DialogTitle>
            <DialogDescription>Сумма спишется с кредитного лимита. Доступно: {formatMoney(credit.available)}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label htmlFor="pay-amount">Сумма (₽)</Label>
            <Input
              id="pay-amount"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayDialogOrderId(null)}>Отмена</Button>
            <Button onClick={handleConfirmPayment}>Провести оплату</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RelatedModulesBlock
        title="Связанные разделы"
        links={getShopB2BHubLinks().filter((l) =>
          [ROUTES.shop.b2bFinance, ROUTES.shop.b2bOrders].includes(l.href as string)
        )}
      />
    </div>
  );
}
