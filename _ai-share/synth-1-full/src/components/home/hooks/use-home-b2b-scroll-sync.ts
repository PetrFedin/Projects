'use client';

import { useEffect, useState } from 'react';

const B2B_SECTION_IDS = [
  'PRODUCTION_b2b',
  'WORKPLACE_b2b',
  'ECOSYSTEM_b2b',
  'PARTNERS_b2b',
  'CALENDAR_b2b',
  'MEDIA_ECOSYSTEM_b2b',
  'PROCUREMENT_b2b',
  'SHOWCASE_b2b',
] as const;

/** B2B scroll spy — слушатель только когда viewRole === 'b2b' (не на client cold path). */
export function useHomeB2BScrollSync(enabled: boolean) {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [activeB2BSection, setActiveB2BSection] = useState<string>('PRODUCTION_b2b');

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let raf = 0;
    const handleScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setIsScrolledDown(window.scrollY > 300);

        const scrollPosition = window.scrollY + 200;
        for (let i = B2B_SECTION_IDS.length - 1; i >= 0; i--) {
          const id = B2B_SECTION_IDS[i];
          const section = document.getElementById(id);
          if (section && section.offsetTop <= scrollPosition) {
            setActiveB2BSection(id);
            break;
          }
        }
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  return { isScrolledDown, activeB2BSection, setActiveB2BSection };
}
