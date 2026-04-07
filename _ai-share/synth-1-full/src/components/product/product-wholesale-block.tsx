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
    'open': 'bg-green-100 text-green-700',
    'limited': 'bg-orange-100 text-orange-700',
    'sold_out': 'bg-red-100 text-red-700',
  };

  return (
    <Card className="p-4 border-2 border-indigo-50 bg-indigo-50/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-600" />
          <h4 className="font-bold text-sm uppercase text-indigo-600">Wholesale & Pre-order</h4>
        </div>
        <Badge className={statusColors[ws.allocationStatus]}>
          {ws.allocationStatus.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <Users className="w-3 h-3" /> Minimum Order (MOQ)
          </span>
          <span className="font-bold">{ws.moq} units</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {ws.tierPrices.map((tier, idx) => (
            <div key={idx} className="p-2 border rounded bg-white text-center">
              <div className="text-[10px] text-muted-foreground">{tier.minQty}+ pcs</div>
              <div className="text-sm font-bold">${tier.price}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-xs pt-2 border-t">
          <span className="text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Ordering Window
          </span>
          <span className="font-semibold">{ws.preOrderWindow.end}</span>
        </div>

        <Button variant="outline" size="sm" className="w-full text-[10px] h-8 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
          <ArrowDownToLine className="w-3 h-3 mr-1" /> Download Wholesale Pack
        </Button>
      </div>
    </Card>
  );
};
