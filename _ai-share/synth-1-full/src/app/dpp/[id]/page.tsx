'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import DigitalProductPassport from '@/components/product/digital-product-passport';
import { products as allProducts } from '@/lib/products';

export default function DPPPage() {
  const params = useParams();
  const id = params.id as string;

  const product = useMemo(() => {
    return allProducts.find((p) => p.id === id) || allProducts[0];
  }, [id]);

  return (
    <CabinetPageContent maxWidth="5xl" className="pb-16 px-4 py-6 pb-24 sm:px-6">
      <DigitalProductPassport product={product} />
    </CabinetPageContent>
  );
}
