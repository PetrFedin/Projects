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
import { Separator } from '@/components/ui/separator';
import { Visibility } from '@/lib/user-settings';

const visibilityLabels: Record<Visibility, string> = {
  public: 'Публично',
  private: 'Только я',
  link: 'По ссылке',
};

interface PrivacySettingsProps {
  draft: any;
  updateDraft: (updater: any) => void;
}

export function PrivacySettings({ draft, updateDraft }: PrivacySettingsProps) {
  const setVisibility = (key: string, v: string) => {
    updateDraft((s: any) => ({ ...s, privacy: { ...s.privacy, [key]: v } }));
  };

  const setToggle = (key: string, v: boolean) => {
    updateDraft((s: any) => ({ ...s, privacy: { ...s.privacy, [key]: v } }));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {['profileVisibility', 'lookboardsVisibility', 'favoritesVisibility'].map((key) => (
          <div key={key} className="space-y-2">
            <div className="text-sm font-medium">
              {key === 'profileVisibility'
                ? 'Профиль'
                : key === 'lookboardsVisibility'
                  ? 'Лукборды'
                  : 'Избранное'}
            </div>
            <Select value={draft.privacy[key]} onValueChange={(v) => setVisibility(key, v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(visibilityLabels).map(([k, label]) => (
                  <SelectItem key={k} value={k}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <Separator />
      <div className="grid gap-3 md:grid-cols-3">
        {[
          { key: 'hideBalance', label: 'Скрывать баланс', desc: 'Баллы и бонусы' },
          { key: 'hideStats', label: 'Скрывать статистику', desc: 'Активность в профиле' },
          { key: 'hideActivity', label: 'Скрывать онлайн', desc: 'Статус нахождения в сети' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.desc}</div>
            </div>
            <Switch
              checked={draft.privacy[item.key as keyof typeof draft.privacy]}
              onCheckedChange={(v) => setToggle(item.key, v)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
