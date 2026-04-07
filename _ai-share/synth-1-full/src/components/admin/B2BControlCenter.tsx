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
  Landmark
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
import { cn } from '@/lib/cn';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
    b2bEvents
  } = useB2BState();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'connections' | 'linesheets' | 'analytics' | 'orders' | 'ats' | 'logistics' | 'enterprise' | 'workplace'>('dashboard');
  const [activeEnterpriseTool, setActiveEnterpriseTool] = useState<string | null>(null);
  const [selectedNegId, setSelectedNegId] = useState<string | null>(null);

  const selectedNeg = b2bNegotiations.find(n => n.orderId === selectedNegId);

  const totalVolume = useMemo(() => {
    // Mock volume calculation from filtered negotiations
    return b2bNegotiations.length * 1250000;
  }, [b2bNegotiations]);

  const stats = [
    { label: 'Active Connections', val: b2bConnections.length, trend: '+12%', color: 'indigo' },
    { label: 'Active Negotiations', val: b2bNegotiations.length, trend: '+8.2%', color: 'amber' },
    { label: 'Linesheet Requests', val: linesheetRequests.length, trend: '+22%', color: 'indigo' },
    { label: 'Brand Volume', val: `${(totalVolume / 1000000).toFixed(1)}M ₽`, trend: '+18%', color: 'emerald' },
  ];

  const getStatusBadge = (status: B2BOrderWholesaleStatus) => {
    const configs: Record<B2BOrderWholesaleStatus, { label: string, color: string }> = {
      draft: { label: 'DRAFT', color: 'bg-slate-100 text-slate-600' },
      pending_brand: { label: 'REVIEW: BRAND', color: 'bg-amber-100 text-amber-600' },
      pending_retailer: { label: 'REVIEW: RETAILER', color: 'bg-indigo-100 text-indigo-600' },
      pending_admin: { label: 'WAITING ADMIN', color: 'bg-rose-100 text-rose-600' },
      confirmed: { label: 'CONFIRMED', color: 'bg-emerald-100 text-emerald-600' },
      production: { label: 'IN PRODUCTION', color: 'bg-blue-100 text-blue-600' },
      shipped: { label: 'SHIPPED', color: 'bg-purple-100 text-purple-600' },
    };
    const config = configs[status] || configs.draft;
    return <Badge className={cn("border-none text-[8px] font-black uppercase px-2 py-0.5", config.color)}>{config.label}</Badge>;
  };

  useEffect(() => {
    if (b2bActivityLogs.length === 0) {
      addB2bActivityLog({
        type: 'order_created',
        actor: { id: 'ret-1', name: 'Premium Store', type: 'retailer' },
        target: { id: '#8821', name: 'Wholesale Order', type: 'order' },
        details: 'Created new pre-order for FW26 Collection.'
      });
    }

    if (b2bNegotiations.length === 0) {
      addNegotiationMessage('#8821', {
        type: 'system',
        sender: { id: 'sys', name: 'System', role: 'admin' },
        text: 'Order created from Marketroom.'
      });
      updateOrderWholesaleStatus('#8821', 'pending_admin');
      
      addNegotiationMessage('#8822', {
        type: 'message',
        sender: { id: 'ret-1', name: 'Milan Concept Store', role: 'shop' },
        text: 'Can we get a 5% discount for bulk pre-order?'
      });
      updateOrderWholesaleStatus('#8822', 'pending_brand');
    }
  }, []);

  return (
    <div className="space-y-4 p-4 bg-slate-50/50 min-h-screen text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="bg-white border-slate-200 text-slate-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
              SYNTHA_ADMIN_PANEL_v1.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-base font-black uppercase tracking-tighter text-slate-900 leading-none">
            B2B Control<br/>Center
          </h2>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Overview', icon: BarChart3 },
            { id: 'orders', label: 'Order Flow', icon: ShoppingBag },
            { id: 'ats', label: 'ATS Inventory', icon: Globe },
            { id: 'logistics', label: 'Logistics', icon: Truck },
            { id: 'workplace', label: 'Workplace', icon: LayoutGrid },
            { id: 'enterprise', label: 'Enterprise Suite', icon: ShieldCheck },
            { id: 'analytics', label: 'Analytics', icon: Activity },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab.id 
                  ? "bg-slate-900 text-white shadow-xl" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-slate-200/50 overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            <CardContent className="p-4 relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Zap className="h-12 w-12 text-slate-900" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-base font-black text-slate-900 tracking-tighter">{stat.val}</h3>
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg",
                    stat.trend.startsWith('+') ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                  )}>
                    {stat.trend.startsWith('+') ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
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
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3"
                >
                  {[
                    { id: 'collab', title: 'Collaboration Hub', desc: 'Tasks, Calendar & Messaging', icon: MessageSquare, component: B2BCollaborationHub },
                    { id: 'pim', title: 'PIM System', desc: 'Product Information & Media', icon: Database, component: ProductInformationManager },
                    { id: 'claims', title: 'Claims Portal', desc: 'Automated Returns & Credits', icon: ShieldAlert, component: ClaimsReturnsPortal },
                    { id: 'dms', title: 'DMS Vault', desc: 'Secure Document Management', icon: FolderOpen, component: DocumentManagementSystem },
                    { id: 'crm-intel', title: 'Partner CRM', desc: 'Engagement & Performance Analytics', icon: BarChart3, component: PartnerAnalyticsCRM },
                    { id: 'leads', title: 'Lead Scoring', desc: 'AI-driven Retailer Prospecting', icon: Target, component: LeadScoringDashboard },
                    { id: 'identity', title: 'White Label', desc: 'Custom Retailer Experience', icon: Settings, component: WhiteLabelConfigurator },
                    { id: 'showroom-360', title: 'Showroom 360°', desc: 'Deep Zoom & Visual Discovery', icon: Scan, component: DigitalShowroom360 },
                    { id: 'collab-buying', title: 'Team Buying', desc: 'Collaborative curation & voting', icon: Users, component: CollaborativeBuyingPortal },
                    { id: ' marketing-cloud', title: 'Asset Cloud', desc: 'Social content & marketing sync', icon: Cloud, component: MarketingAssetCloud },
                    { id: 'lookbook', title: 'Visual Hub', desc: 'Interactive Digital Lookbooks', icon: BookOpen, component: InteractiveLookbook },
                    { id: 'financing', title: 'BNPL Center', desc: 'B2B Buy Now Pay Later', icon: Landmark, component: B2BFinancing },
                    { id: 'heatmap', title: 'Global Map', desc: 'Real-time Demand Heatmap', icon: Globe, component: DemandHeatmap },
                    { id: 'prod-pulse', title: 'Production Pulse', desc: 'Real-time IoT factory tracking', icon: Activity, component: ProductionPulseTracker },
                    { id: 'sales-team', title: 'Sales Team', desc: 'Quota & Performance tracking', icon: Zap, component: SalesRepDashboard },
                    { id: 'pricing', title: 'Pricing Matrix', desc: 'Multi-tier MOQ & Discount logic', icon: Percent, component: PricingTierManager },
                    { id: 'financial-hub', title: 'Financial Hub', desc: 'Forecasting & Budgeting', icon: DollarSign, component: B2BFinancialPerformance },
                    { id: 'channel-sales', title: 'Omni-Channel', desc: 'Cross-platform sales intel', icon: Globe, component: ChannelSalesAnalytics },
                    { id: 'merch', title: 'Digital Rack', desc: 'Merchandising & Planograms', icon: ShoppingBag, component: MerchandisingDashboard },
                    { id: 'planning', title: 'SKU Planner', desc: 'Assortment & Budget AI', icon: PieChart, component: PlanningDashboard },
                  ].map((tool) => (
                    <Card 
                      key={tool.id} 
                      onClick={() => setActiveEnterpriseTool(tool.id)}
                      className="group border-none shadow-xl shadow-slate-200/50 rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-all bg-white"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                          <tool.icon className="h-6 w-6 text-slate-400 group-hover:text-white" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-slate-200 group-hover:text-slate-900 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </div>
                      <h4 className="text-base font-black uppercase tracking-tight text-slate-900 mb-2">{tool.title}</h4>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed">{tool.desc}</p>
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
                    className="absolute -top-16 left-0 text-slate-400 hover:text-slate-900 font-black uppercase text-[10px] tracking-widest gap-2"
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
                  {activeEnterpriseTool === 'showroom-360' && <DigitalShowroom360 onClose={() => setActiveEnterpriseTool(null)} />}
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
                      b2bCart={[]} // Admin view might not have a cart, but let's pass empty for now
                      setB2bCart={() => {}}
                      merchStatus="ready"
                      setMerchStatus={() => {}}
                      activeMerchBrand="Platform View"
                      isCustomerPov={false}
                      setIsCustomerPov={() => {}}
                    />
                  )}
                  {activeEnterpriseTool === 'planning' && (
                    <PlanningDashboard 
                      b2bCart={[]}
                      viewRole="admin"
                      currency="RUB"
                      toast={console.log}
                    />
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
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                >
                  {[
                    { id: 'escrow', title: 'Financial Escrow', desc: 'Secure B2B payment holding protocol', icon: Lock, component: B2BPaymentEscrow },
                    { id: 'ai-advisor', title: 'Buy-Plan Advisor', desc: 'AI-driven purchase optimization', icon: Brain, component: AIBuyPlanAdvisor },
                    { id: 'edi', title: 'EDI Ecosystem', desc: 'Direct ERP/1C synchronization hub', icon: Database, component: EDISyncDashboard },
                    { id: 'vr', title: 'VR Showroom', desc: 'Immersive 3D wholesale experience', icon: Globe, component: VRShowroomModule },
                    { id: 'currency', title: 'Settlement Engine', desc: 'Multi-currency & trade terms', icon: Globe, component: MultiCurrencySwitcher },
                    { id: 'sustainability', title: 'Eco Passport', desc: 'Digital product sustainability ledger', icon: Leaf, component: SustainabilityPassport },
                    { id: 'loyalty', title: 'Partner Rewards', desc: 'Wholesale loyalty & tier manager', icon: Crown, component: WholesaleLoyaltyHub },
                    { id: 'marketing', title: 'Retailer Ads', desc: 'In-app engagement & placements', icon: Megaphone, component: B2BMarketingManager },
                    { id: 'hs-assistant', title: 'HS Assistant', desc: 'AI Customs Classification', icon: Gavel, component: CustomsHSAssistant },
                    { id: 'customs', title: 'Customs Gateway', desc: 'Automated global trade documents', icon: FileText, component: CustomsDocumentAutomation },
                    { id: 'finance', title: 'Credit & Terms', desc: 'Wholesale limits & net conditions', icon: DollarSign, component: FinancialTermsManager },
                    { id: 'allocation', title: 'Smart Allocation', desc: 'VIP priority & stock distribution', icon: Layers, component: SmartAllocationEngine },
                    { id: 'landed-cost', title: 'Landed Cost', desc: 'Global trade & tax calculator', icon: Calculator, component: LandedCostCalculator },
                    { id: 'contracts', title: 'Legal & Signing', desc: 'Digital agreements & compliance', icon: PenTool, component: WholesaleContractManager },
                    { id: 'sales-reps', title: 'Sales Team', desc: 'Rep performance & quota tracking', icon: Users, component: SalesRepDashboard },
                    { id: 'pricing-tiers', title: 'Pricing Matrix', desc: 'Tiered discounts & MOQ logic', icon: Percent, component: PricingTierManager },
                  ].map((tool) => (
                    <Card 
                      key={tool.id} 
                      onClick={() => setActiveEnterpriseTool(tool.id)}
                      className="group border-none shadow-xl shadow-slate-200/50 rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-all bg-white"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                          <tool.icon className="h-6 w-6 text-slate-400 group-hover:text-white" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </div>
                      <h4 className="text-base font-black uppercase tracking-tight text-slate-900 mb-2">{tool.title}</h4>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed">{tool.desc}</p>
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
                    className="absolute -top-16 left-0 text-slate-400 hover:text-slate-900 font-black uppercase text-[10px] tracking-widest gap-2"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Activity Feed / Order Flow */}
            <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 rounded-xl overflow-hidden bg-white">
              <CardHeader className="p-4 pb-4 flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base font-black uppercase tracking-tight">
                    {activeTab === 'orders' ? 'Global Order Registry' : 'Live Activity Flow'}
                  </CardTitle>
                  <CardDescription className="text-[10px] uppercase font-bold text-slate-400">
                    {activeTab === 'orders' ? 'Transaction lifecycle monitoring' : 'Real-time B2B interaction stream'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" size="sm" className="h-8 rounded-lg border-slate-100 text-[10px] font-black uppercase">
                      Export CSV
                   </Button>
                   <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-100">
                      <Filter className="h-3.5 w-3.5" />
                   </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {activeTab === 'orders' ? (
                      b2bNegotiations.length > 0 ? b2bNegotiations.map((neg) => (
                        <motion.div 
                          key={neg.orderId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="group flex flex-col p-4 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                <ShoppingBag className="h-5 w-5 text-indigo-600" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-slate-900 uppercase">Order {neg.orderId}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last activity: {new Date(neg.lastUpdate).toLocaleTimeString()}</p>
                              </div>
                            </div>
                            {getStatusBadge(neg.status)}
                          </div>
                          
                          <div className="flex items-center gap-3 py-3 border-y border-slate-200/50 mb-4">
                            <div className="flex -space-x-2">
                              <div className="h-6 w-6 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">B</div>
                              <div className="h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">R</div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-600 uppercase">
                              Brand <span className="text-slate-300 mx-1">↔</span> Retailer
                            </p>
                            <div className="ml-auto flex items-center gap-2">
                              <Badge variant="outline" className="bg-white text-[9px] border-slate-200">12 items</Badge>
                              <Badge variant="outline" className="bg-white text-[9px] border-slate-200">1.2M ₽</Badge>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {neg.status === 'pending_admin' && (
                              <Button 
                                onClick={() => updateOrderWholesaleStatus(neg.orderId, 'confirmed')}
                                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-black uppercase rounded-xl h-9 shadow-lg shadow-rose-200"
                              >
                                Approve Transaction
                              </Button>
                            )}
                            <Button 
                              onClick={() => setSelectedNegId(neg.orderId)}
                              variant="outline" 
                              className="flex-1 text-[9px] font-black uppercase rounded-xl h-9 bg-white border-slate-200 gap-2"
                            >
                              <MessageSquare className="h-3 w-3" />
                              Intervene
                            </Button>
                          </div>
                        </motion.div>
                      )) : (
                        <div className="py-10 text-center space-y-4">
                           <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                              <Layers className="h-8 w-8 text-slate-200" />
                           </div>
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No active orders in flow...</p>
                        </div>
                      )
                    ) : (
                      b2bActivityLogs.length > 0 ? b2bActivityLogs.map((log) => (
                        <motion.div 
                          key={log.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="group flex items-start gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                        >
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                            log.type === 'order_placed' ? "bg-emerald-100 text-emerald-600" :
                            log.type === 'linesheet_request' ? "bg-indigo-100 text-indigo-600" :
                            "bg-slate-100 text-slate-600"
                          )}>
                             {log.type === 'order_placed' ? <ShoppingBag className="h-5 w-5" /> : 
                              log.type === 'linesheet_request' ? <FileText className="h-5 w-5" /> : 
                              <Activity className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">
                                {log.actor.name} <span className="text-slate-400 mx-2">→</span> {log.details}
                              </p>
                              <span className="text-[9px] font-black text-slate-400 uppercase tabular-nums">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-[7px] border-slate-100 text-slate-400 font-bold uppercase">{log.actor.type}</Badge>
                              <div className="h-1 w-1 rounded-full bg-slate-200" />
                              <span className="text-[8px] font-black text-slate-400 uppercase">IP: 192.168.1.***</span>
                            </div>
                          </div>
                        </motion.div>
                      )) : (
                        <div className="py-10 text-center space-y-4">
                           <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                              <Activity className="h-8 w-8 text-slate-200" />
                           </div>
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No recent activity logged...</p>
                        </div>
                      )
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Side Column: Quick Stats & Connections */}
            <div className="space-y-4">
              <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Globe className="h-32 w-32" />
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-tight">Market Resonance</h3>
                    <Globe className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span>Platform Utilization</span>
                        <span className="text-indigo-400">92%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '92%' }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span>Node Latency</span>
                        <span className="text-emerald-400">42ms</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '42%' }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Active Nodes</h3>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black px-2 py-0.5">34 ONLINE</Badge>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full border-2 border-slate-50 overflow-hidden group-hover:border-indigo-100 transition-colors">
                           <img src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-900 uppercase">Premium Store HQ</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase">Retailer • Moscow</p>
                        </div>
                      </div>
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full h-10 rounded-xl font-black uppercase text-[9px] tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                  View Full Directory
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Admin Intervention Dialog */}
      <Dialog open={!!selectedNegId} onOpenChange={(open) => !open && setSelectedNegId(null)}>
        <DialogContent className="sm:max-w-[500px] bg-white border-none rounded-xl p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-4 pb-4 bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-900/20">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-base font-black uppercase tracking-tighter">Admin Intervention</DialogTitle>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Escrow & Negotiation Resolution Flow</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-4 h-[350px] overflow-y-auto space-y-4 bg-slate-50/50 custom-scrollbar">
            {selectedNeg?.messages.map((msg) => (
              <div key={msg.id} className={cn(
                "flex flex-col gap-1 max-w-[85%]",
                msg.sender.role === 'admin' ? "mx-auto items-center" : 
                msg.sender.role === 'brand' ? "mr-auto items-start" : "ml-auto items-end"
              )}>
                {msg.type === 'system' ? (
                  <div className="w-full text-center py-2 px-4 bg-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {msg.text}
                  </div>
                ) : (
                  <>
                    <div className={cn(
                      "p-3 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm border",
                      msg.sender.role === 'admin' ? "bg-rose-50 border-rose-100 text-rose-900" :
                      msg.sender.role === 'brand' ? "bg-white border-slate-100 text-slate-700" :
                      "bg-indigo-600 border-indigo-500 text-white"
                    )}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest px-1">
                      {msg.sender.name} ({msg.sender.role}) • {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <Input 
                placeholder="Send official platform message..." 
                className="h-12 rounded-xl border-slate-200 bg-slate-50 text-xs font-medium focus-visible:ring-rose-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim() && selectedNegId) {
                      addNegotiationMessage(selectedNegId, {
                        type: 'message',
                        sender: { id: 'admin-1', name: 'Platform Admin', role: 'admin' },
                        text: target.value.trim()
                      });
                      target.value = '';
                    }
                  }
                }}
              />
              <Button className="h-12 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[10px] tracking-widest shrink-0">
                Resolution
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
