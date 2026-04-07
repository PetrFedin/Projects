'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, RotateCcw, Eye, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';

interface RecentOrder {
  id: string;
  name: string;
  sku: string;
  lastOrderDate: string;
  lastQuantity: number;
  image: string;
  price: number;
  inStock: boolean;
  brand: string;
}

export function QuickReorderBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Mock data - последние заказанные товары
  const recentOrders: RecentOrder[] = [
    {
      id: '1',
      name: 'Cyber Tech Parka',
      sku: 'CTP-26-001',
      brand: 'Syntha Lab',
      lastOrderDate: '2026-01-15',
      lastQuantity: 50,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=100',
      price: 28500,
      inStock: true
    },
    {
      id: '2',
      name: 'Nordic Wool Sweater',
      sku: 'NWS-26-042',
      brand: 'Nordic Wool',
      lastOrderDate: '2026-01-10',
      lastQuantity: 30,
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=100',
      price: 15000,
      inStock: true
    },
    {
      id: '3',
      name: 'Silk Road Scarf',
      sku: 'SRS-26-088',
      brand: 'Radical Chic',
      lastOrderDate: '2026-01-05',
      lastQuantity: 100,
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=100',
      price: 8500,
      inStock: false
    },
    {
      id: '4',
      name: 'Urban Cargo Pants',
      sku: 'UCP-26-101',
      brand: 'Syntha Lab',
      lastOrderDate: '2026-01-03',
      lastQuantity: 75,
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=100',
      price: 12000,
      inStock: true
    }
  ];
  
  const handleReorder = (item: RecentOrder) => {
    alert(`✅ Добавлено ${item.lastQuantity} шт. ${item.name} в корзину\n\nИтого: ${(item.price * item.lastQuantity).toLocaleString('ru-RU')} ₽`);
  };
  
  return (
    <Card className="sticky top-0 z-40 rounded-none border-x-0 border-t-0 border-b-2 border-indigo-100 shadow-lg bg-white/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 py-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <RotateCcw className="h-5 w-5 text-indigo-600" />
            <span className="font-black uppercase text-sm text-slate-900">
              Quick Reorder
            </span>
            <Badge className="bg-indigo-100 text-indigo-700 text-[7px] font-black uppercase border-none">
              Last 30 Days
            </Badge>
          </div>
          
          <div className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar">
            {recentOrders.slice(0, isExpanded ? 10 : 4).map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-xl border-2 transition-all flex-shrink-0",
                  item.inStock 
                    ? "bg-slate-50 border-slate-200 hover:border-indigo-300" 
                    : "bg-rose-50 border-rose-200"
                )}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                
                <div className="min-w-0">
                  <h4 className="text-[10px] font-black uppercase text-slate-900 truncate leading-tight w-32">
                    {item.name}
                  </h4>
                  <p className="text-[9px] text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.lastQuantity} шт • {new Date(item.lastOrderDate).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-slate-100"
                    asChild
                  >
                    <Link href={`/shop/b2b/products/${item.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button
                    size="sm"
                    className={cn(
                      "h-8 px-3 text-[8px] font-black uppercase rounded-lg",
                      item.inStock 
                        ? "bg-indigo-600 hover:bg-indigo-700" 
                        : "bg-slate-400 cursor-not-allowed"
                    )}
                    onClick={() => item.inStock && handleReorder(item)}
                    disabled={!item.inStock}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    {item.inStock ? 'Reorder' : 'Out'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-[8px] font-black uppercase flex-shrink-0 rounded-xl"
            asChild
          >
            <Link href="/shop/b2b/orders">
              All Orders
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
