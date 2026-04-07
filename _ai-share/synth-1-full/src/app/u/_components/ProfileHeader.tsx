'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    Edit, 
    Crown as CrownIcon, 
    Copy, 
    Mail, 
    X, 
    ChevronLeft, 
    ChevronRight, 
    Camera, 
    Plus, 
    Palette, 
    Instagram, 
    Trophy 
} from 'lucide-react';
import { motion } from 'framer-motion';

export function ProfileHeader({ user }: { user: any }) {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [headerImage, setHeaderImage] = useState<string | null>(null);
    const [avatarImage, setAvatarImage] = useState<string | null>(user.photoURL || null);
    const [photos, setPhotos] = useState<string[]>([]);
    const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
    const [prefs, setPrefs] = useState({
        avatarBorder: true,
        avatarShape: 'rounded',
        headerTheme: 'photo',
    });
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);
    const [isPlanOpen, setIsPlanOpen] = useState(false);
    const planCloseTimer = useRef<number | null>(null);

    // Instagram sync UI is available by default in MVP
    const hasVerifiedInstagram = !!user?.instagramVerified;
    const [instagramEnabled, setInstagramEnabled] = useState(hasVerifiedInstagram);

    const openPlan = () => {
        if (planCloseTimer.current) window.clearTimeout(planCloseTimer.current);
        setIsPlanOpen(true);
    };
    const scheduleClosePlan = () => {
        if (planCloseTimer.current) window.clearTimeout(planCloseTimer.current);
        // Give time to move cursor between trigger and popover (prevents flicker)
        planCloseTimer.current = window.setTimeout(() => setIsPlanOpen(false), 300);
    };

    const planLabel =
        user?.loyaltyPlan === 'premium' ? 'Premium' :
        user?.loyaltyPlan === 'comfort' ? 'Comfort' :
        user?.loyaltyPlan === 'start' ? 'Start' : 'Base';
    const endDateRaw: string | undefined = user?.subscription?.endDate;
    const endDateFormatted = endDateRaw ? format(new Date(endDateRaw), 'd MMMM yyyy', { locale: ru }) : '—';
    const offer = user?.subscription?.renewalOffer;

    const copyPromo = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            toast({ title: 'Скопировано', description: 'Промокод скопирован в буфер обмена.' });
        } catch {
            toast({ title: 'Не удалось скопировать', variant: 'destructive' });
        }
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setInstagramEnabled(hasVerifiedInstagram);
    }, [hasVerifiedInstagram]);

    const DEFAULT_PROFILE_PHOTO =
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1200&auto=format&fit=crop";

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const storedAvatar = localStorage.getItem('syntha_profile_avatar');
        const storedHeader = localStorage.getItem('syntha_profile_header');
        const storedPrefs = localStorage.getItem('syntha_profile_prefs');
        const storedPhotos = localStorage.getItem('syntha_profile_photos');
        const storedMain = localStorage.getItem('syntha_profile_main');

        if (storedAvatar) {
            setAvatarImage(storedAvatar);
        } else {
            setAvatarImage(DEFAULT_PROFILE_PHOTO);
        }
        
        if (storedHeader) setHeaderImage(storedHeader);
        if (storedPrefs) {
            try {
                setPrefs((prev) => ({ ...prev, ...JSON.parse(storedPrefs) }));
            } catch {}
        }
        if (storedPhotos) {
            try {
                const parsed = JSON.parse(storedPhotos);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setPhotos(parsed);
                }
            } catch {}
        }
        if (storedMain) setMainPhotoIndex(parseInt(storedMain, 10) || 0);
    }, []);

    // If auth user.photoURL arrives after first render, use it as default avatar
    // (only when user hasn't customized avatar via localStorage/photos yet).
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const storedAvatar = localStorage.getItem('syntha_profile_avatar');
        if (!storedAvatar && photos.length === 0 && !avatarImage && user?.photoURL) {
            setAvatarImage(user.photoURL);
        }
    }, [user?.photoURL, avatarImage, photos.length]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (avatarImage) localStorage.setItem('syntha_profile_avatar', avatarImage);
        if (headerImage) localStorage.setItem('syntha_profile_header', headerImage);
        localStorage.setItem('syntha_profile_prefs', JSON.stringify(prefs));
        if (photos.length > 0) {
            localStorage.setItem('syntha_profile_photos', JSON.stringify(photos));
            localStorage.setItem('syntha_profile_main', mainPhotoIndex.toString());
        }
        // Notify other UI parts (e.g. top-right avatar) to refresh immediately.
        window.dispatchEvent(new Event('syntha_profile_avatar_updated'));
    }, [avatarImage, headerImage, prefs, photos, mainPhotoIndex]);

    const readAsDataUrl = (file: File, setter: (val: string) => void) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setter(reader.result);
                if (setter === setAvatarImage) {
                    setPhotos(prev => [...prev, reader.result as string]);
                    setMainPhotoIndex(photos.length);
                }
            }
        };
        reader.readAsDataURL(file);
    };

    const headerThemeClasses =
        headerImage || prefs.headerTheme === 'photo'
            ? 'bg-slate-900'
            : prefs.headerTheme === 'dark'
            ? 'bg-slate-950'
            : prefs.headerTheme === 'light'
            ? 'bg-white'
            : prefs.headerTheme === 'blue'
            ? 'bg-blue-900'
            : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';

    const currentAvatar = photos.length > 0 ? photos[mainPhotoIndex] : (avatarImage || DEFAULT_PROFILE_PHOTO);

    return (
        <div className={cn("relative h-32 md:h-40 w-full overflow-hidden shrink-0", headerThemeClasses)}>
            {headerImage ? (
                <Image
                    src={headerImage}
                    alt="Profile Background"
                    fill
                    className="object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
                    unoptimized
                />
            ) : (
                <Image 
                    src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=3540&auto=format&fit=crop"
                    alt=""
                    fill
                    className="object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
                    unoptimized
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-4">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-3">
                    <div className="relative group/avatar cursor-pointer" onClick={() => {
                        if (photos.length > 0) {
                            setViewerIndex(mainPhotoIndex);
                            setIsViewerOpen(true);
                        }
                    }}>
                        <Avatar
                            className={cn(
                                "h-20 w-24 md:h-28 md:w-28 shadow-2xl transition-all duration-500 group-hover/avatar:scale-105",
                                prefs.avatarBorder ? 'ring-4 ring-white shadow-xl' : 'ring-0',
                                prefs.avatarShape === 'circle'
                                    ? 'rounded-full'
                                    : prefs.avatarShape === 'square'
                                    ? 'rounded-none'
                                    : 'rounded-xl'
                            )}
                            data-ai-hint="person face"
                        >
                            <AvatarImage src={currentAvatar || user.photoURL || DEFAULT_PROFILE_PHOTO} className="object-cover" />
                            <AvatarFallback className="text-base md:text-sm font-black bg-slate-100 text-slate-400">{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        {photos.length > 1 && (
                            <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-[8px] px-1.5 h-4 rounded-full font-bold shadow-lg flex items-center justify-center border-2 border-white">
                                {photos.length}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 mb-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h1 className="text-xl md:text-3xl font-bold font-headline tracking-tight uppercase text-white drop-shadow-md truncate">{user.displayName || 'Anonymous User'}</h1>
                            {user.loyaltyPlan && (
                                <Popover open={isPlanOpen} onOpenChange={setIsPlanOpen}>
                                    <PopoverTrigger asChild>
                                        <Link
                                            href="/loyalty"
                                            className="inline-flex"
                                                onPointerEnter={openPlan}
                                                onPointerLeave={scheduleClosePlan}
                                        >
                                            <Badge variant="outline" className="bg-white/10 backdrop-blur-md text-white border-white/20 text-[8px] font-bold uppercase px-1.5 h-4 gap-1 tracking-widest shadow-sm cursor-pointer hover:bg-white/20 transition-all">
                                                <CrownIcon className="h-2.5 w-2.5 text-amber-400" />
                                                {planLabel}
                                            </Badge>
                                        </Link>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        align="start"
                                            sideOffset={6}
                                        className="w-72 p-0 overflow-hidden border-slate-100 shadow-2xl rounded-xl bg-white"
                                            onPointerEnter={openPlan}
                                            onPointerLeave={scheduleClosePlan}
                                            onOpenAutoFocus={(e) => e.preventDefault()}
                                            onCloseAutoFocus={(e) => e.preventDefault()}
                                    >
                                        <div className="bg-slate-900 p-4 text-white">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 space-y-0.5">
                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 leading-none">Subscription Profile</div>
                                                    <div className="text-base font-bold uppercase tracking-tight">{planLabel} Active</div>
                                                    <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Expires: {endDateFormatted}</div>
                                                </div>
                                                <Button size="sm" asChild className="h-7 px-3 bg-white text-slate-900 text-[9px] font-bold uppercase rounded-lg hover:bg-indigo-50 transition-all border-none shadow-lg">
                                                    <Link href="/loyalty?renew=1">Renew</Link>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="p-4 space-y-3">
                                            {offer && (
                                                <div className="rounded-xl border border-indigo-50 bg-indigo-50/30 p-3 space-y-2.5">
                                                    {offer.type === 'promo' && (
                                                        <>
                                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                                                Renewal Incentive: <span className="text-indigo-600">-{offer.discountPercent}%</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="flex-1 rounded-lg border border-indigo-100 bg-white px-2.5 py-1.5 font-mono text-[11px] font-bold text-indigo-900 shadow-sm uppercase tracking-wider">
                                                                    {offer.code}
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-lg text-indigo-600 hover:bg-indigo-50 border border-indigo-100"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        copyPromo(offer.code);
                                                                    }}
                                                                >
                                                                    <Copy className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </div>
                                                            {offer.expiresAt && (
                                                                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.15em] opacity-60">
                                                                    Validity: {format(new Date(offer.expiresAt), 'dd MMM yyyy', { locale: ru })}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    {offer.type === 'email' && (
                                                        <>
                                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                                Unique strategic offer available
                                                            </div>
                                                            <Button variant="outline" size="sm" asChild className="w-full h-8 text-[9px] font-bold uppercase rounded-lg border-indigo-100 text-indigo-600 hover:bg-indigo-50">
                                                                <Link href="/u/offers/renewal">
                                                                    <Mail className="mr-1.5 h-3.5 w-3.5" /> View Proposal
                                                                </Link>
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            {user.nickname && (
                              <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-none">
                                @{user.nickname}
                              </div>
                            )}
                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest leading-none">ID: {user.email?.split('@')[0] || 'anonymous'}</p>
                        </div>
                        {user.loyaltyPoints && (
                            <div className="flex items-center gap-1.5 mt-2.5 bg-white/5 backdrop-blur-md border border-white/10 px-2.5 h-6 rounded-lg w-fit shadow-lg">
                                <Trophy className="h-3 w-3 text-amber-400 shadow-sm" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest tabular-nums leading-none">{user.loyaltyPoints.toLocaleString('ru-RU')} <span className="text-[8px] opacity-60">points</span></span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex gap-1.5 mb-1 shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all shadow-lg"
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Photo Viewer Dialog */}
            {isViewerOpen && (
              <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
                  <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/95 border-none">
                      <DialogTitle className="sr-only">Просмотр фото профиля</DialogTitle>
                      <div className="relative h-[80vh] w-full flex items-center justify-center">
                          <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
                              onClick={() => setIsViewerOpen(false)}
                          >
                              <X className="h-6 w-6" />
                          </Button>

                          {photos.length > 1 && (
                              <>
                                  <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                                      onClick={() => setViewerIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
                                  >
                                      <ChevronLeft className="h-8 w-8" />
                                  </Button>
                                  <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                                      onClick={() => setViewerIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
                                  >
                                      <ChevronRight className="h-8 w-8" />
                                  </Button>
                              </>
                          )}

                          <div className="relative h-full w-full p-4 flex items-center justify-center">
                              <Image 
                                  src={photos[viewerIndex]} 
                                  alt={`Фото ${viewerIndex + 1}`} 
                                  className="object-contain max-h-full max-w-full rounded-sm shadow-2xl"
                                  fill
                                  unoptimized
                              />
                          </div>

                          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 p-2">
                              {photos.map((_, idx) => (
                                  <div 
                                      key={idx} 
                                      className={cn(
                                          "h-1.5 w-1.5 rounded-full transition-all",
                                          idx === viewerIndex ? "bg-white w-4" : "bg-white/30"
                                      )} 
                                  />
                              ))}
                          </div>
                      </div>
                  </DialogContent>
              </Dialog>
            )}

            {isEditing && (
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Настройка профиля</DialogTitle>
                        <DialogDescription>Управление визуальным оформлением вашего аккаунта.</DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[70vh] pr-4">
                        <div className="grid gap-3 py-2">
                            <div className="space-y-3">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Фотографии профиля</Label>
                                <div className="flex flex-wrap gap-3">
                                    {photos.map((photo, idx) => (
                                        <div key={idx} className="relative group h-20 w-20 rounded-lg border overflow-hidden">
                                            <Image src={photo} alt="" fill className="object-cover" unoptimized />
                                            {idx === mainPhotoIndex && (
                                                <div className="absolute inset-0 border-2 border-accent bg-accent/10 flex items-center justify-center">
                                                    <Badge className="text-[8px] h-3 px-1">Main</Badge>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                                <button 
                                                    className="p-1 bg-white rounded-full text-black hover:bg-accent"
                                                    onClick={() => setMainPhotoIndex(idx)}
                                                    title="Сделать основным"
                                                >
                                                    <Camera className="h-3 w-3" />
                                                </button>
                                                <button 
                                                    className="p-1 bg-white rounded-full text-black hover:bg-red-500 hover:text-white"
                                                    onClick={() => {
                                                        const newPhotos = photos.filter((_, i) => i !== idx);
                                                        setPhotos(newPhotos);
                                                        if (mainPhotoIndex >= newPhotos.length) setMainPhotoIndex(Math.max(0, newPhotos.length - 1));
                                                    }}
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <label className="h-20 w-20 flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg hover:border-accent hover:bg-accent/5 cursor-pointer transition-colors">
                                        <Plus className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-[10px] text-muted-foreground mt-1">Добавить</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(event) => {
                                                const file = event.target.files?.[0];
                                                if (!file) return;
                                                readAsDataUrl(file, setAvatarImage);
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Фон шапки</Label>
                                <div className="relative h-28 rounded-lg border overflow-hidden group">
                                    {headerImage ? (
                                        <Image src={headerImage} alt="" fill className="object-cover" unoptimized />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-muted-foreground italic text-sm">
                                            Фоновое изображение не выбрано
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <span className="bg-white text-black px-3 py-1.5 rounded-md text-xs font-bold shadow-sm">Загрузить новый фон</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(event) => {
                                                const file = event.target.files?.[0];
                                                if (!file) return;
                                                readAsDataUrl(file, setHeaderImage);
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2 border-t">
                                <div className="flex items-center justify-between">
                                    <Label className="font-bold">Рамка аватара</Label>
                                    <Switch
                                        checked={prefs.avatarBorder}
                                        onCheckedChange={(value) => setPrefs((prev) => ({ ...prev, avatarBorder: !!value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Форма аватара</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { value: 'circle', label: 'Kруг' },
                                            { value: 'rounded', label: 'Скруглённая' },
                                            { value: 'square', label: 'Квадрат' },
                                        ].map((shape) => {
                                            const isActive = prefs.avatarShape === shape.value;
                                            return (
                                                <button
                                                    key={shape.value}
                                                    type="button"
                                                    className={cn(
                                                        "flex items-center justify-center rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-all",
                                                        isActive
                                                            ? "border-accent bg-accent/10 text-accent-foreground ring-2 ring-accent/20"
                                                            : "border-zinc-200 text-zinc-500 hover:border-accent hover:text-accent-foreground"
                                                    )}
                                                    style={{ fontFeatureSettings: "'liga' 0" }}
                                                    onClick={() => setPrefs((prev) => ({ ...prev, avatarShape: shape.value as any }))}
                                                >
                                                    {shape.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Цвет темы шапки</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { value: 'photo', label: 'Фото' },
                                            { value: 'dark', label: 'Тёмная' },
                                            { value: 'light', label: 'Светлая' },
                                            { value: 'blue', label: 'Синяя' },
                                        ].map((theme) => {
                                            const isActive = prefs.headerTheme === theme.value;
                                            return (
                                                <button
                                                    key={theme.value}
                                                    type="button"
                                                    className={cn(
                                                        "flex items-center gap-2 rounded-md border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition-all",
                                                        isActive
                                                            ? "border-accent bg-accent/10 text-accent-foreground ring-2 ring-accent/20"
                                                            : "border-zinc-200 text-zinc-600 hover:border-accent hover:text-accent-foreground"
                                                    )}
                                                    style={{ fontFeatureSettings: "'liga' 0" }}
                                                    onClick={() => setPrefs((prev) => ({ ...prev, headerTheme: theme.value as any }))}
                                                >
                                                    {theme.value === 'photo' && <Palette className="h-3.5 w-3.5" />}
                                                    {theme.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                              <div className="pt-4 border-t space-y-3">
                                  <div className="flex items-center justify-between">
                                      <div className="space-y-0.5">
                                          <Label className="font-bold flex items-center gap-2">
                                              <Instagram className="h-4 w-4 text-pink-500" />
                                              Instagram Sync
                                          </Label>
                                          <p className="text-[10px] text-muted-foreground">Импортировать фото и истории</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className={cn(
                                                "text-[10px] uppercase font-bold tracking-widest px-3",
                                                "border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                                            )}
                                            onClick={() => {
                                                setInstagramEnabled(true);
                                                toast({ title: 'Instagram', description: 'Синхронизация фото запущена (MVP).' });
                                                // Keep base avatar; just add to gallery for demo
                                                const igPhoto = DEFAULT_PROFILE_PHOTO;
                                                setPhotos(prev => (prev.includes(igPhoto) ? prev : [igPhoto, ...prev]));
                                                setMainPhotoIndex(0);
                                            }}
                                        >
                                            Фото
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className={cn(
                                                "text-[10px] uppercase font-bold tracking-widest px-3",
                                                "border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                                            )}
                                            onClick={() => {
                                                setInstagramEnabled(true);
                                                toast({ title: 'Instagram', description: 'Синхронизация сториз запущена (MVP).' });
                                            }}
                                        >
                                            Сториз
                                        </Button>
                                      </div>
                                  </div>
                                  {instagramEnabled && (
                                    <div className="text-[10px] text-green-600 font-semibold">Подключено</div>
                                  )}
                              </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter>
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Закрыть</Button>
                        <Button size="sm" onClick={() => setIsEditing(false)} className="bg-accent text-accent-foreground">Сохранить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            )}
        </div>
    );
}
