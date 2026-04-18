'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
  Briefcase,
  Plus,
  Package,
  TrendingUp,
  Heart,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Wallet,
  Percent,
  ArrowUpRight,
  Target,
  AlertTriangle,
<<<<<<< HEAD
=======
  AlertCircle,
>>>>>>> recover/cabinet-wip-from-stash
  Activity,
  BarChart3,
  Zap,
  MousePointer2,
  Leaf,
  Hammer,
  Send,
  BarChart,
  Gift,
  Truck,
  Globe,
  Box,
  LayoutGrid,
  Factory,
  Map,
  ShoppingBag,
  Scan,
<<<<<<< HEAD
=======
  Lock,
  Smartphone,
>>>>>>> recover/cabinet-wip-from-stash
} from 'lucide-react';
import { getShowroomAppointments } from '@/lib/fashion/showroom-planner';
import { getDraftLooksForPartner } from '@/lib/fashion/showroom-look-to-order';
import { getPartnerReliability } from '@/lib/fashion/showroom-partner-scoring';
import { getShowroomSessionBudget } from '@/lib/fashion/showroom-budget';
import { getShowroomAssortmentCompliance } from '@/lib/fashion/showroom-assortment-compliance';
import { getShowroomSampleTraffic } from '@/lib/fashion/showroom-sample-traffic';
import { getWholesaleNegotiationProposal } from '@/lib/fashion/wholesale-negotiator';
import { getOrderSustainabilityScore } from '@/lib/fashion/sustainability-ledger';
import { getShowroomLookInterest, getTopTrendingShowroomLooks } from '@/lib/fashion/showroom-looks';
import { getPartnerCreditScore } from '@/lib/fashion/partner-credit-score';
import { getPartnerPerks } from '@/lib/fashion/partner-perks';
import { getB2BOrderSplit } from '@/lib/fashion/order-splitting';
import { getVirtualSampleData } from '@/lib/fashion/virtual-sample-fitting';
import { calculateEaeuTaxes } from '@/lib/fashion/eaeu-tax-calculator';
import { checkCapsuleIntegrity } from '@/lib/fashion/assortment-capsule';
import { getWholesaleMilestones } from '@/lib/fashion/wholesale-milestones';
import { getB2BCurrencySettlement } from '@/lib/fashion/b2b-currency-settlement';
import { getShowroomResourceAvailability } from '@/lib/fashion/showroom-resource-management';
import { getWholesaleRegionalHeatmap } from '@/lib/fashion/wholesale-regional-heatmap';
import { getB2BReorderSuggestions } from '@/lib/fashion/b2b-reorder-engine';
import { getShowroomSampleInventory } from '@/lib/fashion/showroom-sample-inventory';
import { simulateOrderImpact } from '@/lib/fashion/showroom-order-simulation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function ShowroomPlannerPage() {
  const appointments = getShowroomAppointments();
  const drafts = getDraftLooksForPartner('PARTNER-01');
  const sessionBudget = getShowroomSessionBudget('SH-2026-01');
  const compliance = getShowroomAssortmentCompliance('SH-2026-01');
  const trendingLooks = getTopTrendingShowroomLooks();
  const esgScore = getOrderSustainabilityScore(['SKU-101', 'SKU-202']);
  const orderSim = simulateOrderImpact('SH-2026-01');
  const perks = getPartnerPerks('PARTNER-01', sessionBudget.currentOrderValue);
  const orderSplit = getB2BOrderSplit('SKU-101', 500);
  const vto = getVirtualSampleData('SKU-101');
  const eaeuTaxes = calculateEaeuTaxes(sessionBudget.currentOrderValue, 'KZ');
  const capsule = checkCapsuleIntegrity('SKU-101', ['SKU-101-TOP', 'SKU-101-ACC']);
  const milestones = getWholesaleMilestones('PO-2026-001');
  const currencySettlement = getB2BCurrencySettlement(
    'PO-2026-001',
    sessionBudget.currentOrderValue,
    'CNY'
  );
  const showroomResources = getShowroomResourceAvailability();
  const regionalHeatmap = getWholesaleRegionalHeatmap('SKU-101');
  const reorderSuggestions = getB2BReorderSuggestions('PARTNER-01', ['SKU-101']);
  const sampleInventory = getShowroomSampleInventory('SKU-101');

  // Active presence for current session
  const presence = {
    sessionId: 'SH-2026-01',
    activeBuyers: [
      { name: 'Elena P.', currentSku: 'SKU-101', lastSeen: 'Active now' },
      { name: 'Igor V.', currentSku: 'SKU-202', lastSeen: '2m ago' },
    ],
  };

  // Collaboration Notes
  const sessionNotes = [
    {
      role: 'brand',
      name: 'Admin',
      text: 'Top trend in South regions. Increased MOQ recommended.',
    },
    { role: 'store', name: 'Elena P.', text: 'Need more color options for SKU-101.' },
    { role: 'distributor', name: 'Logistix', text: 'Direct delivery available for 1000+ units.' },
  ];

  // Live analytics data for the top appointment
  const currentSku = 'SKU-101';
  const traffic = getShowroomSampleTraffic(currentSku);
  const negotiation = getWholesaleNegotiationProposal(currentSku, 4800, 500);

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
<<<<<<< HEAD
          <div className="rounded-lg bg-indigo-100 p-2 shadow-sm">
            <Briefcase className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-tight tracking-tighter text-slate-800">
=======
          <div className="bg-accent-primary/15 rounded-lg p-2 shadow-sm">
            <Briefcase className="text-accent-primary h-6 w-6" />
          </div>
          <h1 className="text-text-primary text-3xl font-bold uppercase tracking-tight tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
            B2B Showroom PRO
          </h1>
        </div>
        <p className="font-medium text-muted-foreground">
          Улучшенное управление оптовыми встречами: трекинг образцов, листы пожеланий партнеров и
          аналитика предзаказов.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Appointments List */}
        <div className="space-y-6 lg:col-span-2">
          {appointments.map((app) => (
            <Card
              key={app.id}
<<<<<<< HEAD
              className="relative overflow-hidden border-2 border-slate-100 p-6 shadow-md transition-all hover:border-indigo-200"
            >
              <div className="absolute right-0 top-0 rotate-12 p-4 opacity-5">
                <Briefcase className="h-24 w-24 text-indigo-600" />
=======
              className="border-border-subtle hover:border-accent-primary/30 relative overflow-hidden border-2 p-6 shadow-md transition-all"
            >
              <div className="absolute right-0 top-0 rotate-12 p-4 opacity-5">
                <Briefcase className="text-accent-primary h-24 w-24" />
>>>>>>> recover/cabinet-wip-from-stash
              </div>

              {(() => {
                const reliability = getPartnerReliability(app.id);
                return (
                  <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex items-center gap-2">
                        <Badge
                          variant="outline"
<<<<<<< HEAD
                          className="h-4 border-slate-200 bg-slate-50 text-[10px] font-black uppercase"
=======
                          className="bg-bg-surface2 border-border-default h-4 text-[10px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          {app.id}
                        </Badge>
                        <Badge
                          className={app.status === 'scheduled' ? 'bg-green-500' : 'bg-orange-500'}
                        >
                          {app.status.toUpperCase()}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`h-4 text-[10px] font-black uppercase ${app.sampleStatus === 'ready' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}
                        >
                          <Package className="mr-1 h-2.5 w-2.5" /> Samples: {app.sampleStatus}
                        </Badge>
                      </div>

                      <div className="mb-4 flex items-start justify-between">
<<<<<<< HEAD
                        <h3 className="text-2xl font-black tracking-tight text-slate-800">
=======
                        <h3 className="text-text-primary text-2xl font-black tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                          {app.partnerName}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
<<<<<<< HEAD
                            <div className="mb-1 text-[8px] font-black uppercase leading-none text-slate-400">
                              Reliability
                            </div>
                            <div
                              className={`text-sm font-black ${reliability.reliabilityTier === 'A+' ? 'text-emerald-600' : 'text-slate-700'}`}
=======
                            <div className="text-text-muted mb-1 text-[8px] font-black uppercase leading-none">
                              Reliability
                            </div>
                            <div
                              className={`text-sm font-black ${reliability.reliabilityTier === 'A+' ? 'text-emerald-600' : 'text-text-primary'}`}
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              Tier {reliability.reliabilityTier}
                            </div>
                          </div>
<<<<<<< HEAD
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
                            <ShieldCheck
                              className={`h-6 w-6 ${reliability.reliabilityTier === 'A+' ? 'text-emerald-500' : 'text-slate-300'}`}
=======
                          <div className="bg-bg-surface2 border-border-subtle flex h-10 w-10 items-center justify-center rounded-xl border">
                            <ShieldCheck
                              className={`h-6 w-6 ${reliability.reliabilityTier === 'A+' ? 'text-emerald-500' : 'text-text-muted'}`}
>>>>>>> recover/cabinet-wip-from-stash
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-6 grid grid-cols-2 gap-6">
<<<<<<< HEAD
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                          <Calendar className="h-4 w-4 text-indigo-500" /> {app.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                          <MapPin className="h-4 w-4 text-indigo-500" /> {app.location}
=======
                        <div className="text-text-secondary flex items-center gap-2 text-sm font-bold">
                          <Calendar className="text-accent-primary h-4 w-4" /> {app.date}
                        </div>
                        <div className="text-text-secondary flex items-center gap-2 text-sm font-bold">
                          <MapPin className="text-accent-primary h-4 w-4" /> {app.location}
>>>>>>> recover/cabinet-wip-from-stash
                        </div>
                      </div>

                      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {app.estimatedPreOrderValue && (
<<<<<<< HEAD
                          <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
                            <div className="flex items-center gap-2 text-xs font-black uppercase text-indigo-700">
                              <TrendingUp className="h-4 w-4" /> Est. Pre-order
                            </div>
                            <div className="text-lg font-black text-indigo-800">
=======
                          <div className="bg-accent-primary/10 border-accent-primary/20 flex items-center justify-between rounded-xl border p-3">
                            <div className="text-accent-primary flex items-center gap-2 text-xs font-black uppercase">
                              <TrendingUp className="h-4 w-4" /> Est. Pre-order
                            </div>
                            <div className="text-accent-primary text-lg font-black">
>>>>>>> recover/cabinet-wip-from-stash
                              {app.estimatedPreOrderValue.toLocaleString()} ₽
                            </div>
                          </div>
                        )}
<<<<<<< HEAD
                        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-500">
                            <CreditCard className="h-4 w-4" /> Pay Score
                          </div>
                          <div className="text-lg font-black text-slate-700">
=======
                        <div className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-xl border p-3">
                          <div className="text-text-secondary flex items-center gap-2 text-xs font-black uppercase">
                            <CreditCard className="h-4 w-4" /> Pay Score
                          </div>
                          <div className="text-text-primary text-lg font-black">
>>>>>>> recover/cabinet-wip-from-stash
                            {reliability.paymentOnTimeRate}%
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
<<<<<<< HEAD
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
                        <h4 className="text-text-muted text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          Partner Feedback & Wishlist
                        </h4>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {app.selectedSkus.map((sku) => (
                            <div
                              key={sku}
<<<<<<< HEAD
                              className="group flex items-center justify-between rounded-lg border border-slate-100 bg-white p-2.5 shadow-sm"
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-slate-200 transition-colors group-hover:bg-indigo-400" />
                                <span className="text-xs font-bold text-slate-700">{sku}</span>
                              </div>
                              {app.partnerFeedback?.[sku] ? (
                                <Badge className="border-none bg-fuchsia-50 text-[8px] font-black uppercase text-fuchsia-700">
                                  <Heart className="mr-1 h-2.5 w-2.5 fill-fuchsia-500" />{' '}
                                  {app.partnerFeedback[sku]}
                                </Badge>
                              ) : (
                                <MessageSquare className="h-3 w-3 cursor-pointer text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
=======
                              className="border-border-subtle group flex items-center justify-between rounded-lg border bg-white p-2.5 shadow-sm"
                            >
                              <div className="flex items-center gap-2">
                                <div className="bg-border-subtle group-hover:bg-accent-primary h-2 w-2 rounded-full transition-colors" />
                                <span className="text-text-primary text-xs font-bold">{sku}</span>
                              </div>
                              {app.partnerFeedback?.[sku] ? (
                                <Badge className="bg-accent-primary/10 text-accent-primary border-none text-[8px] font-black uppercase">
                                  <Heart className="fill-accent-primary mr-1 h-2.5 w-2.5" />{' '}
                                  {app.partnerFeedback[sku]}
                                </Badge>
                              ) : (
                                <MessageSquare className="text-text-muted h-3 w-3 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100" />
>>>>>>> recover/cabinet-wip-from-stash
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="w-full space-y-3 md:w-56">
<<<<<<< HEAD
                      <Button className="h-10 w-full bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white shadow-lg hover:bg-indigo-700">
=======
                      <Button className="bg-accent-primary hover:bg-accent-primary h-10 w-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
                        Enter Session Mode
                      </Button>
                      <Button
                        variant="outline"
<<<<<<< HEAD
                        className="h-10 w-full border-slate-200 text-[10px] font-black uppercase"
=======
                        className="border-border-default h-10 w-full text-[10px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        Send AR Invitation
                      </Button>
                      <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                        <div className="mb-1 flex items-center gap-2 text-[8px] font-black uppercase text-amber-700">
                          <AlertCircle className="h-3 w-3" /> Risk Note
                        </div>
                        <p className="text-[9px] font-bold leading-tight text-amber-800">
                          Fulfillment rate is {reliability.orderFulfillmentRate}%. Monitor MOQ
                          during session.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </Card>
          ))}
        </div>

        {/* Sidebar Tools */}
        <div className="space-y-6">
<<<<<<< HEAD
          <Card className="relative overflow-hidden border-2 border-slate-100 bg-white p-6 shadow-xl">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-800">
              <BarChart3 className="h-4 w-4 text-indigo-600" /> Order Impact Simulator
=======
          <Card className="border-border-subtle relative overflow-hidden border-2 bg-white p-6 shadow-xl">
            <h3 className="text-text-primary mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
              <BarChart3 className="text-accent-primary h-4 w-4" /> Order Impact Simulator
>>>>>>> recover/cabinet-wip-from-stash
            </h3>

            <div className="relative z-10 space-y-5">
              <div className="grid grid-cols-2 gap-4">
<<<<<<< HEAD
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="mb-1 text-[8px] font-black uppercase tracking-tighter text-slate-400">
=======
                <div className="bg-bg-surface2 border-border-subtle rounded-xl border p-3">
                  <div className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                    Proj. Sell-Through
                  </div>
                  <div className="text-lg font-black text-emerald-600">
                    {orderSim.projectedSellThrough}%
                  </div>
                </div>
<<<<<<< HEAD
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="mb-1 text-[8px] font-black uppercase tracking-tighter text-slate-400">
                    Proj. Margin
                  </div>
                  <div className="text-lg font-black text-slate-800">
=======
                <div className="bg-bg-surface2 border-border-subtle rounded-xl border p-3">
                  <div className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-tighter">
                    Proj. Margin
                  </div>
                  <div className="text-text-primary text-lg font-black">
>>>>>>> recover/cabinet-wip-from-stash
                    {orderSim.projectedMargin}%
                  </div>
                </div>
              </div>

              <div className="space-y-3">
<<<<<<< HEAD
                <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-400">
                  <span>Inventory Turnover</span>
                  <span className="text-slate-800">{orderSim.inventoryTurnoverWeeks} Weeks</span>
                </div>
                <Progress
                  value={(orderSim.inventoryTurnoverWeeks / 12) * 100}
                  className="h-1 bg-slate-100 fill-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 p-3">
                <div className="text-[9px] font-bold text-indigo-700">Markdown Risk Score</div>
                <Badge className="h-5 bg-indigo-600 text-[8px] font-black uppercase text-white">
=======
                <div className="text-text-muted flex items-center justify-between text-[9px] font-black uppercase">
                  <span>Inventory Turnover</span>
                  <span className="text-text-primary">{orderSim.inventoryTurnoverWeeks} Weeks</span>
                </div>
                <Progress
                  value={(orderSim.inventoryTurnoverWeeks / 12) * 100}
                  className="bg-bg-surface2 fill-accent-primary h-1"
                />
              </div>

              <div className="bg-accent-primary/10 border-accent-primary/20 flex items-center justify-between rounded-xl border p-3">
                <div className="text-accent-primary text-[9px] font-bold">Markdown Risk Score</div>
                <Badge className="bg-accent-primary h-5 text-[8px] font-black uppercase text-white">
>>>>>>> recover/cabinet-wip-from-stash
                  {orderSim.markdownRiskScore}% LOW
                </Badge>
              </div>
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="border-none bg-slate-100 p-6 shadow-md">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-700">
=======
          <Card className="bg-bg-surface2 border-none p-6 shadow-md">
            <h3 className="text-text-primary mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              <MessageSquare className="h-4 w-4" /> Collaboration Hub
            </h3>
            <div className="custom-scrollbar mb-4 max-h-48 space-y-3 overflow-y-auto pr-2">
              {sessionNotes.map((note, i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="relative rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[7px] font-black uppercase ${note.role === 'brand' ? 'bg-indigo-100 text-indigo-700' : note.role === 'store' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}
                    >
                      {note.role}
                    </span>
                    <span className="text-[7px] font-black uppercase text-slate-400">Now</span>
                  </div>
                  <div className="mb-0.5 text-[10px] font-bold text-slate-800">{note.name}</div>
                  <p className="text-[10px] leading-tight text-slate-600">{note.text}</p>
=======
                  className="border-border-default relative rounded-lg border bg-white p-2.5 shadow-sm"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[7px] font-black uppercase ${note.role === 'brand' ? 'bg-accent-primary/15 text-accent-primary' : note.role === 'store' ? 'bg-emerald-100 text-emerald-700' : 'bg-bg-surface2 text-text-primary'}`}
                    >
                      {note.role}
                    </span>
                    <span className="text-text-muted text-[7px] font-black uppercase">Now</span>
                  </div>
                  <div className="text-text-primary mb-0.5 text-[10px] font-bold">{note.name}</div>
                  <p className="text-text-secondary text-[10px] leading-tight">{note.text}</p>
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Type collaborative note..."
<<<<<<< HEAD
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-3 pr-10 text-[10px] font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white shadow-md transition-colors hover:bg-indigo-700">
=======
                className="border-border-default focus:ring-accent-primary h-9 w-full rounded-lg border bg-white pl-3 pr-10 text-[10px] font-medium outline-none focus:ring-2"
              />
              <button className="bg-accent-primary hover:bg-accent-primary absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-md text-white shadow-md transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="relative overflow-hidden border-none bg-slate-900 p-6 shadow-2xl">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-gradient-to-br from-indigo-500/10 to-transparent" />
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-indigo-400">
=======
          <Card className="bg-text-primary relative overflow-hidden border-none p-6 shadow-2xl">
            <div className="from-accent-primary/10 pointer-events-none absolute left-0 top-0 h-full w-full bg-gradient-to-br to-transparent" />
            <h3 className="text-accent-primary mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              <Users className="h-4 w-4" /> Live Buyer Presence
            </h3>

            <div className="relative z-10 space-y-3">
              {presence.activeBuyers.map((buyer, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
<<<<<<< HEAD
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-black">
                        {buyer.name[0]}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-500" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-white">{buyer.name}</div>
                      <div className="text-[8px] font-bold uppercase tracking-tighter text-indigo-300">
=======
                      <div className="bg-accent-primary flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black">
                        {buyer.name[0]}
                      </div>
                      <div className="border-text-primary absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 bg-emerald-500" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-white">{buyer.name}</div>
                      <div className="text-accent-primary text-[8px] font-bold uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                        Viewing: {buyer.currentSku}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-0.5 flex items-center justify-end gap-1 text-[8px] font-black uppercase text-white/40">
                      <Clock className="h-2.5 w-2.5" /> {buyer.lastSeen}
                    </div>
<<<<<<< HEAD
                    <button className="text-[7px] font-black uppercase tracking-widest text-indigo-400 underline hover:text-white">
=======
                    <button className="text-accent-primary text-[7px] font-black uppercase tracking-widest underline hover:text-white">
>>>>>>> recover/cabinet-wip-from-stash
                      Join View
                    </button>
                  </div>
                </div>
              ))}
            </div>

<<<<<<< HEAD
            <div className="mt-4 rounded-lg bg-indigo-500/20 p-2 text-center text-[8px] font-black uppercase tracking-widest text-indigo-200">
=======
            <div className="bg-accent-primary/20 text-accent-primary/40 mt-4 rounded-lg p-2 text-center text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Showroom Multi-User Sync Enabled
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="group relative overflow-hidden border-2 border-slate-800 bg-slate-900 p-6 shadow-2xl">
=======
          <Card className="bg-text-primary border-text-primary/30 group relative overflow-hidden border-2 p-6 shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
              <Map className="h-24 w-24 text-white" />
            </div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white">
<<<<<<< HEAD
              <Map className="h-4 w-4 text-indigo-400" /> Regional Demand Heatmap
=======
              <Map className="text-accent-primary h-4 w-4" /> Regional Demand Heatmap
>>>>>>> recover/cabinet-wip-from-stash
            </h3>

            <div className="relative z-10 mb-6 space-y-4">
              {regionalHeatmap.map((h, i) => (
                <div key={h.region} className="group/item">
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="text-[11px] font-black uppercase tracking-tight text-white">
                      {h.region}
                    </div>
<<<<<<< HEAD
                    <div className="text-[10px] font-black text-indigo-300">{h.interestScore}%</div>
                  </div>
                  <Progress
                    value={h.interestScore}
                    className="h-1 rounded-full bg-white/10 fill-indigo-500"
                  />
                  <div className="mt-1 flex items-center justify-between text-[8px] font-bold uppercase text-slate-500">
=======
                    <div className="text-accent-primary text-[10px] font-black">
                      {h.interestScore}%
                    </div>
                  </div>
                  <Progress
                    value={h.interestScore}
                    className="fill-accent-primary h-1 rounded-full bg-white/10"
                  />
                  <div className="text-text-secondary mt-1 flex items-center justify-between text-[8px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                    <span>Proj: {h.projectedUnits} units</span>
                    <span className="text-emerald-500">+{h.growthRate}% Growth</span>
                  </div>
                </div>
              ))}
            </div>

<<<<<<< HEAD
            <Button className="h-10 w-full bg-indigo-600 text-[10px] font-black uppercase text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700">
=======
            <Button className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/20 h-10 w-full text-[10px] font-black uppercase text-white shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
              Export Regional Analysis
            </Button>
          </Card>

<<<<<<< HEAD
          <Card className="group relative overflow-hidden border-2 border-indigo-500 bg-indigo-600 p-6 shadow-xl">
=======
          <Card className="bg-accent-primary border-accent-primary group relative overflow-hidden border-2 p-6 shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-10 transition-transform group-hover:scale-110">
              <Sparkles className="h-32 w-32 text-white" />
            </div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white">
              <Sparkles className="h-4 w-4 text-white" /> Smart Reorder Hub (AI)
            </h3>

            <div className="relative z-10 mb-4 space-y-3">
              {reorderSuggestions.slice(0, 2).map((s) => (
                <div
                  key={s.sku}
                  className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-3.5 w-3.5 text-white" />
                      <div>
                        <div className="text-[10px] font-black uppercase text-white">{s.sku}</div>
<<<<<<< HEAD
                        <div className="text-[7px] font-bold uppercase text-indigo-200">
=======
                        <div className="text-accent-primary/40 text-[7px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                          {s.reason}
                        </div>
                      </div>
                    </div>
                    <div className="text-[12px] font-black text-white">+{s.suggestedQty}</div>
                  </div>
                  <Progress
                    value={s.confidenceScore}
                    className="h-1 rounded-full bg-white/10 fill-white"
                  />
                </div>
              ))}
            </div>

<<<<<<< HEAD
            <Button className="h-10 w-full bg-white text-[10px] font-black uppercase text-indigo-600 shadow-lg hover:bg-indigo-50">
=======
            <Button className="text-accent-primary hover:bg-accent-primary/10 h-10 w-full bg-white text-[10px] font-black uppercase shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
              Apply All Suggestions
            </Button>
          </Card>

<<<<<<< HEAD
          <Card className="group relative overflow-hidden border-2 border-slate-100 bg-white p-6 shadow-xl">
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5 transition-transform group-hover:scale-110">
              <Scan className="h-24 w-24 text-slate-900" />
            </div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-800">
              <Scan className="h-4 w-4 text-slate-700" /> Live Sample Inventory
            </h3>

            <div className="relative z-10 mb-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
=======
          <Card className="border-border-subtle group relative overflow-hidden border-2 bg-white p-6 shadow-xl">
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5 transition-transform group-hover:scale-110">
              <Scan className="text-text-primary h-24 w-24" />
            </div>
            <h3 className="text-text-primary mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
              <Scan className="text-text-primary h-4 w-4" /> Live Sample Inventory
            </h3>

            <div className="bg-bg-surface2 border-border-subtle relative z-10 mb-4 rounded-2xl border p-4">
>>>>>>> recover/cabinet-wip-from-stash
              <div className="mb-3 flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-white shadow-sm ${
                    sampleInventory.status === 'available'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  <Box className="h-5 w-5" />
                </div>
                <div>
<<<<<<< HEAD
                  <div className="text-[11px] font-black text-slate-800">{sampleInventory.id}</div>
=======
                  <div className="text-text-primary text-[11px] font-black">
                    {sampleInventory.id}
                  </div>
>>>>>>> recover/cabinet-wip-from-stash
                  <Badge
                    className={`h-4 border-none text-[8px] font-black uppercase ${
                      sampleInventory.status === 'available'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {sampleInventory.status}
                  </Badge>
                </div>
              </div>
<<<<<<< HEAD
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">
=======
              <div className="text-text-secondary flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                <MapPin className="h-3 w-3" /> {sampleInventory.currentZone}
              </div>
            </div>

            <Button
              variant="outline"
<<<<<<< HEAD
              className="h-10 w-full border-slate-900 text-[10px] font-black uppercase text-slate-900 hover:bg-slate-50"
=======
              className="border-text-primary text-text-primary hover:bg-bg-surface2 h-10 w-full text-[10px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Refresh Sample Status
            </Button>
          </Card>

<<<<<<< HEAD
          <Card className="group relative overflow-hidden border-2 border-slate-800 bg-slate-900 p-6 shadow-2xl">
=======
          <Card className="bg-text-primary border-text-primary/30 group relative overflow-hidden border-2 p-6 shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
              <Truck className="h-24 w-24 text-white" />
            </div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white">
<<<<<<< HEAD
              <Truck className="h-4 w-4 text-indigo-400" /> Order Lifecycle Tracker
=======
              <Truck className="text-accent-primary h-4 w-4" /> Order Lifecycle Tracker
>>>>>>> recover/cabinet-wip-from-stash
            </h3>

            <div className="relative z-10 mb-6 space-y-4">
              {milestones.map((m, i) => (
                <div key={m.id} className="group/item flex items-center gap-4">
                  <div
<<<<<<< HEAD
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-slate-800 ${
                      m.status === 'completed'
                        ? 'bg-emerald-500 text-white'
                        : m.status === 'in_progress'
                          ? 'animate-pulse bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-500'
=======
                    className={`border-text-primary/30 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                      m.status === 'completed'
                        ? 'bg-emerald-500 text-white'
                        : m.status === 'in_progress'
                          ? 'bg-accent-primary animate-pulse text-white'
                          : 'bg-text-primary/90 text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                    }`}
                  >
                    {m.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : m.id === 'PRODUCTION' ? (
                      <Factory className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
<<<<<<< HEAD
                    <div className="mb-1 text-[11px] font-black uppercase leading-none tracking-tight text-white transition-colors group-hover/item:text-indigo-300">
                      {m.name}
                    </div>
                    <div className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
=======
                    <div className="group-hover/item:text-accent-primary mb-1 text-[11px] font-black uppercase leading-none tracking-tight text-white transition-colors">
                      {m.name}
                    </div>
                    <div className="text-text-secondary text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      Est: {m.estimatedDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>

<<<<<<< HEAD
            <Button className="h-10 w-full bg-indigo-600 text-[10px] font-black uppercase text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700">
=======
            <Button className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/20 h-10 w-full text-[10px] font-black uppercase text-white shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
              Detailed Delivery SLA
            </Button>
          </Card>

          <Card className="group relative overflow-hidden border-2 border-emerald-600 bg-white p-6 shadow-xl">
            <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-5 transition-transform group-hover:scale-110">
              <Globe className="h-32 w-32 text-emerald-600" />
            </div>
<<<<<<< HEAD
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-800">
=======
            <h3 className="text-text-primary mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              <Globe className="h-4 w-4 text-emerald-600" /> B2B Regional Settlement
            </h3>

            <div className="relative z-10 mb-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
              <div className="mb-1 flex items-center justify-between">
                <div className="text-[10px] font-black uppercase text-emerald-800">
                  Rate Locked ({currencySettlement.currency})
                </div>
                <Badge className="h-4 border-none bg-emerald-600 text-[8px] font-black uppercase text-white">
                  Active
                </Badge>
              </div>
<<<<<<< HEAD
              <div className="text-2xl font-black text-slate-900">
                {currencySettlement.finalAmount.toLocaleString()} {currencySettlement.currency}
              </div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
=======
              <div className="text-text-primary text-2xl font-black">
                {currencySettlement.finalAmount.toLocaleString()} {currencySettlement.currency}
              </div>
              <div className="text-text-muted mt-1 text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Base: {currencySettlement.baseAmount.toLocaleString()} RUB
              </div>
            </div>

            <div className="relative z-10 mb-4 space-y-2">
<<<<<<< HEAD
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2">
                <div className="text-[9px] font-black uppercase text-slate-500">Currency Pair</div>
                <div className="text-[10px] font-black text-slate-800">
                  RUB / {currencySettlement.currency}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2">
                <div className="text-[9px] font-black uppercase text-slate-500">
                  Rate (v. 1.0.8)
                </div>
                <div className="text-[10px] font-black text-slate-800">
=======
              <div className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-xl border p-2">
                <div className="text-text-secondary text-[9px] font-black uppercase">
                  Currency Pair
                </div>
                <div className="text-text-primary text-[10px] font-black">
                  RUB / {currencySettlement.currency}
                </div>
              </div>
              <div className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-xl border p-2">
                <div className="text-text-secondary text-[9px] font-black uppercase">
                  Rate (v. 1.0.8)
                </div>
                <div className="text-text-primary text-[10px] font-black">
>>>>>>> recover/cabinet-wip-from-stash
                  {currencySettlement.exchangeRate}
                </div>
              </div>
            </div>

            <Button className="h-10 w-full bg-emerald-600 text-[10px] font-black uppercase text-white shadow-lg shadow-emerald-500/10 hover:bg-emerald-700">
              Open Regional Payment Gateway
            </Button>
          </Card>

<<<<<<< HEAD
          <Card className="group relative overflow-hidden border-2 border-slate-900 bg-white p-6 shadow-2xl">
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
              <Users className="h-24 w-24 text-slate-900" />
            </div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-800">
              <Users className="h-4 w-4 text-slate-700" /> Showroom Resource Sync
=======
          <Card className="border-text-primary group relative overflow-hidden border-2 bg-white p-6 shadow-2xl">
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
              <Users className="text-text-primary h-24 w-24" />
            </div>
            <h3 className="text-text-primary mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
              <Users className="text-text-primary h-4 w-4" /> Showroom Resource Sync
>>>>>>> recover/cabinet-wip-from-stash
            </h3>

            <div className="relative z-10 mb-6 space-y-4">
              {showroomResources.map((r) => (
                <div key={r.resourceId} className="group/item">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${r.availabilityPercent > 50 ? 'bg-emerald-100' : 'bg-amber-100'}`}
                      >
                        {r.type === 'stylist' ? (
                          <Users
                            className={`h-4 w-4 ${r.availabilityPercent > 50 ? 'text-emerald-600' : 'text-amber-600'}`}
                          />
                        ) : r.type === 'fitting_room' ? (
                          <LayoutGrid
                            className={`h-4 w-4 ${r.availabilityPercent > 50 ? 'text-emerald-600' : 'text-amber-600'}`}
                          />
                        ) : (
                          <Box
                            className={`h-4 w-4 ${r.availabilityPercent > 50 ? 'text-emerald-600' : 'text-amber-600'}`}
                          />
                        )}
                      </div>
                      <div>
<<<<<<< HEAD
                        <div className="text-[11px] font-black leading-tight text-slate-800 transition-colors group-hover/item:text-indigo-600">
                          {r.name}
                        </div>
                        <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
=======
                        <div className="text-text-primary group-hover/item:text-accent-primary text-[11px] font-black leading-tight transition-colors">
                          {r.name}
                        </div>
                        <div className="text-text-muted text-[8px] font-bold uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                          Next: {r.nextAvailableSlot}
                        </div>
                      </div>
                    </div>
<<<<<<< HEAD
                    <div className="text-[10px] font-black text-slate-800">
=======
                    <div className="text-text-primary text-[10px] font-black">
>>>>>>> recover/cabinet-wip-from-stash
                      {r.availabilityPercent}%
                    </div>
                  </div>
                  <Progress
                    value={r.availabilityPercent}
                    className={`h-1 rounded-full ${r.availabilityPercent > 50 ? 'fill-emerald-500' : 'fill-amber-500'}`}
                  />
                </div>
              ))}
            </div>

<<<<<<< HEAD
            <Button className="h-10 w-full bg-slate-900 text-[10px] font-black uppercase text-white shadow-lg hover:bg-black">
=======
            <Button className="bg-text-primary h-10 w-full text-[10px] font-black uppercase text-white shadow-lg hover:bg-black">
>>>>>>> recover/cabinet-wip-from-stash
              Manage Capacity & Slots
            </Button>
          </Card>

<<<<<<< HEAD
          <Card className="group relative overflow-hidden border-2 border-slate-800 bg-slate-900 p-6 shadow-2xl">
=======
          <Card className="bg-text-primary border-text-primary/30 group relative overflow-hidden border-2 p-6 shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5 transition-transform group-hover:scale-110">
              <Truck className="h-24 w-24 text-white" />
            </div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white">
<<<<<<< HEAD
              <Truck className="h-4 w-4 text-indigo-400" /> Ship-to-Store Splitter
=======
              <Truck className="text-accent-primary h-4 w-4" /> Ship-to-Store Splitter
>>>>>>> recover/cabinet-wip-from-stash
            </h3>

            <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="mb-1 flex items-center justify-between">
<<<<<<< HEAD
                <div className="text-[10px] font-black uppercase text-indigo-300">
                  Current SKU: {orderSplit.sku}
                </div>
                <Badge className="h-4 border-none bg-indigo-500 text-[8px] font-black text-white">
=======
                <div className="text-accent-primary text-[10px] font-black uppercase">
                  Current SKU: {orderSplit.sku}
                </div>
                <Badge className="bg-accent-primary h-4 border-none text-[8px] font-black text-white">
>>>>>>> recover/cabinet-wip-from-stash
                  MULTI-DIST
                </Badge>
              </div>
              <div className="text-2xl font-black text-white">{orderSplit.totalQty} Units</div>
            </div>

            <div className="relative z-10 mb-6 space-y-2">
              {orderSplit.splits.map((s, i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 transition-all hover:border-indigo-500/30"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-indigo-400" />
=======
                  className="hover:border-accent-primary/30 flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="text-accent-primary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                    <div>
                      <div className="text-[11px] font-black text-white">{s.storeId}</div>
                      <div className="text-[8px] font-bold uppercase tracking-widest text-white/40">
                        {s.status}
                      </div>
                    </div>
                  </div>
<<<<<<< HEAD
                  <div className="text-[14px] font-black text-indigo-300">{s.qty}</div>
=======
                  <div className="text-accent-primary text-[14px] font-black">{s.qty}</div>
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              ))}
            </div>

<<<<<<< HEAD
            <Button className="h-10 w-full bg-indigo-600 text-[10px] font-black uppercase text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700">
=======
            <Button className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/20 h-10 w-full text-[10px] font-black uppercase text-white shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
              Finalize Multi-Store Splitting
            </Button>
          </Card>

          <Card className="group relative overflow-hidden border-2 border-amber-100 bg-white p-6 shadow-xl">
            <div className="pointer-events-none absolute -bottom-4 -left-4 opacity-5 transition-transform group-hover:scale-110">
              <Gift className="h-32 w-32 text-amber-600" />
            </div>
<<<<<<< HEAD
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-800">
=======
            <h3 className="text-text-primary mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              <Gift className="h-4 w-4 text-amber-600" /> Partner Perk Progress
            </h3>

            <div className="relative z-10 mb-4 space-y-5">
              {perks.map((perk) => (
                <div key={perk.perkId} className="group/item">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
<<<<<<< HEAD
                        className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${perk.isUnlocked ? 'bg-amber-100' : 'bg-slate-100'}`}
=======
                        className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${perk.isUnlocked ? 'bg-amber-100' : 'bg-bg-surface2'}`}
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        {perk.isUnlocked ? (
                          <Sparkles className="h-4 w-4 animate-pulse text-amber-600" />
                        ) : (
<<<<<<< HEAD
                          <Lock className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-[11px] font-black leading-tight text-slate-800 transition-colors group-hover/item:text-amber-600">
                          {perk.title}
                        </div>
                        <div className="text-[8px] font-medium uppercase tracking-wider text-slate-400">
=======
                          <Lock className="text-text-muted h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-text-primary text-[11px] font-black leading-tight transition-colors group-hover/item:text-amber-600">
                          {perk.title}
                        </div>
                        <div className="text-text-muted text-[8px] font-medium uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                          {perk.requirementDescription}
                        </div>
                      </div>
                    </div>
                    {perk.isUnlocked && (
                      <Badge className="h-4 border-none bg-emerald-500 text-[8px] font-black uppercase tracking-tighter text-white">
                        UNLOCKED
                      </Badge>
                    )}
                  </div>

                  {!perk.isUnlocked && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Progress
                          value={perk.progressPercent}
<<<<<<< HEAD
                          className="h-1.5 rounded-full bg-slate-100 fill-amber-500"
=======
                          className="bg-bg-surface2 h-1.5 rounded-full fill-amber-500"
>>>>>>> recover/cabinet-wip-from-stash
                        />
                      </div>
                      <span className="text-[10px] font-black text-amber-600">
                        {Math.round(perk.progressPercent)}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="relative z-10 rounded-xl border border-amber-100 bg-amber-50 p-3 text-center">
              <p className="mb-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-800">
                <TrendingUp className="h-3 w-3" /> Next Reward in 1.2M ₽
              </p>
              <div className="text-[8px] font-bold uppercase text-amber-600/70">
                Unlock Priority Logistics Tier
              </div>
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="group relative overflow-hidden border-2 border-indigo-100 bg-white p-6 shadow-xl">
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5 transition-transform group-hover:scale-110">
              <Box className="h-24 w-24 text-indigo-600" />
            </div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-800">
              <Box className="h-4 w-4 text-indigo-600" /> Virtual Sample Hub
            </h3>

            <div className="relative z-10 mb-4 rounded-2xl border border-indigo-100/50 bg-indigo-50/30 p-4">
              <div className="mb-3 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-50 bg-white shadow-sm">
                  <Smartphone className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-slate-800">3D VTO Enabled</div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
=======
          <Card className="border-accent-primary/20 group relative overflow-hidden border-2 bg-white p-6 shadow-xl">
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5 transition-transform group-hover:scale-110">
              <Box className="text-accent-primary h-24 w-24" />
            </div>
            <h3 className="text-text-primary mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
              <Box className="text-accent-primary h-4 w-4" /> Virtual Sample Hub
            </h3>

            <div className="bg-accent-primary/10 border-accent-primary/20 relative z-10 mb-4 rounded-2xl border p-4">
              <div className="mb-3 flex items-center gap-4">
                <div className="border-accent-primary/15 flex h-12 w-12 items-center justify-center rounded-xl border bg-white shadow-sm">
                  <Smartphone className="text-accent-primary h-6 w-6" />
                </div>
                <div>
                  <div className="text-text-primary text-[11px] font-black">3D VTO Enabled</div>
                  <div className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Fit Accuracy: {vto.fitAccuracy}%
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {vto.avatarTypes.map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
<<<<<<< HEAD
                    className="h-3.5 border-slate-100 bg-white text-[7px] font-black uppercase"
=======
                    className="border-border-subtle h-3.5 bg-white text-[7px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

<<<<<<< HEAD
            <Button className="h-10 w-full bg-slate-900 text-[10px] font-black uppercase text-white shadow-lg hover:bg-black">
=======
            <Button className="bg-text-primary h-10 w-full text-[10px] font-black uppercase text-white shadow-lg hover:bg-black">
>>>>>>> recover/cabinet-wip-from-stash
              Launch Digital Fitting Room
            </Button>
          </Card>

<<<<<<< HEAD
          <Card className="group relative overflow-hidden border-2 border-slate-100 bg-white p-6 shadow-xl">
            <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-5 transition-transform group-hover:scale-110">
              <Globe className="h-24 w-24 text-slate-600" />
            </div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-800">
              <Globe className="h-4 w-4 text-slate-500" /> EAEU Export Estimator
            </h3>

            <div className="relative z-10 mb-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div>
                  <div className="mb-0.5 text-[8px] font-black uppercase text-slate-400">
                    VAT / NDS ({eaeuTaxes.country})
                  </div>
                  <div className="text-[12px] font-black text-slate-800">
=======
          <Card className="border-border-subtle group relative overflow-hidden border-2 bg-white p-6 shadow-xl">
            <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-5 transition-transform group-hover:scale-110">
              <Globe className="text-text-secondary h-24 w-24" />
            </div>
            <h3 className="text-text-primary mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
              <Globe className="text-text-secondary h-4 w-4" /> EAEU Export Estimator
            </h3>

            <div className="relative z-10 mb-4 space-y-3">
              <div className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-xl border p-3">
                <div>
                  <div className="text-text-muted mb-0.5 text-[8px] font-black uppercase">
                    VAT / NDS ({eaeuTaxes.country})
                  </div>
                  <div className="text-text-primary text-[12px] font-black">
>>>>>>> recover/cabinet-wip-from-stash
                    {Math.round(eaeuTaxes.vatRate * 100)}% Applied
                  </div>
                </div>
                <div className="text-right">
<<<<<<< HEAD
                  <div className="text-[12px] font-black text-indigo-600">
=======
                  <div className="text-accent-primary text-[12px] font-black">
>>>>>>> recover/cabinet-wip-from-stash
                    {eaeuTaxes.estimatedTotalTax.toLocaleString()} {eaeuTaxes.currency}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/30 p-3">
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-700">
                  <ShieldCheck className="h-3 w-3" /> Customs Duty (Zero)
                </div>
                <Badge className="h-4 border-none bg-emerald-500 text-[8px] font-black text-white">
                  DUTY-FREE
                </Badge>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              <p className="text-[8px] font-bold uppercase leading-tight text-amber-700">
                Prices exclude local brokerage fees.
              </p>
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="group relative overflow-hidden border-2 border-slate-900 bg-white p-6 shadow-xl">
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
              <LayoutGrid className="h-20 w-20 text-slate-900" />
            </div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-800">
              <LayoutGrid className="h-4 w-4 text-slate-700" /> Capsule Integrity
            </h3>

            <div className="mb-4 rounded-2xl bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[10px] font-black uppercase text-slate-800">
                  Integrity Score
                </div>
                <div className="text-[12px] font-black text-indigo-600">
=======
          <Card className="border-text-primary group relative overflow-hidden border-2 bg-white p-6 shadow-xl">
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
              <LayoutGrid className="text-text-primary h-20 w-20" />
            </div>
            <h3 className="text-text-primary mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
              <LayoutGrid className="text-text-primary h-4 w-4" /> Capsule Integrity
            </h3>

            <div className="bg-bg-surface2 mb-4 rounded-2xl p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-text-primary text-[10px] font-black uppercase">
                  Integrity Score
                </div>
                <div className="text-accent-primary text-[12px] font-black">
>>>>>>> recover/cabinet-wip-from-stash
                  {capsule.integrityScore}%
                </div>
              </div>
              <Progress
                value={capsule.integrityScore}
<<<<<<< HEAD
                className="h-1.5 rounded-full bg-slate-200 fill-indigo-600"
=======
                className="bg-border-subtle fill-accent-primary h-1.5 rounded-full"
>>>>>>> recover/cabinet-wip-from-stash
              />
            </div>

            <div className="relative z-10 mb-6 space-y-2">
              {capsule.missingSkus.map((sku) => (
                <div
                  key={sku}
                  className="flex items-center justify-between rounded-xl border border-amber-100 bg-white p-2.5 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
<<<<<<< HEAD
                    <div className="text-[10px] font-black uppercase text-slate-600">
=======
                    <div className="text-text-secondary text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                      Missing: {sku}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
<<<<<<< HEAD
                    className="h-6 px-2 text-[8px] font-black uppercase text-indigo-600 hover:bg-indigo-50"
=======
                    className="text-accent-primary hover:bg-accent-primary/10 h-6 px-2 text-[8px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    Add Now
                  </Button>
                </div>
              ))}
              {capsule.isCapsuleComplete && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <div className="text-[10px] font-black uppercase text-emerald-700">
                    Capsule Mix Complete
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="outline"
<<<<<<< HEAD
              className="h-10 w-full border-slate-900 text-[10px] font-black uppercase text-slate-900 hover:bg-slate-50"
=======
              className="border-text-primary text-text-primary hover:bg-bg-surface2 h-10 w-full text-[10px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
            >
              View Suggested Capsule Mix
            </Button>
          </Card>

<<<<<<< HEAD
          <Card className="relative overflow-hidden border-2 border-indigo-600 bg-white p-6 shadow-xl">
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5">
              <Hammer className="h-16 w-16 text-indigo-600" />
            </div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-800">
              <Hammer className="h-4 w-4 text-indigo-600" /> Production Priority Sync
=======
          <Card className="border-accent-primary relative overflow-hidden border-2 bg-white p-6 shadow-xl">
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5">
              <Hammer className="text-accent-primary h-16 w-16" />
            </div>
            <h3 className="text-text-primary mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
              <Hammer className="text-accent-primary h-4 w-4" /> Production Priority Sync
>>>>>>> recover/cabinet-wip-from-stash
            </h3>

            <div className="relative z-10 space-y-4">
              {trendingLooks.map((look) => (
                <div
                  key={look.lookId}
<<<<<<< HEAD
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex-1">
                    <div className="mb-1 text-[10px] font-black uppercase leading-none text-slate-800">
                      {look.lookId}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
=======
                  className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-xl border p-3"
                >
                  <div className="flex-1">
                    <div className="text-text-primary mb-1 text-[10px] font-black uppercase leading-none">
                      {look.lookId}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                        <Heart className="h-2.5 w-2.5 fill-rose-500 text-rose-500" />{' '}
                        {look.totalHearts} Interests
                      </span>
                      <Badge
                        variant="outline"
<<<<<<< HEAD
                        className={`h-3.5 text-[7px] font-black uppercase ${look.trendingStatus === 'rising' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-slate-100 text-slate-400'}`}
=======
                        className={`h-3.5 text-[7px] font-black uppercase ${look.trendingStatus === 'rising' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'bg-bg-surface2 text-text-muted border-border-default'}`}
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        {look.trendingStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
<<<<<<< HEAD
                    <div className="mb-1 text-[8px] font-black uppercase text-slate-400">
                      Factory SLA
                    </div>
                    <Badge
                      className={
                        look.productionPriority === 'urgent'
                          ? 'bg-rose-600 text-white'
                          : look.productionPriority === 'high'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-600 text-white'
                      }
                      variant="outline"
                      className="h-5 border-none text-[8px] font-black uppercase"
=======
                    <div className="text-text-muted mb-1 text-[8px] font-black uppercase">
                      Factory SLA
                    </div>
                    <Badge
                      variant="outline"
                      className={`h-5 border-none text-[8px] font-black uppercase ${
                        look.productionPriority === 'urgent'
                          ? 'bg-rose-600 text-white'
                          : look.productionPriority === 'high'
                            ? 'bg-accent-primary text-white'
                            : 'bg-text-secondary text-white'
                      }`}
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      {look.productionPriority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

<<<<<<< HEAD
            <p className="mt-4 text-center text-[9px] font-medium italic text-slate-500">
=======
            <p className="text-text-secondary mt-4 text-center text-[9px] font-medium italic">
>>>>>>> recover/cabinet-wip-from-stash
              Feedback from showroom sessions automatically triggers production slot reservations.
            </p>
          </Card>

<<<<<<< HEAD
          <Card className="relative overflow-hidden border-2 border-indigo-100 bg-slate-50 p-6 shadow-xl">
            <div className="pointer-events-none absolute -right-4 -top-4 opacity-5">
              <Activity className="h-24 w-24 text-indigo-600" />
            </div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-indigo-700">
=======
          <Card className="bg-bg-surface2 border-accent-primary/20 relative overflow-hidden border-2 p-6 shadow-xl">
            <div className="pointer-events-none absolute -right-4 -top-4 opacity-5">
              <Activity className="text-accent-primary h-24 w-24" />
            </div>
            <h3 className="text-accent-primary mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              <Zap className="h-4 w-4" /> Live Session Analytics
            </h3>

            <div className="relative z-10 space-y-6">
<<<<<<< HEAD
              <div className="relative overflow-hidden rounded-2xl border border-indigo-50 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Active Item Heatmap
                    </div>
                    <div className="text-sm font-black text-slate-800">{currentSku}</div>
                  </div>
                  <Badge className="h-4 border-none bg-indigo-600 text-[8px] font-black uppercase text-white">
=======
              <div className="border-accent-primary/15 relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="text-text-muted mb-1 text-[10px] font-black uppercase tracking-widest">
                      Active Item Heatmap
                    </div>
                    <div className="text-text-primary text-sm font-black">{currentSku}</div>
                  </div>
                  <Badge className="bg-accent-primary h-4 border-none text-[8px] font-black uppercase text-white">
>>>>>>> recover/cabinet-wip-from-stash
                    Live
                  </Badge>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
<<<<<<< HEAD
                    <div className="text-[18px] font-black leading-none text-slate-800">
                      {traffic.totalTouches}
                    </div>
                    <div className="mt-1 text-[7px] font-black uppercase tracking-widest text-slate-400">
=======
                    <div className="text-text-primary text-[18px] font-black leading-none">
                      {traffic.totalTouches}
                    </div>
                    <div className="text-text-muted mt-1 text-[7px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      Physical Touches
                    </div>
                  </div>
                  <div>
<<<<<<< HEAD
                    <div className="text-[18px] font-black leading-none text-indigo-600">
                      {traffic.fittingsCount}
                    </div>
                    <div className="mt-1 text-[7px] font-black uppercase tracking-widest text-slate-400">
=======
                    <div className="text-accent-primary text-[18px] font-black leading-none">
                      {traffic.fittingsCount}
                    </div>
                    <div className="text-text-muted mt-1 text-[7px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      Showroom Fittings
                    </div>
                  </div>
                </div>

                <div>
<<<<<<< HEAD
                  <div className="mb-1.5 flex items-center justify-between text-[8px] font-black uppercase text-slate-400">
=======
                  <div className="text-text-muted mb-1.5 flex items-center justify-between text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                    <span>Interest Density</span>
                    <span>{Math.round(traffic.scanDensityScore)}%</span>
                  </div>
                  <Progress
                    value={traffic.scanDensityScore}
<<<<<<< HEAD
                    className="h-1 bg-slate-50 fill-indigo-500"
=======
                    className="bg-bg-surface2 fill-accent-primary h-1"
>>>>>>> recover/cabinet-wip-from-stash
                  />
                </div>
              </div>

<<<<<<< HEAD
              <div className="relative overflow-hidden rounded-2xl border border-indigo-800 bg-indigo-900 p-4 text-white shadow-lg shadow-indigo-200">
                <div className="absolute right-0 top-0 p-2 opacity-10">
                  <MousePointer2 className="h-12 w-12 text-white" />
                </div>
                <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-300">
=======
              <div className="bg-accent-primary shadow-accent-primary/15 border-accent-primary relative overflow-hidden rounded-2xl border p-4 text-white shadow-lg">
                <div className="absolute right-0 top-0 p-2 opacity-10">
                  <MousePointer2 className="h-12 w-12 text-white" />
                </div>
                <div className="text-accent-primary mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  <BarChart3 className="h-3.5 w-3.5" /> Price Negotiator AI
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
<<<<<<< HEAD
                    <span className="text-[10px] font-bold text-indigo-200">Base Wholesale:</span>
                    <span className="text-[12px] font-black text-indigo-100 line-through decoration-indigo-400">
=======
                    <span className="text-accent-primary/40 text-[10px] font-bold">
                      Base Wholesale:
                    </span>
                    <span className="text-accent-primary/30 decoration-accent-primary text-[12px] font-black line-through">
>>>>>>> recover/cabinet-wip-from-stash
                      {negotiation.baseWholesalePrice.toLocaleString()} ₽
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-2">
<<<<<<< HEAD
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">
=======
                    <span className="text-accent-primary/40 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      AI Counter-Offer:
                    </span>
                    <span className="text-lg font-black text-emerald-400">
                      {negotiation.negotiatedPrice.toLocaleString()} ₽
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/10 p-2">
                    <div className="text-[9px] font-bold text-white/80">
                      Est. Margin: {negotiation.marginAtNegotiatedPrice}%
                    </div>
                    <Badge className="h-4 border-none bg-emerald-500 text-[8px] font-black uppercase text-white">
                      Optimal
                    </Badge>
                  </div>
                  <Button
                    size="sm"
<<<<<<< HEAD
                    className="h-8 w-full bg-white text-[9px] font-black uppercase text-indigo-900 shadow-md hover:bg-indigo-50"
=======
                    className="text-accent-primary hover:bg-accent-primary/10 h-8 w-full bg-white text-[9px] font-black uppercase shadow-md"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    Apply Suggested Price
                  </Button>
                </div>
              </div>
            </div>

<<<<<<< HEAD
            <div className="mt-4 flex items-center justify-center gap-2 text-center text-[8px] font-black uppercase italic tracking-widest text-indigo-400">
=======
            <div className="text-accent-primary mt-4 flex items-center justify-center gap-2 text-center text-[8px] font-black uppercase italic tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              <Activity className="h-3 w-3 animate-pulse" /> Real-time Showroom Hub Telemetry
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="relative overflow-hidden border-none bg-indigo-900 p-6 text-white shadow-2xl">
=======
          <Card className="bg-accent-primary relative overflow-hidden border-none p-6 text-white shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="absolute -right-4 -top-4 opacity-10">
              <Wallet className="h-24 w-24" />
            </div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
<<<<<<< HEAD
              <Wallet className="h-4 w-4 text-indigo-400" /> Session Budget Hub
=======
              <Wallet className="text-accent-primary h-4 w-4" /> Session Budget Hub
>>>>>>> recover/cabinet-wip-from-stash
            </h3>
            <div className="relative z-10 space-y-5">
              <div>
                <div className="mb-1 flex items-end justify-between">
<<<<<<< HEAD
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
=======
                  <span className="text-accent-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Budget Utilization
                  </span>
                  <span className="text-[12px] font-black">
                    {Math.round(
                      (sessionBudget.currentOrderValue / sessionBudget.allocatedBudget) * 100
                    )}
                    %
                  </span>
                </div>
<<<<<<< HEAD
                <div className="h-1.5 overflow-hidden rounded-full bg-indigo-950">
                  <div
                    className="h-full bg-indigo-400"
=======
                <div className="bg-accent-primary h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-accent-primary/40 h-full"
>>>>>>> recover/cabinet-wip-from-stash
                    style={{
                      width: `${(sessionBudget.currentOrderValue / sessionBudget.allocatedBudget) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
<<<<<<< HEAD
                <div className="rounded-xl border border-indigo-800/50 bg-indigo-950/50 p-3">
                  <div className="mb-1 text-[8px] font-black uppercase tracking-tighter text-indigo-400">
=======
                <div className="bg-accent-primary/50 border-accent-primary/50 rounded-xl border p-3">
                  <div className="text-accent-primary mb-1 text-[8px] font-black uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                    Remaining
                  </div>
                  <div className="text-sm font-black tracking-tight">
                    {sessionBudget.remainingBudget.toLocaleString()} ₽
                  </div>
                </div>
<<<<<<< HEAD
                <div className="rounded-xl border border-indigo-800/50 bg-indigo-950/50 p-3">
                  <div className="mb-1 text-[8px] font-black uppercase tracking-tighter text-indigo-400">
=======
                <div className="bg-accent-primary/50 border-accent-primary/50 rounded-xl border p-3">
                  <div className="text-accent-primary mb-1 text-[8px] font-black uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                    Order Margin
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-black tracking-tight">
                    {sessionBudget.currentEstimatedMargin}%{' '}
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2">
<<<<<<< HEAD
                  <Percent className="h-4 w-4 text-indigo-300" />
                  <div className="text-[10px] font-bold text-indigo-100">
                    Target Margin: {sessionBudget.targetMargin}%
                  </div>
                </div>
                <button className="text-[8px] font-black uppercase tracking-widest text-indigo-300 underline hover:text-white">
=======
                  <Percent className="text-accent-primary h-4 w-4" />
                  <div className="text-accent-primary/30 text-[10px] font-bold">
                    Target Margin: {sessionBudget.targetMargin}%
                  </div>
                </div>
                <button className="text-accent-primary text-[8px] font-black uppercase tracking-widest underline hover:text-white">
>>>>>>> recover/cabinet-wip-from-stash
                  Adjust Prices
                </button>
              </div>

              <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 transition-colors hover:bg-emerald-500/20">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-400" />
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">
                    Order ESG Score
                  </div>
                </div>
                <div className="text-sm font-black text-emerald-400">{esgScore}%</div>
              </div>
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="relative overflow-hidden border-2 border-slate-900 bg-white p-6 shadow-xl">
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5">
              <Target className="h-16 w-16 text-slate-900" />
            </div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-800">
              <Target className="h-4 w-4 text-slate-800" /> Assortment Compliance
            </h3>

            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Must-Have Hits</span>
                <span className="text-slate-900">
=======
          <Card className="border-text-primary relative overflow-hidden border-2 bg-white p-6 shadow-xl">
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5">
              <Target className="text-text-primary h-16 w-16" />
            </div>
            <h3 className="text-text-primary mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
              <Target className="text-text-primary h-4 w-4" /> Assortment Compliance
            </h3>

            <div className="mb-6 space-y-4">
              <div className="text-text-muted flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span>Must-Have Hits</span>
                <span className="text-text-primary">
>>>>>>> recover/cabinet-wip-from-stash
                  {compliance.mustHaveItems.filter((i) => i.ordered).length}/
                  {compliance.mustHaveItems.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {compliance.mustHaveItems.map((item) => (
                  <Badge
                    key={item.sku}
                    variant="outline"
                    className={`h-4 text-[8px] font-black uppercase ${item.ordered ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'animate-pulse border-rose-200 bg-rose-50 text-rose-700'}`}
                  >
                    {item.sku}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-6 space-y-3">
<<<<<<< HEAD
              <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
              <div className="text-text-muted mb-2 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Category Balance
              </div>
              {compliance.categoryBalance.map((cat) => (
                <div key={cat.category}>
<<<<<<< HEAD
                  <div className="mb-1 flex items-center justify-between text-[9px] font-bold text-slate-600">
=======
                  <div className="text-text-secondary mb-1 flex items-center justify-between text-[9px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                    <span>{cat.category}</span>
                    <span
                      className={
                        Math.abs(cat.targetPercent - cat.currentPercent) > 10
                          ? 'text-rose-600'
<<<<<<< HEAD
                          : 'text-slate-400'
=======
                          : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                      }
                    >
                      {cat.currentPercent}% / {cat.targetPercent}%
                    </span>
                  </div>
                  <Progress
                    value={cat.currentPercent}
<<<<<<< HEAD
                    className="h-1 bg-slate-100 fill-slate-900"
=======
                    className="bg-bg-surface2 fill-text-primary h-1"
>>>>>>> recover/cabinet-wip-from-stash
                  />
                </div>
              ))}
            </div>

<<<<<<< HEAD
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="text-[10px] font-black text-slate-800">Overall Score</div>
              <div className="text-xl font-black text-slate-900">
=======
            <div className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-xl border p-3">
              <div className="text-text-primary text-[10px] font-black">Overall Score</div>
              <div className="text-text-primary text-xl font-black">
>>>>>>> recover/cabinet-wip-from-stash
                {compliance.overallComplianceScore}%
              </div>
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="relative overflow-hidden border-none bg-slate-900 p-6 text-white shadow-2xl">
=======
          <Card className="bg-text-primary relative overflow-hidden border-none p-6 text-white shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="absolute -bottom-4 -right-4 opacity-10">
              <Sparkles className="h-24 w-24" />
            </div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
<<<<<<< HEAD
              <Sparkles className="h-4 w-4 text-indigo-400" /> Draft Look-to-Order
=======
              <Sparkles className="text-accent-primary h-4 w-4" /> Draft Look-to-Order
>>>>>>> recover/cabinet-wip-from-stash
            </h3>
            <div className="relative z-10 space-y-4">
              {drafts.map((d) => (
                <div
                  key={d.lookId}
<<<<<<< HEAD
                  className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-colors hover:border-indigo-500/50"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-400">
                      {d.lookId}
                    </span>
                    <Badge className="h-4 bg-indigo-500 px-1.5 text-[8px] font-black">DRAFT</Badge>
=======
                  className="bg-text-primary/50 border-text-primary/25 hover:border-accent-primary/50 rounded-xl border p-4 transition-colors"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <span className="text-accent-primary text-[10px] font-black uppercase tracking-tighter">
                      {d.lookId}
                    </span>
                    <Badge className="bg-accent-primary h-4 px-1.5 text-[8px] font-black">
                      DRAFT
                    </Badge>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {d.skus.map((s) => (
                      <span
                        key={s}
<<<<<<< HEAD
                        className="rounded border border-slate-700/30 bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-bold text-slate-400"
=======
                        className="text-text-muted bg-text-primary/80 border-text-primary/25 rounded border px-1.5 py-0.5 text-[9px] font-bold"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        {s}
                      </span>
                    ))}
                  </div>
<<<<<<< HEAD
                  <div className="flex items-center justify-between border-t border-slate-700/50 pt-3">
=======
                  <div className="border-text-primary/25 flex items-center justify-between border-t pt-3">
>>>>>>> recover/cabinet-wip-from-stash
                    <div className="text-xs font-black tracking-tight">
                      {d.totalWholesaleValue.toLocaleString()} ₽
                    </div>
                    <Button
                      size="sm"
<<<<<<< HEAD
                      className="h-7 bg-indigo-600 px-3 text-[8px] font-black uppercase shadow-lg shadow-indigo-900/20 hover:bg-indigo-500"
=======
                      className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/20 h-7 px-3 text-[8px] font-black uppercase shadow-lg"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      Convert to Order
                    </Button>
                  </div>
                </div>
              ))}
            </div>
<<<<<<< HEAD
            <p className="mt-4 text-center text-[9px] font-medium italic text-slate-500">
=======
            <p className="text-text-secondary mt-4 text-center text-[9px] font-medium italic">
>>>>>>> recover/cabinet-wip-from-stash
              Create visual looks in the showroom and convert them immediately to wholesale drafts.
            </p>
          </Card>

<<<<<<< HEAD
          <Card className="border-2 border-slate-100 bg-slate-50/20 p-6 shadow-md">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase text-slate-700">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Season Insights
            </h3>
            <div className="space-y-4 text-[11px] font-medium leading-tight text-slate-600">
=======
          <Card className="border-border-subtle bg-bg-surface2/20 border-2 p-6 shadow-md">
            <h3 className="text-text-primary mb-4 flex items-center gap-2 text-sm font-black uppercase">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Season Insights
            </h3>
            <div className="text-text-secondary space-y-4 text-[11px] font-medium leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
              <p>
                Бренды, использующие AR-инвайты, фиксируют на <b>22% более высокий чек</b>{' '}
                предзаказа в шоуруме.
              </p>
<<<<<<< HEAD
              <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                <div className="mb-1 text-[9px] font-black uppercase text-slate-400">
                  Top Requested Category
                </div>
                <div className="flex items-center justify-between font-black uppercase text-slate-800">
=======
              <div className="border-border-subtle rounded-lg border bg-white p-3 shadow-sm">
                <div className="text-text-muted mb-1 text-[9px] font-black uppercase">
                  Top Requested Category
                </div>
                <div className="text-text-primary flex items-center justify-between font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  <span>Outerwear</span>
                  <span className="text-emerald-600">+14% YoY</span>
                </div>
              </div>
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="border-2 border-indigo-50 bg-indigo-50/10 p-6 shadow-md">
            <h3 className="mb-4 text-sm font-black uppercase text-indigo-700">Pro Tools</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="h-10 w-full justify-start border-indigo-100 bg-white text-[10px] font-black uppercase hover:bg-indigo-50"
              >
                <Package className="mr-2 h-4 w-4 text-indigo-500" /> Sample Manager
              </Button>
              <Button
                variant="outline"
                className="h-10 w-full justify-start border-indigo-100 bg-white text-[10px] font-black uppercase hover:bg-indigo-50"
              >
                <MessageSquare className="mr-2 h-4 w-4 text-indigo-500" /> B2B Chat Sync
              </Button>
              <Button
                variant="outline"
                className="h-10 w-full justify-start border-indigo-100 bg-white text-[10px] font-black uppercase hover:bg-indigo-50"
              >
                <Calendar className="mr-2 h-4 w-4 text-indigo-500" /> Global Calendar
=======
          <Card className="border-accent-primary/15 bg-accent-primary/10 border-2 p-6 shadow-md">
            <h3 className="text-accent-primary mb-4 text-sm font-black uppercase">Pro Tools</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="border-accent-primary/20 hover:bg-accent-primary/10 h-10 w-full justify-start bg-white text-[10px] font-black uppercase"
              >
                <Package className="text-accent-primary mr-2 h-4 w-4" /> Sample Manager
              </Button>
              <Button
                variant="outline"
                className="border-accent-primary/20 hover:bg-accent-primary/10 h-10 w-full justify-start bg-white text-[10px] font-black uppercase"
              >
                <MessageSquare className="text-accent-primary mr-2 h-4 w-4" /> B2B Chat Sync
              </Button>
              <Button
                variant="outline"
                className="border-accent-primary/20 hover:bg-accent-primary/10 h-10 w-full justify-start bg-white text-[10px] font-black uppercase"
              >
                <Calendar className="text-accent-primary mr-2 h-4 w-4" /> Global Calendar
>>>>>>> recover/cabinet-wip-from-stash
              </Button>
            </div>
          </Card>

          <Card className="border-2 border-emerald-100 bg-emerald-50/10 p-6 shadow-md">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase text-emerald-700">
              <MapPin className="h-4 w-4" /> Retail Hubs RU
            </h3>
            <div className="space-y-3">
              {[
                { city: 'Moscow', count: 12 },
                { city: 'St. Petersburg', count: 8 },
                { city: 'Ekaterinburg', count: 5 },
              ].map((hub) => (
                <div
                  key={hub.city}
                  className="flex items-center justify-between text-[10px] font-bold"
                >
<<<<<<< HEAD
                  <span className="text-slate-600">{hub.city}</span>
=======
                  <span className="text-text-secondary">{hub.city}</span>
>>>>>>> recover/cabinet-wip-from-stash
                  <Badge
                    variant="outline"
                    className="h-4 border-emerald-100 bg-white text-[8px] font-black text-emerald-700"
                  >
                    {hub.count} STORES
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
