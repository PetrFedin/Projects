'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Instagram, Zap, Sparkles, ShieldCheck, Share2, Globe, TrendingUp, Users, Loader2 } from 'lucide-react';
import { readUserSettings } from '@/lib/user-settings';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function ProfilePreferences({ value, onChange }: { value: ReturnType<typeof readUserSettings>; onChange: (next: ReturnType<typeof readUserSettings>) => void }) {
    const settings = value;
    const { toast } = useToast();
    const [isSyncing, setIsSyncing] = useState<string | null>(null);
    const [syncedChannels, setSyncedChannels] = useState<string[]>(['instagram']);

    const handleSync = (channel: string) => {
        setIsSyncing(channel);
        setTimeout(() => {
            setSyncedChannels([...syncedChannels, channel]);
            setIsSyncing(null);
            toast({
                title: "Social Sync Success",
                description: `Ваш аккаунт ${channel.charAt(0).toUpperCase() + channel.slice(1)} успешно синхронизирован. Метрики обновлены.`,
            });
        }, 2000);
    };

    return (
        <div className="space-y-6">
            {/* Social Sync & Influence Perks */}
            <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Instagram className="h-32 w-32 rotate-12" />
                </div>
                <CardHeader className="p-4 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-black uppercase tracking-tight">Social Sync & Influence</CardTitle>
                            <CardDescription className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">Синхронизируйте охваты и получайте привилегии</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-white/5 rounded-2xl p-3 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between">
                                <Instagram className="h-5 w-5 text-rose-400" />
                                {syncedChannels.includes('instagram') ? (
                                    <Badge className="bg-emerald-500 border-none text-[8px] uppercase">Synced</Badge>
                                ) : (
                                    <Badge variant="outline" className="text-white/40 border-white/20 text-[8px] uppercase">Not Linked</Badge>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-black">12.4K</p>
                                <p className="text-[9px] font-bold uppercase text-white/40">Подписчиков</p>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-black text-amber-400 uppercase">
                                <TrendingUp className="h-3 w-3" /> ER: 4.8% (Top 10%)
                            </div>
                        </div>

                        <div className={cn("bg-white/5 rounded-2xl p-3 border border-white/10 space-y-3 transition-all", !syncedChannels.includes('telegram') && "opacity-70")}>
                            <div className="flex items-center justify-between">
                                <Globe className="h-5 w-5 text-blue-400" />
                                {syncedChannels.includes('telegram') ? (
                                    <Badge className="bg-emerald-500 border-none text-[8px] uppercase">Synced</Badge>
                                ) : (
                                    <Badge variant="outline" className="text-white/40 border-white/20 text-[8px] uppercase">Not Linked</Badge>
                                )}
                            </div>
                            {syncedChannels.includes('telegram') ? (
                                <div>
                                    <p className="text-sm font-black">3.2K</p>
                                    <p className="text-[9px] font-bold uppercase text-white/40">Подписчиков</p>
                                    <div className="flex items-center gap-2 text-[9px] font-black text-blue-400 uppercase mt-2">
                                        <TrendingUp className="h-3 w-3" /> Avg Views: 1.5K
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-xs font-bold text-white/60">Синхронизировать Telegram</p>
                                    <button 
                                        onClick={() => handleSync('telegram')}
                                        disabled={isSyncing === 'telegram'}
                                        className="text-[9px] font-black uppercase text-indigo-400 hover:text-white transition-colors underline decoration-2 underline-offset-4 flex items-center gap-2"
                                    >
                                        {isSyncing === 'telegram' ? <><Loader2 className="h-3 w-3 animate-spin" /> Authorizing...</> : "Connect Channel"}
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="bg-indigo-600/20 rounded-2xl p-3 border border-indigo-500/30 space-y-4">
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-indigo-300">
                                <ShieldCheck className="h-4 w-4" /> Текущие привилегии
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight text-white/80">Early Access SS26</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight text-white/80">Influencer Discount -20%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight text-white/80">Private Showroom Access</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-white/60">Ваш Syntha Influence Score</h5>
                            <Badge className="bg-indigo-500 text-white border-none font-black">82 / 100</Badge>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[82%] bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500" />
                        </div>
                        <p className="text-[9px] text-white/40 mt-3 font-medium leading-relaxed">
                            На основе ваших социальных сетей, ER и качества контента на платформе Syntha. 
                            До следующего уровня (MEGA) осталось 18 баллов.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-xl border shadow-sm">
                <CardHeader>
                    <CardTitle>Предпочтения</CardTitle>
                    <CardDescription>Тема, плотность интерфейса, локаль и валюта.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                    <div className="text-sm font-medium">Тема</div>
                    <Select
                        value={settings.ui.theme}
                        onValueChange={(v) => onChange({ ...settings, ui: { ...settings.ui, theme: v as any } })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="system">Системная</SelectItem>
                            <SelectItem value="light">Светлая</SelectItem>
                            <SelectItem value="dark">Тёмная</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <div className="text-sm font-medium">Плотность интерфейса</div>
                    <Select
                        value={settings.ui.density}
                        onValueChange={(v) => onChange({ ...settings, ui: { ...settings.ui, density: v as any } })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="comfortable">Обычная</SelectItem>
                            <SelectItem value="compact">Компактная</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <div className="text-sm font-medium">Язык/локаль</div>
                    <Select
                        value={settings.ui.locale}
                        onValueChange={(v) => onChange({ ...settings, ui: { ...settings.ui, locale: v } })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ru-RU">Русский (ru-RU)</SelectItem>
                            <SelectItem value="en-US">English (en-US)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <div className="text-sm font-medium">Валюта</div>
                    <Select
                        value={settings.ui.currency}
                        onValueChange={(v) => onChange({ ...settings, ui: { ...settings.ui, currency: v } })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="RUB">RUB (₽)</SelectItem>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
        </div>
    );
}
