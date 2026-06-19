'use client';

import { PlatformCoreSegmentError } from '@/components/platform/PlatformCoreSegmentError';

export default function ShopB2bSegmentError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PlatformCoreSegmentError
      {...props}
      role="shop"
      defaultPillar="collection_order"
      title="Ошибка B2B магазина"
    />
  );
}
