import type { ReactNode } from 'react';

/** Placeholder while auth chunk loads — signature matches production stub. */
export function AuthProviderStub({
  children,
}: {
  children: ReactNode;
  loading?: boolean;
  interactive?: boolean;
  onForceLoad?: () => void;
}) {
  return <>{children}</>;
}
