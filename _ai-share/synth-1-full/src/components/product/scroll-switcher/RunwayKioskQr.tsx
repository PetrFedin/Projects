'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { buildRunwayShareLink } from '@/lib/runway/runway-share-link-builder';
import { t } from '@/lib/runway/runway-i18n';

export interface RunwayKioskQrProps {
  productSlug: string;
  activeSection: number;
  className?: string;
}

/**
 * QR на текущий runway URL — только kiosk (угол экрана, без перекрытия сцены).
 */
export function RunwayKioskQr({ productSlug, activeSection, className }: RunwayKioskQrProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = buildRunwayShareLink({
      productSlug,
      sectionIndex: activeSection,
      utm: { source: 'kiosk', medium: 'qr', campaign: 'retail-kiosk' },
    });

    import('qrcode')
      .then((QRCode) =>
        QRCode.toDataURL(url, {
          width: 96,
          margin: 1,
          color: { dark: '#0a0a0a', light: '#ffffff' },
        })
      )
      .then((png) => {
        if (!cancelled) setDataUrl(png);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [productSlug, activeSection]);

  if (!dataUrl) return null;

  return (
    <div
      className={cn(
        'pointer-events-none absolute bottom-4 right-4 z-[105] flex flex-col items-center gap-1 rounded-lg border border-border/60 bg-background/95 p-2 shadow-sm backdrop-blur-sm',
        className
      )}
      data-runway-kiosk-qr
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt="" width={96} height={96} className="rounded-sm" />
      <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
        {t('runway.kioskQr')}
      </span>
    </div>
  );
}
