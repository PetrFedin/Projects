'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, CheckCircle2, Clock, ExternalLink, Briefcase, Plus, Package, TrendingUp, Heart, MessageSquare, Sparkles, ShieldCheck, CreditCard, Wallet, Percent, ArrowUpRight, Target, AlertTriangle, Activity, BarChart3, Zap, MousePointer2, Leaf, Hammer, Send, BarChart, Gift, Truck, Globe, Box, LayoutGrid, Factory, Map, ShoppingBag, Scan } from 'lucide-react';
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
  const currencySettlement = getB2BCurrencySettlement('PO-2026-001', sessionBudget.currentOrderValue, 'CNY');
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
     ]
  };

  // Collaboration Notes
  const sessionNotes = [
     { role: 'brand', name: 'Admin', text: 'Top trend in South regions. Increased MOQ recommended.' },
     { role: 'store', name: 'Elena P.', text: 'Need more color options for SKU-101.' },
     { role: 'distributor', name: 'Logistix', text: 'Direct delivery available for 1000+ units.' }
  ];

  // Live analytics data for the top appointment
  const currentSku = 'SKU-101';
  const traffic = getShowroomSampleTraffic(currentSku);
  const negotiation = getWholesaleNegotiationProposal(currentSku, 4800, 500);
  
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 rounded-lg shadow-sm">
            <Briefcase className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 tracking-tighter uppercase">B2B Showroom PRO</h1>
        </div>
        <p className="text-muted-foreground font-medium">
           Улучшенное управление оптовыми встречами: трекинг образцов, листы пожеланий партнеров и аналитика предзаказов.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-6">
          {appointments.map((app) => (
            <Card key={app.id} className="p-6 border-2 border-slate-100 hover:border-indigo-200 transition-all shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                 <Briefcase className="w-24 h-24 text-indigo-600" />
              </div>

              {(() => {
                const reliability = getPartnerReliability(app.id);
                return (
                  <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-[10px] font-black h-4 uppercase bg-slate-50 border-slate-200">{app.id}</Badge>
                          <Badge className={app.status === 'scheduled' ? 'bg-green-500' : 'bg-orange-500'}>
                            {app.status.toUpperCase()}
                          </Badge>
                          <Badge variant="secondary" className={`text-[10px] font-black h-4 uppercase ${app.sampleStatus === 'ready' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                             <Package className="w-2.5 h-2.5 mr-1" /> Samples: {app.sampleStatus}
                          </Badge>
                       </div>
                       
                       <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{app.partnerName}</h3>
                          <div className="flex items-center gap-2">
                             <div className="text-right">
                                <div className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Reliability</div>
                                <div className={`text-sm font-black ${reliability.reliabilityTier === 'A+' ? 'text-emerald-600' : 'text-slate-700'}`}>
                                   Tier {reliability.reliabilityTier}
                                </div>
                             </div>
                             <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                <ShieldCheck className={`w-6 h-6 ${reliability.reliabilityTier === 'A+' ? 'text-emerald-500' : 'text-slate-300'}`} />
                             </div>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-6 mb-6">
                          <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                             <Calendar className="w-4 h-4 text-indigo-500" /> {app.date}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                             <MapPin className="w-4 h-4 text-indigo-500" /> {app.location}
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {app.estimatedPreOrderValue && (
                            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between">
                               <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase">
                                  <TrendingUp className="w-4 h-4" /> Est. Pre-order
                               </div>
                               <div className="text-lg font-black text-indigo-800">{app.estimatedPreOrderValue.toLocaleString()} ₽</div>
                            </div>
                          )}
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                             <div className="flex items-center gap-2 text-slate-500 font-black text-xs uppercase">
                                <CreditCard className="w-4 h-4" /> Pay Score
                             </div>
                             <div className="text-lg font-black text-slate-700">{reliability.paymentOnTimeRate}%</div>
                          </div>
                       </div>

                       <div className="space-y-3">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner Feedback & Wishlist</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                             {app.selectedSkus.map(sku => (
                               <div key={sku} className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm flex items-center justify-between group">
                                  <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-400 transition-colors" />
                                     <span className="text-xs font-bold text-slate-700">{sku}</span>
                                  </div>
                                  {app.partnerFeedback?.[sku] ? (
                                    <Badge className="bg-fuchsia-50 text-fuchsia-700 text-[8px] border-none uppercase font-black">
                                       <Heart className="w-2.5 h-2.5 mr-1 fill-fuchsia-500" /> {app.partnerFeedback[sku]}
                                    </Badge>
                                  ) : (
                                    <MessageSquare className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                                  )}
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="w-full md:w-56 space-y-3">
                       <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] h-10 shadow-lg tracking-widest">
                          Enter Session Mode
                       </Button>
                       <Button variant="outline" className="w-full font-black uppercase text-[10px] h-10 border-slate-200">
                          Send AR Invitation
                       </Button>
                       <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                          <div className="flex items-center gap-2 text-[8px] font-black text-amber-700 uppercase mb-1">
                             <AlertCircle className="w-3 h-3" /> Risk Note
                          </div>
                          <p className="text-[9px] font-bold text-amber-800 leading-tight">
                             Fulfillment rate is {reliability.orderFulfillmentRate}%. Monitor MOQ during session.
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
           <Card className="p-6 bg-white border-2 border-slate-100 shadow-xl relative overflow-hidden">
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-800">
                 <BarChart3 className="w-4 h-4 text-indigo-600" /> Order Impact Simulator
              </h3>
              
              <div className="space-y-5 relative z-10">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Proj. Sell-Through</div>
                       <div className="text-lg font-black text-emerald-600">{orderSim.projectedSellThrough}%</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Proj. Margin</div>
                       <div className="text-lg font-black text-slate-800">{orderSim.projectedMargin}%</div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                       <span>Inventory Turnover</span>
                       <span className="text-slate-800">{orderSim.inventoryTurnoverWeeks} Weeks</span>
                    </div>
                    <Progress value={(orderSim.inventoryTurnoverWeeks / 12) * 100} className="h-1 bg-slate-100 fill-indigo-500" />
                 </div>

                 <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                    <div className="text-[9px] font-bold text-indigo-700">Markdown Risk Score</div>
                    <Badge className="bg-indigo-600 text-white text-[8px] font-black h-5 uppercase">{orderSim.markdownRiskScore}% LOW</Badge>
                 </div>
              </div>
           </Card>

           <Card className="p-6 bg-slate-100 border-none shadow-md">
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-700">
                 <MessageSquare className="w-4 h-4" /> Collaboration Hub
              </h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                 {sessionNotes.map((note, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm relative">
                       <div className="flex justify-between items-center mb-1">
                          <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${note.role === 'brand' ? 'bg-indigo-100 text-indigo-700' : note.role === 'store' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                             {note.role}
                          </span>
                          <span className="text-[7px] font-black text-slate-400 uppercase">Now</span>
                       </div>
                       <div className="text-[10px] font-bold text-slate-800 mb-0.5">{note.name}</div>
                       <p className="text-[10px] text-slate-600 leading-tight">{note.text}</p>
                    </div>
                 ))}
              </div>
              <div className="relative">
                 <input type="text" placeholder="Type collaborative note..." className="w-full h-9 bg-white rounded-lg border border-slate-200 pl-3 pr-10 text-[10px] font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                 <button className="absolute right-1 top-1 w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center text-white shadow-md hover:bg-indigo-700 transition-colors">
                    <Send className="w-3.5 h-3.5" />
                 </button>
              </div>
           </Card>

           <Card className="p-6 bg-slate-900 border-none shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-indigo-400">
                 <Users className="w-4 h-4" /> Live Buyer Presence
              </h3>
              
              <div className="space-y-3 relative z-10">
                 {presence.activeBuyers.map((buyer, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="relative">
                             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-black">{buyer.name[0]}</div>
                             <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
                          </div>
                          <div>
                             <div className="text-[11px] font-black text-white">{buyer.name}</div>
                             <div className="text-[8px] font-bold text-indigo-300 uppercase tracking-tighter">Viewing: {buyer.currentSku}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-[8px] font-black text-white/40 uppercase mb-0.5 flex items-center gap-1 justify-end">
                             <Clock className="w-2.5 h-2.5" /> {buyer.lastSeen}
                          </div>
                          <button className="text-[7px] font-black text-indigo-400 uppercase tracking-widest hover:text-white underline">Join View</button>
                       </div>
                    </div>
                 ))}
              </div>
              
              <div className="mt-4 p-2 bg-indigo-500/20 rounded-lg text-[8px] font-black text-indigo-200 text-center uppercase tracking-widest">
                 Showroom Multi-User Sync Enabled
              </div>
           </Card>

           <Card className="p-6 bg-slate-900 border-2 border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                 <Map className="w-24 h-24 text-white" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
                 <Map className="w-4 h-4 text-indigo-400" /> Regional Demand Heatmap
              </h3>
              
              <div className="space-y-4 relative z-10 mb-6">
                 {regionalHeatmap.map((h, i) => (
                    <div key={h.region} className="group/item">
                       <div className="flex justify-between items-center mb-1.5">
                          <div className="text-[11px] font-black text-white uppercase tracking-tight">{h.region}</div>
                          <div className="text-[10px] font-black text-indigo-300">{h.interestScore}%</div>
                       </div>
                       <Progress value={h.interestScore} className="h-1 bg-white/10 fill-indigo-500 rounded-full" />
                       <div className="mt-1 flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase">
                          <span>Proj: {h.projectedUnits} units</span>
                          <span className="text-emerald-500">+{h.growthRate}% Growth</span>
                       </div>
                    </div>
                 ))}
              </div>

              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase h-10 shadow-lg shadow-indigo-500/20">
                 Export Regional Analysis
              </Button>
           </Card>

           <Card className="p-6 bg-indigo-600 border-2 border-indigo-500 shadow-xl relative overflow-hidden group">
              <div className="absolute -bottom-4 -right-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                 <Sparkles className="w-32 h-32 text-white" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
                 <Sparkles className="w-4 h-4 text-white" /> Smart Reorder Hub (AI)
              </h3>
              
              <div className="space-y-3 relative z-10 mb-4">
                 {reorderSuggestions.slice(0, 2).map(s => (
                    <div key={s.sku} className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-all">
                       <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                             <ShoppingBag className="w-3.5 h-3.5 text-white" />
                             <div>
                                <div className="text-[10px] font-black text-white uppercase">{s.sku}</div>
                                <div className="text-[7px] font-bold text-indigo-200 uppercase">{s.reason}</div>
                             </div>
                          </div>
                          <div className="text-[12px] font-black text-white">+{s.suggestedQty}</div>
                       </div>
                       <Progress value={s.confidenceScore} className="h-1 bg-white/10 fill-white rounded-full" />
                    </div>
                 ))}
              </div>

              <Button className="w-full bg-white text-indigo-600 text-[10px] font-black uppercase h-10 hover:bg-indigo-50 shadow-lg">
                 Apply All Suggestions
              </Button>
           </Card>

           <Card className="p-6 bg-white border-2 border-slate-100 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                 <Scan className="w-24 h-24 text-slate-900" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-800">
                 <Scan className="w-4 h-4 text-slate-700" /> Live Sample Inventory
              </h3>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4 relative z-10">
                 <div className="flex items-center gap-4 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border-2 border-white ${
                       sampleInventory.status === 'available' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                       <Box className="w-5 h-5" />
                    </div>
                    <div>
                       <div className="text-[11px] font-black text-slate-800">{sampleInventory.id}</div>
                       <Badge className={`text-[8px] font-black h-4 uppercase border-none ${
                          sampleInventory.status === 'available' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                       }`}>{sampleInventory.status}</Badge>
                    </div>
                 </div>
                 <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> {sampleInventory.currentZone}
                 </div>
              </div>

              <Button variant="outline" className="w-full border-slate-900 text-slate-900 text-[10px] font-black uppercase h-10 hover:bg-slate-50">
                 Refresh Sample Status
              </Button>
           </Card>

           <Card className="p-6 bg-slate-900 border-2 border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                 <Truck className="w-24 h-24 text-white" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
                 <Truck className="w-4 h-4 text-indigo-400" /> Order Lifecycle Tracker
              </h3>
              
              <div className="space-y-4 relative z-10 mb-6">
                 {milestones.map((m, i) => (
                    <div key={m.id} className="flex items-center gap-4 group/item">
                       <div className={`w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center shrink-0 ${
                          m.status === 'completed' ? 'bg-emerald-500 text-white' :
                          m.status === 'in_progress' ? 'bg-indigo-600 text-white animate-pulse' :
                          'bg-slate-800 text-slate-500'
                       }`}>
                          {m.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : 
                           m.id === 'PRODUCTION' ? <Factory className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                       </div>
                       <div className="flex-1">
                          <div className="text-[11px] font-black text-white uppercase tracking-tight leading-none mb-1 group-hover/item:text-indigo-300 transition-colors">{m.name}</div>
                          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Est: {m.estimatedDate}</div>
                       </div>
                    </div>
                 ))}
              </div>

              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase h-10 shadow-lg shadow-indigo-500/20">
                 Detailed Delivery SLA
              </Button>
           </Card>

           <Card className="p-6 bg-white border-2 border-emerald-600 shadow-xl relative overflow-hidden group">
              <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                 <Globe className="w-32 h-32 text-emerald-600" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-800">
                 <Globe className="w-4 h-4 text-emerald-600" /> B2B Regional Settlement
              </h3>
              
              <div className="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100 mb-4 relative z-10">
                 <div className="flex justify-between items-center mb-1">
                    <div className="text-[10px] font-black text-emerald-800 uppercase">Rate Locked ({currencySettlement.currency})</div>
                    <Badge className="bg-emerald-600 text-white border-none text-[8px] h-4 font-black uppercase">Active</Badge>
                 </div>
                 <div className="text-2xl font-black text-slate-900">{currencySettlement.finalAmount.toLocaleString()} {currencySettlement.currency}</div>
                 <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Base: {currencySettlement.baseAmount.toLocaleString()} RUB</div>
              </div>

              <div className="space-y-2 relative z-10 mb-4">
                 <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[9px] font-black text-slate-500 uppercase">Currency Pair</div>
                    <div className="text-[10px] font-black text-slate-800">RUB / {currencySettlement.currency}</div>
                 </div>
                 <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[9px] font-black text-slate-500 uppercase">Rate (v. 1.0.8)</div>
                    <div className="text-[10px] font-black text-slate-800">{currencySettlement.exchangeRate}</div>
                 </div>
              </div>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase h-10 shadow-lg shadow-emerald-500/10">
                 Open Regional Payment Gateway
              </Button>
           </Card>

           <Card className="p-6 bg-white border-2 border-slate-900 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                 <Users className="w-24 h-24 text-slate-900" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-800">
                 <Users className="w-4 h-4 text-slate-700" /> Showroom Resource Sync
              </h3>
              
              <div className="space-y-4 relative z-10 mb-6">
                 {showroomResources.map((r) => (
                    <div key={r.resourceId} className="group/item">
                       <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${r.availabilityPercent > 50 ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                {r.type === 'stylist' ? <Users className={`w-4 h-4 ${r.availabilityPercent > 50 ? 'text-emerald-600' : 'text-amber-600'}`} /> : 
                                 r.type === 'fitting_room' ? <LayoutGrid className={`w-4 h-4 ${r.availabilityPercent > 50 ? 'text-emerald-600' : 'text-amber-600'}`} /> : 
                                 <Box className={`w-4 h-4 ${r.availabilityPercent > 50 ? 'text-emerald-600' : 'text-amber-600'}`} />}
                             </div>
                             <div>
                                <div className="text-[11px] font-black text-slate-800 leading-tight group-hover/item:text-indigo-600 transition-colors">{r.name}</div>
                                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Next: {r.nextAvailableSlot}</div>
                             </div>
                          </div>
                          <div className="text-[10px] font-black text-slate-800">{r.availabilityPercent}%</div>
                       </div>
                       <Progress value={r.availabilityPercent} className={`h-1 rounded-full ${r.availabilityPercent > 50 ? 'fill-emerald-500' : 'fill-amber-500'}`} />
                    </div>
                 ))}
              </div>

              <Button className="w-full bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase h-10 shadow-lg">
                 Manage Capacity & Slots
              </Button>
           </Card>

           <Card className="p-6 bg-slate-900 border-2 border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none group-hover:scale-110 transition-transform">
                 <Truck className="w-24 h-24 text-white" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
                 <Truck className="w-4 h-4 text-indigo-400" /> Ship-to-Store Splitter
              </h3>
              
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 mb-4">
                 <div className="flex justify-between items-center mb-1">
                    <div className="text-[10px] font-black text-indigo-300 uppercase">Current SKU: {orderSplit.sku}</div>
                    <Badge className="bg-indigo-500 text-white border-none text-[8px] h-4 font-black">MULTI-DIST</Badge>
                 </div>
                 <div className="text-2xl font-black text-white">{orderSplit.totalQty} Units</div>
              </div>

              <div className="space-y-2 relative z-10 mb-6">
                 {orderSplit.splits.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all">
                       <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-indigo-400" />
                          <div>
                             <div className="text-[11px] font-black text-white">{s.storeId}</div>
                             <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{s.status}</div>
                          </div>
                       </div>
                       <div className="text-[14px] font-black text-indigo-300">{s.qty}</div>
                    </div>
                 ))}
              </div>

              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase h-10 shadow-lg shadow-indigo-500/20">
                 Finalize Multi-Store Splitting
              </Button>
           </Card>

           <Card className="p-6 bg-white border-2 border-amber-100 shadow-xl relative overflow-hidden group">
              <div className="absolute -bottom-4 -left-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                 <Gift className="w-32 h-32 text-amber-600" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-800">
                 <Gift className="w-4 h-4 text-amber-600" /> Partner Perk Progress
              </h3>
              
              <div className="space-y-5 relative z-10 mb-4">
                 {perks.map(perk => (
                    <div key={perk.perkId} className="group/item">
                       <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${perk.isUnlocked ? 'bg-amber-100' : 'bg-slate-100'}`}>
                                {perk.isUnlocked ? <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" /> : <Lock className="w-4 h-4 text-slate-400" />}
                             </div>
                             <div>
                                <div className="text-[11px] font-black text-slate-800 leading-tight group-hover/item:text-amber-600 transition-colors">{perk.title}</div>
                                <div className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">{perk.requirementDescription}</div>
                             </div>
                          </div>
                          {perk.isUnlocked && <Badge className="bg-emerald-500 text-white border-none text-[8px] h-4 font-black uppercase tracking-tighter">UNLOCKED</Badge>}
                       </div>
                       
                       {!perk.isUnlocked && (
                         <div className="flex items-center gap-3">
                            <div className="flex-1">
                               <Progress value={perk.progressPercent} className="h-1.5 bg-slate-100 fill-amber-500 rounded-full" />
                            </div>
                            <span className="text-[10px] font-black text-amber-600">{Math.round(perk.progressPercent)}%</span>
                         </div>
                       )}
                    </div>
                 ))}
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center relative z-10">
                 <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                    <TrendingUp className="w-3 h-3" /> Next Reward in 1.2M ₽
                 </p>
                 <div className="text-[8px] font-bold text-amber-600/70 uppercase">Unlock Priority Logistics Tier</div>
              </div>
           </Card>

           <Card className="p-6 bg-white border-2 border-indigo-100 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                 <Box className="w-24 h-24 text-indigo-600" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-800">
                 <Box className="w-4 h-4 text-indigo-600" /> Virtual Sample Hub
              </h3>
              
              <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 mb-4 relative z-10">
                 <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-indigo-50">
                       <Smartphone className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                       <div className="text-[11px] font-black text-slate-800">3D VTO Enabled</div>
                       <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Fit Accuracy: {vto.fitAccuracy}%</div>
                    </div>
                 </div>
                 <div className="flex flex-wrap gap-1.5">
                    {vto.avatarTypes.map(type => (
                      <Badge key={type} variant="secondary" className="text-[7px] font-black h-3.5 uppercase bg-white border-slate-100">{type}</Badge>
                    ))}
                 </div>
              </div>
              
              <Button className="w-full bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase h-10 shadow-lg">
                 Launch Digital Fitting Room
              </Button>
           </Card>

           <Card className="p-6 bg-white border-2 border-slate-100 shadow-xl relative overflow-hidden group">
              <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                 <Globe className="w-24 h-24 text-slate-600" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-800">
                 <Globe className="w-4 h-4 text-slate-500" /> EAEU Export Estimator
              </h3>
              
              <div className="space-y-3 relative z-10 mb-4">
                 <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                       <div className="text-[8px] font-black text-slate-400 uppercase mb-0.5">VAT / NDS ({eaeuTaxes.country})</div>
                       <div className="text-[12px] font-black text-slate-800">{Math.round(eaeuTaxes.vatRate * 100)}% Applied</div>
                    </div>
                    <div className="text-right">
                       <div className="text-[12px] font-black text-indigo-600">{eaeuTaxes.estimatedTotalTax.toLocaleString()} {eaeuTaxes.currency}</div>
                    </div>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-emerald-50/30 rounded-xl border border-emerald-100">
                    <div className="text-[9px] font-black text-emerald-700 uppercase flex items-center gap-1.5">
                       <ShieldCheck className="w-3 h-3" /> Customs Duty (Zero)
                    </div>
                    <Badge className="bg-emerald-500 text-white border-none text-[8px] h-4 font-black">DUTY-FREE</Badge>
                 </div>
              </div>
              
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-2 relative z-10">
                 <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                 <p className="text-[8px] font-bold text-amber-700 uppercase leading-tight">Prices exclude local brokerage fees.</p>
              </div>
           </Card>

           <Card className="p-6 bg-white border-2 border-slate-900 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                 <LayoutGrid className="w-20 h-20 text-slate-900" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-800">
                 <LayoutGrid className="w-4 h-4 text-slate-700" /> Capsule Integrity
              </h3>
              
              <div className="p-3 bg-slate-50 rounded-2xl mb-4">
                 <div className="flex justify-between items-center mb-2">
                    <div className="text-[10px] font-black text-slate-800 uppercase">Integrity Score</div>
                    <div className="text-[12px] font-black text-indigo-600">{capsule.integrityScore}%</div>
                 </div>
                 <Progress value={capsule.integrityScore} className="h-1.5 bg-slate-200 fill-indigo-600 rounded-full" />
              </div>

              <div className="space-y-2 relative z-10 mb-6">
                 {capsule.missingSkus.map(sku => (
                    <div key={sku} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-amber-100 shadow-sm">
                       <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          <div className="text-[10px] font-black text-slate-600 uppercase">Missing: {sku}</div>
                       </div>
                       <Button variant="ghost" className="h-6 px-2 text-[8px] font-black text-indigo-600 hover:bg-indigo-50 uppercase">
                          Add Now
                       </Button>
                    </div>
                 ))}
                 {capsule.isCapsuleComplete && (
                   <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <div className="text-[10px] font-black text-emerald-700 uppercase">Capsule Mix Complete</div>
                   </div>
                 )}
              </div>

              <Button variant="outline" className="w-full border-slate-900 text-slate-900 text-[10px] font-black uppercase h-10 hover:bg-slate-50">
                 View Suggested Capsule Mix
              </Button>
           </Card>

           <Card className="p-6 bg-white border-2 border-indigo-600 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <Hammer className="w-16 h-16 text-indigo-600" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-800">
                 <Hammer className="w-4 h-4 text-indigo-600" /> Production Priority Sync
              </h3>
              
              <div className="space-y-4 relative z-10">
                 {trendingLooks.map(look => (
                    <div key={look.lookId} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                       <div className="flex-1">
                          <div className="text-[10px] font-black text-slate-800 uppercase leading-none mb-1">{look.lookId}</div>
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" /> {look.totalHearts} Interests
                             </span>
                             <Badge variant="outline" className={`text-[7px] font-black h-3.5 uppercase ${look.trendingStatus === 'rising' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                {look.trendingStatus}
                             </Badge>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Factory SLA</div>
                          <Badge className={
                             look.productionPriority === 'urgent' ? 'bg-rose-600 text-white' :
                             look.productionPriority === 'high' ? 'bg-indigo-600 text-white' :
                             'bg-slate-600 text-white'
                          } variant="outline" className="text-[8px] font-black h-5 uppercase border-none">
                             {look.productionPriority}
                          </Badge>
                       </div>
                    </div>
                 ))}
              </div>
              
              <p className="mt-4 text-[9px] text-slate-500 italic text-center font-medium">
                 Feedback from showroom sessions automatically triggers production slot reservations.
              </p>
           </Card>

           <Card className="p-6 bg-slate-50 border-2 border-indigo-100 shadow-xl overflow-hidden relative">
              <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none">
                 <Activity className="w-24 h-24 text-indigo-600" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-indigo-700">
                 <Zap className="w-4 h-4" /> Live Session Analytics
              </h3>
              
              <div className="space-y-6 relative z-10">
                 <div className="p-4 bg-white rounded-2xl border border-indigo-50 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Item Heatmap</div>
                          <div className="text-sm font-black text-slate-800">{currentSku}</div>
                       </div>
                       <Badge className="bg-indigo-600 text-white border-none text-[8px] h-4 font-black uppercase">Live</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                       <div>
                          <div className="text-[18px] font-black text-slate-800 leading-none">{traffic.totalTouches}</div>
                          <div className="text-[7px] font-black text-slate-400 uppercase mt-1 tracking-widest">Physical Touches</div>
                       </div>
                       <div>
                          <div className="text-[18px] font-black text-indigo-600 leading-none">{traffic.fittingsCount}</div>
                          <div className="text-[7px] font-black text-slate-400 uppercase mt-1 tracking-widest">Showroom Fittings</div>
                       </div>
                    </div>
                    
                    <div>
                       <div className="flex justify-between items-center text-[8px] font-black text-slate-400 uppercase mb-1.5">
                          <span>Interest Density</span>
                          <span>{Math.round(traffic.scanDensityScore)}%</span>
                       </div>
                       <Progress value={traffic.scanDensityScore} className="h-1 bg-slate-50 fill-indigo-500" />
                    </div>
                 </div>

                 <div className="p-4 bg-indigo-900 text-white rounded-2xl shadow-lg shadow-indigo-200 border border-indigo-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                       <MousePointer2 className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <BarChart3 className="w-3.5 h-3.5" /> Price Negotiator AI
                    </div>
                    
                    <div className="space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-indigo-200">Base Wholesale:</span>
                          <span className="text-[12px] font-black text-indigo-100 line-through decoration-indigo-400">{negotiation.baseWholesalePrice.toLocaleString()} ₽</span>
                       </div>
                       <div className="flex justify-between items-center border-t border-white/10 pt-2">
                          <span className="text-[10px] font-black uppercase text-indigo-200 tracking-widest">AI Counter-Offer:</span>
                          <span className="text-lg font-black text-emerald-400">{negotiation.negotiatedPrice.toLocaleString()} ₽</span>
                       </div>
                       <div className="flex justify-between items-center bg-white/10 p-2 rounded-lg border border-white/10">
                          <div className="text-[9px] font-bold text-white/80">Est. Margin: {negotiation.marginAtNegotiatedPrice}%</div>
                          <Badge className="bg-emerald-500 text-white border-none text-[8px] h-4 font-black uppercase">Optimal</Badge>
                       </div>
                       <Button size="sm" className="w-full bg-white text-indigo-900 hover:bg-indigo-50 font-black uppercase text-[9px] h-8 shadow-md">
                          Apply Suggested Price
                       </Button>
                    </div>
                 </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-[8px] font-black text-indigo-400 uppercase tracking-widest text-center justify-center italic">
                 <Activity className="w-3 h-3 animate-pulse" /> Real-time Showroom Hub Telemetry
              </div>
           </Card>

           <Card className="p-6 bg-indigo-900 text-white border-none shadow-2xl relative overflow-hidden">
              <div className="absolute -top-4 -right-4 opacity-10">
                 <Wallet className="w-24 h-24" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Wallet className="w-4 h-4 text-indigo-400" /> Session Budget Hub
              </h3>
              <div className="space-y-5 relative z-10">
                 <div>
                    <div className="flex justify-between items-end mb-1">
                       <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Budget Utilization</span>
                       <span className="text-[12px] font-black">{Math.round((sessionBudget.currentOrderValue / sessionBudget.allocatedBudget) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-indigo-950 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-400" style={{ width: `${(sessionBudget.currentOrderValue / sessionBudget.allocatedBudget) * 100}%` }} />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-indigo-950/50 rounded-xl border border-indigo-800/50">
                       <div className="text-[8px] font-black text-indigo-400 uppercase mb-1 tracking-tighter">Remaining</div>
                       <div className="text-sm font-black tracking-tight">{sessionBudget.remainingBudget.toLocaleString()} ₽</div>
                    </div>
                    <div className="p-3 bg-indigo-950/50 rounded-xl border border-indigo-800/50">
                       <div className="text-[8px] font-black text-indigo-400 uppercase mb-1 tracking-tighter">Order Margin</div>
                       <div className="text-sm font-black tracking-tight flex items-center gap-1.5">
                          {sessionBudget.currentEstimatedMargin}% <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                       </div>
                    </div>
                 </div>

                 <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Percent className="w-4 h-4 text-indigo-300" />
                       <div className="text-[10px] font-bold text-indigo-100">Target Margin: {sessionBudget.targetMargin}%</div>
                    </div>
                    <button className="text-[8px] font-black uppercase text-indigo-300 hover:text-white underline tracking-widest">Adjust Prices</button>
                 </div>
                 
                 <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-between group cursor-pointer hover:bg-emerald-500/20 transition-colors">
                    <div className="flex items-center gap-2">
                       <Leaf className="w-4 h-4 text-emerald-400" />
                       <div className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">Order ESG Score</div>
                    </div>
                    <div className="text-sm font-black text-emerald-400">{esgScore}%</div>
                 </div>
              </div>
           </Card>

           <Card className="p-6 border-2 border-slate-900 bg-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <Target className="w-16 h-16 text-slate-900" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-800">
                 <Target className="w-4 h-4 text-slate-800" /> Assortment Compliance
              </h3>
              
              <div className="space-y-4 mb-6">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Must-Have Hits</span>
                    <span className="text-slate-900">{compliance.mustHaveItems.filter(i => i.ordered).length}/{compliance.mustHaveItems.length}</span>
                 </div>
                 <div className="flex flex-wrap gap-1.5">
                    {compliance.mustHaveItems.map(item => (
                       <Badge key={item.sku} variant="outline" className={`text-[8px] font-black h-4 uppercase ${item.ordered ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'}`}>
                          {item.sku}
                       </Badge>
                    ))}
                 </div>
              </div>

              <div className="space-y-3 mb-6">
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Category Balance</div>
                 {compliance.categoryBalance.map(cat => (
                    <div key={cat.category}>
                       <div className="flex justify-between items-center text-[9px] font-bold text-slate-600 mb-1">
                          <span>{cat.category}</span>
                          <span className={Math.abs(cat.targetPercent - cat.currentPercent) > 10 ? 'text-rose-600' : 'text-slate-400'}>
                             {cat.currentPercent}% / {cat.targetPercent}%
                          </span>
                       </div>
                       <Progress value={cat.currentPercent} className="h-1 bg-slate-100 fill-slate-900" />
                    </div>
                 ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                 <div className="text-[10px] font-black text-slate-800">Overall Score</div>
                 <div className="text-xl font-black text-slate-900">{compliance.overallComplianceScore}%</div>
              </div>
           </Card>

           <Card className="p-6 bg-slate-900 text-white border-none shadow-2xl overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                 <Sparkles className="w-24 h-24" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Sparkles className="w-4 h-4 text-indigo-400" /> Draft Look-to-Order
              </h3>
              <div className="space-y-4 relative z-10">
                 {drafts.map(d => (
                   <div key={d.lookId} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                         <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">{d.lookId}</span>
                         <Badge className="bg-indigo-500 text-[8px] font-black h-4 px-1.5">DRAFT</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                         {d.skus.map(s => <span key={s} className="text-[9px] font-bold text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700/30">{s}</span>)}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
                         <div className="text-xs font-black tracking-tight">{d.totalWholesaleValue.toLocaleString()} ₽</div>
                         <Button size="sm" className="h-7 px-3 text-[8px] font-black uppercase bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/20">
                            Convert to Order
                         </Button>
                      </div>
                   </div>
                 ))}
              </div>
              <p className="mt-4 text-[9px] text-slate-500 italic text-center font-medium">
                 Create visual looks in the showroom and convert them immediately to wholesale drafts.
              </p>
           </Card>

           <Card className="p-6 border-2 border-slate-100 bg-slate-50/20 shadow-md">
              <h3 className="font-black text-sm uppercase text-slate-700 mb-4 flex items-center gap-2">
                 <TrendingUp className="w-4 h-4 text-emerald-500" /> Season Insights
              </h3>
              <div className="space-y-4 text-[11px] text-slate-600 font-medium leading-tight">
                 <p>Бренды, использующие AR-инвайты, фиксируют на <b>22% более высокий чек</b> предзаказа в шоуруме.</p>
                 <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Top Requested Category</div>
                    <div className="flex justify-between items-center font-black text-slate-800 uppercase">
                       <span>Outerwear</span>
                       <span className="text-emerald-600">+14% YoY</span>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="p-6 border-2 border-indigo-50 bg-indigo-50/10 shadow-md">
              <h3 className="font-black text-sm uppercase text-indigo-700 mb-4">Pro Tools</h3>
              <div className="space-y-3">
                 <Button variant="outline" className="w-full h-10 justify-start text-[10px] font-black uppercase border-indigo-100 bg-white hover:bg-indigo-50">
                    <Package className="w-4 h-4 mr-2 text-indigo-500" /> Sample Manager
                 </Button>
                 <Button variant="outline" className="w-full h-10 justify-start text-[10px] font-black uppercase border-indigo-100 bg-white hover:bg-indigo-50">
                    <MessageSquare className="w-4 h-4 mr-2 text-indigo-500" /> B2B Chat Sync
                 </Button>
                 <Button variant="outline" className="w-full h-10 justify-start text-[10px] font-black uppercase border-indigo-100 bg-white hover:bg-indigo-50">
                    <Calendar className="w-4 h-4 mr-2 text-indigo-500" /> Global Calendar
                 </Button>
              </div>
           </Card>

           <Card className="p-6 border-2 border-emerald-100 bg-emerald-50/10 shadow-md">
              <h3 className="font-black text-sm uppercase text-emerald-700 mb-4 flex items-center gap-2">
                 <MapPin className="w-4 h-4" /> Retail Hubs RU
              </h3>
              <div className="space-y-3">
                 {[
                    { city: 'Moscow', count: 12 },
                    { city: 'St. Petersburg', count: 8 },
                    { city: 'Ekaterinburg', count: 5 }
                 ].map(hub => (
                    <div key={hub.city} className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-slate-600">{hub.city}</span>
                       <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-100 h-4 text-[8px] font-black">{hub.count} STORES</Badge>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
