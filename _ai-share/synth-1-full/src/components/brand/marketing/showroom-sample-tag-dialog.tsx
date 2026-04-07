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
          <Button type="button" variant="outline" size="sm" className="gap-1.5 text-[10px] font-bold" disabled={disabled}>
            <QrCode className="h-3.5 w-3.5" />
            Бирка QR / штрихкод
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md print:shadow-none print:border-0">
        <DialogHeader className="print:hidden">
          <DialogTitle className="text-base">Бирка для шоурума</DialogTitle>
          <DialogDescription className="text-xs text-left">
            На сервер регистрируется короткий id: QR и штрихкод содержат только его; название и ТЗ подтягиваются по{' '}
            <code className="text-[10px]">GET /api/showroom-sample/:id</code> при скане.
          </DialogDescription>
        </DialogHeader>

        <div className="showroom-tag-print space-y-4 border border-slate-200 rounded-lg p-4 bg-white">
          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-slate-900">{payload.name}</p>
            <p className="text-[11px] text-slate-500">
              {payload.sku}
              {payload.sampleSize ? ` · ${payload.sampleSize}` : ''}
              {payload.color ? ` · ${payload.color}` : ''}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">Образец {payload.sampleId}</p>
            {payload.internalArticleCode ? (
              <p className="text-[10px] text-slate-500 font-mono">Внутр. артикул {payload.internalArticleCode}</p>
            ) : null}
          </div>

          <div className="flex flex-col items-center gap-3">
            {regError ? (
              <p className="text-xs text-rose-600 text-center print:hidden">
                Не удалось зарегистрировать бирку на сервере.
              </p>
            ) : null}
            {scanUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrImageUrlForText(scanUrl, 200)} alt="" width={200} height={200} className="rounded-md" />
            ) : (
              <div className="h-[200px] w-[200px] bg-slate-100 animate-pulse rounded-md" aria-hidden />
            )}
            {registryId ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={barcodeImageUrlCode128(registryId)}
                  alt=""
                  width={280}
                  height={100}
                  className="max-w-full h-auto"
                />
                <p className="text-[10px] font-mono text-slate-600 break-all text-center px-2">{registryId}</p>
              </>
            ) : !regError ? (
              <p className="text-[10px] text-slate-500 print:hidden">Регистрация id…</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 print:hidden">
          <Button type="button" variant="default" size="sm" className="gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Печать бирки
          </Button>
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={handleCopyLink} disabled={!scanUrl}>
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
