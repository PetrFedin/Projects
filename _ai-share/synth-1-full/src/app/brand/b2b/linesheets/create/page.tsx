'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { 
    Save, PlusCircle, ArrowLeft, ArrowRight, Lock, Globe, Users, FileText, 
    ShieldCheck, Zap, LayoutGrid, Info, Sparkles, Box 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function CreateLinesheetPage() {
    const router = useRouter();
    const [name, setName] = useState('Основная коллекция FW24');
    const [description, setDescription] = useState('Ключевые образы и коммерческие хиты сезона Осень-Зима 2024.');
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');
    const [moqEnabled, setMoqEnabled] = useState(true);
    const [layoutStrategy, setLayoutStrategy] = useState<'ai' | 'commercial' | 'story'>('ai');

    const handleCreateAndEdit = () => {
        const linesheetId = 'ls-fw24';
        router.push(`/brand/b2b/linesheets/${linesheetId}`);
    }

    return (
        <div className="space-y-4 max-w-2xl mx-auto pb-20">
            <div className="flex items-center gap-3">
                 <Button variant="outline" size="icon" className="rounded-xl border-slate-200" asChild>
                    <Link href="/brand/b2b/linesheets"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-base font-black uppercase tracking-tighter text-slate-900">New Linesheet</h1>
                    <p className="text-slate-500 font-medium italic">Создайте персональную выборку для ваших байеров.</p>
                </div>
            </div>

             <Card className="rounded-xl border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="bg-slate-50 p-4 border-b border-slate-100 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Основная информация
                    </CardTitle>
                    <Badge className="bg-indigo-600 text-white font-black text-[8px] uppercase tracking-widest px-3 h-5">Шаг 1 из 3</Badge>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Название лайншита</Label>
                            <Input id="name" className="h-12 rounded-xl text-sm font-bold border-slate-100" placeholder="Например, Предзаказ FW25" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description" className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Описание для байера</Label>
                            <Textarea id="description" className="min-h-[100px] rounded-2xl border-slate-100 text-sm font-medium resize-none" placeholder="Краткое описание коллекции или эксклюзивных условий." value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Коммерческие правила & MOQ</Label>
                            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                                <ShieldCheck className="h-3 w-3" /> Авто-контроль активен
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-slate-900">Минимальный заказ</span>
                                    <Checkbox checked={moqEnabled} onCheckedChange={(checked) => setMoqEnabled(!!checked)} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <Input defaultValue="250000" className="h-10 rounded-xl text-xs font-black border-slate-200 pl-4 pr-10" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">₽</span>
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase">Per order</span>
                                </div>
                            </div>
                            <div className="p-3 bg-indigo-50/30 rounded-[1.5rem] border border-indigo-100/50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-indigo-600">Pack Buy Mode</span>
                                    <Zap className="h-3.5 w-3.5 text-indigo-400" />
                                </div>
                                <p className="text-[9px] font-bold text-slate-500 leading-tight uppercase italic">Байер обязан заказывать полными размерными сетками (Packs).</p>
                                <Button variant="outline" className="w-full h-8 rounded-lg border-indigo-200 text-indigo-600 text-[9px] font-black uppercase">Настроить сетки</Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Стратегия развески (Merchandising)</Label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'ai', label: 'AI Optimized', icon: Sparkles, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                { id: 'commercial', label: 'Commercial', icon: Box, color: 'text-slate-900', bg: 'bg-slate-50' },
                                { id: 'story', label: 'Storytelling', icon: LayoutGrid, color: 'text-amber-600', bg: 'bg-amber-50' },
                            ].map(strategy => (
                                <button 
                                    key={strategy.id}
                                    onClick={() => setLayoutStrategy(strategy.id as any)}
                                    className={cn(
                                        "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                                        layoutStrategy === strategy.id ? "border-slate-900 bg-white shadow-lg -translate-y-1" : "border-slate-50 bg-slate-50/50 grayscale opacity-40 hover:opacity-100 hover:grayscale-0"
                                    )}
                                >
                                    <strategy.icon className={cn("h-5 w-5", strategy.color)} />
                                    <span className="text-[9px] font-black uppercase text-center">{strategy.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="p-3 bg-indigo-600 rounded-xl flex items-center gap-3">
                            <Info className="h-4 w-4 text-white" />
                            <p className="text-[9px] font-bold text-white/90 leading-tight uppercase italic">AI проанализирует историю продаж байера и выстроит товары в лайншите для максимизации чека.</p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Уровень доступа (Visibility)</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setVisibility('public')}
                                className={cn(
                                    "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                                    visibility === 'public' ? "border-indigo-600 bg-indigo-50/50" : "border-slate-50 bg-slate-50/50 grayscale opacity-60"
                                )}
                            >
                                <Globe className={cn("h-6 w-6", visibility === 'public' ? "text-indigo-600" : "text-slate-400")} />
                                <span className="text-[10px] font-black uppercase">Public (Все партнеры)</span>
                            </button>
                            <button 
                                onClick={() => setVisibility('private')}
                                className={cn(
                                    "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                                    visibility === 'private' ? "border-amber-600 bg-amber-50/50" : "border-slate-50 bg-slate-50/50 grayscale opacity-60"
                                )}
                            >
                                <Lock className={cn("h-6 w-6", visibility === 'private' ? "text-amber-600" : "text-slate-400")} />
                                <span className="text-[10px] font-black uppercase">Private (Выбранные)</span>
                            </button>
                        </div>
                    </div>

                    {visibility === 'private' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Выберите получателей</Label>
                            <div className="p-2 bg-slate-50 border border-slate-100 rounded-2xl">
                                <div className="flex flex-wrap gap-2">
                                    {['PODIUM', 'TSUM', 'SELFRIDGES'].map(p => (
                                        <Badge key={p} className="bg-white text-slate-900 border-slate-200 font-black text-[9px] uppercase px-3 py-1 flex items-center gap-2">
                                            {p} <PlusCircle className="h-3 w-3 text-slate-300" />
                                        </Badge>
                                    ))}
                                    <Button variant="ghost" className="h-7 text-[9px] font-black uppercase text-indigo-600">Добавить еще...</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                 <CardFooter className="p-4 bg-slate-50 border-t border-slate-100">
                    <Button onClick={handleCreateAndEdit} disabled={!name} className="w-full h-12 bg-slate-900 text-white rounded-xl font-black uppercase text-[11px] shadow-xl">
                        Создать и перейти в конструктор <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>

        </div>
    )
}
