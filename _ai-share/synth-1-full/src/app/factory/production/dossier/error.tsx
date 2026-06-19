'use client';

import { PlatformCoreSegmentError } from '@/components/platform/PlatformCoreSegmentError';

export default function FactoryDossierSegmentError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PlatformCoreSegmentError
      {...props}
      role="manufacturer"
      defaultPillar="development"
      title="Ошибка досье цеха"
    />
  );
}
