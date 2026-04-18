'use client';

import { RegistryPageShell } from '@/components/design-system';
import { useSearchParamsNonNull } from '@/hooks/use-search-params-non-null';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Clock,
  CheckCircle,
  MessageSquare,
  Star,
  BookOpen,
  UserPlus,
  ShoppingCart,
  FileCheck,
} from 'lucide-react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
<<<<<<< HEAD
=======
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
>>>>>>> recover/cabinet-wip-from-stash
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

const mockPartners = [
  {
<<<<<<< HEAD
    id: 'syntha',
    name: 'Syntha',
    city: 'Москва',
    type: 'Цифровой бренд',
    orders: 3,
    totalValue: 2400000,
    logoUrl: 'https://picsum.photos/seed/syntha/40/40',
    slug: 'syntha',
=======
    id: 'brand_syntha_lab',
    name: 'Syntha Lab',
    city: 'Москва',
    type: 'Premium / Contemporary',
    orders: 5,
    totalValue: 3200000,
    logoUrl: 'https://picsum.photos/seed/syntha-lab/40/40',
    slug: 'syntha-lab',
>>>>>>> recover/cabinet-wip-from-stash
    contractStatus: 'active',
    baseDiscount: 60,
  },
  {
<<<<<<< HEAD
    id: 'apc',
    name: 'A.P.C.',
    city: 'Париж',
    type: 'Современная классика',
    orders: 1,
    totalValue: 1200000,
    logoUrl: 'https://picsum.photos/seed/apc/40/40',
    slug: 'apc',
    contractStatus: 'pending',
    baseDiscount: 58,
  },
  {
    id: 'acne-studios',
    name: 'Acne Studios',
    city: 'Стокгольм',
    type: 'Авангард',
    orders: 5,
    totalValue: 3100000,
    logoUrl: 'https://picsum.photos/seed/acne-studios/40/40',
    slug: 'acne-studios',
    contractStatus: 'expired',
    baseDiscount: 62,
  },
];

const mockRequests = [
  { id: 'req1', brand: 'Jil Sander', date: '2024-07-28', status: 'pending' },
  { id: 'req2', brand: 'Dries Van Noten', date: '2024-07-25', status: 'viewed' },
  { id: 'req3', brand: 'Maison Margiela', date: '2024-07-22', status: 'approved' },
=======
    id: 'brand_nordic_wool',
    name: 'Nordic Wool',
    city: 'Санкт-Петербург',
    type: 'Luxury Heritage',
    orders: 4,
    totalValue: 2650000,
    logoUrl: 'https://picsum.photos/seed/nordic-wool/40/40',
    slug: 'nordic-wool',
    contractStatus: 'active',
    baseDiscount: 58,
  },
];

const mockRequests = [
  { id: 'req1', brand: 'Nordic Wool', date: '2024-07-28', status: 'pending' },
  { id: 'req2', brand: 'Syntha Lab', date: '2024-07-25', status: 'viewed' },
  { id: 'req3', brand: 'Nordic Wool', date: '2024-07-22', status: 'approved' },
>>>>>>> recover/cabinet-wip-from-stash
];

export default function PartnersPage() {
  const router = useRouter();
<<<<<<< HEAD
  const searchParams = useSearchParams();
=======
  const searchParams = useSearchParamsNonNull();
>>>>>>> recover/cabinet-wip-from-stash
  const defaultTab = searchParams.get('tab') === 'requests' ? 'requests' : 'partners';

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'Отправлен', icon: Clock, color: 'text-amber-600' };
      case 'viewed':
        return { text: 'Просмотрен', icon: Clock, color: 'text-blue-600' };
      case 'approved':
        return { text: 'Одобрен', icon: CheckCircle, color: 'text-green-600' };
      default:
        return { text: 'Неизвестно', icon: MoreHorizontal, color: '' };
    }
  };

  const getContractStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { text: 'Активен', color: 'text-green-600' };
      case 'pending':
        return { text: 'На согласовании', color: 'text-amber-600' };
      case 'expired':
        return { text: 'Истек', color: 'text-red-600' };
      default:
        return { text: 'Нет', color: 'text-muted-foreground' };
    }
  };

  return (
<<<<<<< HEAD
    <div className="container mx-auto px-4 py-6 pb-24">
=======
    <RegistryPageShell className="space-y-6">
>>>>>>> recover/cabinet-wip-from-stash
      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Управление партнерами</CardTitle>
              <CardDescription>
                Список ваших брендов-партнеров и статус запросов на сотрудничество.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link href={ROUTES.shop.b2bDiscover}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Найти бренды (Discover)
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={ROUTES.shop.b2bApply}>
                  <UserPlus className="mr-2 h-4 w-4" /> Подать заявку
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Button
              variant="outline"
              className="flex h-auto flex-col items-center gap-1 py-3 text-center"
              asChild
            >
              <Link href={ROUTES.shop.b2bOrders}>
                <ShoppingCart className="h-5 w-5" /> Мои заказы
              </Link>
            </Button>
            <Button
              variant="outline"
              className="flex h-auto flex-col items-center gap-1 py-3 text-center"
              asChild
            >
              <Link href={ROUTES.shop.b2bDiscover}>
                <PlusCircle className="h-5 w-5" /> Discover
              </Link>
            </Button>
            <Button
              variant="outline"
              className="flex h-auto flex-col items-center gap-1 py-3 text-center"
              asChild
            >
              <Link href={ROUTES.shop.b2bApply}>
                <UserPlus className="h-5 w-5" /> Заявка на партнёрство
              </Link>
            </Button>
            <Button
              variant="outline"
              className="flex h-auto flex-col items-center gap-1 py-3 text-center"
              asChild
            >
              <Link href={ROUTES.shop.b2bPartnerOnboarding}>
                <FileCheck className="h-5 w-5" /> Онбординг
              </Link>
            </Button>
          </div>
          <Tabs defaultValue={defaultTab}>
<<<<<<< HEAD
            <TabsList>
              <TabsTrigger value="partners">Мои партнеры</TabsTrigger>
              <TabsTrigger value="requests">Запросы на партнерство</TabsTrigger>
=======
            <TabsList className={cn(cabinetSurface.tabsList, 'w-full flex-wrap sm:w-auto')}>
              <TabsTrigger value="partners" className={cabinetSurface.tabsTrigger}>
                Мои партнеры
              </TabsTrigger>
              <TabsTrigger value="requests" className={cabinetSurface.tabsTrigger}>
                Запросы на партнерство
              </TabsTrigger>
>>>>>>> recover/cabinet-wip-from-stash
            </TabsList>
            <TabsContent value="partners" className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Бренд</TableHead>
                    <TableHead>Базовая скидка</TableHead>
                    <TableHead>Активные заказы</TableHead>
                    <TableHead>Scorecard</TableHead>
                    <TableHead>Статус контракта</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPartners.map((retailer) => {
                    const contractStatus = getContractStatusInfo(retailer.contractStatus);
                    return (
                      <TableRow key={retailer.id}>
                        <TableCell>
                          <Button variant="link" asChild className="h-auto p-0 font-medium">
                            <Link
<<<<<<< HEAD
                              href={`/shop/b2b/partners/${retailer.slug}`}
=======
                              href={ROUTES.shop.b2bPartnerRetailer(retailer.slug)}
>>>>>>> recover/cabinet-wip-from-stash
                              className="flex items-center gap-3"
                            >
                              <Image
                                src={retailer.logoUrl}
                                alt={retailer.name}
                                width={32}
                                height={32}
                                className="rounded-full border object-contain p-0.5"
                              />
                              <span className="font-medium">{retailer.name}</span>
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell className="font-semibold">{retailer.baseDiscount}%</TableCell>
                        <TableCell>{retailer.orders}</TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex cursor-help items-center gap-1.5">
                                  <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star
                                        key={s}
                                        className={cn(
                                          'h-2.5 w-2.5',
                                          s <= 4
                                            ? 'fill-amber-400 text-amber-400'
<<<<<<< HEAD
                                            : 'text-slate-200'
=======
                                            : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                                        )}
                                      />
                                    ))}
                                  </div>
<<<<<<< HEAD
                                  <span className="text-[10px] font-black text-slate-900">4.2</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="rounded-xl border-none bg-slate-900 p-3 text-white shadow-2xl">
=======
                                  <span className="text-text-primary text-[10px] font-black">
                                    4.2
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-text-primary rounded-xl border-none p-3 text-white shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
                                <div className="space-y-1.5">
                                  <p className="border-b border-white/10 pb-1 text-[9px] font-black uppercase tracking-widest">
                                    Partner Efficiency
                                  </p>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
<<<<<<< HEAD
                                    <span className="text-[8px] uppercase text-slate-400">
=======
                                    <span className="text-text-muted text-[8px] uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                      Отработка брака:
                                    </span>
                                    <span className="text-right text-[8px] font-bold text-emerald-400">
                                      98%
                                    </span>
<<<<<<< HEAD
                                    <span className="text-[8px] uppercase text-slate-400">
=======
                                    <span className="text-text-muted text-[8px] uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                      Точность сроков:
                                    </span>
                                    <span className="text-right text-[8px] font-bold text-amber-400">
                                      85%
                                    </span>
<<<<<<< HEAD
                                    <span className="text-[8px] uppercase text-slate-400">
                                      Полнота отгрузки:
                                    </span>
                                    <span className="text-right text-[8px] font-bold text-indigo-400">
=======
                                    <span className="text-text-muted text-[8px] uppercase">
                                      Полнота отгрузки:
                                    </span>
                                    <span className="text-accent-primary text-right text-[8px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                                      92%
                                    </span>
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <div
                            className={cn(
                              'flex items-center gap-1.5 text-sm font-medium',
                              contractStatus.color
                            )}
                          >
                            <div
                              className={cn(
                                'h-2 w-2 rounded-full',
                                contractStatus.color.replace('text-', 'bg-')
                              )}
                            ></div>
                            {contractStatus.text}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
<<<<<<< HEAD
                                    className="h-8 w-8 text-slate-400 hover:text-indigo-600"
=======
                                    className="text-text-muted hover:text-accent-primary h-8 w-8"
>>>>>>> recover/cabinet-wip-from-stash
                                  >
                                    <BookOpen className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>База знаний бренда</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`${ROUTES.shop.b2bCreateOrder}?brand=${encodeURIComponent(retailer.name)}`}
                              >
                                <PlusCircle className="mr-2 h-4 w-4" /> Новый заказ
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="requests" className="space-y-3 pt-4">
<<<<<<< HEAD
              <p className="text-sm text-slate-500">
                Заявки на сотрудничество с брендами. После одобрения бренд появится в «Мои
                партнёры».{' '}
                <Link href={ROUTES.shop.b2bApply} className="text-indigo-600 hover:underline">
=======
              <p className="text-text-secondary text-sm">
                Заявки на сотрудничество с брендами. После одобрения бренд появится в «Мои
                партнёры».{' '}
                <Link href={ROUTES.shop.b2bApply} className="text-accent-primary hover:underline">
>>>>>>> recover/cabinet-wip-from-stash
                  Подать новую заявку
                </Link>
                .
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Бренд</TableHead>
                    <TableHead>Дата запроса</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRequests.map((req) => {
                    const status = getStatusInfo(req.status);
                    return (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.brand}</TableCell>
                        <TableCell>{new Date(req.date).toLocaleDateString('ru-RU')}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`flex w-fit items-center gap-1.5 ${status.color} border-current/30`}
                          >
                            <status.icon className="h-3 w-3" />
                            {status.text}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Заказы, выставки, матрица"
        className="mt-6"
      />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
