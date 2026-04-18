import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import {
  BarChart3,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Activity,
  BrainCircuit,
  Box,
  Link2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Widget {
  id: string;
  label: string;
  icon: any;
}

interface WidgetsPanelProps {
  activeWidgets: string[];
  allWidgets: Widget[];
  productionPhase: number;
  riskLevel: number;
  onWidgetClick: (id: string) => void;
}

export const WidgetsPanel: React.FC<WidgetsPanelProps> = ({
  activeWidgets,
  allWidgets,
  productionPhase,
  riskLevel,
  onWidgetClick,
}) => {
  if (activeWidgets.length === 0) return null;

  return (
    <div className="scrollbar-hide border-border-subtle mt-2 flex gap-3 overflow-x-auto border-t py-2">
      <div className="flex min-w-full gap-3">
        {allWidgets
          .filter((w) => activeWidgets.includes(w.id))
          .map((widget) => {
            const Icon = widget.icon;
            let content = null;
            let bgColor = 'bg-bg-surface2/30';
            let borderColor = 'border-border-subtle/50';
            let iconBg = 'bg-text-secondary';
            let onClick = () => onWidgetClick(widget.id);

            switch (widget.id) {
              case 'ai_context':
                bgColor = 'bg-accent-primary/10';
                borderColor = 'border-accent-primary/20';
                iconBg = 'bg-accent-primary';
                content = (
                  <div className="space-y-2">
                    <Badge
                      variant="outline"
                      className="border-accent-primary/20 text-accent-primary h-7 w-full justify-center bg-white py-0 text-[9px] font-black uppercase tracking-widest"
                    >
                      AI: Согласование образцов ткани SS26
                    </Badge>
                    <div className="flex items-center justify-between px-1">
                      <span className="text-text-muted text-[8px] font-bold uppercase tracking-tighter">
                        Ожидаемый дедлайн: 15 Янв
                      </span>
                      <span className="text-accent-primary text-[8px] font-black uppercase tracking-tighter">
                        Confidence: 94%
                      </span>
                    </div>
                  </div>
                );
                break;
              case 'production_timeline':
                bgColor = 'bg-blue-50/30';
                borderColor = 'border-blue-100/50';
                iconBg = 'bg-blue-600';
                content = (
                  <div className="space-y-2">
                    <div className="bg-bg-surface2 ring-border-subtle flex h-2 overflow-hidden rounded-full ring-1">
                      <div
                        className="h-full bg-blue-500 transition-all duration-1000"
                        style={{ width: `${productionPhase}%` }}
                      />
                      <div
                        className="bg-accent-primary/25 h-full animate-pulse"
                        style={{ width: '5%' }}
                      />
                    </div>
                    <p className="text-text-muted text-center text-[8px] font-bold uppercase tracking-[0.1rem]">
                      Фаза: Разработка образцов ({productionPhase}%)
                    </p>
                  </div>
                );
                break;
              case 'risk_bar':
                bgColor = 'bg-rose-50/30';
                borderColor = 'border-rose-100/50';
                iconBg = 'bg-rose-600';
                content = (
                  <div className="space-y-2">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[8px] font-black uppercase text-rose-600">
                        Риск задержки: Высокий
                      </span>
                      <span className="text-[8px] font-black uppercase text-rose-600">
                        {riskLevel}%
                      </span>
                    </div>
                    <div className="bg-bg-surface2 ring-border-subtle flex h-2 overflow-hidden rounded-full ring-1">
                      <div
                        className="h-full bg-rose-500 transition-all duration-1000"
                        style={{ width: `${riskLevel}%` }}
                      />
                    </div>
                  </div>
                );
                break;
              case 'financial_health':
                bgColor = 'bg-emerald-50/30';
                borderColor = 'border-emerald-100/50';
                iconBg = 'bg-emerald-600';
                content = (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <p className="text-text-muted text-[8px] font-bold uppercase">
                          Cash Flow Health
                        </p>
                        <p className="text-sm font-black text-emerald-600">Stable</p>
                      </div>
                      <div className="text-right">
                        <p className="text-text-muted text-[8px] font-bold uppercase">
                          Outstanding
                        </p>
                        <p className="text-text-primary text-[10px] font-black">$45,200</p>
                      </div>
                    </div>
                  </div>
                );
                break;
              case 'sku_performance':
                bgColor = 'bg-bg-surface2/30';
                borderColor = 'border-border-subtle/50';
                iconBg = 'bg-text-primary/90';
                content = (
                  <div className="space-y-2">
                    <div className="flex h-8 items-end gap-1">
                      {[30, 60, 45, 90, 75].map((h, i) => (
                        <div
                          key={i}
                          className="bg-border-subtle flex-1 rounded-t-sm"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <p className="text-text-muted text-center text-[7px] font-bold uppercase">
                      Top: SKU-FW25-COAT
                    </p>
                  </div>
                );
                break;
              case 'qc_summary':
                bgColor = 'bg-teal-50/30';
                borderColor = 'border-teal-100/50';
                iconBg = 'bg-teal-600';
                content = (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-teal-600">
                        All Passed
                      </span>
                      <CheckCircle2 className="h-3 w-3 text-teal-500" />
                    </div>
                    <p className="text-text-muted text-[7px] font-bold uppercase">
                      12 Inspections Today
                    </p>
                  </div>
                );
                break;
              case 'contract_status':
                bgColor = 'bg-blue-50/30';
                borderColor = 'border-blue-100/50';
                iconBg = 'bg-blue-900';
                content = (
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-blue-900">Signed: 8/10</p>
                    <p className="text-text-muted text-[7px] font-bold uppercase">
                      Awaiting Supplier-X
                    </p>
                  </div>
                );
                break;
              case 'order_tracking':
                bgColor = 'bg-accent-primary/10';
                borderColor = 'border-accent-primary/20';
                iconBg = 'bg-accent-primary';
                content = (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Truck className="text-accent-primary h-3 w-3" />
                      <span className="text-text-primary text-[9px] font-black uppercase">
                        In Transit
                      </span>
                    </div>
                    <div className="bg-bg-surface2 h-1 overflow-hidden rounded-full">
                      <div className="bg-accent-primary h-full" style={{ width: '65%' }} />
                    </div>
                    <p className="text-text-muted text-[7px] font-bold uppercase">
                      ETA: Jan 12, 2026
                    </p>
                  </div>
                );
                break;
              default:
                content = (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-text-muted text-[8px] font-bold uppercase italic">
                      Data processing...
                    </p>
                  </div>
                );
            }

            return (
              <div
                key={widget.id}
                onClick={onClick}
                className={cn(
                  'group min-w-[200px] cursor-pointer rounded-3xl border p-4 transition-all hover:scale-[1.02] active:scale-[0.98]',
                  bgColor,
                  borderColor
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className={cn('rounded-lg p-1.5 text-white', iconBg)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-text-muted group-hover:text-text-secondary text-[8px] font-black uppercase tracking-widest transition-colors">
                    {widget.label}
                  </span>
                </div>
                {content}
              </div>
            );
          })}
      </div>
    </div>
  );
};
