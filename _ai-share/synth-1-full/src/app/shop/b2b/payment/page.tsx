'use client';

import { RegistryPageShell } from '@/components/design-system';
import { tid } from '@/lib/ui/test-ids';

import { useSearchParamsNonNull } from '@/hooks/use-search-params-non-null';
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
import { CreditCard, DollarSign, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { getCreditForCurrentPartner } from '@/lib/b2b/credit-check';
import { getPartnerFinanceRollup } from '@/lib/b2b/partner-finance-rollup';
import { recordPayment } from '@/lib/b2b/credit-store';
import { parseAmount } from '@/lib/b2b/partner-finance-rollup';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { useToast } from '@/hooks/use-toast';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
import { B2bMarginAnalysisHubButton } from '@/components/shop/B2bMarginAnalysisHubButton';

export default function B2BPaymentPage() {
  const searchParams = useSearchParamsNonNull();
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
    toast({
      title: 'Оплата проведена',
      description: `${formatMoney(amount)} за заказ ${payDialogOrderId}`,
    });
  };

  const awaiting = rollup.ordersAwaitingPayment;
  const orderIdToTotal = Object.fromEntries(
    awaiting.map((o) => [o.order, parseAmount(o.amount ?? '0 ₽')])
  );

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-4xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <CreditCard className="h-6 w-6" /> JOOR Pay
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Оплата заказов внутри платформы. Кредитный лимит обновляется в реальном времени после
            оплаты.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-tight">
              <DollarSign className="h-4 w-4 text-indigo-600" /> Доступный лимит
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-black text-slate-900">{formatMoney(credit.available)}</p>
            <p className="text-xs text-slate-500">
=======
    <RegistryPageShell className="max-w-4xl space-y-6" data-testid={tid.page('shop-b2b-payment')}>
      <ShopB2bContentHeader lead="Оплата заказов внутри платформы; кредитный лимит обновляется после оплаты (JOOR Pay)." />
      <ShopAnalyticsSegmentErpStrip />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-tight">
              <DollarSign className="text-accent-primary h-4 w-4" /> Доступный лимит
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-text-primary text-2xl font-black">{formatMoney(credit.available)}</p>
            <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
              из {formatMoney(credit.limit)} · использовано {formatMoney(credit.used)}
            </p>
            {credit.blocked && (
              <Badge variant="destructive" className="mt-2 text-[9px] font-black">
                Лимит исчерпан
              </Badge>
            )}
          </CardContent>
        </Card>
        <Card className="border-border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-tight">
              <CheckCircle2 className="h-4 w-4 text-amber-600" /> Ожидает оплаты
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-black text-amber-700">
              {formatMoney(rollup.awaitingPayment)}
            </p>
<<<<<<< HEAD
            <p className="text-xs text-slate-500">
=======
            <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
              {rollup.ordersAwaitingPayment.length} заказ(ов)
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase">Оплатить заказы</CardTitle>
          <CardDescription>
            Выберите заказ и введите сумму. После оплаты лимит и список «ожидает оплаты» обновятся
            (realtime).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {awaiting.length === 0 ? (
<<<<<<< HEAD
            <p className="text-sm text-slate-500">Нет заказов, ожидающих оплаты.</p>
=======
            <p className="text-text-secondary text-sm">Нет заказов, ожидающих оплаты.</p>
>>>>>>> recover/cabinet-wip-from-stash
          ) : (
            <ul className="space-y-2">
              {awaiting.map((o) => {
                const orderTotal = orderIdToTotal[o.order] ?? 0;
                const isHighlight = orderIdFromQuery === o.order;
                return (
                  <li
                    key={o.order}
<<<<<<< HEAD
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 ${isHighlight ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-100 bg-slate-50/50'}`}
                  >
                    <div>
                      <span className="font-mono font-bold">{o.order}</span>
                      <span className="ml-2 text-slate-500">{o.brand}</span>
                      <span className="ml-2 font-medium text-amber-700">{o.amount}</span>
                      {o.paidAmount != null && o.paidAmount > 0 && (
                        <span className="ml-2 text-xs text-slate-500">
=======
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 ${isHighlight ? 'border-accent-primary/30 bg-accent-primary/10' : 'border-border-subtle bg-bg-surface2/80'}`}
                  >
                    <div>
                      <span className="font-mono font-bold">{o.order}</span>
                      <span className="text-text-secondary ml-2">{o.brand}</span>
                      <span className="ml-2 font-medium text-amber-700">{o.amount}</span>
                      {o.paidAmount != null && o.paidAmount > 0 && (
                        <span className="text-text-secondary ml-2 text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                          оплачено {formatMoney(o.paidAmount)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="rounded-lg text-[10px] font-black uppercase"
                        onClick={() => handleOpenPayDialog(o.order, orderTotal)}
                      >
                        <CreditCard className="mr-1 h-3.5 w-3.5" /> Оплатить
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-[10px]"
                        asChild
                      >
<<<<<<< HEAD
                        <Link href={`${ROUTES.shop.b2bOrders}/${o.order}`}>Детали</Link>
=======
                        <Link href={ROUTES.shop.b2bOrder(o.order)}>Детали</Link>
>>>>>>> recover/cabinet-wip-from-stash
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <Button variant="outline" className="mt-2 rounded-xl" asChild>
            <Link href={ROUTES.shop.b2bFinance}>Финансы партнёра</Link>
          </Button>
        </CardContent>
      </Card>

      <Dialog open={!!payDialogOrderId} onOpenChange={(open) => !open && setPayDialogOrderId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Оплата заказа {payDialogOrderId}</DialogTitle>
            <DialogDescription>
              Сумма спишется с кредитного лимита. Доступно: {formatMoney(credit.available)}
            </DialogDescription>
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
            <Button variant="outline" onClick={() => setPayDialogOrderId(null)}>
              Отмена
            </Button>
            <Button onClick={handleConfirmPayment}>Провести оплату</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="border-border-subtle mt-6 flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          См. также
        </span>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analytics} data-testid="shop-b2b-payment-retail-link">
            Розничная аналитика
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analyticsFootfall} data-testid="shop-b2b-payment-footfall-link">
            Трафик по зонам
          </Link>
        </Button>
        <B2bMarginAnalysisHubButton />
      </div>

      <RelatedModulesBlock
        title="Связанные разделы"
        links={getShopB2BHubLinks().filter(
          (l) => l.href === ROUTES.shop.b2bFinance || l.href === ROUTES.shop.b2bOrders
        )}
      />
    </RegistryPageShell>
  );
}
