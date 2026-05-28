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
import { suggestedCompositionLabelMetadataFromDossier } from '@/lib/production/workshop2-composition-label-constructor';
import { W2_COMPOSITION_LABEL_ORIGIN_PRESETS } from '@/lib/production/workshop2-composition-label-spec-constants';
import type {
  Workshop2CompositionLabelConstructorLanguage,
  Workshop2CompositionLabelSpec,
  Workshop2DossierPhase1,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';

function patchSpec(
  prev: Workshop2CompositionLabelSpec | undefined,
  patch: Partial<Workshop2CompositionLabelSpec>
): Workshop2CompositionLabelSpec {
  return { ...(prev ?? {}), ...patch };
}

export function Workshop2CompositionLabelMetadataBlock({
  spec,
  onChange,
  readOnly,
  dossier,
  titleAlert = false,
  embedded = false,
}: {
  spec: Workshop2CompositionLabelSpec | undefined;
  onChange: (next: Workshop2CompositionLabelSpec) => void;
  readOnly: boolean;
  dossier?: Workshop2DossierPhase1 | null;
  /** Красный заголовок — рассинхрон ТЗ / обязательные к закрытию источники. */
  titleAlert?: boolean;
  /** Без внешней рамки и заголовка блока — внутри карточки шага. */
  embedded?: boolean;
}) {
  const ro = readOnly;
  const s = spec ?? {};
  const originVal = (s.labelOriginPresetId ?? '').trim() || 'unset';

  const applyFromDossier = () => {
    const hint = suggestedCompositionLabelMetadataFromDossier(dossier ?? null);
    onChange(patchSpec(s, { ...hint }));
  };

  const inner = (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Язык подписей состава / страны</Label>
          <Select
            disabled={ro}
            value={s.constructorDisplayLanguage ?? 'ru'}
            onValueChange={(v) =>
              onChange(
                patchSpec(s, {
                  constructorDisplayLanguage: v as Workshop2CompositionLabelConstructorLanguage,
                })
              )
            }
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ru" className="text-xs">
                RU
              </SelectItem>
              <SelectItem value="en" className="text-xs">
                EN
              </SelectItem>
              <SelectItem value="bilingual" className="text-xs">
                RU + EN (две подписи в строке состава)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Страна изготовления</Label>
          <Select
            disabled={ro}
            value={originVal}
            onValueChange={(v) =>
              onChange(patchSpec(s, { labelOriginPresetId: v === 'unset' ? '' : v }))
            }
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {W2_COMPOSITION_LABEL_ORIGIN_PRESETS.map((o) => (
                <SelectItem key={o.id || 'unset'} value={o.id || 'unset'} className="text-xs">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Размер на бирке</Label>
          <Input
            className="h-9 text-xs"
            disabled={ro}
            value={s.labelGarmentSizeText ?? ''}
            onChange={(e) => onChange(patchSpec(s, { labelGarmentSizeText: e.target.value }))}
            placeholder="M, 48, или код шкалы из досье"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Артикул</Label>
          <Input
            className="h-9 text-xs"
            disabled={ro}
            value={s.labelArticleSkuText ?? ''}
            onChange={(e) => onChange(patchSpec(s, { labelArticleSkuText: e.target.value }))}
            placeholder="SKU / артикул модели"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Штрих-код / EAN (текст)</Label>
          <Input
            className="h-9 font-mono text-xs"
            disabled={ro}
            value={s.labelBarcodeText ?? ''}
            onChange={(e) => onChange(patchSpec(s, { labelBarcodeText: e.target.value }))}
            placeholder="Цифры EAN-13 или подпись под кодом"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-medium">URL для QR внизу бирки</Label>
          <Input
            className="h-9 text-xs"
            disabled={ro}
            value={s.labelQrUrl ?? ''}
            onChange={(e) => onChange(patchSpec(s, { labelQrUrl: e.target.value }))}
            placeholder="https://… (карточка, «Честный знак», лендинг)"
          />
        </div>
      </div>
      {!ro && dossier ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn('h-9 text-xs')}
          onClick={applyFromDossier}
        >
          Подставить из досье (шкала размеров, EAN при наличии)
        </Button>
      ) : null}
    </>
  );

  if (embedded) {
    return <div className="space-y-3">{inner}</div>;
  }

  return (
    <div className="border-border-subtle space-y-3 rounded-lg border bg-white p-3">
      <p
        className={cn(
          'text-xs font-semibold uppercase tracking-wide',
          titleAlert ? 'text-red-600' : 'text-text-primary'
        )}
      >
        Блок В: метаданные карточки
      </p>
      {inner}
    </div>
  );
}
