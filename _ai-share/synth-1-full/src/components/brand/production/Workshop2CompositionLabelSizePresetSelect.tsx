'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { W2_COMPOSITION_LABEL_SIZE_PRESETS } from '@/lib/production/workshop2-composition-label-spec-constants';
import type { Workshop2CompositionLabelSpec } from '@/lib/production/workshop2-dossier-phase1.types';

function patchSpec(
  prev: Workshop2CompositionLabelSpec | undefined,
  patch: Partial<Workshop2CompositionLabelSpec>
): Workshop2CompositionLabelSpec {
  return { ...(prev ?? {}), ...patch };
}

export function Workshop2CompositionLabelSizePresetSelect({
  spec,
  onChange,
  readOnly,
}: {
  spec: Workshop2CompositionLabelSpec | undefined;
  onChange: (next: Workshop2CompositionLabelSpec) => void;
  readOnly: boolean;
}) {
  const s = spec ?? {};
  const presetId = (s.labelSizePresetId ?? '').trim();
  const selectVal =
    presetId && W2_COMPOSITION_LABEL_SIZE_PRESETS.some((p) => p.id === presetId)
      ? presetId
      : 'custom';

  return (
    <div className="space-y-1.5 sm:col-span-2">
      <Label className="text-xs font-medium">Типовые габариты (ГОСТ/рынок)</Label>
      <Select
        disabled={readOnly}
        value={selectVal}
        onValueChange={(v) => {
          if (v === 'custom') {
            onChange(patchSpec(s, { labelSizePresetId: '' }));
            return;
          }
          const p = W2_COMPOSITION_LABEL_SIZE_PRESETS.find((x) => x.id === v);
          if (!p) return;
          onChange(
            patchSpec(s, {
              labelSizePresetId: v,
              labelWidthMm: String(p.widthMm),
              labelHeightMm: String(p.heightMm),
            })
          );
        }}
      >
        <SelectTrigger className="h-9 text-xs">
          <SelectValue placeholder="Выберите или введите мм вручную" />
        </SelectTrigger>
        <SelectContent>
          {W2_COMPOSITION_LABEL_SIZE_PRESETS.map((p) => (
            <SelectItem key={p.id} value={p.id} className="text-xs" title={p.hint}>
              {p.label}
            </SelectItem>
          ))}
          <SelectItem value="custom" className="text-xs">
            Свои мм (только поля ширина/высота)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
