'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

type Props = {
  targetHref: string;
  testId: string;
  message: ReactNode;
};

/** Core mode: легаси-маршрут вне golden path → канонический URL (явная ссылка, без auto-replace). */
export function PlatformCoreLegacyPathRedirect({ targetHref, testId, message }: Props) {
  return (
    <p data-testid={testId} className="text-text-secondary py-8 text-center text-sm">
      {message}{' '}
      <Link href={targetHref} className="text-accent-primary font-medium underline">
        Перейти →
      </Link>
    </p>
  );
}
