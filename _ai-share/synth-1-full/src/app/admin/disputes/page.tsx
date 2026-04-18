'use client';

import React, { useState, useMemo } from 'react';
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
  ShieldAlert,
  MessageSquare,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  History,
  Plus,
  Search,
  Info,
  ChevronRight,
  UserCircle,
  Building2,
  Filter,
  ArrowRight,
  Zap,
  BrainCircuit,
  Scale,
  DollarSign,
  Clock,
  MoreVertical,
  ExternalLink,
  MessageCircle,
  Gavel,
  Lock,
  Flag,
} from 'lucide-react';
import { Dispute, DisputeStatus, DisputeCategory, DisputeSeverity } from '@/lib/types/disputes';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { RegistryPageShell } from '@/components/design-system';

/**
 * Dispute Resolution Hub — Admin OS (Arbitration)
 * Цифровой арбитраж для B2B-споров (брак, недовоз, задержка).
 */

export default function AdminDisputesPage() {
  const [activeDisputes, setActiveDisputes] = useState<Dispute[]>([
    {
      id: 'DISP-1',
      caseNumber: 'SYNTH-8821',
      title: 'Batch Q3-101: Quality Defects in Silk Lining',
      category: 'quality_issue',
      status: 'under_review',
      severity: 'high',
      claimantId: 'brand-luxury-silk',
      claimantName: 'Luxury Silk Brand',
      respondentId: 'factory-milan-textile',
      respondentName: 'Milan Textile Factory',
      claimValue: 12500,
      currency: 'USD',
      description:
        'The internal silk lining of 500 dresses from Batch Q3-101 shows significant tearing at the seams.',
      evidence: [],
      messages: [],
      createdAt: '2026-03-01T10:00:00Z',
      updatedAt: '2026-03-05T14:30:00Z',
    },
    {
      id: 'DISP-2',
      caseNumber: 'SYNTH-9122',
      title: 'Missing 50 Units of Wool Oversized Coats',
      category: 'shortage',
      status: 'mediation',
      severity: 'medium',
      claimantId: 'retailer-berlin-store',
      claimantName: 'Berlin Flagship Store',
      respondentId: 'brand-nordic-wool',
      respondentName: 'Nordic Wool Brand',
      claimValue: 4500,
      currency: 'EUR',
      description: 'The shipment arrived with 50 units missing according to the packing list.',
      evidence: [],
      messages: [],
      createdAt: '2026-03-04T09:00:00Z',
      updatedAt: '2026-03-07T11:20:00Z',
    },
  ]);

  const getStatusBadge = (status: DisputeStatus) => {
    const config: Record<DisputeStatus, { label: string; color: string; icon: any }> = {
      draft: {
        label: 'Черновик',
        color: 'bg-bg-surface2 text-text-muted border-border-subtle',
        icon: Info,
      },
      filed: {
        label: 'Подано',
        color: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
        icon: Plus,
      },
      under_review: {
        label: 'На проверке',
        color: 'bg-amber-50 text-amber-600 border-amber-100',
        icon: Clock,
      },
      evidence_required: {
        label: 'Нужны док-ва',
        color: 'bg-rose-50 text-rose-600 border-rose-100',
        icon: FileCheck,
      },
      mediation: {
        label: 'Медиация',
        color: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
        icon: MessageCircle,
      },
      resolved: {
        label: 'Решено',
        color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        icon: CheckCircle2,
      },
      closed: { label: 'Закрыто', color: 'bg-text-primary text-white border-none', icon: Lock },
    };
    const item = config[status];
    return (
      <Badge
        variant="outline"
        className={cn('h-5 gap-1 px-2 text-[8px] font-black uppercase', item.color)}
      >
        <item.icon className="h-2.5 w-2.5" />
        {item.label}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: DisputeSeverity) => {
    const config: Record<DisputeSeverity, { label: string; color: string }> = {
      low: { label: 'Low', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
      medium: { label: 'Medium', color: 'bg-amber-50 text-amber-600 border-amber-100' },
      high: { label: 'High', color: 'bg-rose-50 text-rose-600 border-rose-100' },
      critical: { label: 'Critical', color: 'bg-rose-600 text-white border-none' },
    };
    const item = config[severity];
    return (
      <Badge
        variant="outline"
        className={cn('h-5 px-2 text-[8px] font-black uppercase', item.color)}
      >
        {item.label}
      </Badge>
    );
  };

  return (
    <RegistryPageShell className="max-w-5xl space-y-6 pb-16 duration-700 animate-in fade-in">
      <header className="border-border-subtle flex flex-col justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]">
            <Gavel className="h-2.5 w-2.5" />
            <span>Synth-1 Arbitration Center</span>
          </div>
          <h1 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter">
            Dispute Resolution Hub
          </h1>
          <p className="text-text-secondary px-0.5 text-[11px] font-medium">
            Global B2B arbitration & quality control system.
          </p>
        </div>
        <div className="bg-bg-surface2 border-border-default flex items-center gap-2 rounded-xl border p-1 shadow-inner">
          <Button
            variant="ghost"
            size="sm"
            className="text-text-secondary border-border-default hover:text-accent-primary h-7 rounded-lg border bg-white px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
          >
            <Filter className="mr-1.5 h-3 w-3" /> Filter
          </Button>
          <Button className="bg-text-primary hover:bg-text-primary/90 h-7 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all">
            <Zap className="mr-1.5 h-3 w-3" /> AI Scan
          </Button>
        </div>
      </header>

      {/* KPI Stats — Normalized & Compact */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: 'Active Disputes',
            value: activeDisputes.length,
            icon: ShieldAlert,
            color: 'text-text-primary',
            bg: 'bg-bg-surface2/80',
          },
          {
            label: 'Total Claim Value',
            value: '$17,000',
            icon: DollarSign,
            color: 'text-rose-600',
            bg: 'bg-rose-50/50',
          },
          {
            label: 'Under Mediation',
            value: '1',
            icon: MessageCircle,
            color: 'text-accent-primary',
            bg: 'bg-accent-primary/10',
          },
          {
            label: 'Avg Resolution',
            value: '4.2 Days',
            icon: Clock,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50/50',
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-border-subtle hover:border-accent-primary/20 group relative overflow-hidden rounded-xl border bg-white p-3.5 shadow-sm transition-all"
          >
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-[0.15em]">
                {stat.label}
              </span>
              <div
                className={cn(
                  'border-border-default/50 rounded-lg border p-1.5 shadow-inner',
                  stat.bg
                )}
              >
                <stat.icon className={cn('h-3.5 w-3.5 transition-colors', stat.color)} />
              </div>
            </div>
            <p
              className={cn(
                'text-sm font-black tabular-nums leading-none tracking-tighter',
                stat.color
              )}
            >
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <Card className="border-border-subtle overflow-hidden rounded-2xl border bg-white shadow-sm">
            <CardHeader className="border-border-subtle bg-bg-surface2/30 flex flex-row items-center justify-between border-b p-3">
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-black uppercase tracking-tight">
                  Active Cases
                </CardTitle>
                <CardDescription className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                  Arbitration Management Queue
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="text-text-muted absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
                <Input
                  placeholder="Search Case #..."
                  className="border-border-default h-8 w-48 rounded-lg bg-white pl-9 text-[10px] font-bold uppercase"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white">
                  <TableRow className="border-border-subtle border-b hover:bg-transparent">
                    <TableHead className="h-10 pl-6 text-[9px] font-black uppercase tracking-wider">
                      Case Info
                    </TableHead>
                    <TableHead className="h-10 text-[9px] font-black uppercase tracking-wider">
                      Parties
                    </TableHead>
                    <TableHead className="h-10 text-[9px] font-black uppercase tracking-wider">
                      Status & Severity
                    </TableHead>
                    <TableHead className="h-10 text-[9px] font-black uppercase tracking-wider">
                      Claim Value
                    </TableHead>
                    <TableHead className="h-10 pr-6 text-right text-[9px] font-black uppercase tracking-wider">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeDisputes.map((dispute) => (
                    <TableRow
                      key={dispute.id}
                      className="hover:bg-bg-surface2/80 border-border-subtle group cursor-pointer border-b transition-colors last:border-0"
                    >
                      <TableCell className="py-4 pl-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-accent-primary bg-accent-primary/10 border-accent-primary/20 rounded-md border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-tighter">
                              {dispute.caseNumber}
                            </span>
                            <span className="text-text-primary max-w-[150px] truncate text-[11px] font-black uppercase">
                              {dispute.title}
                            </span>
                          </div>
                          <p className="text-text-muted text-[8px] font-black uppercase tracking-widest opacity-70">
                            {dispute.category.replace('_', ' ')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-md border border-emerald-100 bg-emerald-50">
                              <Building2 className="h-2.5 w-2.5 text-emerald-600" />
                            </div>
                            <span className="text-text-primary max-w-[100px] truncate text-[10px] font-bold uppercase">
                              {dispute.claimantName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-md border border-rose-100 bg-rose-50">
                              <Building2 className="h-2.5 w-2.5 text-rose-600" />
                            </div>
                            <span className="text-text-primary max-w-[100px] truncate text-[10px] font-bold uppercase">
                              {dispute.respondentName}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5">
                          {getStatusBadge(dispute.status)}
                          <div className="block">{getSeverityBadge(dispute.severity)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-text-primary text-xs font-black tabular-nums">
                          ${dispute.claimValue?.toLocaleString()}
                        </p>
                        <p className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
                          {dispute.currency}
                        </p>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 h-7 w-7 rounded-lg transition-all"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <Card className="border-text-primary/30 bg-text-primary hover:border-accent-primary/30 group rounded-2xl border p-3 text-white shadow-lg transition-all">
            <div className="mb-5 flex items-center gap-3 px-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-inner transition-transform group-hover:scale-105">
                <BrainCircuit className="w-4.5 h-4.5 text-accent-primary" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-tight text-white">
                  AI Arbiter Insights
                </h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                  Predictive Resolution
                </p>
              </div>
            </div>

            <div className="space-y-5 px-1">
              <div className="space-y-2.5 rounded-xl border border-white/10 bg-white/5 p-4 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/60">
                    Prob: Claimant Win
                  </span>
                  <span className="text-accent-primary text-xs font-black tabular-nums">72%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="bg-accent-primary h-full rounded-full transition-all duration-1000"
                    style={{ width: '72%' }}
                  />
                </div>
                <p className="mt-1 border-t border-white/5 pt-3 text-[9px] italic leading-relaxed text-white/30">
                  "Based on historical data for Batch Quality disputes, claimant win probability is
                  correlated with evidence density."
                </p>
              </div>

              <div className="space-y-2 px-1">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Scale className="h-3 w-3" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Suggested Action
                  </span>
                </div>
                <p className="text-[10px] font-medium leading-relaxed text-white/60">
                  Initiate Mediation stage. Respondent failed to provide production logs within the
                  48h protocol window.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-accent-primary hover:bg-accent-primary mt-6 h-9 w-full rounded-lg border-none text-[9px] font-black uppercase tracking-widest text-white shadow-md transition-all"
            >
              Open Case Analysis
            </Button>
          </Card>

          <Card className="border-border-subtle hover:border-accent-primary/20 group space-y-5 rounded-2xl border bg-white p-3 shadow-sm transition-all">
            <h3 className="text-text-primary px-1 text-xs font-black uppercase tracking-tight">
              Arbitrator Controls
            </h3>
            <div className="space-y-2 px-1">
              <Button
                variant="outline"
                size="sm"
                className="border-border-default hover:bg-bg-surface2 group/btn h-9 w-full justify-start gap-3 rounded-lg px-4 text-[9px] font-black uppercase transition-all"
              >
                <Flag className="h-3.5 w-3.5 text-rose-500 transition-transform group-hover/btn:scale-110" />{' '}
                Mark as Critical
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-border-default hover:bg-bg-surface2 group/btn h-9 w-full justify-start gap-3 rounded-lg px-4 text-[9px] font-black uppercase transition-all"
              >
                <Scale className="text-accent-primary h-3.5 w-3.5 transition-transform group-hover/btn:scale-110" />{' '}
                Assign Mediator
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-border-default hover:bg-bg-surface2 group/btn h-9 w-full justify-start gap-3 rounded-lg px-4 text-[9px] font-black uppercase transition-all"
              >
                <History className="text-text-muted h-3.5 w-3.5 transition-transform group-hover/btn:scale-110" />{' '}
                View Precedents
              </Button>
            </div>
            <div className="border-border-subtle mt-4 border-t px-1 pt-4">
              <div className="flex items-center gap-2 px-1 text-rose-500">
                <AlertTriangle className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Unassigned Cases: 4
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </RegistryPageShell>
  );
}
