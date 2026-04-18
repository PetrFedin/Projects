'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { brands as allBrands } from '@/lib/placeholder-data';
import { products } from '@/lib/products';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  BarChart2,
  Users,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BrandFinancialsDialog, BrandFollowersDialog } from '@/components/admin';
import type { Brand } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';
import { RegistryPageShell } from '@/components/design-system';

export default function BrandsDirectoryPage() {
  const [brands, setBrands] = useState(allBrands);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [viewingFinancials, setViewingFinancials] = useState<Brand | null>(null);
  const [viewingFollowers, setViewingFollowers] = useState<Brand | null>(null);
  const [activeFilterGroup, setActiveFilterGroup] = useState<string | null>(null);

  const filterGroups = {
    '0-9': '0123456789'.split(''),
    'A-Z': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    'А-Я': 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split(''),
  };

  const handleFilterClick = (letter: string) => {
    setActiveLetter((prev) => (prev === letter ? null : letter));
  };

  const handleGroupClick = (group: string) => {
    setActiveFilterGroup((prev) => (prev === group ? null : group));
    setActiveLetter(null); // Reset letter filter when changing group
  };

  const filteredBrands = useMemo(() => {
    let tempBrands = [...brands];

    if (showOnlySelected && selectedBrands.size > 0) {
      tempBrands = tempBrands.filter((b) => selectedBrands.has(b.id));
    }

    if (searchQuery) {
      tempBrands = tempBrands.filter((b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeLetter) {
      tempBrands = tempBrands.filter((b) => {
        const nameToTest = b.name;
        return (
          nameToTest.toUpperCase().startsWith(activeLetter) ||
          (!isNaN(parseInt(activeLetter, 10)) && nameToTest.startsWith(activeLetter))
        );
      });
    }

    return tempBrands;
  }, [brands, searchQuery, activeLetter, selectedBrands, showOnlySelected]);

  const handleSelectBrand = (brandId: string) => {
    setSelectedBrands((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(brandId)) {
        newSet.delete(brandId);
      } else {
        newSet.add(brandId);
      }
      return newSet;
    });
  };

  const isAllSelected = filteredBrands.length > 0 && selectedBrands.size === filteredBrands.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedBrands(new Set());
    } else {
      setSelectedBrands(new Set(filteredBrands.map((b) => b.id)));
    }
  };

  const getTierVariant = (tier?: 'Free' | 'Pro' | 'Elite') => {
    switch (tier) {
      case 'Pro':
        return 'default';
      case 'Elite':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <>
<<<<<<< HEAD
      <div className="container mx-auto max-w-5xl space-y-4 px-4 py-4 pb-24 duration-700 animate-in fade-in">
        <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-end">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <span>Admin</span>
              <ChevronRight className="h-2 w-2" />
              <span className="text-slate-300">Brands Directory</span>
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-headline text-base font-bold uppercase leading-none tracking-tighter text-slate-900">
=======
      <RegistryPageShell className="max-w-5xl space-y-4 pb-16 duration-700 animate-in fade-in">
        <div className="border-border-subtle flex flex-col items-start justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
          <div className="space-y-0.5">
            <div className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]">
              <span>Admin</span>
              <ChevronRight className="h-2 w-2" />
              <span className="text-text-muted">Brands Directory</span>
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-text-primary font-headline text-base font-bold uppercase leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                Partners Ecosystem
              </h1>
              <Badge
                variant="outline"
<<<<<<< HEAD
                className="h-4 gap-1 border-indigo-100 bg-indigo-50 px-1.5 text-[7px] font-bold tracking-widest text-indigo-600 shadow-sm transition-all"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" /> TOTAL:{' '}
=======
                className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 h-4 gap-1 px-1.5 text-[7px] font-bold tracking-widest shadow-sm transition-all"
              >
                <span className="bg-accent-primary h-1.5 w-1.5 animate-pulse rounded-full" /> TOTAL:{' '}
>>>>>>> recover/cabinet-wip-from-stash
                {brands.length}
              </Badge>
            </div>
          </div>
<<<<<<< HEAD
          <Button className="h-8 gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-indigo-600">
=======
          <Button className="bg-text-primary hover:bg-accent-primary border-text-primary h-8 gap-1.5 rounded-lg border px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all">
>>>>>>> recover/cabinet-wip-from-stash
            <PlusCircle className="h-3.5 w-3.5" /> Add Brand Entity
          </Button>
        </div>

        <div className="space-y-4">
          {/* Toolbar & Filters */}
<<<<<<< HEAD
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
            <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
              <div className="flex shrink-0 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
=======
          <div className="bg-bg-surface2 border-border-default flex items-center justify-between rounded-xl border p-1 shadow-inner">
            <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
              <div className="border-border-default flex shrink-0 rounded-lg border bg-white p-1 shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
                {Object.keys(filterGroups).map((groupName) => (
                  <button
                    key={groupName}
                    onClick={() => handleGroupClick(groupName)}
                    className={cn(
                      'h-6.5 shrink-0 rounded-md px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all',
                      activeFilterGroup === groupName
<<<<<<< HEAD
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:text-slate-900'
=======
                        ? 'bg-text-primary border-text-primary text-white'
                        : 'text-text-muted border-border-subtle hover:border-border-default hover:text-text-primary bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    {groupName}
                  </button>
                ))}
              </div>
<<<<<<< HEAD
              <div className="mx-0.5 h-4 w-[1px] shrink-0 bg-slate-200" />
              <div className="h-8.5 flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 shadow-sm">
=======
              <div className="bg-border-subtle mx-0.5 h-4 w-[1px] shrink-0" />
              <div className="border-border-default h-8.5 flex shrink-0 items-center gap-2 rounded-lg border bg-white px-3 shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
                <Switch
                  id="show-selected"
                  checked={showOnlySelected}
                  onCheckedChange={setShowOnlySelected}
                  disabled={selectedBrands.size === 0}
<<<<<<< HEAD
                  className="scale-75 data-[state=checked]:bg-indigo-600"
                />
                <Label
                  htmlFor="show-selected"
                  className="cursor-pointer text-[9px] font-bold uppercase tracking-widest text-slate-400"
=======
                  className="data-[state=checked]:bg-accent-primary scale-75"
                />
                <Label
                  htmlFor="show-selected"
                  className="text-text-muted cursor-pointer text-[9px] font-bold uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  Selected ({selectedBrands.size})
                </Label>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 px-1">
              <div className="group relative">
<<<<<<< HEAD
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
                <Input
                  placeholder="Filter by Name..."
                  className="h-7 w-32 rounded-lg border-slate-200 bg-white pl-8 text-[10px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 focus:ring-indigo-500 md:w-48"
=======
                <Search className="text-text-muted group-focus-within:text-accent-primary absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors" />
                <Input
                  placeholder="Filter by Name..."
                  className="border-border-default focus:ring-accent-primary h-7 w-32 rounded-lg bg-white pl-8 text-[10px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 md:w-48"
>>>>>>> recover/cabinet-wip-from-stash
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {activeFilterGroup && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: -8 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 0 }}
                exit={{ height: 0, opacity: 0, marginTop: -8 }}
<<<<<<< HEAD
                className="overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-sm"
=======
                className="border-border-subtle overflow-hidden rounded-xl border bg-white p-1.5 shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <div className="flex flex-wrap gap-1">
                  {(filterGroups[activeFilterGroup as keyof typeof filterGroups] || []).map(
                    (letter) => (
                      <Button
                        key={letter}
                        variant={activeLetter === letter ? 'default' : 'ghost'}
                        size="sm"
                        className={cn(
                          'h-7 w-7 rounded-lg p-0 text-[10px] font-bold transition-all',
                          activeLetter === letter
<<<<<<< HEAD
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                            : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'
=======
                            ? 'bg-accent-primary shadow-accent-primary/10 text-white shadow-md'
                            : 'text-text-muted hover:bg-bg-surface2 hover:text-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                        onClick={() => handleFilterClick(letter)}
                      >
                        {letter}
                      </Button>
                    )
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

<<<<<<< HEAD
          <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100/50">
            <div className="flex gap-2 border-b border-slate-100 bg-slate-50/50 p-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 rounded-lg border-slate-200 bg-white px-3 text-[8px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:border-indigo-100 hover:text-indigo-600"
                asChild
              >
                <a href="/admin/quality">
                  <ShieldCheck className="mr-1.5 h-3 w-3 text-indigo-500" /> Quality Control (BPI)
=======
          <Card className="border-border-subtle hover:border-accent-primary/20 overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
            <div className="bg-bg-surface2/80 border-border-subtle flex gap-2 border-b p-2">
              <Button
                variant="outline"
                size="sm"
                className="border-border-default text-text-secondary hover:text-accent-primary hover:border-accent-primary/20 h-7 rounded-lg bg-white px-3 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all"
                asChild
              >
                <a href={ROUTES.admin.quality}>
                  <ShieldCheck className="text-accent-primary mr-1.5 h-3 w-3" /> Quality Control
                  (BPI)
>>>>>>> recover/cabinet-wip-from-stash
                </a>
              </Button>
            </div>
            <Table>
              <TableHeader>
<<<<<<< HEAD
                <TableRow className="border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
=======
                <TableRow className="bg-bg-surface2/80 hover:bg-bg-surface2/80 border-border-subtle border-b">
>>>>>>> recover/cabinet-wip-from-stash
                  <TableHead className="w-[40px] px-4">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      className="scale-75"
                    />
                  </TableHead>
<<<<<<< HEAD
                  <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Brand Identity
                  </TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Network
                  </TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Start Date
                  </TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Tier
                  </TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Styles
                  </TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Status
                  </TableHead>
                  <TableHead className="h-10 w-24 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
=======
                  <TableHead className="text-text-muted h-10 text-[9px] font-bold uppercase tracking-[0.2em]">
                    Brand Identity
                  </TableHead>
                  <TableHead className="text-text-muted h-10 text-[9px] font-bold uppercase tracking-[0.2em]">
                    Network
                  </TableHead>
                  <TableHead className="text-text-muted h-10 text-[9px] font-bold uppercase tracking-[0.2em]">
                    Start Date
                  </TableHead>
                  <TableHead className="text-text-muted h-10 text-[9px] font-bold uppercase tracking-[0.2em]">
                    Tier
                  </TableHead>
                  <TableHead className="text-text-muted h-10 text-[9px] font-bold uppercase tracking-[0.2em]">
                    Styles
                  </TableHead>
                  <TableHead className="text-text-muted h-10 text-[9px] font-bold uppercase tracking-[0.2em]">
                    Status
                  </TableHead>
                  <TableHead className="text-text-muted h-10 w-24 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
<<<<<<< HEAD
              <TableBody className="divide-y divide-slate-50">
=======
              <TableBody className="divide-border-subtle divide-y">
>>>>>>> recover/cabinet-wip-from-stash
                {filteredBrands.map((brand) => {
                  const productCount = products.filter((p) => p.brand === brand.name).length;
                  return (
                    <TableRow
                      key={brand.id}
                      data-state={selectedBrands.has(brand.id) ? 'selected' : ''}
<<<<<<< HEAD
                      className="group h-12 transition-all hover:bg-slate-50/50"
=======
                      className="hover:bg-bg-surface2/80 group h-12 transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      <TableCell className="px-4">
                        <Checkbox
                          checked={selectedBrands.has(brand.id)}
                          onCheckedChange={() => handleSelectBrand(brand.id)}
                          className="scale-75"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
<<<<<<< HEAD
                          <div className="relative h-8 w-8 rounded-lg border border-slate-100 bg-white p-1 shadow-sm transition-transform group-hover:scale-110">
=======
                          <div className="border-border-subtle relative h-8 w-8 rounded-lg border bg-white p-1 shadow-sm transition-transform group-hover:scale-110">
>>>>>>> recover/cabinet-wip-from-stash
                            <Image
                              src={brand.logo.url}
                              alt={brand.logo.alt}
                              fill
                              className="object-contain"
                            />
                          </div>
<<<<<<< HEAD
                          <span className="max-w-[140px] truncate text-[11px] font-bold uppercase leading-none tracking-tight text-slate-900">
=======
                          <span className="text-text-primary max-w-[140px] truncate text-[11px] font-bold uppercase leading-none tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                            {brand.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
<<<<<<< HEAD
                          className="h-auto p-0 text-[10px] font-bold uppercase tabular-nums tracking-widest text-indigo-600 decoration-indigo-200 hover:underline"
=======
                          className="text-accent-primary decoration-accent-primary/30 h-auto p-0 text-[10px] font-bold uppercase tabular-nums tracking-widest hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                          onClick={() => setViewingFollowers(brand)}
                        >
                          {brand.followers.toLocaleString('ru-RU')}
                        </Button>
                      </TableCell>
<<<<<<< HEAD
                      <TableCell className="text-[10px] font-bold uppercase tabular-nums tracking-tight text-slate-400">
=======
                      <TableCell className="text-text-muted text-[10px] font-bold uppercase tabular-nums tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                        {brand.startDate
                          ? format(new Date(brand.startDate), 'dd MMM yyyy', { locale: ru })
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            'h-3.5 rounded border px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all',
                            brand.subscriptionTier === 'Elite'
<<<<<<< HEAD
                              ? 'border-indigo-100 bg-indigo-50 text-indigo-600'
                              : brand.subscriptionTier === 'Pro'
                                ? 'border-blue-100 bg-blue-50 text-blue-600'
                                : 'border-slate-100 bg-slate-50 text-slate-400'
=======
                              ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20'
                              : brand.subscriptionTier === 'Pro'
                                ? 'border-blue-100 bg-blue-50 text-blue-600'
                                : 'bg-bg-surface2 text-text-muted border-border-subtle'
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        >
                          {brand.subscriptionTier}
                        </Badge>
                      </TableCell>
<<<<<<< HEAD
                      <TableCell className="text-[10px] font-bold tabular-nums text-slate-900">
=======
                      <TableCell className="text-text-primary text-[10px] font-bold tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                        {productCount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="h-3.5 rounded border-emerald-100 bg-emerald-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm"
                        >
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 transition-all group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
<<<<<<< HEAD
                            className="h-7 w-7 rounded-lg text-slate-400 transition-all hover:bg-slate-900 hover:text-white"
=======
                            className="hover:bg-text-primary/90 text-text-muted h-7 w-7 rounded-lg transition-all hover:text-white"
>>>>>>> recover/cabinet-wip-from-stash
                            onClick={() => setViewingFinancials(brand)}
                          >
                            <BarChart2 className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
<<<<<<< HEAD
                                className="h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-100"
=======
                                className="text-text-muted hover:bg-bg-surface2 h-7 w-7 rounded-lg"
>>>>>>> recover/cabinet-wip-from-stash
                              >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="text-[10px] font-bold uppercase tracking-widest"
                            >
                              <DropdownMenuItem className="gap-2">Edit Entity</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setViewingFollowers(brand)}
                                className="gap-2"
                              >
                                <Users className="h-3 w-3" /> Followers
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-600">
                                Deactivate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
<<<<<<< HEAD
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
=======
            <div className="bg-bg-surface2/80 border-border-subtle flex items-center justify-between border-t px-4 py-2">
              <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest opacity-60">
>>>>>>> recover/cabinet-wip-from-stash
                Displaying {filteredBrands.length} of {brands.length} partners
              </span>
              <div className="flex gap-1">
                <button
<<<<<<< HEAD
                  className="h-6 rounded-md border border-slate-200 bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest text-slate-400 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
=======
                  className="border-border-default text-text-muted hover:bg-bg-surface2 h-6 rounded-md border bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all disabled:opacity-50"
>>>>>>> recover/cabinet-wip-from-stash
                  disabled
                >
                  PREV
                </button>
<<<<<<< HEAD
                <button className="h-6 rounded-md border border-slate-200 bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:bg-slate-50">
=======
                <button className="border-border-default text-text-secondary hover:bg-bg-surface2 h-6 rounded-md border bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                  NEXT
                </button>
              </div>
            </div>
          </Card>
        </div>
<<<<<<< HEAD
      </div>
=======
      </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
      {viewingFinancials && (
        <BrandFinancialsDialog
          brand={viewingFinancials}
          isOpen={!!viewingFinancials}
          onOpenChange={(open) => !open && setViewingFinancials(null)}
        />
      )}
      {viewingFollowers && (
        <BrandFollowersDialog
          brand={viewingFollowers}
          isOpen={!!viewingFollowers}
          onOpenChange={(open) => !open && setViewingFollowers(null)}
        />
      )}
    </>
  );
}
