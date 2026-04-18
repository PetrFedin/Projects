'use client';

import { RegistryPageShell } from '@/components/design-system/registry-page-shell';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Promotion, PromotionStatus, PromotionType } from '@/lib/types';
import { format, isWithinInterval } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  BarChart2,
  XCircle,
  Archive,
  ArchiveRestore,
  Play,
  Pause,
  Calendar as CalendarIcon,
  X,
  Search,
  PlusCircle,
  TrendingUp,
  Gavel,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Combobox } from '@/components/ui/combobox';
import { PromotionAnalyticsDialog, AppealPromotionDialog } from '@/components/admin';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { mockPromotions } from '@/lib/data/mock-promotions';

const statusConfig: Record<PromotionStatus, { label: string; variant: any; className?: string }> = {
  active: { label: 'Активна', variant: 'default', className: 'bg-green-500/80' },
  pending: { label: 'В ожидании', variant: 'secondary', className: 'bg-yellow-500/80' },
  frozen: { label: 'Заморожена', variant: 'secondary', className: 'bg-blue-500/80 text-white' },
  archived: { label: 'Завершена', variant: 'outline' },
  rejected: { label: 'Отклонена', variant: 'destructive' },
  unpublished: { label: 'Снята', variant: 'outline', className: 'bg-gray-200 text-gray-800' },
  appealed: {
    label: 'На обжаловании',
    variant: 'secondary',
<<<<<<< HEAD
    className: 'bg-purple-500/80 text-white',
=======
    className: 'bg-accent-primary/80 text-white',
>>>>>>> recover/cabinet-wip-from-stash
  },
};

const typeConfig: Record<PromotionType, string> = {
  catalog_boost: 'Буст в каталоге',
  homepage_banner: 'Баннер на главной',
  stories_feature: 'Промо в историях',
  email_blast: 'Email-рассылка',
  shoppable_video: 'Shoppable Video',
  shop_the_look: 'Продвижение образа',
  live_shopping_event: 'Live Shopping',
  ugc_sponsorship: 'Спонсорство UGC',
  kickstarter_boost: 'Kickstarter / предзаказ',
  outlet_boost: 'Буст в аутлете',
};

const statusOptions = Object.entries(statusConfig).map(([key, value]) => ({
  value: key,
  label: value.label,
}));
const brandOptions = [...new Set(mockPromotions.map((p) => p.brandName))].map((brand) => ({
  value: brand,
  label: brand,
}));
const typeOptions = Object.entries(typeConfig).map(([key, value]) => ({
  value: key,
  label: value,
}));

export default function PromotionsPage() {
  const isBrandView = false;
  const router = useRouter();
  const [promotions, setPromotions] = useState(
<<<<<<< HEAD
    isBrandView ? mockPromotions.filter((p) => p.brandName === 'Syntha') : mockPromotions
=======
    isBrandView ? mockPromotions.filter((p) => p.brandName === 'Syntha Lab') : mockPromotions
>>>>>>> recover/cabinet-wip-from-stash
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    'active',
    'pending',
    'frozen',
    'appealed',
  ]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedPromotionForAnalytics, setSelectedPromotionForAnalytics] =
    useState<Promotion | null>(null);
  const [appealingPromotion, setAppealingPromotion] = useState<Promotion | null>(null);

  const filteredPromotions = useMemo(() => {
    return promotions.filter((p) => {
      const searchMatch =
        searchQuery === '' || p.productName.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(p.status);
      const brandMatch =
        isBrandView || selectedBrands.length === 0 || selectedBrands.includes(p.brandName);
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(p.type);
      const dateMatch =
        !dateRange?.from ||
        isWithinInterval(new Date(p.startDate), {
          start: dateRange.from,
          end: dateRange.to || dateRange.from,
        });

      return searchMatch && statusMatch && brandMatch && dateMatch && typeMatch;
    });
  }, [
    promotions,
    searchQuery,
    selectedStatuses,
    selectedBrands,
    selectedTypes,
    dateRange,
    isBrandView,
  ]);

  const handleStatusChange = (
    id: string,
    newStatus: PromotionStatus,
    source: 'admin' | 'brand' | 'system' = 'admin'
  ) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus, source } : p))
    );
  };

  const handleBulkAction = (action: PromotionStatus) => {
    setPromotions((prev) =>
      prev.map((p) => (selectedRows.has(p.id) ? { ...p, status: action, source: 'admin' } : p))
    );
    setSelectedRows(new Set());
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredPromotions.map((p) => p.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const openAnalytics = (promotion: Promotion) => {
    setSelectedPromotionForAnalytics(promotion);
  };

  const handleAppeal = (promo: Promotion, reason: string) => {
    handleStatusChange(promo.id, 'appealed', 'brand');
  };

  return (
    <TooltipProvider>
      <RegistryPageShell className="max-w-5xl space-y-4 py-4 duration-700 animate-in fade-in">
        {!isBrandView && (
<<<<<<< HEAD
          <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-end">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <span>Admin</span>
                <ChevronRight className="h-2 w-2" />
                <span className="text-slate-300">Campaign Manager</span>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-headline text-base font-bold uppercase leading-none tracking-tighter text-slate-900">
=======
          <div className="border-border-subtle flex flex-col items-start justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
            <div className="space-y-0.5">
              <div className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]">
                <span>Admin</span>
                <ChevronRight className="h-2 w-2" />
                <span className="text-text-muted">Campaign Manager</span>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-text-primary font-headline text-base font-bold uppercase leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                  Promotion Hub 2.0
                </h1>
                <Badge
                  variant="outline"
<<<<<<< HEAD
                  className="h-4 gap-1 border-indigo-100 bg-indigo-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-indigo-600 shadow-sm transition-all"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" /> LIVE
=======
                  className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 h-4 gap-1 px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all"
                >
                  <span className="bg-accent-primary h-1.5 w-1.5 animate-pulse rounded-full" /> LIVE
>>>>>>> recover/cabinet-wip-from-stash
                  ENGINE
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
<<<<<<< HEAD
                className="h-8 rounded-lg border-slate-200 px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all hover:bg-slate-50"
                onClick={() => router.push('/admin/appeals')}
=======
                className="border-border-default hover:bg-bg-surface2 h-8 rounded-lg px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
                onClick={() => router.push(ROUTES.admin.appeals)}
>>>>>>> recover/cabinet-wip-from-stash
              >
                <Gavel className="mr-1.5 h-3.5 w-3.5 text-rose-500" />
                Appeals{' '}
                <Badge
                  variant="secondary"
                  className="ml-1.5 h-4 border-rose-100 bg-rose-50 px-1 text-[8px] font-bold text-rose-600"
                >
                  1
                </Badge>
              </Button>
              <Button
<<<<<<< HEAD
                className="h-8 gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-indigo-600"
                onClick={() => router.push('/admin/promotions/calendar')}
=======
                className="bg-text-primary hover:bg-accent-primary border-text-primary h-8 gap-1.5 rounded-lg border px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all"
                onClick={() => router.push(ROUTES.admin.promotionsCalendar)}
>>>>>>> recover/cabinet-wip-from-stash
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                Strategy Map
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Toolbar & Filters */}
<<<<<<< HEAD
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
            <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
              <div className="group relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
                <Input
                  placeholder="Filter by Name..."
                  className="h-7 w-32 rounded-lg border-slate-200 bg-white pl-8 text-[10px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 focus:ring-indigo-500 md:w-48"
=======
          <div className="bg-bg-surface2 border-border-default flex items-center justify-between rounded-xl border p-1 shadow-inner">
            <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
              <div className="group relative">
                <Search className="text-text-muted group-focus-within:text-accent-primary absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors" />
                <Input
                  placeholder="Filter by Name..."
                  className="border-border-default focus:ring-accent-primary h-7 w-32 rounded-lg bg-white pl-8 text-[10px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 md:w-48"
>>>>>>> recover/cabinet-wip-from-stash
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
<<<<<<< HEAD
              <div className="mx-0.5 h-4 w-[1px] shrink-0 bg-slate-200" />
=======
              <div className="bg-border-subtle mx-0.5 h-4 w-[1px] shrink-0" />
>>>>>>> recover/cabinet-wip-from-stash
              <div className="flex shrink-0 items-center gap-1.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
<<<<<<< HEAD
                      className="h-7 rounded-lg border-slate-200 bg-white px-2.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:text-slate-900"
=======
                      className="border-border-default text-text-secondary hover:text-text-primary h-7 rounded-lg bg-white px-2.5 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      <CalendarIcon className="mr-1.5 h-3 w-3" />
                      {dateRange?.from ? 'Active Range' : 'Temporal Filter'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      locale={ru}
                      className="rounded-xl border-none shadow-2xl"
                    />
                  </PopoverContent>
                </Popover>
                {!isBrandView && (
                  <Combobox
                    options={brandOptions}
                    value={selectedBrands}
                    onChange={(value) => setSelectedBrands((value as string[]) || [])}
                    multiple
                    placeholder="Brands"
                    className="h-7 w-28 text-[9px] font-bold uppercase tracking-widest md:w-32"
                  />
                )}
                <Combobox
                  options={typeOptions}
                  value={selectedTypes}
                  onChange={(value) => setSelectedTypes((value as string[]) || [])}
                  multiple
                  placeholder="Module"
                  className="h-7 w-28 text-[9px] font-bold uppercase tracking-widest md:w-32"
                />
                <Combobox
                  options={statusOptions}
                  value={selectedStatuses}
                  onChange={(value) => setSelectedStatuses((value as string[]) || [])}
                  multiple
                  placeholder="Lifecycle"
                  className="h-7 w-32 text-[9px] font-bold uppercase tracking-widest md:w-40"
                />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 px-1">
              {!isBrandView && selectedRows.size > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
<<<<<<< HEAD
                    <Button className="h-7 gap-1.5 rounded-lg border border-indigo-500 bg-indigo-600 px-3 text-[9px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-indigo-700">
=======
                    <Button className="bg-accent-primary hover:bg-accent-primary border-accent-primary h-7 gap-1.5 rounded-lg border px-3 text-[9px] font-bold uppercase tracking-widest text-white shadow-md transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                      Batch Ops ({selectedRows.size}) <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="text-[10px] font-bold uppercase tracking-widest"
                  >
                    <DropdownMenuItem onClick={() => handleBulkAction('active')}>
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('rejected')}>
                      Reject
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('frozen')}>
                      Freeze
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-rose-600"
                      onClick={() => handleBulkAction('archived')}
                    >
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

<<<<<<< HEAD
          <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100/50">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
=======
          <Card className="border-border-subtle hover:border-accent-primary/20 overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
            <Table>
              <TableHeader>
                <TableRow className="bg-bg-surface2/80 hover:bg-bg-surface2/80 border-border-subtle border-b">
>>>>>>> recover/cabinet-wip-from-stash
                  {!isBrandView && (
                    <TableHead className="w-[40px] px-4">
                      <Checkbox
                        checked={
                          selectedRows.size > 0 && selectedRows.size === filteredPromotions.length
                        }
                        onCheckedChange={(checked) => handleSelectAll(!!checked)}
                        className="scale-75"
                      />
                    </TableHead>
                  )}
<<<<<<< HEAD
                  <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Campaign Entity
                  </TableHead>
                  {!isBrandView && (
                    <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Partner
                    </TableHead>
                  )}
                  <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Segment
                  </TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Window
                  </TableHead>
                  <TableHead className="h-10 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Views
                  </TableHead>
                  <TableHead className="h-10 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    CTR
                  </TableHead>
                  <TableHead className="h-10 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    ROAS
                  </TableHead>
                  <TableHead className="h-10 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Status
                  </TableHead>
                  <TableHead className="h-10 w-24 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
=======
                  <TableHead className="text-text-muted h-10 text-[9px] font-bold uppercase tracking-[0.2em]">
                    Campaign Entity
                  </TableHead>
                  {!isBrandView && (
                    <TableHead className="text-text-muted h-10 text-[9px] font-bold uppercase tracking-[0.2em]">
                      Partner
                    </TableHead>
                  )}
                  <TableHead className="text-text-muted h-10 text-[9px] font-bold uppercase tracking-[0.2em]">
                    Segment
                  </TableHead>
                  <TableHead className="text-text-muted h-10 text-[9px] font-bold uppercase tracking-[0.2em]">
                    Window
                  </TableHead>
                  <TableHead className="text-text-muted h-10 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
                    Views
                  </TableHead>
                  <TableHead className="text-text-muted h-10 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
                    CTR
                  </TableHead>
                  <TableHead className="text-text-muted h-10 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
                    ROAS
                  </TableHead>
                  <TableHead className="text-text-muted h-10 text-center text-[9px] font-bold uppercase tracking-[0.2em]">
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
                {filteredPromotions.map((promo) => (
                  <TableRow
                    key={promo.id}
                    data-state={selectedRows.has(promo.id) ? 'selected' : ''}
<<<<<<< HEAD
                    className="group h-12 transition-all hover:bg-slate-50/50"
=======
                    className="hover:bg-bg-surface2/80 group h-12 transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    {!isBrandView && (
                      <TableCell className="px-4">
                        <Checkbox
                          checked={selectedRows.has(promo.id)}
                          onCheckedChange={() => handleSelectRow(promo.id)}
                          className="scale-75"
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex flex-col">
<<<<<<< HEAD
                        <span className="mb-1 max-w-[180px] truncate text-[11px] font-bold uppercase leading-none tracking-tight text-slate-900">
                          {promo.productName}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400 opacity-60">
=======
                        <span className="text-text-primary mb-1 max-w-[180px] truncate text-[11px] font-bold uppercase leading-none tracking-tight">
                          {promo.productName}
                        </span>
                        <span className="text-text-muted text-[8px] font-bold uppercase tracking-[0.15em] opacity-60">
>>>>>>> recover/cabinet-wip-from-stash
                          ID: {promo.productId}
                        </span>
                      </div>
                    </TableCell>
                    {!isBrandView && (
                      <TableCell>
<<<<<<< HEAD
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
=======
                        <span className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          {promo.brandName}
                        </span>
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge
                        variant="outline"
<<<<<<< HEAD
                        className="h-4 border-slate-200 bg-slate-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-slate-500"
=======
                        className="bg-bg-surface2 text-text-secondary border-border-default h-4 px-1.5 text-[7px] font-bold uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        {typeConfig[promo.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
<<<<<<< HEAD
                      <span className="text-[10px] font-bold uppercase tabular-nums text-slate-400">
=======
                      <span className="text-text-muted text-[10px] font-bold uppercase tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                        {format(new Date(promo.startDate), 'dd MMM', { locale: ru })} -{' '}
                        {format(new Date(promo.endDate), 'dd MMM', { locale: ru })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
<<<<<<< HEAD
                      <span className="text-[11px] font-bold tabular-nums text-slate-900">
=======
                      <span className="text-text-primary text-[11px] font-bold tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                        {promo.metrics?.views.toLocaleString('ru-RU')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
<<<<<<< HEAD
                      <span className="text-[11px] font-bold tabular-nums text-indigo-600">
=======
                      <span className="text-accent-primary text-[11px] font-bold tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                        {promo.metrics?.ctr}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          'text-[11px] font-bold italic tabular-nums tracking-tighter',
                          promo.metrics && promo.metrics.roi < 100
                            ? 'text-rose-600'
                            : 'text-emerald-600'
                        )}
                      >
                        {promo.metrics?.roi}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className={cn(
                              'h-3.5 rounded border px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all',
                              promo.status === 'active'
                                ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                                : promo.status === 'pending'
                                  ? 'border-amber-100 bg-amber-50 text-amber-600'
                                  : promo.status === 'frozen'
                                    ? 'border-blue-100 bg-blue-50 text-blue-600'
                                    : promo.status === 'rejected'
                                      ? 'border-rose-100 bg-rose-50 text-rose-600'
<<<<<<< HEAD
                                      : 'border-slate-100 bg-slate-50 text-slate-400'
=======
                                      : 'bg-bg-surface2 text-text-muted border-border-subtle'
>>>>>>> recover/cabinet-wip-from-stash
                            )}
                          >
                            {statusConfig[promo.status].label}
                          </Badge>
                        </TooltipTrigger>
                        {['frozen', 'rejected', 'unpublished'].includes(promo.status) && (
<<<<<<< HEAD
                          <TooltipContent className="border-none bg-slate-900 text-[8px] font-bold uppercase tracking-widest text-white">
=======
                          <TooltipContent className="bg-text-primary border-none text-[8px] font-bold uppercase tracking-widest text-white">
>>>>>>> recover/cabinet-wip-from-stash
                            <p>
                              Origin:{' '}
                              {promo.source === 'admin' ? 'Strategic Admin' : 'Partner Protocol'}
                            </p>
                          </TooltipContent>
                        )}
                      </Tooltip>
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
                          onClick={() => openAnalytics(promo)}
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
                            className="min-w-[160px] text-[10px] font-bold uppercase tracking-widest"
                          >
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => openAnalytics(promo)}
                            >
                              <BarChart2 className="h-3 w-3" /> Visual Analytics
                            </DropdownMenuItem>
                            {isBrandView && ['rejected', 'frozen'].includes(promo.status) && (
                              <DropdownMenuItem
                                className="gap-2 text-rose-600 focus:text-rose-600"
                                onClick={() => setAppealingPromotion(promo)}
                              >
                                <Gavel className="h-3 w-3" /> Appeal Protocol
                              </DropdownMenuItem>
                            )}
                            {!isBrandView && promo.status === 'pending' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="gap-2 text-emerald-600 focus:text-emerald-600"
                                  onClick={() => handleStatusChange(promo.id, 'active')}
                                >
                                  <TrendingUp className="h-3 w-3" /> Authorize
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="gap-2 text-rose-600 focus:text-rose-600"
                                  onClick={() => handleStatusChange(promo.id, 'rejected')}
                                >
                                  <XCircle className="h-3 w-3" /> Decline
                                </DropdownMenuItem>
                              </>
                            )}
                            {!isBrandView && promo.status === 'active' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="gap-2"
                                  onClick={() => handleStatusChange(promo.id, 'frozen')}
                                >
                                  <Pause className="h-3 w-3" /> Suspend
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="gap-2 text-rose-600 focus:text-rose-600"
                                  onClick={() => handleStatusChange(promo.id, 'unpublished')}
                                >
                                  <Archive className="h-3 w-3" /> Terminate
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
<<<<<<< HEAD
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
=======
            <div className="bg-bg-surface2/80 border-border-subtle flex items-center justify-between border-t px-4 py-2">
              <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest opacity-60">
>>>>>>> recover/cabinet-wip-from-stash
                Displaying {filteredPromotions.length} of {promotions.length} campaigns
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
      </RegistryPageShell>
      {selectedPromotionForAnalytics && (
        <PromotionAnalyticsDialog
          promotion={selectedPromotionForAnalytics}
          isOpen={!!selectedPromotionForAnalytics}
          onOpenChange={(open) => {
            if (!open) setSelectedPromotionForAnalytics(null);
          }}
        />
      )}
      {appealingPromotion && (
        <AppealPromotionDialog
          promotion={appealingPromotion}
          isOpen={!!appealingPromotion}
          onOpenChange={(open) => {
            if (!open) setAppealingPromotion(null);
          }}
          onAppeal={handleAppeal}
        />
      )}
    </TooltipProvider>
  );
}
