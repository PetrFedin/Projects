'use client';

import { Workshop2MaterialTzHintsPanel } from '@/components/brand/production/Workshop2MaterialTzHintsPanel';

/** Подсказки к полям материалов (автономный блок, например вне основного досье). */
export function Workshop2MaterialSectionGuidesBeforeFields({ l2Name }: { l2Name?: string }) {
  return <Workshop2MaterialTzHintsPanel layout="standalone" l2Name={l2Name} />;
}
