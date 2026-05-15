'use client';

import React from 'react';
import { Clock, ShieldAlert } from 'lucide-react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { calculatePreliminaryCogs } from '@/lib/production/workshop2-sample-economics';

export function Workshop2PredictiveRiskPanel({ dossier }: { dossier?: Workshop2DossierPhase1 }) {
  const cogs = dossier ? calculatePreliminaryCogs(dossier) : null;

  return (
    <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm w-full mt-4">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="bg-slate-50 text-slate-500 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 shadow-sm">
            <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-text-primary text-base font-semibold">Прогноз рисков поставки (AI) и Предварительная себестоимость</h2>
            <p className="text-text-secondary text-[11px] leading-snug">
              Интеграция с предиктивной моделью задержек и T&A календарем (требуется подключение ERP).
            </p>
          </div>
        </div>
      </div>
      
      {cogs && (
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border-subtle bg-slate-50 p-4">
            <div className="text-xs text-text-secondary mb-1">Сырье и материалы</div>
            <div className="text-lg font-semibold text-text-primary">{cogs.materialCost.toFixed(2)} ₽</div>
          </div>
          <div className="rounded-lg border border-border-subtle bg-slate-50 p-4">
            <div className="text-xs text-text-secondary mb-1">Пошив (SASH × ставка)</div>
            <div className="text-lg font-semibold text-text-primary">{cogs.laborCost.toFixed(2)} ₽</div>
          </div>
          <div className="rounded-lg border border-border-default bg-blue-50 p-4">
            <div className="text-xs text-blue-600 mb-1 font-medium">Предварительная COGS</div>
            <div className="text-xl font-bold text-blue-700">{cogs.totalCogs.toFixed(2)} ₽</div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-dashed border-border-subtle bg-bg-surface2 p-6 flex flex-col items-center justify-center text-center">
        <Clock className="h-8 w-8 text-slate-300 mb-3" />
        <h3 className="text-sm font-semibold text-text-primary mb-1">Сбор данных для модели</h3>
        <p className="text-xs text-text-secondary max-w-xs">
          Модуль риска активируется после накопления истории заказов и поставок фабрики. Ожидается подключение коннектора ERP для загрузки исторических данных.
        </p>
      </div>
    </div>
  );
}
