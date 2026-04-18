'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Store, Link2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export interface PendingBrandLink {
  brandId: string;
  brandName: string;
  brandLogo?: string;
  storeEntryId: string;
  storeNameInBrand: string;
  storeProductUrl?: string;
  matchType: 'direct' | 'possible';
}

interface BrandSyncConfirmationProps {
  /** ID текущего магазина (из профиля/контекста) */
  currentShopId: string;
  /** Название магазина для fuzzy-поиска */
  currentShopName: string;
  /** Прямые совпадения: бренды добавили нас по platformShopId */
  directMatches: PendingBrandLink[];
  /** Возможные: бренды с похожими названиями магазинов в списке */
  possibleMatches: PendingBrandLink[];
  onConfirm?: (link: PendingBrandLink) => void;
  onReject?: (link: PendingBrandLink) => void;
  onClaim?: (link: PendingBrandLink) => void;
}

export function BrandSyncConfirmation({
  currentShopId,
  currentShopName,
  directMatches,
  possibleMatches,
  onConfirm,
  onReject,
  onClaim,
}: BrandSyncConfirmationProps) {
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());
  const [claimed, setClaimed] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleConfirm = (link: PendingBrandLink) => {
    setConfirmed((prev) => new Set(prev).add(link.storeEntryId));
    onConfirm?.(link);
    toast({
      title: 'Подтверждено',
      description: `Синхронизация с брендом «${link.brandName}» активна.`,
    });
  };

  const handleReject = (link: PendingBrandLink) => {
    setRejected((prev) => new Set(prev).add(link.storeEntryId));
    onReject?.(link);
    toast({
      title: 'Отклонено',
      description: 'Связь с брендом отклонена.',
      variant: 'destructive',
    });
  };

  const handleClaim = (link: PendingBrandLink) => {
    setClaimed((prev) => new Set(prev).add(link.storeEntryId));
    onClaim?.(link);
    toast({
      title: 'Связь установлена',
      description: `Вы подтвердили: «${link.storeNameInBrand}» — это ваш магазин. Бренд «${link.brandName}» получит уведомление.`,
    });
  };

  const hasDirect =
    directMatches.length > 0 &&
    directMatches.some((l) => !confirmed.has(l.storeEntryId) && !rejected.has(l.storeEntryId));
  const hasPossible =
    possibleMatches.length > 0 && possibleMatches.some((l) => !claimed.has(l.storeEntryId));

  if (!hasDirect && !hasPossible) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Синхронизация с брендами
        </CardTitle>
        <CardDescription>
          Бренды добавили ваш магазин в свой профиль. Подтвердите связь или найдите себя в списках
          под другим названием.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Прямые совпадения */}
        {directMatches.length > 0 && (
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <Check className="h-4 w-4 text-emerald-600" />
              Прямые совпадения
            </h4>
            <p className="text-text-secondary text-xs">
              Бренды выбрали вас из участников платформы. Подтвердите, что это ваш магазин.
            </p>
            <div className="space-y-2">
              {directMatches.map((link) => {
                const isConfirmed = confirmed.has(link.storeEntryId);
                const isRejected = rejected.has(link.storeEntryId);
                if (isConfirmed || isRejected) return null;
                return (
                  <div
                    key={link.storeEntryId}
<<<<<<< HEAD
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3"
=======
                    className="border-border-subtle bg-bg-surface2/80 flex items-center justify-between rounded-lg border p-3"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border bg-white">
                        {link.brandLogo ? (
                          <Image
                            src={link.brandLogo}
                            alt=""
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <Store className="text-text-muted h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{link.brandName}</p>
<<<<<<< HEAD
                        <p className="text-xs text-slate-500">Добавил: «{link.storeNameInBrand}»</p>
=======
                        <p className="text-text-secondary text-xs">
                          Добавил: «{link.storeNameInBrand}»
                        </p>
>>>>>>> recover/cabinet-wip-from-stash
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="h-8 text-xs" onClick={() => handleConfirm(link)}>
                        <Check className="mr-1 h-3.5 w-3.5" /> Подтвердить
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                        onClick={() => handleReject(link)}
                      >
                        <X className="mr-1 h-3.5 w-3.5" /> Отклонить
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Возможные совпадения */}
        {possibleMatches.length > 0 && (
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              Возможные совпадения
            </h4>
<<<<<<< HEAD
            <p className="text-xs text-slate-500">
=======
            <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
              В профилях брендов найдены магазины с похожим названием. Если это вы — нажмите «Это
              мы».
            </p>
            <div className="space-y-2">
              {possibleMatches.map((link) => {
                const isClaimed = claimed.has(link.storeEntryId);
                if (isClaimed) return null;
                return (
                  <div
                    key={link.storeEntryId}
                    className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border bg-white">
                        {link.brandLogo ? (
                          <Image
                            src={link.brandLogo}
                            alt=""
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <Store className="text-text-muted h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{link.brandName}</p>
<<<<<<< HEAD
                        <p className="text-xs text-slate-500">
=======
                        <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                          В списке: «{link.storeNameInBrand}»
                          {link.storeProductUrl && (
                            <a
                              href={link.storeProductUrl}
                              target="_blank"
                              rel="noopener noreferrer"
<<<<<<< HEAD
                              className="ml-1 text-indigo-600 hover:underline"
=======
                              className="text-accent-primary ml-1 hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              ссылка
                            </a>
                          )}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-amber-200 text-xs text-amber-700 hover:bg-amber-50"
                      onClick={() => handleClaim(link)}
                    >
                      <Link2 className="mr-1 h-3.5 w-3.5" /> Это мы
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
