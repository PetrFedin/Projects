'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  UserPlus,
  Search,
  Settings2,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function FinancialTermsManager() {
  const { retailerProfiles, updateRetailerProfile } = useB2BState();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProfile = selectedId ? retailerProfiles[selectedId] : null;

  return (
    <div className="bg-bg-surface2 min-h-screen space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-text-primary flex h-8 w-8 items-center justify-center rounded-xl">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
              className="border-border-default text-text-primary text-[9px] font-black uppercase tracking-widest"
            >
              FINANCE_CORE_v1.0
            </Badge>
          </div>
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
            Финансовые Условия
            <br />и Кредитные Линии
          </h2>
          <p className="text-text-muted max-w-md text-left text-xs font-medium">
            Управление лимитами оптового кредитования, условиями оплаты (Net 30/60/90) и бюджетами
            OTB для всех партнеров-ритейлеров.
          </p>
        </div>

        <Button className="bg-text-primary h-10 gap-2 rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-xl">
          <UserPlus className="h-4 w-4" /> Выдать новую кредитную линию
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Retailer List */}
        <div className="space-y-6 lg:col-span-5">
          <div className="relative">
            <Search className="text-text-muted absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Поиск партнеров..."
              className="h-10 rounded-[1.25rem] border-none bg-white pl-12 shadow-sm"
            />
          </div>

          <div className="space-y-4">
            {Object.values(retailerProfiles).map((profile) => (
              <Card
                key={profile.id}
                onClick={() => setSelectedId(profile.id)}
                className={cn(
                  'group cursor-pointer overflow-hidden rounded-xl border-none shadow-md shadow-xl transition-all',
                  selectedId === profile.id
                    ? 'bg-text-primary text-white'
                    : 'hover:bg-bg-surface2 bg-white'
                )}
              >
                <CardContent className="p-4">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-2xl transition-colors',
                          selectedId === profile.id ? 'bg-white/10' : 'bg-bg-surface2'
                        )}
                      >
                        <CreditCard
                          className={cn(
                            'h-6 w-6',
                            selectedId === profile.id ? 'text-white' : 'text-text-muted'
                          )}
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-tight">
                          {profile.name}
                        </h4>
                        <p
                          className={cn(
                            'text-[9px] font-black uppercase tracking-widest',
                            selectedId === profile.id ? 'text-text-muted' : 'text-text-muted'
                          )}
                        >
                          {profile.tier === 'VIP' ? 'Премиум' : profile.tier} партнер
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        'border-none px-2 py-0.5 text-[8px] font-black',
                        selectedId === profile.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-emerald-50 text-emerald-600'
                      )}
                    >
                      АКТИВЕН
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-50">
                        Доступный кредит
                      </p>
                      <p className="text-sm font-black tracking-tight">
                        {profile.availableCredit.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-50">
                        Условия оплаты
                      </p>
                      <p className="text-sm font-black tracking-tight">{profile.netTerms}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Profile Editor */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedProfile ? (
              <motion.div
                key={selectedProfile.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Card className="rounded-xl border-none bg-white p-3 shadow-2xl shadow-md">
                  <div className="mb-10 flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-text-primary text-sm font-black uppercase tracking-tight">
                        Управление кредитным узлом
                      </h3>
                      <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                        ID Ритейлера: {selectedProfile.id}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-border-subtle h-12 w-12 rounded-xl"
                      >
                        <Settings2 className="text-text-muted h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-text-muted ml-1 text-[10px] font-black uppercase tracking-widest">
                          Общий кредитный лимит
                        </label>
                        <div className="relative">
                          <span className="text-text-muted absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black">
                            ₽
                          </span>
                          <Input
                            type="number"
                            defaultValue={selectedProfile.creditLimit}
                            onBlur={(e) =>
                              updateRetailerProfile(selectedProfile.id, {
                                creditLimit: parseInt(e.target.value) || 0,
                              })
                            }
                            className="bg-bg-surface2 h-10 rounded-2xl border-none pl-12 text-sm font-black"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-text-muted ml-1 text-[10px] font-black uppercase tracking-widest">
                          Срок оплаты (Net Terms)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Due on Receipt', 'Net 30', 'Net 60', 'Net 90'].map((term) => (
                            <Button
                              key={term}
                              variant={selectedProfile.netTerms === term ? 'default' : 'outline'}
                              onClick={() =>
                                updateRetailerProfile(selectedProfile.id, { netTerms: term as any })
                              }
                              className={cn(
                                'h-12 rounded-xl text-[9px] font-black uppercase tracking-widest',
                                selectedProfile.netTerms === term
                                  ? 'bg-text-primary'
                                  : 'border-border-subtle'
                              )}
                            >
                              {term === 'Due on Receipt' ? 'При получении' : term}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-bg-surface2 space-y-4 rounded-xl p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-text-primary text-xs font-black uppercase tracking-widest">
                            Использование OTB
                          </h4>
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase">
                            <span>Бюджет {selectedProfile.otbBudget.season} потрачен</span>
                            <span className="text-accent-primary">
                              {Math.round(
                                (selectedProfile.otbBudget.spent /
                                  selectedProfile.otbBudget.total) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-white shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(selectedProfile.otbBudget.spent / selectedProfile.otbBudget.total) * 100}%`,
                              }}
                              className="bg-accent-primary h-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                            />
                          </div>
                          <p className="text-text-muted text-right text-[10px] font-bold uppercase">
                            {selectedProfile.otbBudget.spent.toLocaleString('ru-RU')} /{' '}
                            {selectedProfile.otbBudget.total.toLocaleString('ru-RU')} ₽
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="border-border-subtle flex items-start gap-3 rounded-2xl border bg-white p-4">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                          <p className="text-text-secondary text-[9px] font-medium leading-relaxed">
                            Увеличение кредитного лимита свыше 5 млн ₽ требует дополнительного
                            одобрения финансового отдела.
                          </p>
                        </div>
                        <Button className="h-12 w-full gap-2 rounded-2xl bg-emerald-600 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-100 hover:bg-emerald-700">
                          <CheckCircle2 className="h-4 w-4" /> Сохранить условия
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Credit Score Activity */}
                <Card className="rounded-xl border-none bg-white p-4 shadow-md shadow-xl">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-text-primary text-sm font-black uppercase tracking-widest">
                      Журнал финансовой дисциплины
                    </h3>
                    <Badge variant="outline" className="border-border-subtle text-[8px] font-black">
                      РЕЙТИНГ: 98/100
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        action: 'Кредитная линия увеличена на 1 млн ₽',
                        actor: 'Админ',
                        date: '2 дня назад',
                      },
                      {
                        action: 'Инвойс #8812 оплачен вовремя',
                        actor: 'Система',
                        date: '1 неделю назад',
                      },
                      {
                        action: 'Новый предзаказ #8821 подтвержден',
                        actor: 'Premium Store',
                        date: 'Сегодня',
                      },
                    ].map((log, i) => (
                      <div
                        key={i}
                        className="border-border-subtle hover:bg-bg-surface2 flex items-center justify-between rounded-xl border p-4 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-text-primary text-[10px] font-black uppercase">
                            {log.action}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-text-muted text-[10px] font-bold uppercase">
                            {log.actor}
                          </span>
                          <span className="text-text-muted text-[10px] font-bold uppercase">
                            {log.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="border-border-default flex h-full flex-col items-center justify-center space-y-6 rounded-xl border border-dashed bg-white p-20 text-center">
                <div className="bg-bg-surface2 flex h-20 w-20 items-center justify-center rounded-full">
                  <CreditCard className="text-text-muted h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-text-muted text-base font-black uppercase tracking-tight">
                    Выберите партнера
                  </h3>
                  <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                    Выберите ритейлера из списка для управления финансовыми условиями
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
