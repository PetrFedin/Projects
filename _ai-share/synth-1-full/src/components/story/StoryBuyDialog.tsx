'use client';

import { useState } from 'react';
import { Check, Edit2, Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import type { LookSelections } from '@/types/story';
import { LookProductSelector } from './LookProductSelector';

interface StoryBuyDialogProps {
    products: Product[];
    lookSelections: LookSelections;
    updateLookSelection: (productId: string, colorId: string, size: string, delta: number) => void;
    lookPriceLabel: string;
    isAnyPreOrderInSelection: boolean;
    isLookOrdered: boolean;
    setIsLookOrdered: (ordered: boolean) => void;
    isBuyLookOpen: boolean;
    setIsBuyLookOpen: (open: boolean) => void;
}

export function StoryBuyDialog({
    products,
    lookSelections,
    updateLookSelection,
    lookPriceLabel,
    isAnyPreOrderInSelection,
    isLookOrdered,
    setIsLookOrdered,
    isBuyLookOpen,
    setIsBuyLookOpen
}: StoryBuyDialogProps) {
    const { toast } = useToast();
    const [isContactStepOpen, setIsContactStepOpen] = useState(false);
    const [editingContactId, setEditingContactId] = useState<string | null>(null);
    const [tempContactValue, setTempContactValue] = useState("");
    const [contactMethod, setContactMethod] = useState('telegram');
    const [contactTime, setContactTime] = useState('asap');
    const [selectedContactDate, setSelectedContactDate] = useState<Date | undefined>(new Date());
    const [selectedContactTimeStr, setSelectedContactTimeStr] = useState(format(new Date(), 'HH:mm'));

    // Mock user profile contact data
    const [userProfile, setUserProfile] = useState({
        telegram: "@user_synth",
        phone: "+7 (999) 123-45-67",
        whatsapp: "+7 (999) 123-45-67"
    });

    // Restriction for past time if today is selected
    const isTodaySelected = selectedContactDate && format(selectedContactDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    const minTimeValue = isTodaySelected ? format(new Date(), 'HH:mm') : undefined;

    return (
        <Dialog open={isBuyLookOpen} onOpenChange={setIsBuyLookOpen}>
            <DialogTrigger asChild>
                <Button 
                    className={cn(
                        "w-full rounded-xl font-black uppercase text-[11px] tracking-[0.2em] h-20 transition-all active:scale-95 flex flex-col gap-1.5 border-none shadow-[0_15px_30px_-5px_rgba(255,59,48,0.25)] hover:shadow-[0_20px_40px_-5px_rgba(255,59,48,0.35)]",
                        isLookOrdered 
                            ? "bg-green-500 text-white" 
                            : "bg-white text-black"
                    )}
                >
                    <span className={cn(isLookOrdered ? "text-white" : "text-slate-900")}>
                        {isLookOrdered ? 'Запрос отправлен' : 'Купить весь образ'}
                    </span>
                    {!isLookOrdered && lookPriceLabel !== "Купить весь образ" && (
                        <span className="text-sm text-black">
                            {lookPriceLabel}
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-xl p-4">
                {!isContactStepOpen ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-base font-black uppercase tracking-widest text-slate-900">Собрать образ</DialogTitle>
                            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest mt-2 text-slate-600">
                                {isAnyPreOrderInSelection ? 'Выберите параметры для обсуждения деталей предзаказа' : 'Выберите размеры для всех предметов'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 my-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {products.map(p => (
                                <LookProductSelector 
                                    key={p.id} 
                                    product={p} 
                                    selections={lookSelections[p.id] || []}
                                    onUpdate={updateLookSelection}
                                />
                            ))}
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                <span>Итого за образ:</span>
                                <span className="text-sm text-black">
                                    {lookPriceLabel}
                                </span>
                            </div>
                            <Button 
                                onClick={() => {
                                    const unselected = products.filter(p => !lookSelections[p.id] || lookSelections[p.id].length === 0);
                                    
                                    if (unselected.length > 0) {
                                        toast({ 
                                            title: "Выберите параметры", 
                                            description: `Добавьте хотя бы один размер для: ${unselected.map(p => p.name).join(', ')}`,
                                            variant: "destructive" 
                                        });
                                        return;
                                    }
                                    setIsContactStepOpen(true);
                                }}
                                className="w-full h-10 rounded-2xl bg-black text-white font-black uppercase text-xs tracking-[0.2em] hover:bg-black/90 shadow-[0_10px_20_rgba(0,0,0,0.1)]"
                            >
                                Далее
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-base font-black uppercase tracking-widest text-slate-900">Детали связи</DialogTitle>
                            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest mt-2 text-slate-500">
                                Менеджер бренда свяжется с вами для уточнения деталей заказа
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 my-8">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Способ связи</Label>
                                    <span className="text-[8px] font-black text-accent uppercase">Актуально для профиля</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'telegram', label: 'Telegram', value: userProfile.telegram },
                                        { id: 'phone', label: 'Звонок', value: userProfile.phone },
                                        { id: 'whatsapp', label: 'WhatsApp', value: userProfile.whatsapp }
                                    ]
                                    .filter(method => method.value)
                                    .map(method => (
                                        <div key={method.id} className="space-y-1.5 flex flex-col">
                                            <button
                                                onClick={() => setContactMethod(method.id)}
                                                className={cn(
                                                    "w-full h-10 rounded-xl border text-[9px] font-black uppercase transition-all flex flex-col items-center justify-center gap-0.5",
                                                    contactMethod === method.id 
                                                        ? "bg-black text-white border-black shadow-lg" 
                                                        : "bg-white text-black hover:bg-muted border-muted/50"
                                                )}
                                            >
                                                <span>{method.label}</span>
                                            </button>
                                            {editingContactId === method.id ? (
                                                <div className="flex items-center gap-1 bg-white rounded-lg border border-accent/20 p-0.5 animate-in zoom-in duration-200">
                                                    <input 
                                                        autoFocus
                                                        type="text"
                                                        value={tempContactValue}
                                                        onChange={(e) => setTempContactValue(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                setUserProfile(prev => ({ ...prev, [method.id]: tempContactValue }));
                                                                setEditingContactId(null);
                                                            }
                                                        }}
                                                        className="w-full text-[7px] font-black outline-none px-1"
                                                    />
                                                    <button 
                                                        onClick={() => {
                                                            setUserProfile(prev => ({ ...prev, [method.id]: tempContactValue }));
                                                            setEditingContactId(null);
                                                        }}
                                                        className="text-green-600 hover:scale-110 transition-transform"
                                                    >
                                                        <Check className="h-2 w-2 stroke-[4px]" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className={cn(
                                                    "bg-white rounded-lg py-1.5 px-2 border shadow-sm transition-all flex items-center justify-between gap-1",
                                                    contactMethod === method.id ? "border-black/10 opacity-100" : "border-transparent opacity-40"
                                                )}>
                                                    <p className="text-[7px] font-black text-slate-900 truncate">
                                                        {method.value}
                                                    </p>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingContactId(method.id);
                                                            setTempContactValue(method.value);
                                                        }}
                                                        className="shrink-0 hover:text-accent transition-colors"
                                                    >
                                                        <Edit2 className="h-2 w-2" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Удобное время</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'asap', label: 'Как можно скорее' },
                                        { id: 'evening', label: 'Сегодня вечером' },
                                        { id: 'tomorrow', label: 'Завтра утром' },
                                        { id: 'custom', label: 'Выбрать время' }
                                    ].map(time => (
                                        <button
                                            key={time.id}
                                            onClick={() => setContactTime(time.id)}
                                            className={cn(
                                                "h-10 px-2 rounded-xl border text-[9px] font-black uppercase transition-all",
                                                contactTime === time.id ? "bg-black text-white border-black" : "bg-white text-black hover:bg-muted"
                                            )}
                                        >
                                            {time.label}
                                        </button>
                                    ))}
                                </div>
                                
                                {contactTime === 'custom' && (
                                    <div className="pt-2 space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex gap-2">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase">
                                                        <CalendarIcon className="mr-2 h-3 w-3" />
                                                        {selectedContactDate ? format(selectedContactDate, "d MMM", { locale: ru }) : "Дата"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden border-none shadow-2xl">
                                                    <CalendarComponent
                                                        mode="single"
                                                        selected={selectedContactDate}
                                                        onSelect={setSelectedContactDate}
                                                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <div className="relative flex-1">
                                                <Input 
                                                    type="time" 
                                                    value={selectedContactTimeStr}
                                                    onChange={(e) => setSelectedContactTimeStr(e.target.value)}
                                                    min={minTimeValue}
                                                    className="h-10 rounded-xl text-[10px] font-black uppercase"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsContactStepOpen(false)}
                                className="h-10 w-10 rounded-2xl border-2"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button 
                                onClick={() => {
                                    setIsBuyLookOpen(false);
                                    setIsLookOrdered(true);
                                    toast({
                                        title: "Заявка отправлена!",
                                        description: "Менеджер свяжется с вами в выбранное время.",
                                    });
                                    setTimeout(() => setIsLookOrdered(false), 3000);
                                }}
                                className="flex-1 h-10 rounded-2xl bg-black text-white font-black uppercase text-xs tracking-[0.2em] hover:bg-black/90 shadow-xl"
                            >
                                Подтвердить
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
