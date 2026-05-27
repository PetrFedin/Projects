'use client';

import { useEffect, useState } from 'react';

/** Tailwind `lg` — совпадает с `cabinetHubLayout.asideChrome` (`hidden lg:flex`). */
const LG_MIN_WIDTH_PX = 1024;

/**
 * true только на viewport ≥ lg. До гидрации — false (mobile-first: desktop sidebar не монтируем).
 */
export function useIsLgUp(): boolean {
  const [isLgUp, setIsLgUp] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(`(min-width: ${LG_MIN_WIDTH_PX}px)`);
    const update = () => setIsLgUp(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isLgUp;
}
