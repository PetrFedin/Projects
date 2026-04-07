'use client';

import { useMemo, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  buildPassportAttributeReferenceRows,
  groupPassportReferenceBySection,
  type PassportReferenceSection,
} from '@/lib/production/workshop2-passport-attribute-reference';
import { cn } from '@/lib/utils';

const SECTION_LABELS: Record<PassportReferenceSection, string> = {
  general: 'Паспорт',
  visuals: 'Визуал / эскиз',
  material: 'Материалы (BOM)',
  construction: 'Конструкция (вкл. табель мер)',
};

const SECTION_ORDER: PassportReferenceSection[] = ['general', 'visuals', 'material', 'construction'];

function levelsShort(levels: ('l1' | 'l2' | 'l3')[]): string {
  return levels.map((x) => x.toUpperCase()).join('·');
}

export function Workshop2PassportAttributeReferenceBlock() {
  const [open, setOpen] = useState(false);
  const grouped = useMemo(() => {
    const rows = buildPassportAttributeReferenceRows(1);
    return groupPassportReferenceBySection(rows);
  }, []);

  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <LucideIcons.TableProperties className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
          <p className="text-[11px] font-semibold leading-snug text-slate-800">
            Справочник: атрибуты каталога → секция паспорта → ур. L1–L3
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 shrink-0 text-[10px]"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? 'Свернуть' : 'Развернуть'}
        </Button>
      </div>
      {open ? (
        <div className="max-h-[min(70vh,560px)] space-y-4 overflow-y-auto border-t border-indigo-100/80 bg-white px-3 py-3 text-[11px]">
          <p className="leading-snug text-slate-600">
            Канонический каталог (`attribute-catalog.instance.json`): какие поля относятся к разделам ТЗ и на каком
            уровне ветки (линия L1, группа L2, карточка модели L3) их логично вести. «Общие» — регуляторика и глобальный
            пул (ТН ВЭД, страны, маркировка, ключи из <span className="font-mono text-[10px]">globalAttributeIds</span>
            ). Цвет и техпак в справочнике показаны в «Визуал»; в форме ТЗ секция поля по-прежнему из каталога/группы.
          </p>
          {SECTION_ORDER.map((sec) => {
            const list = grouped[sec];
            if (!list.length) {
              return (
                <section key={sec}>
                  <h4 className="border-b border-slate-100 pb-1 text-[11px] font-bold text-slate-800">
                    {SECTION_LABELS[sec]}
                  </h4>
                  <p className="mt-1 text-[10px] text-slate-500">Нет атрибутов в фазе 1 для этой секции.</p>
                </section>
              );
            }
            return (
              <section key={sec}>
                <h4 className="border-b border-slate-100 pb-1 text-[11px] font-bold text-slate-800">
                  {SECTION_LABELS[sec]}{' '}
                  <span className="font-normal text-slate-400">({list.length})</span>
                </h4>
                <div className="mt-1 overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-left text-[10px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-[9px] uppercase tracking-wide text-slate-500">
                        <th className="py-1.5 pr-2 font-semibold">Атрибут</th>
                        <th className="py-1.5 pr-2 font-semibold">Группа</th>
                        <th className="py-1.5 pr-2 font-semibold">Общий</th>
                        <th className="py-1.5 pr-2 font-semibold">Уровни</th>
                        <th className="py-1.5 font-semibold">Обяз. ф.1</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((row) => (
                        <tr key={row.attributeId} className="border-b border-slate-50 last:border-0">
                          <td className="py-1 pr-2 align-top">
                            <span className="font-medium text-slate-900">{row.name}</span>
                            <span className="mt-0.5 block font-mono text-[9px] text-slate-500">{row.attributeId}</span>
                          </td>
                          <td className="py-1 pr-2 align-top text-slate-600">{row.groupId}</td>
                          <td className="py-1 pr-2 align-top">
                            <span
                              className={cn(
                                'rounded px-1 py-0.5 font-medium',
                                row.passportCommon ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-600'
                              )}
                            >
                              {row.passportCommon ? 'Да' : 'Нет'}
                            </span>
                          </td>
                          <td className="py-1 pr-2 align-top font-mono tabular-nums text-slate-800">
                            {levelsShort(row.applicableLevels)}
                          </td>
                          <td className="py-1 align-top text-slate-700">{row.requiredForPhase1 ? 'Да' : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
