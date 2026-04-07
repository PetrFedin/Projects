'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Microscope, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { scanFabricBatch } from '@/lib/fashion/fabric-defect-scanner';

export const ProductFabricDefectScannerBlock: React.FC<{ product: Product }> = ({ product }) => {
  const scan = scanFabricBatch(product);
  
  const statusColors: Record<string, string> = {
    'pass': 'text-green-600 bg-green-50 border-green-200',
    'rework': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'quarantine': 'text-red-600 bg-red-50 border-red-200',
  };

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/20 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 rotate-12">
        <Microscope className="w-16 h-16 text-slate-400" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Microscope className="w-4 h-4 text-slate-600" />
          <h4 className="font-bold text-xs uppercase text-slate-700 tracking-tight">AI Quality Control Scan</h4>
        </div>
        <Badge variant="outline" className={`text-[10px] font-black uppercase ${statusColors[scan.actionRequired]}`}>
          {scan.actionRequired === 'pass' ? <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> : <ShieldAlert className="w-2.5 h-2.5 mr-1" />}
          {scan.actionRequired}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-black text-slate-800">{scan.passRate}%</div>
          <div className="text-[10px] font-black text-slate-400 uppercase leading-none">Pass Rate</div>
        </div>
        <div>
          <div className="text-sm font-bold text-slate-600 mt-1">{scan.batchId}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase leading-none">Active Batch</div>
        </div>
      </div>

      {scan.detectedDefects > 0 && (
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-3 items-start">
           <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
           <div>
              <div className="text-[10px] font-black text-amber-700 uppercase leading-none mb-1">Defects Detected: {scan.detectedDefects}</div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                 {scan.defectTypes.map(t => (
                   <Badge key={t} variant="outline" className="text-[8px] h-3.5 bg-white border-amber-200 text-amber-700 font-bold uppercase">
                     {t.replace('_', ' ')}
                   </Badge>
                 ))}
              </div>
           </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase italic">
         Computer Vision Scan v4.0.2 Active
      </div>
    </Card>
  );
};
