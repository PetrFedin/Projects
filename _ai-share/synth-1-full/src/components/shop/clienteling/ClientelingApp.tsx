'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Search, User, ShoppingBag, Heart, 
    Sparkles, QrCode, MessageSquare, 
    Star, Calendar, MapPin, TrendingUp,
    ChevronRight, Camera, Bell, CheckCircle2,
    History, CreditCard, Box, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { products as allProducts } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

const MOCK_CUSTOMER = {
    id: 'CUST-1092',
    name: 'Екатерина Романова',
    status: 'Platinum',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    ltv: '240,500 ₽',
    lastVisit: '2 недели назад',
    preferences: ['Minimalism', 'Silk', 'Black & White', 'Size S'],
    wishlist: allProducts.slice(0, 3),
    recentPurchases: allProducts.slice(3, 5),
    notes: 'Предпочитает примерку в закрытом VIP-зале. Любит кофе без сахара.'
};

export default function ClientelingApp() {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'profile' | 'wardrobe' | 'ai'>('profile');
    const [isFound, setIsFound] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsFound(true);
    };

    const handleSendRecommendation = () => {
        toast({
            title: "Рекомендация отправлена",
            description: "Клиент получит уведомление в Syntha App и Telegram.",
        });
    };

    return (
        <div className="max-w-[450px] mx-auto min-h-screen bg-slate-50 flex flex-col shadow-2xl rounded-xl overflow-hidden border-[8px] border-slate-900 relative">
            {/* Mobile Header */}
            <header className="bg-white px-6 pt-12 pb-6 space-y-4 shadow-sm relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Store Mode: Moscow City</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900">
                            <QrCode className="h-5 w-5" />
                        </button>
                        <button className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 relative">
                            <Bell className="h-5 w-5" />
                            <div className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск клиента по имени, ID или QR..." 
                        className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-50 border-none outline-none text-sm font-bold"
                    />
                </form>
            </header>

            {!isFound ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-6">
                    <div className="h-24 w-24 bg-white rounded-xl shadow-xl flex items-center justify-center">
                        <User className="h-10 w-10 text-slate-300" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Поиск клиента</h3>
                        <p className="text-xs font-medium text-slate-400 leading-relaxed">
                            Введите данные для доступа к цифровому гардеробу и персональным рекомендациям.
                        </p>
                    </div>
                </div>
            ) : (
                <main className="flex-1 overflow-y-auto scrollbar-hide pb-24">
                    {/* Customer Profile Card */}
                    <div className="p-4">
                        <Card className="rounded-xl border-none shadow-xl bg-white overflow-hidden p-4 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-20 w-20 rounded-[1.5rem] overflow-hidden relative border-4 border-slate-50">
                                    <Image src={MOCK_CUSTOMER.avatar} alt={MOCK_CUSTOMER.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <Badge className="bg-indigo-600 text-white border-none text-[8px] font-black uppercase px-2 py-0.5">{MOCK_CUSTOMER.status}</Badge>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">{MOCK_CUSTOMER.id}</p>
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 leading-none">{MOCK_CUSTOMER.name}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic">Visit: {MOCK_CUSTOMER.lastVisit}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Total LTV</p>
                                    <p className="text-sm font-black text-slate-900">{MOCK_CUSTOMER.ltv}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Avg Score</p>
                                    <div className="flex items-center gap-1">
                                        <p className="text-sm font-black text-slate-900">4.9</p>
                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="px-6 pb-6">
                        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                            {[
                                { id: 'profile', label: 'Info', icon: User },
                                { id: 'wardrobe', label: 'Wardrobe', icon: ShoppingBag },
                                { id: 'ai', label: 'AI Stylist', icon: Sparkles }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl flex flex-col items-center gap-1.5 transition-all",
                                        activeTab === tab.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
                                    )}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="px-6 space-y-6">
                        {activeTab === 'profile' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <History className="h-3.5 w-3.5" /> Заметки персонала
                                    </h4>
                                    <div className="p-3 rounded-[1.5rem] bg-amber-50 border border-amber-100 text-xs font-bold text-amber-900 leading-relaxed italic">
                                        "{MOCK_CUSTOMER.notes}"
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <TrendingUp className="h-3.5 w-3.5" /> Предпочтения
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {MOCK_CUSTOMER.preferences.map(pref => (
                                            <Badge key={pref} variant="outline" className="rounded-lg border-slate-200 text-slate-600 text-[8px] font-black uppercase px-3 py-1">
                                                {pref}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'wardrobe' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
                                        <span>Wishlist (3)</span>
                                        <button className="text-indigo-600">See All</button>
                                    </h4>
                                    <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-2 px-2">
                                        {MOCK_CUSTOMER.wishlist.map(item => (
                                            <div key={item.id} className="w-32 shrink-0 space-y-3 group">
                                                <div className="aspect-[3/4] rounded-2xl bg-white shadow-md overflow-hidden relative">
                                                    <Image src={item.images[0].url} alt={item.name} fill className="object-cover" />
                                                    <button className="absolute bottom-2 right-2 h-8 w-8 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-lg">
                                                        <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                                                    </button>
                                                </div>
                                                <div className="px-1">
                                                    <p className="text-[8px] font-black uppercase text-slate-400 mb-0.5 truncate">{item.brand}</p>
                                                    <p className="text-[10px] font-black text-slate-900 truncate">{item.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">В шкафу (куплено)</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {MOCK_CUSTOMER.recentPurchases.map(item => (
                                            <Card key={item.id} className="rounded-2xl border-none shadow-md bg-white p-3 space-y-3">
                                                <div className="aspect-square rounded-xl overflow-hidden relative">
                                                    <Image src={item.images[0].url} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <p className="text-[9px] font-black text-slate-900 truncate text-center">{item.name}</p>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ai' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <Card className="rounded-xl border-none shadow-xl bg-indigo-600 text-white p-4 relative overflow-hidden group">
                                    <Sparkles className="absolute -right-4 -top-4 h-24 w-24 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                                    <div className="relative z-10 space-y-4">
                                        <Badge className="bg-white/20 text-white border-none font-black text-[8px] uppercase px-2 py-0.5">AI Analysis</Badge>
                                        <h3 className="text-base font-black uppercase tracking-tight leading-none italic">Style Insight</h3>
                                        <p className="text-xs font-bold leading-relaxed text-indigo-100">
                                            Екатерина не покупала аксессуары уже 3 месяца. На основе ее вишлиста и недавней покупки шелкового платья, рекомендуем предложить:
                                        </p>
                                    </div>
                                </Card>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Персональный подбор</h4>
                                    <div className="space-y-3">
                                        {allProducts.slice(6, 8).map(item => (
                                            <div key={item.id} className="flex items-center gap-3 p-4 rounded-[1.5rem] bg-white shadow-sm border border-slate-50 group hover:shadow-lg transition-all">
                                                <div className="h-20 w-12 rounded-xl bg-slate-50 relative overflow-hidden shrink-0">
                                                    <Image src={item.images[0].url} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[8px] font-black uppercase text-slate-400 mb-0.5">{item.brand}</p>
                                                    <h4 className="text-xs font-black uppercase tracking-tight truncate leading-none mb-2">{item.name}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase px-2 py-0.5">98% Match</Badge>
                                                        <p className="text-xs font-black text-slate-900">{item.price.toLocaleString('ru-RU')} ₽</p>
                                                    </div>
                                                </div>
                                                <Button 
                                                    onClick={handleSendRecommendation}
                                                    size="icon" 
                                                    className="h-10 w-10 rounded-xl bg-slate-900 hover:bg-indigo-600 transition-all text-white shrink-0"
                                                >
                                                    <Zap className="h-4 w-4 fill-white" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            )}

            {/* Bottom Action Bar */}
            {isFound && (
                <div className="absolute bottom-0 inset-x-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex gap-3 z-20">
                    <Button className="flex-1 h-10 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">
                        <MessageSquare className="mr-2 h-4 w-4" /> Чат с клиентом
                    </Button>
                    <Button variant="outline" className="h-10 w-10 rounded-2xl border-slate-200 bg-white text-slate-900">
                        <Camera className="h-5 w-5" />
                    </Button>
                </div>
            )}
        </div>
    );
}
