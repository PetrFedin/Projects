'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';
import { getPlatformCoreDemo, resolvePageCollectionId } from '@/lib/platform-core-hub-matrix';
import { attachWorkshop2TzBundleToArticleChat } from '@/lib/production/workshop2-tz-attach-to-chat-client';

type Props = {
  variant: 'manufacturer' | 'supplier';
};

/** Compose strip: attach TZ bundle from dossier export into article contextual chat. */
export function FactoryCommsAttachTzComposeStrip({ variant }: Props) {
  const searchParams = useSearchParams();
  const collectionId = resolvePageCollectionId({ collection: searchParams.get('collection') });
  const demo = getPlatformCoreDemo(collectionId);
  const articleId =
    searchParams.get('articleId')?.trim() ||
    searchParams.get('article')?.trim() ||
    demo.demoArticleId;
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  if (variant !== 'manufacturer' || !collectionId || !articleId) return null;

  const attach = async () => {
    setBusy(true);
    setHint(null);
    const res = await attachWorkshop2TzBundleToArticleChat({ collectionId, articleId });
    setHint(res.ok ? 'ТЗ прикреплено к чату артикула' : (res.message ?? 'Не удалось прикрепить'));
    setBusy(false);
  };

  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-md border border-emerald-200/80 bg-emerald-50/60 px-2 py-1.5 text-[11px]"
      data-testid="factory-comms-attach-tz-compose-strip"
    >
      <Paperclip className="h-3 w-3 text-emerald-700" aria-hidden />
      <span className="text-text-secondary">
        Dossier · {collectionId}/{articleId}
      </span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-7 text-[10px]"
        disabled={busy}
        onClick={() => void attach()}
        data-testid="factory-comms-attach-tz-compose-cta"
      >
        {busy ? '…' : 'Attach TZ из dossier'}
      </Button>
      {hint ? (
        <span className="text-text-muted" data-testid="factory-comms-attach-tz-compose-hint">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
