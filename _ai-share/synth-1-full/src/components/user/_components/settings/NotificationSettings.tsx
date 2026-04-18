'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { NotificationFrequency } from '@/lib/user-settings';

const frequencyLabels: Record<NotificationFrequency, string> = {
  instant: 'Сразу',
  daily: 'Дайджест ежедневно',
  weekly: 'Дайджест еженедельно',
  off: 'Выключено',
};

interface NotificationSettingsProps {
  draft: any;
  updateDraft: (updater: any) => void;
}

export function NotificationSettings({ draft, updateDraft }: NotificationSettingsProps) {
  const setFrequency = (v: string) =>
    updateDraft((s: any) => ({ ...s, notifications: { ...s.notifications, frequency: v } }));
  const setToggle = (key: string, v: boolean) =>
    updateDraft((s: any) => ({ ...s, notifications: { ...s.notifications, [key]: v } }));

  return (
    <div className="space-y-4">
      <div className="max-w-xs space-y-2">
        <div className="text-sm font-medium">Частота рассылок</div>
        <Select value={draft.notifications.frequency} onValueChange={setFrequency}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(frequencyLabels).map(([k, label]) => (
              <SelectItem key={k} value={k}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {[
          { key: 'email', label: 'Email уведомления', desc: 'Заказы, новости и акции' },
          { key: 'push', label: 'Push уведомления', desc: 'Всплывающие окна в браузере' },
          { key: 'telegram', label: 'Telegram Bot', desc: 'Синхронизация с ботом Syntha' },
          { key: 'sms', label: 'SMS уведомления', desc: 'Только важные обновления' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.desc}</div>
            </div>
            <Switch
              checked={draft.notifications[item.key as keyof typeof draft.notifications]}
              onCheckedChange={(v) => setToggle(item.key, v)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
