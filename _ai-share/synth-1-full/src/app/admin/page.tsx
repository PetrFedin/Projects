'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { getAdminB2bLifecycleOverviewItems } from '@/lib/data/entity-links';
import { HubTodayPanel, type HubAlert } from '@/components/hub/hub-today-panel';
import { hubAlertsForSource } from '@/lib/hub/dashboard-hub-data';
import { useDashboardHubPanel } from '@/lib/hub/use-dashboard-hub-panel';
import { USE_FASTAPI } from '@/lib/syntha-api-mode';
import { tid } from '@/lib/ui/test-ids';

const ADMIN_PANEL_ALERTS: HubAlert[] = [
  {
    level: 'info',
    text: 'Платформенные KPI и алерты в демо-режиме; под API подставятся живые данные.',
  },
  { level: 'warning', text: '2 апелляции ждут назначения модератора (демо).' },
];

const overviewSections = [
  {
    title: 'B2B: жизненный цикл заказа',
    items: getAdminB2bLifecycleOverviewItems(),
  },
  {
    title: 'Контроль и аудит',
    items: [
      { href: ROUTES.admin.activity, label: 'Логи активности', desc: 'Действия на платформе' },
      { href: ROUTES.admin.audit, label: 'Журнал аудита', desc: 'Неизменяемый журнал' },
      {
        href: ROUTES.admin.productionDossierMetrics,
        label: 'Метрики досье ТЗ',
        desc: 'Сессии и вехи контура',
      },
      {
        href: ROUTES.admin.productionDossierMetricsOps,
        label: 'Операции · воронка W2',
        desc: 'Алерты и архив cron',
      },
    ],
  },
  {
    title: 'Пользователи и организации',
    items: [
      { href: ROUTES.admin.users, label: 'Пользователи', desc: 'Роли и доступ' },
      { href: ROUTES.admin.brands, label: 'Бренды и компании', desc: 'Статусы и модерация' },
      { href: ROUTES.admin.staff, label: 'Команда HQ', desc: 'Админы и модераторы' },
      { href: ROUTES.admin.appeals, label: 'Апелляции', desc: 'Споры и жалобы' },
    ],
  },
  {
    title: 'Коммерция и маркетинг',
    items: [
      { href: ROUTES.admin.billing, label: 'Биллинг', desc: 'Подписки и платежи' },
      { href: ROUTES.admin.bpiMatrix, label: 'Матрица BPI', desc: 'Индекс эффективности брендов' },
      { href: ROUTES.admin.promotions, label: 'Акции и промо', desc: 'Кампании и календарь' },
    ],
  },
  {
    title: 'Справочники, контент и система',
    items: [
      { href: '/project-info/categories', label: 'Категории', desc: 'Дерево категорий' },
      { href: '/project-info/attributes', label: 'Атрибуты', desc: 'Справочник значений' },
      { href: ROUTES.admin.cmsHome, label: 'Главная страница', desc: 'CMS витрины' },
      { href: ROUTES.admin.quality, label: 'Контроль качества', desc: 'Модерация' },
      { href: ROUTES.admin.auctions, label: 'Аукционы', desc: 'Управление лотами' },
      { href: ROUTES.admin.messages, label: 'Сообщения', desc: 'Внутренняя переписка' },
      { href: ROUTES.admin.calendar, label: 'Календарь', desc: 'События платформы' },
      { href: ROUTES.admin.integrations, label: 'Интеграции', desc: 'Внешние сервисы' },
      { href: ROUTES.admin.settings, label: 'Системные настройки', desc: 'Глобальные параметры' },
    ],
  },
];

const hubLinks = [
  { href: ROUTES.brand.home, label: 'Кабинет бренда' },
  { href: ROUTES.shop.home, label: 'Кабинет магазина' },
  { href: ROUTES.factory.production, label: 'Кабинет производства' },
  { href: ROUTES.factory.supplierCircularHub, label: 'Кабинет поставщика' },
  { href: ROUTES.distributor.home, label: 'Кабинет дистрибьютора' },
];

export default function AdminDashboardPage() {
  const { kpis, source, loading } = useDashboardHubPanel('admin');
  const alerts = hubAlertsForSource(USE_FASTAPI, loading ? undefined : source, ADMIN_PANEL_ALERTS);

  return (
    <div className="space-y-10" data-testid={tid.adminHqDashboard}>
      <HubTodayPanel
        e2eVariant="admin"
        hubLabel="админ-центр HQ"
        accentClass="text-text-primary"
        kpis={kpis}
        actions={[
          { label: 'Пользователи', href: ROUTES.admin.users, desc: 'Учётные записи и роли' },
          { label: 'Логи и аудит', href: ROUTES.admin.activity, desc: 'Активность и журнал' },
          {
            label: 'Системные настройки',
            href: ROUTES.admin.settings,
            desc: 'Глобальные параметры',
          },
        ]}
        alerts={alerts}
      />

      <div>
<<<<<<< HEAD
        <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Дашборд HQ</h3>
        <p className="mt-1 text-sm text-slate-500">Панель управления платформой Synth-1</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {quickLinks.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full cursor-pointer transition-all hover:border-amber-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <item.icon className="h-8 w-8 text-amber-600" />
                <CardTitle className="text-xs font-bold uppercase">{item.label}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge variant="outline" className="border-slate-200 text-[9px]">
                  Открыть
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Переход к хабам</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href={ROUTES.brand.home}
            className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 hover:bg-indigo-100"
          >
            Brand Hub
          </Link>
          <Link
            href={ROUTES.shop.home}
            className="rounded-lg bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100"
          >
            Shop Hub
          </Link>
          <Link
            href="/factory"
            className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
          >
            Factory Hub
          </Link>
          <Link
            href="/distributor"
            className="rounded-lg bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 hover:bg-amber-100"
          >
            Distributor Hub
          </Link>
        </CardContent>
      </Card>
=======
        <h2 className="text-text-secondary mb-1 text-[11px] font-black uppercase tracking-[0.2em]">
          Другие хабы
        </h2>
        <p className="text-text-primary mb-3 text-sm">Быстрый переход в ролевые кабинеты.</p>
        <div className="flex flex-wrap gap-2">
          {hubLinks.map((h) => (
            <Link
              key={h.href}
              href={h.href}
              className="border-border-default text-text-primary hover:border-border-default hover:bg-bg-surface2 rounded-lg border bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-wider shadow-sm transition-colors"
            >
              {h.label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-text-secondary mb-1 text-[11px] font-black uppercase tracking-[0.2em]">
          Все разделы админ-центра
        </h2>
        <p className="text-text-primary text-sm">Навигация слева и быстрые ссылки ниже.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                      <span className="group-hover:text-text-primary transition-colors">
                        {item.label}
                      </span>
                      <p className="text-text-muted mt-0.5 text-[9px] font-normal normal-case tracking-normal">
                        {item.desc}
                      </p>
                    </div>
                    <ArrowUpRight className="text-text-muted group-hover:text-text-primary size-3 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
>>>>>>> recover/cabinet-wip-from-stash
    </div>
  );
}
