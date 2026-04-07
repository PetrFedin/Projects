import type { Workshop2MesDefectCodeRow } from '@/lib/production/workshop2-dossier-phase1.types';

/** Стартовая иерархия L1→L2 для MES / отчёта смены (дополняется в досье). */
export const DEFAULT_SKETCH_MES_DEFECT_CATALOG: Workshop2MesDefectCodeRow[] = [
  { code: 'L1-SEW', label: 'Пошив / швы' },
  { code: 'L2-SEW-ST', label: 'Строчка: пропуски, натяжение', parentCode: 'L1-SEW' },
  { code: 'L2-SEW-AL', label: 'Смещение шва / асимметрия', parentCode: 'L1-SEW' },
  { code: 'L1-MAT', label: 'Материал / цвет / состав' },
  { code: 'L2-MAT-DEF', label: 'Дефект полотна', parentCode: 'L1-MAT' },
  { code: 'L1-DIM', label: 'Размеры / мерки / посадка' },
  { code: 'L1-FUR', label: 'Фурнитура' },
  { code: 'L1-FIN', label: 'Отделка / глажка / бирки' },
];

export function mergedMesDefectCatalog(custom?: Workshop2MesDefectCodeRow[]): Workshop2MesDefectCodeRow[] {
  const c = custom ?? [];
  const have = new Set(c.map((x) => x.code));
  return [...c, ...DEFAULT_SKETCH_MES_DEFECT_CATALOG.filter((d) => !have.has(d.code))];
}

export function defectLabelByCode(
  catalog: Workshop2MesDefectCodeRow[],
  code: string | undefined
): string | undefined {
  if (!code?.trim()) return undefined;
  return catalog.find((x) => x.code === code)?.label;
}

/** Цепочка parent → child для хлебных крошек в UI (корень первым). */
export function defectBreadcrumbChain(
  catalog: Workshop2MesDefectCodeRow[],
  code: string | undefined
): { code: string; label: string }[] {
  if (!code?.trim()) return [];
  const byCode = new Map(catalog.map((r) => [r.code, r]));
  const chain: { code: string; label: string }[] = [];
  let cur: string | undefined = code.trim();
  const guard = new Set<string>();
  while (cur && !guard.has(cur)) {
    guard.add(cur);
    const row = byCode.get(cur);
    if (!row) {
      chain.unshift({ code: cur, label: cur });
      break;
    }
    chain.unshift({ code: row.code, label: row.label });
    cur = row.parentCode?.trim() || undefined;
  }
  return chain;
}

/** Агрегат: сколько раз каждый код встречается на метках ветки. */
export function mesDefectCodeCountsOnPins(
  annotations: { mesDefectCode?: string; categoryLeafId: string }[],
  leafId: string
): { code: string; count: number }[] {
  const m = new Map<string, number>();
  for (const a of annotations) {
    if (a.categoryLeafId !== leafId) continue;
    const c = (a.mesDefectCode ?? '').trim();
    if (!c) continue;
    m.set(c, (m.get(c) ?? 0) + 1);
  }
  return [...m.entries()]
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code));
}
