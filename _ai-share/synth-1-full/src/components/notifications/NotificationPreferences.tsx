'use client';

import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { DEFAULT_TRIGGERS, TriggerConfig } from '@/lib/notifications/triggers';
import { Loader2, Save } from 'lucide-react';

export function NotificationPreferences() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<TriggerConfig[]>(DEFAULT_TRIGGERS);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (id: string, channel: 'email' | 'push') => {
    setPreferences((prev) =>
      prev.map((pref) => (pref.id === id ? { ...pref, [channel]: !pref[channel] } : pref))
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: 'Настройки сохранены',
        description: 'Ваши предпочтения по уведомлениям успешно обновлены.',
      });
    }, 800);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Настройки уведомлений</CardTitle>
        <CardDescription>
          Управляйте тем, какие уведомления вы хотите получать и по каким каналам.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border-border-default text-text-secondary grid grid-cols-12 gap-4 border-b pb-2 text-sm font-medium">
            <div className="col-span-6">Событие</div>
            <div className="col-span-3 text-center">Email</div>
            <div className="col-span-3 text-center">Push (App)</div>
          </div>

          {preferences.map((pref) => (
            <div
              key={pref.id}
              className="border-border-subtle grid grid-cols-12 items-center gap-4 border-b py-2 last:border-0"
            >
              <div className="col-span-6">
                <p className="text-text-primary text-sm font-medium">{pref.label}</p>
                <p className="text-text-muted text-xs">{pref.description}</p>
              </div>
              <div className="col-span-3 flex justify-center">
                <Switch
                  checked={pref.email}
                  onCheckedChange={() => handleToggle(pref.id, 'email')}
                />
              </div>
              <div className="col-span-3 flex justify-center">
                <Switch checked={pref.push} onCheckedChange={() => handleToggle(pref.id, 'push')} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-border-default flex justify-end border-t pt-4">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Сохранить изменения
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
