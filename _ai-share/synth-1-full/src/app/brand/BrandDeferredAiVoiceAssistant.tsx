'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { isBrandProductionPathname } from '@/lib/layout/brand-production-route';

const AiVoiceAssistant = dynamic(
  () => import('@/components/admin/voice-assistant').then((m) => ({ default: m.AiVoiceAssistant })),
  { ssr: false }
);

/** Voice assistant (framer + lucide) — только production brand, после idle. */
export function BrandDeferredAiVoiceAssistant() {
  const pathname = usePathname();
  const isProductionHub = isBrandProductionPathname(pathname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isProductionHub || typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setMounted(true), { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(() => setMounted(true), 2000);
    return () => clearTimeout(timer);
  }, [isProductionHub]);

  if (!isProductionHub || !mounted) return null;
  return <AiVoiceAssistant />;
}
