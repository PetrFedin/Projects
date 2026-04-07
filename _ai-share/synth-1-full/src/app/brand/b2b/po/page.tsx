'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowLeft, Upload, Link2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getB2BLinks } from '@/lib/data/entity-links';
import { useToast } from '@/hooks/use-toast';

/** JOOR/NuOrder: генерация/загрузка Purchase Order (PO), привязка к заказу, сверка «заказ ↔ PO». */
const MOCK_ORDER_IDS = ['B2B-0013', 'B2B-0012', 'B2B-0011', 'B2B-0010'];

export default function PurchaseOrderPage() {
  const { toast } = useToast();
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [pos, setPos] = useState([
    { id: 'PO-001', orderId: 'B2B-0012', status: 'Совпадает', date: '2025-03-10' },
    { id: 'PO-002', orderId: 'B2B-0011', status: 'На проверке', date: '2025-03-09' },
  ]);

  const handleGeneratePO = () => {
    if (!selectedOrderId) {
      toast({ title: 'Выберите заказ', variant: 'destructive' });
      return;
    }
    const newId = `PO-${String(pos.length + 1).padStart(3, '0')}`;
    setPos(prev => [{ id: newId, orderId: selectedOrderId, status: 'Создан', date: new Date().toISOString().slice(0, 10) }, ...prev]);
    toast({ title: 'PO создан', description: `${newId} привязан к заказу ${selectedOrderId}. В проде — генерация PDF/EDI.` });
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.brand.b2bOrders}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><FileText className="h-6 w-6" /> Purchase Order (PO)</h1>
          <p className="text-slate-500 text-sm mt-0.5">Генерация и загрузка PO, привязка к заказу, сверка заказ ↔ PO. ЭДО — в планах.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Действия</CardTitle>
          <CardDescription>Создать PO по заказу или загрузить от ритейлера (JOOR/NuOrder)</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs text-slate-500 block mb-1">Заказ</label>
            <select value={selectedOrderId} onChange={(e) => setSelectedOrderId(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm w-40">
              <option value="">Выберите заказ</option>
              {MOCK_ORDER_IDS.map(id => <option key={id} value={id}>{id}</option>)}
            </select>
          </div>
          <Button size="sm" onClick={handleGeneratePO}><Link2 className="h-4 w-4 mr-2" /> Создать PO по заказу</Button>
          <Button size="sm" variant="outline"><Upload className="h-4 w-4 mr-2" /> Загрузить PO</Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Список PO</CardTitle>
          <CardDescription>Привязка к B2B заказу и статус сверки</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {pos.map((po) => (
              <li key={po.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-medium">{po.id}</p>
                  <p className="text-xs text-slate-500">Заказ <Link href={`${ROUTES.brand.b2bOrders}/${po.orderId}`} className="text-indigo-600 hover:underline">{po.orderId}</Link> · {po.date}</p>
                </div>
                <Badge variant={po.status === 'Совпадает' ? 'default' : po.status === 'Создан' ? 'outline' : 'secondary'}>{po.status}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getB2BLinks()} title="B2B заказы, финансы, документы" />
    </div>
  );
}
