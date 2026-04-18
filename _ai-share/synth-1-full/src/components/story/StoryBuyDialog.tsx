'use client';

import { useState } from 'react';
import { Check, Edit2, Calendar as CalendarIcon, ChevronLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
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
  setIsBuyLookOpen,
}: StoryBuyDialogProps) {
  const { toast } = useToast();
  const [isContactStepOpen, setIsContactStepOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [tempContactValue, setTempContactValue] = useState('');
  const [contactMethod, setContactMethod] = useState('telegram');
  const [contactTime, setContactTime] = useState('asap');
  const [selectedContactDate, setSelectedContactDate] = useState<Date | undefined>(new Date());
  const [selectedContactTimeStr, setSelectedContactTimeStr] = useState(format(new Date(), 'HH:mm'));

  // Mock user profile contact data
  const [userProfile, setUserProfile] = useState({
    telegram: '@user_synth',
    phone: '+7 (999) 123-45-67',
    whatsapp: '+7 (999) 123-45-67',
  });

  // Restriction for past time if today is selected
  const isTodaySelected =
    selectedContactDate &&
    format(selectedContactDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const minTimeValue = isTodaySelected ? format(new Date(), 'HH:mm') : undefined;

  return (
    <Dialog open={isBuyLookOpen} onOpenChange={setIsBuyLookOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            'flex h-20 w-full flex-col gap-1.5 rounded-xl border-none text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_15px_30px_-5px_rgba(255,59,48,0.25)] transition-all hover:shadow-[0_20px_40px_-5px_rgba(255,59,48,0.35)] active:scale-95',
            isLookOrdered ? 'bg-green-500 text-white' : 'bg-white text-black'
          )}
        >
          <span className={cn(isLookOrdered ? 'text-white' : 'text-text-primary')}>
            {isLookOrdered ? 'Запрос отправлен' : 'Купить весь образ'}
          </span>
          {!isLookOrdered && lookPriceLabel !== 'Купить весь образ' && (
            <span className="text-sm text-black">{lookPriceLabel}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-xl p-4">
        {!isContactStepOpen ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-text-primary text-base font-black uppercase tracking-widest">
                Собрать образ
              </DialogTitle>
              <DialogDescription className="text-text-secondary mt-2 text-[10px] font-bold uppercase tracking-widest">
                {isAnyPreOrderInSelection
                  ? 'Выберите параметры для обсуждения деталей предзаказа'
                  : 'Выберите размеры для всех предметов'}
              </DialogDescription>
            </DialogHeader>

            <div className="custom-scrollbar my-6 max-h-[400px] space-y-6 overflow-y-auto pr-2">
              {products.map((p) => (
                <LookProductSelector
                  key={p.id}
                  product={p}
                  selections={lookSelections[p.id] || []}
                  onUpdate={updateLookSelection}
                />
              ))}
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span>Итого за образ:</span>
                <span className="text-sm text-black">{lookPriceLabel}</span>
              </div>
              <Button
                onClick={() => {
                  const unselected = products.filter(
                    (p) => !lookSelections[p.id] || lookSelections[p.id].length === 0
                  );

                  if (unselected.length > 0) {
                    toast({
                      title: 'Выберите параметры',
                      description: `Добавьте хотя бы один размер для: ${unselected.map((p) => p.name).join(', ')}`,
                      variant: 'destructive',
                    });
                    return;
                  }
                  setIsContactStepOpen(true);
                }}
                className="h-10 w-full rounded-2xl bg-black text-xs font-black uppercase tracking-[0.2em] text-white shadow-[0_10px_20_rgba(0,0,0,0.1)] hover:bg-black/90"
              >
                Далее
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-text-primary text-base font-black uppercase tracking-widest">
                Детали связи
              </DialogTitle>
              <DialogDescription className="text-text-secondary mt-2 text-[10px] font-bold uppercase tracking-widest">
                Менеджер бренда свяжется с вами для уточнения деталей заказа
              </DialogDescription>
            </DialogHeader>

            <div className="my-8 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-text-secondary text-[10px] font-black uppercase tracking-widest">
                    Способ связи
                  </Label>
                  <span className="text-[8px] font-black uppercase text-accent">
                    Актуально для профиля
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'telegram', label: 'Telegram', value: userProfile.telegram },
                    { id: 'phone', label: 'Звонок', value: userProfile.phone },
                    { id: 'whatsapp', label: 'WhatsApp', value: userProfile.whatsapp },
                  ]
                    .filter((method) => method.value)
                    .map((method) => (
                      <div key={method.id} className="flex flex-col space-y-1.5">
                        <button
                          onClick={() => setContactMethod(method.id)}
                          className={cn(
                            'flex h-10 w-full flex-col items-center justify-center gap-0.5 rounded-xl border text-[9px] font-black uppercase transition-all',
                            contactMethod === method.id
                              ? 'border-black bg-black text-white shadow-lg'
                              : 'border-muted/50 bg-white text-black hover:bg-muted'
                          )}
                        >
                          <span>{method.label}</span>
                        </button>
                        {editingContactId === method.id ? (
                          <div className="flex items-center gap-1 rounded-lg border border-accent/20 bg-white p-0.5 duration-200 animate-in zoom-in">
                            <input
                              autoFocus
                              type="text"
                              value={tempContactValue}
                              onChange={(e) => setTempContactValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setUserProfile((prev) => ({
                                    ...prev,
                                    [method.id]: tempContactValue,
                                  }));
                                  setEditingContactId(null);
                                }
                              }}
                              className="w-full px-1 text-[7px] font-black outline-none"
                            />
                            <button
                              onClick={() => {
                                setUserProfile((prev) => ({
                                  ...prev,
                                  [method.id]: tempContactValue,
                                }));
                                setEditingContactId(null);
                              }}
                              className="text-green-600 transition-transform hover:scale-110"
                            >
                              <Check className="h-2 w-2 stroke-[4px]" />
                            </button>
                          </div>
                        ) : (
                          <div
                            className={cn(
                              'flex items-center justify-between gap-1 rounded-lg border bg-white px-2 py-1.5 shadow-sm transition-all',
                              contactMethod === method.id
                                ? 'border-black/10 opacity-100'
                                : 'border-transparent opacity-40'
                            )}
                          >
                            <p className="text-text-primary truncate text-[7px] font-black">
                              {method.value}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingContactId(method.id);
                                setTempContactValue(method.value);
                              }}
                              className="shrink-0 transition-colors hover:text-accent"
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
                <Label className="text-text-secondary text-[10px] font-black uppercase tracking-widest">
                  Удобное время
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'asap', label: 'Как можно скорее' },
                    { id: 'evening', label: 'Сегодня вечером' },
                    { id: 'tomorrow', label: 'Завтра утром' },
                    { id: 'custom', label: 'Выбрать время' },
                  ].map((time) => (
                    <button
                      key={time.id}
                      onClick={() => setContactTime(time.id)}
                      className={cn(
                        'h-10 rounded-xl border px-2 text-[9px] font-black uppercase transition-all',
                        contactTime === time.id
                          ? 'border-black bg-black text-white'
                          : 'bg-white text-black hover:bg-muted'
                      )}
                    >
                      {time.label}
                    </button>
                  ))}
                </div>

                {contactTime === 'custom' && (
                  <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-10 flex-1 rounded-xl text-[10px] font-black uppercase"
                          >
                            <CalendarIcon className="mr-2 h-3 w-3" />
                            {selectedContactDate
                              ? format(selectedContactDate, 'd MMM', { locale: ru })
                              : 'Дата'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
                          <CalendarComponent
                            mode="single"
                            selected={selectedContactDate}
                            onSelect={setSelectedContactDate}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
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
                    title: 'Заявка отправлена!',
                    description: 'Менеджер свяжется с вами в выбранное время.',
                  });
                  setTimeout(() => setIsLookOrdered(false), 3000);
                }}
                className="h-10 flex-1 rounded-2xl bg-black text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl hover:bg-black/90"
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
