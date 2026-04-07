'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Scan, 
  HelpCircle, 
  ChevronRight, 
  Shirt, 
  RotateCcw, 
  BellRing, 
  ShoppingCart, 
  CheckCircle,
  Sparkles,
  Zap,
  Star,
  Layers,
  ShoppingBag,
  Info,
  Maximize,
  ArrowLeftRight,
  UserCheck
} from 'lucide-react';
import { FittingRoomItem, FittingRoomRequest } from '@/lib/types/retail';
import { cn } from '@/lib/utils';

/**
 * Smart Fitting Room Interface (Mirror OS)
 * Интерфейс умного зеркала в примерочной.
 */

export default function SmartMirrorPage() {
  const [sessionItems, setSessionItems] = useState<FittingRoomItem[]>([
    { id: 'item-1', productId: 'p-1', variantId: 'v-1', sku: 'BL-SLK-M', name: 'Silk Satin Blouse', size: 'S', color: 'Ivory', price: 125, imageUrl: '/products/blouse-ivory.jpg', status: 'brought_in' },
    { id: 'item-2', productId: 'p-2', variantId: 'v-2', sku: 'TRS-WOL-M', name: 'Wide-Leg Wool Trousers', size: '38', color: 'Charcoal', price: 185, imageUrl: '/products/trousers-charcoal.jpg', status: 'brought_in' },
  ]);

  const [activeItem, setActiveItem] = useState<FittingRoomItem | null>(sessionItems[0]);
  const [requests, setRequests] = useState<FittingRoomRequest[]>([]);
  const [isCallingAssistant, setIsCallingAssistant] = useState(false);

  const requestAlternativeSize = (item: FittingRoomItem, size: string) => {
    const newRequest: FittingRoomRequest = {
      id: `REQ-${Date.now()}`,
      type: 'size_change',
      status: 'pending',
      itemId: item.id,
      targetSize: size,
      timestamp: new Date().toISOString()
    };
    setRequests([...requests, newRequest]);
  };

  const callAssistant = () => {
    setIsCallingAssistant(true);
    setTimeout(() => setIsCallingAssistant(false), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col gap-3 font-sans overflow-hidden">
      {/* Mirror Header */}
      <header className="flex justify-between items-center border-b border-white/10 pb-8">
        <div className="flex items-center gap-3">
           <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-indigo-400" />
           </div>
           <div>
              <h1 className="text-base font-black font-headline tracking-tighter uppercase italic">Synth-1 Mirror</h1>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Smart Fitting Suite 04</p>
           </div>
        </div>
        
        <div className="flex gap-3">
           <Button 
              onClick={callAssistant}
              className={cn(
                "h-12 px-8 rounded-full font-black uppercase text-xs gap-3 border-2 transition-all",
                isCallingAssistant 
                   ? "bg-indigo-600 border-indigo-500 text-white animate-pulse" 
                   : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              )}
           >
              <BellRing className="w-5 h-5" />
              {isCallingAssistant ? "Assistant Summoned" : "Call Assistant"}
           </Button>
           <Button className="h-12 w-12 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10">
              <Settings2 className="w-6 h-6" />
           </Button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-3 overflow-hidden">
        {/* Left Column: Items in Room */}
        <div className="col-span-4 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Items in Room</h3>
           <div className="space-y-4">
              {sessionItems.map((item) => (
                 <div 
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    className={cn(
                       "p-4 rounded-xl transition-all cursor-pointer border-2",
                       activeItem?.id === item.id 
                          ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    )}
                 >
                    <div className="flex gap-3">
                       <div className="w-20 h-28 bg-black/10 rounded-2xl overflow-hidden">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-80" />
                       </div>
                       <div className="flex-1 space-y-2">
                          <p className="text-sm font-black uppercase leading-tight">{item.name}</p>
                          <div className="flex gap-2">
                             <Badge variant="outline" className={cn(
                                "text-[9px] font-black uppercase h-5",
                                activeItem?.id === item.id ? "border-black text-black" : "border-white/20 text-white/60"
                             )}>Size: {item.size}</Badge>
                             <Badge variant="outline" className={cn(
                                "text-[9px] font-black uppercase h-5",
                                activeItem?.id === item.id ? "border-black text-black" : "border-white/20 text-white/60"
                             )}>{item.color}</Badge>
                          </div>
                          <p className="text-sm font-black">${item.price}</p>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Center/Main Column: Active Item Details & AI Stylist */}
        <div className="col-span-8 flex flex-col gap-3 overflow-hidden">
           {activeItem ? (
              <div className="flex-1 grid grid-cols-2 gap-3 overflow-hidden">
                 {/* Item Focus */}
                 <div className="space-y-4 flex flex-col">
                    <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-3 flex flex-col justify-center items-center text-center relative overflow-hidden">
                       <div className="absolute top-3 right-10 flex flex-col gap-3">
                          <Button variant="ghost" className="h-12 w-12 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-xl border border-white/10">
                             <Maximize className="w-5 h-5" />
                          </Button>
                       </div>
                       
                       <div className="w-64 h-80 bg-white/5 rounded-3xl overflow-hidden mb-8 shadow-2xl">
                          <img src={activeItem.imageUrl} alt={activeItem.name} className="w-full h-full object-cover" />
                       </div>
                       
                       <h2 className="text-base font-black uppercase italic tracking-tighter mb-2">{activeItem.name}</h2>
                       <div className="flex gap-3 mb-8">
                          <span className="text-sm font-black text-indigo-400 uppercase tracking-widest italic">{activeItem.sku}</span>
                          <span className="text-white/20">/</span>
                          <span className="text-sm font-black text-white/40 uppercase tracking-widest">{activeItem.color}</span>
                       </div>

                       <div className="grid grid-cols-2 gap-3 w-full">
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                             <p className="text-[9px] font-black uppercase text-white/40 mb-1">In Stock</p>
                             <p className="text-sm font-black text-emerald-400">Low (2 left)</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                             <p className="text-[9px] font-black uppercase text-white/40 mb-1">Sustainability</p>
                             <p className="text-sm font-black text-indigo-400">92% Echo</p>
                          </div>
                       </div>
                    </div>

                    {/* 3D Body Scan Integration (New Feature) */}
                    <Card className="bg-indigo-600/20 border-indigo-500/30 rounded-xl p-4 border-2 relative overflow-hidden group">
                       <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                          <Scan className="w-24 h-24 text-white" />
                       </div>
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                             <Monitor className="w-5 h-5 text-indigo-400" />
                             <h4 className="text-sm font-black uppercase tracking-tight italic">Digital Twin Sync</h4>
                          </div>
                          <Badge className="bg-indigo-500 text-white border-none text-[8px] font-black uppercase h-5 px-2">Connected</Badge>
                       </div>
                       <div className="flex gap-3 items-center">
                          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                             <UserCheck className="w-8 h-8 text-indigo-400" />
                          </div>
                          <div className="flex-1">
                             <p className="text-xs font-bold text-white/80">3D Body Scan (v2.4) Loaded</p>
                             <div className="flex gap-3 mt-2">
                                <div className="text-[10px] font-black uppercase text-white/40">Chest: <span className="text-white">94.2cm</span></div>
                                <div className="text-[10px] font-black uppercase text-white/40">Waist: <span className="text-white">78.5cm</span></div>
                             </div>
                          </div>
                          <Button size="sm" className="h-9 rounded-xl bg-white text-indigo-600 font-black uppercase text-[9px] px-4 hover:scale-105 transition-transform active:scale-95">
                             Recalibrate
                          </Button>
                       </div>
                    </Card>

                    {/* Actions Grid */}
                    <div className="grid grid-cols-2 gap-3 h-32">
                       <Button 
                          onClick={() => requestAlternativeSize(activeItem, 'M')}
                          className="h-full bg-white text-black hover:bg-indigo-400 hover:text-white transition-all rounded-xl font-black uppercase text-xs flex flex-col gap-2"
                       >
                          <ArrowLeftRight className="w-5 h-5 mb-1" />
                          Change Size
                       </Button>
                       <Button className="h-full bg-white/5 text-white border border-white/10 hover:bg-white/10 rounded-xl font-black uppercase text-xs flex flex-col gap-2">
                          <RotateCcw className="w-5 h-5 mb-1" />
                          Try Other Color
                       </Button>
                    </div>
                 </div>

                 {/* AI Styling Column */}
                 <div className="flex flex-col gap-3">
                    <Card className="border-none bg-gradient-to-br from-indigo-900/40 to-black rounded-xl p-4 space-y-6 flex-1 border border-white/10 backdrop-blur-xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                          <Zap className="w-24 h-24 text-indigo-400" />
                       </div>
                       
                       <div className="flex items-center gap-3">
                          <Sparkles className="w-6 h-6 text-indigo-400" />
                          <h3 className="text-sm font-black uppercase tracking-tight italic">AI Stylist Insight</h3>
                       </div>

                       <p className="text-sm text-white/70 leading-relaxed font-medium">
                          "This {activeItem.name} in {activeItem.color} works perfectly with the Charcoal Wide-Leg Trousers you brought in. 
                          For a complete look, consider adding the **Silver Link Belt** and **Pointed Toe Pumps**."
                       </p>

                       <div className="space-y-4 pt-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Complete the look</h4>
                          <div className="space-y-3">
                             {[
                                { name: 'Silver Link Belt', price: 45, icon: Layers },
                                { name: 'Pointed Toe Pumps', price: 165, icon: ShoppingBag }
                             ].map((suggestion, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                                   <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                                         <suggestion.icon className="w-5 h-5 text-indigo-400" />
                                      </div>
                                      <div>
                                         <p className="text-[11px] font-black uppercase">{suggestion.name}</p>
                                         <p className="text-xs font-bold text-white/40">${suggestion.price}</p>
                                      </div>
                                   </div>
                                   <Button size="icon" className="h-8 w-8 rounded-full bg-white text-black opacity-0 group-hover:opacity-100 transition-all">
                                      <Plus className="w-4 h-4" />
                                   </Button>
                                </div>
                             ))}
                          </div>
                       </div>
                    </Card>

                    <Card className="border-none bg-emerald-500/10 rounded-xl p-4 flex items-center justify-between border border-emerald-500/20">
                       <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                             <ShoppingBag className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 mb-1">Mirror Checkout</p>
                             <p className="text-sm font-black uppercase italic">Add all to Bag</p>
                          </div>
                       </div>
                       <Button className="h-12 w-12 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 border-none">
                          <ShoppingCart className="w-5 h-5" />
                       </Button>
                    </Card>
                 </div>
              </div>
           ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                 <div className="h-32 w-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
                    <Scan className="w-12 h-12 text-white/20" />
                 </div>
                 <div className="space-y-2">
                    <h2 className="text-sm font-black uppercase italic">Ready for Scanning</h2>
                    <p className="text-sm text-white/40 max-w-xs mx-auto">Bring items close to the mirror to automatically display details and styling advice.</p>
                 </div>
              </div>
           )}
        </div>
      </div>

      {/* Footer / Active Requests Bar */}
      {requests.length > 0 && (
         <footer className="fixed bottom-12 left-12 right-12 z-50">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-4 rounded-full flex items-center gap-3 shadow-2xl animate-in slide-in-from-bottom-10">
               <div className="flex items-center gap-3 pl-4">
                  <RotateCcw className="w-5 h-5 text-indigo-400 animate-spin-slow" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Active Requests ({requests.length})</span>
               </div>
               <div className="flex-1 flex gap-3 overflow-x-auto custom-scrollbar-hide">
                  {requests.map(req => (
                     <Badge key={req.id} className="h-10 px-6 rounded-full bg-white text-black border-none gap-3 font-black text-[9px] uppercase whitespace-nowrap">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        Bring {req.targetSize} {sessionItems.find(i => i.id === req.itemId)?.name}
                     </Badge>
                  ))}
               </div>
               <Button variant="ghost" className="h-10 px-6 rounded-full text-white/40 hover:text-white uppercase font-black text-[9px]">
                  Clear All
               </Button>
            </div>
         </footer>
      )}
    </div>
  );
}

// Add these to global CSS or as style tag
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 2px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  .custom-scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .animate-spin-slow {
    animation: spin 3s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
