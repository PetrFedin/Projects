'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const overviewSections = [
  {
    title: 'Розничные продажи',
    items: [
      {
        href: ROUTES.shop.orders,
        label: 'Заказы клиентов',
        desc: 'Управление розничными заказами',
      },
      { href: ROUTES.shop.inventory, label: 'Склад и остатки', desc: 'Инвентарь и архив' },
      { href: ROUTES.shop.promotions, label: 'Акции и скидки', desc: 'Промо-акции' },
    ],
  },
  {
    title: 'B2B',
    items: [
      { href: ROUTES.shop.b2bOrders, label: 'B2B Заказы', desc: 'Оптовые заказы и отгрузки' },
      { href: ROUTES.shop.b2bCatalog, label: 'B2B Каталог', desc: 'Каталог и лайншиты' },
      { href: ROUTES.shop.b2bPartners, label: 'Партнёры', desc: 'Бренды и поставщики' },
    ],
  },
  {
    title: 'Аналитика',
    items: [{ href: ROUTES.shop.analytics, label: 'Аналитика', desc: 'Дашборды и отчёты' }],
  },
];

export default function ShopHubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
          Обзор
        </h2>
        <p className="text-sm text-slate-700">
          Используйте навигацию слева для перехода в разделы. Ключевые направления:
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {overviewSections.map((section) => (
          <div
            key={section.title}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h3 className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {section.title}
            </h3>
            <ul className="space-y-1.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between rounded-md px-2.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <div>
                      <span className="transition-colors group-hover:text-rose-600">
                        {item.label}
                      </span>
                      <p className="mt-0.5 text-[9px] font-normal normal-case tracking-normal text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                    <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-300 group-hover:text-rose-500" />
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
