'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPlmProviderLabel } from '@/lib/production/plm-integration';
import { getErpProviderLabel } from '@/lib/production/erp-integration';
import { DEFAULT_TRIGGERS } from '@/lib/notifications/triggers';
import { Database, PenTool, Landmark, Bell, Upload, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

const PLM_PROVIDERS = ['gerber', 'clo3d', 'lectra'] as const;
const ERP_PROVIDERS = ['1c', 'moysklad', 'sap'] as const;

export function ProductionIntegrationsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { toast } = useToast();
  const [plmActive, setPlmActive] = useState<string | null>('gerber');
  const [erpActive, setErpActive] = useState<string | null>('1c');
  const [triggers, setTriggers] = useState(DEFAULT_TRIGGERS);
  const [plmImporting, setPlmImporting] = useState(false);
  const [erpSyncing, setErpSyncing] = useState(false);

  const handlePlmImport = async () => {
    setPlmImporting(true);
    try {
      const r = await fetch('/api/production/plm/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: plmActive ?? 'gerber',
          rawXml: '<component id="F-001" name="Fabric" quantity="1.2" unit="м"/>',
        }),
      });
      const d = (await r.json()) as {
        success?: boolean;
        bomItems?: unknown[];
        errors?: string[];
      };
      if (d.success)
        toast({ title: 'PLM импорт', description: `BOM: ${d.bomItems?.length ?? 0} позиций` });
      else toast({ title: 'Ошибка', description: d.errors?.[0], variant: 'destructive' });
    } finally {
      setPlmImporting(false);
    }
  };

  const handleErpSync = async () => {
    setErpSyncing(true);
    try {
      const r = await fetch('/api/production/erp/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: erpActive ?? '1c', scope: 'all' }),
      });
      const d = (await r.json()) as { success?: boolean; errors?: string[] };
      if (d.success) toast({ title: 'ERP синхронизация', description: 'Готово' });
      else toast({ title: 'Ошибка', description: d.errors?.[0], variant: 'destructive' });
    } finally {
      setErpSyncing(false);
    }
  };

  const toggleTrigger = (id: string, channel: 'email' | 'push') => {
    setTriggers((prev) => prev.map((t) => (t.id === id ? { ...t, [channel]: !t[channel] } : t)));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-black uppercase tracking-tighter">
            Интеграции
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="plm">
          {/* cabinetSurface v1 */}
          <TabsList className={cn(cabinetSurface.tabsList, 'h-auto min-w-0')}>
            <TabsTrigger
              value="plm"
              className={cn(
                cabinetSurface.tabsTrigger,
                'text-xs font-semibold normal-case tracking-normal'
              )}
            >
              PLM
            </TabsTrigger>
            <TabsTrigger
              value="erp"
              className={cn(
                cabinetSurface.tabsTrigger,
                'text-xs font-semibold normal-case tracking-normal'
              )}
            >
              ERP / 1С
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className={cn(
                cabinetSurface.tabsTrigger,
                'text-xs font-semibold normal-case tracking-normal'
              )}
            >
              Уведомления
            </TabsTrigger>
          </TabsList>
          <TabsContent value="plm" className={cn(cabinetSurface.cabinetProfileTabPanel, 'pt-4')}>
            <p className="text-text-secondary text-[10px] font-bold uppercase">
              Gerber, CLO3D, Lectra — импорт BOM, градаций
            </p>
            <div className="flex flex-wrap gap-2">
              {PLM_PROVIDERS.map((p) => (
                <Badge
                  key={p}
                  variant={plmActive === p ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setPlmActive(p)}
                >
                  {getPlmProviderLabel(p)}
                </Badge>
              ))}
            </div>
            <Button onClick={handlePlmImport} disabled={plmImporting} className="gap-2">
              <Upload className="h-4 w-4" /> Импорт BOM
            </Button>
          </TabsContent>
          <TabsContent value="erp" className={cn(cabinetSurface.cabinetProfileTabPanel, 'pt-4')}>
            <p className="text-text-secondary text-[10px] font-bold uppercase">
              1С, МойСклад, SAP — заказы, остатки, финансы
            </p>
            <div className="flex flex-wrap gap-2">
              {ERP_PROVIDERS.map((p) => (
                <Badge
                  key={p}
                  variant={erpActive === p ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setErpActive(p)}
                >
                  {getErpProviderLabel(p)}
                </Badge>
              ))}
            </div>
            <Button onClick={handleErpSync} disabled={erpSyncing} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Синхронизация
            </Button>
          </TabsContent>
          <TabsContent value="notifications" className={cn(cabinetSurface.cabinetProfileTabPanel, 'pt-4')}>
            <p className="text-text-secondary text-[10px] font-bold uppercase">
              Email и Push — триггеры
            </p>
            <div className="space-y-3">
              {triggers.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-bold">{t.label}</p>
                    <p className="text-text-secondary text-[10px]">{t.description}</p>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex cursor-pointer items-center gap-2 text-[10px]">
                      <input
                        type="checkbox"
                        checked={t.email}
                        onChange={() => toggleTrigger(t.id, 'email')}
                      />
                      Email
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-[10px]">
                      <input
                        type="checkbox"
                        checked={t.push}
                        onChange={() => toggleTrigger(t.id, 'push')}
                      />
                      Push
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={() => {
                toast({ title: 'Сохранено', description: 'Триггеры обновлены' });
                onOpenChange(false);
              }}
            >
              Сохранить
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
