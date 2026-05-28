'use client';

import type { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Workshop2CompositionLabelFiberConstructorBlock } from '@/components/brand/production/Workshop2CompositionLabelFiberConstructorBlock';
import type { Workshop2CompositionLabelSpec } from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';

function patchSpec(
  prev: Workshop2CompositionLabelSpec | undefined,
  patch: Partial<Workshop2CompositionLabelSpec>
): Workshop2CompositionLabelSpec {
  return { ...(prev ?? {}), ...patch };
}

function BlockShell({
  title,
  stepHint,
  children,
}: {
  title: string;
  stepHint: string;
  children: ReactNode;
}) {
  return (
    <div className="border-border-subtle space-y-2 rounded-md border bg-white p-3">
      <div>
        <p className="text-text-primary text-xs font-medium">{title}</p>
        <p className="text-text-muted text-xs">{stepHint}</p>
      </div>
      {children}
    </div>
  );
}

export function Workshop2CompositionLabelDraftBlockEditors({
  spec,
  onChange,
  readOnly,
  fiberSumAlert,
  careSectionAlert,
  variant = 'standalone',
}: {
  spec: Workshop2CompositionLabelSpec | undefined;
  onChange: (next: Workshop2CompositionLabelSpec) => void;
  readOnly: boolean;
  fiberSumAlert: boolean;
  careSectionAlert: boolean;
  /** Внутри свёрнутого блока шага 3 — короче заголовки, без вводного абзаца. */
  variant?: 'standalone' | 'nested';
}) {
  const ro = readOnly;
  const s = spec ?? {};
  const nested = variant === 'nested';

  return (
    <div className="space-y-3">
      {!nested ? (
        <>
          <p className="text-text-primary text-xs font-medium">Правка блоков по отдельности</p>
          <p className="text-text-muted text-xs leading-snug">
            Те же поля, что на шагах 1–2: правки здесь сразу попадают в черновик (если не включён
            полностью ручной текст ниже).
          </p>
        </>
      ) : null}

      <BlockShell
        title={nested ? 'Юр. и служебные тексты' : 'Шаг 1 · Тексты к бирке'}
        stepHint={
          nested
            ? 'Доп. строки к бирке и примечания технолога.'
            : 'Дополнительные юр./маркировочные строки и примечания технолога.'
        }
      >
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Дополнительно для текста бирки</Label>
          <Textarea
            className="min-h-[64px] text-xs"
            disabled={ro}
            value={s.extraLegalLines ?? ''}
            onChange={(e) => onChange(patchSpec(s, { extraLegalLines: e.target.value }))}
            placeholder="Юридический адрес, EAC, телефон горячей линии…"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Примечания технолога к вёрстке</Label>
          <Textarea
            className="min-h-[56px] text-xs"
            disabled={ro}
            value={s.technologistNotes ?? ''}
            onChange={(e) => onChange(patchSpec(s, { technologistNotes: e.target.value }))}
            placeholder="Особенности печати, языки, запреты формулировок…"
          />
        </div>
      </BlockShell>

      <BlockShell
        title={nested ? 'Состав и уход (дубль для правки здесь)' : 'Шаг 2 · Состав и уход'}
        stepHint={
          nested
            ? 'Волокна и доп. уход — дублируют шаг 2; удобно править рядом с превью.'
            : 'Волокна с долями и пояснения по уходу — отдельные элементы черновика.'
        }
      >
        <Workshop2CompositionLabelFiberConstructorBlock
          spec={s}
          onChange={onChange}
          readOnly={ro}
          sumAlert={fiberSumAlert}
          embedded
        />
        <div className="space-y-1.5">
          <Label className={cn('text-xs font-medium', careSectionAlert ? 'text-red-600' : '')}>
            Доп. текст по уходу / обслуживанию
          </Label>
          <Textarea
            className="min-h-[52px] text-xs"
            disabled={ro}
            value={s.careInstructionsSupplement ?? ''}
            onChange={(e) => onChange(patchSpec(s, { careInstructionsSupplement: e.target.value }))}
            placeholder="Сухая чистка щёткой, не замачивать декор…"
          />
        </div>
      </BlockShell>

      <BlockShell
        title={nested ? 'Низ бирки и лицо' : 'Шаг 3 · Метаданные карточки и лица'}
        stepHint={
          nested
            ? 'Размер, SKU, коды, бренд — дублируют поля из шага 3 слева, если нужно поправить рядом с черновиком.'
            : 'Размер, артикул, коды и текст бренда на лице — отдельные строки внизу бирки.'
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Размер на бирке</Label>
            <Input
              className="h-9 text-xs"
              disabled={ro}
              value={s.labelGarmentSizeText ?? ''}
              onChange={(e) => onChange(patchSpec(s, { labelGarmentSizeText: e.target.value }))}
              placeholder="M, 48…"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Артикул</Label>
            <Input
              className="h-9 text-xs"
              disabled={ro}
              value={s.labelArticleSkuText ?? ''}
              onChange={(e) => onChange(patchSpec(s, { labelArticleSkuText: e.target.value }))}
              placeholder="SKU…"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Штрих-код / EAN</Label>
            <Input
              className="h-9 font-mono text-xs"
              disabled={ro}
              value={s.labelBarcodeText ?? ''}
              onChange={(e) => onChange(patchSpec(s, { labelBarcodeText: e.target.value }))}
              placeholder="Цифры EAN-13…"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">URL для QR</Label>
            <Input
              className="h-9 text-xs"
              disabled={ro}
              value={s.labelQrUrl ?? ''}
              onChange={(e) => onChange(patchSpec(s, { labelQrUrl: e.target.value }))}
              placeholder="https://…"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Текст бренда / юр. блок на лице</Label>
          <Textarea
            className="min-h-[56px] text-xs"
            disabled={ro}
            value={s.brandFaceLines ?? ''}
            onChange={(e) => onChange(patchSpec(s, { brandFaceLines: e.target.value }))}
            placeholder="ТМ, адрес, ИНН…"
          />
        </div>
      </BlockShell>
    </div>
  );
}
