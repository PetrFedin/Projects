import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { ProductionOperation } from '@/lib/production/article-workspace/types';
import * as LucideIcons from 'lucide-react';

export interface Workshop2BottleneckDashboardProps {
  operations: ProductionOperation[];
  className?: string;
}

export function Workshop2BottleneckDashboard({ operations, className }: Workshop2BottleneckDashboardProps) {
  if (!operations || operations.length === 0) {
    return null;
  }

  const counts = {
    pending: 0,
    in_progress: 0,
    completed: 0
  };

  operations.forEach((op) => {
    if (op.status === 'pending') counts.pending++;
    else if (op.status === 'in_progress') counts.in_progress++;
    else if (op.status === 'completed') counts.completed++;
  });

  const data = [
    { name: 'Pending', value: counts.pending, color: '#f1f5f9', stroke: '#cbd5e1' }, // slate-100, slate-300
    { name: 'In Progress', value: counts.in_progress, color: '#fef08a', stroke: '#f59e0b' }, // yellow-200, amber-500
    { name: 'Completed', value: counts.completed, color: '#bbf7d0', stroke: '#22c55e' } // green-200, green-500
  ];

  const total = operations.length;
  const progressPct = total > 0 ? Math.round((counts.completed / total) * 100) : 0;
  
  const hasBottleneck = counts.in_progress > counts.completed && counts.in_progress > 0;

  return (
    <div className={`p-4 border border-border-default rounded-xl bg-white shadow-sm flex flex-col ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-1.5 text-text-primary">
          <LucideIcons.BarChart3 className="w-4 h-4 text-indigo-500" />
          Real-time WIP Status
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-medium text-text-muted px-2 py-1 bg-slate-50 rounded border border-border-subtle">
            {progressPct}% Done
          </span>
          {hasBottleneck && (
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 flex items-center gap-1">
              <LucideIcons.AlertTriangle className="w-3 h-3" />
              High WIP
            </span>
          )}
        </div>
      </div>
      
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#64748b' }}
              width={75}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.stroke} strokeWidth={1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
