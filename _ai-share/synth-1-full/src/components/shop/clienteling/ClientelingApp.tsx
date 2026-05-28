'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  User,
  ShoppingBag,
  Heart,
  Sparkles,
  QrCode,
  MessageSquare,
  Star,
  Calendar,
  MapPin,
  TrendingUp,
  ChevronRight,
  Camera,
  Bell,
  CheckCircle2,
  History,
  CreditCard,
  Box,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { products as allProducts } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

const MOCK_CUSTOMER = {
  id: 'CUST-1092',
  name: 'Екатерина Романова',
  status: 'Platinum',
  avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  ltv: '240,500 ₽',
  lastVisit: '2 недели назад',
  preferences: ['Minimalism', 'Silk', 'Black & White', 'Size S'],
  wishlist: allProducts.slice(0, 3),
  recentPurchases: allProducts.slice(3, 5),
  notes: 'Предпочитает примерку в закрытом VIP-зале. Любит кофе без сахара.',
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
      title: 'Рекомендация отправлена',
      description: 'Клиент получит уведомление в Syntha App и Telegram.',
    });
  };

  return (
    <div className="bg-bg-surface2 border-text-primary relative mx-auto flex min-h-screen max-w-[450px] flex-col overflow-hidden rounded-xl border-[8px] shadow-2xl">
      {/* Mobile Header */}
      <header className="relative z-10 space-y-4 bg-white px-6 pb-6 pt-12 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
              Store Mode: Moscow City
            </span>
          </div>
          <div className="flex gap-2">
            <button className="bg-bg-surface2 text-text-primary flex h-10 w-10 items-center justify-center rounded-2xl">
              <QrCode className="h-5 w-5" />
            </button>
            <button className="bg-bg-surface2 text-text-primary relative flex h-10 w-10 items-center justify-center rounded-2xl">
              <Bell className="h-5 w-5" />
              <div className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Search className="text-text-muted absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск клиента по имени, ID или QR..."
            className="bg-bg-surface2 h-12 w-full rounded-2xl border-none pl-12 pr-4 text-sm font-bold outline-none"
          />
        </form>
      </header>

      {!isFound ? (
        <div className="flex flex-1 flex-col items-center justify-center space-y-6 p-4 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-white shadow-xl">
            <User className="text-text-muted h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-text-primary text-base font-black uppercase tracking-tight">
              Поиск клиента
            </h3>
            <p className="text-text-muted text-xs font-medium leading-relaxed">
              Введите данные для доступа к цифровому гардеробу и персональным рекомендациям.
            </p>
          </div>
        </div>
      ) : (
        <main className="scrollbar-hide flex-1 overflow-y-auto pb-24">
          {/* Customer Profile Card */}
          <div className="p-4">
            <Card className="space-y-6 overflow-hidden rounded-xl border-none bg-white p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="border-border-subtle relative h-20 w-20 overflow-hidden rounded-[1.5rem] border-4">
                  <Image
                    src={MOCK_CUSTOMER.avatar}
                    alt={MOCK_CUSTOMER.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <Badge className="bg-accent-primary border-none px-2 py-0.5 text-[8px] font-black uppercase text-white">
                      {MOCK_CUSTOMER.status}
                    </Badge>
                    <p className="text-text-muted text-[10px] font-black uppercase">
                      {MOCK_CUSTOMER.id}
                    </p>
                  </div>
                  <h3 className="text-text-primary text-sm font-black uppercase leading-none tracking-tight">
                    {MOCK_CUSTOMER.name}
                  </h3>
                  <p className="text-text-muted mt-1 text-[10px] font-bold uppercase italic">
                    Visit: {MOCK_CUSTOMER.lastVisit}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg-surface2 border-border-subtle rounded-2xl border p-4">
                  <p className="text-text-muted mb-1 text-[8px] font-black uppercase">Total LTV</p>
                  <p className="text-text-primary text-sm font-black">{MOCK_CUSTOMER.ltv}</p>
                </div>
                <div className="bg-bg-surface2 border-border-subtle rounded-2xl border p-4">
                  <p className="text-text-muted mb-1 text-[8px] font-black uppercase">Avg Score</p>
                  <div className="flex items-center gap-1">
                    <p className="text-text-primary text-sm font-black">4.9</p>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs Navigation */}
          <div className="px-6 pb-6">
            <div className="border-border-subtle flex rounded-2xl border bg-white p-1.5 shadow-sm">
              {[
                { id: 'profile', label: 'Info', icon: User },
                { id: 'wardrobe', label: 'Wardrobe', icon: ShoppingBag },
                { id: 'ai', label: 'AI Stylist', icon: Sparkles },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex flex-1 flex-col items-center gap-1.5 rounded-xl py-3 transition-all',
                    activeTab === tab.id
                      ? 'bg-text-primary text-white shadow-lg'
                      : 'text-text-muted hover:text-text-primary'
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-[8px] font-black uppercase tracking-widest">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6 px-6">
            {activeTab === 'profile' && (
              <div className="space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-3">
                  <h4 className="text-text-muted flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <History className="h-3.5 w-3.5" /> Заметки персонала
                  </h4>
                  <div className="rounded-[1.5rem] border border-amber-100 bg-amber-50 p-3 text-xs font-bold italic leading-relaxed text-amber-900">
                    "{MOCK_CUSTOMER.notes}"
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-text-muted flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <TrendingUp className="h-3.5 w-3.5" /> Предпочтения
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_CUSTOMER.preferences.map((pref) => (
                      <Badge
                        key={pref}
                        variant="outline"
                        className="border-border-default text-text-secondary rounded-lg px-3 py-1 text-[8px] font-black uppercase"
                      >
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wardrobe' && (
              <div className="space-y-4 duration-500 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-4">
                  <h4 className="text-text-muted flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>Wishlist (3)</span>
                    <button className="text-accent-primary">See All</button>
                  </h4>
                  <div className="scrollbar-hide -mx-2 flex gap-3 overflow-x-auto px-2">
                    {MOCK_CUSTOMER.wishlist.map((item) => (
                      <div key={item.id} className="group w-32 shrink-0 space-y-3">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-md">
                          <Image
                            src={item.images[0].url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          <button className="text-text-primary absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 shadow-lg backdrop-blur-md">
                            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                          </button>
                        </div>
                        <div className="px-1">
                          <p className="text-text-muted mb-0.5 truncate text-[8px] font-black uppercase">
                            {item.brand}
                          </p>
                          <p className="text-text-primary truncate text-[10px] font-black">
                            {item.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    В шкафу (куплено)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {MOCK_CUSTOMER.recentPurchases.map((item) => (
                      <Card
                        key={item.id}
                        className="space-y-3 rounded-2xl border-none bg-white p-3 shadow-md"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-xl">
                          <Image
                            src={item.images[0].url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-text-primary truncate text-center text-[9px] font-black">
                          {item.name}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-2">
                <Card className="bg-accent-primary group relative overflow-hidden rounded-xl border-none p-4 text-white shadow-xl">
                  <Sparkles className="absolute -right-4 -top-4 h-24 w-24 opacity-20 transition-transform duration-700 group-hover:scale-110" />
                  <div className="relative z-10 space-y-4">
                    <Badge className="border-none bg-white/20 px-2 py-0.5 text-[8px] font-black uppercase text-white">
                      AI Analysis
                    </Badge>
                    <h3 className="text-base font-black uppercase italic leading-none tracking-tight">
                      Style Insight
                    </h3>
                    <p className="text-accent-primary/30 text-xs font-bold leading-relaxed">
                      Екатерина не покупала аксессуары уже 3 месяца. На основе ее вишлиста и
                      недавней покупки шелкового платья, рекомендуем предложить:
                    </p>
                  </div>
                </Card>

                <div className="space-y-4">
                  <h4 className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    Персональный подбор
                  </h4>
                  <div className="space-y-3">
                    {allProducts.slice(6, 8).map((item) => (
                      <div
                        key={item.id}
                        className="border-border-subtle group flex items-center gap-3 rounded-[1.5rem] border bg-white p-4 shadow-sm transition-all hover:shadow-lg"
                      >
                        <div className="bg-bg-surface2 relative h-20 w-12 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={item.images[0].url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-text-muted mb-0.5 text-[8px] font-black uppercase">
                            {item.brand}
                          </p>
                          <h4 className="mb-2 truncate text-xs font-black uppercase leading-none tracking-tight">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge className="border-none bg-emerald-50 px-2 py-0.5 text-[8px] font-black uppercase text-emerald-600">
                              98% Match
                            </Badge>
                            <p className="text-text-primary text-xs font-black">
                              {item.price.toLocaleString('ru-RU')} ₽
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={handleSendRecommendation}
                          size="icon"
                          className="bg-text-primary hover:bg-accent-primary h-10 w-10 shrink-0 rounded-xl text-white transition-all"
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
        <div className="border-border-subtle absolute inset-x-0 bottom-0 z-20 flex gap-3 border-t bg-white/80 p-4 backdrop-blur-xl">
          <Button className="bg-text-primary h-10 flex-1 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-xl transition-all hover:bg-emerald-600">
            <MessageSquare className="mr-2 h-4 w-4" /> Чат с клиентом
          </Button>
          <Button
            variant="outline"
            className="border-border-default text-text-primary h-10 w-10 rounded-2xl bg-white"
          >
            <Camera className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
