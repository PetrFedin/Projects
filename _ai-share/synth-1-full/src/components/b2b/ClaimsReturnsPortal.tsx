'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  ShieldAlert,
  Archive,
  ArrowRight,
  CreditCard,
  RefreshCcw,
  Camera,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useB2BState } from '@/providers/b2b-state';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/cn';
import { getMetricValueToneClass } from '@/lib/ui/semantic-data-tones';

const CLAIM_STATUS_DOT_CLASS: Record<string, string> = {
  investigating: 'bg-blue-500',
  approved: 'bg-emerald-500',
  pending: 'bg-text-muted',
};

const CLAIM_STATUS_LABEL: Record<string, string> = {
  investigating: 'Изучение',
  approved: 'Одобрено',
  pending: 'Ожидает',
};

export function ClaimsReturnsPortal() {
  const { viewRole } = useUIState();
  const { orderClaims } = useB2BState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen space-y-4 bg-white p-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600">
              <ShieldAlert className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
              className="border-rose-100 text-[9px] font-black uppercase tracking-widest text-rose-600"
            >
              Assurance_Portal_v3.1
            </Badge>
          </div>
<<<<<<< HEAD
          <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-sm">
=======
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
>>>>>>> recover/cabinet-wip-from-stash
            Портал Претензий
            <br />и Возвратов
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
<<<<<<< HEAD
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Поиск претензий..."
              className="h-12 rounded-2xl border-slate-100 bg-slate-50 pl-10 focus-visible:ring-rose-500"
=======
            <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Поиск претензий..."
              className="border-border-subtle bg-bg-surface2 h-12 rounded-2xl pl-10 focus-visible:ring-rose-500"
>>>>>>> recover/cabinet-wip-from-stash
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
<<<<<<< HEAD
            className="h-12 gap-2 rounded-2xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white"
=======
            className="bg-text-primary h-12 gap-2 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white"
>>>>>>> recover/cabinet-wip-from-stash
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="h-4 w-4" /> Новая претензия
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        {/* Status Filter Sidebar */}
        <div className="space-y-6">
<<<<<<< HEAD
          <Card className="space-y-6 rounded-xl border-none bg-slate-900 p-4 text-white shadow-2xl shadow-slate-200/50">
=======
          <Card className="bg-text-primary space-y-6 rounded-xl border-none p-4 text-white shadow-2xl shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Движок процессов
              </p>
              <h4 className="text-base font-black uppercase tracking-tight">Обзор этапов</h4>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Ожидает проверки', count: 4, icon: Clock, color: 'amber' },
                { label: 'На рассмотрении', count: 2, icon: AlertCircle, color: 'blue' },
                { label: 'Решено (30д)', count: 28, icon: CheckCircle2, color: 'emerald' },
                { label: 'Отклонено', count: 3, icon: Archive, color: 'slate' },
              ].map((stage, i) => (
                <button
                  key={i}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
<<<<<<< HEAD
                    <stage.icon
                      className={cn(
                        'h-4 w-4',
                        stage.color === 'amber'
                          ? 'text-amber-400'
                          : stage.color === 'blue'
                            ? 'text-blue-400'
                            : stage.color === 'emerald'
                              ? 'text-emerald-400'
                              : 'text-slate-400'
                      )}
                    />
=======
                    <stage.icon className={cn('h-4 w-4', getMetricValueToneClass(stage.color))} />
>>>>>>> recover/cabinet-wip-from-stash
                    <span className="text-[10px] font-bold uppercase tracking-tight text-white/80">
                      {stage.label}
                    </span>
                  </div>
                  <Badge className="border-none bg-white/10 text-[8px] font-black text-white">
                    {stage.count}
                  </Badge>
                </button>
              ))}
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-slate-200/50">
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Скорость решения
              </p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
                Уровень сервиса
              </h4>
            </div>
            <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-900">4.2ч</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-md">
            <div className="space-y-1">
              <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                Скорость решения
              </p>
              <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
                Уровень сервиса
              </h4>
            </div>
            <div className="bg-bg-surface2 border-border-subtle space-y-4 rounded-2xl border p-4">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-text-primary text-sm font-black">4.2ч</p>
                  <p className="text-text-muted text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Ср. время ответа
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-500 opacity-20" />
              </div>
<<<<<<< HEAD
              <div className="h-1 overflow-hidden rounded-full bg-slate-200">
=======
              <div className="bg-border-subtle h-1 overflow-hidden rounded-full">
>>>>>>> recover/cabinet-wip-from-stash
                <div className="h-full w-[85%] bg-emerald-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Claims Table/List */}
        <div className="space-y-6 lg:col-span-3">
<<<<<<< HEAD
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/50">
            <div className="flex items-center justify-between border-b border-slate-50 p-4">
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
=======
          <div className="border-border-subtle overflow-hidden rounded-xl border bg-white shadow-2xl shadow-md">
            <div className="border-border-subtle flex items-center justify-between border-b p-4">
              <h3 className="text-text-primary text-base font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                Последние претензии
              </h3>
              <Button
                variant="outline"
<<<<<<< HEAD
                className="h-10 rounded-xl border-slate-100 px-6 text-[9px] font-black uppercase tracking-widest"
=======
                className="border-border-subtle h-10 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Экспорт CSV
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
<<<<<<< HEAD
                  <tr className="bg-slate-50/50">
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Референс / ID
                    </th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Тип проблемы
                    </th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Статус
                    </th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Ритейлер
                    </th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
=======
                  <tr className="bg-bg-surface2/80">
                    <th className="text-text-muted p-4 text-[9px] font-black uppercase tracking-widest">
                      Референс / ID
                    </th>
                    <th className="text-text-muted p-4 text-[9px] font-black uppercase tracking-widest">
                      Тип проблемы
                    </th>
                    <th className="text-text-muted p-4 text-[9px] font-black uppercase tracking-widest">
                      Статус
                    </th>
                    <th className="text-text-muted p-4 text-[9px] font-black uppercase tracking-widest">
                      Ритейлер
                    </th>
                    <th className="text-text-muted p-4 text-[9px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      Решение
                    </th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
<<<<<<< HEAD
                <tbody className="divide-y divide-slate-50">
                  {orderClaims.map((claim) => (
                    <tr key={claim.id} className="group transition-all hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-xs font-black uppercase text-slate-900">
                            {claim.orderId}
                          </p>
                          <p className="text-[9px] font-bold uppercase tracking-tight text-slate-400">
=======
                <tbody className="divide-border-subtle divide-y">
                  {orderClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-bg-surface2/80 group transition-all">
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-text-primary text-xs font-black uppercase">
                            {claim.orderId}
                          </p>
                          <p className="text-text-muted text-[9px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                            {claim.id}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
<<<<<<< HEAD
                          className="border-slate-200 text-[8px] font-black uppercase text-slate-600"
=======
                          className="border-border-default text-text-secondary text-[8px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          {claim.type.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'h-1.5 w-1.5 animate-pulse rounded-full',
<<<<<<< HEAD
                              claim.status === 'investigating'
                                ? 'bg-blue-500'
                                : claim.status === 'approved'
                                  ? 'bg-emerald-500'
                                  : 'bg-slate-400'
                            )}
                          />
                          <span className="text-[10px] font-black uppercase tracking-tight text-slate-900">
                            {claim.status === 'investigating'
                              ? 'Изучение'
                              : claim.status === 'approved'
                                ? 'Одобрено'
                                : claim.status === 'pending'
                                  ? 'Ожидает'
                                  : claim.status}
=======
                              CLAIM_STATUS_DOT_CLASS[claim.status] ?? CLAIM_STATUS_DOT_CLASS.pending
                            )}
                          />
                          <span className="text-text-primary text-[10px] font-black uppercase tracking-tight">
                            {CLAIM_STATUS_LABEL[claim.status] ?? claim.status}
>>>>>>> recover/cabinet-wip-from-stash
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
<<<<<<< HEAD
                        <span className="text-xs font-bold text-slate-600">
=======
                        <span className="text-text-secondary text-xs font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                          ID Ритейлера: {claim.retailerId}
                        </span>
                      </td>
                      <td className="p-4">
                        {claim.resolution ? (
<<<<<<< HEAD
                          <Badge className="border-none bg-indigo-50 text-[8px] font-black uppercase text-indigo-600">
=======
                          <Badge className="bg-accent-primary/10 text-accent-primary border-none text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                            {claim.resolution === 'credit_note'
                              ? 'Кредит-нота'
                              : claim.resolution === 'replacement'
                                ? 'Замена'
                                : claim.resolution === 'refund'
                                  ? 'Возврат'
<<<<<<< HEAD
                                  : claim.resolution.replace('_', ' ')}
                          </Badge>
                        ) : (
                          <span className="text-[10px] font-black uppercase italic text-slate-300">
=======
                                  : String(claim.resolution).replace(/_/g, ' ')}
                          </Badge>
                        ) : (
                          <span className="text-text-muted text-[10px] font-black uppercase italic">
>>>>>>> recover/cabinet-wip-from-stash
                            В процессе
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
<<<<<<< HEAD
                          className="h-10 w-10 rounded-xl border border-transparent p-0 hover:border-slate-100 hover:bg-white"
=======
                          className="hover:border-border-subtle h-10 w-10 rounded-xl border border-transparent p-0 hover:bg-white"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resolution Tools (Admin/Brand view) */}
          {viewRole === 'brand' && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                { label: 'Выставить кредит-ноту', icon: CreditCard, desc: 'Корректировка баланса' },
                { label: 'Одобрить замену', icon: RefreshCcw, desc: 'Бесплатная переотправка' },
                { label: 'Архивировать запись', icon: Archive, desc: 'Завершить и закрыть' },
              ].map((tool, i) => (
                <Card
                  key={i}
<<<<<<< HEAD
                  className="group cursor-pointer rounded-xl border border-none bg-white shadow-xl shadow-slate-200/50 transition-all hover:border-indigo-200"
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 shadow-lg transition-all group-hover:bg-indigo-600 group-hover:text-white">
                      <tool.icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
                        {tool.label}
                      </h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
                  className="hover:border-accent-primary/30 group cursor-pointer rounded-xl border border-none bg-white shadow-md shadow-xl transition-all"
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="bg-bg-surface2 group-hover:bg-accent-primary flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg transition-all group-hover:text-white">
                      <tool.icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
                        {tool.label}
                      </h4>
                      <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                        {tool.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Claim Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
<<<<<<< HEAD
              className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-100 bg-white shadow-2xl"
=======
              className="border-border-subtle w-full max-w-2xl overflow-hidden rounded-xl border bg-white shadow-2xl"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <div className="space-y-4 p-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Badge className="border-none bg-rose-600 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
                      Официальный_запрос
                    </Badge>
<<<<<<< HEAD
                    <h2 className="text-base font-black uppercase tracking-tighter text-slate-900">
=======
                    <h2 className="text-text-primary text-base font-black uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                      Открыть претензию
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setIsFormOpen(false)}
<<<<<<< HEAD
                    className="h-12 w-12 rounded-2xl p-0 hover:bg-slate-50"
=======
                    className="hover:bg-bg-surface2 h-12 w-12 rounded-2xl p-0"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    <Plus className="h-6 w-6 rotate-45" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
<<<<<<< HEAD
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
                    <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      Номер заказа
                    </p>
                    <Input
                      placeholder="ORD-XXXX"
<<<<<<< HEAD
                      className="h-10 rounded-2xl border-slate-100 bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Тип претензии
                    </p>
                    <select className="h-10 w-full appearance-none rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold">
=======
                      className="border-border-subtle bg-bg-surface2 h-10 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                      Тип претензии
                    </p>
                    <select className="border-border-subtle bg-bg-surface2 h-10 w-full appearance-none rounded-2xl border px-4 text-sm font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                      <option>Повреждение при доставке</option>
                      <option>Недостача товара</option>
                      <option>Дефект качества</option>
                      <option>Некорректный SKU</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
<<<<<<< HEAD
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Описание проблемы
                  </p>
                  <textarea
                    className="h-32 w-full rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
=======
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    Описание проблемы
                  </p>
                  <textarea
                    className="border-border-subtle bg-bg-surface2 h-32 w-full rounded-xl border p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
>>>>>>> recover/cabinet-wip-from-stash
                    placeholder="Пожалуйста, предоставьте подробную информацию о дефекте..."
                  />
                </div>

                <div className="space-y-4">
<<<<<<< HEAD
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Загрузка доказательств
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    <button className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-100 text-slate-300 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600">
=======
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    Загрузка доказательств
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    <button className="border-border-subtle text-text-muted group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600">
>>>>>>> recover/cabinet-wip-from-stash
                      <Camera className="h-6 w-6" />
                      <span className="text-[8px] font-black uppercase tracking-widest">
                        Добавить фото
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setIsFormOpen(false)}
                    className="h-10 flex-1 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                  >
                    Отмена
                  </Button>
<<<<<<< HEAD
                  <Button className="h-10 flex-[2] rounded-2xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200">
=======
                  <Button className="bg-text-primary h-10 flex-[2] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
                    Отправить претензию
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
