'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Globe, Layers, CheckCircle, Clock, History, ExternalLink } from 'lucide-react';
import { getB2BCampaigns } from '@/lib/fashion/b2b-campaigns';
import { Button } from '@/components/ui/button';

export default function B2BCampaignPage() {
  const campaigns = getB2BCampaigns();
  
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Megaphone className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">B2B Campaign Versions</h1>
        </div>
        <p className="text-muted-foreground">
          Manage digital lookbooks, wholesale catalogs, and marketing campaigns for your global partners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((camp) => (
          <Card key={camp.id} className="p-6 overflow-hidden border-2 hover:border-purple-200 transition-colors shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-[10px] font-black uppercase text-slate-400 border-slate-200">
                {camp.id} • {camp.version}
              </Badge>
              {camp.activeStatus ? (
                <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold uppercase">
                  <CheckCircle className="w-4 h-4" /> Live
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase">
                  <Clock className="w-4 h-4" /> Scheduled
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800 mb-1">{camp.theme}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                Target Market: <span className="font-semibold text-slate-600">{camp.targetMarket}</span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5 uppercase font-bold text-[10px]">
                  <Layers className="w-3.5 h-3.5" /> Version History
                </span>
                <span className="font-bold text-purple-600">3 Revisions</span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5 uppercase font-bold text-[10px]">
                  <History className="w-3.5 h-3.5" /> Last Published
                </span>
                <span className="font-semibold text-slate-600">{camp.publishedAt}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button size="sm" variant="outline" className="text-[10px] uppercase font-bold h-9">
                   View Catalog
                </Button>
                <Button size="sm" className="text-[10px] uppercase font-bold h-9 bg-purple-600 hover:bg-purple-700">
                  <ExternalLink className="w-3 h-3 mr-1" /> Share Pack
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-100 flex gap-4 items-center">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border shadow-sm shrink-0">
          <Layers className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-purple-700 uppercase">Pro Tip: Campaign Versioning</div>
          <div className="text-[11px] text-purple-600 leading-tight">
            Use regional versions of lookbooks to highlight category affinity for specific markets (e.g., Silk Dresses for Middle East vs Wool Coats for Northern Europe).
          </div>
        </div>
      </div>
    </div>
  );
}
