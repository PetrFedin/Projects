
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Promotion, PromotionStatus, PromotionType } from '@/lib/types';
import { format, isWithinInterval } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, BarChart2, XCircle, Archive, ArchiveRestore, Play, Pause, Calendar as CalendarIcon, X, Search, PlusCircle, TrendingUp, Gavel, ChevronRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Combobox } from '@/components/ui/combobox';
import { PromotionAnalyticsDialog, AppealPromotionDialog } from '@/components/admin';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const mockPromotions: Promotion[] = [
    { id: 'promo1', productName: 'Кашемировый свитер с круглым вырезом', productId: '1', targetType: 'products', brandName: 'Syntha', type: 'catalog_boost', startDate: '2024-08-01', endDate: '2024-08-08', budget: {value: 5000, model: 'cpm', bid: 300}, status: 'active', source: 'brand', metrics: { views: 12500, engagement: 18.2, ctr: 4.5, roi: 250 } },
    { id: 'promo2', productName: 'Вся коллекция FW24', productId: '2', targetType: 'categories', brandName: 'Syntha', type: 'homepage_banner', startDate: '2024-08-05', endDate: '2024-08-12', budget: {value: 10000, model: 'cpc', bid: 50}, status: 'pending', source: 'brand', metrics: { views: 0, engagement: 0, ctr: 0, roi: 0 } },
    { id: 'promo3', productName: 'Легендарный тренч', productId: '4', targetType: 'products', brandName: 'Syntha', type: 'catalog_boost', startDate: '2024-07-15', endDate: '2024-07-22', budget: {value: 7000, model: 'cpm', bid: 300}, status: 'archived', source: 'system', metrics: { views: 8200, engagement: 12.1, ctr: 2.1, roi: 80 }, evaluation: {
        aiSummary: 'Кампания показала высокий CTR (+25%), но низкую конверсию в покупки (ROAS 80%). Вероятно, цена оказалась выше ожиданий аудитории.',
        brandRating: [
            { metric: 'Рост просмотров', score: 5 },
            { metric: 'Вовлеченность', score: 4 },
            { metric: 'Продажи', score: 2 },
        ]
    }},
    { id: 'promo4', productName: 'Классическая джинсовая куртка', productId: '8', targetType: 'products', brandName: 'Syntha', type: 'outlet_boost', startDate: '2024-08-10', endDate: '2024-08-17', budget: {value: 2000, model: 'fixed'}, status: 'rejected', source: 'admin', metrics: { views: 0, engagement: 0, ctr: 0, roi: 0 } },
    { id: 'promo5', productName: 'Шелковое платье-миди', productId: '12', targetType: 'products', brandName: 'Syntha', type: 'stories_feature', startDate: '2024-06-01', endDate: '2024-06-08', budget: {value: 5000, model: 'fixed'}, status: 'unpublished', source: 'brand', metrics: { views: 25000, engagement: 25.0, ctr: 8.0, roi: 450 } },
    { id: 'promo6', productName: 'A.P.C. Весь бренд', productId: 'brand_apc', targetType: 'brand', brandName: 'A.P.C.', type: 'email_blast', startDate: '2024-08-10', endDate: '2024-08-20', budget: {value: 4000, model: 'fixed'}, status: 'frozen', source: 'admin', metrics: { views: 1500, engagement: 5.0, ctr: 1.5, roi: 120 } },
    { id: 'promo7', productName: 'Льняная рубашка', productId: '9', targetType: 'products', brandName: 'Syntha', type: 'catalog_boost', startDate: '2024-08-12', endDate: '2024-08-19', budget: {value: 3000, model: 'cpm', bid: 250}, status: 'appealed', source: 'brand', metrics: { views: 0, engagement: 0, ctr: 0, roi: 0 } },
];

const statusConfig: Record<PromotionStatus, { label: string; variant: any; className?: string }> = {
    active: { label: 'Активна', variant: 'default', className: 'bg-green-500/80' },
    pending: { label: 'В ожидании', variant: 'secondary', className: 'bg-yellow-500/80' },
    frozen: { label: 'Заморожена', variant: 'secondary', className: 'bg-blue-500/80 text-white' },
    archived: { label: 'Завершена', variant: 'outline' },
    rejected: { label: 'Отклонена', variant: 'destructive' },
    unpublished: { label: 'Снята', variant: 'outline', className: 'bg-gray-200 text-gray-800' },
    appealed: { label: 'На обжаловании', variant: 'secondary', className: 'bg-purple-500/80 text-white' },
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
    outlet_boost: 'Буст в аутлете',
};


const statusOptions = Object.entries(statusConfig).map(([key, value]) => ({ value: key, label: value.label }));
const brandOptions = [...new Set(mockPromotions.map(p => p.brandName))].map(brand => ({ value: brand, label: brand }));
const typeOptions = Object.entries(typeConfig).map(([key, value]) => ({ value: key, label: value }));


export default function PromotionsPage({ isBrandView = false }: { isBrandView?: boolean }) {
    const router = useRouter();
    const [promotions, setPromotions] = useState(isBrandView ? mockPromotions.filter(p => p.brandName === 'Syntha') : mockPromotions);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['active', 'pending', 'frozen', 'appealed']);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [selectedPromotionForAnalytics, setSelectedPromotionForAnalytics] = useState<Promotion | null>(null);
    const [appealingPromotion, setAppealingPromotion] = useState<Promotion | null>(null);
    
    const filteredPromotions = useMemo(() => {
        return promotions.filter(p => {
            const searchMatch = searchQuery === '' || p.productName.toLowerCase().includes(searchQuery.toLowerCase());
            const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(p.status);
            const brandMatch = isBrandView || selectedBrands.length === 0 || selectedBrands.includes(p.brandName);
            const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(p.type);
            const dateMatch = !dateRange?.from || isWithinInterval(new Date(p.startDate), {start: dateRange.from, end: dateRange.to || dateRange.from });
            
            return searchMatch && statusMatch && brandMatch && dateMatch && typeMatch;
        });
    }, [promotions, searchQuery, selectedStatuses, selectedBrands, selectedTypes, dateRange, isBrandView]);

    const handleStatusChange = (id: string, newStatus: PromotionStatus, source: 'admin' | 'brand' | 'system' = 'admin') => {
        setPromotions(prev => prev.map(p => p.id === id ? { ...p, status: newStatus, source } : p));
    }

    const handleBulkAction = (action: PromotionStatus) => {
        setPromotions(prev => prev.map(p => selectedRows.has(p.id) ? { ...p, status: action, source: 'admin' } : p));
        setSelectedRows(new Set());
    }

    const handleSelectRow = (id: string) => {
        setSelectedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(new Set(filteredPromotions.map(p => p.id)));
        } else {
            setSelectedRows(new Set());
        }
    }
    
    const openAnalytics = (promotion: Promotion) => {
        setSelectedPromotionForAnalytics(promotion);
    };
    
    const handleAppeal = (promo: Promotion, reason: string) => {
        handleStatusChange(promo.id, 'appealed', 'brand');
    };

    return (
        <TooltipProvider>
            <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl animate-in fade-in duration-700 pb-24">
                {!isBrandView && (
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-slate-100 pb-3">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                <span>Admin</span>
                                <ChevronRight className="h-2 w-2" />
                                <span className="text-slate-300">Campaign Manager</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none">Promotion Hub 2.0</h1>
                                <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold text-[7px] px-1.5 h-4 gap-1 tracking-widest shadow-sm transition-all uppercase">
                                   <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" /> LIVE ENGINE
                                </Badge>
                            </div>
                        </div>
                         <div className="flex items-center gap-2">
                             <Button variant="outline" className="h-8 px-3 rounded-lg border-slate-200 text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm" onClick={() => router.push('/admin/appeals')}>
                                <Gavel className="mr-1.5 h-3.5 w-3.5 text-rose-500" />
                                Appeals <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[8px] bg-rose-50 text-rose-600 border-rose-100 font-bold">1</Badge>
                            </Button>
                             <Button className="h-8 px-4 rounded-lg bg-slate-900 text-white text-[9px] font-bold uppercase gap-1.5 hover:bg-indigo-600 transition-all shadow-lg border border-slate-900 tracking-widest" onClick={() => router.push('/admin/promotions/calendar')}>
                                <CalendarIcon className="h-3.5 w-3.5" />
                                Strategy Map
                            </Button>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Toolbar & Filters */}
                    <div className="bg-slate-100 p-1 flex items-center justify-between rounded-xl border border-slate-200 shadow-inner">
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                            <div className="relative group">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <Input 
                                    placeholder="Filter by Name..." 
                                    className="h-7 pl-8 w-32 md:w-48 bg-white border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 focus:ring-indigo-500" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="h-4 w-[1px] bg-slate-200 mx-0.5 shrink-0" />
                            <div className="flex items-center gap-1.5 shrink-0">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="h-7 px-2.5 rounded-lg border-slate-200 bg-white text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 shadow-sm transition-all">
                                            <CalendarIcon className="mr-1.5 h-3 w-3" />
                                            {dateRange?.from ? 'Active Range' : 'Temporal Filter'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} locale={ru} className="rounded-xl border-none shadow-2xl" />
                                    </PopoverContent>
                                </Popover>
                                {!isBrandView && 
                                    <Combobox
                                        options={brandOptions}
                                        value={selectedBrands}
                                        onChange={(value) => setSelectedBrands(value as string[] || [])}
                                        multiple
                                        placeholder="Brands"
                                        className="h-7 w-28 md:w-32 text-[9px] font-bold uppercase tracking-widest"
                                    />
                                }
                                 <Combobox
                                    options={typeOptions}
                                    value={selectedTypes}
                                    onChange={(value) => setSelectedTypes(value as string[] || [])}
                                    multiple
                                    placeholder="Module"
                                    className="h-7 w-28 md:w-32 text-[9px] font-bold uppercase tracking-widest"
                                />
                                <Combobox
                                    options={statusOptions}
                                    value={selectedStatuses}
                                    onChange={(value) => setSelectedStatuses(value as string[] || [])}
                                    multiple
                                    placeholder="Lifecycle"
                                    className="h-7 w-32 md:w-40 text-[9px] font-bold uppercase tracking-widest"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-1.5 px-1 shrink-0">
                            {!isBrandView && selectedRows.size > 0 && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="h-7 px-3 rounded-lg bg-indigo-600 text-white text-[9px] font-bold uppercase gap-1.5 hover:bg-indigo-700 transition-all shadow-md border border-indigo-500 tracking-widest">
                                            Batch Ops ({selectedRows.size}) <MoreHorizontal className="h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="text-[10px] font-bold uppercase tracking-widest">
                                        <DropdownMenuItem onClick={() => handleBulkAction('active')}>Approve</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleBulkAction('rejected')}>Reject</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleBulkAction('frozen')}>Freeze</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-rose-600" onClick={() => handleBulkAction('archived')}>Archive</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>

                    <Card className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm hover:border-indigo-100/50 transition-all">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                                    {!isBrandView && <TableHead className="w-[40px] px-4"><Checkbox checked={selectedRows.size > 0 && selectedRows.size === filteredPromotions.length} onCheckedChange={(checked) => handleSelectAll(!!checked)} className="scale-75" /></TableHead>}
                                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Campaign Entity</TableHead>
                                    {!isBrandView && <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Partner</TableHead>}
                                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Segment</TableHead>
                                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Window</TableHead>
                                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10 text-right">Views</TableHead>
                                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10 text-right">CTR</TableHead>
                                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10 text-right">ROAS</TableHead>
                                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10 text-center">Status</TableHead>
                                    <TableHead className="text-right text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10 w-24">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-slate-50">
                                {filteredPromotions.map((promo) => (
                                    <TableRow key={promo.id} data-state={selectedRows.has(promo.id) ? 'selected' : ''} className="hover:bg-slate-50/50 transition-all group h-12">
                                        {!isBrandView && <TableCell className="px-4"><Checkbox checked={selectedRows.has(promo.id)} onCheckedChange={() => handleSelectRow(promo.id)} className="scale-75" /></TableCell>}
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight leading-none mb-1 truncate max-w-[180px]">{promo.productName}</span>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.15em] opacity-60">ID: {promo.productId}</span>
                                            </div>
                                        </TableCell>
                                        {!isBrandView && <TableCell><span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{promo.brandName}</span></TableCell>}
                                        <TableCell><Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 text-[7px] font-bold px-1.5 h-4 uppercase tracking-widest">{typeConfig[promo.type]}</Badge></TableCell>
                                        <TableCell><span className="text-[10px] font-bold text-slate-400 uppercase tabular-nums">{format(new Date(promo.startDate), 'dd MMM', {locale: ru})} - {format(new Date(promo.endDate), 'dd MMM', {locale: ru})}</span></TableCell>
                                        <TableCell className="text-right"><span className="text-[11px] font-bold text-slate-900 tabular-nums">{promo.metrics?.views.toLocaleString('ru-RU')}</span></TableCell>
                                        <TableCell className="text-right"><span className="text-[11px] font-bold text-indigo-600 tabular-nums">{promo.metrics?.ctr}%</span></TableCell>
                                        <TableCell className="text-right">
                                            <span className={cn("text-[11px] font-bold tabular-nums italic tracking-tighter", promo.metrics && promo.metrics.roi < 100 ? 'text-rose-600' : 'text-emerald-600')}>
                                                {promo.metrics?.roi}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Badge variant="outline" className={cn("text-[7px] font-bold px-1.5 h-3.5 rounded shadow-sm uppercase tracking-widest border transition-all", 
                                                        promo.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        promo.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        promo.status === 'frozen' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        promo.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                        'bg-slate-50 text-slate-400 border-slate-100'
                                                    )}>
                                                        {statusConfig[promo.status].label}
                                                    </Badge>
                                                </TooltipTrigger>
                                                {['frozen', 'rejected', 'unpublished'].includes(promo.status) && (
                                                    <TooltipContent className="text-[8px] font-bold uppercase tracking-widest bg-slate-900 text-white border-none">
                                                        <p>Origin: {promo.source === 'admin' ? 'Strategic Admin' : 'Partner Protocol'}</p>
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-all">
                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-slate-900 hover:text-white transition-all text-slate-400" onClick={() => openAnalytics(promo)}>
                                                    <BarChart2 className="h-3.5 w-3.5" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-100">
                                                            <MoreHorizontal className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="text-[10px] font-bold uppercase tracking-widest min-w-[160px]">
                                                        <DropdownMenuItem className="gap-2" onClick={() => openAnalytics(promo)}><BarChart2 className="h-3 w-3" /> Visual Analytics</DropdownMenuItem>
                                                        {isBrandView && ['rejected', 'frozen'].includes(promo.status) && (
                                                            <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-600" onClick={() => setAppealingPromotion(promo)}><Gavel className="h-3 w-3" /> Appeal Protocol</DropdownMenuItem>
                                                        )}
                                                        {!isBrandView && promo.status === 'pending' && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="gap-2 text-emerald-600 focus:text-emerald-600" onClick={() => handleStatusChange(promo.id, 'active')}><TrendingUp className="h-3 w-3" /> Authorize</DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-600" onClick={() => handleStatusChange(promo.id, 'rejected')}><XCircle className="h-3 w-3" /> Decline</DropdownMenuItem>
                                                            </>
                                                         )}
                                                         {!isBrandView && promo.status === 'active' && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="gap-2" onClick={() => handleStatusChange(promo.id, 'frozen')}><Pause className="h-3 w-3" /> Suspend</DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-600" onClick={() => handleStatusChange(promo.id, 'unpublished')}><Archive className="h-3 w-3" /> Terminate</DropdownMenuItem>
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
                        <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Displaying {filteredPromotions.length} of {promotions.length} campaigns</span>
                            <div className="flex gap-1">
                                <button className="h-6 px-2.5 bg-white border border-slate-200 rounded-md text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 shadow-sm transition-all disabled:opacity-50" disabled>PREV</button>
                                <button className="h-6 px-2.5 bg-white border border-slate-200 rounded-md text-[8px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 shadow-sm transition-all">NEXT</button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
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

    