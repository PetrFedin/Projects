'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Leaf } from 'lucide-react';

type DppApiPayload = {
  available?: boolean;
  messageRu?: string;
  b2cProductSlug?: string;
};

async function fetchShopProductDpp(slug: string): Promise<DppApiPayload | null> {
  const res = await fetch(`/api/shop/products/${encodeURIComponent(slug)}/dpp`);
  if (!res.ok) return null;
  return (await res.json()) as DppApiPayload;
}

/** Wave 17: ссылка «Прослеживаемость» когда DPP API available (reuse /dpp/[slug]). */
export function ShopDppTraceabilityLink({
  slug,
  className,
  testId = 'shop-dpp-traceability-link',
}: {
  slug: string;
  className?: string;
  testId?: string;
}) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchShopProductDpp(slug).then((data) => {
      if (!cancelled) setAvailable(Boolean(data?.available));
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!available) return null;

  return (
    <Link
      href={`/dpp/${encodeURIComponent(slug)}`}
      className={
        className ??
        'text-[11px] text-emerald-800 underline underline-offset-2 hover:text-emerald-950'
      }
      data-testid={testId}
    >
      Прослеживаемость
    </Link>
  );
}

export function ShopProductDppBadge({ slug }: { slug: string }) {
  const [available, setAvailable] = useState(false);
  const [messageRu, setMessageRu] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchShopProductDpp(slug)
      .then((data) => {
        if (cancelled) return;
        setAvailable(Boolean(data?.available));
        setMessageRu(typeof data?.messageRu === 'string' ? data.messageRu : null);
      })
      .catch(() => {
        if (!cancelled) {
          setAvailable(false);
          setMessageRu(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!available) return null;

  return (
    <Badge
      variant="outline"
      className="gap-1 border-emerald-600/40 text-emerald-800"
      title={messageRu ?? 'Цифровой паспорт продукта (DPP)'}
      data-testid="shop-product-dpp-badge"
    >
      <Leaf className="h-3 w-3" aria-hidden />
      <Link href={`/dpp/${slug}`} className="hover:underline">
        Прослеживаемость
      </Link>
    </Badge>
  );
}
