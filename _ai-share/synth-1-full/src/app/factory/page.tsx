import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

<<<<<<< HEAD
const manufacturerSections = [
  {
    title: 'Производство',
    items: [
      { href: ROUTES.brand.production, label: 'Производство', desc: 'Операции и заказы' },
      { href: ROUTES.brand.b2bOrders, label: 'B2B Заказы', desc: 'Заказы от брендов' },
    ],
  },
  {
    title: 'QC и логистика',
    items: [
      { href: ROUTES.brand.compliance, label: 'QC и Compliance', desc: 'Контроль качества' },
      { href: ROUTES.brand.logistics, label: 'Логистика', desc: 'Поставки и склады' },
    ],
  },
];

const supplierSections = [
  {
    title: 'Материалы и поставки',
    items: [
      { href: ROUTES.brand.materials, label: 'Каталог материалов', desc: 'Материалы для брендов' },
      { href: ROUTES.brand.suppliersRfq, label: 'RFQ и заявки', desc: 'Запросы котировок' },
    ],
  },
  {
    title: 'Заказы и логистика',
    items: [
      { href: ROUTES.brand.b2bOrders, label: 'Заказы', desc: 'Заказы на материалы' },
      { href: ROUTES.brand.logistics, label: 'Логистика', desc: 'Доставка материалов' },
    ],
  },
];

export default function FactoryHubPage() {
  const searchParams = useSearchParams();
  const isSupplier = searchParams?.get('role') === 'supplier';
  const sections = isSupplier ? supplierSections : manufacturerSections;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
          Обзор
        </h2>
        <p className="text-sm text-slate-700">
          {isSupplier ? 'Поставки материалов для брендов. ' : 'Производство и цепочка поставок. '}
          Используйте навигацию слева для перехода в разделы.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
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
                      <span className="transition-colors group-hover:text-emerald-600">
                        {item.label}
                      </span>
                      <p className="mt-0.5 text-[9px] font-normal normal-case tracking-normal text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                    <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-300 group-hover:text-emerald-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
=======
/** Корень `/factory` — ветка по умолчанию: производство. */
export default function FactoryRootPage() {
  redirect(ROUTES.factory.production);
>>>>>>> recover/cabinet-wip-from-stash
}
