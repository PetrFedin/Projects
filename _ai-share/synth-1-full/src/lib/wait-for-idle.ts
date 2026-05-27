/** Idle scheduling для отложенной загрузки данных и UI на главной. */
export function waitForIdle(timeout = 2000): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => resolve(), { timeout });
      return;
    }
    window.setTimeout(() => resolve(), Math.min(timeout, 800));
  });
}

export function scheduleIdleMount(onReady: () => void, timeout = 3500, fallbackMs = 1500) {
  if (typeof window === 'undefined') return () => undefined;

  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(onReady, { timeout });
    return () => window.cancelIdleCallback(id);
  }

  const timer = window.setTimeout(onReady, fallbackMs);
  return () => window.clearTimeout(timer);
}
