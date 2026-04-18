'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileText,
  Download,
  Share2,
  Plus,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  LayoutGrid,
  List as ListIcon,
  Zap,
  Sparkles,
  Printer,
  ChevronRight,
  Info,
  AlertCircle,
  ShoppingBag,
  Calendar,
  Package,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { products as allProducts } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function LineSheetGenerator() {
  const { toast } = useToast();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [linesheetTitle, setLinesheetTitle] = useState('Line Sheet: FW26 Core Collection');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = useMemo(() => {
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (selectedProductIds.length === 0) {
      toast({
        title: 'No products selected',
        description: 'Please select at least one product to generate a linesheet.',
        variant: 'destructive',
      });
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsResultOpen(true);
      toast({
        title: 'Line Sheet Generated',
        description: 'Digital Line Sheet is ready for sharing.',
      });
    }, 2000);
  };

  const selectedProducts = useMemo(() => {
    return allProducts.filter((p) => selectedProductIds.includes(p.id));
  }, [selectedProductIds]);

  const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const wholesalePrice = totalPrice * 0.45; // Simulated wholesale value

  return (
    <div className="space-y-4 duration-500 animate-in fade-in">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <Badge className="bg-accent-primary mb-3 border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            Wholesale & B2B Tool
          </Badge>
          <h1 className="text-text-primary text-sm font-black uppercase leading-none tracking-tight">
            Digital <span className="text-accent-primary">Line Sheet</span> Generator
          </h1>
          <p className="text-text-secondary mt-4 max-w-xl font-medium">
            Создавайте профессиональные цифровые каталоги (Line Sheets) для байеров и ритейлеров за
            считанные минуты.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setSelectedProductIds([])}
            className="border-border-default h-10 rounded-xl px-4 text-[9px] font-bold uppercase tracking-widest"
          >
            <RotateCcw className="mr-2 h-3 w-3" /> Сбросить выбор
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={selectedProductIds.length === 0 || isGenerating}
            className="bg-text-primary h-10 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-md"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-3 w-3" />
            )}
            Сгенерировать ({selectedProductIds.length})
          </Button>
        </div>
      </header>

      <div className="grid items-start gap-3 lg:grid-cols-12">
        {/* Left: Product Selector */}
        <div className="space-y-6 lg:col-span-8">
          <Card className="overflow-hidden rounded-xl border-none bg-white shadow-xl">
            <CardHeader className="border-border-subtle border-b">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Поиск товаров по имени, бренду или артикулу..."
                    className="bg-bg-surface2 h-11 rounded-xl border-none pl-10 text-xs font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-10 w-10 rounded-xl"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-10 w-10 rounded-xl"
                    onClick={() => setViewMode('list')}
                  >
                    <ListIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[600px] pr-4">
                <div
                  className={cn(
                    'grid gap-3',
                    viewMode === 'grid'
                      ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  )}
                >
                  {filteredProducts.map((product) => {
                    const isSelected = selectedProductIds.includes(product.id);
                    return (
                      <div
                        key={product.id}
                        onClick={() => toggleProduct(product.id)}
                        className={cn(
                          'group relative cursor-pointer overflow-hidden rounded-2xl border-2 transition-all',
                          isSelected
                            ? 'border-accent-primary bg-accent-primary/10 shadow-md'
                            : 'border-border-subtle hover:border-border-default bg-white'
                        )}
                      >
                        <div className="relative aspect-[3/4]">
                          <Image
                            src={
                              product.images?.[0]?.url ||
                              (product as any).image ||
                              'https://picsum.photos/seed/p1/400/600'
                            }
                            alt={product.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          {isSelected && (
                            <div className="bg-accent-primary absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-lg">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-text-muted mb-0.5 text-[8px] font-black uppercase">
                            {product.brand}
                          </p>
                          <h4 className="mb-1 truncate text-[10px] font-black uppercase tracking-tight">
                            {product.name}
                          </h4>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold tabular-nums">
                              {product.price.toLocaleString('ru-RU')} ₽
                            </span>
                            <span className="text-accent-primary bg-accent-primary/10 rounded px-1 text-[7px] font-black uppercase">
                              WS: {(product.price * 0.45).toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary & Configuration */}
        <div className="space-y-6 lg:col-span-4">
          <Card className="overflow-hidden rounded-xl border-none bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-base font-black uppercase tracking-tight">
                Настройки каталога
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                  Название коллекции
                </Label>
                <Input
                  value={linesheetTitle}
                  onChange={(e) => setLinesheetTitle(e.target.value)}
                  className="bg-bg-surface2 rounded-xl border-none font-bold"
                />
              </div>

              <div className="bg-accent-primary shadow-accent-primary/10 space-y-4 rounded-2xl p-4 text-white shadow-xl">
                <div className="mb-2 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 opacity-70" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                    Итого в каталоге
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[8px] font-black uppercase opacity-60">Товаров</p>
                    <p className="text-sm font-black">{selectedProductIds.length}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase opacity-60">
                      Суммарная ценность (WS)
                    </p>
                    <p className="text-sm font-black tabular-nums">
                      {Math.round(wholesalePrice).toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                  Параметры отображения
                </h4>
                <div className="space-y-3">
                  {[
                    { id: 'prices', label: 'Показывать оптовые цены (WS)', checked: true },
                    {
                      id: 'rrp',
                      label: 'Показывать рекомендуемые розничные цены (RRP)',
                      checked: true,
                    },
                    { id: 'availability', label: 'Показывать доступность (ATS)', checked: true },
                    { id: 'materials', label: 'Включить состав материалов', checked: false },
                    { id: 'qr', label: 'Добавить QR-коды для каждого товара', checked: true },
                  ].map((opt) => (
                    <div key={opt.id} className="flex items-center space-x-3">
                      <Checkbox id={opt.id} defaultChecked={opt.checked} />
                      <Label
                        htmlFor={opt.id}
                        className="cursor-pointer text-xs font-bold uppercase leading-none tracking-tight"
                      >
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-bg-surface2 flex flex-col gap-3 p-4">
              <Button
                className="bg-text-primary h-12 w-full rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
                onClick={handleGenerate}
                disabled={selectedProductIds.length === 0 || isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Сгенерировать Line Sheet
              </Button>
              <p className="text-text-muted text-center text-[9px] font-bold uppercase tracking-widest">
                Ссылка будет активна 30 дней
              </p>
            </CardFooter>
          </Card>

          <div className="from-accent-primary/10 border-accent-primary/20 space-y-4 rounded-xl border bg-gradient-to-br to-white p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-accent-primary h-4 w-4" />
              <h4 className="text-accent-primary text-[10px] font-black uppercase tracking-widest">
                AI Line Sheet Optimizer
              </h4>
            </div>
            <p className="text-accent-primary text-[11px] font-medium leading-relaxed">
              На основе анализа спроса в регионе байера (Москва), мы рекомендуем добавить еще 3
              модели из коллекции "Techwear Base". Это увеличит вероятность заказа на 24%.
            </p>
            <Button
              variant="outline"
              className="border-accent-primary/30 text-accent-primary hover:bg-accent-primary/10 h-9 w-full rounded-xl bg-white text-[9px] font-black uppercase tracking-widest"
            >
              Принять рекомендации
            </Button>
          </div>
        </div>
      </div>

      {/* Result Dialog */}
      <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
        <DialogContent className="max-w-4xl overflow-hidden rounded-xl border-none bg-white p-0">
          <div className="bg-text-primary relative p-4 text-white">
            <div className="absolute right-0 top-0 p-4 opacity-5">
              <FileText className="h-64 w-64 rotate-12" />
            </div>
            <div className="relative z-10">
              <Badge className="bg-accent-primary mb-6 border-none px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                Generation Successful
              </Badge>
              <h2 className="mb-4 text-sm font-black uppercase italic leading-none tracking-tighter">
                {linesheetTitle}
              </h2>
              <div className="text-text-muted flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Expires: March 15, 2026
                </span>
                <span className="flex items-center gap-2">
                  <Package className="h-4 w-4" /> {selectedProductIds.length} Items Included
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-10 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-6">
                <h3 className="text-base font-black uppercase tracking-tight">Доступные форматы</h3>
                <div className="space-y-3">
                  {[
                    {
                      id: 'web',
                      label: 'Interactive Digital Link',
                      icon: Zap,
                      desc: 'Байер может делать заказ прямо из каталога',
                      primary: true,
                    },
                    {
                      id: 'pdf',
                      label: 'High-Res PDF (Print ready)',
                      icon: FileText,
                      desc: 'Для офлайн встреч и архива',
                      primary: false,
                    },
                    {
                      id: 'xls',
                      label: 'Excel Order Form',
                      icon: Package,
                      desc: 'Таблица со всеми SKU и WS ценами',
                      primary: false,
                    },
                  ].map((format) => (
                    <div
                      key={format.id}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 transition-all',
                        format.primary
                          ? 'border-accent-primary bg-accent-primary/10 shadow-lg'
                          : 'border-border-subtle hover:border-border-default'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-xl',
                          format.primary
                            ? 'bg-accent-primary text-white'
                            : 'bg-bg-surface2 text-text-secondary'
                        )}
                      >
                        <format.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest">
                          {format.label}
                        </p>
                        <p className="text-text-muted text-[10px] font-bold">{format.desc}</p>
                      </div>
                      <Download className="text-text-muted h-4 w-4" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-base font-black uppercase tracking-tight">
                  Шеринг и Безопасность
                </h3>
                <div className="bg-bg-surface2 border-border-subtle space-y-4 rounded-2xl border p-4">
                  <div className="space-y-2">
                    <Label className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                      Публичная ссылка
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value="https://syntha.os/ls/b2b-fw26-core-6721"
                        className="border-border-default h-10 bg-white text-xs font-bold"
                      />
                      <Button size="icon" className="bg-text-primary h-10 w-10 shrink-0 rounded-lg">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <p className="text-[10px] font-bold">
                      Пароль для доступа: <strong>SYN26B2B</strong>
                    </p>
                  </div>
                </div>
                <div className="border-border-subtle flex items-center gap-3 rounded-2xl border p-4">
                  <Printer className="text-text-muted h-5 w-5" />
                  <div>
                    <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest">
                      Печать этикеток
                    </p>
                    <p className="text-text-muted text-[10px] font-bold uppercase">
                      Сгенерировать QR для шоурума
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-auto rounded-lg">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-bg-surface2 border-border-subtle flex justify-end gap-3 border-t p-4">
            <Button
              variant="outline"
              className="h-12 rounded-xl px-8 text-[10px] font-black uppercase tracking-widest"
              onClick={() => setIsResultOpen(false)}
            >
              Закрыть
            </Button>
            <Button className="bg-accent-primary shadow-accent-primary/10 h-12 rounded-xl px-10 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
              Открыть превью <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RotateCcw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function ArrowUpRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

function Timer(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="10" x2="14" y1="2" y2="2" />
      <line x1="12" x2="15" y1="14" y2="11" />
      <circle cx="12" cy="14" r="8" />
    </svg>
  );
}
