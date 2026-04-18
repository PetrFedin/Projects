'use client';

import Link from 'next/link';
import { ArrowUpRight, Map } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { SHOP_B2B_ORDERS_HUB_LABEL } from '@/lib/ui/b2b-registry-label';
import { HubTodayPanel, type HubAlert } from '@/components/hub/hub-today-panel';
import { hubAlertsForSource } from '@/lib/hub/dashboard-hub-data';
import { useDashboardHubPanel } from '@/lib/hub/use-dashboard-hub-panel';
import { USE_FASTAPI } from '@/lib/syntha-api-mode';
import { Button } from '@/components/ui/button';
import { B2BWorkspaceModuleGrid } from '@/components/b2b/B2BWorkspaceModuleGrid';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getDistributorCrossRoleLinks } from '@/lib/data/entity-links';
import { tid } from '@/lib/ui/test-ids';

const DISTRIBUTOR_PANEL_ALERTS: HubAlert[] = [
  { level: 'warning', text: '2 отгрузки с риском срыва окна (демо).' },
  { level: 'info', text: 'ЭДО и маркетплейсы подключаются ключами в backend .env.' },
];

const overviewSections = [
  {
    title: 'Заказы',
    items: [
      { href: ROUTES.shop.b2bOrders, label: 'Список заказов', desc: 'Оптовые заказы' },
      { href: ROUTES.shop.b2bCreateOrder, label: 'Создать заказ', desc: 'По коллекции' },
      { href: ROUTES.shop.b2bQuickOrder, label: 'Быстрый заказ', desc: 'По артикулам' },
    ],
  },
  {
    title: 'Каталог и партнёры',
    items: [
      { href: ROUTES.shop.b2bCatalog, label: 'Каталог', desc: 'Закупки' },
      { href: ROUTES.shop.b2bPartners, label: 'Партнёры-бренды', desc: 'Мои бренды' },
      { href: ROUTES.shop.b2bTradeShows, label: 'Выставки', desc: 'Виртуальные выставки' },
    ],
  },
  {
    title: 'Финансы и логистика',
    items: [
      { href: ROUTES.shop.b2bFinance, label: 'Финансы', desc: 'Оплаты' },
      { href: ROUTES.shop.b2bBudget, label: 'OTB Бюджет', desc: 'Планирование' },
      { href: ROUTES.shop.b2bTracking, label: 'Карта поставок', desc: 'Отслеживание' },
    ],
  },
  {
    title: 'Аналитика',
    items: [
      { href: ROUTES.shop.analytics, label: 'Аналитика', desc: 'Отчёты' },
      { href: ROUTES.shop.b2bAnalytics, label: 'Закупки B2B', desc: 'Метрики' },
    ],
  },
];

export default function DistributorHubPage() {
  const { kpis, source, loading } = useDashboardHubPanel('distributor');
  const alerts = hubAlertsForSource(
    USE_FASTAPI,
    loading ? undefined : source,
    DISTRIBUTOR_PANEL_ALERTS
  );

  return (
    <div className="space-y-10" data-testid={tid.page('distributor-dashboard')}>
      <HubTodayPanel
        e2eVariant="distributor"
        hubLabel="дистрибьютор"
        accentClass="text-amber-600"
        kpis={kpis}
        actions={[
          { label: SHOP_B2B_ORDERS_HUB_LABEL, href: ROUTES.shop.b2bOrders, desc: 'Опт по брендам' },
          { label: 'Быстрый заказ', href: ROUTES.shop.b2bQuickOrder, desc: 'По артикулам' },
          { label: 'Финансы', href: ROUTES.shop.b2bFinance, desc: 'Оплаты и лимиты' },
        ]}
        alerts={alerts}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="text-[10px] font-black uppercase" asChild>
          <Link href={ROUTES.shop.b2bWorkspaceMap}>
            <Map className="mr-2 size-3.5" />
            Карта процессов B2B
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-text-muted text-[10px] font-black uppercase"
          asChild
        >
          <Link href={ROUTES.shop.home}>Кабинет магазина</Link>
        </Button>
      </div>

      <div>
        <h2 className="text-text-secondary mb-1 text-[11px] font-black uppercase tracking-[0.2em]">
          Все разделы
        </h2>
        <p className="text-text-primary text-sm">Навигация слева и ссылки ниже.</p>
      </div>

      <B2BWorkspaceModuleGrid
        primaryRole="distributor"
        className="border-border-default rounded-lg border bg-white p-4 shadow-sm"
        title="Модули B2B (роль дистрибьютора)"
        lead="Та же матрица, что у ритейла: отфильтровано под дистрибьютора — лиды, финансы, ATS, логистика."
      />

      <RelatedModulesBlock
        links={getDistributorCrossRoleLinks()}
        title="Связь с ритейлом, брендом и производством"
        className="border-border-default rounded-lg border bg-white p-4 shadow-sm"
      />

      <div className="grid gap-6 md:grid-cols-3">
        {overviewSections.map((section) => (
          <div
            key={section.title}
            className="border-border-default rounded-lg border bg-white p-4 shadow-sm"
          >
            <h3 className="text-text-muted mb-3 text-xs font-black uppercase tracking-widest">
              {section.title}
            </h3>
            <ul className="space-y-1.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-text-primary hover:bg-bg-surface2 group flex items-center justify-between rounded-md px-2.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors"
                  >
                    <div>
                      <span className="transition-colors group-hover:text-amber-600">
                        {item.label}
                      </span>
                      <p className="text-text-muted mt-0.5 text-[9px] font-normal normal-case tracking-normal">
                        {item.desc}
                      </p>
                    </div>
                    <ArrowUpRight className="text-text-muted size-3 shrink-0 group-hover:text-amber-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
