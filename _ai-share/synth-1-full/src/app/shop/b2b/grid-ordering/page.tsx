'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Grid3X3, Plus, Trash2, Upload, Download } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import allProducts from '@/lib/products';

/** NetSuite: Grid Ordering — массовое занесение позиций (таблица) */
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const INITIAL_ROWS = 5;

export default function GridOrderingPage() {
  const [rows, setRows] = useState<
    Array<{ style: string; size: string; qty: number; price?: number }>
  >(Array.from({ length: INITIAL_ROWS }, () => ({ style: '', size: 'M', qty: 0, price: 0 })));

  const addRow = () => setRows((r) => [...r, { style: '', size: 'M', qty: 0, price: 0 }]);
  const removeRow = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: string, value: string | number) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  };

  const filledRows = rows.filter((r) => r.style && r.qty > 0);
  const totalQty = filledRows.reduce((a, r) => a + r.qty, 0);
  const totalAmount = filledRows.reduce((a, r) => a + r.qty * (r.price || 0), 0);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <Grid3X3 className="h-6 w-6" /> Grid Ordering
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            NetSuite: массовое занесение позиций в таблицу — стиль, размер, qty
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Матрица позиций</CardTitle>
          <CardDescription>
            Введите артикулы и количество по строкам. Импорт из Excel — в разработке.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-2 py-2 text-left">Стиль / Артикул</th>
                  <th className="px-2 py-2 text-left">Размер</th>
                  <th className="px-2 py-2 text-left">Кол-во</th>
                  <th className="px-2 py-2 text-left">Цена (₽)</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="px-2 py-1">
                      <Input
                        placeholder="SKU или артикул"
                        className="h-8 text-sm"
                        value={row.style}
                        onChange={(e) => updateRow(i, 'style', e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <select
                        className="h-8 w-20 rounded border px-2 text-sm"
                        value={row.size}
                        onChange={(e) => updateRow(i, 'size', e.target.value)}
                      >
                        {SIZES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        type="number"
                        min={0}
                        className="h-8 w-20 text-center"
                        value={row.qty || ''}
                        onChange={(e) => updateRow(i, 'qty', parseInt(e.target.value, 10) || 0)}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        type="number"
                        min={0}
                        className="h-8 w-24"
                        value={row.price ?? ''}
                        onChange={(e) => updateRow(i, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400"
                        onClick={() => removeRow(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="mr-1 h-4 w-4" /> Добавить строку
            </Button>
            <div className="text-sm">
              <span className="text-slate-500">Итого: </span>
              <span className="font-medium">{totalQty} ед.</span>
              <span className="ml-4 text-slate-500">На сумму: </span>
              <span className="font-semibold">{totalAmount.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <Upload className="mr-1 h-4 w-4" /> Импорт Excel
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Download className="mr-1 h-4 w-4" /> Скачать шаблон
            </Button>
            <Button className="ml-auto" disabled={totalQty === 0}>
              Оформить заказ
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bMatrix}>Матрица заказа</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bQuickOrder}>Быстрый заказ</Link>
        </Button>
      </div>
    </div>
  );
}
