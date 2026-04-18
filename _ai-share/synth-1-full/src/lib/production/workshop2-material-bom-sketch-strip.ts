import type {
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2SketchRevisionSnapshot,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  bomRefsFromLiveAnnotations,
  bomRefsFromSnapshotAnnotations,
  classifyBomLineRef,
  latestRevisionSnapshotForLeaf,
} from '@/lib/production/sketch-bom-integrity';
import { sketchPinBelongsToLeaf } from '@/lib/production/workshop2-sketch-pin-templates';
import { W2_MATERIAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-material-bom-anchors';

/** Редактор скетча в хабе «Табель мер: хаб ТЗ» (вкладка «Конструкция»). */
export const W2_VISUALS_SKETCH_ANCHOR_ID = 'w2-construction-sketch-hub';

export type MaterialSketchBomStrip = {
  state: 'na' | 'ok' | 'warn';
  title: string;
  bullets: string[];
  /** Куда вести «перейти»: материалы или скетч. */
  primaryTarget: 'material' | 'sketch';
  anchorId: string;
  jumpLabel: string;
};

/**
 * Сводка для хаба «Материалы»: живые метки скетча vs последний снимок ревизии (BOM-ref).
 */
export function buildMaterialSketchBomStrip(
  leafId: string,
  annotations: Workshop2Phase1CategorySketchAnnotation[] | undefined,
  snapshots: Workshop2SketchRevisionSnapshot[] | undefined
): MaterialSketchBomStrip {
  const live = annotations ?? [];
  const snap = latestRevisionSnapshotForLeaf(snapshots, leafId);

  const pins = live.filter((a) => sketchPinBelongsToLeaf(a, leafId));
  if (pins.length === 0) {
    return {
      state: 'na',
      title: 'Скетч ↔ BOM',
      bullets: [
        'Нет меток на скетче для этого листа — контроль привязки к строкам BOM не применяется.',
      ],
      primaryTarget: 'sketch',
      anchorId: W2_VISUALS_SKETCH_ANCHOR_ID,
      jumpLabel: 'К скетчу',
    };
  }

  if (!snap) {
    const withRef = pins.filter((p) => (p.linkedBomLineRef ?? '').trim()).length;
    return {
      state: withRef > 0 ? 'warn' : 'na',
      title: 'Скетч ↔ BOM',
      bullets: [
        withRef > 0
          ? `${withRef} меток с BOM-ref, но нет снимка ревизии скетча — зафиксируйте ревизию, чтобы сравнивать с baseline.`
          : 'Снимок ревизии скетча отсутствует — после расстановки меток сохраните ревизию.',
        'Цех и закуп ориентируются на строки BOM; метки должны ссылаться на те же ref.',
      ],
      primaryTarget: 'sketch',
      anchorId: W2_VISUALS_SKETCH_ANCHOR_ID,
      jumpLabel: 'К скетчу',
    };
  }

  const baseline = bomRefsFromSnapshotAnnotations(snap.annotations, leafId);
  const liveSet = bomRefsFromLiveAnnotations(live, leafId);

  let empty = 0;
  let notInBaseline = 0;
  let noSnap = 0;
  for (const p of pins) {
    const st = classifyBomLineRef(p.linkedBomLineRef, baseline, liveSet);
    if (st === 'empty') empty += 1;
    else if (st === 'not_in_baseline') notInBaseline += 1;
    else if (st === 'no_snapshot') noSnap += 1;
  }

  if (empty === 0 && notInBaseline === 0 && noSnap === 0) {
    return {
      state: 'ok',
      title: 'Скетч ↔ BOM',
      bullets: ['Метки с BOM-ref согласованы с последним снимком ревизии для этого листа.'],
      primaryTarget: 'material',
      anchorId: W2_MATERIAL_SUBPAGE_ANCHORS.mat,
      jumpLabel: 'К материалу',
    };
  }

  const bullets: string[] = [];
  if (empty > 0) bullets.push(`${empty} меток без BOM-ref — привяжите к строке материала/состава.`);
  if (notInBaseline > 0)
    bullets.push(
      `${notInBaseline} меток с ref вне последнего снимка — обновите состав или сделайте новую ревизию скетча.`
    );
  if (noSnap > 0 && baseline.size === 0)
    bullets.push('В снимке не было BOM-ref у меток — зафиксируйте ревизию после привязки.');

  return {
    state: 'warn',
    title: 'Скетч ↔ BOM',
    bullets: bullets.length ? bullets : ['Проверьте привязку меток к строкам BOM.'],
    primaryTarget: 'sketch',
    anchorId: W2_VISUALS_SKETCH_ANCHOR_ID,
    jumpLabel: 'К скетчу',
  };
}
