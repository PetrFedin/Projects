import { isPublicShellPathname } from '@/lib/layout/public-shell-route';
import {
  isSynthDevAutoLoginEnabled,
  resolvePathBasedDevSignInEmail,
} from '@/lib/auth/dev-auth-bootstrap';

/**
 * Немедленный restore сессии: кабинеты, login/auth, dev path-login.
 * Public shell (`/`, `/catalog`, …) — откладываем до idle (perf dev-perf).
 */
export function shouldEagerAuthBootstrap(
  pathname: string | null | undefined,
  search = ''
): boolean {
  /** Playwright dev:e2e — без idle-defer auth (client cabinet loading / flaky smoke). */
  if (process.env.NEXT_PUBLIC_E2E === 'true') return true;
  if (!pathname) return true;
  if (pathname.startsWith('/login') || pathname.startsWith('/auth')) return true;
  if (!isPublicShellPathname(pathname)) return true;
  if (isSynthDevAutoLoginEnabled()) {
    const email = resolvePathBasedDevSignInEmail(pathname, search);
    if (email) return true;
  }
  return false;
}
