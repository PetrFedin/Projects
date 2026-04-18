'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { products as allProducts } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Search,
  PlusCircle,
  Filter,
  Download,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Package,
  BarChart3,
  ChevronRight,
  Bot,
  Sparkles,
  RefreshCcw,
  MoreHorizontal,
  Eye,
  Layers,
  Globe,
  Truck,
  Activity,
  Factory,
  Warehouse,
} from 'lucide-react';
import { PromotionDialog } from '@/components/brand/promotion-dialog';
import Link from 'next/link';
import NextImage from 'next/image';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { fmtNumber, fmtMoney } from '@/lib/format';
import { GismtMonitor } from '@/components/brand/gismt-monitor';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { ROUTES } from '@/lib/routes';

const initialInventory = allProducts.filter((p) => p.brand === 'Syntha');

export default function BrandInventoryPage() {
  const [products, setProducts] = useState(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [availability, setAvailability] = useState<
    'all' | 'in_stock' | 'pre_order' | 'out_of_stock' | 'coming_soon'
  >('all');
  const [promotionProduct, setPromotionProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredProducts = useMemo(() => {
    let tempProducts = [...products];
    if (searchQuery) {
      tempProducts = tempProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (availability !== 'all') {
      if (availability === 'in_stock') {
        tempProducts = tempProducts.filter((p) =>
          p.availableColors?.some((c) =>
            c.sizeAvailability?.some((s) => s.status === 'in_stock' && s.quantity && s.quantity > 0)
          )
        );
      } else if (availability === 'out_of_stock') {
        tempProducts = tempProducts.filter(
          (p) =>
            !p.availableColors?.some((c) =>
              c.sizeAvailability?.some(
                (s) => s.status === 'in_stock' && s.quantity && s.quantity > 0
              )
            )
        );
      }
    }
    return tempProducts;
  }, [products, searchQuery, availability]);

  return (
    <RegistryPageShell
      className="w-full max-w-none space-y-4 pb-16 duration-700 animate-in fade-in"
      data-testid="brand-inventory-page"
    >
      <RegistryPageHeader
        title="Inventory Matrix"
        leadPlain="Остатки по SKU, видимость в каналах. Связь с Warehouse (склад), Production (приёмки) и B2B (заказы)."
        eyebrow={
          <div className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]">
            <Link href={ROUTES.brand.home} className="hover:text-accent-primary transition-colors">
              Organization
            </Link>
            <ChevronRight className="h-2 w-2" />
            <span className="text-text-muted">Inventory</span>
          </div>
        }
        actions={
          <>
            <Badge
              variant="outline"
              className="h-4 gap-1 border-emerald-100 bg-emerald-50 px-1.5 text-[7px] font-bold tracking-widest text-emerald-600 shadow-sm transition-all"
            >
              <Activity className="h-2.5 w-2.5" /> LIVE SYNC
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Warehouse
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.products}>
                <Package className="mr-1 h-3 w-3" /> Products
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.productsMatrix}>
                <Layers className="mr-1 h-3 w-3" /> Matrix
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.warehouse}>
                <Warehouse className="mr-1 h-3 w-3" /> Warehouse
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.production}>
                <Factory className="mr-1 h-3 w-3" /> Production
              </Link>
            </Button>
          </>
        }
      />
      <div className="border-border-subtle flex flex-col items-end justify-end gap-3 border-b pb-3 md:flex-row">
        <div className="flex w-full items-center gap-2 md:w-auto">
          {/* cabinetSurface v1 */}
          <div
            className={cn(
              cabinetSurface.groupTabList,
              'h-auto min-h-9 flex-wrap items-center gap-1'
            )}
          >
            <Button
              variant="ghost"
              className="text-text-primary h-7 rounded-lg bg-white px-3 text-[9px] font-bold uppercase shadow-sm"
            >
              Money
            </Button>
            <Button
              variant="ghost"
              className="text-text-muted hover:text-text-secondary h-7 rounded-lg px-3 text-[9px] font-bold uppercase transition-all hover:bg-white"
            >
              Units
            </Button>
          </div>
          <div className="bg-border-subtle mx-0.5 h-5 w-[1px]" />
          <Button
            variant="outline"
            size="sm"
            className="border-border-default hover:bg-bg-surface2 text-text-secondary h-7 gap-1.5 rounded-lg border bg-white px-2.5 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
          >
            <Download className="h-3 w-3" /> CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border-default hover:bg-bg-surface2 text-text-secondary h-7 gap-1.5 rounded-lg border bg-white px-2.5 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
            asChild
          >
            <Link href={ROUTES.shop.inventory} data-testid="brand-inventory-shop-stock-upload-link">
              Ритейл: загрузка остатков
            </Link>
          </Button>
          <Button
            asChild
            className="bg-text-primary hover:bg-accent-primary h-7 gap-1.5 rounded-lg px-3 text-[9px] font-bold uppercase tracking-widest text-white shadow-md transition-all"
          >
            <Link href={ROUTES.brand.productsNew}>
              <PlusCircle className="h-3 w-3" /> Add SKU
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <GismtMonitor />

        {/* --- ANALYTICAL GRID --- */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: 'STOCK VALUE',
              val: '142.5M ₽',
              sub: '+2.4%',
              trend: 'up',
              icon: Package,
              bg: 'bg-accent-primary/10',
            },
            {
              label: 'SELL-THROUGH',
              val: '68.2%',
              sub: 'High',
              trend: 'up',
              icon: BarChart3,
              bg: 'bg-emerald-50/50',
            },
            {
              label: 'LOW STOCK',
              val: '12',
              sub: 'Critical',
              trend: 'down',
              icon: AlertTriangle,
              critical: true,
              bg: 'bg-rose-50/50',
            },
            {
              label: 'REPLENISH',
              val: '8.4M ₽',
              sub: 'Suggested',
              trend: 'up',
              icon: RefreshCcw,
              bg: 'bg-amber-50/50',
            },
          ].map((m, i) => (
            <Card
              key={i}
              className="border-border-subtle hover:border-accent-primary/20 group relative overflow-hidden rounded-xl border bg-white p-3.5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-2.5 flex items-center justify-between">
                <div
                  className={cn(
                    'border-border-default/50 rounded-lg border p-1.5 shadow-inner',
                    m.bg
                  )}
                >
                  <m.icon
                    className={cn(
                      'h-3.5 w-3.5',
                      m.critical
                        ? 'text-rose-500'
                        : 'text-text-muted group-hover:text-accent-primary'
                    )}
                  />
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'h-3.5 border px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all',
                    m.trend === 'up'
                      ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                      : 'border-rose-100 bg-rose-50 text-rose-600'
                  )}
                >
                  {m.sub}
                </Badge>
              </div>
              <div className="space-y-0.5">
                <span className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-[0.15em]">
                  {m.label}
                </span>
                <p className="text-text-primary text-sm font-bold uppercase tabular-nums leading-none tracking-tighter">
                  {m.val}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* --- RETAILER DEMAND SYNC --- */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className="bg-bg-surface2/30 border-border-subtle hover:border-accent-primary/20 group rounded-xl border p-4 shadow-sm transition-all">
            <div className="mb-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 rounded-lg border p-1.5 shadow-inner transition-transform group-hover:scale-105">
                  <RefreshCcw className="animate-spin-slow h-3.5 w-3.5" />
                </div>
                <h2 className="text-text-primary text-[10px] font-bold uppercase leading-none tracking-widest">
                  Retailer Inventory Sync
                </h2>
              </div>
              <Badge className="h-4 border border-rose-100 bg-rose-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-rose-600 shadow-sm">
                8 ALERT
              </Badge>
            </div>
            <div className="space-y-1.5">
              {[
                {
                  shop: 'PODIUM',
                  item: 'Graphite Parka',
                  stock: 2,
                  recommended: 20,
                  status: 'Critical',
                },
                {
                  shop: 'ЦУМ',
                  item: 'Tech Trousers',
                  stock: 5,
                  recommended: 50,
                  status: 'Warning',
                },
              ].map((alert, i) => (
                <div
                  key={i}
                  className="border-border-subtle group/item hover:bg-bg-surface2 hover:border-accent-primary/20 flex cursor-pointer items-center justify-between rounded-xl border bg-white p-2.5 shadow-sm transition-all"
                >
                  <div>
                    <p className="text-accent-primary mb-1 text-[8px] font-bold uppercase leading-none tracking-widest">
                      {alert.shop}
                    </p>
                    <p className="text-text-primary group-hover/item:text-accent-primary text-[10px] font-bold uppercase tracking-tight transition-colors">
                      {alert.item}
                    </p>
                  </div>
                  <Button className="h-6.5 bg-text-primary hover:bg-accent-primary rounded-lg px-3 text-[8px] font-bold uppercase tracking-widest text-white shadow-md transition-all">
                    Replenish (+{alert.recommended})
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-bg-surface2/30 border-border-subtle group rounded-xl border p-4 shadow-sm transition-all hover:border-emerald-100">
            <div className="mb-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-1.5 text-emerald-600 shadow-inner transition-transform group-hover:scale-105">
                  <Truck className="h-3.5 w-3.5" />
                </div>
                <h2 className="text-text-primary text-[10px] font-bold uppercase leading-none tracking-widest">
                  Dropshipping Hub
                </h2>
              </div>
              <Badge className="h-4 border-none bg-emerald-600 px-1.5 text-[7px] font-bold uppercase tracking-widest text-white shadow-sm">
                LIVE FEED
              </Badge>
            </div>
            <div className="mb-3.5 grid grid-cols-2 gap-3">
              <div className="border-border-subtle rounded-xl border bg-white p-3 shadow-sm transition-colors group-hover:border-emerald-100">
                <p className="text-text-muted mb-1 text-[8px] font-bold uppercase leading-none tracking-widest">
                  Active Orders
                </p>
                <p className="text-text-primary text-base font-bold uppercase tabular-nums leading-none tracking-tighter">
                  142
                </p>
                <p className="mt-1.5 text-[8px] font-bold uppercase leading-none tracking-widest text-emerald-600">
                  SLA: 99.8%
                </p>
              </div>
              <div className="border-border-subtle rounded-xl border bg-white p-3 shadow-sm transition-colors group-hover:border-emerald-100">
                <p className="text-text-muted mb-1 text-[8px] font-bold uppercase leading-none tracking-widest">
                  Revenue (24h)
                </p>
                <p className="text-text-primary text-base font-bold uppercase tabular-nums leading-none tracking-tighter">
                  4.2M ₽
                </p>
                <p className="mt-1.5 text-[8px] font-bold uppercase leading-none tracking-widest text-emerald-600">
                  +15% TREND
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-border-default text-text-secondary h-7 w-full rounded-lg border bg-white text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
            >
              Manage Dropship Stock
            </Button>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
          <div className="space-y-3 xl:col-span-9">
            {/* --- TOOLBAR --- */}
            <div className="bg-bg-surface2 border-border-default flex items-center justify-between rounded-xl border p-1 shadow-inner">
              <div className="flex items-center gap-1.5">
                <div className="border-border-default flex rounded-lg border bg-white p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode('table')}
                    className={cn(
                      'h-6.5 rounded-md px-3 text-[9px] font-bold uppercase transition-all',
                      viewMode === 'table'
                        ? 'bg-text-primary text-white shadow-sm'
                        : 'text-text-muted hover:bg-bg-surface2'
                    )}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'h-6.5 rounded-md px-3 text-[9px] font-bold uppercase transition-all',
                      viewMode === 'grid'
                        ? 'bg-text-primary text-white shadow-sm'
                        : 'text-text-muted hover:bg-bg-surface2'
                    )}
                  >
                    Grid
                  </button>
                </div>
                <div className="bg-border-subtle mx-0.5 h-4 w-[1px]" />
                <div className="border-border-default no-scrollbar flex max-w-[300px] overflow-x-auto rounded-lg border bg-white p-1 shadow-sm md:max-w-none">
                  {['all', 'in_stock', 'pre_order', 'out_of_stock'].map((a) => (
                    <button
                      key={a}
                      onClick={() => setAvailability(a as any)}
                      className={cn(
                        'h-6.5 whitespace-nowrap rounded-md px-2.5 text-[8px] font-bold uppercase transition-all',
                        availability === a
                          ? 'bg-bg-surface2 text-text-primary shadow-inner'
                          : 'text-text-muted hover:bg-bg-surface2'
                      )}
                    >
                      {a.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <Search className="text-text-muted absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2" />
                  <Input
                    placeholder="Search..."
                    className="border-border-default focus:ring-accent-primary h-7 w-32 rounded-lg bg-white pl-8 text-[10px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 md:w-44"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="border-border-default hover:bg-bg-surface2 h-7 w-7 rounded-lg border bg-white shadow-sm transition-all"
                >
                  <Filter className="text-text-muted h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* --- INVENTORY TABLE --- */}
            <div className="border-border-subtle hover:border-accent-primary/20 overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-bg-surface2/80 border-border-subtle border-b">
                    <th className="text-text-muted bg-bg-surface2/80 sticky left-0 z-10 h-9 w-[35%] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em]">
                      Product Detail
                    </th>
                    <th className="text-text-muted h-9 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em]">
                      SKU
                    </th>
                    <th className="text-text-muted h-9 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em]">
                      Category
                    </th>
                    <th className="text-text-muted h-9 px-4 py-2 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
                      Stock
                    </th>
                    <th className="text-text-muted h-9 px-4 py-2 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
                      Wholesale
                    </th>
                    <th className="text-text-muted h-9 w-12 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em]"></th>
                  </tr>
                </thead>
                <tbody className="divide-border-subtle divide-y">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-bg-surface2/80 group h-12 transition-all"
                    >
                      <td className="group-hover:bg-bg-surface2 sticky left-0 z-10 bg-white px-4 py-2 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="bg-bg-surface2 border-border-default/50 relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg border shadow-inner transition-transform group-hover:scale-105">
                            <NextImage
                              src={product.images[0]?.url || 'https://picsum.photos/seed/p/200'}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-text-primary group-hover:text-accent-primary text-[11px] font-bold uppercase leading-tight tracking-tight transition-colors">
                              {product.name}
                            </p>
                            <p className="text-text-muted mt-0.5 text-[8px] font-bold uppercase tracking-widest">
                              {product.brand}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-text-muted font-mono text-[10px] uppercase tabular-nums tracking-tighter">
                          {product.sku}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant="outline"
                          className="text-text-secondary border-border-default h-4 rounded bg-white px-1.5 text-[8px] font-bold uppercase tracking-widest shadow-sm"
                        >
                          {product.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-text-primary text-[11px] font-bold tabular-nums">
                            {fmtNumber(Math.floor(Math.random() * 200))}
                          </span>
                          <span className="text-text-muted text-[7px] font-bold uppercase leading-none tracking-[0.2em]">
                            UNITS
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className="text-text-primary text-[11px] font-bold uppercase tabular-nums tracking-tighter">
                          {fmtMoney(product.price)}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-end opacity-0 transition-all group-hover:opacity-100">
                          <button className="hover:bg-text-primary/90 text-text-muted flex h-6 w-6 items-center justify-center rounded-md border border-transparent transition-all hover:text-white hover:shadow-md">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-bg-surface2/80 border-border-subtle flex items-center justify-between border-t px-4 py-2">
                <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest opacity-60">
                  Displaying {filteredProducts.length} results
                </span>
                <div className="flex gap-1">
                  <button
                    className="border-border-default text-text-muted hover:bg-bg-surface2 h-6 rounded-md border bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all disabled:opacity-50"
                    disabled
                  >
                    PREV
                  </button>
                  <button className="border-border-default text-text-secondary hover:bg-bg-surface2 h-6 rounded-md border bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all">
                    NEXT
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 xl:col-span-3">
            {/* --- REPLENISHMENT AI --- */}
            <Card className="bg-text-primary border-text-primary/30 group relative space-y-4 overflow-hidden rounded-xl border p-4 text-white shadow-lg">
              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="bg-accent-primary border-accent-primary flex h-8 w-8 items-center justify-center rounded-lg border text-white shadow-lg transition-transform group-hover:scale-105">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-accent-primary text-[9px] font-bold uppercase leading-none tracking-[0.2em]">
                      Inventory AI
                    </span>
                    <p className="text-[11px] font-bold uppercase tracking-tight">Co-Pilot Mode</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-colors group-hover:bg-white/10">
                    <p className="text-accent-primary mb-1 text-[8px] font-bold uppercase leading-none tracking-widest">
                      Replenish Alert
                    </p>
                    <p className="text-text-muted text-[10px] font-bold uppercase leading-relaxed tracking-tight">
                      "Parka Graphite selling 40% faster. Out of stock in 14 days."
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">
                      <p className="text-text-secondary mb-0.5 text-[7px] font-bold uppercase tracking-widest">
                        Health
                      </p>
                      <span className="text-[11px] font-bold uppercase tabular-nums tracking-tighter text-emerald-400">
                        94%
                      </span>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">
                      <p className="text-text-secondary mb-0.5 text-[7px] font-bold uppercase tracking-widest">
                        Velocity
                      </p>
                      <span className="text-accent-primary text-[11px] font-bold uppercase tracking-tighter">
                        High
                      </span>
                    </div>
                  </div>
                </div>

                <Button className="text-text-primary hover:bg-accent-primary/10 hover:text-accent-primary mt-4 h-8 w-full rounded-lg bg-white text-[9px] font-bold uppercase tracking-widest shadow-xl transition-all">
                  Generate Order
                </Button>
              </div>
              <Sparkles className="text-accent-primary absolute -right-6 -top-4 h-24 w-24 opacity-10 transition-all duration-700 group-hover:scale-110 group-hover:opacity-20" />
            </Card>

            {/* --- PRODUCTION UPDATES --- */}
            <Card className="border-border-subtle hover:border-accent-primary/20 group space-y-4 rounded-xl border bg-white p-4 shadow-sm transition-all">
              <div className="border-border-subtle flex items-center justify-between border-b pb-2.5">
                <h3 className="text-text-primary flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <Layers className="text-accent-primary h-3.5 w-3.5" /> Pipeline
                </h3>
                <Badge
                  variant="outline"
                  className="h-3.5 rounded border-emerald-100 bg-emerald-50 px-1.5 text-[7px] font-bold tracking-widest text-emerald-600 shadow-sm"
                >
                  ACTIVE
                </Badge>
              </div>

              <div className="space-y-3.5">
                {[
                  { stage: 'CUTTING', style: 'Graphite Parka', prog: 85, status: 'On Track' },
                  { stage: 'SEWING', style: 'Tech Trousers', prog: 42, status: 'Delayed' },
                  { stage: 'QC', style: 'Silk Scarf', prog: 100, status: 'Finished' },
                ].map((step, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-text-primary text-[9px] font-bold uppercase leading-none tracking-tight">
                        {step.style}
                      </span>
                      <span
                        className={cn(
                          'flex h-3.5 items-center rounded px-1 text-[7px] font-bold uppercase tracking-widest',
                          step.status === 'Delayed'
                            ? 'bg-rose-50 text-rose-500'
                            : step.status === 'Finished'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'text-accent-primary bg-accent-primary/10'
                        )}
                      >
                        {step.status}
                      </span>
                    </div>
                    <div className="bg-bg-surface2 border-border-default/30 h-1 w-full overflow-hidden rounded-full border shadow-inner">
                      <div
                        className={cn(
                          'h-full transition-all duration-1000',
                          step.status === 'Delayed'
                            ? 'bg-rose-500'
                            : step.status === 'Finished'
                              ? 'bg-emerald-500'
                              : 'bg-accent-primary'
                        )}
                        style={{ width: `${step.prog}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted text-[7px] font-bold uppercase leading-none tracking-widest">
                        {step.stage}
                      </span>
                      <span className="text-text-secondary text-[9px] font-bold tabular-nums tracking-tighter">
                        {step.prog}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="border-border-default text-text-muted hover:bg-text-primary/90 hover:border-text-primary flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all hover:text-white"
              >
                Production View <ChevronRight className="h-3 w-3" />
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {promotionProduct && (
        <PromotionDialog
          product={promotionProduct}
          isOpen={!!promotionProduct}
          onOpenChange={(open) => {
            if (!open) setPromotionProduct(null);
          }}
        />
      )}
    </RegistryPageShell>
  );
}
