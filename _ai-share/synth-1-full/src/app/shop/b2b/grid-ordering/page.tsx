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
  const [rows, setRows] = useState<Array<{ style: string; size: string; qty: number; price?: number }>>(
    Array.from({ length: INITIAL_ROWS }, () => ({ style: '', size: 'M', qty: 0, price: 0 }))
  );

  const addRow = () => setRows((r) => [...r, { style: '', size: 'M', qty: 0, price: 0 }]);
  const removeRow = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: string, value: string | number) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  };

  const filledRows = rows.filter((r) => r.style && r.qty > 0);
  const totalQty = filledRows.reduce((a, r) => a + r.qty, 0);
  const totalAmount = filledRows.reduce((a, r) => a + (r.qty * (r.price || 0)), 0);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><Grid3X3 className="h-6 w-6" /> Grid Ordering</h1>
          <p className="text-slate-500 text-sm mt-0.5">NetSuite: массовое занесение позиций в таблицу — стиль, размер, qty</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Матрица позиций</CardTitle>
          <CardDescription>Введите артикулы и количество по строкам. Импорт из Excel — в разработке.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Стиль / Артикул</th>
                  <th className="text-left py-2 px-2">Размер</th>
                  <th className="text-left py-2 px-2">Кол-во</th>
                  <th className="text-left py-2 px-2">Цена (₽)</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-1 px-2">
                      <Input
                        placeholder="SKU или артикул"
                        className="h-8 text-sm"
                        value={row.style}
                        onChange={(e) => updateRow(i, 'style', e.target.value)}
                      />
                    </td>
                    <td className="py-1 px-2">
                      <select
                        className="h-8 rounded border px-2 text-sm w-20"
                        value={row.size}
                        onChange={(e) => updateRow(i, 'size', e.target.value)}
                      >
                        {SIZES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-1 px-2">
                      <Input
                        type="number"
                        min={0}
                        className="h-8 w-20 text-center"
                        value={row.qty || ''}
                        onChange={(e) => updateRow(i, 'qty', parseInt(e.target.value, 10) || 0)}
                      />
                    </td>
                    <td className="py-1 px-2">
                      <Input
                        type="number"
                        min={0}
                        className="h-8 w-24"
                        value={row.price ?? ''}
                        onChange={(e) => updateRow(i, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => removeRow(i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={addRow}><Plus className="h-4 w-4 mr-1" /> Добавить строку</Button>
            <div className="text-sm">
              <span className="text-slate-500">Итого: </span>
              <span className="font-medium">{totalQty} ед.</span>
              <span className="text-slate-500 ml-4">На сумму: </span>
              <span className="font-semibold">{totalAmount.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" disabled><Upload className="h-4 w-4 mr-1" /> Импорт Excel</Button>
            <Button variant="outline" size="sm" disabled><Download className="h-4 w-4 mr-1" /> Скачать шаблон</Button>
            <Button className="ml-auto" disabled={totalQty === 0}>Оформить заказ</Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bMatrix}>Матрица заказа</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bQuickOrder}>Быстрый заказ</Link></Button>
      </div>
    </div>
  );
}
