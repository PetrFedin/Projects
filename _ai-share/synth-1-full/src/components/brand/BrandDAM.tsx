'use client';

import React, { useState } from 'react';
import { 
    Search, Filter, Plus, Download, Share2, MoreHorizontal, 
    FileText, Image as ImageIcon, Video, Folder, 
    ChevronRight, Grid, List, CheckCircle2, AlertCircle,
    Archive, Star, Clock, Megaphone, Database,
    History, User, RotateCcw,
    ShieldCheck, EyeOff, Shield
} from 'lucide-react';
import { 
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { fastApiService } from "@/lib/fastapi-service";
import { useEffect } from 'react';

// Mock data for digital assets
const MOCK_ASSETS = [
    { id: '1', name: 'Campaign_Spring_26_Master.mp4', type: 'video', size: '124 MB', date: '2024-02-15', access: 'Global', version: 'v1.2', tags: ['Campaign', 'SS26', 'Main'] },
    { id: '2', name: 'Lookbook_Technical_Specs.pdf', type: 'doc', size: '4.2 MB', date: '2024-02-12', access: 'Internal', version: 'v3.0', tags: ['Technical', 'Production'] },
    { id: '3', name: 'Brand_Logo_Pack_2026.zip', type: 'archive', size: '85 MB', date: '2024-02-10', access: 'Public', version: 'v1.0', tags: ['Identity', 'Graphics'] },
    { id: '4', name: 'Price_List_Global_SS26.xls', type: 'doc', size: '1.1 MB', date: '2024-02-01', access: 'Internal', version: 'v2.0', tags: ['Finance', 'Confidential'] },
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
            case 'video': return <Video className="h-5 w-5" />;
            case 'doc': return <FileText className="h-5 w-5" />;
            case 'archive': return <Archive className="h-5 w-5" />;
            default: return <ImageIcon className="h-5 w-5" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Поиск по активам..." 
                        className="pl-10 h-10 rounded-xl bg-white border-slate-100"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-100">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn("h-8 w-8 rounded-lg", viewMode === 'grid' && "bg-slate-100")}
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn("h-8 w-8 rounded-lg", viewMode === 'list' && "bg-slate-100")}
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button className="h-10 rounded-xl bg-slate-900 text-white gap-2">
                        <Plus className="h-4 w-4" /> Загрузить
                    </Button>
                </div>
            </div>

            <div className={cn(
                "grid gap-3",
                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
            )}>
                {assets.map((asset) => (
                    <Sheet key={asset.id}>
                        <SheetTrigger asChild>
                            <Card 
                                className={cn(
                                    "group cursor-pointer hover:shadow-lg transition-all border-slate-100 overflow-hidden",
                                    viewMode === 'list' && "flex items-center p-4 gap-3"
                                )}
                                onClick={() => setSelectedAsset(asset)}
                            >
                                <div className={cn(
                                    "bg-slate-50 flex items-center justify-center transition-colors group-hover:bg-slate-100",
                                    viewMode === 'grid' ? "aspect-video" : "h-12 w-12 rounded-xl shrink-0"
                                )}>
                                    {getIcon(asset.type)}
                                </div>
                                <div className={cn("p-4", viewMode === 'list' && "p-0 flex-1 flex items-center justify-between")}>
                                    <div>
                                        <h4 className="text-[11px] font-black uppercase text-slate-900 truncate mb-1">{asset.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-medium text-slate-400">{asset.size}</span>
                                            <div className="h-1 w-1 rounded-full bg-slate-200" />
                                            <span className="text-[9px] font-medium text-slate-400">{asset.date}</span>
                                        </div>
                                    </div>
                                    {viewMode === 'list' && (
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest">{asset.access}</Badge>
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-[440px] p-0 border-none bg-slate-50 overflow-y-auto">
                            <div className="bg-slate-900 text-white p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-600 rounded-xl">
                                        {getIcon(asset.type)}
                                    </div>
                                    <Badge variant="outline" className="border-white/20 text-white/60 text-[8px] font-black uppercase tracking-widest px-2 h-5">
                                        Asset Details
                                    </Badge>
                                </div>
                                <SheetTitle className="text-base font-black uppercase tracking-tight text-white">{asset.name}</SheetTitle>
                                <SheetDescription className="text-slate-400 text-xs mt-2 font-medium">
                                    Управление цифровым активом и правами доступа.
                                </SheetDescription>
                            </div>

                            <div className="p-4 space-y-6">
                                <div className="grid grid-cols-2 gap-3">
                                    <Button className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-[9px] font-black uppercase tracking-widest">
                                        <Download className="h-4 w-4" /> Скачать
                                    </Button>
                                    <Button variant="outline" className="h-11 rounded-xl bg-white border-slate-100 gap-2 text-[9px] font-black uppercase tracking-widest">
                                        <Share2 className="h-4 w-4" /> Поделиться
                                    </Button>
                                </div>

                                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                                    <div className="p-4 border-b border-slate-50">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Свойства</h5>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Размер', value: asset.size, icon: Database },
                                                { label: 'Версия', value: asset.version, icon: History },
                                                { label: 'Доступ', value: asset.access, icon: Shield },
                                                { label: 'Загрузил', value: 'Alex R.', icon: User },
                                            ].map((prop, i) => (
                                                <div key={i} className="flex justify-between items-center text-[10px] font-bold">
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
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Теги</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {asset.tags.map((tag: string, i: number) => (
                                                <Badge key={i} variant="secondary" className="bg-slate-50 text-slate-600 border-none text-[8px] font-bold px-2.5 py-1 uppercase">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-900 rounded-xl p-4 text-white relative overflow-hidden">
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                            <h5 className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Безопасность</h5>
                                        </div>
                                        <p className="text-[10px] font-medium leading-relaxed italic opacity-80">
                                            Данный файл защищен водяным знаком Syntha. При внешней передаче будет создан временный токен доступа.
                                        </p>
                                        <Button variant="ghost" className="w-full text-[8px] font-black uppercase text-white/60 hover:text-white transition-colors gap-2">
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
