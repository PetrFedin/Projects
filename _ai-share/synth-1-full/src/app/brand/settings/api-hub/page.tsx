'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Key, 
  Webhook, 
  Code2, 
  Terminal, 
  ShieldCheck, 
  Plus, 
  Copy, 
  Trash2, 
  ExternalLink, 
  History, 
  Settings2, 
  CheckCircle2, 
  Zap, 
  Cpu,
  Globe,
  Database,
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import { APIKey, WebhookConfig } from '@/lib/types/api-hub';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

/**
 * Headless Commerce API Hub — Brand OS
 * Управление API-ключами, вебхуками и документацией для внешних фронтендов.
 */

export default function HeadlessAPIHubPage() {
  const [activeTab, setActiveTab] = useState<'keys' | 'webhooks' | 'docs'>('keys');
  
  const [apiKeys, setAPIKeys] = useState<APIKey[]>([
    { id: 'ak-1', name: 'Mobile App Storefront', key: 'syn_live_8821...9921', createdAt: '2026-01-15', lastUsedAt: '2026-03-07', status: 'active', permissions: ['read_products', 'manage_orders'] },
    { id: 'ak-2', name: 'Next.js Custom Website', key: 'syn_live_4242...1022', createdAt: '2026-02-10', lastUsedAt: '2026-03-07', status: 'active', permissions: ['read_products', 'inventory.low' as any] },
  ]);

  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    { id: 'wh-1', url: 'https://api.mybrand.com/webhooks/synth1', events: ['order.created', 'order.updated'], secret: 'whsec_...8821', status: 'active' },
  ]);

  return (
    <div className="container mx-auto px-4 py-4 space-y-10">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
            <Cpu className="w-3.5 h-3.5" />
            Infrastructure & Headless
          </div>
          <h1 className="text-sm font-black font-headline tracking-tighter uppercase">Headless API Hub</h1>
          <p className="text-muted-foreground font-medium">Используйте Synth-1 как backend для ваших кастомных сайтов и приложений.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px]">
              <ExternalLink className="w-4 h-4" /> API Explorer
           </Button>
           <Button className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px] bg-slate-900 text-white shadow-lg shadow-slate-200">
              <Plus className="w-4 h-4" /> Generate New Key
           </Button>
        </div>
      </header>

      {/* Tabs Switcher */}
      <div className="flex gap-2 p-1 bg-slate-100/50 rounded-2xl w-fit">
         {[
           { id: 'keys', label: 'API Keys', icon: Key },
           { id: 'webhooks', label: 'Webhooks', icon: Webhook },
           { id: 'docs', label: 'Documentation', icon: Code2 },
         ].map(tab => (
           <Button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              className={cn(
                 "rounded-xl h-10 px-6 font-black uppercase text-[9px] gap-2 transition-all",
                 activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
              )}
           >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
           </Button>
         ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-3">
         <div className="lg:col-span-8 space-y-6">
            {activeTab === 'keys' && (
               <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden bg-white">
                  <CardHeader className="p-4 border-b border-slate-50">
                     <CardTitle className="text-base font-black uppercase tracking-tight">Active API Keys</CardTitle>
                     <CardDescription>Ключи для аутентификации внешних запросов к API Synth-1.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                     <Table>
                        <TableHeader className="bg-slate-50/50">
                           <TableRow>
                              <TableHead className="pl-8 text-[10px] font-black uppercase">Name / Status</TableHead>
                              <TableHead className="text-[10px] font-black uppercase">API Key</TableHead>
                              <TableHead className="text-[10px] font-black uppercase">Last Used</TableHead>
                              <TableHead className="pr-8 text-right text-[10px] font-black uppercase">Action</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {apiKeys.map(key => (
                              <TableRow key={key.id} className="hover:bg-slate-50/50 transition-colors">
                                 <TableCell className="pl-8 py-6">
                                    <div className="space-y-1">
                                       <p className="text-sm font-black text-slate-900">{key.name}</p>
                                       <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[8px] font-black uppercase h-5">Active</Badge>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex items-center gap-2">
                                       <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{key.key}</code>
                                       <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-indigo-600"><Copy className="w-3.5 h-3.5" /></Button>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <p className="text-xs font-bold text-slate-500">{key.lastUsedAt}</p>
                                 </TableCell>
                                 <TableCell className="pr-8 text-right">
                                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-rose-600"><Trash2 className="w-4 h-4" /></Button>
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </CardContent>
               </Card>
            )}

            {activeTab === 'webhooks' && (
               <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden bg-white">
                  <CardHeader className="p-4 border-b border-slate-50 flex flex-row items-center justify-between">
                     <div>
                        <CardTitle className="text-base font-black uppercase tracking-tight">Webhook Endpoints</CardTitle>
                        <CardDescription>Подписка на события экосистемы (заказы, инвентарь).</CardDescription>
                     </div>
                     <Button size="sm" className="h-9 rounded-xl font-black uppercase text-[9px] bg-indigo-600 text-white gap-2">
                        <Plus className="w-3.5 h-3.5" /> Add Endpoint
                     </Button>
                  </CardHeader>
                  <CardContent className="p-4 space-y-6">
                     {webhooks.map(wh => (
                        <div key={wh.id} className="p-4 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
                           <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                 <div className="flex items-center gap-2">
                                    <Webhook className="w-4 h-4 text-indigo-600" />
                                    <p className="text-sm font-black text-slate-900 truncate max-w-md">{wh.url}</p>
                                 </div>
                                 <div className="flex gap-2">
                                    {wh.events.map(ev => (
                                       <Badge key={ev} className="bg-white text-slate-500 border border-slate-200 text-[8px] font-bold uppercase">{ev}</Badge>
                                    ))}
                                 </div>
                              </div>
                              <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase px-2 h-5">Healthy</Badge>
                           </div>
                           <div className="pt-4 border-t border-slate-200/50 flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                 <p className="text-[9px] font-black uppercase text-slate-400">Signing Secret:</p>
                                 <code className="text-[10px] font-mono text-slate-500">{wh.secret}</code>
                              </div>
                              <div className="flex gap-2">
                                 <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase text-slate-400">Test</Button>
                                 <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase text-rose-500">Delete</Button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </CardContent>
               </Card>
            )}

            {activeTab === 'docs' && (
               <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white p-3">
                  <div className="space-y-10">
                     <div className="space-y-4">
                        <h3 className="text-sm font-black tracking-tighter uppercase">API Documentation</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                           Synth-1 предоставляет REST API для управления PIM, заказами и клиентами. Все ответы возвращаются в формате JSON.
                        </p>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                              <Terminal className="w-4 h-4" />
                           </div>
                           <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Base URL</h4>
                        </div>
                        <code className="block p-4 bg-slate-900 text-indigo-300 rounded-2xl font-mono text-sm">
                           https://api.synth1.fashion/v1/
                        </code>
                     </div>

                     <div className="space-y-6 pt-10 border-t border-slate-50">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Core Endpoints</h4>
                        <div className="space-y-4">
                           {[
                              { method: 'GET', path: '/products', desc: 'List all published products with stock levels.' },
                              { method: 'POST', path: '/orders', desc: 'Create a new order from your external frontend.' },
                              { method: 'GET', path: '/customers/me', desc: 'Fetch customer profile and style DNA.' }
                           ].map((ep, i) => (
                              <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                                 <Badge className={cn(
                                    "w-12 h-7 justify-center border-none font-black text-[10px]",
                                    ep.method === 'GET' ? "bg-emerald-500 text-white" : "bg-indigo-500 text-white"
                                 )}>{ep.method}</Badge>
                                 <div className="flex-1">
                                    <p className="text-xs font-mono font-bold text-slate-900">{ep.path}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{ep.desc}</p>
                                 </div>
                                 <ChevronRight className="w-4 h-4 text-slate-300" />
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </Card>
            )}
         </div>

         {/* Sidebar Controls */}
         <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-4">
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                     <Zap className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                     <h3 className="text-sm font-black uppercase tracking-tight">API Insights</h3>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Real-time Traffic</p>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                        <p className="text-[9px] font-black uppercase text-white/40 mb-1">Last 24h Calls</p>
                        <p className="text-base font-black">124,502</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                        <p className="text-[9px] font-black uppercase text-white/40 mb-1">Avg Latency</p>
                        <p className="text-base font-black text-emerald-400">42ms</p>
                     </div>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-white/60">Success Rate</span>
                        <span className="text-sm font-black text-indigo-400">99.98%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '99.98%' }} />
                     </div>
                  </div>
               </div>
               <Button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl font-black uppercase text-[9px] h-10 shadow-lg">
                  View Full Metrics
               </Button>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl p-4 bg-white space-y-6">
               <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Security Policies</h3>
               </div>
               
               <div className="space-y-4">
                  {[
                    { label: 'CORS Configuration', status: 'Restrictive' },
                    { label: 'Rate Limiting', status: '1000 req/min' },
                    { label: 'IP Whitelisting', status: 'Disabled' }
                  ].map((policy, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                       <span className="text-[10px] font-black uppercase text-slate-400">{policy.label}</span>
                       <span className="text-[10px] font-black text-slate-900">{policy.status}</span>
                    </div>
                  ))}
               </div>
               <Button variant="outline" className="w-full h-11 border-slate-100 text-[10px] font-black uppercase rounded-xl hover:bg-slate-50">
                  Manage Security
               </Button>
            </Card>
         </div>
      </div>
    </div>
  );
}
