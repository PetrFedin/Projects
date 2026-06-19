import {
  HANDBOOK_SNAPSHOT_SECTION_KEYS,
  type HandbookCheckSnapshot,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-handbook-check-snapshot';

export function isWorkshop2Phase1DossierHandbookCheckClean(
  handbookCheckSnapshot: HandbookCheckSnapshot | null | undefined
): boolean {
  if (!handbookCheckSnapshot) return false;
  const hasIssues =
    HANDBOOK_SNAPSHOT_SECTION_KEYS.some(
      (sid) => (handbookCheckSnapshot.bySection[sid]?.length ?? 0) > 0
    ) || (handbookCheckSnapshot.globalHandbookWarnings?.length ?? 0) > 0;
  return !hasIssues;
}

/** Material section hint by L2 category (sectionBodies). */
export function buildWorkshop2Phase1DossierMaterialMatHint(l2Name: string): string {
  if (l2Name === 'Верхняя одежда') {
    return 'Зафиксируйте основную ткань (shell), подкладку, утеплитель, дублирин и фурнитуру.';
  }
  if (l2Name === 'Платья и сарафаны') {
    return 'Укажите основную ткань, подкладку (если есть) и фурнитуру (молния, пуговицы).';
  }
  return 'Материальная рамка для передачи в снабжение. Указывайте состав в процентах.';
}
