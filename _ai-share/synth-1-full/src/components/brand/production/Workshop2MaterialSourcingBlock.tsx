'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ROUTES } from '@/lib/routes';
import type { Workshop2MaterialSourcingDraft } from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';

const KNOWN_SUPPLIER_PRESETS: {
  slug: string;
  label: string;
  fabricDescription: string;
  priceNote: string;
}[] = [
  {
    slug: 'partner-textile-east',
    label: 'Textile East (Китай)',
    fabricDescription: 'Хлопок сатин 120 г/м², ширина 150 см, арт. TE-SAT-120-W',
    priceNote: 'Ориентир 4,2 USD/м при MOQ 500 м',
  },
  {
    slug: 'partner-milano-trims',
    label: 'Milano Trims (Италия)',
    fabricDescription: 'Подкладка вискоза, чёрный, ширина 140 см',
    priceNote: '2,8 EUR/м от 300 м',
  },
  {
    slug: 'partner-eco-tex',
    label: 'EcoTex Fabric (Турция)',
    fabricDescription: 'Кулирная гладь пенье 95% хлопок 5% эластан, 180 г/м²',
    priceNote: 'Ориентир 5,5 USD/кг при MOQ 100 кг',
  },
  {
    slug: 'partner-prime-leather',
    label: 'Prime Leather (Россия)',
    fabricDescription: 'Натуральная кожа КРС, лицевая, толщина 1.2-1.4 мм',
    priceNote: '28 руб/дм² от 500 дм²',
  }
];

const MAX_PHOTOS = 3;
const MAX_FILE_BYTES = 900_000;

type Props = {
  draft: Workshop2MaterialSourcingDraft | undefined;
  disabled?: boolean;
  onChange: (next: Workshop2MaterialSourcingDraft | undefined) => void;
};

export function Workshop2MaterialSourcingBlock({ draft, disabled, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const d = draft ?? {};

  const patch = useCallback(
    (partial: Partial<Workshop2MaterialSourcingDraft>) => {
      const next: Workshop2MaterialSourcingDraft = { ...d, ...partial };
      const empty =
        !next.supplierDisplayName?.trim() &&
        !next.supplierPartnerSlug?.trim() &&
        !next.fabricDescription?.trim() &&
        !next.priceNote?.trim() &&
        !next.catalogPickNote?.trim() &&
        !(next.photoDataUrls && next.photoDataUrls.length > 0);
      onChange(empty ? undefined : next);
    },
    [d, onChange]
  );

  const onFiles = async (files: FileList | null) => {
    if (!files?.length || disabled) return;
    const urls = [...(d.photoDataUrls ?? [])];
    for (const file of Array.from(files)) {
      if (urls.length >= MAX_PHOTOS) break;
      if (!file.type.startsWith('image/')) continue;
      if (file.size > MAX_FILE_BYTES) continue;
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result ?? ''));
        r.onerror = () => reject(new Error('read'));
        r.readAsDataURL(file);
      });
      if (dataUrl.startsWith('data:image')) urls.push(dataUrl);
    }
    patch({ photoDataUrls: urls.length ? urls : undefined });
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div
      id="w2-material-sourcing"
      className="border-border-default scroll-mt-24 space-y-4 rounded-xl border bg-white p-4 shadow-sm"
    >
      <div className="flex flex-wrap items-start gap-3">
        <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <LucideIcons.Layers className="h-4 w-4 shrink-0" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-text-primary text-base font-semibold">Материал: снабжение и справочник</h2>
          <p className="text-text-secondary text-[11px] leading-snug">
            Фиксация основного материала: поставщик, артикул, цена и фото образца для закупки.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" className="h-8 text-[10px]" asChild>
          <Link href={ROUTES.shop.b2bPartners} target="_blank" rel="noreferrer">
            Каталог партнёров B2B
          </Link>
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={disabled}
          onChange={(e) => void onFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 text-[10px]"
          disabled={disabled || (d.photoDataUrls?.length ?? 0) >= MAX_PHOTOS}
          onClick={() => fileRef.current?.click()}
        >
          Добавить фото материала
        </Button>
        <span className="text-text-muted text-[10px]">
          до {MAX_PHOTOS} фото, до ~{(MAX_FILE_BYTES / 1024).toFixed(0)} KB каждое
        </span>
      </div>

      {d.photoDataUrls && d.photoDataUrls.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {d.photoDataUrls.map((src, i) => (
            <li
              key={`${i}-${src.slice(0, 32)}`}
              className="border-border-default relative h-24 w-24 overflow-hidden rounded-md border bg-bg-surface2"
            >
              <Image src={src} alt="" fill className="object-cover" unoptimized />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="bg-background/85 text-text-primary absolute right-0 top-0 h-7 rounded-none px-1.5 text-[10px]"
                disabled={disabled}
                onClick={() => {
                  const next = (d.photoDataUrls ?? []).filter((_, j) => j !== i);
                  patch({ photoDataUrls: next.length ? next : undefined });
                }}
              >
                ×
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-text-secondary text-[11px] font-medium">
            Поставщик (название)
          </label>
          <Input
            className="h-9 text-sm"
            disabled={disabled}
            placeholder="Например: Mill Co. / локальный рынок"
            value={d.supplierDisplayName ?? ''}
            onChange={(e) => patch({ supplierDisplayName: e.target.value || undefined })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-text-secondary text-[11px] font-medium">
            Slug партнёра (из каталога)
          </label>
          <Input
            className="h-9 text-sm"
            disabled={disabled}
            placeholder="Как в URL карточки партнёра"
            value={d.supplierPartnerSlug ?? ''}
            onChange={(e) => patch({ supplierPartnerSlug: e.target.value || undefined })}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-text-secondary text-[11px] font-medium">
          Выбрать материал из каталога партнёров
        </label>
        <select
          className="border-border-default h-9 w-full max-w-md rounded-md border bg-white px-2 text-sm"
          disabled={disabled}
          value=""
          onChange={(e) => {
            const slug = e.target.value;
            e.target.value = '';
            if (!slug) return;
            const preset = KNOWN_SUPPLIER_PRESETS.find((p) => p.slug === slug);
            if (!preset) return;
            patch({
              supplierPartnerSlug: preset.slug,
              supplierDisplayName: preset.label,
              fabricDescription: preset.fabricDescription,
              priceNote: preset.priceNote,
              catalogPickNote: 'Выбрано из каталога интегрированных поставщиков',
            });
          }}
        >
          <option value="">Выберите пресет…</option>
          {KNOWN_SUPPLIER_PRESETS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-text-secondary text-[11px] font-medium">
          Ткань / артикул / тех. данные
        </label>
        <Textarea
          className={cn('min-h-[72px] text-sm')}
          disabled={disabled}
          placeholder="Состав, плотность, ширина, цвет, заказной артикул…"
          value={d.fabricDescription ?? ''}
          onChange={(e) => patch({ fabricDescription: e.target.value || undefined })}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-text-secondary text-[11px] font-medium">
            Цена / условия
          </label>
          <Input
            className="h-9 text-sm"
            disabled={disabled}
            placeholder="Ориентир, валюта, MOQ"
            value={d.priceNote ?? ''}
            onChange={(e) => patch({ priceNote: e.target.value || undefined })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-text-secondary text-[11px] font-medium">
            Дата актуальности цены
          </label>
          <Input
            className="h-9 w-full text-sm"
            type="date"
            disabled={disabled}
            value={d.priceDate ?? ''}
            onChange={(e) => patch({ priceDate: e.target.value || undefined })}
          />
        </div>
      </div>

      <div className="space-y-1 mt-3">
        <label className="text-text-secondary text-[11px] font-medium flex justify-between items-center">
          Прикрепить прайс-лист или каталог партнёра
        </label>
        <div className="flex gap-2 items-center">
          <Input
            className="h-9 flex-1 text-sm text-text-muted"
            type="file"
            disabled={disabled}
            onChange={(e) => {
               // Placeholder for file attach functionality
               console.log(e.target.files)
            }}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-text-secondary text-[11px] font-medium">
          Заметка по выбору из каталога
        </label>
        <Input
          className="h-9 text-sm"
          disabled={disabled}
          placeholder="Ревизия прайса, ссылка на лист…"
          value={d.catalogPickNote ?? ''}
          onChange={(e) => patch({ catalogPickNote: e.target.value || undefined })}
        />
      </div>
    </div>
  );
}
