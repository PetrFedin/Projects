'use client';

import {
  W2_MATERIAL_TZ_CARE_BODY,
  W2_MATERIAL_TZ_CARE_TITLE,
  W2_MATERIAL_TZ_FABRIC_WEIGHT_PARTS,
  W2_MATERIAL_TZ_FABRIC_WEIGHT_TITLE,
  W2_MATERIAL_TZ_INSULATION_LEVEL_BODY,
  W2_MATERIAL_TZ_INSULATION_LEVEL_TITLE,
  W2_MATERIAL_TZ_INSULATION_MATERIAL_BODY_PARTS,
  W2_MATERIAL_TZ_INSULATION_MATERIAL_TITLE,
  W2_MATERIAL_TZ_REGION_KICKER,
  W2_MATERIAL_TZ_TEMPERATURE_BODY,
  W2_MATERIAL_TZ_TEMPERATURE_TITLE,
  W2_MATERIAL_TZ_THERMO_TECH_BODY,
  W2_MATERIAL_TZ_THERMO_TECH_TITLE,
  type Workshop2MaterialTzHintsLayout,
} from '@/lib/production/workshop2-material-tz-copy';

export type Workshop2MaterialTzHintsPanelProps = {
  l2Name?: string;
  layout: Workshop2MaterialTzHintsLayout;
};

export function Workshop2MaterialTzHintsPanel({ l2Name, layout }: Workshop2MaterialTzHintsPanelProps) {
  const outer = l2Name === 'Верхняя одежда';
  return (
    <details className="group space-y-3 rounded-xl border border-border-default bg-white/95 p-3 shadow-sm">
      <summary className="flex cursor-pointer items-center justify-between text-[10px] font-semibold text-text-primary list-none [&::-webkit-details-marker]:hidden">
        {W2_MATERIAL_TZ_REGION_KICKER[layout]}
        <span className="text-text-muted text-[10px] font-normal group-open:hidden">Показать подсказки</span>
        <span className="text-text-muted hidden text-[10px] font-normal group-open:inline">Скрыть</span>
      </summary>
      <div className="space-y-3 mt-3">
        <div>
          <p className="text-text-primary text-[11px] font-semibold">{W2_MATERIAL_TZ_FABRIC_WEIGHT_TITLE}</p>
          <p className="border-accent-primary/30 bg-accent-primary/10 text-text-primary mt-1 rounded-r-md border-l-2 py-1.5 pl-2 text-[10px] leading-snug">
            {W2_MATERIAL_TZ_FABRIC_WEIGHT_PARTS.beforePrimary}
            <span className="font-semibold">{W2_MATERIAL_TZ_FABRIC_WEIGHT_PARTS.primaryBold}</span>
            {W2_MATERIAL_TZ_FABRIC_WEIGHT_PARTS.betweenPrimaryAndFace}
            <span className="font-semibold">{W2_MATERIAL_TZ_FABRIC_WEIGHT_PARTS.faceBold}</span>
            {W2_MATERIAL_TZ_FABRIC_WEIGHT_PARTS.afterFace}
            {outer ? (
              <span className="text-accent-primary/90 mt-1 block">
                {W2_MATERIAL_TZ_FABRIC_WEIGHT_PARTS.outerwearNoteLead}
                <span className="font-semibold">{W2_MATERIAL_TZ_FABRIC_WEIGHT_PARTS.outerwearShellBold}</span>
                {W2_MATERIAL_TZ_FABRIC_WEIGHT_PARTS.outerwearNoteTail}
              </span>
            ) : null}
          </p>
        </div>
        <div>
          <p className="text-text-primary text-[11px] font-semibold">{W2_MATERIAL_TZ_TEMPERATURE_TITLE}</p>
          <p className="text-text-secondary mt-1 text-[10px] leading-snug">{W2_MATERIAL_TZ_TEMPERATURE_BODY}</p>
        </div>
        {outer ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-text-primary text-[11px] font-semibold">
                  {W2_MATERIAL_TZ_INSULATION_MATERIAL_TITLE}
                </p>
                <p className="text-text-primary mt-1 rounded-r-md border-l-2 border-amber-200 bg-amber-50/40 py-1.5 pl-2 text-[10px] leading-snug">
                  {W2_MATERIAL_TZ_INSULATION_MATERIAL_BODY_PARTS.beforeBold}
                  <span className="font-semibold">{W2_MATERIAL_TZ_INSULATION_MATERIAL_BODY_PARTS.tagBold}</span>
                  {W2_MATERIAL_TZ_INSULATION_MATERIAL_BODY_PARTS.afterBold}
                </p>
              </div>
              <div>
                <p className="text-text-primary text-[11px] font-semibold">
                  {W2_MATERIAL_TZ_INSULATION_LEVEL_TITLE}
                </p>
                <p className="text-text-primary mt-1 rounded-r-md border-l-2 border-amber-200 bg-amber-50/40 py-1.5 pl-2 text-[10px] leading-snug">
                  {W2_MATERIAL_TZ_INSULATION_LEVEL_BODY}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-text-primary text-[11px] font-semibold">{W2_MATERIAL_TZ_THERMO_TECH_TITLE}</p>
                <p className="text-text-primary mt-1 rounded-r-md border-l-2 border-teal-200 bg-teal-50/40 py-1.5 pl-2 text-[10px] leading-snug">
                  {W2_MATERIAL_TZ_THERMO_TECH_BODY}
                </p>
              </div>
              <div>
                <p className="text-text-primary text-[11px] font-semibold">{W2_MATERIAL_TZ_CARE_TITLE[layout]}</p>
                <p className="text-text-secondary mt-1 text-[10px] leading-snug">{W2_MATERIAL_TZ_CARE_BODY}</p>
              </div>
            </div>
          </>
        ) : (
          <div>
            <p className="text-text-primary text-[11px] font-semibold">{W2_MATERIAL_TZ_CARE_TITLE[layout]}</p>
            <p className="text-text-secondary mt-1 text-[10px] leading-snug">{W2_MATERIAL_TZ_CARE_BODY}</p>
          </div>
        )}
      </div>
    </details>
  );
}
