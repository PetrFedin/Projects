'use client';

import React from 'react';
import { Tag, Globe, Sparkles, Cpu, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface PIMInfoTabProps {
  selectedProduct: any;
}

export function PIMInfoTab({ selectedProduct }: PIMInfoTabProps) {
  return (
    <div className="grid grid-cols-2 gap-3 text-left animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
              Product Title
            </label>
            <button className="text-accent-primary flex items-center gap-1 text-[8px] font-black uppercase hover:underline">
              <Sparkles className="h-2 w-2" /> AI Rewrite
            </button>
          </div>
          <Input
            defaultValue={selectedProduct.name}
            className="bg-bg-surface2 h-10 rounded-2xl border-none font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-text-muted ml-1 text-[10px] font-black uppercase tracking-widest">
            Category
          </label>
          <Input
            defaultValue={selectedProduct.category}
            className="bg-bg-surface2 h-10 rounded-2xl border-none font-bold"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-text-muted ml-1 text-[10px] font-black uppercase tracking-widest">
              Wholesale Price
            </label>
            <div className="relative">
              <span className="text-text-muted absolute left-4 top-1/2 -translate-y-1/2 font-bold">
                ₽
              </span>
              <Input
                type="number"
                defaultValue="4500"
                className="bg-bg-surface2 h-10 rounded-2xl border-none pl-10 font-bold"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-text-muted ml-1 text-[10px] font-black uppercase tracking-widest">
              MSRP (Retail)
            </label>
            <div className="relative">
              <span className="text-text-muted absolute left-4 top-1/2 -translate-y-1/2 font-bold">
                ₽
              </span>
              <Input
                type="number"
                defaultValue="12900"
                className="bg-bg-surface2 h-10 rounded-2xl border-none pl-10 font-bold"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
              Wholesale Description
            </label>
            <Button
              variant="ghost"
              className="text-accent-primary bg-accent-primary/10 hover:bg-accent-primary/15 h-6 gap-1 rounded-lg px-2 text-[8px] font-black uppercase"
            >
              <Cpu className="h-2.5 w-2.5" /> AI Tech Writer
            </Button>
          </div>
          <textarea
            className="bg-bg-surface2 focus:ring-accent-primary h-32 w-full resize-none rounded-2xl border-none p-4 text-sm font-medium focus:ring-2"
            defaultValue="Premium performance parka featuring graphene-infused nylon for superior thermal regulation..."
          />
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-accent-primary/10 border-accent-primary/20 space-y-4 rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-accent-primary text-xs font-black uppercase">
              SEO & Marketplace Tags
            </h4>
            <Tag className="text-accent-primary h-4 w-4" />
          </div>
          <div className="flex flex-wrap gap-2">
            {['#techwear', '#graphene', '#waterproof', '#fw26', '#premium'].map((tag) => (
              <Badge
                key={tag}
                className="text-accent-primary border-accent-primary/20 bg-white text-[9px] font-black"
              >
                {tag}
              </Badge>
            ))}
            <button className="bg-accent-primary/25 hover:bg-accent-primary/40 flex h-6 w-6 items-center justify-center rounded-lg transition-all">
              <Plus className="text-accent-primary h-3 w-3" />
            </button>
          </div>
        </div>
        <Card className="bg-bg-surface2 space-y-4 border-none p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Globe className="text-text-muted h-4 w-4" />
            <span className="text-text-primary text-[10px] font-black uppercase">
              Multi-Channel Sync
            </span>
          </div>
          <div className="space-y-3">
            {[
              { ch: 'B2B Showroom', status: 'synced' },
              { ch: 'Global Marketplace', status: 'synced' },
              { ch: 'Social Sync', status: 'pending' },
            ].map((c) => (
              <div key={c.ch} className="flex items-center justify-between">
                <span className="text-text-secondary text-[9px] font-bold uppercase">{c.ch}</span>
                {c.status === 'synced' ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
