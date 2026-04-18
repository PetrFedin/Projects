'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import {
  Save,
  PlusCircle,
  ArrowLeft,
  ArrowRight,
  Lock,
  Globe,
  Users,
  FileText,
  ShieldCheck,
  Zap,
  LayoutGrid,
  Info,
  Sparkles,
  Box,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function CreateLinesheetPage() {
  const router = useRouter();
  const [name, setName] = useState('Основная коллекция FW24');
  const [description, setDescription] = useState(
    'Ключевые образы и коммерческие хиты сезона Осень-Зима 2024.'
  );
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [moqEnabled, setMoqEnabled] = useState(true);
  const [layoutStrategy, setLayoutStrategy] = useState<'ai' | 'commercial' | 'story'>('ai');

  const handleCreateAndEdit = () => {
    const linesheetId = 'ls-fw24';
    router.push(`/brand/b2b/linesheets/${linesheetId}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-20">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="rounded-xl border-slate-200" asChild>
          <Link href="/brand/b2b/linesheets">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-base font-black uppercase tracking-tighter text-slate-900">
            New Linesheet
          </h1>
          <p className="font-medium italic text-slate-500">
            Создайте персональную выборку для ваших байеров.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden rounded-xl border-none bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
          <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
            <FileText className="h-4 w-4" /> Основная информация
          </CardTitle>
          <Badge className="h-5 bg-indigo-600 px-3 text-[8px] font-black uppercase tracking-widest text-white">
            Шаг 1 из 3
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Название лайншита
              </Label>
              <Input
                id="name"
                className="h-12 rounded-xl border-slate-100 text-sm font-bold"
                placeholder="Например, Предзаказ FW25"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Описание для байера
              </Label>
              <Textarea
                id="description"
                className="min-h-[100px] resize-none rounded-2xl border-slate-100 text-sm font-medium"
                placeholder="Краткое описание коллекции или эксклюзивных условий."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-50 pt-4">
            <div className="flex items-center justify-between">
              <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Коммерческие правила & MOQ
              </Label>
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-black uppercase text-emerald-600">
                <ShieldCheck className="h-3 w-3" /> Авто-контроль активен
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-4 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-900">
                    Минимальный заказ
                  </span>
                  <Checkbox
                    checked={moqEnabled}
                    onCheckedChange={(checked) => setMoqEnabled(!!checked)}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Input
                      defaultValue="250000"
                      className="h-10 rounded-xl border-slate-200 pl-4 pr-10 text-xs font-black"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-slate-400">
                      ₽
                    </span>
                  </div>
                  <span className="text-[8px] font-bold uppercase text-slate-400">Per order</span>
                </div>
              </div>
              <div className="space-y-4 rounded-[1.5rem] border border-indigo-100/50 bg-indigo-50/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-indigo-600">
                    Pack Buy Mode
                  </span>
                  <Zap className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <p className="text-[9px] font-bold uppercase italic leading-tight text-slate-500">
                  Байер обязан заказывать полными размерными сетками (Packs).
                </p>
                <Button
                  variant="outline"
                  className="h-8 w-full rounded-lg border-indigo-200 text-[9px] font-black uppercase text-indigo-600"
                >
                  Настроить сетки
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-50 pt-4">
            <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Стратегия развески (Merchandising)
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  id: 'ai',
                  label: 'AI Optimized',
                  icon: Sparkles,
                  color: 'text-indigo-600',
                  bg: 'bg-indigo-50',
                },
                {
                  id: 'commercial',
                  label: 'Commercial',
                  icon: Box,
                  color: 'text-slate-900',
                  bg: 'bg-slate-50',
                },
                {
                  id: 'story',
                  label: 'Storytelling',
                  icon: LayoutGrid,
                  color: 'text-amber-600',
                  bg: 'bg-amber-50',
                },
              ].map((strategy) => (
                <button
                  key={strategy.id}
                  onClick={() => setLayoutStrategy(strategy.id as any)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all',
                    layoutStrategy === strategy.id
                      ? '-translate-y-1 border-slate-900 bg-white shadow-lg'
                      : 'border-slate-50 bg-slate-50/50 opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
                  )}
                >
                  <strategy.icon className={cn('h-5 w-5', strategy.color)} />
                  <span className="text-center text-[9px] font-black uppercase">
                    {strategy.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-indigo-600 p-3">
              <Info className="h-4 w-4 text-white" />
              <p className="text-[9px] font-bold uppercase italic leading-tight text-white/90">
                AI проанализирует историю продаж байера и выстроит товары в лайншите для
                максимизации чека.
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-50 pt-4">
            <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Уровень доступа (Visibility)
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setVisibility('public')}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all',
                  visibility === 'public'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-50 bg-slate-50/50 opacity-60 grayscale'
                )}
              >
                <Globe
                  className={cn(
                    'h-6 w-6',
                    visibility === 'public' ? 'text-indigo-600' : 'text-slate-400'
                  )}
                />
                <span className="text-[10px] font-black uppercase">Public (Все партнеры)</span>
              </button>
              <button
                onClick={() => setVisibility('private')}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all',
                  visibility === 'private'
                    ? 'border-amber-600 bg-amber-50/50'
                    : 'border-slate-50 bg-slate-50/50 opacity-60 grayscale'
                )}
              >
                <Lock
                  className={cn(
                    'h-6 w-6',
                    visibility === 'private' ? 'text-amber-600' : 'text-slate-400'
                  )}
                />
                <span className="text-[10px] font-black uppercase">Private (Выбранные)</span>
              </button>
            </div>
          </div>

          {visibility === 'private' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Выберите получателей
              </Label>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-2">
                <div className="flex flex-wrap gap-2">
                  {['PODIUM', 'TSUM', 'SELFRIDGES'].map((p) => (
                    <Badge
                      key={p}
                      className="flex items-center gap-2 border-slate-200 bg-white px-3 py-1 text-[9px] font-black uppercase text-slate-900"
                    >
                      {p} <PlusCircle className="h-3 w-3 text-slate-300" />
                    </Badge>
                  ))}
                  <Button
                    variant="ghost"
                    className="h-7 text-[9px] font-black uppercase text-indigo-600"
                  >
                    Добавить еще...
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-slate-100 bg-slate-50 p-4">
          <Button
            onClick={handleCreateAndEdit}
            disabled={!name}
            className="h-12 w-full rounded-xl bg-slate-900 text-[11px] font-black uppercase text-white shadow-xl"
          >
            Создать и перейти в конструктор <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
