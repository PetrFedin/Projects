'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Download,
  PlusCircle,
  Trash2,
  FolderArchive,
  Search,
  ExternalLink,
  History,
  Lock,
  Eye,
  Paperclip,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

interface ArchiveFile {
  id: string;
  name: string;
  type: 'tz' | 'pattern' | 'photo' | 'doc' | 'cert';
  size: string;
  date: string;
  user: string;
  version: string;
  url: string;
}

interface ProductionArchiveHubProps {
  sku: {
    id: string;
    name: string;
    sku: string;
    factory: string;
    brand: string;
  };
  userRole: 'admin' | 'brand' | 'manufacturer';
}

export function ProductionArchiveHub({ sku, userRole }: ProductionArchiveHubProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const mockFiles: ArchiveFile[] = [
    {
      id: '1',
      name: 'tech_pack_final_v3.pdf',
      type: 'tz',
      size: '2.4 MB',
      date: '2024-07-20',
      user: 'Марина (Бренд)',
      version: '3.0',
      url: '#',
    },
    {
      id: '2',
      name: 'pattern_size_run_m_l.ai',
      type: 'pattern',
      size: '15.8 MB',
      date: '2024-07-22',
      user: 'Алексей (Конструктор)',
      version: '1.2',
      url: '#',
    },
    {
      id: '3',
      name: 'sample_photo_front.jpg',
      type: 'photo',
      size: '4.1 MB',
      date: '2024-07-25',
      user: 'Игорь (Фабрика)',
      version: '1.0',
      url: '#',
    },
    {
      id: '4',
      name: 'material_cert_wool.pdf',
      type: 'cert',
      size: '1.1 MB',
      date: '2024-07-15',
      user: 'Снабжение',
      version: '1.0',
      url: '#',
    },
    {
      id: '5',
      name: 'production_contract_signed.pdf',
      type: 'doc',
      size: '0.8 MB',
      date: '2024-07-10',
      user: 'Юрист',
      version: '1.0',
      url: '#',
    },
  ];

  const filteredFiles = mockFiles.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (type: ArchiveFile['type']) => {
    switch (type) {
      case 'tz':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'pattern':
        return <FolderArchive className="h-4 w-4 text-orange-500" />;
      case 'photo':
        return <ImageIcon className="h-4 w-4 text-emerald-500" />;
      case 'cert':
        return <ShieldCheck className="text-accent-primary h-4 w-4" />;
      default:
        return <FileText className="text-text-secondary h-4 w-4" />;
    }
  };

  const getLabel = (type: ArchiveFile['type']) => {
    switch (type) {
      case 'tz':
        return 'Тех. задание';
      case 'pattern':
        return 'Лекала';
      case 'photo':
        return 'Фото/Видео';
      case 'cert':
        return 'Сертификаты';
      case 'doc':
        return 'Документы';
    }
  };

  return (
    <div className="space-y-6 duration-500 animate-in fade-in">
      {/* Header Info */}
      <div className="bg-bg-surface2 border-border-subtle flex flex-col items-start justify-between gap-3 rounded-xl border p-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-accent-primary border-none text-[9px] font-black uppercase text-white">
              Production Archive
            </Badge>
            <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
              {sku.sku}
            </span>
          </div>
          <h2 className="text-sm font-black uppercase tracking-tighter">{sku.name}</h2>
          <p className="text-text-secondary text-xs font-medium">
            Производство: <span className="text-text-primary font-bold">{sku.factory}</span> •
            Бренд: <span className="text-text-primary font-bold">{sku.brand}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border-default h-10 rounded-xl bg-white text-[10px] font-bold uppercase"
          >
            <History className="mr-2 h-3.5 w-3.5" /> История версий
          </Button>
          <Button
            size="sm"
            className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/10 h-10 rounded-xl text-[10px] font-black uppercase text-white shadow-lg"
          >
            <PlusCircle className="mr-2 h-3.5 w-3.5" /> Загрузить файлы
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="mb-6 flex flex-col items-center justify-between gap-3 md:flex-row">
          {/* cabinetSurface v1 */}
          <TabsList className={cn(cabinetSurface.tabsList, 'flex-wrap')}>
            <TabsTrigger value="all" className={cn(cabinetSurface.tabsTrigger, 'h-8')}>
              Все файлы
            </TabsTrigger>
            <TabsTrigger
              value="tz"
              className={cn(
                cabinetSurface.tabsTrigger,
                'h-8 text-blue-600 data-[state=active]:text-blue-800'
              )}
            >
              ТЗ
            </TabsTrigger>
            <TabsTrigger
              value="pattern"
              className={cn(
                cabinetSurface.tabsTrigger,
                'h-8 text-orange-600 data-[state=active]:text-orange-800'
              )}
            >
              Лекала
            </TabsTrigger>
            <TabsTrigger
              value="photo"
              className={cn(
                cabinetSurface.tabsTrigger,
                'h-8 text-emerald-600 data-[state=active]:text-emerald-800'
              )}
            >
              Медиа
            </TabsTrigger>
            <TabsTrigger
              value="cert"
              className={cn(
                cabinetSurface.tabsTrigger,
                'text-accent-primary data-[state=active]:text-accent-primary h-8'
              )}
            >
              Сертификаты
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full md:w-64">
            <Search className="text-text-muted absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
            <Input
              placeholder="Поиск в архиве..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border-default h-10 rounded-xl pl-9 text-xs font-medium"
            />
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredFiles.map((file) => (
              <Card
                key={file.id}
                className="border-border-subtle group overflow-hidden rounded-3xl shadow-sm transition-all hover:shadow-md"
              >
                <CardContent className="p-3">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="bg-bg-surface2 border-border-subtle flex h-10 w-10 items-center justify-center rounded-2xl border">
                      {getIcon(file.type)}
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Download className="text-text-muted h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:text-rose-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-text-primary truncate pr-8 text-sm font-bold">
                      {file.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-border-default text-text-muted h-4 px-1.5 py-0 text-[8px] font-black uppercase"
                      >
                        {getLabel(file.type)}
                      </Badge>
                      <span className="text-text-muted text-[9px] font-bold uppercase tracking-tight">
                        v{file.version}
                      </span>
                    </div>
                  </div>

                  <div className="border-border-subtle text-text-muted mt-4 flex items-center justify-between border-t pt-4 text-[9px] font-bold uppercase">
                    <span className="flex items-center gap-1">
                      <Paperclip className="h-3 w-3" /> {file.size}
                    </span>
                    <span>{file.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Placeholder contents for other tabs */}
        {['tz', 'pattern', 'photo', 'cert'].map((type) => (
          <TabsContent key={type} value={type} className="mt-0">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {filteredFiles
                .filter((f) => f.type === type)
                .map((file) => (
                  <Card
                    key={file.id}
                    className="border-border-subtle group overflow-hidden rounded-3xl shadow-sm transition-all hover:shadow-md"
                  >
                    <CardContent className="p-3">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="bg-bg-surface2 border-border-subtle flex h-10 w-10 items-center justify-center rounded-2xl border">
                          {getIcon(file.type)}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <h4 className="text-text-primary truncate text-sm font-bold">{file.name}</h4>
                      <p className="text-text-muted mt-1 text-[9px] font-bold uppercase">
                        Версия: {file.version} • {file.size}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              {filteredFiles.filter((f) => f.type === type).length === 0 && (
                <div className="bg-bg-surface2/80 border-border-default col-span-full rounded-xl border border-dashed py-12 text-center">
                  <FolderArchive className="text-text-muted mx-auto mb-2 h-12 w-12" />
                  <p className="text-text-muted text-xs font-bold uppercase tracking-widest">
                    Файлы не найдены
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Security Footer */}
      <div className="bg-accent-primary/10 border-accent-primary/20 flex items-center gap-3 rounded-2xl border p-4">
        <Lock className="text-accent-primary h-4 w-4" />
        <p className="text-accent-primary/70 text-[10px] font-medium uppercase tracking-tight">
          Доступ к архиву ограничен ролями <span className="font-bold">Бренд-владелец</span> и{' '}
          <span className="font-bold">Производство (Закрепленное)</span>. Все изменения логируются.
        </p>
      </div>
    </div>
  );
}
