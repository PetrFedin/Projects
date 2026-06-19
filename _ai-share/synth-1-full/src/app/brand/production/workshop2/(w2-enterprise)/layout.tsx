import { Suspense, type ReactNode } from 'react';
import { Workshop2PgOnlyEnterpriseShell } from '../workshop2-pg-only-enterprise-shell';

/** Route group `(w2-enterprise)` — Wave L D3: Firebase hard skip + PG-only shell. */
export default function Workshop2EnterpriseLayout({ children }: { children: ReactNode }) {
  return (
    <Workshop2PgOnlyEnterpriseShell>
      <Suspense fallback={null}>{children}</Suspense>
    </Workshop2PgOnlyEnterpriseShell>
  );
}
