'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Users,
  Link2,
  FileText,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Globe,
  ShieldCheck,
  Search,
  Filter,
  MoreVertical,
  Layers,
  ShoppingBag,
  Truck,
  MessageSquare,
  Eye,
  Database,
  Leaf,
  Crown,
  Megaphone,
  Gavel,
  Lock,
  Brain,
  ArrowRight,
  FolderOpen,
  Cloud,
  PieChart,
  Percent,
  LayoutGrid,
  DollarSign,
  Target,
  Settings,
  Scan,
  ShieldAlert,
  BookOpen,
  Landmark,
  Calculator,
  PenTool,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { B2BOrderWholesaleStatus } from '@/lib/types/b2b';
import { LinesheetCreator } from '../b2b/LinesheetCreator';
import { ATSInventoryManager } from '../b2b/ATSInventoryManager';
import { OrderLogisticsTracker } from '../b2b/OrderLogisticsTracker';
import { B2BPaymentEscrow } from '../b2b/B2BPaymentEscrow';
import { AIBuyPlanAdvisor } from '../b2b/AIBuyPlanAdvisor';
import { EDISyncDashboard } from '../b2b/EDISyncDashboard';
import { VRShowroomModule } from '../b2b/VRShowroomModule';
import { MultiCurrencySwitcher } from '../b2b/MultiCurrencySwitcher';
import { SustainabilityPassport } from '../b2b/SustainabilityPassport';
import { WholesaleLoyaltyHub } from '../b2b/WholesaleLoyaltyHub';
import { B2BMarketingManager } from '../b2b/B2BMarketingManager';
import { CustomsDocumentAutomation } from '../b2b/CustomsDocumentAutomation';
import { FinancialTermsManager } from '../b2b/FinancialTermsManager';
import { SmartAllocationEngine } from '../b2b/SmartAllocationEngine';
import { LandedCostCalculator } from '../b2b/LandedCostCalculator';
import { WholesaleContractManager } from '../b2b/WholesaleContractManager';
import { SalesRepDashboard } from '../b2b/SalesRepDashboard';
import { PricingTierManager } from '../b2b/PricingTierManager';
import { B2BCollaborationHub } from '../b2b/B2BCollaborationHub';
import { ProductInformationManager } from '../b2b/ProductInformationManager';
import { DocumentManagementSystem } from '../b2b/DocumentManagementSystem';
import { PartnerAnalyticsCRM } from '../b2b/PartnerAnalyticsCRM';
import { CollaborativeBuyingPortal } from '../b2b/CollaborativeBuyingPortal';
import { MarketingAssetCloud } from '../b2b/MarketingAssetCloud';
import { ProductionPulseTracker } from '../b2b/ProductionPulseTracker';
import { ChannelSalesAnalytics } from '../b2b/ChannelSalesAnalytics';
import { InteractiveLookbook } from '../b2b/InteractiveLookbook';
import { B2BFinancing } from '../b2b/B2BFinancing';
import { DemandHeatmap } from '../b2b/DemandHeatmap';
import { CustomsHSAssistant } from '../b2b/CustomsHSAssistant';
import { LeadScoringDashboard } from '../b2b/LeadScoringDashboard';
import { WhiteLabelConfigurator } from '../b2b/WhiteLabelConfigurator';
import { ClaimsReturnsPortal } from '../b2b/ClaimsReturnsPortal';
import { DigitalShowroom360 } from '../b2b/DigitalShowroom360';
import { B2BFinancialPerformance } from '../b2b/B2BFinancialPerformance';
import { MerchandisingDashboard } from '../showroom/MerchandisingDashboard';
import { PlanningDashboard } from '../showroom/PlanningDashboard';
import { cn } from '@/lib/cn';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getMetricValueToneClass } from '@/lib/ui/semantic-data-tones';

export function B2BControlCenter() {
  const { viewRole, activeCurrency } = useUIState();
  const {
    b2bActivityLogs,
    b2bConnections,
    linesheetRequests,
    addB2bActivityLog,
    b2bNegotiations,
    updateOrderWholesaleStatus,
    addNegotiationMessage,
    b2bTasks,
    b2bDocuments,
    b2bEvents,
  } = useB2BState();
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'connections'
    | 'linesheets'
    | 'analytics'
    | 'orders'
    | 'ats'
    | 'logistics'
    | 'enterprise'
    | 'workplace'
  >('dashboard');
  const [activeEnterpriseTool, setActiveEnterpriseTool] = useState<string | null>(null);
  const [selectedNegId, setSelectedNegId] = useState<string | null>(null);

  const selectedNeg = b2bNegotiations.find((n) => n.orderId === selectedNegId);

  const totalVolume = useMemo(() => {
    // Mock volume calculation from filtered negotiations
    return b2bNegotiations.length * 1250000;
  }, [b2bNegotiations]);

  const stats = [
    { label: 'Active Connections', val: b2bConnections.length, trend: '+12%', color: 'indigo' },
    { label: 'Active Negotiations', val: b2bNegotiations.length, trend: '+8.2%', color: 'amber' },
    { label: 'Linesheet Requests', val: linesheetRequests.length, trend: '+22%', color: 'indigo' },
    {
      label: 'Brand Volume',
      val: `${(totalVolume / 1000000).toFixed(1)}M ₽`,
      trend: '+18%',
      color: 'emerald',
    },
  ];

  const getStatusBadge = (status: B2BOrderWholesaleStatus) => {
    const configs: Record<B2BOrderWholesaleStatus, { label: string; color: string }> = {
      draft: { label: 'DRAFT', color: 'bg-bg-surface2 text-text-secondary' },
      pending_brand: { label: 'REVIEW: BRAND', color: 'bg-amber-100 text-amber-600' },
      pending_retailer: {
        label: 'REVIEW: RETAILER',
        color: 'bg-accent-primary/15 text-accent-primary',
      },
      pending_admin: { label: 'WAITING ADMIN', color: 'bg-rose-100 text-rose-600' },
      confirmed: { label: 'CONFIRMED', color: 'bg-emerald-100 text-emerald-600' },
      production: { label: 'IN PRODUCTION', color: 'bg-blue-100 text-blue-600' },
      shipped: { label: 'SHIPPED', color: 'bg-accent-primary/15 text-accent-primary' },
    };
    const config = configs[status] || configs.draft;
    return (
      <Badge
        className={cn('border-none px-2 py-0.5 text-[8px] font-black uppercase', config.color)}
      >
        {config.label}
      </Badge>
    );
  };

  useEffect(() => {
    if (b2bActivityLogs.length === 0) {
      addB2bActivityLog({
        type: 'order_placed',
        actor: { id: 'ret-1', name: 'Premium Store', type: 'retailer' },
        target: { id: '#8821', name: 'Wholesale Order', type: 'linesheet' },
        details: 'Created new pre-order for FW26 Collection.',
      });
    }

    if (b2bNegotiations.length === 0) {
      addNegotiationMessage('#8821', {
        type: 'system',
        sender: { id: 'sys', name: 'System', role: 'admin' },
        text: 'Order created from Marketroom.',
      });
      updateOrderWholesaleStatus('#8821', 'pending_admin');

      addNegotiationMessage('#8822', {
        type: 'message',
        sender: { id: 'ret-1', name: 'Milan Concept Store', role: 'shop' },
        text: 'Can we get a 5% discount for bulk pre-order?',
      });
      updateOrderWholesaleStatus('#8822', 'pending_brand');
    }
  }, []);

  return (
    <div className="bg-bg-surface2/80 min-h-screen space-y-4 p-4 text-left">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-text-primary flex h-8 w-8 items-center justify-center rounded-xl shadow-lg">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
              className="border-border-default text-text-primary rounded-full bg-white px-3 py-1 text-[9px] font-black uppercase tracking-widest"
            >
              SYNTHA_ADMIN_PANEL_v1.0
            </Badge>
          </div>
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-base">
            B2B Control
            <br />
            Center
          </h2>
        </div>

        <div className="border-border-default flex items-center gap-2 overflow-x-auto rounded-2xl border bg-white p-1.5 shadow-sm">
          {[
            { id: 'dashboard', label: 'Overview', icon: BarChart3 },
            { id: 'orders', label: 'Order Flow', icon: ShoppingBag },
            { id: 'ats', label: 'ATS Inventory', icon: Globe },
            { id: 'logistics', label: 'Logistics', icon: Truck },
            { id: 'workplace', label: 'Workplace', icon: LayoutGrid },
            { id: 'enterprise', label: 'Enterprise Suite', icon: ShieldCheck },
            { id: 'analytics', label: 'Analytics', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all',
                activeTab === tab.id
                  ? 'bg-text-primary text-white shadow-xl'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-surface2'
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 text-left md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="group overflow-hidden border-none shadow-md shadow-xl transition-all duration-500 hover:scale-[1.02]"
          >
            <CardContent className="relative p-4">
              <div className="absolute right-0 top-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
                <Zap className="text-text-primary h-12 w-12" />
              </div>
              <div className="space-y-1">
                <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                  {stat.label}
                </p>
                <div className="flex items-end justify-between">
                  <h3
                    className={cn(
                      'text-base font-black tracking-tighter',
                      getMetricValueToneClass(stat.color)
                    )}
                  >
                    {stat.val}
                  </h3>
                  <div
                    className={cn(
                      'flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold',
                      stat.trend.startsWith('+')
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                    )}
                  >
                    {stat.trend.startsWith('+') ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {stat.trend}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {activeTab === 'ats' ? (
          <ATSInventoryManager />
        ) : activeTab === 'logistics' ? (
          <OrderLogisticsTracker />
        ) : activeTab === 'linesheets' ? (
          <LinesheetCreator />
        ) : activeTab === 'workplace' ? (
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {!activeEnterpriseTool ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-2"
                >
                  {[
                    {
                      id: 'collab',
                      title: 'Collaboration Hub',
                      desc: 'Tasks, Calendar & Messaging',
                      icon: MessageSquare,
                      component: B2BCollaborationHub,
                    },
                    {
                      id: 'pim',
                      title: 'PIM System',
                      desc: 'Product Information & Media',
                      icon: Database,
                      component: ProductInformationManager,
                    },
                    {
                      id: 'claims',
                      title: 'Claims Portal',
                      desc: 'Automated Returns & Credits',
                      icon: ShieldAlert,
                      component: ClaimsReturnsPortal,
                    },
                    {
                      id: 'dms',
                      title: 'DMS Vault',
                      desc: 'Secure Document Management',
                      icon: FolderOpen,
                      component: DocumentManagementSystem,
                    },
                    {
                      id: 'crm-intel',
                      title: 'Partner CRM',
                      desc: 'Engagement & Performance Analytics',
                      icon: BarChart3,
                      component: PartnerAnalyticsCRM,
                    },
                    {
                      id: 'leads',
                      title: 'Lead Scoring',
                      desc: 'AI-driven Retailer Prospecting',
                      icon: Target,
                      component: LeadScoringDashboard,
                    },
                    {
                      id: 'identity',
                      title: 'White Label',
                      desc: 'Custom Retailer Experience',
                      icon: Settings,
                      component: WhiteLabelConfigurator,
                    },
                    {
                      id: 'showroom-360',
                      title: 'Showroom 360°',
                      desc: 'Deep Zoom & Visual Discovery',
                      icon: Scan,
                      component: DigitalShowroom360,
                    },
                    {
                      id: 'collab-buying',
                      title: 'Team Buying',
                      desc: 'Collaborative curation & voting',
                      icon: Users,
                      component: CollaborativeBuyingPortal,
                    },
                    {
                      id: ' marketing-cloud',
                      title: 'Asset Cloud',
                      desc: 'Social content & marketing sync',
                      icon: Cloud,
                      component: MarketingAssetCloud,
                    },
                    {
                      id: 'lookbook',
                      title: 'Visual Hub',
                      desc: 'Interactive Digital Lookbooks',
                      icon: BookOpen,
                      component: InteractiveLookbook,
                    },
                    {
                      id: 'financing',
                      title: 'BNPL Center',
                      desc: 'B2B Buy Now Pay Later',
                      icon: Landmark,
                      component: B2BFinancing,
                    },
                    {
                      id: 'heatmap',
                      title: 'Global Map',
                      desc: 'Real-time Demand Heatmap',
                      icon: Globe,
                      component: DemandHeatmap,
                    },
                    {
                      id: 'prod-pulse',
                      title: 'Production Pulse',
                      desc: 'Real-time IoT factory tracking',
                      icon: Activity,
                      component: ProductionPulseTracker,
                    },
                    {
                      id: 'sales-team',
                      title: 'Sales Team',
                      desc: 'Quota & Performance tracking',
                      icon: Zap,
                      component: SalesRepDashboard,
                    },
                    {
                      id: 'pricing',
                      title: 'Pricing Matrix',
                      desc: 'Multi-tier MOQ & Discount logic',
                      icon: Percent,
                      component: PricingTierManager,
                    },
                    {
                      id: 'financial-hub',
                      title: 'Financial Hub',
                      desc: 'Forecasting & Budgeting',
                      icon: DollarSign,
                      component: B2BFinancialPerformance,
                    },
                    {
                      id: 'channel-sales',
                      title: 'Omni-Channel',
                      desc: 'Cross-platform sales intel',
                      icon: Globe,
                      component: ChannelSalesAnalytics,
                    },
                    {
                      id: 'merch',
                      title: 'Digital Rack',
                      desc: 'Merchandising & Planograms',
                      icon: ShoppingBag,
                      component: MerchandisingDashboard,
                    },
                    {
                      id: 'planning',
                      title: 'SKU Planner',
                      desc: 'Assortment & Budget AI',
                      icon: PieChart,
                      component: PlanningDashboard,
                    },
                  ].map((tool) => (
                    <Card
                      key={tool.id}
                      onClick={() => setActiveEnterpriseTool(tool.id)}
                      className="group cursor-pointer rounded-xl border-none bg-white p-4 shadow-md shadow-xl transition-all hover:scale-[1.02]"
                    >
                      <div className="mb-6 flex items-start justify-between">
                        <div className="bg-bg-surface2 group-hover:bg-text-primary/90 flex h-10 w-10 items-center justify-center rounded-2xl transition-colors">
                          <tool.icon className="text-text-muted h-6 w-6 group-hover:text-white" />
                        </div>
                        <ArrowUpRight className="text-text-muted group-hover:text-text-primary h-5 w-5 transition-all group-hover:-translate-y-1 group-hover:translate-x-1" />
                      </div>
                      <h4 className="text-text-primary mb-2 text-base font-black uppercase tracking-tight">
                        {tool.title}
                      </h4>
                      <p className="text-text-muted text-[10px] font-medium uppercase leading-relaxed tracking-widest">
                        {tool.desc}
                      </p>
                    </Card>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative"
                >
                  <Button
                    onClick={() => setActiveEnterpriseTool(null)}
                    variant="ghost"
                    className="text-text-muted hover:text-text-primary absolute -top-16 left-0 gap-2 text-[10px] font-black uppercase tracking-widest"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" /> Back to Workplace
                  </Button>
                  {activeEnterpriseTool === 'collab' && <B2BCollaborationHub />}
                  {activeEnterpriseTool === 'pim' && <ProductInformationManager />}
                  {activeEnterpriseTool === 'claims' && <ClaimsReturnsPortal />}
                  {activeEnterpriseTool === 'dms' && <DocumentManagementSystem />}
                  {activeEnterpriseTool === 'crm-intel' && <PartnerAnalyticsCRM />}
                  {activeEnterpriseTool === 'leads' && <LeadScoringDashboard />}
                  {activeEnterpriseTool === 'identity' && <WhiteLabelConfigurator />}
                  {activeEnterpriseTool === 'showroom-360' && (
                    <DigitalShowroom360 onClose={() => setActiveEnterpriseTool(null)} />
                  )}
                  {activeEnterpriseTool === 'lookbook' && <InteractiveLookbook />}
                  {activeEnterpriseTool === 'financing' && <B2BFinancing />}
                  {activeEnterpriseTool === 'heatmap' && <DemandHeatmap />}
                  {activeEnterpriseTool === 'collab-buying' && <CollaborativeBuyingPortal />}
                  {activeEnterpriseTool === 'marketing-cloud' && <MarketingAssetCloud />}
                  {activeEnterpriseTool === 'prod-pulse' && <ProductionPulseTracker />}
                  {activeEnterpriseTool === 'sales-team' && <SalesRepDashboard />}
                  {activeEnterpriseTool === 'pricing' && <PricingTierManager />}
                  {activeEnterpriseTool === 'financial-hub' && <B2BFinancialPerformance />}
                  {activeEnterpriseTool === 'channel-sales' && <ChannelSalesAnalytics />}
                  {activeEnterpriseTool === 'merch' && (
                    <MerchandisingDashboard
                      merchStatus="ready"
                      setMerchStatus={() => {}}
                      activeMerchBrand="Platform View"
                      isCustomerPov={false}
                      setIsCustomerPov={() => {}}
                    />
                  )}
                  {activeEnterpriseTool === 'planning' && (
                    <PlanningDashboard viewRole="admin" currency="RUB" toast={console.log} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : activeTab === 'enterprise' ? (
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {!activeEnterpriseTool ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
                >
                  {[
                    {
                      id: 'escrow',
                      title: 'Financial Escrow',
                      desc: 'Secure B2B payment holding protocol',
                      icon: Lock,
                      component: B2BPaymentEscrow,
                    },
                    {
                      id: 'ai-advisor',
                      title: 'Buy-Plan Advisor',
                      desc: 'AI-driven purchase optimization',
                      icon: Brain,
                      component: AIBuyPlanAdvisor,
                    },
                    {
                      id: 'edi',
                      title: 'EDI Ecosystem',
                      desc: 'Direct ERP/1C synchronization hub',
                      icon: Database,
                      component: EDISyncDashboard,
                    },
                    {
                      id: 'vr',
                      title: 'VR Showroom',
                      desc: 'Immersive 3D wholesale experience',
                      icon: Globe,
                      component: VRShowroomModule,
                    },
                    {
                      id: 'currency',
                      title: 'Settlement Engine',
                      desc: 'Multi-currency & trade terms',
                      icon: Globe,
                      component: MultiCurrencySwitcher,
                    },
                    {
                      id: 'sustainability',
                      title: 'Eco Passport',
                      desc: 'Digital product sustainability ledger',
                      icon: Leaf,
                      component: SustainabilityPassport,
                    },
                    {
                      id: 'loyalty',
                      title: 'Partner Rewards',
                      desc: 'Wholesale loyalty & tier manager',
                      icon: Crown,
                      component: WholesaleLoyaltyHub,
                    },
                    {
                      id: 'marketing',
                      title: 'Retailer Ads',
                      desc: 'In-app engagement & placements',
                      icon: Megaphone,
                      component: B2BMarketingManager,
                    },
                    {
                      id: 'hs-assistant',
                      title: 'HS Assistant',
                      desc: 'AI Customs Classification',
                      icon: Gavel,
                      component: CustomsHSAssistant,
                    },
                    {
                      id: 'customs',
                      title: 'Customs Gateway',
                      desc: 'Automated global trade documents',
                      icon: FileText,
                      component: CustomsDocumentAutomation,
                    },
                    {
                      id: 'finance',
                      title: 'Credit & Terms',
                      desc: 'Wholesale limits & net conditions',
                      icon: DollarSign,
                      component: FinancialTermsManager,
                    },
                    {
                      id: 'allocation',
                      title: 'Smart Allocation',
                      desc: 'VIP priority & stock distribution',
                      icon: Layers,
                      component: SmartAllocationEngine,
                    },
                    {
                      id: 'landed-cost',
                      title: 'Landed Cost',
                      desc: 'Global trade & tax calculator',
                      icon: Calculator,
                      component: LandedCostCalculator,
                    },
                    {
                      id: 'contracts',
                      title: 'Legal & Signing',
                      desc: 'Digital agreements & compliance',
                      icon: PenTool,
                      component: WholesaleContractManager,
                    },
                    {
                      id: 'sales-reps',
                      title: 'Sales Team',
                      desc: 'Rep performance & quota tracking',
                      icon: Users,
                      component: SalesRepDashboard,
                    },
                    {
                      id: 'pricing-tiers',
                      title: 'Pricing Matrix',
                      desc: 'Tiered discounts & MOQ logic',
                      icon: Percent,
                      component: PricingTierManager,
                    },
                  ].map((tool) => (
                    <Card
                      key={tool.id}
                      onClick={() => setActiveEnterpriseTool(tool.id)}
                      className="group cursor-pointer rounded-xl border-none bg-white p-4 shadow-md shadow-xl transition-all hover:scale-[1.02]"
                    >
                      <div className="mb-6 flex items-start justify-between">
                        <div className="bg-bg-surface2 group-hover:bg-accent-primary flex h-10 w-10 items-center justify-center rounded-2xl transition-colors">
                          <tool.icon className="text-text-muted h-6 w-6 group-hover:text-white" />
                        </div>
                        <ArrowUpRight className="text-text-muted group-hover:text-accent-primary h-5 w-5 transition-all group-hover:-translate-y-1 group-hover:translate-x-1" />
                      </div>
                      <h4 className="text-text-primary mb-2 text-base font-black uppercase tracking-tight">
                        {tool.title}
                      </h4>
                      <p className="text-text-muted text-[10px] font-medium uppercase leading-relaxed tracking-widest">
                        {tool.desc}
                      </p>
                    </Card>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative"
                >
                  <Button
                    onClick={() => setActiveEnterpriseTool(null)}
                    variant="ghost"
                    className="text-text-muted hover:text-text-primary absolute -top-16 left-0 gap-2 text-[10px] font-black uppercase tracking-widest"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" /> Back to Enterprise Suite
                  </Button>
                  {activeEnterpriseTool === 'escrow' && <B2BPaymentEscrow />}
                  {activeEnterpriseTool === 'ai-advisor' && <AIBuyPlanAdvisor />}
                  {activeEnterpriseTool === 'edi' && <EDISyncDashboard />}
                  {activeEnterpriseTool === 'vr' && <VRShowroomModule />}
                  {activeEnterpriseTool === 'currency' && <MultiCurrencySwitcher />}
                  {activeEnterpriseTool === 'sustainability' && <SustainabilityPassport />}
                  {activeEnterpriseTool === 'loyalty' && <WholesaleLoyaltyHub />}
                  {activeEnterpriseTool === 'marketing' && <B2BMarketingManager />}
                  {activeEnterpriseTool === 'hs-assistant' && <CustomsHSAssistant />}
                  {activeEnterpriseTool === 'customs' && <CustomsDocumentAutomation />}
                  {activeEnterpriseTool === 'finance' && <FinancialTermsManager />}
                  {activeEnterpriseTool === 'allocation' && <SmartAllocationEngine />}
                  {activeEnterpriseTool === 'landed-cost' && <LandedCostCalculator />}
                  {activeEnterpriseTool === 'contracts' && <WholesaleContractManager />}
                  {activeEnterpriseTool === 'sales-reps' && <SalesRepDashboard />}
                  {activeEnterpriseTool === 'pricing-tiers' && <PricingTierManager />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {/* Activity Feed / Order Flow */}
            <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl shadow-md lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-base font-black uppercase tracking-tight">
                    {activeTab === 'orders' ? 'Global Order Registry' : 'Live Activity Flow'}
                  </CardTitle>
                  <CardDescription className="text-text-muted text-[10px] font-bold uppercase">
                    {activeTab === 'orders'
                      ? 'Transaction lifecycle monitoring'
                      : 'Real-time B2B interaction stream'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border-subtle h-8 rounded-lg text-[10px] font-black uppercase"
                  >
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-border-subtle h-8 w-8 rounded-lg"
                  >
                    <Filter className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {activeTab === 'orders' ? (
                      b2bNegotiations.length > 0 ? (
                        b2bNegotiations.map((neg) => (
                          <motion.div
                            key={neg.orderId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-bg-surface2 hover:bg-bg-surface2 hover:border-border-default group flex flex-col rounded-3xl border border-transparent p-4 transition-all"
                          >
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                                  <ShoppingBag className="text-accent-primary h-5 w-5" />
                                </div>
                                <div>
                                  <p className="text-text-primary text-xs font-black uppercase">
                                    Order {neg.orderId}
                                  </p>
                                  <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                                    Last activity: {new Date(neg.lastUpdate).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                              {getStatusBadge(neg.status)}
                            </div>

                            <div className="border-border-default/50 mb-4 flex items-center gap-3 border-y py-3">
                              <div className="flex -space-x-2">
                                <div className="bg-accent-primary flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[8px] font-bold text-white">
                                  B
                                </div>
                                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[8px] font-bold text-white">
                                  R
                                </div>
                              </div>
                              <p className="text-text-secondary text-[10px] font-bold uppercase">
                                Brand <span className="text-text-muted mx-1">↔</span> Retailer
                              </p>
                              <div className="ml-auto flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="border-border-default bg-white text-[9px]"
                                >
                                  12 items
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="border-border-default bg-white text-[9px]"
                                >
                                  1.2M ₽
                                </Badge>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {neg.status === 'pending_admin' && (
                                <Button
                                  onClick={() =>
                                    updateOrderWholesaleStatus(neg.orderId, 'confirmed')
                                  }
                                  className="h-9 flex-1 rounded-xl bg-rose-600 text-[9px] font-black uppercase text-white shadow-lg shadow-rose-200 hover:bg-rose-700"
                                >
                                  Approve Transaction
                                </Button>
                              )}
                              <Button
                                onClick={() => setSelectedNegId(neg.orderId)}
                                variant="outline"
                                className="border-border-default h-9 flex-1 gap-2 rounded-xl bg-white text-[9px] font-black uppercase"
                              >
                                <MessageSquare className="h-3 w-3" />
                                Intervene
                              </Button>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="space-y-4 py-10 text-center">
                          <div className="bg-bg-surface2 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                            <Layers className="text-text-muted h-8 w-8" />
                          </div>
                          <p className="text-text-muted text-[10px] font-black uppercase italic tracking-widest">
                            No active orders in flow...
                          </p>
                        </div>
                      )
                    ) : b2bActivityLogs.length > 0 ? (
                      b2bActivityLogs.map((log) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="hover:bg-bg-surface2 hover:border-border-subtle group flex items-start gap-3 rounded-2xl border border-transparent p-4 transition-all"
                        >
                          <div
                            className={cn(
                              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm',
                              log.type === 'order_placed'
                                ? 'bg-emerald-100 text-emerald-600'
                                : log.type === 'linesheet_request'
                                  ? 'bg-accent-primary/15 text-accent-primary'
                                  : 'bg-bg-surface2 text-text-secondary'
                            )}
                          >
                            {log.type === 'order_placed' ? (
                              <ShoppingBag className="h-5 w-5" />
                            ) : log.type === 'linesheet_request' ? (
                              <FileText className="h-5 w-5" />
                            ) : (
                              <Activity className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-text-primary text-[11px] font-bold uppercase tracking-tight">
                                {log.actor.name} <span className="text-text-muted mx-2">→</span>{' '}
                                {log.details}
                              </p>
                              <span className="text-text-muted text-[9px] font-black uppercase tabular-nums">
                                {new Date(log.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="border-border-subtle text-text-muted text-[7px] font-bold uppercase"
                              >
                                {log.actor.type}
                              </Badge>
                              <div className="bg-border-subtle h-1 w-1 rounded-full" />
                              <span className="text-text-muted text-[8px] font-black uppercase">
                                IP: 192.168.1.***
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="space-y-4 py-10 text-center">
                        <div className="bg-bg-surface2 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                          <Activity className="text-text-muted h-8 w-8" />
                        </div>
                        <p className="text-text-muted text-[10px] font-black uppercase italic tracking-widest">
                          No recent activity logged...
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Side Column: Quick Stats & Connections */}
            <div className="space-y-4">
              <Card className="bg-text-primary relative overflow-hidden rounded-xl border-none p-4 text-white shadow-2xl shadow-md">
                <div className="absolute right-0 top-0 p-4 opacity-5">
                  <Globe className="h-32 w-32" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-tight">
                      Market Resonance
                    </h3>
                    <Globe className="text-accent-primary h-5 w-5" />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span>Platform Utilization</span>
                        <span className="text-accent-primary">92%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '92%' }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          className="bg-accent-primary h-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span>Node Latency</span>
                        <span className="text-emerald-400">42ms</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '42%' }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-text-primary text-sm font-black uppercase tracking-widest">
                    Active Nodes
                  </h3>
                  <Badge className="border-none bg-emerald-50 px-2 py-0.5 text-[8px] font-black text-emerald-600">
                    34 ONLINE
                  </Badge>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="border-border-subtle group-hover:border-accent-primary/20 h-10 w-10 overflow-hidden rounded-full border-2 transition-colors">
                          <img
                            src={`https://i.pravatar.cc/100?img=${i + 20}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-text-primary text-[10px] font-black uppercase">
                            Premium Store HQ
                          </p>
                          <p className="text-text-muted text-[8px] font-bold uppercase">
                            Retailer • Moscow
                          </p>
                        </div>
                      </div>
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="text-text-muted hover:text-text-primary hover:bg-bg-surface2 h-10 w-full rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  View Full Directory
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Admin Intervention Dialog */}
      <Dialog open={!!selectedNegId} onOpenChange={(open) => !open && setSelectedNegId(null)}>
        <DialogContent className="overflow-hidden rounded-xl border-none bg-white p-0 shadow-2xl sm:max-w-[500px]">
          <DialogHeader className="bg-text-primary p-4 pb-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 shadow-lg shadow-rose-900/20">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-base font-black uppercase tracking-tighter">
                  Admin Intervention
                </DialogTitle>
                <p className="text-text-muted mt-0.5 text-[9px] font-bold uppercase tracking-widest">
                  Escrow & Negotiation Resolution Flow
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="bg-bg-surface2/80 custom-scrollbar h-[350px] space-y-4 overflow-y-auto p-4">
            {selectedNeg?.messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex max-w-[85%] flex-col gap-1',
                  msg.sender.role === 'admin'
                    ? 'mx-auto items-center'
                    : msg.sender.role === 'brand'
                      ? 'mr-auto items-start'
                      : 'ml-auto items-end'
                )}
              >
                {msg.type === 'system' ? (
                  <div className="bg-bg-surface2 text-text-muted w-full rounded-lg px-4 py-2 text-center text-[8px] font-black uppercase tracking-[0.2em]">
                    {msg.text}
                  </div>
                ) : (
                  <>
                    <div
                      className={cn(
                        'rounded-2xl border p-3 text-[11px] font-medium leading-relaxed shadow-sm',
                        msg.sender.role === 'admin'
                          ? 'border-rose-100 bg-rose-50 text-rose-900'
                          : msg.sender.role === 'brand'
                            ? 'border-border-subtle text-text-primary bg-white'
                            : 'bg-accent-primary border-accent-primary text-white'
                      )}
                    >
                      {msg.text}
                    </div>
                    <span className="text-text-muted px-1 text-[8px] font-bold uppercase tracking-widest">
                      {msg.sender.name} ({msg.sender.role}) •{' '}
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="border-border-subtle border-t bg-white p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Send official platform message..."
                className="border-border-default bg-bg-surface2 h-12 rounded-xl text-xs font-medium focus-visible:ring-rose-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim() && selectedNegId) {
                      addNegotiationMessage(selectedNegId, {
                        type: 'message',
                        sender: { id: 'admin-1', name: 'Platform Admin', role: 'admin' },
                        text: target.value.trim(),
                      });
                      target.value = '';
                    }
                  }
                }}
              />
              <Button className="h-12 shrink-0 rounded-xl bg-rose-600 px-6 text-[10px] font-black uppercase tracking-widest text-white hover:bg-rose-700">
                Resolution
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
