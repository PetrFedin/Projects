'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Camera,
  Plus,
  Search,
  Filter,
  MessageSquare,
  ArrowUpRight,
  ShieldAlert,
  Package,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function ClaimsPortalPage() {
  const claims = [
    {
      id: 'CLM-0012',
      orderId: 'ORD-8821',
      brand: 'Nordic Wool',
      type: 'Damage',
      status: 'In Review',
      priority: 'High',
      date: '12.02.2024',
      amount: '45,000 ₽',
    },
    {
      id: 'CLM-0010',
      orderId: 'ORD-8790',
      brand: 'Syntha Lab',
      type: 'Incorrect SKU',
      status: 'Resolved',
      priority: 'Medium',
      date: '08.02.2024',
      amount: '12,500 ₽',
    },
    {
      id: 'CLM-0008',
      orderId: 'ORD-8755',
      brand: 'Radical Chic',
      type: 'Shortage',
      status: 'Pending Info',
      priority: 'Low',
      date: '01.02.2024',
      amount: '8,900 ₽',
    },
  ];

  const [selectedClaimId, setSelectedClaimId] = useState(claims[0].id);
  const activeClaim = claims.find((c) => c.id === selectedClaimId) || claims[0];

  return (
    <div className="container mx-auto flex h-[calc(100vh-64px)] flex-col space-y-4 px-4 py-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-base font-black uppercase tracking-tighter text-slate-900">
            RMA & Claims Portal
          </h1>
          <p className="text-sm font-medium italic text-slate-500">
            Центр управления рекламациями и возвратами B2B
          </p>
        </div>
        <Button className="h-12 rounded-2xl bg-red-600 px-8 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" /> Создать новую рекламацию
        </Button>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-12">
        {/* Left Side - Claims List */}
        <div className="flex flex-col space-y-6 overflow-hidden lg:col-span-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Поиск по ID или бренду..."
              className="h-12 rounded-2xl border-slate-100 pl-10"
            />
          </div>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  onClick={() => setSelectedClaimId(claim.id)}
                  className={cn(
                    'cursor-pointer rounded-xl border-2 p-3 transition-all',
                    selectedClaimId === claim.id
                      ? 'border-red-600 bg-red-50/30 shadow-xl shadow-red-50'
                      : 'border-slate-50 bg-white hover:border-slate-200'
                  )}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {claim.id}
                      </p>
                      <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                        {claim.brand}
                      </h3>
                    </div>
                    <Badge
                      className={cn(
                        'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                        claim.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-600'
                          : claim.status === 'In Review'
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-amber-100 text-amber-600'
                      )}
                    >
                      {claim.status}
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className={cn(
                          'h-3.5 w-3.5',
                          claim.priority === 'High' ? 'text-red-500' : 'text-amber-500'
                        )}
                      />
                      <span className="text-[10px] font-bold uppercase text-slate-600">
                        {claim.type}
                      </span>
                    </div>
                    <p className="text-xs font-black text-slate-900">{claim.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Side - Claim Detail */}
        <div className="flex flex-col space-y-6 overflow-hidden lg:col-span-8">
          <Card className="flex flex-1 flex-col overflow-hidden rounded-xl border-none shadow-2xl">
            <CardHeader className="space-y-4 bg-slate-900 p-4 text-white">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-black uppercase tracking-tighter">
                      {activeClaim.id}
                    </h2>
                    <Badge className="border-none bg-red-500 text-[10px] font-black uppercase text-white">
                      {activeClaim.priority} Priority
                    </Badge>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Order Reference: {activeClaim.orderId}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10"
                >
                  Скачать PDF <FileText className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
              {/* Status Timeline */}
              <div className="relative pt-8">
                <div className="absolute left-0 right-0 top-1/2 z-0 h-1 -translate-y-1/2 bg-slate-100" />
                <div className="relative z-10 flex justify-between">
                  {[
                    { label: 'Created', date: '12.02', active: true },
                    { label: 'Evidence Review', date: '13.02', active: true },
                    { label: 'Warehouse Check', date: '14.02', active: false },
                    { label: 'Resolution', date: 'TBD', active: false },
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-lg transition-colors',
                          step.active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'
                        )}
                      >
                        {step.active ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-current" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-tight text-slate-900">
                          {step.label}
                        </p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                          {step.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <ShieldAlert className="h-4 w-4 text-red-500" /> Описание проблемы
                  </h4>
                  <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-sm font-medium italic leading-relaxed text-slate-700">
                      «При распаковке заказа ORD-8821 было обнаружено, что 5 коробок с Cyber Tech
                      Parka имеют повреждения упаковки, а 2 единицы товара имеют механические
                      повреждения рукавов.»
                    </p>
                    <div className="flex gap-2 pt-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="group relative h-12 w-12 cursor-pointer overflow-hidden rounded-xl bg-slate-200"
                        >
                          <Image
                            src={`https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=200&i=${i}`}
                            alt="Evidence"
                            fill
                            className="object-cover opacity-60 transition-opacity group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Maximize2 className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        className="flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-xl border-dashed border-slate-300 text-slate-400"
                      >
                        <Camera className="h-4 w-4" />
                        <span className="text-[7px] font-black uppercase tracking-widest">Add</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <MessageSquare className="h-4 w-4 text-indigo-600" /> Сообщения по кейсу
                  </h4>
                  <ScrollArea className="h-48 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-black uppercase text-indigo-600">
                            Brand Support
                          </span>
                          <span className="text-[7px] text-slate-400">13.02 14:20</span>
                        </div>
                        <p className="rounded-2xl rounded-tl-none bg-white p-3 text-[10px] text-slate-600 shadow-sm">
                          Мы получили ваши фотографии. Запрос передан на склад в Милане для
                          подтверждения состояния при отгрузке.
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex w-full items-center justify-between">
                          <span className="text-[7px] text-slate-400">12.02 16:10</span>
                          <span className="text-[8px] font-black uppercase text-slate-900">
                            You
                          </span>
                        </div>
                        <p className="rounded-2xl rounded-tr-none bg-slate-900 p-3 text-[10px] text-white shadow-sm">
                          Фотографии прикреплены к рекламации. Ждем решения.
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                  <div className="relative">
                    <Input
                      placeholder="Ответить по кейсу..."
                      className="h-11 rounded-xl border-slate-100 pr-12"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-indigo-600"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Прогноз решения
                  </p>
                  <p className="text-sm font-black text-indigo-600">
                    Full Replacement / Credit Note
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    ETA
                  </p>
                  <p className="text-sm font-black text-slate-900">24-48 hours</p>
                </div>
              </div>
              <Button className="group h-12 rounded-2xl bg-indigo-600 px-12 text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700">
                Согласовать решение{' '}
                <CheckCircle2 className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Maximize2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}
