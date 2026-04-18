'use client';

import React, { useState } from 'react';

/** Deterministic number format to avoid hydration mismatch (no locale). */
function formatClaimValue(value: number | undefined): string {
  if (value == null) return '—';
  return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
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
  Plus,
  Search,
  Info,
  ChevronRight,
  Building2,
  Filter,
  ArrowRight,
  Zap,
  Gavel,
  DollarSign,
  Clock,
  MoreVertical,
  ExternalLink,
  MessageCircle,
  Package,
  Factory,
  CheckCircle2,
  AlertTriangle,
  History,
  Scale,
  FileCheck,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { Dispute, DisputeStatus, DisputeCategory, DisputeSeverity } from '@/lib/types/disputes';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { getArbitrationLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

/**
 * Dispute Resolution Hub — Brand OS
 * Управление спорами с фабриками и ритейлерами.
 */

export default function BrandDisputesPage() {
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

  return (
    <RegistryPageShell className="w-full max-w-none space-y-10 pb-16">
      <RegistryPageHeader
        title="Dispute Hub"
        leadPlain="Центр управления B2B-претензиями и арбитражем (Dispute Resolution)."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-600">
              <ShieldAlert className="size-3.5 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Dispute Resolution</span>
            </div>
            <Button
              variant="outline"
              className="h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase"
            >
              <History className="size-4" /> История споров
            </Button>
            <Button
              variant="outline"
              asChild
              className="h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase"
            >
              <Link href={ROUTES.brand.financeEscrow}>Escrow</Link>
            </Button>
            <Button className="h-11 gap-2 rounded-xl bg-rose-600 px-6 text-[10px] font-black uppercase text-white shadow-lg shadow-rose-200 hover:bg-rose-700">
              <Plus className="size-4" /> Подать новую претензию
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="overflow-hidden rounded-xl border-none bg-white shadow-md shadow-xl">
            <CardHeader className="border-border-subtle flex flex-row items-center justify-between border-b p-4">
              <div>
                <CardTitle className="text-text-primary text-base font-black uppercase tracking-tight">
                  Ваши активные споры
                </CardTitle>
                <CardDescription>Статус претензий к фабрикам и партнерам.</CardDescription>
              </div>
              <div className="relative">
                <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search Case # / Factory"
                  className="border-border-subtle h-10 w-64 rounded-xl pl-9 text-xs"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-bg-surface2/80">
                  <TableRow>
                    <TableHead className="pl-8 text-[10px] font-black uppercase">
                      Case Info
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Respondent</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Claim Value</TableHead>
                    <TableHead className="pr-8 text-right text-[10px] font-black uppercase">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeDisputes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center">
                        <div className="space-y-4">
                          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-100" />
                          <p className="text-text-muted text-sm font-bold uppercase italic tracking-widest">
                            Нет активных споров
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeDisputes.map((dispute) => (
                      <TableRow
                        key={dispute.id}
                        className="hover:bg-bg-surface2/80 group cursor-pointer transition-colors"
                      >
                        <TableCell className="py-6 pl-8">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-black text-rose-600">
                                {dispute.caseNumber}
                              </span>
                              <span className="text-text-primary text-xs font-black">
                                {dispute.title}
                              </span>
                            </div>
                            <p className="text-text-muted text-[9px] font-bold uppercase">
                              {dispute.category.replace('_', ' ')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="bg-bg-surface2 flex h-6 w-6 items-center justify-center rounded-lg">
                              <Factory className="text-text-muted h-3.5 w-3.5" />
                            </div>
                            <span className="text-text-primary text-xs font-bold">
                              {dispute.respondentName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                        <TableCell>
                          <p className="text-text-primary text-sm font-black">
                            ${formatClaimValue(dispute.claimValue)}
                          </p>
                          <p className="text-text-muted text-[9px] font-bold uppercase">
                            {dispute.currency}
                          </p>
                        </TableCell>
                        <TableCell className="pr-8 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-text-muted h-8 w-8 rounded-xl transition-all hover:text-rose-600 group-hover:bg-rose-50"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-text-primary relative overflow-hidden rounded-xl border-none p-4 text-white shadow-md shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                <Scale className="text-accent-primary h-5 w-5" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight">How Arbitration works</h3>
            </div>

            <div className="mb-4 space-y-2">
              <p className="text-text-muted text-[9px] font-black uppercase">Workflow статусов</p>
              <div className="flex flex-wrap gap-1">
                {['Черновик', 'Подано', 'На проверке', 'Медиация', 'Решено'].map((s, i) => (
                  <span
                    key={s}
                    className="rounded bg-white/5 px-2 py-1 text-[8px] font-bold text-white/80"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                'Smart Escrow: Средства заморожены до решения арбитража.',
                'AI Analysis: Synth-1 автоматически оценивает доказательства.',
                'Final Decision: Решение выносится в течение 72 часов.',
              ].map((text, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  <p className="text-xs font-medium leading-relaxed text-white/70">{text}</p>
                </div>
              ))}
            </div>
            <div className="bg-accent-primary/10 absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full blur-2xl" />
          </Card>

          <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-md shadow-xl">
            <h3 className="text-text-primary mb-6 text-sm font-black uppercase tracking-tight">
              Dispute Statistics
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Win Rate', value: '88%', color: 'text-emerald-500' },
                { label: 'Total Recovered', value: '$42,500', color: 'text-text-primary' },
                { label: 'Avg Claim Time', value: '5 дней', color: 'text-accent-primary' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="border-border-subtle flex items-end justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <span className="text-text-muted text-[10px] font-black uppercase">
                    {stat.label}
                  </span>
                  <span className={cn('text-base font-black', stat.color)}>{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <RelatedModulesBlock links={getArbitrationLinks()} className="mt-6" />
    </RegistryPageShell>
  );
}
