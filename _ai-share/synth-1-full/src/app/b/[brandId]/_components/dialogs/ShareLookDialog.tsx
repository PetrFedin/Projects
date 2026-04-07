import React from 'react';
import { Camera, Edit2, Plus, X, ShoppingBag, Trophy, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface ShareLookDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    user: any;
    purchasedProducts: any[];
    toast: any;
    displayName: string;
}

export function ShareLookDialog({ isOpen, onOpenChange, user, purchasedProducts, toast, displayName }: ShareLookDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-0 border-none bg-background shadow-2xl custom-scrollbar">
                <DialogHeader className="p-4 pb-4 bg-muted/5 sticky top-0 z-10 backdrop-blur-md border-b border-muted/10">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                            <Camera className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-black tracking-tighter uppercase">Поделиться образом</DialogTitle>
                            <DialogDescription className="text-sm font-medium">Вдохновляйте других и получайте бонусы от {displayName}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-4 space-y-4">
                    {/* Step 0: User Bio */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">0. О себе (обязательно)</Label>
                            <Link href="/u/settings" className="text-[9px] font-bold text-accent hover:underline flex items-center gap-1">
                                <Edit2 className="h-2.5 w-2.5" /> Редактировать в профиле
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-black uppercase text-muted-foreground/60 ml-1">Никнейм</span>
                                        <Input 
                                            defaultValue={user?.nickname || ''} 
                                            placeholder="@nickname" 
                                            readOnly={!!user?.nickname}
                                            className={cn("h-10 rounded-xl text-xs font-bold bg-muted/5", !user?.nickname && "border-red-500/50")}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-black uppercase text-muted-foreground/60 ml-1">Имя</span>
                                        <Input 
                                            defaultValue={user?.displayName || ''} 
                                            placeholder="Ваше имя" 
                                            readOnly={!!user?.displayName}
                                            className={cn("h-10 rounded-xl text-xs font-bold bg-muted/5", !user?.displayName && "border-red-500/50")}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-black uppercase text-muted-foreground/60 ml-1">Соцсети</span>
                                        <Input 
                                            defaultValue={user?.socials?.instagram?.value || user?.socials?.telegram?.value || ''} 
                                            placeholder="Instagram/Telegram" 
                                            readOnly={!!(user?.socials?.instagram?.value || user?.socials?.telegram?.value)}
                                            className={cn("h-10 rounded-xl text-xs font-bold bg-muted/5", !(user?.socials?.instagram?.value || user?.socials?.telegram?.value) && "border-red-500/50")}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-black uppercase text-muted-foreground/60 ml-1">Должность</span>
                                        <Input 
                                            defaultValue={user?.lifestyle?.occupation || ''} 
                                            placeholder="Напр: Стилист" 
                                            readOnly={!!user?.lifestyle?.occupation}
                                            className={cn("h-10 rounded-xl text-xs font-bold bg-muted/5", !user?.lifestyle?.occupation && "border-red-500/50")}
                                        />
                                    </div>
                                </div>
                                {(!user?.nickname || !user?.displayName || !user?.lifestyle?.occupation) && (
                                    <p className="text-[9px] font-bold text-red-500/80 mt-1 uppercase flex items-center gap-1.5">
                                        <AlertCircle className="h-3 w-3" /> Пожалуйста, заполните пустые поля в личном кабинете
                                    </p>
                                )}
                            </div>
                            <textarea 
                                className="w-full h-24 rounded-2xl border-2 border-muted/20 p-4 text-sm font-medium focus:border-accent/40 focus:ring-0 transition-all bg-muted/5 resize-none"
                                placeholder="Напишите кратко о вашем стиле и почему вы выбрали этот образ..."
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* Step 1: Upload Photo */}
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">1. Загрузите фото образа</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="aspect-[3/4] rounded-3xl border-2 border-dashed border-muted/20 flex flex-col items-center justify-center gap-2 hover:border-accent/40 hover:bg-accent/5 transition-all cursor-pointer group">
                                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-colors" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-accent">Добавить фото</span>
                            </div>
                            <div className="aspect-[3/4] rounded-3xl bg-muted/10 border border-muted/20 relative overflow-hidden group">
                                <Image src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80" alt="Preview" fill className="object-cover opacity-50" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                    <X className="h-5 w-5 text-white cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Select Products (Only purchased) */}
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">2. Отметьте купленные товары</Label>
                        {(purchasedProducts || []).length > 0 ? (
                            <div className="space-y-2">
                                {(purchasedProducts || []).map(p => (
                                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl border border-green-500/20 bg-green-50/30 group">
                                        <div className="h-12 w-10 relative rounded-lg overflow-hidden shrink-0">
                                            <Image src={p.images[0]?.url || ""} alt="Product" fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-black uppercase truncate">{p.name}</p>
                                            <div className="flex items-center gap-1.5">
                                                <Badge variant="outline" className="text-[7px] font-black uppercase bg-white text-green-600 border-green-200">Куплено на платформе</Badge>
                                                <span className="text-[8px] font-bold text-muted-foreground uppercase">{p.category}</span>
                                            </div>
                                        </div>
                                        <Checkbox defaultChecked className="rounded-full h-5 w-5 border-2 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 rounded-2xl border-2 border-dashed border-muted/20 text-center space-y-2">
                                <ShoppingBag className="h-8 w-8 text-muted-foreground mx-auto opacity-20" />
                                <p className="text-[10px] font-black uppercase text-muted-foreground">У вас пока нет покупок этого бренда</p>
                                <p className="text-[9px] font-medium text-muted-foreground/60 max-w-[200px] mx-auto">Только верифицированные покупатели могут делиться образами.</p>
                            </div>
                        )}
                    </div>

                    {/* Step 3: Write Review */}
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">3. Ваш комментарий</Label>
                        <textarea 
                            className="w-full h-32 rounded-3xl border-2 border-muted/20 p-4 text-sm font-medium focus:border-accent/40 focus:ring-0 transition-all bg-muted/5 resize-none"
                            placeholder="Расскажите о вашем образе, качестве изделий или дайте совет по стилю..."
                        ></textarea>
                    </div>

                    {/* Reward Info */}
                    <div className="bg-accent/5 p-4 rounded-xl border border-accent/10 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <Trophy className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-tight text-accent">Награда за публикацию</p>
                            <p className="text-[10px] font-bold text-muted-foreground leading-snug mt-0.5">
                                Вы получите <span className="text-foreground font-black">50 бонусов</span> и статус <span className="text-foreground font-black">Trendsetter</span> в вашем профиле после модерации.
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 pt-0">
                    <div className="w-full space-y-3">
                        <p className="text-[9px] font-bold text-muted-foreground/60 text-center uppercase tracking-tighter">
                            После публикации ваш образ будет отправлен бренду на согласование
                        </p>
                        <Button 
                            className="w-full rounded-2xl h-10 text-xs font-black uppercase tracking-[0.2em] bg-black text-white hover:bg-slate-900 transition-all shadow-xl hover:scale-[1.02] active:scale-0.98"
                            onClick={() => {
                                onOpenChange(false);
                                toast({
                                    title: "Отправлено на согласование!",
                                    description: "Ваш образ появится в ленте после подтверждения брендом.",
                                });
                            }}
                        >
                            Отправить на модерацию
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
