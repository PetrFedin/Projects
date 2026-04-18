'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Calendar, Users, ArrowDownToLine } from 'lucide-react';
import { getWholesalePreOrderInfo } from '@/lib/fashion/wholesale-preorder';
import { Button } from '@/components/ui/button';

export const ProductWholesaleBlock: React.FC<{ product: Product }> = ({ product }) => {
  const ws = getWholesalePreOrderInfo(product);

  const statusColors: Record<string, string> = {
    open: 'bg-green-100 text-green-700',
    limited: 'bg-orange-100 text-orange-700',
    sold_out: 'bg-red-100 text-red-700',
  };

  return (
<<<<<<< HEAD
    <Card className="border-2 border-indigo-50 bg-indigo-50/20 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-indigo-600" />
          <h4 className="text-sm font-bold uppercase text-indigo-600">Wholesale & Pre-order</h4>
=======
    <Card className="border-accent-primary/15 bg-accent-primary/10 border-2 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="text-accent-primary h-4 w-4" />
          <h4 className="text-accent-primary text-sm font-bold uppercase">Wholesale & Pre-order</h4>
>>>>>>> recover/cabinet-wip-from-stash
        </div>
        <Badge className={statusColors[ws.allocationStatus]}>
          {ws.allocationStatus.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3 w-3" /> Minimum Order (MOQ)
          </span>
          <span className="font-bold">{ws.moq} units</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {ws.tierPrices.map((tier, idx) => (
            <div key={idx} className="rounded border bg-white p-2 text-center">
              <div className="text-[10px] text-muted-foreground">{tier.minQty}+ pcs</div>
              <div className="text-sm font-bold">${tier.price}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t pt-2 text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" /> Ordering Window
          </span>
          <span className="font-semibold">{ws.preOrderWindow.end}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
<<<<<<< HEAD
          className="h-8 w-full border-indigo-200 text-[10px] text-indigo-700 hover:bg-indigo-50"
=======
          className="border-accent-primary/30 text-accent-primary hover:bg-accent-primary/10 h-8 w-full text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
        >
          <ArrowDownToLine className="mr-1 h-3 w-3" /> Download Wholesale Pack
        </Button>
      </div>
    </Card>
  );
};
