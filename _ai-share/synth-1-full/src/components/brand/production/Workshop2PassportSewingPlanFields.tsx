'use client';

import { useEffect, useMemo, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { WorkshopLabelWithHint } from '@/components/brand/production/WorkshopFieldHints';
import type { Workshop2PassportProductionBrief } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  RF_FEDERAL_SUBJECT_OPTIONS,
  type RfFederalSubjectOption,
} from '@/lib/production/workshop2-rf-federal-subjects';
import { SEWING_ENTERPRISE_PARTNER_OPTIONS } from '@/lib/production/workshop2-sewing-enterprise-partners';
import type {
  SewingPlanPartnerRow,
  Workshop2SewingPlanReferencePayload,
} from '@/lib/production/workshop2-sewing-plan-reference-types';
import { cn } from '@/lib/utils';

function toggleInList(list: string[] | undefined, id: string): string[] {
  const cur = list ?? [];
  return cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
}

function summarizeLabels(ids: string[] | undefined, labelById: Map<string, string>, empty: string) {
  if (!ids?.length) return empty;
  if (ids.length === 1) return labelById.get(ids[0]!) ?? ids[0]!;
  if (ids.length === 2) {
    const a = labelById.get(ids[0]!) ?? ids[0]!;
    const b = labelById.get(ids[1]!) ?? ids[1]!;
    return `${a}, ${b}`;
  }
  return `${ids.length} выбрано`;
}

type MultiIsoPickerProps = {
  disabled?: boolean;
  value: string[] | undefined;
  onChange: (next: string[] | undefined) => void;
  subjectOptions: readonly RfFederalSubjectOption[];
};

function MultiIsoPicker({ disabled, value, onChange, subjectOptions }: MultiIsoPickerProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const labelById = useMemo(
    () => new Map(subjectOptions.map((o) => [o.iso31662, o.name])),
    [subjectOptions]
  );
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return subjectOptions;
    return subjectOptions.filter(
      (o) => o.name.toLowerCase().includes(qq) || o.iso31662.toLowerCase().includes(qq)
    );
  }, [q, subjectOptions]);

  const summary = summarizeLabels(value, labelById, 'Выберите субъект(ы) РФ…');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="h-auto min-h-9 w-full justify-between gap-2 px-2 py-1.5 text-left text-sm font-normal"
        >
          <span className="line-clamp-2 min-w-0">{summary}</span>
          <LucideIcons.ChevronsUpDown className="text-text-muted h-4 w-4 shrink-0" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(100vw-1.5rem,22rem)] p-0" align="start">
        <div className="border-border-subtle border-b p-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск по названию или коду RU-…"
            className="h-8 text-sm"
            disabled={disabled}
          />
        </div>
        <ScrollArea className="h-64">
          <ul className="p-1">
            {filtered.map((o) => {
              const checked = (value ?? []).includes(o.iso31662);
              return (
                <li key={o.iso31662}>
                  <label
                    className={cn(
                      'hover:bg-bg-surface2 flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-sm',
                      disabled && 'pointer-events-none opacity-60'
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      disabled={disabled}
                      className="mt-0.5"
                      onCheckedChange={() => {
                        const next = toggleInList(value, o.iso31662);
                        onChange(next.length ? next : undefined);
                      }}
                    />
                    <span className="min-w-0 leading-snug">
                      <span className="text-text-primary font-medium">{o.name}</span>
                      <span className="text-text-muted ml-1 text-[10px]">{o.iso31662}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
        <div className="border-border-subtle flex justify-end gap-2 border-t p-2">
          <Button type="button" variant="ghost" size="sm" className="h-7 text-[11px]" onClick={() => onChange(undefined)}>
            Сбросить
          </Button>
          <Button type="button" variant="secondary" size="sm" className="h-7 text-[11px]" onClick={() => setOpen(false)}>
            Готово
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

type MultiPartnerPickerProps = {
  disabled?: boolean;
  value: string[] | undefined;
  onChange: (next: string[] | undefined) => void;
  partnerOptions: readonly SewingPlanPartnerRow[];
};

function MultiPartnerPicker({ disabled, value, onChange, partnerOptions }: MultiPartnerPickerProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const labelById = useMemo(
    () => new Map(partnerOptions.map((o) => [o.id, o.label])),
    [partnerOptions]
  );
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return partnerOptions;
    return partnerOptions.filter(
      (o) => o.label.toLowerCase().includes(qq) || o.id.toLowerCase().includes(qq)
    );
  }, [q, partnerOptions]);

  const summary = summarizeLabels(value, labelById, 'Выберите предприятие(я)…');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="h-auto min-h-9 w-full justify-between gap-2 px-2 py-1.5 text-left text-sm font-normal"
        >
          <span className="line-clamp-2 min-w-0">{summary}</span>
          <LucideIcons.ChevronsUpDown className="text-text-muted h-4 w-4 shrink-0" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(100vw-1.5rem,22rem)] p-0" align="start">
        <div className="border-border-subtle border-b p-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск по названию или id…"
            className="h-8 text-sm"
            disabled={disabled}
          />
        </div>
        <ScrollArea className="h-48">
          <ul className="p-1">
            {filtered.map((o) => (
              <li key={o.id}>
                <label
                  className={cn(
                    'hover:bg-bg-surface2 flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-sm',
                    disabled && 'pointer-events-none opacity-60'
                  )}
                >
                  <Checkbox
                    checked={(value ?? []).includes(o.id)}
                    disabled={disabled}
                    className="mt-0.5"
                    onCheckedChange={() => {
                      const next = toggleInList(value, o.id);
                      onChange(next.length ? next : undefined);
                    }}
                  />
                  <span className="text-text-primary leading-snug">{o.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <div className="border-border-subtle flex justify-end gap-2 border-t p-2">
          <Button type="button" variant="ghost" size="sm" className="h-7 text-[11px]" onClick={() => onChange(undefined)}>
            Сбросить
          </Button>
          <Button type="button" variant="secondary" size="sm" className="h-7 text-[11px]" onClick={() => setOpen(false)}>
            Готово
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

type Props = {
  brief: Workshop2PassportProductionBrief | undefined;
  disabled?: boolean;
  /** Частичное обновление брифа паспорта. */
  onPatch: (patch: Partial<Workshop2PassportProductionBrief>) => void;
  /** Класс для лейбла секции (гейт «заполнено»). */
  labelFilledClassName: string;
};

export function Workshop2PassportSewingPlanFields({ brief, disabled, onPatch, labelFilledClassName }: Props) {
  const pb = brief ?? {};
  const [refPayload, setRefPayload] = useState<Workshop2SewingPlanReferencePayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch('/api/brand/sewing-plan-reference')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((raw: unknown) => {
        if (cancelled || !raw || typeof raw !== 'object') return;
        const j = raw as Workshop2SewingPlanReferencePayload;
        if (!Array.isArray(j.partners) || !Array.isArray(j.rfSubjects)) return;
        setRefPayload(j);
      })
      .catch(() => {
        if (!cancelled) setRefPayload(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const subjectOptions = refPayload?.rfSubjects?.length ? refPayload.rfSubjects : RF_FEDERAL_SUBJECT_OPTIONS;
  const partnerOptions: readonly SewingPlanPartnerRow[] =
    refPayload && refPayload.partners.length > 0 ? refPayload.partners : SEWING_ENTERPRISE_PARTNER_OPTIONS;

  const partnersHint =
    refPayload?.source.partners === 'b2b_json'
      ? 'Список партнёров из переменной окружения B2B_SEWING_PARTNERS_JSON.'
      : 'Партнёры из каталога брендов, демо-справочник и контрагенты из operational B2B (снимок заказов на сервере). Полная замена списка — через B2B_SEWING_PARTNERS_JSON.';

  const rfHint =
    refPayload?.source.rfSubjects === 'base_plus_extra'
      ? 'К списку ISO 3166-2:RU добавлены записи из RF_FEDERAL_SUBJECT_EXTRA_JSON.'
      : 'Субъекты РФ — базовый справочник ISO 3166-2:RU; при появлении новых кодов расширьте через RF_FEDERAL_SUBJECT_EXTRA_JSON.';

  return (
    <div id="w2-passport-sewing-region" className="scroll-mt-24 space-y-3">
      <WorkshopLabelWithHint
        labelClassName={labelFilledClassName}
        hint={
          <>
            <p>
              Субъекты РФ — из справочника ISO 3166-2 (см. ниже). Предприятия — из API{' '}
              <code className="text-[10px]">/api/brand/sewing-plan-reference</code>:{' '}
              {partnersHint}
            </p>
            <p className="text-text-secondary">{rfHint}</p>
            <p className="text-text-secondary">
              Если партнёра нет в списке, укажите название в поле справа. Дополнительный произвольный текст
              — внизу (в т.ч. контур вне РФ).
            </p>
          </>
        }
      >
        Регион / контур пошива (план)
      </WorkshopLabelWithHint>

      <div className="space-y-1">
        <Label className="text-text-primary text-[11px] font-semibold leading-none mb-0">
          Субъект(ы) РФ
        </Label>
        <MultiIsoPicker
          disabled={disabled}
          value={pb.sewingRfSubjectIsoCodes}
          onChange={(next) => onPatch({ sewingRfSubjectIsoCodes: next })}
          subjectOptions={subjectOptions}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1 space-y-1">
          <Label className="text-text-primary text-[11px] font-semibold leading-none mb-0">
            Предприятие / партнёр
          </Label>
          <MultiPartnerPicker
            disabled={disabled}
            value={pb.sewingEnterprisePartnerIds}
            onChange={(next) => onPatch({ sewingEnterprisePartnerIds: next })}
            partnerOptions={partnerOptions}
          />
        </div>
        <div className="w-full shrink-0 space-y-1 sm:w-[min(100%,14rem)]">
          <Label htmlFor="w2-passport-sewing-partner-custom" className="text-text-primary text-[11px] font-semibold leading-none mb-0">
            Нет в списке
          </Label>
          <Input
            id="w2-passport-sewing-partner-custom"
            className="h-9 text-sm"
            disabled={disabled}
            placeholder="Введите текстом"
            value={pb.sewingEnterprisesCustomNote ?? ''}
            onChange={(e) => onPatch({ sewingEnterprisesCustomNote: e.target.value || undefined })}
          />
        </div>
      </div>

      <div className="space-y-1">
        <WorkshopLabelWithHint
          htmlFor="w2-passport-sewing-free-note"
          labelClassName="mb-0"
          hint={
            <p>
              Произвольное уточнение контура (цех, КНП, страна вне РФ и т.д.). Не дублирует страну
              происхождения товара в комплаенсе.
            </p>
          }
        >
          Комментарий к контуру (необязательно)
        </WorkshopLabelWithHint>
        <Textarea
          id="w2-passport-sewing-free-note"
          className="min-h-[28px] max-h-28 w-full resize-y py-1.5 text-sm leading-snug"
          rows={2}
          disabled={disabled}
          placeholder="Например: финишные операции в другом регионе; или КНП за пределами РФ."
          value={pb.sewingRegionPlanNote ?? ''}
          onChange={(e) => onPatch({ sewingRegionPlanNote: e.target.value || undefined })}
        />
      </div>
    </div>
  );
}
