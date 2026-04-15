'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, ChevronRight, ShoppingBag, Heart, Trash2, Save, Send, Eye, Package, ShieldCheck, Zap, Layers, Info, AlertTriangle, FileCheck, Scan, Shirt as ShirtIcon, Star, FileText, Activity, Download, ExternalLink, MousePointer2, Share2, MessageSquare, CheckCircle2, Users, UserPlus, Info as InfoIcon, Target, Wallet, Layers as LayersIcon, ArrowRightLeft, Quote, Truck, Award, Smartphone, MapPin, Map, Layout, BarChart3, DoorOpen, GraduationCap, RefreshCw, Scissors, ScanLine, Flame, UserCheck, CalendarDays, Leaf, Landmark, Coins, Wrench, Rocket, Scale, BookOpen, CreditCard, Box, Footprints } from 'lucide-react';
import { products } from '@/lib/products';
import { calculateTieredPrice } from '@/lib/fashion/tiered-pricing';
import { getActiveSession, saveSessionState } from '@/lib/fashion/showroom-session';
import { detectOrderAnomalies } from '@/lib/fashion/order-anomaly';
import { getHonestMarkStatus } from '@/lib/fashion/honest-mark-compliance';
import { generateB2BContract } from '@/lib/fashion/b2b-contract-generator';
import { getFulfillmentRisk } from '@/lib/fashion/fulfillment-risk';
import { getShowroomEngagement } from '@/lib/fashion/showroom-engagement';
import { getEdiDocuments, getEdiOperatorLink } from '@/lib/fashion/edi-tracking';
import { getPartnerContentPacks } from '@/lib/fashion/partner-content';
import { analyzeAssortmentGaps } from '@/lib/fashion/assortment-gaps';
import { getSessionParticipants } from '@/lib/fashion/session-presence';
import { calculateEaeuCustomsValue } from '@/lib/fashion/eaeu-customs-calc';
import { getPaymentMilestones } from '@/lib/fashion/payment-milestones';
import { getStockExchangeOffers } from '@/lib/fashion/stock-exchange';
import { getMarketplaceSentiment } from '@/lib/fashion/marketplace-sentiment';
import { getSampleTraffic } from '@/lib/fashion/sample-traffic';
import { getOptimizedLogisticsRoutes } from '@/lib/fashion/logistics-optimizer';
import { getB2BLoyaltyQuests } from '@/lib/fashion/loyalty-quests';
import { getRemotePresence } from '@/lib/fashion/remote-presence';
import { getRegionalDemandHeatmap } from '@/lib/fashion/demand-heatmap';
import { generateVMPlanogram } from '@/lib/fashion/vm-planogram';
import { getStorePerformanceAnalytics } from '@/lib/fashion/store-performance';
import { getFittingRoomFeedback } from '@/lib/fashion/fitting-room-feedback';
import { getStaffKnowledgePack } from '@/lib/fashion/staff-knowledge-hub';
import { getStoreStockSwapOffers } from '@/lib/fashion/stock-swap';
import { getDynamicMarkdown } from '@/lib/fashion/markdown-optimizer';
import { getLatestRFIDScan } from '@/lib/fashion/rfid-scanner';
import { getStoreZoneHeatmap } from '@/lib/fashion/store-zone-heatmap';
import { getB2BClientelingData } from '@/lib/fashion/clienteling-hub';
import { getSustainabilityLedger } from '@/lib/fashion/sustainability-ledger';
import { getPartnerCreditScore } from '@/lib/fashion/partner-credit-score';
import { getStaffCommissionScheme } from '@/lib/fashion/staff-commissions';
import { getB2BRepairRequests } from '@/lib/fashion/repair-hub';
import { generateStoreContentPosts } from '@/lib/fashion/retail-content-autopilot';
import { getWholesaleAllocationFairness } from '@/lib/fashion/wholesale-allocation';
import { getStaffTrainingPack } from '@/lib/fashion/staff-training-hub';
import { getB2BPreOrderFinancing } from '@/lib/fashion/b2b-financing';
import { getClickAndCollectStatus } from '@/lib/fashion/click-collect-logic';
import { getStoreZoneConversions } from '@/lib/fashion/store-traffic-sim';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function ShowroomSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const session = getActiveSession(id);
  const [activeSku, setActiveSku] = useState(session?.activeSkus[0] || 'SKU-101');
  const [orderDraft, setOrderDraft] = useState(session?.orderDraft || []);
  const [viewMode, setViewMode] = useState<'sku' | 'look'>('sku');
  const [isContractLoading, setIsContractLoading] = useState(false);

  const currentProduct = products.find(p => p.sku === activeSku) || products[0];

  // Batch 36 Hooks
  const trainingPack = useMemo(() => getStaffTrainingPack(activeSku), [activeSku]);
  const clickCollect = useMemo(() => getClickAndCollectStatus('ORD-2026-99'), []);
  const storeConversions = useMemo(() => getStoreZoneConversions('STORE-MOSCOW-CENTRAL'), []);
  
  const totalWholesale = useMemo(() => {
    return orderDraft.reduce((acc, item) => {
      const price = calculateTieredPrice(item.sku, item.quantity);
      return acc + (price * item.quantity);
    }, 0);
  }, [orderDraft]);

  const financing = useMemo(() => getB2BPreOrderFinancing(totalWholesale), [totalWholesale]);

  // Existing hooks
  const creditScore = useMemo(() => getPartnerCreditScore('P-001'), []);
  const allocation = useMemo(() => getWholesaleAllocationFairness(activeSku), [activeSku]);
  const commission = useMemo(() => getStaffCommissionScheme(activeSku), [activeSku]);

  const handleAddToDraft = (sku: string) => {
    setOrderDraft(prev => {
      const existing = prev.find(i => i.sku === sku);
      if (existing) return prev.map(i => i.sku === sku ? { ...i, quantity: i.quantity + 10 } : i);
      return [...prev, { sku, quantity: 10 }];
    });
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 p-8">
      {/* HUD Header */}
      <div className="flex justify-between items-center mb-12 border-b border-slate-800 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-fuchsia-600 animate-pulse border-none text-[9px]">BATCH 36 • RETAIL OPS PRO</Badge>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Showroom: Store Ops RU</h1>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              ID: {id} • Mode: Advanced B2B Logistics
            </p>
            {/* Financing HUD */}
            <div className="flex gap-2">
               <Badge className="bg-amber-500/20 text-amber-400 border-none text-[8px] flex gap-1.5 items-center px-2 h-5 uppercase font-black">
                  <CreditCard className="w-3 h-3" /> RU Split: 30/70 Active
               </Badge>
               <Badge className="bg-sky-500/20 text-sky-400 border-none text-[8px] flex gap-1.5 items-center px-2 h-5 uppercase font-black">
                  <Box className="w-3 h-3" /> C&C Efficiency: 92%
               </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-white font-black uppercase text-[10px]">
             Training Hub
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] min-w-[150px]"
          >
             Finalize Pre-Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 h-[calc(100vh-250px)]">
        {/* Left Sidebar */}
        <div className="col-span-2 space-y-4 overflow-y-auto pr-4 scrollbar-hide pb-12">
           {/* Staff Training Card */}
           <Card className="p-4 bg-indigo-900/20 border-indigo-500/30 border-2 mb-4">
              <div className="flex items-center gap-2 mb-3">
                 <BookOpen className="w-4 h-4 text-indigo-400" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Staff Argumentation</h3>
              </div>
              <div className="space-y-3">
                 {trainingPack.keySellingPointsRu.slice(0, 2).map((point, idx) => (
                   <div key={idx} className="text-[8px] font-medium text-slate-400 leading-tight">
                      • {point}
                   </div>
                 ))}
                 <div className="pt-2 border-t border-indigo-500/10 flex justify-between items-center text-[7px] font-black uppercase">
                    <span className="text-indigo-400">Training Video</span>
                    <Play className="w-2.5 h-2.5" />
                 </div>
              </div>
           </Card>

           {/* Store Traffic & Conversion HUD */}
           <Card className="p-4 bg-slate-800/80 border-slate-700 border mb-4">
              <div className="flex items-center gap-2 mb-3">
                 <Footprints className="w-4 h-4 text-slate-400" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Zone Conversion</h3>
              </div>
              <div className="space-y-2">
                 {storeConversions.map(zone => (
                   <div key={zone.zoneName} className="flex justify-between items-center text-[8px] font-black uppercase p-1.5 bg-black/20 rounded">
                      <span className="text-slate-400 truncate w-24">{zone.zoneName}</span>
                      <span className="text-emerald-400">{zone.conversionPercent}%</span>
                   </div>
                 ))}
              </div>
           </Card>

           {/* Click & Collect Status Card */}
           <Card className="p-4 bg-sky-900/20 border-sky-500/30 border-2">
              <div className="flex items-center gap-2 mb-3">
                 <Box className="w-4 h-4 text-sky-400" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">C&C Monitor</h3>
              </div>
              <div className="space-y-2">
                 <div className="text-[9px] font-black uppercase text-sky-400">{clickCollect.status}</div>
                 <div className="text-[7px] text-slate-500 uppercase font-bold tracking-widest">Store: Central Moscow</div>
                 <div className="text-[7px] text-slate-300 uppercase font-black pt-1">Pickup by: {clickCollect.readyForPickupDate}</div>
              </div>
           </Card>
        </div>

        {/* Center Viewport */}
        <div className="col-span-7 bg-slate-800/30 rounded-3xl border-2 border-slate-800 overflow-hidden relative group">
           {/* Overlays */}
           <div className="absolute top-24 right-8 z-20 space-y-4 pointer-events-none w-64">
              {/* B2B Financing Overlay */}
              <div className="bg-amber-600/90 backdrop-blur-md text-white p-4 rounded-xl border border-white/20 shadow-2xl animate-in slide-in-from-right duration-500">
                 <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">30/70 Financing RU</span>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase">
                       <span className="text-amber-200">Deposit (30%)</span>
                       <span>{financing.depositAmount.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase">
                       <span className="text-amber-200">Remaining (70%)</span>
                       <span>{financing.remainingAmount.toLocaleString()} ₽</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/10 text-[8px] font-bold uppercase text-center">
                       No interest for {financing.creditTermDays} days
                    </div>
                 </div>
              </div>
           </div>

           {/* Focus Product View */}
           <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
              <div className="w-[450px] aspect-[3/4] bg-slate-700 rounded-2xl shadow-2xl relative overflow-hidden ring-4 ring-indigo-500/20 group-hover:scale-[1.02] transition-transform duration-500">
                 <img src={currentProduct.images?.[0]?.url ?? ""} alt={currentProduct.name} className="w-full h-full object-cover" />
                 
                 <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-white">
                       <h2 className="text-xl font-black uppercase tracking-tight mb-1">{currentProduct.name}</h2>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-indigo-400">Retail Excellence Pack Active</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 space-y-6 overflow-y-auto pr-2 scrollbar-hide pb-8">
           <Card className="p-6 bg-slate-800/80 border-slate-700 text-white shadow-2xl">
              <h3 className="font-black text-xs uppercase mb-6 flex items-center gap-2 tracking-widest text-slate-400">
                 <ShoppingBag className="w-4 h-4 text-indigo-400" /> B2B Order Draft
              </h3>
              
              <div className="space-y-4 max-h-80 overflow-y-auto mb-6 pr-2 text-[10px] font-black uppercase">
                 {orderDraft.map(item => {
                    const p = products.find(prod => prod.sku === item.sku);
                    return (
                      <div key={item.sku} className="flex gap-3 items-center group relative border-b border-slate-700 pb-3">
                         <div className="w-10 h-14 bg-slate-700 rounded overflow-hidden">
                            <img src={p?.images?.[0]?.url ?? ""} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="truncate text-slate-300">{p?.name}</div>
                            <div className="text-indigo-400 mt-1">{item.quantity} Units</div>
                         </div>
                      </div>
                    );
                 })}
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 mb-6">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase text-slate-500">Order Value</span>
                    <span className="text-lg font-black text-white">{totalWholesale.toLocaleString()} ₽</span>
                 </div>
              </div>

              <Button 
                onClick={() => handleAddToDraft(activeSku)}
                className="w-full h-12 bg-white text-black hover:bg-slate-100 font-black uppercase text-xs tracking-widest"
              >
                 Add 10 Units to Draft
              </Button>
           </Card>

           <Card className="p-6 bg-slate-800/80 border-slate-700 border text-white shadow-2xl">
              <h3 className="font-black text-[10px] uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
                 <Scale className="w-4 h-4 text-indigo-400" /> B2B Fair Allocation
              </h3>
              <div className="space-y-2">
                 <div className="text-[12px] font-black text-indigo-400">{allocation.fairnessScore}% Score</div>
                 <p className="text-[8px] text-slate-500 leading-tight uppercase font-bold">{allocation.reasoning}</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
