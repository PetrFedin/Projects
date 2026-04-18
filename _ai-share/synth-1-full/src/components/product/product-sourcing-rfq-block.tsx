'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { createSourcingRfq } from '@/lib/fashion/sourcing-rfq';
import { Send, Factory, DollarSign, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Props = { product: Product };

export function ProductSourcingRfqBlock({ product }: Props) {
  const { toast } = useToast();
  const [qty, setQty] = useState(500);
  const rfq = createSourcingRfq(product, qty);

  const handleSend = () => {
    toast({
      title: 'RFQ Draft Created',
      description: `Запрос котировок ${rfq.id} подготовлен для отправки поставщикам.`,
    });
  };

  return (
    <Card className="bg-accent-primary/10 mt-4 border-dashed text-muted-foreground">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
<<<<<<< HEAD
          <Factory className="h-4 w-4 text-violet-600" />
=======
          <Factory className="text-accent-primary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
          Production Sourcing (RFQ)
        </CardTitle>
        <CardDescription className="text-xs italic">
          Brand tool — Request Factory Quote.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-tight">Target Quantity</p>
            <div className="flex items-center gap-2">
              <Package className="h-3 w-3" />
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                className="w-full bg-transparent text-xs font-bold text-foreground focus:outline-none"
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-tight">Target Unit Price</p>
            <div className="flex items-center gap-1 text-xs font-bold text-foreground">
              <DollarSign className="h-3 w-3" />
              {rfq.targetPrice.toLocaleString()} ₽
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
<<<<<<< HEAD
          className="h-8 w-full gap-2 border-violet-300 text-[10px] text-violet-700 hover:bg-violet-100"
=======
          className="border-accent-primary/30 text-accent-primary hover:bg-accent-primary/15 h-8 w-full gap-2 text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
          onClick={handleSend}
        >
          <Send className="h-3 w-3" />
          Generate RFQ Package
        </Button>
      </CardContent>
    </Card>
  );
}
