'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Link2, QrCode } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import type { CollectionSample } from '@/lib/types/samples';
import { registerShowroomSampleTag } from '@/lib/fashion/showroom-sample-client';
import {
  barcodeImageUrlCode128,
  buildShowroomScanUrlWithRegistryId,
  isShowroomRegistryShortId,
  qrImageUrlForText,
  type ShowroomSampleTagPayloadV1,
} from '@/lib/fashion/showroom-sample-tag';

const REGISTRY_CACHE_PREFIX = 'synth1.showroomRegistryIdForSample.';

function toPayload(sample: CollectionSample): ShowroomSampleTagPayloadV1 {
  return {
    v: 1,
    sampleId: sample.id,
    sku: sample.sku,
    productId: sample.productId,
    name: sample.name,
    color: sample.color,
    sampleSize: sample.size,
    internalArticleCode: sample.internalArticleCode,
  };
}

export function ShowroomSampleTagDialog({
  sample,
  trigger,
  disabled,
}: {
  sample: CollectionSample;
  trigger?: ReactNode;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState('');
  const [registryId, setRegistryId] = useState<string | null>(null);
  const [regError, setRegError] = useState(false);

  const payload = useMemo(() => toPayload(sample), [sample]);
  const scanPath = ROUTES.shop.b2bScanner;

  useEffect(() => {
    if (!open || !origin) return;
    const cacheKey = `${REGISTRY_CACHE_PREFIX}${sample.id}`;
    const cached = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(cacheKey) : null;
    if (cached && isShowroomRegistryShortId(cached)) {
      setRegistryId(cached);
      setRegError(false);
      return;
    }
    let cancelled = false;
    setRegistryId(null);
    setRegError(false);
    registerShowroomSampleTag(payload)
      .then((id) => {
        if (cancelled) return;
        try {
          sessionStorage.setItem(cacheKey, id);
        } catch {
          /* ignore quota */
        }
        setRegistryId(id);
      })
      .catch(() => {
        if (!cancelled) setRegError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open, origin, sample.id, payload]);

  const scanUrl = useMemo(() => {
    if (!origin || !registryId) return '';
    return buildShowroomScanUrlWithRegistryId(origin, scanPath, registryId);
  }, [origin, scanPath, registryId]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next && typeof window !== 'undefined') setOrigin(window.location.origin);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    if (!scanUrl) return;
    try {
      await navigator.clipboard.writeText(scanUrl);
    } catch {
      /* ignore */
    }
  };

  const handleRetryRegister = () => {
    try {
      sessionStorage.removeItem(`${REGISTRY_CACHE_PREFIX}${sample.id}`);
    } catch {
      /* ignore */
    }
    setRegistryId(null);
    setRegError(false);
    if (open && origin) {
      registerShowroomSampleTag(payload)
        .then((id) => {
          try {
            sessionStorage.setItem(`${REGISTRY_CACHE_PREFIX}${sample.id}`, id);
          } catch {
            /* ignore */
          }
          setRegistryId(id);
        })
        .catch(() => setRegError(true));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 text-[10px] font-bold"
            disabled={disabled}
          >
            <QrCode className="h-3.5 w-3.5" />
            Бирка QR / штрихкод
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md print:border-0 print:shadow-none">
        <DialogHeader className="print:hidden">
          <DialogTitle className="text-base">Бирка для шоурума</DialogTitle>
          <DialogDescription className="text-left text-xs">
            На сервер регистрируется короткий id: QR и штрихкод содержат только его; название и ТЗ
            подтягиваются по <code className="text-[10px]">GET /api/showroom-sample/:id</code> при
            скане.
          </DialogDescription>
        </DialogHeader>

<<<<<<< HEAD
        <div className="showroom-tag-print space-y-4 rounded-lg border border-slate-200 bg-white p-4">
          <div className="space-y-1 text-center">
            <p className="text-sm font-bold text-slate-900">{payload.name}</p>
            <p className="text-[11px] text-slate-500">
=======
        <div className="showroom-tag-print border-border-default space-y-4 rounded-lg border bg-white p-4">
          <div className="space-y-1 text-center">
            <p className="text-text-primary text-sm font-bold">{payload.name}</p>
            <p className="text-text-secondary text-[11px]">
>>>>>>> recover/cabinet-wip-from-stash
              {payload.sku}
              {payload.sampleSize ? ` · ${payload.sampleSize}` : ''}
              {payload.color ? ` · ${payload.color}` : ''}
            </p>
<<<<<<< HEAD
            <p className="font-mono text-[10px] text-slate-400">Образец {payload.sampleId}</p>
            {payload.internalArticleCode ? (
              <p className="font-mono text-[10px] text-slate-500">
=======
            <p className="text-text-muted font-mono text-[10px]">Образец {payload.sampleId}</p>
            {payload.internalArticleCode ? (
              <p className="text-text-secondary font-mono text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                Внутр. артикул {payload.internalArticleCode}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col items-center gap-3">
            {regError ? (
              <p className="text-center text-xs text-rose-600 print:hidden">
                Не удалось зарегистрировать бирку на сервере.
              </p>
            ) : null}
            {scanUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrImageUrlForText(scanUrl, 200)}
                alt=""
                width={200}
                height={200}
                className="rounded-md"
              />
            ) : (
              <div
<<<<<<< HEAD
                className="h-[200px] w-[200px] animate-pulse rounded-md bg-slate-100"
=======
                className="bg-bg-surface2 h-[200px] w-[200px] animate-pulse rounded-md"
>>>>>>> recover/cabinet-wip-from-stash
                aria-hidden
              />
            )}
            {registryId ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={barcodeImageUrlCode128(registryId)}
                  alt=""
                  width={280}
                  height={100}
                  className="h-auto max-w-full"
                />
<<<<<<< HEAD
                <p className="break-all px-2 text-center font-mono text-[10px] text-slate-600">
=======
                <p className="text-text-secondary break-all px-2 text-center font-mono text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                  {registryId}
                </p>
              </>
            ) : !regError ? (
              <p className="text-text-secondary text-[10px] print:hidden">Регистрация id…</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 print:hidden">
          <Button type="button" variant="default" size="sm" className="gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Печать бирки
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleCopyLink}
            disabled={!scanUrl}
          >
            <Link2 className="h-4 w-4" />
            Копировать ссылку QR
          </Button>
          {regError ? (
            <Button type="button" variant="outline" size="sm" onClick={handleRetryRegister}>
              Повторить регистрацию
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
