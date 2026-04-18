'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NftTryOnDialog from '@/components/nft-try-on-dialog';

type NftItem = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint?: string;
};

export function MetaverseNftGrid({ items }: { items: NftItem[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<NftItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.description}
                fill
                className="object-cover"
                data-ai-hint={item.imageHint}
              />
            </div>
            <div className="space-y-2 p-3">
              <h3 className="line-clamp-2 text-left text-sm font-semibold leading-snug">
                {item.description}
              </h3>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2 text-xs">
                <span className="font-mono text-amber-300">— ₽</span>
                <Badge variant="outline" className="border-amber-500/40 text-amber-200">
                  Лимит
                </Badge>
                <span className="text-gray-400">Дроп</span>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-7 shrink-0 px-2 text-xs"
                  onClick={() => {
                    setActive(item);
                    setOpen(true);
                  }}
                >
                  Примерить
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {active ? (
        <NftTryOnDialog
          nft={{
            id: active.id,
            name: active.description,
            description: active.description,
            imageUrl: active.imageUrl,
            imageHint: active.imageHint ?? '',
          }}
          isOpen={open}
          onOpenChange={setOpen}
        />
      ) : null}
    </>
  );
}
