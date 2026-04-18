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
  ShieldCheck,
  Lock,
  Database,
  FileText,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Cpu,
  Fingerprint,
  History,
  Share2,
  Plus,
  Globe,
  Activity,
  AlertCircle,
  Hash,
  Box,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { IPRecord } from '@/lib/types/intellectual-property';
import { MOCK_IP_RECORDS, getIPStatusColor } from '@/lib/logic/blockchain-utils';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

/**
 * Blockchain IP Ledger — Brand OS
 * Реестр интеллектуальной собственности на блокчейне.
 */

export default function IPLedgerPage() {
  const [records, setRecords] = useState<IPRecord[]>(MOCK_IP_RECORDS);
  const [search, setSearch] = useState('');

  const filteredRecords = records.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        eyebrow={
          <div className="text-accent-primary flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            Brand Asset Protection
          </div>
        }
        title="IP Blockchain Ledger"
        leadPlain="Защита авторских прав на дизайны и технологии через неизменяемый реестр."
        actions={
          <div className="bg-bg-surface2 border-border-default flex gap-2 rounded-xl border p-1 shadow-inner">
            <Button
              variant="ghost"
              className="text-text-secondary hover:text-accent-primary h-8 gap-2 rounded-lg px-4 text-[10px] font-bold uppercase transition-all hover:bg-white"
            >
              <History className="h-3.5 w-3.5" /> History
            </Button>
            <Button className="bg-text-primary hover:bg-accent-primary h-8 gap-2 rounded-lg px-4 text-[10px] font-bold uppercase text-white shadow-md transition-all">
              <Plus className="h-3.5 w-3.5" /> Register IP
            </Button>
          </div>
        }
      />

      {/* Trust & Network Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Assets', value: records.length, icon: Database },
          {
            label: 'Blockchain',
            value: 'Live',
            sub: 'Ethereum',
            icon: Globe,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
          },
          {
            label: 'Disputes',
            value: '0',
            icon: AlertCircle,
            color: 'text-text-muted',
            bg: 'bg-bg-surface2',
          },
          {
            label: 'Verification',
            value: '100%',
            icon: CheckCircle2,
            color: 'text-accent-primary',
            bg: 'bg-accent-primary/10',
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-border-subtle hover:border-accent-primary/30 group rounded-xl border bg-white p-4 shadow-sm transition-all"
          >
            <div className="mb-3 flex items-center justify-between">
              <div
                className={cn(
                  'border-border-subtle rounded-lg border p-2 shadow-sm',
                  stat.bg || 'bg-bg-surface2'
                )}
              >
                <stat.icon className={cn('h-4 w-4', stat.color || 'text-text-muted')} />
              </div>
              {stat.sub && (
                <span className="text-text-muted text-[9px] font-bold uppercase tracking-wider">
                  {stat.sub}
                </span>
              )}
            </div>
            <p className="text-text-muted mb-0.5 text-[10px] font-bold uppercase tracking-wider">
              {stat.label}
            </p>
            <p
              className={cn(
                'text-base font-bold tracking-tight',
                stat.color || 'text-text-primary'
              )}
            >
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Card className="border-border-subtle overflow-hidden rounded-xl border bg-white shadow-sm">
            <CardHeader className="border-border-subtle bg-bg-surface2/30 flex flex-row items-center justify-between border-b p-4">
              <CardTitle className="text-text-primary text-sm font-bold uppercase tracking-wider">
                IP Asset Registry
              </CardTitle>
              <div className="relative">
                <Search className="text-text-muted absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
                <Input
                  placeholder="Search assets..."
                  className="border-border-default focus:ring-accent-primary h-8 w-48 rounded-lg bg-white pl-9 text-[11px] shadow-sm focus:ring-1"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-bg-surface2/80">
                  <TableRow className="h-10 border-none hover:bg-transparent">
                    <TableHead className="text-text-muted pl-6 text-[10px] font-bold uppercase tracking-wider">
                      Asset / ID
                    </TableHead>
                    <TableHead className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                      Type
                    </TableHead>
                    <TableHead className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                      Blockchain Hash
                    </TableHead>
                    <TableHead className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="text-text-muted pr-6 text-right text-[10px] font-bold uppercase tracking-wider">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow
                      key={record.id}
                      className="hover:bg-bg-surface2/80 group h-12 transition-colors"
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-bg-surface2 border-border-subtle flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border shadow-sm transition-transform group-hover:scale-105">
                            <Fingerprint className="text-text-muted group-hover:text-accent-primary h-4 w-4 transition-colors" />
                          </div>
                          <div>
                            <p className="text-text-primary text-[12px] font-bold leading-tight">
                              {record.title}
                            </p>
                            <p className="text-text-muted mt-0.5 text-[10px] font-bold uppercase tracking-wider">
                              {record.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-border-default bg-bg-surface2 text-text-secondary h-5 px-2 text-[9px] font-bold uppercase"
                        >
                          {record.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="group/hash flex cursor-pointer items-center gap-2">
                          <code className="text-text-muted block w-20 truncate font-mono text-[10px]">
                            {record.hash}
                          </code>
                          <ExternalLink className="text-text-muted h-3 w-3 opacity-0 transition-opacity group-hover/hash:opacity-100" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            'h-5 border-none px-2 text-[9px] font-bold uppercase shadow-sm',
                            getIPStatusColor(record.status)
                          )}
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-text-muted hover:text-accent-primary hover:border-border-subtle h-7 w-7 rounded-lg border border-transparent shadow-sm transition-all hover:bg-white"
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

        <div className="space-y-6 lg:col-span-4">
          <Card className="border-accent-primary bg-accent-primary group relative overflow-hidden rounded-xl border p-4 text-white shadow-xl">
            <div className="absolute -bottom-10 -right-10 opacity-10 transition-transform duration-700 group-hover:scale-110">
              <Lock className="text-accent-primary h-40 w-40" />
            </div>
            <div className="relative z-10 mb-6 flex items-center gap-3">
              <div className="group-hover:text-accent-primary flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-inner transition-all duration-300 group-hover:bg-white">
                <Hash className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold uppercase leading-none tracking-tight">
                Secure Mining
              </h3>
            </div>
            <div className="relative z-10 mb-8 space-y-4">
              <p className="text-accent-primary/30 text-[13px] font-medium leading-relaxed">
                Synth-1 использует гибридный метод фиксации IP. Каждый техпакет может быть
                «замайнен» в блокчейн одним кликом.
              </p>
              <p className="text-[11px] font-medium leading-relaxed text-white/40">
                Это создает юридический прецедент владения дизайном для арбитражных споров.
              </p>
            </div>
            <Button className="text-accent-primary hover:bg-accent-primary/10 relative z-10 h-10 w-full rounded-lg bg-white text-[10px] font-bold uppercase tracking-widest shadow-lg transition-all">
              Run Global IP Scan
            </Button>
          </Card>

          <Card className="border-border-subtle space-y-6 rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 shadow-sm">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-text-primary text-sm font-bold uppercase tracking-wider">
                Network Intelligence
              </h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: 'Similar Designs',
                  value: '2',
                  icon: AlertCircle,
                  color: 'text-amber-500',
                  bg: 'bg-amber-50',
                },
                {
                  label: 'Registry Sync',
                  value: 'Active',
                  icon: CheckCircle2,
                  color: 'text-emerald-500',
                  bg: 'bg-emerald-50',
                },
                {
                  label: 'Token Staking',
                  value: 'Inactive',
                  icon: Database,
                  color: 'text-text-muted',
                  bg: 'bg-bg-surface2',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-bg-surface2/80 border-border-subtle flex items-center justify-between rounded-lg border p-2.5"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn('h-4 w-4', item.color)} />
                    <span className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                  <span className={cn('text-[10px] font-bold uppercase', item.color)}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-border-subtle border-t pt-2">
              <Button
                variant="ghost"
                className="text-accent-primary hover:bg-accent-primary/10 h-9 w-full rounded-lg text-[10px] font-bold uppercase tracking-wider"
              >
                Open Legal Export
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </RegistryPageShell>
  );
}
