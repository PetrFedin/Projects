'use client';

import { useState } from 'react';
import {
  Scissors,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  Calendar,
  User,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronLeft,
  ArrowRight,
  TrendingUp,
  Activity,
  Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  MOCK_CUSTOM_ORDERS,
  getStatusLabel,
  getStatusColor,
} from '@/lib/logic/customization-utils';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';

export default function BrandCustomizationPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className={cn(registryFeedLayout.pageShell, 'space-y-6 duration-700 animate-in fade-in')}>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <Link href={ROUTES.brand.home} className="transition-colors hover:text-indigo-600">
          Бренд-офис
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-900">Customization Hub</span>
      </div>

      {/* Hero Header */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 text-white shadow-xl md:p-3">
        <div className="absolute right-0 top-0 rotate-12 scale-150 p-4 opacity-[0.05] transition-transform [transition-duration:1500ms] group-hover:scale-[1.6]">
          <Scissors className="h-64 w-64" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-between gap-3 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500 bg-indigo-600 shadow-2xl">
              <Scissors className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="mb-2 flex items-center gap-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                  Customization Hub P3
                </p>
                <Badge className="h-5 border-none bg-white/10 text-[9px] font-bold uppercase tracking-wider text-white/80 shadow-inner">
                  Beta
                </Badge>
              </div>
              <h1 className="text-base font-bold uppercase leading-none tracking-tight">
                Управление пошивом
              </h1>
              <p className="mt-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-white/40">
                <span>
                  Активных заказов: <span className="text-indigo-400">148</span>
                </span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span>
                  Очередь: <span className="text-emerald-400">12 дней</span>
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="h-11 rounded-xl bg-white px-6 text-[10px] font-bold uppercase tracking-widest text-slate-900 shadow-xl transition-all hover:scale-[1.02] hover:bg-slate-50"
              asChild
            >
              <Link href="/brand/customization/patterns">Библиотека лекал</Link>
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-xl border-white/20 px-6 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/10"
            >
              Аналитика спроса
            </Button>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: 'Средний чек',
            value: '54 200 ₽',
            sub: '+12% vs RTW',
            icon: TrendingUp,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
          },
          {
            label: 'Точность посадки',
            value: '98.4%',
            sub: 'AI Scanner',
            icon: Activity,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            label: 'В очереди',
            value: '42',
            sub: 'За 24 часа',
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          },
          {
            label: 'Проблемные',
            value: '3',
            sub: 'Требуют правок',
            icon: AlertCircle,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-200"
          >
            <div className="mb-3 flex items-start justify-between">
              <div
                className={cn(
                  'rounded-lg border border-slate-50 p-2 shadow-sm transition-transform group-hover:scale-105',
                  stat.bg
                )}
              >
                <stat.icon className={cn('h-4 w-4', stat.color)} />
              </div>
              <Badge
                variant="outline"
                className="border-slate-100 text-[9px] font-bold uppercase text-slate-400"
              >
                Live
              </Badge>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <h4 className="text-base font-bold tracking-tight text-slate-900">{stat.value}</h4>
                <p
                  className={cn(
                    'rounded px-1 text-[9px] font-bold uppercase',
                    stat.sub.includes('+')
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-slate-50 text-slate-400'
                  )}
                >
                  {stat.sub}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm lg:col-span-3">
          <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Реестр спецзаказов
                </CardTitle>
                <CardDescription className="mt-0.5 text-[11px] font-medium text-slate-400">
                  Очередь производства на основе 3D-мерок
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Поиск клиента или ID..."
                    className="h-8 w-48 rounded-lg border-slate-200 bg-white pl-9 text-[11px] font-medium shadow-sm focus:ring-1 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
                >
                  <Filter className="h-3.5 w-3.5 text-slate-500" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="h-10 border-none hover:bg-transparent">
                  <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Заказ / Дата
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Клиент
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Модель
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Конфигурация
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Готовность
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Сумма
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Статус
                  </TableHead>
                  <TableHead className="h-10 pr-6 text-right text-slate-400"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_CUSTOM_ORDERS.map((order) => (
                  <TableRow
                    key={order.id}
                    className="group h-10 border-b border-slate-50 transition-all hover:bg-slate-50/50"
                  >
                    <TableCell className="pl-6">
                      <div>
                        <p className="text-[12px] font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                          {order.id}
                        </p>
                        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-400">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[12px] font-bold text-slate-700">
                          {order.clientName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[12px] font-bold text-indigo-600">
                        {order.productName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex max-w-[180px] flex-wrap gap-1">
                        {order.selectedOptions.map((opt, i) => (
                          <Badge
                            key={i}
                            className="h-4.5 rounded border-slate-100 bg-slate-50 px-1.5 text-[9px] font-bold text-slate-500 shadow-sm"
                          >
                            {opt.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span className="text-[11px] font-bold tabular-nums text-slate-600">
                          {new Date(order.estimatedDelivery).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[12px] font-bold tabular-nums text-slate-900">
                        {order.totalPrice.toLocaleString('ru-RU')} ₽
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'h-5 border-none px-2 text-[9px] font-bold uppercase shadow-sm',
                          getStatusColor(order.status)
                        )}
                      >
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-7 w-7 rounded-lg border border-transparent p-0 transition-all hover:border-slate-100 hover:bg-white hover:shadow-sm"
                          >
                            <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-xl border-slate-100 bg-white p-1.5 shadow-xl"
                        >
                          <DropdownMenuItem className="flex h-8 cursor-pointer items-center gap-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-600">
                            <Maximize2 className="h-3.5 w-3.5" /> Детали заказа
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex h-8 cursor-pointer items-center gap-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-600">
                            <Scissors className="h-3.5 w-3.5" /> Генерировать лекала
                          </DropdownMenuItem>
                          <div className="my-1 h-px bg-slate-50" />
                          <DropdownMenuItem className="flex h-8 cursor-pointer items-center gap-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-rose-600">
                            <AlertCircle className="h-3.5 w-3.5" /> Отменить заказ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-center border-t border-slate-100 bg-slate-50/50 p-4">
              <Button
                variant="ghost"
                className="h-8 rounded-lg border border-slate-200 bg-white px-6 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-all hover:text-slate-900 hover:shadow-sm"
              >
                Загрузить еще
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
