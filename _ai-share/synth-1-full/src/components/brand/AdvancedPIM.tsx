'use client';

import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Edit,
  MoreVertical,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Layers,
  Image as ImageIcon,
  FileText,
  LayoutGrid,
  List,
  Sparkles,
  Save,
  Trash2,
  Copy,
  Activity,
  Database,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { fmtNumber } from '@/lib/format';
import { fastApiService } from '@/lib/fastapi-service';
import Link from 'next/link';
import { useEffect } from 'react';

const MOCK_PIM_PRODUCTS = [
  {
    id: '1',
    sku: 'CTP-26-001',
    name: 'Cyber Tech Parka',
    category: 'Outerwear',
    season: 'FW26',
    status: 'Ready',
    price: 18000,
    colors: 3,
    sizes: 5,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200',
    sustainabilityScore: 88,
    productionStatus: 'Quality Check',
    productionProgress: 95,
    certificates: ['GOTS', 'OEKO-TEX'],
    iotProtected: true,
    retailerInterest: 'High',
  },
  {
    id: '2',
    sku: 'NCP-26-042',
    name: 'Neural Cargo Pants',
    category: 'Pants',
    season: 'FW26',
    status: 'Draft',
    price: 9500,
    colors: 2,
    sizes: 6,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200',
    sustainabilityScore: 72,
    productionStatus: 'Sewing',
    productionProgress: 45,
    certificates: ['BCI'],
    iotProtected: false,
    retailerInterest: 'Medium',
  },
  {
    id: '3',
    sku: 'SRO-26-015',
    name: 'Silk Road Overshirt',
    category: 'Shirts',
    season: 'CORE',
    status: 'In Review',
    price: 12000,
    colors: 4,
    sizes: 4,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=200',
    sustainabilityScore: 94,
    productionStatus: 'Finished',
    productionProgress: 100,
    certificates: ['GOTS', 'Fair Trade'],
    iotProtected: true,
    retailerInterest: 'Very High',
  },
];

export function AdvancedPIM() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>(MOCK_PIM_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fastApiService.getProducts();
        const data = Array.isArray(response) ? response : (response?.data ?? []);
        if (data.length > 0) setProducts(data);
      } catch (err) {
        console.warn('Failed to fetch real products, using mock data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-4 pb-24 duration-700 animate-in fade-in">
      {/* Control Panel: Executive Style */}
      <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <Package className="h-2.5 w-2.5" />
            <span>Catalog</span>
            <ChevronDown className="h-2 w-2 opacity-50" />
            <span className="text-slate-300">Advanced PIM</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-headline text-base font-bold uppercase leading-none tracking-tighter text-slate-900">
              Product Hub 2.0
            </h1>
            <Badge
              variant="outline"
              className="h-4 gap-1 border-emerald-100 bg-emerald-50 px-1.5 text-[7px] font-bold tracking-widest text-emerald-600 shadow-sm transition-all"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> ERP SYNC:
              ACTIVE
            </Badge>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
            <Button
              variant="ghost"
              className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:text-indigo-600"
            >
              <RefreshCw className="mr-1.5 h-3 w-3" /> Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:bg-slate-50"
            >
              <Download className="h-3 w-3" /> Экспорт
            </Button>
          </div>
        </div>
      </div>

      {/* 1. High-Level PIM KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <TooltipProvider>
          {[
            {
              label: 'TOTAL SKU',
              value: '1,248',
              change: '+12%',
              icon: Package,
              color: 'text-indigo-600',
              bg: 'bg-indigo-50/50',
              section: 'Каталог',
              desc: 'Общее количество уникальных артикулов в базе PIM.',
            },
            {
              label: 'SALES READY',
              value: '94%',
              change: '+2.1%',
              icon: CheckCircle2,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50/50',
              section: 'Статус',
              desc: 'Процент товаров с полностью заполненными данными и медиа-активами.',
            },
            {
              label: 'DATA ERRORS',
              value: '18',
              change: '-5',
              icon: AlertTriangle,
              color: 'text-rose-600',
              bg: 'bg-rose-50/50',
              section: 'Качество',
              desc: 'Количество SKU с критическими ошибками (отсутствует описание, цена или фото).',
            },
            {
              label: 'MEDIA COVERAGE',
              value: '88%',
              change: '+4.5%',
              icon: ImageIcon,
              color: 'text-blue-600',
              bg: 'bg-blue-50/50',
              section: 'Контент',
              desc: 'Охват товаров профессиональным фотоконтентом (Lookbook, 3D, Flatlay).',
            },
          ].map((stat, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Card className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:border-indigo-100">
                  <div className="mb-2.5 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'rounded-lg border border-slate-200/50 p-1.5 shadow-inner',
                          stat.bg
                        )}
                      >
                        <stat.icon className={cn('h-3.5 w-3.5', stat.color)} />
                      </div>
                      <span className="text-[9px] font-bold uppercase leading-none tracking-[0.15em] text-slate-400">
                        {stat.label}
                      </span>
                    </div>
                    <Badge className="h-4 rounded-md border border-emerald-100 bg-emerald-50 px-1.5 text-[8px] font-bold uppercase tracking-tight text-emerald-600 shadow-sm">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold uppercase tabular-nums leading-none tracking-tighter text-slate-900">
                      {stat.value}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                      {stat.section}
                    </span>
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[200px] rounded-xl border-none bg-slate-900 p-3 text-[9px] font-bold uppercase tracking-widest text-white shadow-2xl"
              >
                <p className="leading-relaxed">{stat.desc}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* 2. Search & List Section */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        <aside className="space-y-3 lg:col-span-1">
          <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50 p-3.5">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Collection Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-3.5">
              <div className="space-y-1.5">
                <label className="ml-1 text-[9px] font-bold uppercase leading-none tracking-widest text-slate-400">
                  Seasonality
                </label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-8 rounded-lg border border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-tight transition-all focus:ring-1 focus:ring-indigo-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    <SelectItem value="all" className="py-1.5 text-[10px] font-bold uppercase">
                      All Seasons
                    </SelectItem>
                    <SelectItem value="fw26" className="py-1.5 text-[10px] font-bold uppercase">
                      FW 2026
                    </SelectItem>
                    <SelectItem value="ss26" className="py-1.5 text-[10px] font-bold uppercase">
                      SS 2026
                    </SelectItem>
                    <SelectItem value="core" className="py-1.5 text-[10px] font-bold uppercase">
                      CORE Collection
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2.5">
                <label className="ml-1 text-[9px] font-bold uppercase leading-none tracking-widest text-slate-400">
                  Data Status
                </label>
                <div className="space-y-1">
                  {['Ready', 'Draft', 'Review', 'Error'].map((s) => (
                    <div
                      key={s}
                      className="group flex cursor-pointer items-center gap-2 rounded-lg p-1.5 transition-all hover:bg-slate-50"
                    >
                      <Checkbox
                        id={s}
                        className="h-3.5 w-3.5 rounded-sm border-slate-200 data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600"
                      />
                      <label
                        htmlFor={s}
                        className="cursor-pointer text-[10px] font-bold uppercase leading-none tracking-tight text-slate-600 transition-colors group-hover:text-indigo-600"
                      >
                        {s}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                className="h-8 w-full rounded-lg border border-slate-100 text-[9px] font-bold uppercase tracking-widest text-slate-400 transition-all hover:bg-slate-900 hover:text-white"
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4 text-white shadow-lg">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg border border-indigo-500 bg-indigo-600 p-2 shadow-lg transition-transform group-hover:scale-105">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold uppercase leading-none tracking-[0.2em] text-indigo-300">
                    Intelligence
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-tight">PIM AI Advisor</p>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-colors group-hover:bg-white/10">
                <p className="text-[10px] font-bold uppercase italic leading-relaxed tracking-tight opacity-80">
                  "Detected 12 SKU missing technical specs and 5 with low-res assets. Action
                  recommended."
                </p>
              </div>
              <Button className="h-8 w-full rounded-lg bg-white text-[9px] font-bold uppercase tracking-widest text-slate-900 shadow-xl transition-all hover:bg-indigo-50">
                Remediate Errors
              </Button>
            </div>
            <Sparkles className="absolute -right-6 -top-4 h-24 w-24 text-indigo-600 opacity-10 transition-all duration-700 group-hover:scale-110 group-hover:opacity-20" />
          </Card>
        </aside>

        <div className="space-y-3 lg:col-span-3">
          <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50 p-3.5">
              <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-1.5 text-indigo-600 shadow-inner">
                    <Layers className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
                      SKU Registry
                    </CardTitle>
                    <CardDescription className="text-[9px] font-bold uppercase tracking-tight text-slate-400">
                      Master Data Management
                    </CardDescription>
                  </div>
                </div>
                <div className="flex w-full items-center gap-2 md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Поиск SKU…"
                      className="h-7 w-full rounded-lg border-slate-200 bg-white pl-8 text-[10px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 focus:ring-indigo-500 md:w-44"
                    />
                  </div>
                  <Button className="h-7 gap-1.5 rounded-lg bg-slate-900 px-3 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-indigo-600">
                    <Plus className="h-3 w-3" /> Новый SKU
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow className="h-9 border-none">
                    <TableHead className="h-9 w-10 px-4 text-center">
                      <Checkbox
                        checked={selectedItems.length === products.length}
                        onCheckedChange={(val) =>
                          val ? setSelectedItems(products.map((p) => p.id)) : setSelectedItems([])
                        }
                      />
                    </TableHead>
                    <TableHead className="h-9 py-0 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Article
                    </TableHead>
                    <TableHead className="h-9 py-0 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      SKU / Season
                    </TableHead>
                    <TableHead className="h-9 py-0 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Production
                    </TableHead>
                    <TableHead className="h-9 py-0 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      ESG
                    </TableHead>
                    <TableHead className="h-9 py-0 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Status
                    </TableHead>
                    <TableHead className="h-9 py-0 pr-4 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Valuation
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
                      className="group h-12 border-slate-50 transition-all hover:bg-slate-50/50"
                    >
                      <TableCell className="px-4 py-0 text-center">
                        <Checkbox
                          checked={selectedItems.includes(product.id)}
                          onCheckedChange={(val) =>
                            val
                              ? setSelectedItems([...selectedItems, product.id])
                              : setSelectedItems(selectedItems.filter((id) => id !== product.id))
                          }
                        />
                      </TableCell>
                      <TableCell className="py-0">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6.5 relative h-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-transform group-hover:scale-110">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                            {product.iotProtected && (
                              <div className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full border border-white bg-slate-900 shadow-xl">
                                <ShieldCheck className="h-2 w-2 text-indigo-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase leading-none tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                              {product.name}
                            </p>
                            <Badge
                              variant="outline"
                              className="mt-1 h-3 border-slate-100 bg-slate-50 px-1 text-[7px] font-bold uppercase leading-none tracking-widest text-slate-400 shadow-sm"
                            >
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-0">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold leading-none tracking-tight text-slate-900">
                            {product.sku}
                          </p>
                          <p className="mt-1 text-[8px] font-bold uppercase leading-none tracking-[0.2em] text-slate-400 opacity-70">
                            {product.season}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-0">
                        <div className="max-w-[80px] space-y-1">
                          <div className="flex justify-between text-[8px] font-bold uppercase leading-none tracking-tight">
                            <span className="text-slate-400">{product.productionStatus}</span>
                            <span className="text-indigo-600">{product.productionProgress}%</span>
                          </div>
                          <div className="h-1 w-full overflow-hidden rounded-full border border-slate-50 bg-slate-100 shadow-inner">
                            <div
                              className="h-full rounded-full bg-indigo-500 transition-all duration-1000"
                              style={{ width: `${product.productionProgress}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-0 text-center">
                        <span
                          className={cn(
                            'text-[10px] font-bold uppercase tabular-nums leading-none',
                            product.sustainabilityScore > 80 ? 'text-emerald-600' : 'text-amber-600'
                          )}
                        >
                          {product.sustainabilityScore}%
                        </span>
                      </TableCell>
                      <TableCell className="py-0">
                        <Badge
                          variant="outline"
                          className={cn(
                            'h-4 border px-1.5 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all',
                            product.status === 'Ready'
                              ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                              : product.status === 'Draft'
                                ? 'border-slate-200 bg-slate-50 text-slate-400'
                                : 'border-amber-100 bg-amber-50 text-amber-600'
                          )}
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-0 pr-4 text-right">
                        <p className="text-[11px] font-bold uppercase tabular-nums tracking-tighter text-slate-900">
                          {fmtNumber(product.price)} ₽
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 opacity-60">
                Inventory count: {products.length}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="h-6 rounded-md border border-slate-200 bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest text-slate-400 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 rounded-md border border-slate-200 bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:bg-slate-50"
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
