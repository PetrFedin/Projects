'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
<<<<<<< HEAD
import { brands } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
=======
import { RegistryPageShell } from '@/components/design-system';
import { brands } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import {
>>>>>>> recover/cabinet-wip-from-stash
  FileText,
  Users,
  Info,
  ShoppingCart,
  MessageSquare,
  FileCheck,
  Calendar,
  Tag,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockB2BOrders } from '@/lib/order-data';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
<<<<<<< HEAD
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getPartnerLinks } from '@/lib/data/entity-links';
=======
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getPartnerLinks } from '@/lib/data/entity-links';
import { ShopB2bToolHeader, ShopB2bToolTitle } from '@/components/shop/ShopB2bToolHeader';
>>>>>>> recover/cabinet-wip-from-stash

export default function PartnerDetailsPage({
  params: paramsPromise,
}: {
  params: Promise<{ brandId: string }>;
}) {
  const params = use(paramsPromise);
  const { brandId } = params;
  const brand = brands.find((b) => b.slug === brandId);

  if (!brand) {
    notFound();
  }

  const brandOrders = mockB2BOrders.filter((o) =>
    o.brand.toLowerCase().includes(brand.name.toLowerCase())
  );

  const commercialTerms = [
    { term: 'Базовая скидка', value: '60%' },
    { term: 'Скидка от объема (от 1 млн ₽)', value: '62%' },
    { term: 'Условия оплаты', value: '50% предоплата, 50% по факту отгрузки' },
    { term: 'Минимальный заказ (MOQ)', value: '50 ед. / 250 000 ₽' },
    { term: 'Политика возврата', value: 'Только производственный брак' },
  ];

  const contacts = [
    { role: 'Основной менеджер', name: 'Анна Смирнова', email: `a.smirnova@${brand.slug}.com` },
    { role: 'Финансовый отдел', name: 'Ирина Волкова', email: `finance@${brand.slug}.com` },
  ];

  const documents = [
    { name: 'Договор поставки №123.pdf', date: '2024-01-15', status: 'Подписан' },
    { name: 'Приложение №1 (Цены).pdf', date: '2024-01-15', status: 'Подписан' },
    { name: 'Сертификат качества.pdf', date: '2024-01-10', status: 'Действителен' },
  ];
<<<<<<< HEAD

  const createOrderHref = `${ROUTES.shop.b2bCreateOrder}?brand=${encodeURIComponent(brand.name)}`;

  // JOOR/SparkLayer: кредитный лимит и блокировка заказа по партнёру
  const creditLimit = 2_500_000;
  const creditUsed = 1_100_000;
  const creditAvailable = creditLimit - creditUsed;
  const orderBlocked = creditAvailable <= 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href={ROUTES.shop.b2bPartners}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <Image
            src={brand.logo.url}
            alt={brand.name}
            width={40}
            height={40}
            className="rounded-full border p-1"
          />
          <h1 className="text-sm font-bold tracking-tight">Партнёр: {brand.name}</h1>
          {orderBlocked && (
            <Badge variant="destructive" className="bg-rose-600">
              Заказ заблокирован
            </Badge>
          )}
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={createOrderHref}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Создать заказ
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.shop.messages}>
              <MessageSquare className="mr-2 h-4 w-4" /> Чат
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.shop.b2bContracts}>
              <FileCheck className="mr-2 h-4 w-4" /> Документы
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.shop.b2bCollectionTerms}>
              <Calendar className="mr-2 h-4 w-4" /> Условия по коллекциям
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="prices">Ваши цены</TabsTrigger>
          <TabsTrigger value="terms">Коммерческие условия</TabsTrigger>
          <TabsTrigger value="contracts">Контракты и документы</TabsTrigger>
          <TabsTrigger value="history">История заказов</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <div className="space-y-4">
                {/* JOOR/SparkLayer: кредитный лимит и доступность заказа */}
                <div
                  className={cn(
                    'space-y-2 rounded-xl border p-4',
                    orderBlocked
                      ? 'border-rose-200 bg-rose-50/50'
                      : 'border-emerald-200 bg-emerald-50/30'
                  )}
                >
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    {orderBlocked ? 'Кредитный лимит исчерпан' : 'Кредитный лимит'}
                  </h3>
                  <p className="text-2xl font-bold tabular-nums">
                    {(creditAvailable / 1_000_000).toFixed(1)} млн ₽
                    <span className="text-sm font-normal text-muted-foreground"> доступно</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Использовано: {(creditUsed / 1_000_000).toFixed(1)} /{' '}
                    {(creditLimit / 1_000_000).toFixed(1)} млн ₽
                  </p>
                  {orderBlocked && (
                    <p className="text-xs text-rose-700">
                      Новые заказы недоступны до погашения задолженности или увеличения лимита.
                    </p>
                  )}
                </div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <Info className="h-4 w-4" /> О бренде
                </h3>
                <p className="text-sm text-muted-foreground">{brand.description}</p>
                <p className="text-sm">
                  <strong className="text-muted-foreground">Год основания:</strong>{' '}
                  {brand.foundedYear}
                </p>
                <p className="text-sm">
                  <strong className="text-muted-foreground">Страна:</strong> {brand.countryOfOrigin}
                </p>
                <p className="text-sm">
                  <strong className="text-muted-foreground">Сегмент:</strong> {brand.segment}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Users className="h-4 w-4" /> Контакты
                </h3>
                {contacts.map((c) => (
                  <div key={c.role} className="text-sm">
                    <p className="font-medium">{c.role}</p>
                    <p>{c.name}</p>
                    <a href={`mailto:${c.email}`} className="text-accent hover:underline">
                      {c.email}
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* SparkLayer/Fashion Cloud: персональные цены и прайс-лист по партнёру */}
        <TabsContent value="prices" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" /> Ваши цены
              </CardTitle>
              <CardDescription>
                Персональный прайс-лист по контракту. Цены в рублях с учётом вашей скидки и региона.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-sm">
                <p className="font-medium">
                  Ваш ценовой уровень: <strong>Standard B2B</strong> (базовая скидка 60%)
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  При объёме заказа от 1 млн ₽ — уровень VIP (62%). Валюта заказа: RUB, EUR, USD.
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    Территория: по договору. Эксклюзив по региону/каналу настраивается брендом
                    (Colect/Zedonk).
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-2 text-left font-medium">Артикул</th>
                      <th className="py-2 text-left font-medium">Наименование</th>
                      <th className="py-2 text-left font-medium">Категория</th>
                      <th className="py-2 text-right font-medium">Ваша цена (RUB)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        sku: 'CTP-26-001',
                        name: 'Graphene Parka',
                        category: 'Верхняя одежда',
                        price: '12 400',
                      },
                      {
                        sku: 'CTP-26-002',
                        name: 'Merino Sweater',
                        category: 'Трикотаж',
                        price: '6 200',
                      },
                      {
                        sku: 'CTP-26-003',
                        name: 'Tech Trousers',
                        category: 'Брюки',
                        price: '8 900',
                      },
                      {
                        sku: 'CTP-26-004',
                        name: 'Base Layer Top',
                        category: 'Трикотаж',
                        price: '3 100',
                      },
                    ].map((row) => (
                      <tr key={row.sku} className="border-b border-slate-100">
                        <td className="py-2 font-mono text-xs">{row.sku}</td>
                        <td className="py-2">{row.name}</td>
                        <td className="py-2 text-slate-600">{row.category}</td>
                        <td className="py-2 text-right font-medium">{row.price} ₽</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500">
                Полный прайс — в разделе «Написание заказа» и матрице по выбранной коллекции.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="terms" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Коммерческие условия</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {commercialTerms.map((term) => (
                    <TableRow key={term.term}>
                      <TableCell className="w-1/3 font-medium">{term.term}</TableCell>
                      <TableCell>{term.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contracts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Документы</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название документа</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.name}>
                      <TableCell className="flex items-center gap-2 font-medium">
                        <FileText className="h-4 w-4 text-muted-foreground" /> {doc.name}
                      </TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>
                        <Badge variant={doc.status === 'Подписан' ? 'default' : 'secondary'}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Скачать
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button>Запросить новый документ</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>История заказов</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Номер</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brandOrders.map((order) => (
                    <TableRow key={order.order}>
                      <TableCell>
                        <Link
                          href={`/shop/b2b/orders/${order.order}`}
                          className="font-medium hover:underline"
                        >
                          {order.order}
                        </Link>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>
                        <Badge>{order.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RelatedModulesBlock
        links={getPartnerLinks(brand.name)}
        title="Заказы, документы, партнёры"
        className="mt-6"
      />
    </div>
=======

  const createOrderHref = `${ROUTES.shop.b2bCreateOrder}?brand=${encodeURIComponent(brand.name)}`;

  // JOOR/SparkLayer: кредитный лимит и блокировка заказа по партнёру
  const creditLimit = 2_500_000;
  const creditUsed = 1_100_000;
  const creditAvailable = creditLimit - creditUsed;
  const orderBlocked = creditAvailable <= 0;

  return (
    <RegistryPageShell className="space-y-6">
      <ShopB2bToolHeader
        backHref={ROUTES.shop.b2bPartners}
        leading={
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Image
              src={brand.logo.url}
              alt={brand.name}
              width={40}
              height={40}
              className="rounded-full border p-1"
            />
            <ShopB2bToolTitle visual="semibold" className="font-bold">
              Партнёр: {brand.name}
            </ShopB2bToolTitle>
            {orderBlocked ? (
              <Badge variant="destructive" className="bg-rose-600">
                Заказ заблокирован
              </Badge>
            ) : null}
          </div>
        }
        trailing={
          <>
            <Button size="sm" asChild>
              <Link href={createOrderHref}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Создать заказ
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.shop.messages}>
                <MessageSquare className="mr-2 h-4 w-4" /> Чат
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.shop.b2bContracts}>
                <FileCheck className="mr-2 h-4 w-4" /> Документы
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.shop.b2bCollectionTerms}>
                <Calendar className="mr-2 h-4 w-4" /> Условия по коллекциям
              </Link>
            </Button>
          </>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList className={cn(cabinetSurface.tabsList, 'h-auto min-h-9 w-full flex-wrap')}>
          <TabsTrigger value="overview" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
            Обзор
          </TabsTrigger>
          <TabsTrigger value="prices" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
            Ваши цены
          </TabsTrigger>
          <TabsTrigger value="terms" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
            Коммерческие условия
          </TabsTrigger>
          <TabsTrigger value="contracts" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
            Контракты и документы
          </TabsTrigger>
          <TabsTrigger value="history" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
            История заказов
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <div className="space-y-4">
                {/* JOOR/SparkLayer: кредитный лимит и доступность заказа */}
                <div
                  className={cn(
                    'space-y-2 rounded-xl border p-4',
                    orderBlocked
                      ? 'border-rose-200 bg-rose-50/50'
                      : 'border-emerald-200 bg-emerald-50/30'
                  )}
                >
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    {orderBlocked ? 'Кредитный лимит исчерпан' : 'Кредитный лимит'}
                  </h3>
                  <p className="text-2xl font-bold tabular-nums">
                    {(creditAvailable / 1_000_000).toFixed(1)} млн ₽
                    <span className="text-sm font-normal text-muted-foreground"> доступно</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Использовано: {(creditUsed / 1_000_000).toFixed(1)} /{' '}
                    {(creditLimit / 1_000_000).toFixed(1)} млн ₽
                  </p>
                  {orderBlocked && (
                    <p className="text-xs text-rose-700">
                      Новые заказы недоступны до погашения задолженности или увеличения лимита.
                    </p>
                  )}
                </div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <Info className="h-4 w-4" /> О бренде
                </h3>
                <p className="text-sm text-muted-foreground">{brand.description}</p>
                <p className="text-sm">
                  <strong className="text-muted-foreground">Год основания:</strong>{' '}
                  {brand.foundedYear}
                </p>
                <p className="text-sm">
                  <strong className="text-muted-foreground">Страна:</strong> {brand.countryOfOrigin}
                </p>
                <p className="text-sm">
                  <strong className="text-muted-foreground">Сегмент:</strong> {brand.segment}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Users className="h-4 w-4" /> Контакты
                </h3>
                {contacts.map((c) => (
                  <div key={c.role} className="text-sm">
                    <p className="font-medium">{c.role}</p>
                    <p>{c.name}</p>
                    <a href={`mailto:${c.email}`} className="text-accent hover:underline">
                      {c.email}
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* SparkLayer/Fashion Cloud: персональные цены и прайс-лист по партнёру */}
        <TabsContent value="prices" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" /> Ваши цены
              </CardTitle>
              <CardDescription>
                Персональный прайс-лист по контракту. Цены в рублях с учётом вашей скидки и региона.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-border-default bg-bg-surface2/80 rounded-lg border p-3 text-sm">
                <p className="font-medium">
                  Ваш ценовой уровень: <strong>Standard B2B</strong> (базовая скидка 60%)
                </p>
                <p className="text-text-secondary mt-1 text-xs">
                  При объёме заказа от 1 млн ₽ — уровень VIP (62%). Валюта заказа: RUB, EUR, USD.
                </p>
                <div className="text-text-secondary mt-2 flex items-center gap-1.5 text-xs">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    Территория: по договору. Эксклюзив по региону/каналу настраивается брендом
                    (Colect/Zedonk).
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border-default border-b">
                      <th className="py-2 text-left font-medium">Артикул</th>
                      <th className="py-2 text-left font-medium">Наименование</th>
                      <th className="py-2 text-left font-medium">Категория</th>
                      <th className="py-2 text-right font-medium">Ваша цена (RUB)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        sku: 'CTP-26-001',
                        name: 'Graphene Parka',
                        category: 'Верхняя одежда',
                        price: '12 400',
                      },
                      {
                        sku: 'CTP-26-002',
                        name: 'Merino Sweater',
                        category: 'Трикотаж',
                        price: '6 200',
                      },
                      {
                        sku: 'CTP-26-003',
                        name: 'Tech Trousers',
                        category: 'Брюки',
                        price: '8 900',
                      },
                      {
                        sku: 'CTP-26-004',
                        name: 'Base Layer Top',
                        category: 'Трикотаж',
                        price: '3 100',
                      },
                    ].map((row) => (
                      <tr key={row.sku} className="border-border-subtle border-b">
                        <td className="py-2 font-mono text-xs">{row.sku}</td>
                        <td className="py-2">{row.name}</td>
                        <td className="text-text-secondary py-2">{row.category}</td>
                        <td className="py-2 text-right font-medium">{row.price} ₽</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-text-secondary text-xs">
                Полный прайс — в разделе «Написание заказа» и матрице по выбранной коллекции.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="terms" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Коммерческие условия</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {commercialTerms.map((term) => (
                    <TableRow key={term.term}>
                      <TableCell className="w-1/3 font-medium">{term.term}</TableCell>
                      <TableCell>{term.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contracts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Документы</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название документа</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.name}>
                      <TableCell className="flex items-center gap-2 font-medium">
                        <FileText className="h-4 w-4 text-muted-foreground" /> {doc.name}
                      </TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>
                        <Badge variant={doc.status === 'Подписан' ? 'default' : 'secondary'}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Скачать
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button>Запросить новый документ</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>История заказов</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Номер</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brandOrders.map((order) => (
                    <TableRow key={order.order}>
                      <TableCell>
                        <Link
                          href={ROUTES.shop.b2bOrder(order.order)}
                          className="font-medium hover:underline"
                        >
                          {order.order}
                        </Link>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>
                        <Badge>{order.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RelatedModulesBlock
        links={getPartnerLinks()}
        title="Заказы, документы, партнёры"
        className="mt-6"
      />
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
