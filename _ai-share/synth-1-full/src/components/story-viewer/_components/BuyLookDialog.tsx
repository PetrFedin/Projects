'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Edit2, Check, ChevronLeft } from 'lucide-react';
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from '@/lib/utils';
import { LookProductSelector } from './LookProductSelector';
import type { Product } from '@/lib/types';

interface BuyLookDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    products: Product[];
    lookSelections: any;
    updateLookSelection: any;
    isAnyPreOrderInSelection: boolean;
    lookPriceLabel: string;
    isContactStepOpen: boolean;
    setIsContactStepOpen: (open: boolean) => void;
    contactMethod: string;
    setContactMethod: (method: string) => void;
    userProfile: any;
    setUserProfile: any;
    editingContactId: string | null;
    setEditingContactId: (id: string | null) => void;
    tempContactValue: string;
    setTempContactValue: (val: string) => void;
    contactTime: string;
    setContactTime: (time: string) => void;
    selectedContactDate: Date | undefined;
    setSelectedContactDate: (date: Date | undefined) => void;
    selectedContactTimeStr: string;
    setSelectedContactTimeStr: (time: string) => void;
    onConfirm: () => void;
}

export function BuyLookDialog(props: BuyLookDialogProps) {
    const { 
        isOpen, onOpenChange, products, lookSelections, updateLookSelection, 
        isAnyPreOrderInSelection, lookPriceLabel, isContactStepOpen, setIsContactStepOpen,
        contactMethod, setContactMethod, userProfile, setUserProfile, editingContactId,
        setEditingContactId, tempContactValue, setTempContactValue, contactTime, setContactTime,
        selectedContactDate, setSelectedContactDate, selectedContactTimeStr, setSelectedContactTimeStr,
        onConfirm
    } = props;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                                <span className="text-sm text-black">{lookPriceLabel}</span>
                            </div>
                            <Button onClick={() => setIsContactStepOpen(true)} className="w-full h-10 rounded-2xl bg-black text-white font-black uppercase text-xs tracking-[0.2em]">Далее</Button>
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
                                <Label className="text-[10px] font-black uppercase text-slate-500">Способ связи</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['telegram', 'phone', 'whatsapp'].map(id => (
                                        <button key={id} onClick={() => setContactMethod(id)} className={cn("w-full h-10 rounded-xl border text-[9px] font-black uppercase transition-all", contactMethod === id ? "bg-black text-white" : "bg-white text-black")}>
                                            {id === 'phone' ? 'Звонок' : id.charAt(0).toUpperCase() + id.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase text-slate-500">Удобное время</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['asap', 'evening', 'tomorrow', 'custom'].map(id => (
                                        <button key={id} onClick={() => setContactTime(id)} className={cn("h-10 px-2 rounded-xl border text-[9px] font-black uppercase", contactTime === id ? "bg-black text-white" : "bg-white text-black")}>
                                            {id === 'asap' ? 'Как можно скорее' : id === 'evening' ? 'Сегодня вечером' : id === 'tomorrow' ? 'Завтра утром' : 'Выбрать время'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t">
                            <Button onClick={onConfirm} className="w-full h-10 rounded-2xl bg-black text-white font-black uppercase text-[11px]">Подтвердить запрос</Button>
                            <Button variant="ghost" onClick={() => setIsContactStepOpen(false)} className="w-full text-[10px] font-black uppercase">Назад</Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
