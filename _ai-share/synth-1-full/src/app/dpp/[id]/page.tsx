'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import DigitalProductPassport from '@/components/product/digital-product-passport';
import { products as allProducts } from '@/lib/products';
import { RegistryPageShell } from '@/components/design-system';

export default function DPPPage() {
  const params = useParams();
  const id = params.id as string;

  const product = useMemo(() => {
    return allProducts.find((p) => p.id === id) || allProducts[0];
  }, [id]);

  return (
    <RegistryPageShell className="pb-16">
      <DigitalProductPassport product={product} />
    </RegistryPageShell>
  );
}
