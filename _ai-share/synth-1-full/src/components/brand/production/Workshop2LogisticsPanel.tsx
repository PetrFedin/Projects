'use client';

import { useCallback, useMemo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Truck,
  Route,
  Warehouse,
  Factory,
  Thermometer,
  Droplets,
  Activity,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import {
  Workshop2OperationalMetaChips,
  Workshop2OperationalPanelChrome,
  Workshop2OperationalPanelShell,
  Workshop2OperationalPgMirrorChip,
} from '@/components/brand/production/workshop2-operational-panel-chrome';
import { Workshop2DossierPersistButton } from '@/components/brand/production/Workshop2DossierPersistButton';
import {
  persistWorkshop2LogisticsShipmentMirrorToDossier,
  summarizeWorkshop2LogisticsPanelTrackingUi,
} from '@/lib/production/workshop2-logistics-dossier-persist';
import { useToast } from '@/hooks/use-toast';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
const STEPS = [
  { id: 'factory', label: 'Производство (Бишкек)', icon: Factory },
  { id: 'truck_load', label: 'Погрузка (Фура)', icon: Truck },
  { id: 'transit', label: 'Перевозка (Авто)', icon: Route },
  { id: 'customs', label: 'Таможня ЕАЭС', icon: ShieldCheck },
  { id: 'warehouse', label: 'Склад назначения (Москва)', icon: Warehouse },
];

const LOG_ENTRIES = [
  { stepIdx: 0, title: 'Заказ в производстве', desc: 'Фабрика (Бишкек)', time: '05.05., 09:00' },
  { stepIdx: 1, title: 'Груз погружён в фуру', desc: 'Склад фабрики', time: '10.05., 08:15' },
  { stepIdx: 2, title: 'Грузовик в пути', desc: 'Трасса М5', time: 'Текущий этап' },
  { stepIdx: 3, title: 'Прохождение границы РФ', desc: 'Таможня ЕАЭС', time: 'Ожидается' },
  { stepIdx: 4, title: 'Приемка на складе', desc: 'Склад (Москва)', time: 'Ожидается' },
];

const getTruckPosition = (stepIndex: number) => {
  switch (stepIndex) {
    case 0:
      return 'translate(100, 150)';
    case 1:
      return 'translate(200, 100)';
    case 2:
      return 'translate(450, 180)';
    case 3:
      return 'translate(650, 150)';
    case 4:
      return 'translate(800, 100)';
    default:
      return 'translate(450, 180)';
  }
};

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export function Workshop2LogisticsPanel({
  dossier = null,
}: {
  dossier?: Workshop2DossierPhase1 | null;
} = {}) {
  const { dataMode } = useArticleWorkspace();
  const [currentStepIndex, setCurrentStepIndex] = useState(2);
  const trackingUi = useMemo(
    () =>
      summarizeWorkshop2LogisticsPanelTrackingUi({
        dossier,
        hasActiveShipment: Boolean(dossier?.logisticsShipmentMirror?.shipmentCount),
      }),
    [dossier]
  );
  const logisticsPgMirror = useMemo(() => {
    const mirror = dossier?.logisticsShipmentMirror;
    if (!mirror?.mirroredAt)
      return { label: 'Logistics: не в PG', tone: 'slate' as const, title: mirror?.hintRu };
    return { label: 'Logistics: PG', tone: 'emerald' as const, title: mirror.hintRu };
  }, [dossier]);

  return (
    <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <Truck className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-text-primary text-base font-semibold">
                Логистика и цепочка поставок
              </h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                Ответственный: Логист
              </span>
            </div>
            <p className="text-text-secondary text-xs leading-snug">
              Отслеживание статуса доставки от фабрики до склада. Интеграция с API транспортной
              компании.
            </p>
          </div>
        </div>
        <span className="border-border-default bg-bg-surface2 text-text-secondary shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px]">
          {dataMode === 'http' ? 'API' : 'local'}
        </span>
      </div>

      <div className="border-border-subtle mt-4 flex flex-col gap-1.5 border-t border-dotted pt-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="bg-bg-surface2/70 text-text-primary border-border-subtle max-w-full rounded border px-2 py-1 text-[10px] leading-snug">
            <span className="text-text-muted font-bold">Суть</span> · Этап:{' '}
            {STEPS[currentStepIndex].label}
          </span>
          <span className="text-text-primary border-border-subtle max-w-full rounded border bg-white px-2 py-1 text-[10px] font-semibold leading-snug">
            <span className="text-text-muted font-bold">Гот.</span> · В пути
          </span>
          <span data-testid="workshop2-logistics-pg-chip">
            <Workshop2OperationalPgMirrorChip {...logisticsPgMirror} />
          </span>
          <Badge variant="outline" className="text-[10px]">
            {trackingUi.statusLabelRu}
          </Badge>
          <span className="text-text-muted ml-auto text-[10px]">Обновлено: 10 мин назад</span>
        </div>
      </div>

      <div className="mt-4 min-w-0 space-y-4">
        <div className="space-y-6">
          <div className="overflow-x-auto pb-8 pt-4">
            <div className="relative min-w-[600px]">
              <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 border-t-2 border-slate-200" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 border-t-2 border-blue-600 transition-all duration-500"
                style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
              />
              <div className="relative flex w-full justify-between">
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const isPending = idx > currentStepIndex;

                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStepIndex(idx)}
                      className="group relative flex cursor-pointer flex-col items-center gap-3"
                    >
                      <div
                        className={cn(
                          'z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-background transition-colors',
                          isCompleted && 'border-blue-600 bg-blue-50 text-blue-600',
                          isCurrent &&
                            'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200',
                          isPending &&
                            'border-slate-200 bg-slate-50 text-slate-400 group-hover:border-slate-300'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div
                        className={cn(
                          'absolute top-[52px] w-[120px] whitespace-normal text-center text-[11px] font-medium leading-tight transition-colors',
                          isCurrent
                            ? 'font-bold text-slate-900'
                            : 'text-slate-500 group-hover:text-slate-700'
                        )}
                        style={{ left: '50%', transform: 'translateX(-50%)' }}
                      >
                        {step.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-4 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-sm font-medium">Реквизиты отправки</h3>
                <div className="grid grid-cols-1 gap-4 text-[11px]">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-slate-500">Экспедитор</Label>
                    <div className="font-medium">Global Freight Logistics</div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-slate-500">ТТН / трек-номер</Label>
                    <div className="font-mono font-medium">GFL-89320-X-44</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-slate-500">Откуда</Label>
                      <div className="font-medium">Бишкек, КР</div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-slate-500">Куда</Label>
                      <div className="font-medium">Москва, РФ</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-slate-500">Отправление</Label>
                      <div className="font-medium">2026-05-10</div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-slate-500">Прибытие</Label>
                      <div className="font-medium">2026-05-24</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-medium">
                  <Activity className="h-4 w-4 text-blue-500" />
                  Телеметрия грузовика
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div className="mb-1 flex items-center gap-2 text-slate-500">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <span className="text-[10px] font-medium">Температура</span>
                    </div>
                    <div className="text-lg font-semibold">22.4°C</div>
                    <div className="mt-1 text-[9px] text-emerald-600">В норме</div>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div className="mb-1 flex items-center gap-2 text-slate-500">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-[10px] font-medium">Влажность</span>
                    </div>
                    <div className="text-lg font-semibold">45%</div>
                    <div className="mt-1 text-[9px] text-emerald-600">В норме</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-2">
              <div className="relative h-[300px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                  <path
                    d="M 100,150 Q 300,50 500,200 T 800,100"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray="6,6"
                    className="animate-[dash_20s_linear_infinite]"
                  />
                  <circle cx="100" cy="150" r="6" fill="#3b82f6" />
                  <circle cx="800" cy="100" r="6" fill="#94a3b8" />

                  <g
                    transform={getTruckPosition(currentStepIndex)}
                    style={{ transition: 'transform 1s ease-in-out' }}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r="12"
                      fill="#3b82f6"
                      className="animate-ping opacity-75"
                    />
                    <circle cx="0" cy="0" r="6" fill="#2563eb" stroke="white" strokeWidth="2" />
                    <rect
                      x="-15"
                      y="-35"
                      width="30"
                      height="20"
                      rx="4"
                      fill="white"
                      stroke="#e2e8f0"
                    />
                    <text
                      x="0"
                      y="-22"
                      fontSize="10"
                      textAnchor="middle"
                      fill="#0f172a"
                      fontWeight="bold"
                    >
                      GFL
                    </text>
                  </g>
                </svg>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg border bg-white/90 p-3 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-blue-100 p-2 text-blue-700">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {currentStepIndex === 0
                          ? 'На производстве'
                          : currentStepIndex === 1
                            ? 'Погрузка'
                            : currentStepIndex === 2
                              ? 'В пути · Трасса М5'
                              : currentStepIndex === 3
                                ? 'Таможенный контроль'
                                : 'Доставлено на склад'}
                      </div>
                      <div className="text-xs text-slate-500">Обновлено: только что</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {currentStepIndex === 4 ? 'Прибыло' : '≈ 3100 км до Москвы'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {currentStepIndex === 4 ? 'Успешно' : 'Ориентир: ещё ~4 дня'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-white p-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-medium">
                  <FileCheck className="h-4 w-4 text-slate-500" />
                  Журнал логистики
                </h3>
                <div className="space-y-4 pl-2">
                  {LOG_ENTRIES.map((entry, idx) => {
                    const isCompleted = entry.stepIdx < currentStepIndex;
                    const isCurrent = entry.stepIdx === currentStepIndex;
                    const isLast = idx === LOG_ENTRIES.length - 1;

                    return (
                      <div
                        key={idx}
                        className={cn(
                          'relative pl-6',
                          !isLast && 'border-l-2 pb-4',
                          isCompleted || isCurrent ? 'border-blue-500' : 'border-slate-200'
                        )}
                      >
                        <div
                          className={cn(
                            'absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4',
                            isCompleted
                              ? 'border-white bg-blue-500'
                              : isCurrent
                                ? 'border-blue-500 bg-white'
                                : 'border-white bg-slate-200'
                          )}
                        />
                        <div
                          className={cn(
                            'text-[13px] font-medium',
                            isCompleted
                              ? 'text-slate-900'
                              : isCurrent
                                ? 'text-blue-600'
                                : 'text-slate-400'
                          )}
                        >
                          {entry.title}
                        </div>
                        <div
                          className={cn(
                            'text-[11px]',
                            isCompleted || isCurrent ? 'text-slate-500' : 'text-slate-400'
                          )}
                        >
                          {entry.desc} · {entry.time}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `,
        }}
      />
    </div>
  );
}
