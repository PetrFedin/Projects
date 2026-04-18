'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, MoreHorizontal, Share2, Eye } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
<<<<<<< HEAD
const LinesheetCampaignsContent = dynamic(
  () => import('@/app/brand/b2b/linesheet-campaigns/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const LinesheetVersionsContent = dynamic(
  () => import('@/app/brand/b2b/linesheet-versions/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const LinesheetBuilderContent = dynamic(
  () => import('@/app/brand/b2b/linesheets/create/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
=======
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { tid } from '@/lib/ui/test-ids';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { ROUTES } from '@/lib/routes';
const LinesheetCampaignsContent = dynamic(
  () => import('@/app/brand/b2b/linesheet-campaigns/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const LinesheetVersionsContent = dynamic(
  () => import('@/app/brand/b2b/linesheet-versions/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const LinesheetBuilderContent = dynamic(
  () => import('@/app/brand/b2b/linesheets/create/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
>>>>>>> recover/cabinet-wip-from-stash
);

const linesheets = [
  {
    id: 'ls-fw24',
    name: 'Основная коллекция FW24',
    status: 'Активен',
    styles: 48,
    totalValue: '12,500,000 ₽',
    created: '2024-06-01',
    type: 'Public',
  },
  {
    id: 'ls-ss25',
    name: 'Предзаказ SS25',
    status: 'Активен',
    styles: 62,
    totalValue: '18,200,000 ₽',
    created: '2024-07-15',
    type: 'Private',
    target: 'TSUM, Podium',
  },
  {
    id: 'ls-outlet',
    name: 'Аутлет (для партнеров)',
    status: 'Архивный',
    styles: 15,
    totalValue: '1,800,000 ₽',
    created: '2024-05-10',
    type: 'Public',
  },
];

export default function LinesheetsPage() {
  const [tab, setTab] = useState('linesheets');
  return (
<<<<<<< HEAD
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="h-9 flex-wrap gap-0.5 border border-slate-200 bg-slate-100/80 px-1">
        <TabsTrigger
          value="linesheets"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Лайншиты
        </TabsTrigger>
        <TabsTrigger
          value="campaigns"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Кампании
        </TabsTrigger>
        <TabsTrigger
          value="versions"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Версии
        </TabsTrigger>
        <TabsTrigger
          value="builder"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Builder
        </TabsTrigger>
      </TabsList>
      <TabsContent value="linesheets" className="mt-4">
        <div className="space-y-6">
          <header className="flex flex-wrap items-center justify-end gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest"
            >
              <Share2 className="mr-2 h-4 w-4" /> Массовая рассылка
            </Button>
            <Button
              asChild
              className="rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white"
            >
              <Link href="/brand/b2b/linesheets/create">
                <PlusCircle className="mr-2 h-4 w-4" /> Создать лайншит
              </Link>
            </Button>
          </header>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {linesheets.map((ls) => (
              <Card
                key={ls.id}
                className="group flex flex-col rounded-xl border-slate-100 shadow-sm transition-all hover:border-indigo-200 hover:shadow-xl"
              >
                <CardHeader className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <Badge
                      className={cn(
                        'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                        ls.type === 'Private'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-indigo-100 text-indigo-700'
                      )}
                    >
                      {ls.type} Access
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-300 group-hover:text-slate-900"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="truncate text-base font-black uppercase tracking-tight">
                    {ls.name}
                  </CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase text-slate-400">
                    Создан: {new Date(ls.created).toLocaleDateString('ru-RU')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4 px-8 pb-8">
                  <div className="grid grid-cols-2 gap-3 border-t border-slate-50 pt-4">
                    <div>
                      <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Стили
                      </p>
                      <p className="text-sm font-black text-slate-900">{ls.styles} SKU</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Объем
                      </p>
                      <p className="text-sm font-black text-indigo-600">{ls.totalValue}</p>
                    </div>
                  </div>
                  {ls.target && (
                    <div className="rounded-xl border border-amber-100/50 bg-amber-50/50 p-3">
                      <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-amber-600">
                        Персонализировано для:
                      </p>
                      <p className="text-[10px] font-bold text-amber-900">{ls.target}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-3 p-4 pt-0">
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-slate-200 text-[10px] font-black uppercase"
                    asChild
                  >
                    <Link href={`/brand/b2b/linesheets/${ls.id}`}>
                      <Eye className="mr-2 h-3.5 w-3.5" /> Просмотр
                    </Link>
                  </Button>
                  <Button
                    variant="secondary"
                    className="h-10 rounded-xl border border-slate-100 bg-slate-50 text-[10px] font-black uppercase hover:bg-slate-100"
                  >
                    <Share2 className="mr-2 h-3.5 w-3.5" /> Поделиться
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="campaigns" className="mt-4">
        {tab === 'campaigns' && <LinesheetCampaignsContent />}
      </TabsContent>
      <TabsContent value="versions" className="mt-4">
        {tab === 'versions' && <LinesheetVersionsContent />}
      </TabsContent>
      <TabsContent value="builder" className="mt-4">
        {tab === 'builder' && <LinesheetBuilderContent />}
      </TabsContent>
    </Tabs>
=======
    <RegistryPageShell
      className="w-full max-w-none space-y-4 pb-16"
      data-testid={tid.page('brand-b2b-linesheets')}
    >
      <RegistryPageHeader
        title="Лайншиты B2B"
        leadPlain="Лайншиты, кампании, версии и конструктор для оптовых презентаций."
      />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className={cn(cabinetSurface.tabsList, 'h-auto min-h-9 w-full shadow-inner')}>
          <TabsTrigger
            value="linesheets"
            className={cn(
              cabinetSurface.tabsTrigger,
              'data-[state=active]:text-accent-primary h-7 gap-1.5 text-xs'
            )}
          >
            Лайншиты
          </TabsTrigger>
          <TabsTrigger
            value="campaigns"
            className={cn(
              cabinetSurface.tabsTrigger,
              'data-[state=active]:text-accent-primary h-7 gap-1.5 text-xs'
            )}
          >
            Кампании
          </TabsTrigger>
          <TabsTrigger
            value="versions"
            className={cn(
              cabinetSurface.tabsTrigger,
              'data-[state=active]:text-accent-primary h-7 gap-1.5 text-xs'
            )}
          >
            Версии
          </TabsTrigger>
          <TabsTrigger
            value="builder"
            className={cn(
              cabinetSurface.tabsTrigger,
              'data-[state=active]:text-accent-primary h-7 gap-1.5 text-xs'
            )}
          >
            Builder
          </TabsTrigger>
        </TabsList>
        <TabsContent value="linesheets" className="mt-4">
          <div className="space-y-6">
            <header className="flex flex-wrap items-center justify-end gap-3">
              <Button
                variant="outline"
                className="border-border-default rounded-xl text-xs font-black uppercase tracking-widest"
              >
                <Share2 className="mr-2 size-4" /> Массовая рассылка
              </Button>
              <Button
                asChild
                className="bg-text-primary rounded-xl px-6 text-xs font-black uppercase tracking-widest text-white"
              >
                <Link href={ROUTES.brand.b2bLinesheetsCreate}>
                  <PlusCircle className="mr-2 size-4" /> Создать лайншит
                </Link>
              </Button>
            </header>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {linesheets.map((ls) => (
                <Card
                  key={ls.id}
                  className="border-border-subtle hover:border-accent-primary/30 group flex flex-col rounded-xl shadow-sm transition-all hover:shadow-xl"
                >
                  <CardHeader className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <Badge
                        className={cn(
                          'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                          ls.type === 'Private'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-accent-primary/15 text-accent-primary'
                        )}
                      >
                        {ls.type} Access
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-text-muted group-hover:text-text-primary size-8"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </div>
                    <CardTitle className="truncate text-base font-black uppercase tracking-tight">
                      {ls.name}
                    </CardTitle>
                    <CardDescription className="text-text-muted text-xs font-bold uppercase">
                      Создан: {new Date(ls.created).toLocaleDateString('ru-RU')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grow space-y-4 px-8 pb-8">
                    <div className="border-border-subtle grid grid-cols-2 gap-3 border-t pt-4">
                      <div>
                        <p className="text-text-muted mb-1 text-[9px] font-black uppercase tracking-widest">
                          Стили
                        </p>
                        <p className="text-text-primary text-sm font-black">{ls.styles} SKU</p>
                      </div>
                      <div>
                        <p className="text-text-muted mb-1 text-[9px] font-black uppercase tracking-widest">
                          Объем
                        </p>
                        <p className="text-accent-primary text-sm font-black">{ls.totalValue}</p>
                      </div>
                    </div>
                    {ls.target && (
                      <div className="rounded-xl border border-amber-100/50 bg-amber-50/50 p-3">
                        <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-amber-600">
                          Персонализировано для:
                        </p>
                        <p className="text-xs font-bold text-amber-900">{ls.target}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-3 p-4 pt-0">
                    <Button
                      variant="outline"
                      className="border-border-default h-10 rounded-xl text-xs font-black uppercase"
                      asChild
                    >
                      <Link href={`/brand/b2b/linesheets/${ls.id}`}>
                        <Eye className="mr-2 size-3.5" /> Просмотр
                      </Link>
                    </Button>
                    <Button
                      variant="secondary"
                      className="border-border-subtle bg-bg-surface2 hover:bg-bg-surface2 h-10 rounded-xl border text-xs font-black uppercase"
                    >
                      <Share2 className="mr-2 size-3.5" /> Поделиться
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="campaigns" className="mt-4">
          {tab === 'campaigns' && <LinesheetCampaignsContent />}
        </TabsContent>
        <TabsContent value="versions" className="mt-4">
          {tab === 'versions' && <LinesheetVersionsContent />}
        </TabsContent>
        <TabsContent value="builder" className="mt-4">
          {tab === 'builder' && <LinesheetBuilderContent />}
        </TabsContent>
      </Tabs>
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
