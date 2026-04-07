'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Leaf, TrendingDown, Award, Recycle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useB2BState } from '@/providers/b2b-state';

export function SustainabilityWidget() {
  const { b2bCart } = useB2BState();
  
  // Mock calculations - в реальности из API
  const carbonSaved = 350; // kg CO2
  const industryAvg = 540; // kg CO2
  const reduction = Math.round(((industryAvg - carbonSaved) / industryAvg) * 100);
  
  const ecoProducts = [
    { name: 'Organic Cotton', count: 12, badge: 'Organic' },
    { name: 'Recycled Materials', count: 8, badge: 'Recycled' },
    { name: 'Carbon Neutral', count: 5, badge: 'Carbon Neutral' }
  ];
  
  const circularEconomy = {
    buyBackAvailable: 12,
    resaleValue: 45000
  };
  
  return (
    <Card className="border-2 border-emerald-100 shadow-xl rounded-xl">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-emerald-600 flex items-center justify-center">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">
              Sustainability Tracker
            </CardTitle>
            <p className="text-[10px] text-slate-500 font-medium">
              Your environmental impact FW26
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-6">
        {/* Carbon Footprint */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-emerald-600" />
            Carbon Impact
          </h4>
          
          <div className="p-4 bg-emerald-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-base font-black text-emerald-900 tracking-tight tabular-nums">
                  {carbonSaved} kg
                </p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase">
                  CO₂ Saved
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-black text-slate-600 tracking-tight tabular-nums">
                  {industryAvg} kg
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Industry Avg
                </p>
              </div>
            </div>
            
            <Progress value={100 - reduction} className="h-2 mb-2" />
            
            <Badge className="w-full justify-center bg-emerald-600 text-white text-[8px] font-black uppercase border-none">
              -{reduction}% vs Conventional Sourcing
            </Badge>
          </div>
        </div>
        
        {/* Eco Products */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-600" />
            Sustainable SKUs
          </h4>
          
          <div className="space-y-2">
            {ecoProducts.map((item, i) => (
              <div 
                key={i}
                className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-slate-900">
                    {item.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase border-none">
                    {item.count} Items
                  </Badge>
                  <Badge className="bg-white text-emerald-700 text-[7px] font-black uppercase border border-emerald-200">
                    {item.badge}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Circular Economy */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Recycle className="h-4 w-4 text-emerald-600" />
            Circular Fashion
          </h4>
          
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-base font-black text-emerald-900 tracking-tight tabular-nums">
                  {circularEconomy.buyBackAvailable} SKU
                </p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase">
                  Buy-Back Available
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 tracking-tight tabular-nums">
                  {circularEconomy.resaleValue.toLocaleString()} ₽
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Resale Value
                </p>
              </div>
            </div>
            
            <p className="text-[10px] text-emerald-900 font-medium italic">
              💡 These items qualify for brand buy-back programs. 
              Extend product lifecycle and reduce waste.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
