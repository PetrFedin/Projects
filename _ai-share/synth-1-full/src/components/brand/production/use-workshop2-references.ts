'use client';

import { useEffect, useState } from 'react';
import {
  getWorkshop2ColorMasterPalette,
  setWorkshop2ColorMasterPalette,
} from '@/lib/production/workshop2-color-master';
import {
  fetchWorkshop2RefColors,
  fetchWorkshop2RefMaterials,
  fetchWorkshop2RefPomTemplates,
  fetchWorkshop2RefTnved,
  fetchWorkshop2ReferencesStatus,
  type Workshop2RefColorDto,
  type Workshop2RefTnvedDto,
} from '@/lib/production/workshop2-references-client';
import type {
  Workshop2MaterialLibraryRow,
  Workshop2PomTemplateRow,
} from '@/lib/production/workshop2-reference-seeds';
import {
  getWorkshop2MaterialsLibrarySeed,
  getWorkshop2PomTemplatesForLeaf,
} from '@/lib/production/workshop2-reference-seeds';

export type Workshop2RefsLoadState = 'idle' | 'loading' | 'ready' | 'error';

function staticColors(): Workshop2RefColorDto[] {
  return getWorkshop2ColorMasterPalette().map((c) => ({
    code: c.code,
    name: c.name,
    hex: c.hex,
    ...(c.pantone ? { pantone: c.pantone } : {}),
  }));
}

export function useWorkshop2RefColors(active = true) {
  const [state, setState] = useState<Workshop2RefsLoadState>('idle');
  const [items, setItems] = useState<Workshop2RefColorDto[]>(staticColors);
  const [source, setSource] = useState<'postgres' | 'static'>('static');

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setState('loading');
    void fetchWorkshop2RefColors().then((data) => {
      if (cancelled) return;
      if (data?.items?.length) {
        setItems(data.items);
        setSource(data.source);
        if (data.source === 'postgres') {
          setWorkshop2ColorMasterPalette(
            data.items.map((c) => ({
              code: c.code,
              name: c.name,
              hex: c.hex,
              pantone: c.pantone,
            }))
          );
        }
        setState('ready');
      } else {
        setItems(staticColors());
        setSource('static');
        setState('ready');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [active]);

  return { state, items, source, preferApi: source === 'postgres' };
}

export function useWorkshop2RefTnved(leafId: string | undefined, active = true) {
  const [state, setState] = useState<Workshop2RefsLoadState>('idle');
  const [items, setItems] = useState<Workshop2RefTnvedDto[]>([]);

  useEffect(() => {
    if (!active) {
      setItems([]);
      setState('idle');
      return;
    }
    let cancelled = false;
    setState('loading');
    void fetchWorkshop2RefTnved(leafId?.trim() || undefined).then((data) => {
      if (cancelled) return;
      setItems(data?.items ?? []);
      setState('ready');
    });
    return () => {
      cancelled = true;
    };
  }, [active, leafId]);

  return { state, items };
}

export function useWorkshop2RefMaterials(active = true) {
  const [state, setState] = useState<Workshop2RefsLoadState>('idle');
  const [items, setItems] = useState<Workshop2MaterialLibraryRow[]>(
    getWorkshop2MaterialsLibrarySeed
  );

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setState('loading');
    void fetchWorkshop2RefMaterials().then((data) => {
      if (cancelled) return;
      if (data?.items?.length) setItems(data.items);
      setState('ready');
    });
    return () => {
      cancelled = true;
    };
  }, [active]);

  return { state, items };
}

export function useWorkshop2RefPomTemplates(leafId: string | undefined, active = true) {
  const [state, setState] = useState<Workshop2RefsLoadState>('idle');
  const [items, setItems] = useState<Workshop2PomTemplateRow[]>([]);

  useEffect(() => {
    if (!active || !leafId?.trim()) {
      setItems([]);
      setState('idle');
      return;
    }
    let cancelled = false;
    setState('loading');
    const lid = leafId.trim();
    void fetchWorkshop2RefPomTemplates(lid).then((data) => {
      if (cancelled) return;
      const fromApi = data?.items?.length ? data.items : [];
      setItems(fromApi.length ? fromApi : getWorkshop2PomTemplatesForLeaf(lid));
      setState('ready');
    });
    return () => {
      cancelled = true;
    };
  }, [active, leafId]);

  return { state, items };
}

export function useWorkshop2ReferencesPgOk(active = true) {
  const [pgOk, setPgOk] = useState(false);
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    void fetchWorkshop2ReferencesStatus().then((s) => {
      if (!cancelled) setPgOk(s?.postgres === 'ok');
    });
    return () => {
      cancelled = true;
    };
  }, [active]);
  return pgOk;
}
