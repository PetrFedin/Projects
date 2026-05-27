'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { W2_COMPOSITION_LABEL_FONT_PRESETS } from '@/lib/production/workshop2-composition-label-spec-constants';
import type {
  Workshop2CompositionLabelFontPreset,
  Workshop2CompositionLabelSpec,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';

function patchSpec(
  prev: Workshop2CompositionLabelSpec | undefined,
  patch: Partial<Workshop2CompositionLabelSpec>
): Workshop2CompositionLabelSpec {
  return { ...(prev ?? {}), ...patch };
}

function parsePt(raw: string | undefined, fallback: number): number {
  const n = Number.parseFloat(String(raw ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : fallback;
}

type TypographyQuickPresetId = 'child_safe' | 'tech_dense';

const TYPOGRAPHY_QUICK_PRESETS: {
  id: TypographyQuickPresetId;
  label: string;
  hint: string;
  patch: Partial<Workshop2CompositionLabelSpec>;
}[] = [
  {
    id: 'child_safe',
    label: 'Детская (крупнее)',
    hint: 'Крупнее текст и чуть свободнее межстрочник для читабельности.',
    patch: {
      typographyBodyPt: '10.5',
      typographyLineHeightPct: '140',
      typographyLetterSpacingEm: '0.01',
    },
  },
  {
    id: 'tech_dense',
    label: 'Техническая (плотнее)',
    hint: 'Компактная посадка текста для узкой бирки.',
    patch: {
      typographyBodyPt: '8.5',
      typographyLineHeightPct: '125',
      typographyLetterSpacingEm: '0',
    },
  },
];

export function Workshop2CompositionLabelTypographyControls({
  spec,
  onChange,
  readOnly,
}: {
  spec: Workshop2CompositionLabelSpec | undefined;
  onChange: (next: Workshop2CompositionLabelSpec) => void;
  readOnly: boolean;
}) {
  const ro = readOnly;
  const s = spec ?? {};
  const pt = parsePt(s.typographyBodyPt, 9);
  const bump = (d: number) => {
    const next = Math.round(Math.max(6, Math.min(24, pt + d)) * 10) / 10;
    onChange(patchSpec(s, { typographyBodyPt: String(next) }));
  };

  return (
    <div className="border-border-subtle space-y-3 rounded-md border bg-neutral-50/50 p-3">
      <p className="text-text-primary text-xs font-medium">Шрифт черновика и PDF</p>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Быстрые пресеты</Label>
        <div className="flex flex-wrap items-center gap-1.5">
          {TYPOGRAPHY_QUICK_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-[11px]"
              title={preset.hint}
              disabled={ro}
              onClick={() => onChange(patchSpec(s, preset.patch))}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Гарнитура</Label>
          <Select
            disabled={ro}
            value={(s.typographyFontPreset ?? '') || 'unset'}
            onValueChange={(v) =>
              onChange(
                patchSpec(s, {
                  typographyFontPreset:
                    v === 'unset' ? '' : (v as Workshop2CompositionLabelFontPreset),
                })
              )
            }
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Базовый набор" />
            </SelectTrigger>
            <SelectContent>
              {W2_COMPOSITION_LABEL_FONT_PRESETS.map((o) => (
                <SelectItem key={o.id || 'unset'} value={o.id || 'unset'} className="text-xs">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Кегль основного текста, pt</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 w-9 shrink-0 px-0 text-xs"
              disabled={ro || pt <= 6}
              onClick={() => bump(-0.5)}
              aria-label="Уменьшить кегль"
            >
              −
            </Button>
            <Input
              className="h-9 flex-1 text-xs tabular-nums"
              inputMode="decimal"
              disabled={ro}
              value={s.typographyBodyPt ?? ''}
              onChange={(e) => onChange(patchSpec(s, { typographyBodyPt: e.target.value }))}
              placeholder="9"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 w-9 shrink-0 px-0 text-xs"
              disabled={ro || pt >= 24}
              onClick={() => bump(0.5)}
              aria-label="Увеличить кегль"
            >
              +
            </Button>
          </div>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label
            className={cn(
              'text-xs font-medium',
              (s.typographyFontPreset ?? '') === 'custom' ? '' : 'text-text-muted'
            )}
          >
            Своя гарнитура (название для типографии)
          </Label>
          <Input
            className="h-9 text-xs"
            disabled={ro || (s.typographyFontPreset ?? '') !== 'custom'}
            value={s.typographyCustomFontName ?? ''}
            onChange={(e) => onChange(patchSpec(s, { typographyCustomFontName: e.target.value }))}
            placeholder="Если в гарнитуре выбрано «Своя» — укажите начертание"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Межстрочный интервал, %</Label>
          <Input
            className="h-9 text-xs tabular-nums"
            inputMode="decimal"
            disabled={ro}
            value={s.typographyLineHeightPct ?? ''}
            onChange={(e) => onChange(patchSpec(s, { typographyLineHeightPct: e.target.value }))}
            placeholder="130"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Межбуквенный интервал, em</Label>
          <Input
            className="h-9 text-xs tabular-nums"
            inputMode="decimal"
            disabled={ro}
            value={s.typographyLetterSpacingEm ?? ''}
            onChange={(e) => onChange(patchSpec(s, { typographyLetterSpacingEm: e.target.value }))}
            placeholder="0 или 0.02"
          />
        </div>
      </div>
      <p className="text-text-muted text-xs leading-snug">
        Те же параметры доступны в диалоге «Редактировать оформление бирки» при настройке раскладки.
      </p>
    </div>
  );
}
