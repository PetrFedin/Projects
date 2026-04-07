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
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotifyTrigger = 'sla_overdue' | 'qc_result' | 'po_amendment' | 'deadline' | 'payment_due' | 'sample_approved';

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
  { id: 'sample_approved', label: 'Сэмпл утверждён', icon: CheckCircle2 }
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
  sample_approved: { email: false, push: true }
};

export function NotificationsChannels({ onSave, onTestEmail, onTestPush }: NotificationsChannelsProps) {
  const [config, setConfig] = useState<Record<NotifyTrigger, ChannelConfig>>(DEFAULT_CONFIG);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  const handleChannelChange = (trigger: NotifyTrigger, channel: 'email' | 'push', value: boolean) => {
    setConfig((prev) => ({
      ...prev,
      [trigger]: { ...prev[trigger], [channel]: value }
    }));
  };

  const handleSave = () => {
    onSave?.(config);
  };

  return (
    <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/30">
        <CardTitle className="text-[11px] font-black uppercase">Email и Push-уведомления</CardTitle>
        <CardDescription className="text-[9px]">
          Настройка каналов: SLA, QC, PO amendments, дедлайны — настраиваемые триггеры
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-500" />
            <Label className="text-[10px] font-bold uppercase">Email</Label>
            <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            {emailEnabled && (
              <Button variant="ghost" size="sm" className="h-6 text-[9px]" onClick={onTestEmail}>
                Тест
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-slate-500" />
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
          <p className="text-[9px] font-black uppercase text-slate-500">Триггеры по типам событий</p>
          <div className="space-y-2">
            {TRIGGERS.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-indigo-500" />
                    <span className="text-[10px] font-bold">{t.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <Switch
                        checked={config[t.id].email}
                        onCheckedChange={(v) => handleChannelChange(t.id, 'email', v)}
                        disabled={!emailEnabled}
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
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

        <Button size="sm" className="w-full h-9 text-[10px] font-bold uppercase" onClick={handleSave}>
          <CheckCircle2 className="w-4 h-4 mr-2" /> Сохранить настройки
        </Button>
      </CardContent>
    </Card>
  );
}
