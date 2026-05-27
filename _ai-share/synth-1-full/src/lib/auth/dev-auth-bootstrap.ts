/**
 * Централизация dev/demo-авторизации: путь → email, синтетический Hub-профиль, известный пароль мок-репозитория.
 *
 * - Path auto-login: только если `NODE_ENV !== 'production'` и не выключено через
 *   `NEXT_PUBLIC_SYNTH_DEV_AUTO_LOGIN=false`.
 * - Пароль для демо-пользователей в mock-auth: `NEXT_PUBLIC_SYNTH_DEV_PASSWORD` или дефолт `password123`.
 */

export const SYNTH_MOCK_KNOWN_PASSWORD =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SYNTH_DEV_PASSWORD?.trim()) ||
  'password123';

/** Сессия после path-based auto-login — для баннера «dev session». */
export const SYNTH_DEV_AUTO_LOGIN_SESSION_KEY = 'syntha_dev_auto_login';

export function isSynthDevAutoLoginEnabled(): boolean {
  if (process.env.NODE_ENV === 'production') return false;
  return process.env.NEXT_PUBLIC_SYNTH_DEV_AUTO_LOGIN !== 'false';
}

export const EMAIL_TO_SYNTH_ROLE: Record<string, string> = {
  'admin@syntha.ai': 'admin',
  'brand@syntha.ai': 'brand',
  'shop@syntha.ai': 'shop',
  'dist@syntha.ai': 'distributor',
  'factory@syntha.ai': 'manufacturer',
  'supplier@syntha.ai': 'supplier',
  'elena.petrova@example.com': 'client',
};

export function resolvePathBasedDevSignInEmail(pathname: string, search: string): string | null {
  const isSupplier = search.includes('role=supplier');
  if (pathname.startsWith('/admin')) return 'admin@syntha.ai';
  if (pathname.startsWith('/brand')) return 'brand@syntha.ai';
  if (pathname.startsWith('/distributor')) return 'dist@syntha.ai';
  if (pathname.startsWith('/factory'))
    return isSupplier ? 'supplier@syntha.ai' : 'factory@syntha.ai';
  if (pathname.startsWith('/client')) return 'elena.petrova@example.com';
  if (pathname.startsWith('/shop')) return 'shop@syntha.ai';
  return null;
}

export function markSynthDevAutoLoginSession(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(SYNTH_DEV_AUTO_LOGIN_SESSION_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function clearSynthDevAutoLoginSession(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(SYNTH_DEV_AUTO_LOGIN_SESSION_KEY);
  } catch {
    /* ignore */
  }
}
