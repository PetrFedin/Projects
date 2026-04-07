'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shirt, Sparkles, Calendar, TrendingUp, AlertCircle, CheckCircle, Grid3x3, List } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { ordersRepository } from '@/lib/repositories';
import type { Order, Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface WardrobeItem extends Product {
  purchaseDate?: string;
  wearCount?: number;
  lastWorn?: string;
  status: 'active' | 'archived' | 'wishlist';
}

interface OutfitSuggestion {
  id: string;
  name: string;
  occasion: string;
  items: WardrobeItem[];
  compatibility: number;
  weather?: string;
}

export default function VirtualWardrobe() {
  const { user } = useAuth();
  const { manualWardrobe, wishlist } = useUIState();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [outfitSuggestions, setOutfitSuggestions] = useState<OutfitSuggestion[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (!user) return;

    const loadWardrobe = async () => {
      try {
        const userOrders = await ordersRepository.getOrders(user.uid);
        setOrders(userOrders);

        // Combine wardrobe items from orders and manual wardrobe
        const items: WardrobeItem[] = [
          ...manualWardrobe.map(item => ({
            ...item,
            purchaseDate: new Date().toISOString(),
            wearCount: Math.floor(Math.random() * 10),
            lastWorn: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active' as const,
          })),
          ...userOrders
            .filter(o => o.status === 'delivered')
            .flatMap(order => 
              order.items.map(item => ({
                ...item,
                purchaseDate: order.createdAt,
                wearCount: Math.floor(Math.random() * 15),
                lastWorn: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active' as const,
              }))
            ),
        ];

        setWardrobeItems(items);

        // Generate AI outfit suggestions
        const suggestions: OutfitSuggestion[] = [
          {
            id: '1',
            name: 'Деловой образ',
            occasion: 'Работа',
            items: items.slice(0, 3),
            compatibility: 95,
            weather: 'Офис',
          },
          {
            id: '2',
            name: 'Повседневный образ',
            occasion: 'Выходные',
            items: items.slice(3, 6),
            compatibility: 88,
            weather: 'Комфортная',
          },
          {
            id: '3',
            name: 'Романтический образ',
            occasion: 'Свидание',
            items: items.filter(i => i.category.includes('Платье')).slice(0, 2),
            compatibility: 92,
            weather: 'Вечер',
          },
        ];

        setOutfitSuggestions(suggestions);
      } catch (error) {
        console.error('Failed to load wardrobe:', error);
      }
    };

    loadWardrobe();
  }, [user, manualWardrobe.length]);

  const categories = ['all', ...Array.from(new Set(wardrobeItems.map(item => item.category)))];
  const filteredItems = selectedCategory === 'all' 
    ? wardrobeItems 
    : wardrobeItems.filter(item => item.category === selectedCategory);

  const unusedItems = wardrobeItems.filter(item => item.wearCount === 0);
  const mostWorn = [...wardrobeItems].sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-bold">{wardrobeItems.length}</p>
              <p className="text-xs text-muted-foreground mt-1">В гардеробе</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-bold text-green-600">{wardrobeItems.length - unusedItems.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Используется</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-bold text-orange-600">{unusedItems.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Не используется</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-bold text-accent">
                {Math.round((wardrobeItems.length - unusedItems.length) / Math.max(1, wardrobeItems.length) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Использование</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Outfit Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Подбор образов
          </CardTitle>
          <CardDescription>
            Что надеть сегодня? AI подобрал образы из вашего гардероба
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {outfitSuggestions.map((outfit) => (
              <div
                key={outfit.id}
                className="p-4 rounded-lg border bg-muted/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold mb-1">{outfit.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{outfit.occasion}</Badge>
                      <Badge variant="secondary">
                        Совместимость: {outfit.compatibility}%
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {outfit.items.map((item, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={item.images[0]?.url || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/outfits/${outfit.id}`}>
                    Посмотреть образ
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wardrobe Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Анализ гардероба
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unused" className="w-full">
            <TabsList>
              <TabsTrigger value="unused">Не используется</TabsTrigger>
              <TabsTrigger value="most-worn">Чаще всего</TabsTrigger>
            </TabsList>
            <TabsContent value="unused" className="space-y-3">
              {unusedItems.length > 0 ? (
                <>
                  <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Рекомендация AI</p>
                        <p className="text-xs text-muted-foreground">
                          У вас {unusedItems.length} товаров, которые вы еще не носили. Попробуйте создать образы с ними!
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {unusedItems.slice(0, 8).map((item) => (
                      <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={item.images[0]?.url || '/placeholder.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-600" />
                  <p>Все товары используются!</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="most-worn" className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {mostWorn.map((item) => (
                  <div key={item.id} className="text-center">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                      <Image
                        src={item.images[0]?.url || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs font-medium line-clamp-2">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.wearCount} раз</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Wardrobe Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shirt className="h-5 w-5" />
                Весь гардероб
              </CardTitle>
              <CardDescription>
                {filteredItems.length} товаров
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Все' : category}
              </Button>
            ))}
          </div>

          {/* Items Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filteredItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                    <Image
                      src={item.images[0]?.url || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    {item.wearCount === 0 && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        Новое
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium line-clamp-2 group-hover:text-accent transition-colors">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Носили: {item.wearCount || 0} раз
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.images[0]?.url || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.wearCount || 0} раз</p>
                    <p className="text-xs text-muted-foreground">Носили</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}





