'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  WORKSHOP2_RU_ONBOARDING_STEPS,
  dismissWorkshop2RuOnboarding,
  shouldShowWorkshop2RuOnboardingBanner,
} from '@/lib/production/workshop2-ru-onboarding';

type Props = {
  market?: 'ru' | 'global';
};

/** Wave 10: 5 шагов onboarding на hub — dismissible, не блокирует работу. */
export function Workshop2RuOnboardingBanner({ market = 'ru' }: Props) {
  const [visible, setVisible] = useState(() => shouldShowWorkshop2RuOnboardingBanner(market));

  if (!visible) return null;

  return (
    <div
      className="rounded-lg border border-sky-200 bg-sky-50/90 px-4 py-3 text-sm text-slate-800"
      data-testid="workshop2-ru-onboarding-banner"
      role="region"
      aria-label="Онбординг Workshop2 РФ"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold">Рынок РФ — быстрый старт (5 шагов)</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            dismissWorkshop2RuOnboarding();
            setVisible(false);
          }}
        >
          Скрыть
        </Button>
      </div>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs">
        {WORKSHOP2_RU_ONBOARDING_STEPS.map((s) => (
          <li key={s.id}>
            <span className="font-medium">{s.titleRu}</span> — {s.bodyRu}
          </li>
        ))}
      </ol>
    </div>
  );
}
