'use client';

import { PlatformCoreSegmentError } from '@/components/platform/PlatformCoreSegmentError';

export default function BrandB2bOrdersSegmentError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PlatformCoreSegmentError
      {...props}
      role="brand"
      defaultPillar="collection_order"
      title="Ошибка реестра B2B"
    />
  );
}
