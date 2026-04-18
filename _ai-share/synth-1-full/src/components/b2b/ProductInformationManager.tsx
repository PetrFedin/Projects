'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Plus,
  Search,
  ImageIcon,
  FileText,
  Zap,
  Layers,
  History,
  Maximize2,
  Trash2,
  Copy,
  ExternalLink,
  UploadCloud,
  FileSpreadsheet,
  Compass,
  Droplets,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

// Sub-components
import { PIMInfoTab } from './pim/PIMInfoTab';
import { PIMVariantsTab } from './pim/PIMVariantsTab';
import { PIMMediaTab } from './pim/PIMMediaTab';
import { PIMSpecsTab } from './pim/PIMSpecsTab';

export function ProductInformationManager() {
  const { b2bProducts } = useB2BState();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    'info' | 'media' | 'specs' | 'history' | 'variants' | 'sustainability'
  >('info');
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  // We'll map context products to PIM structure if needed,
  // but for now let's use context data to ensure isolation
  const displayProducts =
    b2bProducts.length > 0
      ? b2bProducts
      : [
          {
            id: 'pim-1',
            name: 'Cyber Tech Parka v2',
            sku: 'CTP-26-001',
            category: 'Outerwear',
            status: 'ready',
            completeness: 95,
            lastEdit: '2h ago',
            composition: [
              { material: 'Graphene Nylon', percent: 80 },
              { material: 'Recycled Poly', percent: 20 },
            ],
            certs: ['OEKO-TEX', 'GRS'],
            variants: [
              { color: 'Obsidian', hex: '#000000', sizes: { XS: 12, S: 45, M: 82, L: 34, XL: 12 } },
              {
                color: 'Ghost White',
                hex: '#f8fafc',
                sizes: { XS: 5, S: 22, M: 45, L: 12, XL: 8 },
              },
            ],
          },
        ];

  const renderBulkImport = () => (
    <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
      <DialogContent className="max-w-2xl rounded-xl border-none bg-white p-3 shadow-2xl">
        <DialogHeader className="mb-8">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
=======
            <div className="bg-accent-primary/10 text-accent-primary flex h-12 w-12 items-center justify-center rounded-2xl">
>>>>>>> recover/cabinet-wip-from-stash
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-sm font-black uppercase tracking-tight">
                Bulk Import Styles
              </DialogTitle>
<<<<<<< HEAD
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
              <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Supports CSV, XLSX and Direct Shopify Sync
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
<<<<<<< HEAD
          <div className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-4 border-dashed border-slate-100 p-4 transition-all hover:border-indigo-200 hover:bg-slate-50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-400 transition-transform group-hover:scale-110">
              <FileSpreadsheet className="h-8 w-8" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm font-black uppercase text-slate-900">Drop your file here</p>
              <p className="text-[10px] font-medium uppercase text-slate-400">
=======
          <div className="border-border-subtle hover:border-accent-primary/30 hover:bg-bg-surface2 group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-4 border-dashed p-4 transition-all">
            <div className="bg-accent-primary/10 text-accent-primary flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <FileSpreadsheet className="h-8 w-8" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-text-primary text-sm font-black uppercase">Drop your file here</p>
              <p className="text-text-muted text-[10px] font-medium uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Max file size: 25MB • Up to 500 SKUs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
<<<<<<< HEAD
            <Card className="cursor-pointer space-y-3 border-none bg-slate-50 p-4 shadow-sm transition-all hover:bg-indigo-50">
              <h4 className="text-[10px] font-black uppercase text-slate-900">Download Template</h4>
              <p className="text-[9px] font-medium text-slate-400">
=======
            <Card className="bg-bg-surface2 hover:bg-accent-primary/10 cursor-pointer space-y-3 border-none p-4 shadow-sm transition-all">
              <h4 className="text-text-primary text-[10px] font-black uppercase">
                Download Template
              </h4>
              <p className="text-text-muted text-[9px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                Standard PIM structure with variant mapping
              </p>
              <Button
                variant="ghost"
<<<<<<< HEAD
                className="h-auto p-0 text-[9px] font-black uppercase text-indigo-600"
=======
                className="text-accent-primary h-auto p-0 text-[9px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Get XLSX
              </Button>
            </Card>
<<<<<<< HEAD
            <Card className="cursor-pointer space-y-3 border-none bg-slate-50 p-4 shadow-sm transition-all hover:bg-indigo-50">
              <h4 className="text-[10px] font-black uppercase text-slate-900">Integrations</h4>
              <p className="text-[9px] font-medium text-slate-400">
=======
            <Card className="bg-bg-surface2 hover:bg-accent-primary/10 cursor-pointer space-y-3 border-none p-4 shadow-sm transition-all">
              <h4 className="text-text-primary text-[10px] font-black uppercase">Integrations</h4>
              <p className="text-text-muted text-[9px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                Auto-sync from Shopify, Centric or Lectra
              </p>
              <Button
                variant="ghost"
<<<<<<< HEAD
                className="h-auto p-0 text-[9px] font-black uppercase text-indigo-600"
=======
                className="text-accent-primary h-auto p-0 text-[9px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Manage API
              </Button>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
<<<<<<< HEAD
    <div className="min-h-screen space-y-4 bg-slate-50 p-4 text-left">
=======
    <div className="bg-bg-surface2 min-h-screen space-y-4 p-4 text-left">
>>>>>>> recover/cabinet-wip-from-stash
      {renderBulkImport()}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600">
=======
            <div className="bg-accent-primary flex h-8 w-8 items-center justify-center rounded-xl">
>>>>>>> recover/cabinet-wip-from-stash
              <Database className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
<<<<<<< HEAD
              className="border-indigo-100 text-[9px] font-black uppercase tracking-widest text-indigo-600"
=======
              className="border-accent-primary/20 text-accent-primary text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
            >
              PIM_SYSTEM_v6.2
            </Badge>
          </div>
<<<<<<< HEAD
          <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-sm">
=======
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
>>>>>>> recover/cabinet-wip-from-stash
            Product Content
            <br />
            Manager
          </h2>
<<<<<<< HEAD
          <p className="max-w-md text-xs font-medium text-slate-400">
=======
          <p className="text-text-muted max-w-md text-xs font-medium">
>>>>>>> recover/cabinet-wip-from-stash
            Centralized hub for product data, media assets, and technical specifications. Sync data
            across all channels and partners instantly.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setIsBulkImportOpen(true)}
<<<<<<< HEAD
            className="h-10 gap-2 rounded-2xl border-slate-200 bg-white px-6 text-[10px] font-black uppercase tracking-widest"
          >
            <Layers className="h-4 w-4" /> Bulk Import (CSV/XLS)
          </Button>
          <Button className="h-10 gap-2 rounded-2xl bg-slate-900 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200">
=======
            className="border-border-default h-10 gap-2 rounded-2xl bg-white px-6 text-[10px] font-black uppercase tracking-widest"
          >
            <Layers className="h-4 w-4" /> Bulk Import (CSV/XLS)
          </Button>
          <Button className="bg-text-primary h-10 gap-2 rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
            <Plus className="h-4 w-4" /> New Master Style
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4">
          <div className="relative">
<<<<<<< HEAD
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
=======
            <Search className="text-text-muted absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
>>>>>>> recover/cabinet-wip-from-stash
            <Input
              placeholder="Search catalog..."
              className="h-10 rounded-2xl border-none bg-white pl-12 shadow-sm"
            />
          </div>

          <div className="space-y-4">
            {displayProducts.map((p) => (
              <Card
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className={cn(
<<<<<<< HEAD
                  'group cursor-pointer overflow-hidden rounded-xl border-none shadow-xl shadow-slate-200/50 transition-all',
                  selectedProduct?.id === p.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white hover:bg-slate-50'
=======
                  'group cursor-pointer overflow-hidden rounded-xl border-none shadow-md shadow-xl transition-all',
                  selectedProduct?.id === p.id
                    ? 'bg-text-primary text-white'
                    : 'hover:bg-bg-surface2 bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                )}
              >
                <CardContent className="p-4">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
<<<<<<< HEAD
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                        <img
                          src={
                            p.images?.[0]?.url ||
=======
                      <div className="bg-bg-surface2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl">
                        <img
                          src={
                            ('images' in p && p.images?.[0]?.url) ||
>>>>>>> recover/cabinet-wip-from-stash
                            `https://placehold.co/100x100/f1f5f9/94a3b8?text=${p.sku?.split('-')[0]}`
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-tight">{p.name}</h4>
                        <p
                          className={cn(
                            'text-[9px] font-black uppercase tracking-widest',
<<<<<<< HEAD
                            selectedProduct?.id === p.id ? 'text-white/40' : 'text-slate-400'
=======
                            selectedProduct?.id === p.id ? 'text-white/40' : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        >
                          {p.sku}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        'border-none px-2 py-0.5 text-[8px] font-black',
                        (p as any).status === 'ready'
                          ? 'bg-emerald-50 text-emerald-600'
                          : (p as any).status === 'review'
                            ? 'bg-amber-50 text-amber-600'
<<<<<<< HEAD
                            : 'bg-slate-100 text-slate-400'
=======
                            : 'bg-bg-surface2 text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      {(p as any).status || 'active'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-50">
                      <span>Data Completeness</span>
                      <span>{(p as any).completeness || 100}%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(p as any).completeness || 100}%` }}
                        className={cn(
                          'h-full',
<<<<<<< HEAD
                          ((p as any).completeness || 100) > 90 ? 'bg-emerald-500' : 'bg-indigo-500'
=======
                          ((p as any).completeness || 100) > 90
                            ? 'bg-emerald-500'
                            : 'bg-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedProduct ? (
              <motion.div
                key={selectedProduct.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
<<<<<<< HEAD
                <Card className="rounded-xl border-none bg-white p-3 shadow-2xl shadow-slate-200/50">
                  <div className="mb-10 flex items-center justify-between">
                    <div className="flex flex-col">
                      <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
                        {selectedProduct.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                          {selectedProduct.sku}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-bold uppercase text-slate-400">
=======
                <Card className="rounded-xl border-none bg-white p-3 shadow-2xl shadow-md">
                  <div className="mb-10 flex items-center justify-between">
                    <div className="flex flex-col">
                      <h3 className="text-text-primary text-base font-black uppercase tracking-tight">
                        {selectedProduct.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-accent-primary text-[10px] font-black uppercase tracking-widest">
                          {selectedProduct.sku}
                        </span>
                        <span className="bg-border-subtle h-1 w-1 rounded-full" />
                        <span className="text-text-muted text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                          Last updated: {selectedProduct.lastEdit}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
<<<<<<< HEAD
                        className="h-12 w-12 rounded-xl border-slate-100"
                      >
                        <Copy className="h-5 w-5 text-slate-400" />
=======
                        className="border-border-subtle h-12 w-12 rounded-xl"
                      >
                        <Copy className="text-text-muted h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
<<<<<<< HEAD
                        className="h-12 w-12 rounded-xl border-slate-100"
                      >
                        <ExternalLink className="h-5 w-5 text-slate-400" />
                      </Button>
                      <Button className="h-12 gap-2 rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white">
=======
                        className="border-border-subtle h-12 w-12 rounded-xl"
                      >
                        <ExternalLink className="text-text-muted h-5 w-5" />
                      </Button>
                      <Button className="bg-text-primary h-12 gap-2 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest text-white">
>>>>>>> recover/cabinet-wip-from-stash
                        Save Changes
                      </Button>
                    </div>
                  </div>

<<<<<<< HEAD
                  <div className="mb-10 flex items-center gap-2 rounded-2xl bg-slate-100 p-1">
=======
                  <div className="bg-bg-surface2 mb-10 flex items-center gap-2 rounded-2xl p-1">
>>>>>>> recover/cabinet-wip-from-stash
                    {[
                      { id: 'info', label: 'Basic Info', icon: FileText },
                      { id: 'variants', label: 'Variants & ATS', icon: Layers },
                      { id: 'media', label: 'Media & 3D', icon: ImageIcon },
                      { id: 'specs', label: 'Tech Specs', icon: Zap },
                      { id: 'sustainability', label: 'Eco Ledger', icon: Droplets },
                      { id: 'history', label: 'Versioning', icon: History },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all',
                          activeTab === tab.id
<<<<<<< HEAD
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
=======
                            ? 'text-text-primary bg-white shadow-sm'
                            : 'text-text-muted hover:text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                      >
                        <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="min-h-[400px]">
                    {activeTab === 'info' && <PIMInfoTab selectedProduct={selectedProduct} />}
                    {activeTab === 'variants' && (
                      <PIMVariantsTab selectedProduct={selectedProduct} />
                    )}
                    {activeTab === 'media' && <PIMMediaTab selectedProduct={selectedProduct} />}
                    {activeTab === 'specs' && <PIMSpecsTab selectedProduct={selectedProduct} />}
                    {activeTab === 'sustainability' && (
                      <div className="space-y-4 text-left animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-6">
<<<<<<< HEAD
                            <h4 className="text-base font-black uppercase tracking-tight text-slate-900">
=======
                            <h4 className="text-text-primary text-base font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                              Traceability Map
                            </h4>
                            <div className="space-y-4">
                              {[
                                { node: 'Raw Graphene', loc: 'Seoul, KR', type: 'Origin' },
                                { node: 'Membrane Weaving', loc: 'Osaka, JP', type: 'Processing' },
                                { node: 'Final Assembly', loc: 'Milan, IT', type: 'Production' },
                              ].map((step, i) => (
                                <div
                                  key={i}
<<<<<<< HEAD
                                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
=======
                                  className="border-border-subtle flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
                                >
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-black text-emerald-600">
                                    {i + 1}
                                  </div>
                                  <div className="flex-1">
<<<<<<< HEAD
                                    <p className="text-[10px] font-black uppercase text-slate-900">
                                      {step.node}
                                    </p>
                                    <p className="text-[8px] font-bold uppercase text-slate-400">
=======
                                    <p className="text-text-primary text-[10px] font-black uppercase">
                                      {step.node}
                                    </p>
                                    <p className="text-text-muted text-[8px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                      {step.loc}
                                    </p>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="border-emerald-100 text-[7px] text-emerald-600"
                                  >
                                    {step.type}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                          <Card className="relative space-y-6 overflow-hidden rounded-xl border-none bg-emerald-900 p-3 text-white shadow-xl">
                            <div className="absolute bottom-0 right-0 p-4 opacity-10">
                              <Droplets className="h-32 w-32" />
                            </div>
                            <div className="relative z-10 space-y-4">
                              <h4 className="text-sm font-black uppercase leading-none tracking-tight text-emerald-400">
                                Digital Eco-Passport
                              </h4>
                              <p className="text-[10px] font-medium uppercase leading-relaxed tracking-widest text-emerald-100/60">
                                Verified data for ESG reporting and consumer transparency.
                              </p>
                              <div className="space-y-3 border-t border-emerald-800 pt-4">
                                {[
                                  { l: 'Carbon Footprint', v: '4.2 kg CO2e' },
                                  { l: 'Water Recycled', v: '85%' },
                                  { l: 'Circular Score', v: 'A+' },
                                ].map((s, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between text-[10px] font-black uppercase"
                                  >
                                    <span className="text-emerald-400">{s.l}</span>
                                    <span>{s.v}</span>
                                  </div>
                                ))}
                              </div>
                              <Button className="mt-4 h-12 w-full rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest text-emerald-900 shadow-xl">
                                Generate ESG Report
                              </Button>
                            </div>
                          </Card>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ) : (
<<<<<<< HEAD
              <div className="flex h-full flex-col items-center justify-center space-y-6 rounded-xl border border-dashed border-slate-200 bg-white p-20 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
                  <Database className="h-10 w-10 text-slate-200" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-400">
                    Select Style node
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
=======
              <div className="border-border-default flex h-full flex-col items-center justify-center space-y-6 rounded-xl border border-dashed bg-white p-20 text-center">
                <div className="bg-bg-surface2 flex h-20 w-20 items-center justify-center rounded-full">
                  <Database className="text-text-muted h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-text-muted text-base font-black uppercase tracking-tight">
                    Select Style node
                  </h3>
                  <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Choose a product to manage its content and technical data
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
