'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  User,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApprovalWorkflow {
  orderId: string;
  brand: string;
  amount: number;
  currentStep: number;
  totalSteps: number;
  status: 'pending' | 'approved' | 'rejected';
  steps: Array<{
    role: string;
    status: 'approved' | 'pending' | 'rejected';
    approver?: string;
    approvedAt?: string;
    comment?: string;
  }>;
}

export function ApprovalWorkflowWidget() {
  const workflows: ApprovalWorkflow[] = [
    {
      orderId: 'ORD-8821',
      brand: 'Nordic Wool FW26',
      amount: 420000,
      currentStep: 2,
      totalSteps: 3,
      status: 'pending',
      steps: [
        {
          role: 'Buyer',
          status: 'approved',
          approver: 'Ivan Kozlov',
          approvedAt: '2026-02-17 10:30'
        },
        {
          role: 'Merchandiser',
          status: 'approved',
          approver: 'Elena Volkova',
          approvedAt: '2026-02-17 14:15'
        },
        {
          role: 'Finance',
          status: 'pending',
          approver: 'Maria Ivanova',
          comment: 'Checking budget availability...'
        }
      ]
    }
  ];
  
  if (workflows.length === 0) return null;
  
  return (
    <Card className="border-2 border-blue-100 shadow-xl rounded-xl">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">
              Approval Workflows
            </CardTitle>
            <p className="text-[10px] text-slate-500 font-medium">
              {workflows.length} orders pending approval
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {workflows.map((workflow) => (
          <div
            key={workflow.orderId}
            className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-sm font-black uppercase text-slate-900 leading-tight">
                  {workflow.orderId}
                </h4>
                <p className="text-[10px] text-slate-600 mt-1">
                  {workflow.brand}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-black text-blue-900 tabular-nums">
                  {workflow.amount.toLocaleString('ru-RU')} ₽
                </p>
                <Badge className="bg-amber-600 text-white text-[7px] font-black uppercase mt-1">
                  Step {workflow.currentStep}/{workflow.totalSteps}
                </Badge>
              </div>
            </div>
            
            {/* Approval Steps */}
            <div className="space-y-2 mb-4">
              {workflow.steps.map((step, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    step.status === 'approved' ? 'bg-emerald-50 border-2 border-emerald-200' :
                    step.status === 'pending' ? 'bg-amber-50 border-2 border-amber-200' :
                    'bg-rose-50 border-2 border-rose-200'
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                    step.status === 'approved' ? 'bg-emerald-600 text-white' :
                    step.status === 'pending' ? 'bg-amber-600 text-white' :
                    'bg-rose-600 text-white'
                  )}>
                    {step.status === 'approved' && <CheckCircle className="h-4 w-4" />}
                    {step.status === 'pending' && <Clock className="h-4 w-4" />}
                    {step.status === 'rejected' && <XCircle className="h-4 w-4" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[10px] font-black uppercase text-slate-900">
                        {step.role}
                      </p>
                      <Badge className={cn(
                        "text-[7px] font-black uppercase border-none",
                        step.status === 'approved' ? 'bg-emerald-600 text-white' :
                        step.status === 'pending' ? 'bg-amber-600 text-white' :
                        'bg-rose-600 text-white'
                      )}>
                        {step.status}
                      </Badge>
                    </div>
                    
                    {step.approver && (
                      <p className="text-[9px] text-slate-600">
                        {step.status === 'approved' ? 'Approved by' : 'Assigned to'} {step.approver}
                        {step.approvedAt && ` • ${step.approvedAt}`}
                      </p>
                    )}
                    
                    {step.comment && (
                      <p className="text-[9px] text-slate-500 italic mt-1">
                        "{step.comment}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {workflow.status === 'pending' && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 h-9 text-[8px] font-black uppercase bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="mr-2 h-3 w-3" />
                  Approve Order
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1 h-9 text-[8px] font-black uppercase border-rose-300 text-rose-700 hover:bg-rose-50"
                >
                  <XCircle className="mr-2 h-3 w-3" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}
        
        <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-100 text-center">
          <p className="text-[10px] font-medium text-blue-900">
            💡 Orders <strong>&gt;500K ₽</strong> require Finance approval
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
