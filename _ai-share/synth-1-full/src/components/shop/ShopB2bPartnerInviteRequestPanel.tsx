'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import type { ShopB2bPartnershipStatus } from '@/lib/shop/shop-b2b-partnerships';

/** Onboarding profile-бренда: PG request → connected + чат (без brand-side demo invite). */
export function ShopB2bPartnerInviteRequestPanel({
  brandId,
  brandName,
  status = 'profile',
  collectionId = 'SS27',
  onPartnershipChange,
}: {
  brandId: string;
  brandName: string;
  status?: ShopB2bPartnershipStatus;
  collectionId?: string;
  onPartnershipChange?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function postPartnership(action: 'request' | 'connect') {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch('/api/shop/b2b/partnerships', {
        method: 'POST',
        headers: {
          ...buildWorkshop2ApiRequestHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, brandId, collectionId }),
      });
      const json = (await res.json()) as { ok?: boolean; messageRu?: string };
      if (json.ok) {
        setMessage(json.messageRu ?? (action === 'connect' ? 'Подключено.' : 'Заявка сохранена.'));
        onPartnershipChange?.();
      } else {
        setMessage(json.messageRu ?? 'Не удалось сохранить в PostgreSQL.');
      }
    } catch {
      setMessage('Partnerships API недоступен — запустите core:bootstrap.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="border-border-subtle bg-bg-surface2/40 flex flex-wrap items-center gap-2 rounded-md border px-3 py-2"
      data-testid={`shop-sc-partners-invite-panel-${brandId}`}
    >
      {status === 'profile' ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 text-[10px] font-bold uppercase"
          disabled={busy}
          data-testid={`shop-sc-partners-request-access-${brandId}`}
          onClick={() => void postPartnership('request')}
        >
          {busy ? '…' : 'Запросить доступ'}
        </Button>
      ) : null}
      {status === 'requested' ? (
        <Button
          type="button"
          size="sm"
          variant="default"
          className="h-8 text-[10px] font-bold uppercase"
          disabled={busy}
          data-testid={`shop-sc-partners-connect-demo-${brandId}`}
          onClick={() => void postPartnership('connect')}
        >
          {busy ? '…' : 'Подтвердить доступ'}
        </Button>
      ) : null}
      <Button size="sm" variant="ghost" className="h-8 text-[10px]" asChild>
        <Link
          href={`${ROUTES.shop.messages}?contextType=brand_partnership&contextId=${encodeURIComponent(brandId)}`}
          data-testid={`shop-sc-partners-invite-${brandId}`}
          data-audit-legacy={`partners-discover-invite-${brandId}`}
        >
          Чат
        </Link>
      </Button>
      {message ? (
        <p
          className="text-text-muted w-full text-[10px]"
          role="status"
          data-testid={`shop-sc-partners-onboarding-msg-${brandId}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
