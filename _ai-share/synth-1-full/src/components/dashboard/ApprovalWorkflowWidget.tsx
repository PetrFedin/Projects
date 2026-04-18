'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, XCircle, Clock, AlertCircle, User, DollarSign } from 'lucide-react';
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
          approvedAt: '2026-02-17 10:30',
        },
        {
          role: 'Merchandiser',
          status: 'approved',
          approver: 'Elena Volkova',
          approvedAt: '2026-02-17 14:15',
        },
        {
          role: 'Finance',
          status: 'pending',
          approver: 'Maria Ivanova',
          comment: 'Checking budget availability...',
        },
      ],
    },
  ];

  if (workflows.length === 0) return null;

  return (
    <Card className="rounded-xl border-2 border-blue-100 shadow-xl">
<<<<<<< HEAD
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-cyan-50">
=======
      <CardHeader className="border-border-subtle border-b bg-gradient-to-r from-blue-50 to-cyan-50">
>>>>>>> recover/cabinet-wip-from-stash
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-text-primary text-sm font-black uppercase tracking-tight">
              Approval Workflows
            </CardTitle>
<<<<<<< HEAD
            <p className="text-[10px] font-medium text-slate-500">
=======
            <p className="text-text-secondary text-[10px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
              {workflows.length} orders pending approval
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {workflows.map((workflow) => (
          <div
            key={workflow.orderId}
            className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
<<<<<<< HEAD
                <h4 className="text-sm font-black uppercase leading-tight text-slate-900">
                  {workflow.orderId}
                </h4>
                <p className="mt-1 text-[10px] text-slate-600">{workflow.brand}</p>
=======
                <h4 className="text-text-primary text-sm font-black uppercase leading-tight">
                  {workflow.orderId}
                </h4>
                <p className="text-text-secondary mt-1 text-[10px]">{workflow.brand}</p>
>>>>>>> recover/cabinet-wip-from-stash
              </div>

              <div className="text-right">
                <p className="text-sm font-black tabular-nums text-blue-900">
                  {workflow.amount.toLocaleString('ru-RU')} ₽
                </p>
                <Badge className="mt-1 bg-amber-600 text-[7px] font-black uppercase text-white">
                  Step {workflow.currentStep}/{workflow.totalSteps}
                </Badge>
              </div>
            </div>

            {/* Approval Steps */}
            <div className="mb-4 space-y-2">
              {workflow.steps.map((step, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-3 rounded-lg p-3',
                    step.status === 'approved'
                      ? 'border-2 border-emerald-200 bg-emerald-50'
                      : step.status === 'pending'
                        ? 'border-2 border-amber-200 bg-amber-50'
                        : 'border-2 border-rose-200 bg-rose-50'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                      step.status === 'approved'
                        ? 'bg-emerald-600 text-white'
                        : step.status === 'pending'
                          ? 'bg-amber-600 text-white'
                          : 'bg-rose-600 text-white'
                    )}
                  >
                    {step.status === 'approved' && <CheckCircle className="h-4 w-4" />}
                    {step.status === 'pending' && <Clock className="h-4 w-4" />}
                    {step.status === 'rejected' && <XCircle className="h-4 w-4" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
<<<<<<< HEAD
                      <p className="text-[10px] font-black uppercase text-slate-900">{step.role}</p>
=======
                      <p className="text-text-primary text-[10px] font-black uppercase">
                        {step.role}
                      </p>
>>>>>>> recover/cabinet-wip-from-stash
                      <Badge
                        className={cn(
                          'border-none text-[7px] font-black uppercase',
                          step.status === 'approved'
                            ? 'bg-emerald-600 text-white'
                            : step.status === 'pending'
                              ? 'bg-amber-600 text-white'
                              : 'bg-rose-600 text-white'
                        )}
                      >
                        {step.status}
                      </Badge>
                    </div>

                    {step.approver && (
                      <p className="text-text-secondary text-[9px]">
                        {step.status === 'approved' ? 'Approved by' : 'Assigned to'} {step.approver}
                        {step.approvedAt && ` • ${step.approvedAt}`}
                      </p>
                    )}

                    {step.comment && (
<<<<<<< HEAD
                      <p className="mt-1 text-[9px] italic text-slate-500">"{step.comment}"</p>
=======
                      <p className="text-text-secondary mt-1 text-[9px] italic">"{step.comment}"</p>
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  </div>
                </div>
              ))}
            </div>

            {workflow.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-9 flex-1 bg-emerald-600 text-[8px] font-black uppercase hover:bg-emerald-700"
                >
                  <CheckCircle className="mr-2 h-3 w-3" />
                  Approve Order
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 flex-1 border-rose-300 text-[8px] font-black uppercase text-rose-700 hover:bg-rose-50"
                >
                  <XCircle className="mr-2 h-3 w-3" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}

        <div className="rounded-lg border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 text-center">
          <p className="text-[10px] font-medium text-blue-900">
            💡 Orders <strong>&gt;500K ₽</strong> require Finance approval
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
