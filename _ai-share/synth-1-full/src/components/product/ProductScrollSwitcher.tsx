'use client';

/**
 * Runway Product Switcher — scroll-driven video или цветовые секции.
 * Opt-in: только `displayMode: 'scroll-video'`.
 * Оркестрация вынесена в useRunwayExperienceOrchestration + RunwayExperienceOrchestrator.
 */

export type { ProductScrollSwitcherProps } from '@/hooks/useRunwayExperienceOrchestration';
import { useRunwayExperienceOrchestration } from '@/hooks/useRunwayExperienceOrchestration';
import { RunwayExperienceOrchestrator } from '@/components/product/scroll-switcher/RunwayExperienceOrchestrator';
import type { ProductScrollSwitcherProps } from '@/hooks/useRunwayExperienceOrchestration';
import { useRunwayDevValidation } from '@/hooks/useRunwayDevValidation';

export function ProductScrollSwitcher(props: ProductScrollSwitcherProps) {
  useRunwayDevValidation(process.env.NODE_ENV === 'development');
  const ctx = useRunwayExperienceOrchestration(props);
  return <RunwayExperienceOrchestrator ctx={ctx} />;
}
