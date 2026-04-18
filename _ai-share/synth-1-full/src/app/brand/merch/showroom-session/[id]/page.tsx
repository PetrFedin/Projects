'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  ChevronRight,
  ShoppingBag,
  Heart,
  Trash2,
  Save,
  Send,
  Eye,
  Package,
  ShieldCheck,
  Zap,
  Layers,
  Info,
  AlertTriangle,
  FileCheck,
  Scan,
  Shirt as ShirtIcon,
  Star,
  FileText,
  Activity,
  Download,
  ExternalLink,
  MousePointer2,
  Share2,
  MessageSquare,
  CheckCircle2,
  Users,
  UserPlus,
  Info as InfoIcon,
  Target,
  Wallet,
  Layers as LayersIcon,
  ArrowRightLeft,
  Quote,
  Truck,
  Award,
  Smartphone,
  MapPin,
  Map,
  Layout,
  BarChart3,
  DoorOpen,
  GraduationCap,
  RefreshCw,
  Scissors,
  ScanLine,
  Flame,
  UserCheck,
  CalendarDays,
  Leaf,
  Landmark,
  Coins,
  Wrench,
  Rocket,
  Scale,
  BookOpen,
  CreditCard,
  Box,
  Footprints,
} from 'lucide-react';
import { products } from '@/lib/products';
import { calculateTieredPrice } from '@/lib/fashion/tiered-pricing';
import { getActiveSession, saveSessionState } from '@/lib/fashion/showroom-session';
import { detectOrderAnomalies } from '@/lib/fashion/order-anomaly';
import { getHonestMarkRequirementsForSkus } from '@/lib/fashion/honest-mark-compliance';
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

  const currentProduct = products.find((p) => p.sku === activeSku) || products[0];

  // Batch 36 Hooks
  const trainingPack = useMemo(() => getStaffTrainingPack(activeSku), [activeSku]);
  const clickCollect = useMemo(() => getClickAndCollectStatus('ORD-2026-99'), []);
  const storeConversions = useMemo(() => getStoreZoneConversions('STORE-MOSCOW-CENTRAL'), []);

  const totalWholesale = useMemo(() => {
    return orderDraft.reduce((acc, item) => {
      const price = calculateTieredPrice(item.sku, item.quantity);
      return acc + price * item.quantity;
    }, 0);
  }, [orderDraft]);

  const financing = useMemo(() => getB2BPreOrderFinancing(totalWholesale), [totalWholesale]);

  // Existing hooks
  const creditScore = useMemo(() => getPartnerCreditScore('P-001'), []);
  const allocation = useMemo(() => getWholesaleAllocationFairness(activeSku), [activeSku]);
  const commission = useMemo(() => getStaffCommissionScheme(activeSku), [activeSku]);

  const handleAddToDraft = (sku: string) => {
    setOrderDraft((prev) => {
      const existing = prev.find((i) => i.sku === sku);
      if (existing)
        return prev.map((i) => (i.sku === sku ? { ...i, quantity: i.quantity + 10 } : i));
      return [...prev, { sku, quantity: 10 }];
    });
  };

  return (
    <div className="bg-text-primary text-text-inverse min-h-screen p-8">
      {/* HUD Header */}
      <div className="border-text-primary/30 mb-12 flex items-center justify-between border-b pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-accent-primary animate-pulse border-none text-[9px]">
              BATCH 36 • RETAIL OPS PRO
            </Badge>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Showroom: Store Ops RU
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
              ID: {id} • Mode: Advanced B2B Logistics
            </p>
            {/* Financing HUD */}
            <div className="flex gap-2">
              <Badge className="flex h-5 items-center gap-1.5 border-none bg-amber-500/20 px-2 text-[8px] font-black uppercase text-amber-400">
                <CreditCard className="h-3 w-3" /> RU Split: 30/70 Active
              </Badge>
              <Badge className="flex h-5 items-center gap-1.5 border-none bg-sky-500/20 px-2 text-[8px] font-black uppercase text-sky-400">
                <Box className="h-3 w-3" /> C&C Efficiency: 92%
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="border-text-primary/25 hover:bg-text-primary/90 text-[10px] font-black uppercase text-white"
          >
            Training Hub
          </Button>
          <Button className="bg-accent-primary hover:bg-accent-primary min-w-[150px] text-[10px] font-black uppercase text-white">
            Finalize Pre-Order
          </Button>
        </div>
      </div>

      <div className="grid h-[calc(100vh-250px)] grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="scrollbar-hide col-span-2 space-y-4 overflow-y-auto pb-12 pr-4">
          {/* Staff Training Card */}
          <Card className="bg-accent-primary/20 border-accent-primary/30 mb-4 border-2 p-4">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="text-accent-primary h-4 w-4" />
              <h3 className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                Staff Argumentation
              </h3>
            </div>
            <div className="space-y-3">
              {trainingPack.keySellingPointsRu.slice(0, 2).map((point, idx) => (
                <div key={idx} className="text-text-muted text-[8px] font-medium leading-tight">
                  • {point}
                </div>
              ))}
              <div className="border-accent-primary/10 flex items-center justify-between border-t pt-2 text-[7px] font-black uppercase">
                <span className="text-accent-primary">Training Video</span>
                <Play className="h-2.5 w-2.5" />
              </div>
            </div>
          </Card>

          {/* Store Traffic & Conversion HUD */}
          <Card className="bg-text-primary/90 border-text-primary/25 mb-4 border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Footprints className="text-text-muted h-4 w-4" />
              <h3 className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                Zone Conversion
              </h3>
            </div>
            <div className="space-y-2">
              {storeConversions.map((zone) => (
                <div
                  key={zone.zoneName}
                  className="flex items-center justify-between rounded bg-black/20 p-1.5 text-[8px] font-black uppercase"
                >
                  <span className="text-text-muted w-24 truncate">{zone.zoneName}</span>
                  <span className="text-emerald-400">{zone.conversionPercent}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Click & Collect Status Card */}
          <Card className="border-2 border-sky-500/30 bg-sky-900/20 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Box className="h-4 w-4 text-sky-400" />
              <h3 className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                C&C Monitor
              </h3>
            </div>
            <div className="space-y-2">
              <div className="text-[9px] font-black uppercase text-sky-400">
                {clickCollect.status}
              </div>
              <div className="text-text-secondary text-[7px] font-bold uppercase tracking-widest">
                Store: Central Moscow
              </div>
              <div className="text-text-muted pt-1 text-[7px] font-black uppercase">
                Pickup by: {clickCollect.readyForPickupDate}
              </div>
            </div>
          </Card>
        </div>

        {/* Center Viewport */}
        <div className="bg-text-primary/90 border-text-primary/30 group relative col-span-7 overflow-hidden rounded-3xl border-2">
          {/* Overlays */}
          <div className="pointer-events-none absolute right-8 top-24 z-20 w-64 space-y-4">
            {/* B2B Financing Overlay */}
            <div className="rounded-xl border border-white/20 bg-amber-600/90 p-4 text-white shadow-2xl backdrop-blur-md duration-500 animate-in slide-in-from-right">
              <div className="mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  30/70 Financing RU
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[9px] font-black uppercase">
                  <span className="text-amber-200">Deposit (30%)</span>
                  <span>{financing.depositAmount.toLocaleString()} ₽</span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-black uppercase">
                  <span className="text-amber-200">Remaining (70%)</span>
                  <span>{financing.remainingAmount.toLocaleString()} ₽</span>
                </div>
                <div className="mt-2 border-t border-white/10 pt-2 text-center text-[8px] font-bold uppercase">
                  No interest for {financing.creditTermDays} days
                </div>
              </div>
            </div>
          </div>

          {/* Focus Product View */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
            <div className="bg-text-primary/75 ring-accent-primary/20 relative aspect-[3/4] w-[450px] overflow-hidden rounded-2xl shadow-2xl ring-4 transition-transform duration-500 group-hover:scale-[1.02]">
              <img
                src={currentProduct.images?.[0]?.url ?? ''}
                alt={currentProduct.name}
                className="h-full w-full object-cover"
              />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div className="rounded-xl border border-white/10 bg-black/60 p-4 text-white backdrop-blur-md">
                  <h2 className="mb-1 text-xl font-black uppercase tracking-tight">
                    {currentProduct.name}
                  </h2>
                  <div className="text-text-muted text-accent-primary text-[10px] font-bold uppercase tracking-widest">
                    Retail Excellence Pack Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="scrollbar-hide col-span-3 space-y-6 overflow-y-auto pb-8 pr-2">
          <Card className="bg-text-primary/90 border-text-primary/25 p-6 text-white shadow-2xl">
            <h3 className="text-text-muted mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
              <ShoppingBag className="text-accent-primary h-4 w-4" /> B2B Order Draft
            </h3>

            <div className="mb-6 max-h-80 space-y-4 overflow-y-auto pr-2 text-[10px] font-black uppercase">
              {orderDraft.map((item) => {
                const p = products.find((prod) => prod.sku === item.sku);
                return (
                  <div
                    key={item.sku}
                    className="border-text-primary/25 group relative flex items-center gap-3 border-b pb-3"
                  >
                    <div className="bg-text-primary/75 h-14 w-10 overflow-hidden rounded">
                      <img src={p?.images?.[0]?.url ?? ''} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-text-muted truncate">{p?.name}</div>
                      <div className="text-accent-primary mt-1">{item.quantity} Units</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-text-primary border-text-primary/25 mb-6 rounded-xl border p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-text-secondary text-[10px] font-black uppercase">
                  Order Value
                </span>
                <span className="text-lg font-black text-white">
                  {totalWholesale.toLocaleString()} ₽
                </span>
              </div>
            </div>

            <Button
              onClick={() => handleAddToDraft(activeSku)}
              className="hover:bg-bg-surface2 h-12 w-full bg-white text-xs font-black uppercase tracking-widest text-black"
            >
              Add 10 Units to Draft
            </Button>
          </Card>

          <Card className="bg-text-primary/90 border-text-primary/25 border p-6 text-white shadow-2xl">
            <h3 className="text-text-muted mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <Scale className="text-accent-primary h-4 w-4" /> B2B Fair Allocation
            </h3>
            <div className="space-y-2">
              <div className="text-accent-primary text-[12px] font-black">
                {allocation.fairnessScore}% Score
              </div>
              <p className="text-text-secondary text-[8px] font-bold uppercase leading-tight">
                {allocation.reasoning}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
