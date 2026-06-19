'use client';

import Link from 'next/link';
import {
  buildPlatformCoreDemoTrail,
  getPlatformCoreDemo,
  getPlatformCoreCollectionLabel,
  isPlatformCoreEmptyChainCollection,
  PLATFORM_CORE_DEMO,
} from '@/lib/platform-core-hub-matrix';
import { PRODUCTION_HANDOFF_QUEUE_LINK_RU } from '@/lib/platform-core-canonical-labels';

type Props = {
  collectionId: string;
};

const BOOTSTRAP_STEPS = [
  {
    id: 'prep',
    label: 'Один шаг (рекомендуется)',
    detail: 'База данных + seed + dev:core',
    code: 'npm run core:prep',
  },
  {
    id: 'docker',
    label: 'Или вручную: Docker',
    detail: 'PostgreSQL workshop2 на :5433',
    code: 'npm run db:core:up',
  },
  {
    id: 'bootstrap',
    label: 'Загрузка данных цепочки',
    detail: 'Полная цепочка с производственным заказом в очереди',
    code: 'npm run core:bootstrap',
  },
  {
    id: 'bootstrap-interactive',
    label: 'Интерактивная передача (опц.)',
    detail: 'Заказ submitted — подтверждение в кабинете бренда',
    code: 'npm run db:core:bootstrap:interactive',
  },
  {
    id: 'dev',
    label: 'Локальный запуск',
    detail: 'Режим ядра платформы · :3001',
    code: 'npm run dev:core',
  },
  {
    id: 'verify',
    label: 'Проверка',
    detail: 'smoke + e2e',
    code: 'npm run core:verify',
  },
] as const;

/** Чеклист настройки среды и маршрут цепочки (для разработки, не для конечного пользователя). */
export function PlatformCoreInvestorWalkthrough({ collectionId }: Props) {
  const demo = getPlatformCoreDemo(collectionId);
  const trail = buildPlatformCoreDemoTrail(demo);
  const emptyChain = isPlatformCoreEmptyChainCollection(collectionId);
  const collectionLabel = getPlatformCoreCollectionLabel(collectionId);
  const goldenLabel = getPlatformCoreCollectionLabel(PLATFORM_CORE_DEMO.collectionId);

  return (
    <section
      data-testid="platform-core-investor-walkthrough"
      className="border-border-subtle space-y-3 rounded-xl border bg-white p-4"
    >
      <div>
        <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          Настройка среды
        </p>
        <p className="text-text-secondary mt-1 text-xs leading-relaxed">
          {emptyChain
            ? `Коллекция «${collectionLabel}» без данных. Для рабочей цепочки выберите «${goldenLabel}» и загрузите данные.`
            : `Цепочка «${collectionLabel}»: разработка → витрина → матрица → оптовый заказ → передача в цех → досье → связь.`}
        </p>
      </div>

      {!emptyChain ? (
        <ol className="space-y-2">
          {BOOTSTRAP_STEPS.map((step, idx) => (
            <li key={step.id} className="flex gap-2 text-xs">
              <span className="text-text-muted w-4 shrink-0 font-mono">{idx + 1}.</span>
              <div className="min-w-0">
                <p className="text-text-primary font-semibold">{step.label}</p>
                <p className="text-text-muted">{step.detail}</p>
                <code className="text-accent-primary mt-0.5 block text-[10px]">{step.code}</code>
              </div>
            </li>
          ))}
        </ol>
      ) : null}

      <div>
        <p className="text-text-muted mb-1.5 text-[10px] font-black uppercase tracking-widest">
          Маршрут по столпам · {collectionLabel}
        </p>
        <ol className="flex flex-wrap gap-2">
          {trail.map((step) => (
            <li key={`${step.pillarId}-${step.href}`}>
              <Link
                href={step.href}
                data-testid={`investor-walkthrough-${step.pillarId}-${step.label.replace(/\s+/g, '-').toLowerCase()}`}
                className="border-border-subtle hover:bg-bg-surface2 inline-block rounded-md border px-2 py-1 text-[10px] font-medium transition-colors"
              >
                {step.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={`/brand/b2b-orders/${demo.demoOrderId}`}
              data-testid="investor-walkthrough-handoff"
              className="border-border-subtle hover:bg-bg-surface2 inline-block rounded-md border px-2 py-1 text-[10px] font-medium transition-colors"
            >
              Передача · бренд
            </Link>
          </li>
          <li>
            <Link
              href="/factory/production#handoff-queue"
              data-testid="investor-walkthrough-factory-queue"
              className="border-border-subtle hover:bg-bg-surface2 inline-block rounded-md border px-2 py-1 text-[10px] font-medium transition-colors"
            >
              {PRODUCTION_HANDOFF_QUEUE_LINK_RU}
            </Link>
          </li>
        </ol>
      </div>
    </section>
  );
}
