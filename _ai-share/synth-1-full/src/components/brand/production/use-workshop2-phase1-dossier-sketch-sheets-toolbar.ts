'use client';

import { useEffect, useMemo, type Dispatch, type SetStateAction } from 'react';
import { normalizeSketchSheets } from '@/lib/production/workshop2-sketch-sheets';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

type SketchSurface = 'master' | 'sheets';
type SketchWorkspaceTab = 'sketch' | 'sublevels';

/** Нормализованные листы скетча, выбранный лист в тулбаре, синх picker/surface при смене листа каталога. */
export function useWorkshop2Phase1DossierSketchSheetsToolbar(input: {
  leafId: string;
  sketchSheets: Workshop2DossierPhase1['sketchSheets'];
  categorySketchImageDataUrl: string | null | undefined;
  sketchSheetPickerId: string | null;
  setSketchSheetPickerId: Dispatch<SetStateAction<string | null>>;
  sketchSurface: SketchSurface;
  setSketchSurface: Dispatch<SetStateAction<SketchSurface>>;
  setSketchWorkspaceTab: Dispatch<SetStateAction<SketchWorkspaceTab>>;
}) {
  const {
    leafId,
    sketchSheets,
    categorySketchImageDataUrl,
    sketchSheetPickerId,
    setSketchSheetPickerId,
    sketchSurface,
    setSketchSurface,
    setSketchWorkspaceTab,
  } = input;

  useEffect(() => {
    setSketchWorkspaceTab('sketch');
    setSketchSurface('master');
  }, [leafId, setSketchSurface, setSketchWorkspaceTab]);

  const normalizedSketchSheets = useMemo(() => normalizeSketchSheets(sketchSheets), [sketchSheets]);

  const activeToolbarSketchSheet = useMemo(() => {
    if (!sketchSheetPickerId) return undefined;
    return normalizedSketchSheets.find((s) => s.sheetId === sketchSheetPickerId);
  }, [normalizedSketchSheets, sketchSheetPickerId]);

  const canOpenSketchFromToolbar =
    Boolean(categorySketchImageDataUrl?.trim()) ||
    Boolean(activeToolbarSketchSheet?.imageDataUrl?.trim());

  useEffect(() => {
    if (normalizedSketchSheets.length === 0) {
      setSketchSheetPickerId(null);
      return;
    }
    setSketchSheetPickerId((prev) => {
      if (prev && normalizedSketchSheets.some((s) => s.sheetId === prev)) return prev;
      return normalizedSketchSheets[0]!.sheetId;
    });
  }, [normalizedSketchSheets, setSketchSheetPickerId]);

  useEffect(() => {
    if (normalizedSketchSheets.length === 0 && sketchSurface === 'sheets') {
      setSketchSurface('master');
    }
  }, [normalizedSketchSheets.length, setSketchSurface, sketchSurface]);

  return { normalizedSketchSheets, canOpenSketchFromToolbar };
}
