'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, User, Filter } from 'lucide-react';

const MOCK_LOG = [
  { id: '1', who: 'admin@synth.ru', action: 'order.approved', entity: 'ORD-7801', at: '11.03.2026 14:32' },
  { id: '2', who: 'brand@synth.ru', action: 'product.updated', entity: 'P-502', at: '11.03.2026 14:28' },
  { id: '3', who: 'shop@podium.ru', action: 'inventory.adjusted', entity: 'SKU-001', at: '11.03.2026 14:15' },
];

export default function AuditTrailPage() {
  const [userFilter, setUserFilter] = useState('');

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <header>
        <h1 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6 text-slate-700" /> Audit Trail Ledger
        </h1>
        <p className="text-sm text-slate-500 mt-1">Неизменяемый лог всех значимых действий в системе</p>
      </header>

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="h-4 w-4" /> Журнал действий
          </CardTitle>
          <CardDescription>Кто, когда, какое действие, над какой сущностью</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Фильтр по пользователю..." value={userFilter} onChange={(e) => setUserFilter(e.target.value)} className="rounded-lg max-w-xs" />
            <Button variant="outline" size="sm" className="rounded-lg">Экспорт</Button>
          </div>
          <ScrollArea className="h-[320px] rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-2 text-left font-bold uppercase text-[10px] text-slate-500">Время</th>
                  <th className="p-2 text-left font-bold uppercase text-[10px] text-slate-500">Пользователь</th>
                  <th className="p-2 text-left font-bold uppercase text-[10px] text-slate-500">Действие</th>
                  <th className="p-2 text-left font-bold uppercase text-[10px] text-slate-500">Сущность</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LOG.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="p-2 text-slate-600">{r.at}</td>
                    <td className="p-2 font-medium">{r.who}</td>
                    <td className="p-2"><Badge variant="outline" className="text-[9px]">{r.action}</Badge></td>
                    <td className="p-2">{r.entity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild><Link href="/admin">В админку</Link></Button>
      </div>
    </div>
  );
}
