'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, QrCode, ShieldCheck, AlertCircle, Download, Send, RefreshCcw, ExternalLink } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getComplianceLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { EdoDocumentFlow } from '@/components/brand/EdoDocumentFlow';

export default function BrandCompliancePage() {
  const [activeTab, setActiveTab] = useState('edo');

  // Mock Data
  const edoDocs = [
    { id: 'doc-101', type: 'УПД', number: 'УПД-445/25', date: '05.03.2025', partner: 'ЦУМ Москва', total: '450 000 ₽', status: 'Подписан', operator: 'Diadoc' },
    { id: 'doc-102', type: 'УПД', number: 'УПД-446/25', date: '07.03.2025', partner: 'Selfridges (RU)', total: '1 200 000 ₽', status: 'Отправлен', operator: 'Diadoc' },
    { id: 'doc-103', type: 'УКД', number: 'УКД-12/25', date: '01.03.2025', partner: 'Галерея', total: '-45 000 ₽', status: 'Подписан', operator: 'Sbis' }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <SectionInfoCard
        title="Russian Layer & Compliance"
        description="ЭДО (УПД/УКД), маркировка «Честный ЗНАК» и EAC-сертификация. Связь с Production (приёмки, отгрузки), складом и B2B-заказами. ЦРПТ и ГИС МТ — единый слой учёта для РФ."
        icon={ShieldCheck}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={<><Badge variant="outline" className="text-[9px]">ЭДО</Badge><Badge variant="outline" className="text-[9px]">КИЗ / Честный ЗНАК</Badge><Badge variant="outline" className="text-[9px]">EAC</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/documents">Документы</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/warehouse">Склад</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/production">Production</Link></Button></>}
      />
      <header className="flex flex-col md:flex-row justify-between items-start gap-3">
        <div>
          <h1 className="text-sm font-black uppercase tracking-tight text-slate-900">Russian Layer & Compliance</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            ЭДО, Маркировка «Честный ЗНАК» и локальная сертификация
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 bg-white border-slate-200">
              <Download className="w-3 h-3 text-indigo-500" />
              Экспорт ЦРПТ
           </Button>
           <Button className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 bg-slate-900 text-white hover:bg-slate-800 shadow-lg">
              <ShieldCheck className="w-3 h-3" />
              Проверить КИЗ
           </Button>
        </div>
      </header>

      <Tabs defaultValue="edo" className="w-full space-y-6" onValueChange={setActiveTab}>
        <TabsList className="bg-white p-1 rounded-2xl h-auto shadow-sm border border-slate-100 w-fit">
          <TabsTrigger value="edo" className="rounded-xl py-2 px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white text-[9px] font-black uppercase gap-2 transition-all">
            <FileText className="w-3.5 h-3.5" />
            ЭДО (УПД/УКД)
          </TabsTrigger>
          <TabsTrigger value="cz" className="rounded-xl py-2 px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white text-[9px] font-black uppercase gap-2 transition-all">
            <QrCode className="w-3.5 h-3.5" />
            Честный ЗНАК
          </TabsTrigger>
          <TabsTrigger value="certs" className="rounded-xl py-2 px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white text-[9px] font-black uppercase gap-2 transition-all">
            <ShieldCheck className="w-3.5 h-3.5" />
            EAC Сертификация
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edo" className="space-y-6 focus-visible:outline-none">
          <EdoDocumentFlow />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="rounded-xl border-none shadow-sm bg-white p-4 border border-slate-100 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Ожидают подписи</p>
                <p className="text-sm font-black text-slate-900">12</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="h-5 w-5" />
              </div>
            </Card>
            <Card className="rounded-xl border-none shadow-sm bg-white p-4 border border-slate-100 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Подписано за месяц</p>
                <p className="text-sm font-black text-slate-900">142</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </Card>
            <Card className="rounded-xl border-none shadow-sm bg-indigo-600 p-4 text-white flex items-center justify-between group cursor-pointer hover:bg-indigo-700 transition-all">
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-white/60 tracking-widest">Оператор ЭДО</p>
                <p className="text-sm font-black tracking-tight">Diadoc (Контур)</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white/10 text-white flex items-center justify-center group-hover:rotate-12 transition-transform">
                <RefreshCcw className="h-5 w-5" />
              </div>
            </Card>
          </div>

          <Card className="rounded-xl border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-tight">Реестр документов</CardTitle>
                <CardDescription className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Входящие и исходящие УПД</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-8 rounded-xl text-[8px] font-black uppercase tracking-widest">Обновить реестр</Button>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="text-[8px] font-black uppercase tracking-widest text-slate-400">Тип</TableHead>
                    <TableHead className="text-[8px] font-black uppercase tracking-widest text-slate-400">Номер и Дата</TableHead>
                    <TableHead className="text-[8px] font-black uppercase tracking-widest text-slate-400">Партнер</TableHead>
                    <TableHead className="text-[8px] font-black uppercase tracking-widest text-slate-400">Сумма</TableHead>
                    <TableHead className="text-[8px] font-black uppercase tracking-widest text-slate-400">Статус</TableHead>
                    <TableHead className="text-[8px] font-black uppercase tracking-widest text-slate-400 text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {edoDocs.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-slate-50 border-slate-50 transition-colors">
                      <TableCell><Badge className="bg-slate-100 text-slate-600 border-none text-[7px] font-black uppercase">{doc.type}</Badge></TableCell>
                      <TableCell className="font-bold text-[10px] text-slate-900">{doc.number} <span className="text-slate-400 ml-1">{doc.date}</span></TableCell>
                      <TableCell className="font-black uppercase text-[9px] text-slate-600">{doc.partner}</TableCell>
                      <TableCell className="font-black text-[10px] text-slate-900">{doc.total}</TableCell>
                      <TableCell>
                        <Badge className={doc.status === 'Подписан' ? 'bg-emerald-50 text-emerald-600 border-none text-[7px] font-black uppercase' : 'bg-amber-50 text-amber-600 border-none text-[7px] font-black uppercase'}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-indigo-600">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cz" className="space-y-6 focus-visible:outline-none">
          <Card className="rounded-xl p-4 border-none shadow-sm bg-slate-900 text-white text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><QrCode className="h-64 w-64" /></div>
            <div className="relative z-10 space-y-4">
              <div className="h-20 w-20 rounded-3xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
                <QrCode className="h-10 w-10 text-indigo-400" />
              </div>
              <h2 className="text-base font-black uppercase tracking-tight">Честный ЗНАК: Хаб Маркировки</h2>
              <p className="text-indigo-200 text-sm font-medium max-w-md mx-auto italic italic">
                Интеграция с ГИС МТ завершена. Синхронизация КИЗ происходит в реальном времени при отгрузках.
              </p>
              <div className="flex justify-center gap-3 pt-6">
                <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] h-12 px-8 shadow-xl shadow-indigo-900/40">
                  Заказать Коды (Эмиссия)
                </Button>
                <Link href="/brand/compliance/stock">
                  <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-black uppercase text-[10px] h-12 px-8">
                    Складской учет КИЗ
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="certs" className="space-y-6 focus-visible:outline-none">
          {/* Reuse certificates component or list here */}
          <Card className="rounded-xl p-4 border-none shadow-sm bg-white">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black uppercase tracking-tight">EAC Сертификаты & Декларации</h3>
              <Button size="sm" className="h-8 rounded-xl text-[8px] font-black uppercase tracking-widest bg-emerald-600 text-white">Добавить сертификат</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: 'Декларация о соответствии ТР ТС 017/2011', expiry: '12.12.2027', status: 'Активен' },
                { name: 'Сертификат соответствия (Верхняя одежда)', expiry: '15.01.2026', status: 'Активен' }
              ].map((cert, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-900 leading-tight">{cert.name}</p>
                    <p className="text-[8px] font-medium text-slate-400 uppercase tracking-widest tracking-widest italic tracking-widest italic">Годен до: {cert.expiry}</p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none text-[7px] font-black uppercase">{cert.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <RelatedModulesBlock links={getComplianceLinks()} className="mt-6" />
    </div>
  );
}
