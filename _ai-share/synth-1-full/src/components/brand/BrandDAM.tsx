'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Share2,
  MoreHorizontal,
  FileText,
  Image as ImageIcon,
  Video,
  Folder,
  ChevronRight,
  Grid,
  List,
  CheckCircle2,
  AlertCircle,
  Archive,
  Star,
  Clock,
  Megaphone,
  Database,
  History,
  User,
  RotateCcw,
  ShieldCheck,
  EyeOff,
  Shield,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { fastApiService } from '@/lib/fastapi-service';
import { useEffect } from 'react';

// Mock data for digital assets
const MOCK_ASSETS = [
  {
    id: '1',
    name: 'Campaign_Spring_26_Master.mp4',
    type: 'video',
    size: '124 MB',
    date: '2024-02-15',
    access: 'Global',
    version: 'v1.2',
    tags: ['Campaign', 'SS26', 'Main'],
  },
  {
    id: '2',
    name: 'Lookbook_Technical_Specs.pdf',
    type: 'doc',
    size: '4.2 MB',
    date: '2024-02-12',
    access: 'Internal',
    version: 'v3.0',
    tags: ['Technical', 'Production'],
  },
  {
    id: '3',
    name: 'Brand_Logo_Pack_2026.zip',
    type: 'archive',
    size: '85 MB',
    date: '2024-02-10',
    access: 'Public',
    version: 'v1.0',
    tags: ['Identity', 'Graphics'],
  },
  {
    id: '4',
    name: 'Price_List_Global_SS26.xls',
    type: 'doc',
    size: '1.1 MB',
    date: '2024-02-01',
    access: 'Internal',
    version: 'v2.0',
    tags: ['Finance', 'Confidential'],
  },
];

export function BrandDAM() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>(MOCK_ASSETS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const response = await fastApiService.getMediaAssets();
        if (response.data && Array.isArray(response.data)) {
          setAssets(response.data);
        }
      } catch (err) {
        console.warn('Failed to fetch real media assets, using mock data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'doc':
        return <FileText className="h-5 w-5" />;
      case 'archive':
        return <Archive className="h-5 w-5" />;
      default:
        return <ImageIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Поиск по активам..."
            className="h-10 rounded-xl border-slate-100 bg-white pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-slate-100 bg-white p-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8 rounded-lg', viewMode === 'grid' && 'bg-slate-100')}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8 rounded-lg', viewMode === 'list' && 'bg-slate-100')}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button className="h-10 gap-2 rounded-xl bg-slate-900 text-white">
            <Plus className="h-4 w-4" /> Загрузить
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'grid gap-3',
          viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
        )}
      >
        {assets.map((asset) => (
          <Sheet key={asset.id}>
            <SheetTrigger asChild>
              <Card
                className={cn(
                  'group cursor-pointer overflow-hidden border-slate-100 transition-all hover:shadow-lg',
                  viewMode === 'list' && 'flex items-center gap-3 p-4'
                )}
                onClick={() => setSelectedAsset(asset)}
              >
                <div
                  className={cn(
                    'flex items-center justify-center bg-slate-50 transition-colors group-hover:bg-slate-100',
                    viewMode === 'grid' ? 'aspect-video' : 'h-12 w-12 shrink-0 rounded-xl'
                  )}
                >
                  {getIcon(asset.type)}
                </div>
                <div
                  className={cn(
                    'p-4',
                    viewMode === 'list' && 'flex flex-1 items-center justify-between p-0'
                  )}
                >
                  <div>
                    <h4 className="mb-1 truncate text-[11px] font-black uppercase text-slate-900">
                      {asset.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-medium text-slate-400">{asset.size}</span>
                      <div className="h-1 w-1 rounded-full bg-slate-200" />
                      <span className="text-[9px] font-medium text-slate-400">{asset.date}</span>
                    </div>
                  </div>
                  {viewMode === 'list' && (
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="text-[7px] font-black uppercase tracking-widest"
                      >
                        {asset.access}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </SheetTrigger>
            <SheetContent className="w-full overflow-y-auto border-none bg-slate-50 p-0 sm:max-w-[440px]">
              <div className="bg-slate-900 p-4 text-white">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-600 p-2">{getIcon(asset.type)}</div>
                  <Badge
                    variant="outline"
                    className="h-5 border-white/20 px-2 text-[8px] font-black uppercase tracking-widest text-white/60"
                  >
                    Asset Details
                  </Badge>
                </div>
                <SheetTitle className="text-base font-black uppercase tracking-tight text-white">
                  {asset.name}
                </SheetTitle>
                <SheetDescription className="mt-2 text-xs font-medium text-slate-400">
                  Управление цифровым активом и правами доступа.
                </SheetDescription>
              </div>

              <div className="space-y-6 p-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button className="h-11 gap-2 rounded-xl bg-indigo-600 text-[9px] font-black uppercase tracking-widest text-white hover:bg-indigo-700">
                    <Download className="h-4 w-4" /> Скачать
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 gap-2 rounded-xl border-slate-100 bg-white text-[9px] font-black uppercase tracking-widest"
                  >
                    <Share2 className="h-4 w-4" /> Поделиться
                  </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                  <div className="border-b border-slate-50 p-4">
                    <h5 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Свойства
                    </h5>
                    <div className="space-y-4">
                      {[
                        { label: 'Размер', value: asset.size, icon: Database },
                        { label: 'Версия', value: asset.version, icon: History },
                        { label: 'Доступ', value: asset.access, icon: Shield },
                        { label: 'Загрузил', value: 'Alex R.', icon: User },
                      ].map((prop, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-[10px] font-bold"
                        >
                          <div className="flex items-center gap-2 text-slate-400">
                            <prop.icon className="h-3.5 w-3.5" />
                            <span>{prop.label}</span>
                          </div>
                          <span className="text-slate-900">{prop.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    <h5 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Теги
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {asset.tags.map((tag: string, i: number) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="border-none bg-slate-50 px-2.5 py-1 text-[8px] font-bold uppercase text-slate-600"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl bg-slate-900 p-4 text-white">
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <h5 className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
                        Безопасность
                      </h5>
                    </div>
                    <p className="text-[10px] font-medium italic leading-relaxed opacity-80">
                      Данный файл защищен водяным знаком Syntha. При внешней передаче будет создан
                      временный токен доступа.
                    </p>
                    <Button
                      variant="ghost"
                      className="w-full gap-2 text-[8px] font-black uppercase text-white/60 transition-colors hover:text-white"
                    >
                      <EyeOff className="h-3 w-3" /> Просмотр логов доступа
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  );
}
