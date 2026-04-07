import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { 
  BarChart3, CheckCircle2, Truck, ShieldCheck, Activity, BrainCircuit, Box, Link2, AlertTriangle, Sparkles
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
  onWidgetClick
}) => {
  if (activeWidgets.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 border-t border-slate-50 mt-2">
      <div className="flex gap-3 min-w-full">
        {allWidgets.filter(w => activeWidgets.includes(w.id)).map(widget => {
          const Icon = widget.icon;
          let content = null;
          let bgColor = "bg-slate-50/30";
          let borderColor = "border-slate-100/50";
          let iconBg = "bg-slate-600";
          let onClick = () => onWidgetClick(widget.id);

          switch(widget.id) {
            case 'ai_context':
              bgColor = "bg-indigo-50/30"; borderColor = "border-indigo-100/50"; iconBg = "bg-indigo-600";
              content = (
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-white border-indigo-100 text-indigo-600 text-[9px] font-black uppercase tracking-widest w-full justify-center h-7 py-0">AI: Согласование образцов ткани SS26</Badge>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Ожидаемый дедлайн: 15 Янв</span>
                    <span className="text-[8px] font-black text-indigo-500 uppercase tracking-tighter">Confidence: 94%</span>
                  </div>
                </div>
              );
              break;
            case 'production_timeline':
              bgColor = "bg-blue-50/30"; borderColor = "border-blue-100/50"; iconBg = "bg-blue-600";
              content = (
                <div className="space-y-2">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex ring-1 ring-slate-100">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${productionPhase}%` }} />
                    <div className="h-full bg-indigo-200 animate-pulse" style={{ width: '5%' }} />
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.1rem] text-center">Фаза: Разработка образцов ({productionPhase}%)</p>
                </div>
              );
              break;
            case 'risk_bar':
              bgColor = "bg-rose-50/30"; borderColor = "border-rose-100/50"; iconBg = "bg-rose-600";
              content = (
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-black text-rose-600 uppercase">Риск задержки: Высокий</span>
                    <span className="text-[8px] font-black text-rose-600 uppercase">{riskLevel}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex ring-1 ring-slate-100">
                    <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${riskLevel}%` }} />
                  </div>
                </div>
              );
              break;
            case 'financial_health':
              bgColor = "bg-emerald-50/30"; borderColor = "border-emerald-100/50"; iconBg = "bg-emerald-600";
              content = (
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Cash Flow Health</p>
                      <p className="text-sm font-black text-emerald-600">Stable</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Outstanding</p>
                      <p className="text-[10px] font-black text-slate-900">$45,200</p>
                    </div>
                  </div>
                </div>
              );
              break;
            case 'sku_performance':
              bgColor = "bg-slate-50/30"; borderColor = "border-slate-100/50"; iconBg = "bg-slate-800";
              content = (
                <div className="space-y-2">
                  <div className="flex items-end gap-1 h-8">
                    {[30, 60, 45, 90, 75].map((h, i) => (
                      <div key={i} className="flex-1 bg-slate-200 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <p className="text-[7px] font-bold text-slate-400 uppercase text-center">Top: SKU-FW25-COAT</p>
                </div>
              );
              break;
            case 'qc_summary':
              bgColor = "bg-teal-50/30"; borderColor = "border-teal-100/50"; iconBg = "bg-teal-600";
              content = (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-teal-600 uppercase">All Passed</span>
                    <CheckCircle2 className="h-3 w-3 text-teal-500" />
                  </div>
                  <p className="text-[7px] font-bold text-slate-400 uppercase">12 Inspections Today</p>
                </div>
              );
              break;
            case 'contract_status':
              bgColor = "bg-blue-50/30"; borderColor = "border-blue-100/50"; iconBg = "bg-blue-900";
              content = (
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-blue-900 uppercase">Signed: 8/10</p>
                  <p className="text-[7px] font-bold text-slate-400 uppercase">Awaiting Supplier-X</p>
                </div>
              );
              break;
            case 'order_tracking':
              bgColor = "bg-indigo-50/30"; borderColor = "border-indigo-100/50"; iconBg = "bg-indigo-600";
              content = (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-3 w-3 text-indigo-600" />
                    <span className="text-[9px] font-black text-slate-800 uppercase">In Transit</span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '65%' }} />
                  </div>
                  <p className="text-[7px] font-bold text-slate-400 uppercase">ETA: Jan 12, 2026</p>
                </div>
              );
              break;
            default:
              content = (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[8px] font-bold text-slate-300 uppercase italic">Data processing...</p>
                </div>
              );
          }

          return (
            <div 
              key={widget.id}
              onClick={onClick}
              className={cn(
                "min-w-[200px] p-4 rounded-3xl border transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98]",
                bgColor, borderColor
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-1.5 rounded-lg text-white", iconBg)}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">{widget.label}</span>
              </div>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
