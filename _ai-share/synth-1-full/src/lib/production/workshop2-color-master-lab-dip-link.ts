/**
 * Wave 3 P1 #32: PIM Color Master → lab dip linkage from PG/runtime palette.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  getWorkshop2ColorMasterPalette,
  resolveColorWithStaticFallback,
} from '@/lib/production/workshop2-color-master';
import { COLOR_PALETTE } from '@/lib/color-palette';

export type Workshop2ColorMasterLabDipLink = {
  colorwayLabel: string;
  colorCode: string | null;
  hex: string | null;
  labDipStatus: 'pending' | 'approved' | 'rejected' | 'missing';
  linked: boolean;
};

export function extractWorkshop2ColorwayLabels(dossier: Workshop2DossierPhase1): string[] {
  const colorAssignment = dossier.assignments?.find(
    (a) => a.kind === 'canonical' && a.attributeId === 'color'
  );
  const fromAssignment =
    colorAssignment?.values?.map((v) => String(v.text ?? '').trim()).filter(Boolean) ?? [];
  if (fromAssignment.length) return fromAssignment;
  const fromStatuses = Object.keys(dossier.colorLabDipStatuses ?? {});
  return fromStatuses;
}

export function syncWorkshop2ColorMasterLabDipLinks(dossier: Workshop2DossierPhase1): {
  dossier: Workshop2DossierPhase1;
  links: Workshop2ColorMasterLabDipLink[];
} {
  const labels = extractWorkshop2ColorwayLabels(dossier);
  const statuses = dossier.colorLabDipStatuses ?? {};
  const links: Workshop2ColorMasterLabDipLink[] = labels.map((label) => {
    const key = label.toLowerCase().replace(/\s+/g, '_');
    const resolved = resolveColorWithStaticFallback(label);
    const rawStatus = statuses[key] ?? statuses[label];
    const labDipStatus =
      rawStatus === 'approved' || rawStatus === 'pending' || rawStatus === 'rejected'
        ? rawStatus
        : ('missing' as const);
    return {
      colorwayLabel: label,
      colorCode: resolved?.code ?? null,
      hex: resolved?.hex ?? null,
      labDipStatus,
      linked: Boolean(resolved),
    };
  });

  return {
    links,
    dossier: {
      ...dossier,
      colorMasterLabDipMirror: {
        syncedAt: new Date().toISOString(),
        source: resolvedPaletteSource(),
        linkCount: links.filter((l) => l.linked).length,
        pendingCount: links.filter((l) => l.labDipStatus === 'pending').length,
        links,
      },
    },
  };
}

function resolvedPaletteSource(): 'runtime' | 'static' {
  const palette = getWorkshop2ColorMasterPalette();
  return palette !== COLOR_PALETTE ? 'runtime' : 'static';
}
