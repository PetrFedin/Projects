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
    pass: 'text-green-600 bg-green-50 border-green-200',
    rework: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    quarantine: 'text-red-600 bg-red-50 border-red-200',
  };

  return (
    <Card className="relative overflow-hidden border-2 border-slate-100 bg-slate-50/20 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-5">
        <Microscope className="h-16 w-16 text-slate-400" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Microscope className="h-4 w-4 text-slate-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-slate-700">
            AI Quality Control Scan
          </h4>
        </div>
        <Badge
          variant="outline"
          className={`text-[10px] font-black uppercase ${statusColors[scan.actionRequired]}`}
        >
          {scan.actionRequired === 'pass' ? (
            <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
          ) : (
            <ShieldAlert className="mr-1 h-2.5 w-2.5" />
          )}
          {scan.actionRequired}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-black text-slate-800">{scan.passRate}%</div>
          <div className="text-[10px] font-black uppercase leading-none text-slate-400">
            Pass Rate
          </div>
        </div>
        <div>
          <div className="mt-1 text-sm font-bold text-slate-600">{scan.batchId}</div>
          <div className="text-[10px] font-black uppercase leading-none text-slate-400">
            Active Batch
          </div>
        </div>
      </div>

      {scan.detectedDefects > 0 && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-100 bg-amber-50 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <div className="mb-1 text-[10px] font-black uppercase leading-none text-amber-700">
              Defects Detected: {scan.detectedDefects}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {scan.defectTypes.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="h-3.5 border-amber-200 bg-white text-[8px] font-bold uppercase text-amber-700"
                >
                  {t.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[9px] font-bold uppercase italic text-slate-400">
        Computer Vision Scan v4.0.2 Active
      </div>
    </Card>
  );
};
