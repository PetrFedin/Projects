'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  ArrowRightLeft,
  Package,
  Landmark,
  FileSpreadsheet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ErpType = '1c' | 'sap' | 'custom';

interface ErpConnection {
  type: ErpType;
  name: string;
  connected: boolean;
  lastSync?: string;
  syncOrders?: boolean;
  syncStocks?: boolean;
  syncFinance?: boolean;
}

const DEFAULT_ERP: ErpConnection[] = [
  {
    type: '1c',
    name: '1С:ERP',
    connected: false,
    syncOrders: true,
    syncStocks: true,
    syncFinance: true,
  },
  {
    type: 'sap',
    name: 'SAP',
    connected: false,
    syncOrders: true,
    syncStocks: true,
    syncFinance: true,
  },
  {
    type: 'custom',
    name: 'Собственный API',
    connected: false,
    syncOrders: true,
    syncStocks: true,
    syncFinance: true,
  },
];

export interface ErpIntegrationPanelProps {
  trigger?: React.ReactNode;
  onConnect?: (type: ErpType, config: Record<string, string>) => void;
  onFieldMapping?: () => void;
}

export function ErpIntegrationPanel({
  trigger,
  onConnect,
  onFieldMapping,
}: ErpIntegrationPanelProps) {
  const [connections, setConnections] = useState<ErpConnection[]>(DEFAULT_ERP);
  const [selectedType, setSelectedType] = useState<ErpType | null>(null);
  const [config, setConfig] = useState<Record<string, string>>({
    endpoint: '',
    login: '',
    password: '',
    base: '',
  });

  const handleSaveConnection = () => {
    if (!selectedType) return;
    setConnections((prev) =>
      prev.map((c) =>
        c.type === selectedType
          ? {
              ...c,
              connected: true,
              lastSync: new Date().toISOString().slice(0, 16).replace('T', ' '),
            }
          : c
      )
    );
    onConnect?.(selectedType, config);
    setSelectedType(null);
  };

  const handleSync = (type: ErpType) => {
    setConnections((prev) =>
      prev.map((c) =>
        c.type === type
          ? { ...c, lastSync: new Date().toISOString().slice(0, 16).replace('T', ' ') }
          : c
      )
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-full gap-1 text-[9px] font-bold uppercase"
          >
            <Database className="h-3.5 w-3.5" /> ERP / 1С
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="overflow-hidden rounded-2xl border-none bg-white p-0 shadow-2xl sm:max-w-[600px]">
        <DialogHeader className="bg-emerald-600 p-6 text-white">
          <DialogTitle className="text-lg font-black uppercase">Интеграция ERP / 1С</DialogTitle>
          <DialogDescription className="text-[10px] uppercase text-white/80">
            Синхронизация заказов, остатков, финансов — маппинг полей
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 p-6">
          <div className="bg-bg-surface2 border-border-subtle grid grid-cols-3 gap-2 rounded-xl border p-3">
            <div className="flex items-center gap-2">
              <Package className="text-accent-primary h-4 w-4" />
              <span className="text-[9px] font-bold uppercase">Заказы (PO)</span>
            </div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="text-accent-primary h-4 w-4" />
              <span className="text-[9px] font-bold uppercase">Остатки</span>
            </div>
            <div className="flex items-center gap-2">
              <Landmark className="text-accent-primary h-4 w-4" />
              <span className="text-[9px] font-bold uppercase">Финансы</span>
            </div>
          </div>

          {connections.map((conn) => (
            <Card
              key={conn.type}
              className="border-border-subtle overflow-hidden rounded-xl border shadow-sm"
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-[11px] font-black uppercase">{conn.name}</CardTitle>
                    <CardDescription className="mt-0.5 text-[9px]">
                      {conn.syncOrders && 'Заказы • '}
                      {conn.syncStocks && 'Остатки • '}
                      {conn.syncFinance && 'Финансы'}
                    </CardDescription>
                  </div>
                  <Badge
                    className={cn(
                      'text-[8px] font-black uppercase',
                      conn.connected
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-bg-surface2 text-text-secondary'
                    )}
                  >
                    {conn.connected ? 'Подключено' : 'Не подключено'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 p-4 pt-0">
                {conn.connected && conn.lastSync && (
                  <p className="text-text-secondary text-[9px] font-bold uppercase">
                    Последняя синхронизация: {conn.lastSync}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {conn.connected ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-[9px] font-bold uppercase"
                        onClick={() => handleSync(conn.type)}
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Синхронизация
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-[9px] font-bold uppercase"
                        onClick={onFieldMapping}
                      >
                        <ArrowRightLeft className="h-3.5 w-3.5" /> Маппинг полей
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 gap-1 bg-emerald-600 text-[9px] font-bold uppercase hover:bg-emerald-700"
                      onClick={() => setSelectedType(conn.type)}
                    >
                      <Database className="h-3.5 w-3.5" /> Подключить
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {selectedType && (
            <Card className="overflow-hidden rounded-xl border-2 border-emerald-200 bg-emerald-50/30 shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-[11px] font-black uppercase">
                  Настройка {DEFAULT_ERP.find((c) => c.type === selectedType)?.name}
                </CardTitle>
                <CardDescription className="text-[9px]">REST API, логин, база</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase">Endpoint API</Label>
                  <Input
                    placeholder="https://erp.company.ru/api/..."
                    value={config.endpoint}
                    onChange={(e) => setConfig((p) => ({ ...p, endpoint: e.target.value }))}
                    className="h-9 rounded-lg text-[10px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase">Логин</Label>
                    <Input
                      value={config.login}
                      onChange={(e) => setConfig((p) => ({ ...p, login: e.target.value }))}
                      className="h-9 rounded-lg text-[10px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase">Пароль</Label>
                    <Input
                      type="password"
                      value={config.password}
                      onChange={(e) => setConfig((p) => ({ ...p, password: e.target.value }))}
                      className="h-9 rounded-lg text-[10px]"
                    />
                  </div>
                </div>
                {selectedType === '1c' && (
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase">База 1С</Label>
                    <Input
                      placeholder="БазаПроизводство"
                      value={config.base}
                      onChange={(e) => setConfig((p) => ({ ...p, base: e.target.value }))}
                      className="h-9 rounded-lg text-[10px]"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-8 flex-1 bg-emerald-600 text-[9px] font-bold uppercase hover:bg-emerald-700"
                    onClick={handleSaveConnection}
                  >
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Сохранить
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-[9px]"
                    onClick={() => setSelectedType(null)}
                  >
                    Отмена
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
