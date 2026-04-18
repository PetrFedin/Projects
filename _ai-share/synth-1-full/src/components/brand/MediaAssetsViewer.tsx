'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Archive,
  Trash2,
  Upload,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Palette,
  Newspaper,
  Video,
  Users,
  Building2,
  Clock,
  X,
} from 'lucide-react';

export type AssetTypeId =
  | 'brand-identity'
  | 'lookbooks'
  | 'press-releases'
  | 'brand-video'
  | 'team-bios'
  | 'store-photos';

export type MediaAssetItem = {
  id: string;
  title: string;
  type: 'pdf' | 'image' | 'video' | 'doc';
  url?: string;
  archived: boolean;
  archivedAt?: string;
  expiresAt?: string;
  addedAt: string;
};

export type AssetType = {
  id: AssetTypeId;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: MediaAssetItem[];
};

const ASSET_TYPES: Omit<AssetType, 'items'>[] = [
  {
    id: 'brand-identity',
    title: 'Brand Identity',
    desc: 'Logos, Colors, Fonts',
    icon: Palette,
<<<<<<< HEAD
    color: 'bg-indigo-50 text-indigo-600',
=======
    color: 'bg-accent-primary/10 text-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
  },
  {
    id: 'lookbooks',
    title: 'Lookbooks',
    desc: 'SS26 & FW25 Collections',
    icon: ImageIcon,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 'press-releases',
    title: 'Press Releases',
    desc: 'Latest Brand News',
    icon: Newspaper,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    id: 'brand-video',
    title: 'Brand Video',
    desc: 'Manifesto & Shows',
    icon: Video,
    color: 'bg-rose-50 text-rose-600',
  },
  {
    id: 'team-bios',
    title: 'Team Bios',
    desc: 'Leadership Profiles',
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'store-photos',
    title: 'Store Photos',
    desc: 'Retail Environment',
    icon: Building2,
<<<<<<< HEAD
    color: 'bg-purple-50 text-purple-600',
=======
    color: 'bg-accent-primary/10 text-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
  },
];

interface MediaAssetsViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetTypeId: AssetTypeId | null;
  items: MediaAssetItem[];
  onItemsChange: (typeId: AssetTypeId, items: MediaAssetItem[]) => void;
  autoArchiveDays: number;
  onAutoArchiveDaysChange: (days: number) => void;
}

export function MediaAssetsViewer({
  open,
  onOpenChange,
  assetTypeId,
  items,
  onItemsChange,
  autoArchiveDays,
  onAutoArchiveDaysChange,
}: MediaAssetsViewerProps) {
  const [showArchive, setShowArchive] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showTimerSettings, setShowTimerSettings] = useState(false);

  const meta = ASSET_TYPES.find((t) => t.id === assetTypeId);
  if (!meta || !assetTypeId) return null;

  const activeItems = items.filter((i) => !i.archived);
  const archivedItems = items.filter((i) => i.archived);
  const displayItems = showArchive ? archivedItems : activeItems;
  const selected = items.find((i) => i.id === selectedId);

  const handleArchive = (id: string) => {
    onItemsChange(
      assetTypeId,
      items.map((i) =>
        i.id === id
          ? { ...i, archived: true, archivedAt: new Date().toISOString().slice(0, 10) }
          : i
      )
    );
    setSelectedId(null);
  };

  const handleRestore = (id: string) => {
    onItemsChange(
      assetTypeId,
      items.map((i) => (i.id === id ? { ...i, archived: false, archivedAt: undefined } : i))
    );
    setSelectedId(null);
  };

  const handleDelete = (id: string) => {
    onItemsChange(
      assetTypeId,
      items.filter((i) => i.id !== id)
    );
    setSelectedId(null);
  };

  const handleUpload = () => {
    const newItem: MediaAssetItem = {
      id: `new-${Date.now()}`,
      title: 'Новый файл',
      type: 'pdf',
      archived: false,
      addedAt: new Date().toISOString().slice(0, 10),
    };
    onItemsChange(assetTypeId, [...items, newItem]);
    setSelectedId(newItem.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
<<<<<<< HEAD
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden rounded-xl border-slate-200 sm:max-w-4xl">
=======
      <DialogContent className="border-border-default flex max-h-[90vh] flex-col overflow-hidden rounded-xl sm:max-w-4xl">
>>>>>>> recover/cabinet-wip-from-stash
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <div
              className={cn('flex h-10 w-10 items-center justify-center rounded-lg', meta.color)}
            >
              <meta.icon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-black uppercase tracking-tight">{meta.title}</span>
<<<<<<< HEAD
              <p className="mt-0.5 text-[11px] font-medium text-slate-500">{meta.desc}</p>
=======
              <p className="text-text-secondary mt-0.5 text-[11px] font-medium">{meta.desc}</p>
>>>>>>> recover/cabinet-wip-from-stash
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
          {/* Список слева */}
<<<<<<< HEAD
          <div className="flex w-64 flex-shrink-0 flex-col gap-2 border-r border-slate-100 pr-4">
=======
          <div className="border-border-subtle flex w-64 flex-shrink-0 flex-col gap-2 border-r pr-4">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="flex gap-1">
              <Button
                variant={!showArchive ? 'default' : 'ghost'}
                size="sm"
                className="h-7 flex-1 text-[9px] font-bold"
                onClick={() => setShowArchive(false)}
              >
                Активные ({activeItems.length})
              </Button>
              <Button
                variant={showArchive ? 'default' : 'ghost'}
                size="sm"
                className="h-7 flex-1 text-[9px] font-bold"
                onClick={() => setShowArchive(true)}
              >
                Архив ({archivedItems.length})
              </Button>
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto">
              {displayItems.length === 0 ? (
<<<<<<< HEAD
                <p className="py-4 text-center text-[11px] text-slate-400">
=======
                <p className="text-text-muted py-4 text-center text-[11px]">
>>>>>>> recover/cabinet-wip-from-stash
                  {showArchive ? 'Архив пуст' : 'Нет файлов'}
                </p>
              ) : (
                displayItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg p-2 text-left text-[11px] font-medium transition-colors',
                      selectedId === item.id
<<<<<<< HEAD
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-700 hover:bg-slate-50'
=======
                        ? 'bg-accent-primary/10 text-accent-primary'
                        : 'hover:bg-bg-surface2 text-text-primary'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                    <span className="truncate">{item.title}</span>
                  </button>
                ))
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-full gap-1.5 text-[9px] font-bold"
              onClick={handleUpload}
            >
              <Upload className="h-3.5 w-3.5" /> Загрузить
            </Button>
          </div>

          {/* Превью справа */}
          <div className="flex min-w-0 flex-1 flex-col">
            {selected ? (
              <>
<<<<<<< HEAD
                <div className="min-h-[200px] flex-1 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-full items-center justify-center text-slate-400">
=======
                <div className="border-border-default bg-bg-surface2 min-h-[200px] flex-1 overflow-auto rounded-xl border p-4">
                  <div className="text-text-muted flex h-full items-center justify-center">
>>>>>>> recover/cabinet-wip-from-stash
                    <div className="text-center">
                      <FileText className="mx-auto mb-2 h-16 w-16 opacity-50" />
                      <p className="text-sm font-medium">{selected.title}</p>
                      <p className="mt-1 text-[11px]">Превью • {selected.type.toUpperCase()}</p>
<<<<<<< HEAD
                      <p className="mt-1 text-[10px] text-slate-400">
=======
                      <p className="text-text-muted mt-1 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                        Добавлено: {selected.addedAt}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {!showArchive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 text-[9px] font-bold"
                      onClick={() => handleArchive(selected.id)}
                    >
                      <Archive className="h-3 w-3" /> Убрать в архив
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 text-[9px] font-bold"
                      onClick={() => handleRestore(selected.id)}
                    >
                      Восстановить
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 border-rose-200 text-[9px] font-bold text-rose-600 hover:bg-rose-50"
                    onClick={() => handleDelete(selected.id)}
                  >
                    <Trash2 className="h-3 w-3" /> Удалить
                  </Button>
                </div>
              </>
            ) : (
<<<<<<< HEAD
              <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
=======
              <div className="border-border-default bg-bg-surface2/80 text-text-muted flex flex-1 items-center justify-center rounded-xl border border-dashed">
>>>>>>> recover/cabinet-wip-from-stash
                <p className="text-[11px]">Выберите файл из списка</p>
              </div>
            )}
          </div>
        </div>

        {/* Таймер автоархива */}
<<<<<<< HEAD
        <div className="flex-shrink-0 border-t border-slate-100 pt-4">
=======
        <div className="border-border-subtle flex-shrink-0 border-t pt-4">
>>>>>>> recover/cabinet-wip-from-stash
          <button
            type="button"
            onClick={() => setShowTimerSettings(!showTimerSettings)}
            className="text-text-secondary hover:text-text-primary flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
          >
            <Clock className="h-3.5 w-3.5" /> Настройка автоархива
            {showTimerSettings ? <X className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
          {showTimerSettings && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-text-secondary text-[11px]">Перемещать в архив через</span>
              <Input
                type="number"
                min={1}
                max={365}
                value={autoArchiveDays}
                onChange={(e) =>
                  onAutoArchiveDaysChange(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="h-8 w-20 text-sm"
              />
              <span className="text-text-secondary text-[11px]">дней</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
