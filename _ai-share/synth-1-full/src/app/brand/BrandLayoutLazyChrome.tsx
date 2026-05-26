'use client';

import dynamic from 'next/dynamic';
import { Store } from 'lucide-react';

export const BrandLayoutLoadingScreen = dynamic(
  () =>
    import('./BrandLayoutLoadingScreen').then((m) => ({
      default: m.BrandLayoutLoadingScreen,
    })),
  { ssr: false }
);

/** Иконка хаба — re-export из lazy-chrome (без отдельного lucide import в layout shell). */
export { Store as BrandHubIcon };

/** Floating / secondary chrome — отдельные чанки, не блокируют первый compile layout. */
export const StageContextBar = dynamic(
  () =>
    import('@/components/brand/production/StageContextBar').then((m) => ({
      default: m.StageContextBar,
    })),
  { ssr: false }
);

export const BrandMobileSidebarSheet = dynamic(
  () =>
    import('./BrandMobileSidebarSheet').then((m) => ({
      default: m.BrandMobileSidebarSheet,
    })),
  { ssr: false }
);

/** W2 notifications — только /brand/production*, не в initial brand layout chunk. */
export const Workshop2BrandNotificationsBell = dynamic(
  () =>
    import('@/components/brand/Workshop2BrandNotificationsBell').then((m) => ({
      default: m.Workshop2BrandNotificationsBell,
    })),
  { ssr: false }
);
