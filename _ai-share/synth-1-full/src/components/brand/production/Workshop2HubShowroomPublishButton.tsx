'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import { ROUTES } from '@/lib/routes';

type BlockedRow = { articleId: string; reasons: string[] };

type Props = {
  collectionId: string;
  articleIds: string[];
  disabled?: boolean;
  onMessage?: (msg: string | null) => void;
};

/** Wave 14: «Опубликовать витрину» — readiness gate + bulk-showroom только для ready. */
export function Workshop2HubShowroomPublishButton({
  collectionId,
  articleIds,
  disabled,
  onMessage,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  const [ready, setReady] = useState<boolean | null>(null);
  const [blocked, setBlocked] = useState<BlockedRow[]>([]);
  const [passedIds, setPassedIds] = useState<string[]>([]);
  const [published, setPublished] = useState(false);

  const runReadiness = useCallback(async () => {
    if (!articleIds.length) return;
    setChecking(true);
    onMessage?.(null);
    try {
      const res = await fetch(
        `/api/workshop2/collections/${encodeURIComponent(collectionId)}/publish-showroom-readiness`,
        {
          method: 'POST',
          headers: {
            ...buildWorkshop2ApiRequestHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ articleIds }),
        }
      );
      const json = (await res.json()) as {
        ready?: boolean;
        blocked?: BlockedRow[];
        passedArticleIds?: string[];
        messageRu?: string;
      };
      setReady(Boolean(json.ready));
      setBlocked(Array.isArray(json.blocked) ? json.blocked : []);
      setPassedIds(Array.isArray(json.passedArticleIds) ? json.passedArticleIds : []);
      onMessage?.(json.messageRu ?? null);
    } catch {
      setReady(false);
      setBlocked([]);
      onMessage?.('Проверка витрины: сеть недоступна');
    } finally {
      setChecking(false);
    }
  }, [articleIds, collectionId, onMessage]);

  useEffect(() => {
    if (articleIds.length > 0) void runReadiness();
  }, [articleIds, runReadiness]);

  const runPublish = async () => {
    const ids = ready ? articleIds : passedIds.length ? passedIds : articleIds;
    if (!ids.length) return;
    setBusy(true);
    onMessage?.(null);
    try {
      const res = await fetch(
        `/api/workshop2/collections/${encodeURIComponent(collectionId)}/bulk-showroom-publish`,
        {
          method: 'POST',
          headers: {
            ...buildWorkshop2ApiRequestHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ articleIds: ids }),
        }
      );
      const json = (await res.json()) as {
        messageRu?: string;
        passed?: number;
        blocked?: unknown[];
      };
      setPublished(res.ok && (json.blocked?.length ?? 0) === 0);
      onMessage?.(
        json.messageRu ??
          (res.ok ? `Опубликовано в витрину: ${json.passed ?? 0}` : 'Ошибка публикации витрины')
      );
      if (res.ok) void runReadiness();
    } catch {
      onMessage?.('Публикация витрины: сеть недоступна');
    } finally {
      setBusy(false);
    }
  };

  const canPublish = ready === true && !checking && !busy && articleIds.length > 0;
  const linesheetHref = `${ROUTES.shop.b2bShowroom}?collection=${encodeURIComponent(collectionId)}`;

  return (
    <div className="flex flex-col gap-1.5" data-testid="workshop2-hub-showroom-publish">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="default"
          className="h-7 gap-1 text-[10px]"
          disabled={disabled || !canPublish || busy}
          onClick={() => void runPublish()}
        >
          <Store className="h-3 w-3" aria-hidden />
          {busy ? 'Публикация…' : 'Опубликовать витрину'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 text-[10px]"
          disabled={checking || busy}
          onClick={() => void runReadiness()}
        >
          {checking ? 'Проверка…' : 'Проверить gates'}
        </Button>
        {published ? (
          <Link
            href={linesheetHref}
            className="text-[10px] font-medium text-indigo-700 underline underline-offset-2"
            data-testid="workshop2-hub-b2b-linesheet-link"
          >
            B2B linesheet →
          </Link>
        ) : null}
      </div>
      {blocked.length > 0 ? (
        <ul className="max-h-24 overflow-y-auto rounded border border-amber-200/80 bg-amber-50/60 px-2 py-1.5 text-[10px] text-amber-950">
          {blocked.map((row) => (
            <li key={row.articleId} className="mb-1 last:mb-0">
              <span className="font-semibold">{row.articleId}</span>
              {': '}
              {row.reasons.join(' · ')}
            </li>
          ))}
        </ul>
      ) : ready === true ? (
        <p className="text-[10px] text-emerald-800">
          Все артикулы прошли showroom gate — можно публиковать.
        </p>
      ) : null}
    </div>
  );
}
