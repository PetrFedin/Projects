'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Info,
} from 'lucide-react';
import { APIKey, WebhookConfig } from '@/lib/types/api-hub';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { RegistryPageShell } from '@/components/design-system';

/**
 * Headless Commerce API Hub — Brand OS
 * Управление API-ключами, вебхуками и документацией для внешних фронтендов.
 */

export default function HeadlessAPIHubPage() {
  const [activeTab, setActiveTab] = useState<'keys' | 'webhooks' | 'docs'>('keys');

  const [apiKeys, setAPIKeys] = useState<APIKey[]>([
    {
      id: 'ak-1',
      name: 'Mobile App Storefront',
      key: 'syn_live_8821...9921',
      createdAt: '2026-01-15',
      lastUsedAt: '2026-03-07',
      status: 'active',
      permissions: ['read_products', 'manage_orders'],
    },
    {
      id: 'ak-2',
      name: 'Next.js Custom Website',
      key: 'syn_live_4242...1022',
      createdAt: '2026-02-10',
      lastUsedAt: '2026-03-07',
      status: 'active',
      permissions: ['read_products', 'inventory.low' as any],
    },
  ]);

  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: 'wh-1',
      url: 'https://api.mybrand.com/webhooks/synth1',
      events: ['order.created', 'order.updated'],
      secret: 'whsec_...8821',
      status: 'active',
    },
  ]);

  return (
<<<<<<< HEAD
    <div className="container mx-auto space-y-10 px-4 py-4">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
=======
    <RegistryPageShell className="space-y-10 pb-16">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="text-accent-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            <Cpu className="h-3.5 w-3.5" />
            Infrastructure & Headless
          </div>
          <h1 className="font-headline text-sm font-black uppercase tracking-tighter">
            Headless API Hub
          </h1>
          <p className="font-medium text-muted-foreground">
            Используйте Synth-1 как backend для ваших кастомных сайтов и приложений.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase"
          >
            <ExternalLink className="h-4 w-4" /> API Explorer
          </Button>
<<<<<<< HEAD
          <Button className="h-11 gap-2 rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase text-white shadow-lg shadow-slate-200">
=======
          <Button className="bg-text-primary h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase text-white shadow-lg shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
            <Plus className="h-4 w-4" /> Generate New Key
          </Button>
        </div>
      </header>

      {/* Tabs Switcher */}
<<<<<<< HEAD
      <div className="flex w-fit gap-2 rounded-2xl bg-slate-100/50 p-1">
=======
      <div className="bg-bg-surface2/50 flex w-fit gap-2 rounded-2xl p-1">
>>>>>>> recover/cabinet-wip-from-stash
        {[
          { id: 'keys', label: 'API Keys', icon: Key },
          { id: 'webhooks', label: 'Webhooks', icon: Webhook },
          { id: 'docs', label: 'Documentation', icon: Code2 },
        ].map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            className={cn(
              'h-10 gap-2 rounded-xl px-6 text-[9px] font-black uppercase transition-all',
<<<<<<< HEAD
              activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
=======
              activeTab === tab.id ? 'text-text-primary bg-white shadow-sm' : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {activeTab === 'keys' && (
<<<<<<< HEAD
            <Card className="overflow-hidden rounded-xl border-none bg-white shadow-xl shadow-slate-200/50">
              <CardHeader className="border-b border-slate-50 p-4">
=======
            <Card className="overflow-hidden rounded-xl border-none bg-white shadow-md shadow-xl">
              <CardHeader className="border-border-subtle border-b p-4">
>>>>>>> recover/cabinet-wip-from-stash
                <CardTitle className="text-base font-black uppercase tracking-tight">
                  Active API Keys
                </CardTitle>
                <CardDescription>
                  Ключи для аутентификации внешних запросов к API Synth-1.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
<<<<<<< HEAD
                  <TableHeader className="bg-slate-50/50">
=======
                  <TableHeader className="bg-bg-surface2/80">
>>>>>>> recover/cabinet-wip-from-stash
                    <TableRow>
                      <TableHead className="pl-8 text-[10px] font-black uppercase">
                        Name / Status
                      </TableHead>
                      <TableHead className="text-[10px] font-black uppercase">API Key</TableHead>
                      <TableHead className="text-[10px] font-black uppercase">Last Used</TableHead>
                      <TableHead className="pr-8 text-right text-[10px] font-black uppercase">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
<<<<<<< HEAD
                      <TableRow key={key.id} className="transition-colors hover:bg-slate-50/50">
                        <TableCell className="py-6 pl-8">
                          <div className="space-y-1">
                            <p className="text-sm font-black text-slate-900">{key.name}</p>
=======
                      <TableRow key={key.id} className="hover:bg-bg-surface2/80 transition-colors">
                        <TableCell className="py-6 pl-8">
                          <div className="space-y-1">
                            <p className="text-text-primary text-sm font-black">{key.name}</p>
>>>>>>> recover/cabinet-wip-from-stash
                            <Badge
                              variant="outline"
                              className="h-5 border-emerald-100 bg-emerald-50 text-[8px] font-black uppercase text-emerald-600"
                            >
                              Active
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
<<<<<<< HEAD
                            <code className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
=======
                            <code className="bg-bg-surface2 text-text-secondary rounded px-2 py-1 font-mono text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                              {key.key}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
<<<<<<< HEAD
                              className="h-8 w-8 text-slate-300 hover:text-indigo-600"
=======
                              className="text-text-muted hover:text-accent-primary h-8 w-8"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
<<<<<<< HEAD
                          <p className="text-xs font-bold text-slate-500">{key.lastUsedAt}</p>
=======
                          <p className="text-text-secondary text-xs font-bold">{key.lastUsedAt}</p>
>>>>>>> recover/cabinet-wip-from-stash
                        </TableCell>
                        <TableCell className="pr-8 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
<<<<<<< HEAD
                            className="text-slate-300 hover:text-rose-600"
=======
                            className="text-text-muted hover:text-rose-600"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === 'webhooks' && (
<<<<<<< HEAD
            <Card className="overflow-hidden rounded-xl border-none bg-white shadow-xl shadow-slate-200/50">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 p-4">
=======
            <Card className="overflow-hidden rounded-xl border-none bg-white shadow-md shadow-xl">
              <CardHeader className="border-border-subtle flex flex-row items-center justify-between border-b p-4">
>>>>>>> recover/cabinet-wip-from-stash
                <div>
                  <CardTitle className="text-base font-black uppercase tracking-tight">
                    Webhook Endpoints
                  </CardTitle>
                  <CardDescription>
                    Подписка на события экосистемы (заказы, инвентарь).
                  </CardDescription>
                </div>
                <Button
                  size="sm"
<<<<<<< HEAD
                  className="h-9 gap-2 rounded-xl bg-indigo-600 text-[9px] font-black uppercase text-white"
=======
                  className="bg-accent-primary h-9 gap-2 rounded-xl text-[9px] font-black uppercase text-white"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <Plus className="h-3.5 w-3.5" /> Add Endpoint
                </Button>
              </CardHeader>
              <CardContent className="space-y-6 p-4">
                {webhooks.map((wh) => (
                  <div
                    key={wh.id}
<<<<<<< HEAD
                    className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50 p-4"
=======
                    className="bg-bg-surface2 border-border-subtle space-y-4 rounded-3xl border p-4"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
<<<<<<< HEAD
                          <Webhook className="h-4 w-4 text-indigo-600" />
                          <p className="max-w-md truncate text-sm font-black text-slate-900">
=======
                          <Webhook className="text-accent-primary h-4 w-4" />
                          <p className="text-text-primary max-w-md truncate text-sm font-black">
>>>>>>> recover/cabinet-wip-from-stash
                            {wh.url}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {wh.events.map((ev) => (
                            <Badge
                              key={ev}
<<<<<<< HEAD
                              className="border border-slate-200 bg-white text-[8px] font-bold uppercase text-slate-500"
=======
                              className="text-text-secondary border-border-default border bg-white text-[8px] font-bold uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              {ev}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge className="h-5 border-none bg-emerald-50 px-2 text-[8px] font-black uppercase text-emerald-600">
                        Healthy
                      </Badge>
                    </div>
<<<<<<< HEAD
                    <div className="flex items-center justify-between border-t border-slate-200/50 pt-4">
                      <div className="flex items-center gap-2">
                        <p className="text-[9px] font-black uppercase text-slate-400">
                          Signing Secret:
                        </p>
                        <code className="font-mono text-[10px] text-slate-500">{wh.secret}</code>
=======
                    <div className="border-border-default/50 flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-2">
                        <p className="text-text-muted text-[9px] font-black uppercase">
                          Signing Secret:
                        </p>
                        <code className="text-text-secondary font-mono text-[10px]">
                          {wh.secret}
                        </code>
>>>>>>> recover/cabinet-wip-from-stash
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
<<<<<<< HEAD
                          className="h-8 text-[9px] font-black uppercase text-slate-400"
=======
                          className="text-text-muted h-8 text-[9px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          Test
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-[9px] font-black uppercase text-rose-500"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'docs' && (
<<<<<<< HEAD
            <Card className="rounded-xl border-none bg-white p-3 shadow-xl shadow-slate-200/50">
=======
            <Card className="rounded-xl border-none bg-white p-3 shadow-md shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
              <div className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-tighter">
                    API Documentation
                  </h3>
<<<<<<< HEAD
                  <p className="text-sm font-medium leading-relaxed text-slate-500">
=======
                  <p className="text-text-secondary text-sm font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                    Synth-1 предоставляет REST API для управления PIM, заказами и клиентами. Все
                    ответы возвращаются в формате JSON.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
<<<<<<< HEAD
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <Terminal className="h-4 w-4" />
                    </div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                      Base URL
                    </h4>
                  </div>
                  <code className="block rounded-2xl bg-slate-900 p-4 font-mono text-sm text-indigo-300">
=======
                    <div className="bg-text-primary flex h-8 w-8 items-center justify-center rounded-xl text-white">
                      <Terminal className="h-4 w-4" />
                    </div>
                    <h4 className="text-text-primary text-[11px] font-black uppercase tracking-widest">
                      Base URL
                    </h4>
                  </div>
                  <code className="bg-text-primary text-accent-primary block rounded-2xl p-4 font-mono text-sm">
>>>>>>> recover/cabinet-wip-from-stash
                    https://api.synth1.fashion/v1/
                  </code>
                </div>

<<<<<<< HEAD
                <div className="space-y-6 border-t border-slate-50 pt-10">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
=======
                <div className="border-border-subtle space-y-6 border-t pt-10">
                  <h4 className="text-text-muted text-[11px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Core Endpoints
                  </h4>
                  <div className="space-y-4">
                    {[
                      {
                        method: 'GET',
                        path: '/products',
                        desc: 'List all published products with stock levels.',
                      },
                      {
                        method: 'POST',
                        path: '/orders',
                        desc: 'Create a new order from your external frontend.',
                      },
                      {
                        method: 'GET',
                        path: '/customers/me',
                        desc: 'Fetch customer profile and style DNA.',
                      },
                    ].map((ep, i) => (
                      <div
                        key={i}
<<<<<<< HEAD
                        className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-slate-100"
=======
                        className="bg-bg-surface2 hover:bg-bg-surface2 flex items-center gap-3 rounded-2xl p-4 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        <Badge
                          className={cn(
                            'h-7 w-12 justify-center border-none text-[10px] font-black',
                            ep.method === 'GET'
                              ? 'bg-emerald-500 text-white'
<<<<<<< HEAD
                              : 'bg-indigo-500 text-white'
=======
                              : 'bg-accent-primary text-white'
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        >
                          {ep.method}
                        </Badge>
                        <div className="flex-1">
<<<<<<< HEAD
                          <p className="font-mono text-xs font-bold text-slate-900">{ep.path}</p>
                          <p className="text-[10px] font-medium text-slate-400">{ep.desc}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300" />
=======
                          <p className="text-text-primary font-mono text-xs font-bold">{ep.path}</p>
                          <p className="text-text-muted text-[10px] font-medium">{ep.desc}</p>
                        </div>
                        <ChevronRight className="text-text-muted h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6 lg:col-span-4">
<<<<<<< HEAD
          <Card className="rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl shadow-slate-200/50">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                <Zap className="h-5 w-5 text-indigo-400" />
=======
          <Card className="bg-text-primary rounded-xl border-none p-4 text-white shadow-md shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                <Zap className="text-accent-primary h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight">API Insights</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Real-time Traffic
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="mb-1 text-[9px] font-black uppercase text-white/40">
                    Last 24h Calls
                  </p>
                  <p className="text-base font-black">124,502</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="mb-1 text-[9px] font-black uppercase text-white/40">Avg Latency</p>
                  <p className="text-base font-black text-emerald-400">42ms</p>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-white/60">
                    Success Rate
                  </span>
<<<<<<< HEAD
                  <span className="text-sm font-black text-indigo-400">99.98%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: '99.98%' }} />
                </div>
              </div>
            </div>
            <Button className="mt-8 h-10 w-full rounded-xl border-none bg-indigo-600 text-[9px] font-black uppercase text-white shadow-lg hover:bg-indigo-700">
=======
                  <span className="text-accent-primary text-sm font-black">99.98%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="bg-accent-primary h-full rounded-full"
                    style={{ width: '99.98%' }}
                  />
                </div>
              </div>
            </div>
            <Button className="bg-accent-primary hover:bg-accent-primary mt-8 h-10 w-full rounded-xl border-none text-[9px] font-black uppercase text-white shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
              View Full Metrics
            </Button>
          </Card>

<<<<<<< HEAD
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
=======
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-md shadow-xl">
            <div className="flex items-center gap-3">
              <Lock className="text-accent-primary h-5 w-5" />
              <h3 className="text-text-primary text-sm font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                Security Policies
              </h3>
            </div>

            <div className="space-y-4">
              {[
                { label: 'CORS Configuration', status: 'Restrictive' },
                { label: 'Rate Limiting', status: '1000 req/min' },
                { label: 'IP Whitelisting', status: 'Disabled' },
              ].map((policy, i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="flex items-center justify-between border-b border-slate-50 py-2 last:border-0"
                >
                  <span className="text-[10px] font-black uppercase text-slate-400">
                    {policy.label}
                  </span>
                  <span className="text-[10px] font-black text-slate-900">{policy.status}</span>
=======
                  className="border-border-subtle flex items-center justify-between border-b py-2 last:border-0"
                >
                  <span className="text-text-muted text-[10px] font-black uppercase">
                    {policy.label}
                  </span>
                  <span className="text-text-primary text-[10px] font-black">{policy.status}</span>
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              ))}
            </div>
            <Button
              variant="outline"
<<<<<<< HEAD
              className="h-11 w-full rounded-xl border-slate-100 text-[10px] font-black uppercase hover:bg-slate-50"
=======
              className="border-border-subtle hover:bg-bg-surface2 h-11 w-full rounded-xl text-[10px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Manage Security
            </Button>
          </Card>
        </div>
      </div>
    </RegistryPageShell>
  );
}
