'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Globe, Layers, CheckCircle, Clock, History, ExternalLink } from 'lucide-react';
import { getB2BCampaigns } from '@/lib/fashion/b2b-campaigns';
import { Button } from '@/components/ui/button';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

export default function B2BCampaignPage() {
  const campaigns = getB2BCampaigns();
<<<<<<< HEAD

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-lg bg-purple-100 p-2">
            <Megaphone className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            B2B Campaign Versions
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage digital lookbooks, wholesale catalogs, and marketing campaigns for your global
          partners.
        </p>
      </div>

=======

  return (
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-20">
      <RegistryPageHeader
        title="Кампании B2B"
        leadPlain="Цифровые lookbooks, оптовые каталоги и версии кампаний для партнёров."
      />

>>>>>>> recover/cabinet-wip-from-stash
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {campaigns.map((camp) => (
          <Card
            key={camp.id}
<<<<<<< HEAD
            className="overflow-hidden border-2 p-6 shadow-sm transition-colors hover:border-purple-200"
=======
            className="hover:border-accent-primary/25 overflow-hidden border-2 p-6 shadow-sm transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <div className="mb-4 flex items-center justify-between">
              <Badge
                variant="outline"
<<<<<<< HEAD
                className="border-slate-200 text-[10px] font-black uppercase text-slate-400"
=======
                className="text-text-muted border-border-default text-[10px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
              >
                {camp.id} • {camp.version}
              </Badge>
              {camp.activeStatus ? (
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-green-600">
                  <CheckCircle className="h-4 w-4" /> Live
                </div>
              ) : (
<<<<<<< HEAD
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-400">
=======
                <div className="text-text-muted flex items-center gap-1.5 text-xs font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  <Clock className="h-4 w-4" /> Scheduled
                </div>
              )}
            </div>

            <div className="mb-6">
<<<<<<< HEAD
              <h3 className="mb-1 text-xl font-bold text-slate-800">{camp.theme}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="h-3.5 w-3.5 text-blue-500" />
                Target Market:{' '}
                <span className="font-semibold text-slate-600">{camp.targetMarket}</span>
=======
              <h3 className="text-text-primary mb-1 text-xl font-bold">{camp.theme}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="h-3.5 w-3.5 text-blue-500" />
                Target Market:{' '}
                <span className="text-text-secondary font-semibold">{camp.targetMarket}</span>
>>>>>>> recover/cabinet-wip-from-stash
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" /> Version History
                </span>
<<<<<<< HEAD
                <span className="font-bold text-purple-600">3 Revisions</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
                  <History className="h-3.5 w-3.5" /> Last Published
                </span>
                <span className="font-semibold text-slate-600">{camp.publishedAt}</span>
              </div>

=======
                <span className="text-accent-primary font-bold">3 Revisions</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
                  <History className="h-3.5 w-3.5" /> Last Published
                </span>
                <span className="text-text-secondary font-semibold">{camp.publishedAt}</span>
              </div>

>>>>>>> recover/cabinet-wip-from-stash
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="h-9 text-[10px] font-bold uppercase">
                  View Catalog
                </Button>
                <Button
                  size="sm"
<<<<<<< HEAD
                  className="h-9 bg-purple-600 text-[10px] font-bold uppercase hover:bg-purple-700"
=======
                  className="bg-accent-primary hover:bg-accent-primary h-9 text-[10px] font-bold uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <ExternalLink className="mr-1 h-3 w-3" /> Share Pack
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

<<<<<<< HEAD
      <div className="mt-8 flex items-center gap-4 rounded-lg border border-purple-100 bg-purple-50 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm">
          <Layers className="h-5 w-5 text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold uppercase text-purple-700">
            Pro Tip: Campaign Versioning
          </div>
          <div className="text-[11px] leading-tight text-purple-600">
=======
      <div className="bg-accent-primary/10 border-accent-primary/20 mt-8 flex items-center gap-4 rounded-lg border p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm">
          <Layers className="text-accent-primary h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="text-accent-primary text-xs font-bold uppercase">
            Pro Tip: Campaign Versioning
          </div>
          <div className="text-accent-primary text-[11px] leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
            Use regional versions of lookbooks to highlight category affinity for specific markets
            (e.g., Silk Dresses for Middle East vs Wool Coats for Northern Europe).
          </div>
        </div>
      </div>
    </RegistryPageShell>
  );
}
