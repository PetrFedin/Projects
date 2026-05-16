'use client';

import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
      prev.map((pref) =>
        pref.id === id ? { ...pref, [channel]: !pref[channel] } : pref
      )
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
          <div className="grid grid-cols-12 gap-4 pb-2 border-b border-border-default text-sm font-medium text-text-secondary">
            <div className="col-span-6">Событие</div>
            <div className="col-span-3 text-center">Email</div>
            <div className="col-span-3 text-center">Push (App)</div>
          </div>
          
          {preferences.map((pref) => (
            <div key={pref.id} className="grid grid-cols-12 gap-4 items-center py-2 border-b border-border-subtle last:border-0">
              <div className="col-span-6">
                <p className="text-sm font-medium text-text-primary">{pref.label}</p>
                <p className="text-xs text-text-muted">{pref.description}</p>
              </div>
              <div className="col-span-3 flex justify-center">
                <Switch
                  checked={pref.email}
                  onCheckedChange={() => handleToggle(pref.id, 'email')}
                />
              </div>
              <div className="col-span-3 flex justify-center">
                <Switch
                  checked={pref.push}
                  onCheckedChange={() => handleToggle(pref.id, 'push')}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t border-border-default pt-4">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Сохранить изменения
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
