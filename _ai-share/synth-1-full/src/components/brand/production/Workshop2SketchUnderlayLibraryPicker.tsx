'use client';

import { useCallback, useState } from 'react';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import {
  listWorkshop2SketchUnderlayPresets,
  type Workshop2SketchUnderlayPreset,
} from '@/lib/production/workshop2-sketch-underlay-presets';
import { getUnknownErrorMessage } from '@/lib/unknown-error-message';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type Workshop2UnderlayAppliedPayload = {
  dataUrl: string;
  fileName: string;
  presetLabelRu: string;
};

type Props = {
  currentLeaf: HandbookCategoryLeaf;
  disabled?: boolean;
  onUnderlayApplied: (payload: Workshop2UnderlayAppliedPayload) => void;
};

async function svgHrefToDataUrl(href: string): Promise<string> {
  const res = await fetch(href, { cache: 'force-cache' });
  if (!res.ok) throw new Error(`Не удалось загрузить ${href}: ${res.status}`);
  const text = await res.text();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`;
}

export function Workshop2SketchUnderlayLibraryPicker({
  currentLeaf,
  disabled,
  onUnderlayApplied,
}: Props) {
  const presets = listWorkshop2SketchUnderlayPresets(currentLeaf);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const applyPreset = useCallback(
    async (preset: Workshop2SketchUnderlayPreset) => {
      if (disabled || busy) return;
      setBusy(true);
      try {
        const dataUrl = await svgHrefToDataUrl(preset.href);
        onUnderlayApplied({
          dataUrl,
          fileName: `${preset.id}-underlay.svg`,
          presetLabelRu: preset.labelRu,
        });
      } catch (e) {
        const msg = getUnknownErrorMessage(e, 'Неизвестная ошибка');
        toast({
          title: 'Подложка не загрузилась',
          description: msg,
          variant: 'destructive',
        });
      } finally {
        setBusy(false);
      }
    },
    [busy, disabled, onUnderlayApplied, toast]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-2 text-xs"
          disabled={Boolean(disabled) || busy}
        >
          <Layers className="h-4 w-4 shrink-0" aria-hidden />
          {busy ? 'Загрузка…' : 'Подложка из справочника'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[14rem]">
        {presets.map((p) => (
          <DropdownMenuItem key={p.id} disabled={busy} onClick={() => void applyPreset(p)}>
            {p.labelRu}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
