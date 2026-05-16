'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  isSketchFloorInSearch,
  replaceSketchFloorInUrl,
  SKETCH_FLOOR_QUERY_PARAM,
} from '@/lib/production/sketch-floor-url';
import { WORKSHOP2_ARTICLE_PANE_PARAM } from '@/lib/production/workshop2-url';

type SketchFloorToast = (opts: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => unknown;

/** Синх `?sketchFloor=1` с URL, переключение режима цеха и копирование ссылки. */
export function useWorkshop2Phase1DossierSketchFloorMode(input: {
  lockedSketchFloorOnly: boolean;
  tzWriteDisabled: boolean;
  toast: SketchFloorToast;
}) {
  const { lockedSketchFloorOnly, tzWriteDisabled, toast } = input;

  const [sketchViewFloor, setSketchViewFloor] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sync = () => {
      if (lockedSketchFloorOnly) {
        setSketchViewFloor(true);
        return;
      }
      setSketchViewFloor(isSketchFloorInSearch(window.location.search));
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [lockedSketchFloorOnly]);

  useEffect(() => {
    if (!lockedSketchFloorOnly || typeof window === 'undefined') return;
    replaceSketchFloorInUrl(true);
  }, [lockedSketchFloorOnly]);

  const sketchEditsLocked = sketchViewFloor || tzWriteDisabled;

  const copySketchFloorLink = useCallback(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set(SKETCH_FLOOR_QUERY_PARAM, '1');
    url.searchParams.set(WORKSHOP2_ARTICLE_PANE_PARAM, 'tz');
    void navigator.clipboard.writeText(url.toString()).then(
      () =>
        toast({
          title: 'Ссылка для цеха скопирована',
          description: 'Откройте её на рабочем месте — сразу режим просмотра (?sketchFloor=1).',
        }),
      () =>
        toast({
          title: 'Не удалось скопировать',
          description: 'Скопируйте адрес страницы вручную и добавьте ?sketchFloor=1',
          variant: 'destructive',
        })
    );
  }, [toast]);

  const setSketchFloorMode = useCallback(
    (floor: boolean) => {
      if (lockedSketchFloorOnly && !floor) {
        toast({
          title: 'Режим ТЗ недоступен',
          description: 'Для вашей роли скетч только для просмотра (цех).',
          variant: 'destructive',
        });
        return;
      }
      if (tzWriteDisabled && !floor) {
        toast({
          title: 'Редактирование недоступно',
          description: 'Нет права «Редактировать производство» — скетч только для просмотра.',
          variant: 'destructive',
        });
        return;
      }
      setSketchViewFloor(floor);
      replaceSketchFloorInUrl(floor);
      toast({
        title: floor ? 'Режим цеха' : 'Режим ТЗ и правок',
        description: floor
          ? 'Метки и подложки не редактируются; экспорт и печать доступны.'
          : 'Можно ставить метки и менять шаблоны.',
      });
    },
    [lockedSketchFloorOnly, toast, tzWriteDisabled]
  );

  return {
    sketchViewFloor,
    sketchEditsLocked,
    setSketchFloorMode,
    copySketchFloorLink,
  };
}
