'use client';

import { use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChevronLeft,
  Store,
  Package,
  FileText,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  Activity,
  Mail,
  MoreHorizontal,
} from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getPartnerLinks } from '@/lib/data/entity-links';
import { buildMessagesUrl } from '@/lib/data/communications-data';
import { fmtMoney } from '@/lib/format';

const mockPartner = {
  id: 'shop1',
  name: 'Podium',
  city: 'Москва',
  type: 'Мультибренд',
  orders: 3,
  totalValue: 2400000,
  creditLimit: 5000000,
  creditUsed: 1200000,
  health: 98,
  riskLevel: 'Low' as const,
  contractStatus: 'active',
  recentOrders: [
    { id: 'ORD-8821', date: '2026-03-01', total: 890000, status: 'Отгружен' },
    { id: 'ORD-8805', date: '2026-02-15', total: 710000, status: 'В производстве' },
    { id: 'ORD-8791', date: '2026-02-01', total: 800000, status: 'Отгружен' },
  ],
  documents: [
    { id: 'DOC-001', title: "Договор поставки SS'26", type: 'Договор', status: 'Подписан' },
    { id: 'DOC-002', title: 'Акт ORD-8821', type: 'Акт', status: 'Подписан' },
  ],
};

export default function RetailerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const partner = mockPartner;

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <SectionInfoCard
        title="Карточка партнёра"
        description="Детальный профиль ритейлера: заказы, документы, чаты, продажи по SKU, возвраты, условия (лимит, отсрочка)."
        icon={Store}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              B2B
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
              <Link href="/brand/b2b-orders">Заказы</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={buildMessagesUrl({ partner: partner.name })}>Чаты</Link>
            </Button>
          </>
        }
      />

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/brand/retailers">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold uppercase">{partner.name}</h1>
          <p className="text-sm text-slate-500">
            {partner.type} · {partner.city}
          </p>
        </div>
        <Button asChild>
          <Link href={buildMessagesUrl({ partner: partner.name })}>
            <Mail className="mr-2 h-4 w-4" /> Написать
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-400">LTV</p>
          <p className="text-xl font-black text-slate-900">{fmtMoney(partner.totalValue)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-400">Кредитный лимит</p>
          <p className="text-xl font-black text-slate-900">{fmtMoney(partner.creditLimit)}</p>
          <p className="mt-1 text-[10px] text-slate-500">
            Использовано: {fmtMoney(partner.creditUsed)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-400">Health</p>
          <p className="text-xl font-black text-emerald-600">{partner.health}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-400">Заказов</p>
          <p className="text-xl font-black text-slate-900">{partner.orders}</p>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="rounded-xl bg-slate-100 p-1">
          <TabsTrigger value="orders" className="rounded-lg">
            Заказы
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg">
            Документы
          </TabsTrigger>
          <TabsTrigger value="returns" className="rounded-lg">
            Возвраты
          </TabsTrigger>
          <TabsTrigger value="terms" className="rounded-lg">
            Условия
          </TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Последние заказы</CardTitle>
              <CardDescription>Связь с B2B Orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {partner.recentOrders.map((o) => (
                  <Link
                    key={o.id}
                    href={`/brand/b2b-orders/${o.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-slate-400" />
                      <span className="font-mono text-sm">{o.id}</span>
                      <span className="text-[11px] text-slate-500">{o.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{fmtMoney(o.total)}</span>
                      <Badge variant="outline" className="text-[9px]">
                        {o.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link href={`/brand/b2b-orders?partner=${encodeURIComponent(partner.name)}`}>
                  Все заказы
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Документы</CardTitle>
              <CardDescription>Договоры, акты, счета</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {partner.documents.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span className="text-sm">{d.title}</span>
                      <Badge variant="secondary" className="text-[9px]">
                        {d.type}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-[9px] text-emerald-600">
                      {d.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link href="/brand/documents">Все документы</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="returns">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Возвраты и рекламации</CardTitle>
              <CardDescription>От этого партнёра</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Возвратов за период: 0</p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link href={`/brand/returns-claims?partner=${encodeURIComponent(partner.name)}`}>
                  Все рекламации
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Условия работы</CardTitle>
              <CardDescription>Лимиты, отсрочка, скидки</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex justify-between border-b py-2">
                  <span className="text-slate-600">Кредитный лимит</span>
                  <span className="font-bold">{fmtMoney(partner.creditLimit)}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-slate-600">Отсрочка платежа</span>
                  <span className="font-bold">30 дней</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Скидка опт</span>
                  <span className="font-bold">—</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Изменить условия
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RelatedModulesBlock links={getPartnerLinks(partner.name)} title="Связанные модули" />
    </div>
  );
}
