'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, UserCheck, ShieldCheck, History, ExternalLink, Download, Clock, AlertCircle } from 'lucide-react';
import { getRecentEdoDocuments } from '@/lib/fashion/edo-status';
import { Button } from '@/components/ui/button';

export default function LocalCompliancePage() {
  const docs = getRecentEdoDocuments();
  
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Compliance & EDO (RF)</h1>
        </div>
        <p className="text-muted-foreground">
          Управление электронным документооборотом (Диадок/Сбис), маркировкой "Честный ЗНАК" и юридическим комплаенсом.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EDO Section */}
        <Card className="p-6 border-2 border-emerald-50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-800 uppercase text-[14px]">Электронный документооборот</h3>
            </div>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] uppercase font-bold">Active Connection</Badge>
          </div>

          <div className="space-y-4 mb-6">
            {docs.map((doc) => (
              <div key={doc.id} className="p-3 bg-slate-50 rounded-lg border flex items-center justify-between group hover:border-emerald-200 transition-colors">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase leading-none">{doc.id}</span>
                    <Badge variant="outline" className="text-[8px] h-3.5 uppercase bg-white">{doc.type}</Badge>
                  </div>
                  <div className="text-xs font-bold text-slate-700 truncate">{doc.counterparty}</div>
                  <div className="text-[10px] text-slate-500 font-semibold">{doc.totalAmount.toLocaleString()} ₽</div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge className={doc.status === 'signed' ? 'bg-green-500' : 'bg-orange-500'}>
                    {doc.status.toUpperCase()}
                  </Badge>
                  {doc.signedAt && <span className="text-[9px] text-slate-400 font-bold">{doc.signedAt}</span>}
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[11px] h-10 shadow-sm">
            <ExternalLink className="w-4 h-4 mr-2" /> Перейти в Диадок
          </Button>
        </Card>

        {/* Honest Mark Batch Section */}
        <Card className="p-6 border-2 border-blue-50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-800 uppercase text-[14px]">Маркировка (Баланс КМ)</h3>
            </div>
            <div className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-1">
               CRPT Sync: OK
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 text-center">
              <div className="text-2xl font-black text-blue-800 leading-none mb-2">1,240</div>
              <div className="text-[10px] font-black text-blue-400 uppercase">Остатки КМ</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div className="text-2xl font-black text-slate-700 leading-none mb-2">14</div>
              <div className="text-[10px] font-black text-slate-400 uppercase">В работе</div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
             <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-black text-amber-700 uppercase leading-none mb-1">Ожидание маркировки</div>
                  <div className="text-[11px] text-amber-600 font-medium">Обнаружено 5 SKU без GTIN для категории "Трикотаж". Требуется ручной ввод.</div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="text-[10px] font-bold uppercase h-9">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Скачать Коды
            </Button>
            <Button variant="outline" className="text-[10px] font-bold uppercase h-9">
              <History className="w-3.5 h-3.5 mr-1.5" /> История КМ
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200 flex gap-4 items-center">
        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-md shrink-0">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-black text-slate-400 uppercase leading-none mb-1">Инфраструктурный модуль (РФ)</div>
          <div className="text-sm font-bold text-slate-700 leading-tight tracking-tight">
            Система автоматически сопоставляет входящие УПД с остатками Честного ЗНАКа и обновляет статусы на PDP.
          </div>
        </div>
      </div>
    </div>
  );
}
