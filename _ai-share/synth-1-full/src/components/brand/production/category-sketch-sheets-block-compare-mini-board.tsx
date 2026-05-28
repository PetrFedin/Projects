'use client';

import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import { CategorySketchTemplateSvg } from '@/lib/production/category-sketch-template';
import type { CategorySketchAnnotatorContext } from '@/components/brand/production/category-sketch-annotator-types';
import type { Workshop2Phase1SketchSheet } from '@/lib/production/workshop2-dossier-phase1.types';
import { sketchPinBelongsToLeaf } from '@/lib/production/workshop2-sketch-pin-templates';
import { cn } from '@/lib/utils';

export function SketchCompareMiniBoard(props: {
  sheet: Workshop2Phase1SketchSheet;
  currentLeaf: HandbookCategoryLeaf;
  sketchContext?: CategorySketchAnnotatorContext;
  leafId: string;
}) {
  const pins = props.sheet.annotations.filter((a) => sketchPinBelongsToLeaf(a, props.leafId));
  return (
    <div className="border-border-default relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-white">
      <div className="absolute inset-0">
        {props.sheet.imageDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- data URL из досье
          <img src={props.sheet.imageDataUrl} alt="" className="h-full w-full object-contain" />
        ) : (
          <CategorySketchTemplateSvg
            leaf={props.currentLeaf}
            sketchContext={props.sketchContext}
            className="h-full w-full"
          />
        )}
      </div>
      {pins.map((a, idx) => (
        <div
          key={a.annotationId}
          className={cn(
            'absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-md',
            a.priority === 'critical'
              ? 'bg-rose-600'
              : a.stage === 'qc'
                ? 'bg-amber-600'
                : 'bg-teal-600'
          )}
          style={{ left: `${a.xPct}%`, top: `${a.yPct}%` }}
        >
          {idx + 1}
        </div>
      ))}
    </div>
  );
}
