
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { brands as allBrands } from "@/lib/placeholder-data";
import { products } from "@/lib/products";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Search, BarChart2, Users, ShieldCheck, ChevronRight } from "lucide-react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BrandFinancialsDialog, BrandFollowersDialog } from '@/components/admin';
import type { Brand } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';

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
    }

    const handleFilterClick = (letter: string) => {
        setActiveLetter(prev => prev === letter ? null : letter);
    }
    
    const handleGroupClick = (group: string) => {
        setActiveFilterGroup(prev => prev === group ? null : group);
        setActiveLetter(null); // Reset letter filter when changing group
    }

    const filteredBrands = useMemo(() => {
        let tempBrands = [...brands];
        
        if (showOnlySelected && selectedBrands.size > 0) {
            tempBrands = tempBrands.filter(b => selectedBrands.has(b.id));
        }

        if (searchQuery) {
            tempBrands = tempBrands.filter(b => 
                (b.name.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (activeLetter) {
            tempBrands = tempBrands.filter(b => {
                const nameToTest = b.name;
                return nameToTest.toUpperCase().startsWith(activeLetter) || (!isNaN(parseInt(activeLetter, 10)) && nameToTest.startsWith(activeLetter));
            });
        }

        return tempBrands;
    }, [brands, searchQuery, activeLetter, selectedBrands, showOnlySelected]);
    
    const handleSelectBrand = (brandId: string) => {
        setSelectedBrands(prev => {
            const newSet = new Set(prev);
            if (newSet.has(brandId)) {
                newSet.delete(brandId);
            } else {
                newSet.add(brandId);
            }
            return newSet;
        });
    }
    
    const isAllSelected = filteredBrands.length > 0 && selectedBrands.size === filteredBrands.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedBrands(new Set());
        } else {
            setSelectedBrands(new Set(filteredBrands.map(b => b.id)));
        }
    }
    
    const getTierVariant = (tier?: 'Free' | 'Pro' | 'Elite') => {
        switch(tier) {
            case 'Pro': return 'default';
            case 'Elite': return 'secondary';
            default: return 'outline';
        }
    }

    return (
        <>
            <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl animate-in fade-in duration-700 pb-24">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-slate-100 pb-3">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            <span>Admin</span>
                            <ChevronRight className="h-2 w-2" />
                            <span className="text-slate-300">Brands Directory</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none">Partners Ecosystem</h1>
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold text-[7px] px-1.5 h-4 gap-1 tracking-widest shadow-sm transition-all">
                               <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" /> TOTAL: {brands.length}
                            </Badge>
                        </div>
                    </div>
                    <Button className="h-8 px-4 rounded-lg bg-slate-900 text-white text-[9px] font-bold uppercase gap-1.5 hover:bg-indigo-600 transition-all shadow-lg border border-slate-900 tracking-widest">
                        <PlusCircle className="h-3.5 w-3.5" /> Add Brand Entity
                    </Button>
                </div>

                 <div className="space-y-4">
                    {/* Toolbar & Filters */}
                    <div className="bg-slate-100 p-1 flex items-center justify-between rounded-xl border border-slate-200 shadow-inner">
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                            <div className="flex bg-white border border-slate-200 p-1 rounded-lg shadow-sm shrink-0">
                                {Object.keys(filterGroups).map(groupName => (
                                    <button
                                        key={groupName}
                                        onClick={() => handleGroupClick(groupName)}
                                        className={cn(
                                            "px-3 h-6.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all shadow-sm shrink-0",
                                            activeFilterGroup === groupName ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200 hover:text-slate-900"
                                        )}
                                    >
                                        {groupName}
                                    </button>
                                ))}
                            </div>
                            <div className="h-4 w-[1px] bg-slate-200 mx-0.5 shrink-0" />
                            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 h-8.5 rounded-lg shadow-sm shrink-0">
                                <Switch 
                                    id="show-selected"
                                    checked={showOnlySelected}
                                    onCheckedChange={setShowOnlySelected}
                                    disabled={selectedBrands.size === 0}
                                    className="scale-75 data-[state=checked]:bg-indigo-600"
                                />
                                <Label htmlFor="show-selected" className="text-[9px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer">Selected ({selectedBrands.size})</Label>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-1 shrink-0">
                            <div className="relative group">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <Input 
                                    placeholder="Filter by Name..." 
                                    className="h-7 pl-8 w-32 md:w-48 bg-white border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 focus:ring-indigo-500" 
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
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
                                className="overflow-hidden bg-white border border-slate-100 rounded-xl shadow-sm p-1.5"
                            >
                                <div className="flex flex-wrap gap-1">
                                    {(filterGroups[activeFilterGroup as keyof typeof filterGroups] || []).map(letter => (
                                        <Button 
                                            key={letter}
                                            variant={activeLetter === letter ? "default" : "ghost"}
                                            size="sm"
                                            className={cn(
                                                "h-7 w-7 p-0 text-[10px] font-bold rounded-lg transition-all",
                                                activeLetter === letter ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-400 hover:bg-slate-50 hover:text-indigo-600"
                                            )}
                                            onClick={() => handleFilterClick(letter)}
                                        >
                                            {letter}
                                        </Button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Card className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm hover:border-indigo-100/50 transition-all">
                        <div className="bg-slate-50/50 border-b border-slate-100 p-2 flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-3 rounded-lg font-bold uppercase text-[8px] bg-white border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm tracking-widest"
                                asChild
                            >
                                <a href="/admin/quality">
                                    <ShieldCheck className="mr-1.5 h-3 w-3 text-indigo-500" /> Quality Control (BPI)
                                </a>
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                                    <TableHead className="w-[40px] px-4"><Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} className="scale-75" /></TableHead>
                                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Brand Identity</TableHead>
                                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Network</TableHead>
                                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Start Date</TableHead>
                                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Tier</TableHead>
                                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Styles</TableHead>
                                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Status</TableHead>
                                    <TableHead className="text-right text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10 w-24">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-slate-50">
                                {filteredBrands.map(brand => {
                                    const productCount = products.filter(p => p.brand === brand.name).length;
                                    return (
                                        <TableRow key={brand.id} data-state={selectedBrands.has(brand.id) ? 'selected' : ''} className="hover:bg-slate-50/50 transition-all group h-12">
                                             <TableCell className="px-4"><Checkbox checked={selectedBrands.has(brand.id)} onCheckedChange={() => handleSelectBrand(brand.id)} className="scale-75" /></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-8 h-8 rounded-lg border border-slate-100 p-1 bg-white shadow-sm group-hover:scale-110 transition-transform">
                                                        <Image src={brand.logo.url} alt={brand.logo.alt} fill className="object-contain" />
                                                    </div>
                                                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight leading-none truncate max-w-[140px]">{brand.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="link" className="p-0 h-auto text-[10px] font-bold text-indigo-600 uppercase tracking-widest tabular-nums hover:underline decoration-indigo-200" onClick={() => setViewingFollowers(brand)}>
                                                    {brand.followers.toLocaleString('ru-RU')}
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-[10px] font-bold tabular-nums text-slate-400 uppercase tracking-tight">
                                                {brand.startDate ? format(new Date(brand.startDate), 'dd MMM yyyy', { locale: ru }) : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                 <Badge variant="outline" className={cn(
                                                     "text-[7px] font-bold px-1.5 h-3.5 rounded shadow-sm uppercase tracking-widest border transition-all",
                                                     brand.subscriptionTier === 'Elite' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                     brand.subscriptionTier === 'Pro' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                     'bg-slate-50 text-slate-400 border-slate-100'
                                                 )}>{brand.subscriptionTier}</Badge>
                                            </TableCell>
                                            <TableCell className="text-[10px] font-bold text-slate-900 tabular-nums">{productCount}</TableCell>
                                            <TableCell><Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[7px] font-bold px-1.5 h-3.5 rounded shadow-sm tracking-widest uppercase">Active</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-all">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-slate-900 hover:text-white transition-all text-slate-400" onClick={() => setViewingFinancials(brand)}>
                                                        <BarChart2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                     <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-100">
                                                                <MoreHorizontal className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="text-[10px] font-bold uppercase tracking-widest">
                                                            <DropdownMenuItem className="gap-2">Edit Entity</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setViewingFollowers(brand)} className="gap-2">
                                                                <Users className="h-3 w-3" /> Followers
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-rose-600 focus:text-rose-600 gap-2">Deactivate</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                        <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Displaying {filteredBrands.length} of {brands.length} partners</span>
                            <div className="flex gap-1">
                                <button className="h-6 px-2.5 bg-white border border-slate-200 rounded-md text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 shadow-sm transition-all disabled:opacity-50" disabled>PREV</button>
                                <button className="h-6 px-2.5 bg-white border border-slate-200 rounded-md text-[8px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 shadow-sm transition-all">NEXT</button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
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
