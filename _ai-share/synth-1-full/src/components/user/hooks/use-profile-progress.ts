'use client';

import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export interface ProfileProgressResult {
  current: {
    title: string;
    percent: number;
    items: Array<{ key: string; label: string; done: boolean }>;
  };
}

const PROGRESS_ITEMS: Array<{
  key: string;
  label: string;
  getDone: (vals: Record<string, unknown>) => boolean;
}> = [
  {
    key: 'displayName',
    label: 'Имя для отображения',
    getDone: (v) => !!v.displayName && String(v.displayName).trim().length >= 2,
  },
  { key: 'email', label: 'Email', getDone: (v) => !!v.email && String(v.email).includes('@') },
  {
    key: 'identity',
    label: 'Имя и фамилия',
    getDone: (v) => !!(v as any).identity?.firstName && !!(v as any).identity?.lastName,
  },
  {
    key: 'birthDate',
    label: 'Дата рождения',
    getDone: (v) => !!((v as any).personalInfo?.birthDate ?? '').trim(),
  },
  {
    key: 'country',
    label: 'Страна',
    getDone: (v) => !!((v as any).personalInfo?.country ?? '').trim(),
  },
  { key: 'city', label: 'Город', getDone: (v) => !!((v as any).personalInfo?.city ?? '').trim() },
  {
    key: 'phone',
    label: 'Телефон',
    getDone: (v) => !!((v as any).personalInfo?.phones?.primary ?? '').trim(),
  },
  {
    key: 'address',
    label: 'Адрес',
    getDone: (v) => !!((v as any).personalInfo?.addresses?.primary ?? '').trim(),
  },
];

export function useProfileProgress<
  TFieldValues extends Record<string, unknown> = Record<string, unknown>,
>(form: UseFormReturn<TFieldValues>): ProfileProgressResult {
  const values = form.watch();

  return useMemo(() => {
    const items = PROGRESS_ITEMS.map(({ key, label, getDone }) => ({
      key,
      label,
      done: getDone((values ?? {}) as Record<string, unknown>),
    }));
    const doneCount = items.filter((i) => i.done).length;
    const total = items.length;
    const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;
    const title = doneCount === total ? 'Профиль заполнен' : `Заполнено ${doneCount} из ${total}`;

    return {
      current: {
        title,
        percent,
        items,
      },
    };
  }, [values]);
}
