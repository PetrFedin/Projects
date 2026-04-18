'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Bell,
  Mail,
  Smartphone,
  Settings,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  CreditCard,
  Package,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotifyTrigger =
  | 'sla_overdue'
  | 'qc_result'
  | 'po_amendment'
  | 'deadline'
  | 'payment_due'
  | 'sample_approved';

interface ChannelConfig {
  email: boolean;
  push: boolean;
}

const TRIGGERS: { id: NotifyTrigger; label: string; icon: React.ElementType }[] = [
  { id: 'sla_overdue', label: 'Просрочка SLA', icon: Clock },
  { id: 'qc_result', label: 'Результат QC', icon: ShieldCheck },
  { id: 'po_amendment', label: 'Amendment PO', icon: Package },
  { id: 'deadline', label: 'Дедлайн сэмпла / PO', icon: AlertTriangle },
  { id: 'payment_due', label: 'Платёж к дате', icon: CreditCard },
  { id: 'sample_approved', label: 'Сэмпл утверждён', icon: CheckCircle2 },
];

export interface NotificationsChannelsProps {
  onSave?: (config: Record<NotifyTrigger, ChannelConfig>) => void;
  onTestEmail?: () => void;
  onTestPush?: () => void;
}

const DEFAULT_CONFIG: Record<NotifyTrigger, ChannelConfig> = {
  sla_overdue: { email: true, push: true },
  qc_result: { email: true, push: true },
  po_amendment: { email: true, push: true },
  deadline: { email: true, push: true },
  payment_due: { email: true, push: false },
  sample_approved: { email: false, push: true },
};

export function NotificationsChannels({
  onSave,
  onTestEmail,
  onTestPush,
}: NotificationsChannelsProps) {
  const [config, setConfig] = useState<Record<NotifyTrigger, ChannelConfig>>(DEFAULT_CONFIG);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  const handleChannelChange = (
    trigger: NotifyTrigger,
    channel: 'email' | 'push',
    value: boolean
  ) => {
    setConfig((prev) => ({
      ...prev,
      [trigger]: { ...prev[trigger], [channel]: value },
    }));
  };

  const handleSave = () => {
    onSave?.(config);
  };

  return (
<<<<<<< HEAD
    <Card className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-4">
=======
    <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
      <CardHeader className="border-border-subtle bg-bg-surface2/30 border-b p-4">
>>>>>>> recover/cabinet-wip-from-stash
        <CardTitle className="text-[11px] font-black uppercase">Email и Push-уведомления</CardTitle>
        <CardDescription className="text-[9px]">
          Настройка каналов: SLA, QC, PO amendments, дедлайны — настраиваемые триггеры
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
<<<<<<< HEAD
            <Mail className="h-4 w-4 text-slate-500" />
=======
            <Mail className="text-text-secondary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
            <Label className="text-[10px] font-bold uppercase">Email</Label>
            <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            {emailEnabled && (
              <Button variant="ghost" size="sm" className="h-6 text-[9px]" onClick={onTestEmail}>
                Тест
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
<<<<<<< HEAD
            <Smartphone className="h-4 w-4 text-slate-500" />
=======
            <Smartphone className="text-text-secondary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
            <Label className="text-[10px] font-bold uppercase">Push</Label>
            <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
            {pushEnabled && (
              <Button variant="ghost" size="sm" className="h-6 text-[9px]" onClick={onTestPush}>
                Тест
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
<<<<<<< HEAD
          <p className="text-[9px] font-black uppercase text-slate-500">
=======
          <p className="text-text-secondary text-[9px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
            Триггеры по типам событий
          </p>
          <div className="space-y-2">
            {TRIGGERS.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.id}
<<<<<<< HEAD
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-indigo-500" />
=======
                  className="border-border-subtle bg-bg-surface2/80 hover:bg-bg-surface2 flex items-center justify-between rounded-xl border p-3 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="text-accent-primary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                    <span className="text-[10px] font-bold">{t.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
<<<<<<< HEAD
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
=======
                      <Mail className="text-text-muted h-3.5 w-3.5" />
>>>>>>> recover/cabinet-wip-from-stash
                      <Switch
                        checked={config[t.id].email}
                        onCheckedChange={(v) => handleChannelChange(t.id, 'email', v)}
                        disabled={!emailEnabled}
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
<<<<<<< HEAD
                      <Smartphone className="h-3.5 w-3.5 text-slate-400" />
=======
                      <Smartphone className="text-text-muted h-3.5 w-3.5" />
>>>>>>> recover/cabinet-wip-from-stash
                      <Switch
                        checked={config[t.id].push}
                        onCheckedChange={(v) => handleChannelChange(t.id, 'push', v)}
                        disabled={!pushEnabled}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Button
          size="sm"
          className="h-9 w-full text-[10px] font-bold uppercase"
          onClick={handleSave}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" /> Сохранить настройки
        </Button>
      </CardContent>
    </Card>
  );
}
