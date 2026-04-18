'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { WholesaleOrderMatrix } from '@/components/b2b/WholesaleOrderMatrix';
import { RegistryPageShell } from '@/components/design-system';

/** NuOrder-style: матрица заказа. ?mode=… ; ?brand= — контекст PIM (Fashion Cloud). */
export default function B2BMatrixPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get('mode') || 'buy_now') as 'buy_now' | 'reorder' | 'pre_order';
  const validMode = ['buy_now', 'reorder', 'pre_order'].includes(mode) ? mode : 'buy_now';
  const pimBrand = searchParams.get('brand') || undefined;

  return (
    <RegistryPageShell className="max-w-none !p-0">
      <WholesaleOrderMatrix
        onClose={() => router.back()}
        activeRetailer={{ name: 'Партнер' }}
        initialOrderMode={validMode}
        pimBrandContext={pimBrand}
      />
    </RegistryPageShell>
  );
}
