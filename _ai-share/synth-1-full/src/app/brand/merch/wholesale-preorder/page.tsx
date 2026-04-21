'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { buildLineSheetItems } from '@/lib/fashion/linesheet-logic';
import { calculateWholesaleOrderTotal } from '@/lib/fashion/wholesale-order';
import type { WholesaleOrderEntryV1 } from '@/lib/fashion/types';
import { ArrowLeft, ShoppingCart, Send, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';

export default function WholesalePreorderPage() {
  const { toast } = useToast();
  const lineItems = useMemo(() => buildLineSheetItems(products.slice(0, 10)), []);
  const [cart, setCart] = useState<WholesaleOrderEntryV1[]>([]);

  const handleQtyChange = (sku: string, size: string, price: number, delta: number) => {
    setCart((prev) => {
      const idx = prev.findIndex((e) => e.sku === sku && e.size === size);
      if (idx >= 0) {
        const next = [...prev];
        const newQty = Math.max(0, next[idx].quantity + delta);
        if (newQty === 0) return next.filter((_, i) => i !== idx);
        next[idx] = { ...next[idx], quantity: newQty };
        return next;
      }
      if (delta > 0) return [...prev, { sku, size, quantity: delta, price }];
      return prev;
    });
  };

  const total = useMemo(() => calculateWholesaleOrderTotal(cart), [cart]);

  const handleSubmit = () => {
    toast({
      title: 'Заказ отправлен',
      description: `Сумма: ${total.toLocaleString()} ₽. Менеджер свяжется для подтверждения.`,
    });
    setCart([]);
  };

  return (
    <CabinetPageContent maxWidth="6xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.brand.growthHub}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold">
              <ShoppingCart className="h-6 w-6" />
              B2B Pre-Order Entry
            </h1>
            <p className="text-sm text-muted-foreground">
              Форма быстрого ввода заказа для байеров и менеджеров.
            </p>
          </div>
        </div>

        {total > 0 && (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">
                Total Wholesale
              </p>
              <p className="text-lg font-bold">{total.toLocaleString()} ₽</p>
            </div>
            <Button
              onClick={handleSubmit}
              className="bg-accent-primary hover:bg-accent-primary gap-2"
            >
              <Send className="h-4 w-4" />
              Submit PO
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Коллекция (Matrix Entry)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">SKU / Товар</TableHead>
                    <TableHead>Опт. цена</TableHead>
                    <TableHead>Размеры</TableHead>
                    <TableHead className="pr-4 text-right">В заказе</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item) => (
                    <TableRow key={item.sku}>
                      <TableCell className="pl-4">
                        <p className="truncate text-xs font-medium">{item.name}</p>
                        <p className="font-mono text-[9px] text-muted-foreground">{item.sku}</p>
                      </TableCell>
                      <TableCell className="text-xs font-bold">
                        {item.wholesalePrice.toLocaleString()} ₽
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.sizes.map((s) => {
                            const inCart =
                              cart.find((e) => e.sku === item.sku && e.size === s)?.quantity || 0;
                            return (
                              <button
                                key={s}
                                onClick={() => handleQtyChange(item.sku, s, item.wholesalePrice, 1)}
                                className={`h-6 rounded border px-1.5 font-mono text-[10px] transition-colors ${
                                  inCart > 0
                                    ? 'bg-accent-primary/15 border-accent-primary/30 text-accent-primary font-bold'
                                    : 'hover:border-accent-primary/30'
                                }`}
                              >
                                {s} {inCart > 0 && `(${inCart})`}
                              </button>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="pr-4 text-right">
                        <p className="text-xs font-bold">
                          {cart
                            .filter((e) => e.sku === item.sku)
                            .reduce((s, e) => s + e.quantity, 0)}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader className="py-3">
              <CardTitle className="text-base">Review PO</CardTitle>
              <CardDescription className="text-[11px]">
                Позиции, добавленные в черновик заказа.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.length === 0 ? (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  Заказ пуст. Начните вводить количество в матрице слева.
                </p>
              ) : (
                <div className="max-h-[400px] space-y-2 overflow-y-auto">
                  {cart.map((e) => (
                    <div
                      key={`${e.sku}-${e.size}`}
                      className="flex items-center justify-between gap-2 rounded border bg-muted/30 p-2 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{e.sku}</p>
                        <p className="text-[10px] text-muted-foreground">Size: {e.size}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded border bg-background p-0.5">
                          <button
                            onClick={() => handleQtyChange(e.sku, e.size, e.price, -1)}
                            className="flex h-4 w-4 items-center justify-center hover:bg-muted"
                          >
                            -
                          </button>
                          <span className="w-4 text-center text-[10px] font-bold">
                            {e.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(e.sku, e.size, e.price, 1)}
                            className="flex h-4 w-4 items-center justify-center hover:bg-muted"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleQtyChange(e.sku, e.size, e.price, -e.quantity)}
                          className="text-muted-foreground hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </CabinetPageContent>
  );
}
