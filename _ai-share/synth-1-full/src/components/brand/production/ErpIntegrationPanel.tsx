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
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  ArrowRightLeft,
  Package,
  Landmark,
  FileSpreadsheet
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
  { type: '1c', name: '1С:ERP', connected: false, syncOrders: true, syncStocks: true, syncFinance: true },
  { type: 'sap', name: 'SAP', connected: false, syncOrders: true, syncStocks: true, syncFinance: true },
  { type: 'custom', name: 'Собственный API', connected: false, syncOrders: true, syncStocks: true, syncFinance: true }
];

export interface ErpIntegrationPanelProps {
  trigger?: React.ReactNode;
  onConnect?: (type: ErpType, config: Record<string, string>) => void;
  onFieldMapping?: () => void;
}

export function ErpIntegrationPanel({ trigger, onConnect, onFieldMapping }: ErpIntegrationPanelProps) {
  const [connections, setConnections] = useState<ErpConnection[]>(DEFAULT_ERP);
  const [selectedType, setSelectedType] = useState<ErpType | null>(null);
  const [config, setConfig] = useState<Record<string, string>>({ endpoint: '', login: '', password: '', base: '' });

  const handleSaveConnection = () => {
    if (!selectedType) return;
    setConnections((prev) =>
      prev.map((c) =>
        c.type === selectedType ? { ...c, connected: true, lastSync: new Date().toISOString().slice(0, 16).replace('T', ' ') } : c
      )
    );
    onConnect?.(selectedType, config);
    setSelectedType(null);
  };

  const handleSync = (type: ErpType) => {
    setConnections((prev) =>
      prev.map((c) =>
        c.type === type ? { ...c, lastSync: new Date().toISOString().slice(0, 16).replace('T', ' ') } : c
      )
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="sm" className="w-full h-7 text-[9px] font-bold uppercase gap-1">
            <Database className="w-3.5 h-3.5" /> ERP / 1С
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-none rounded-2xl shadow-2xl p-0 overflow-hidden bg-white">
        <DialogHeader className="p-6 bg-emerald-600 text-white">
          <DialogTitle className="text-lg font-black uppercase">Интеграция ERP / 1С</DialogTitle>
          <DialogDescription className="text-[10px] text-white/80 uppercase">
            Синхронизация заказов, остатков, финансов — маппинг полей
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-600" />
              <span className="text-[9px] font-bold uppercase">Заказы (PO)</span>
            </div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              <span className="text-[9px] font-bold uppercase">Остатки</span>
            </div>
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-indigo-600" />
              <span className="text-[9px] font-bold uppercase">Финансы</span>
            </div>
          </div>

          {connections.map((conn) => (
            <Card key={conn.type} className="border border-slate-100 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-[11px] font-black uppercase">{conn.name}</CardTitle>
                    <CardDescription className="text-[9px] mt-0.5">
                      {conn.syncOrders && 'Заказы • '}
                      {conn.syncStocks && 'Остатки • '}
                      {conn.syncFinance && 'Финансы'}
                    </CardDescription>
                  </div>
                  <Badge
                    className={cn(
                      'text-[8px] font-black uppercase',
                      conn.connected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {conn.connected ? 'Подключено' : 'Не подключено'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                {conn.connected && conn.lastSync && (
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Последняя синхронизация: {conn.lastSync}</p>
                )}
                <div className="flex gap-2 flex-wrap">
                  {conn.connected ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-[9px] font-bold uppercase gap-1"
                        onClick={() => handleSync(conn.type)}
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Синхронизация
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-[9px] font-bold uppercase gap-1"
                        onClick={onFieldMapping}
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" /> Маппинг полей
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 text-[9px] font-bold uppercase gap-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => setSelectedType(conn.type)}
                    >
                      <Database className="w-3.5 h-3.5" /> Подключить
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {selectedType && (
            <Card className="border-2 border-emerald-200 shadow-sm rounded-xl overflow-hidden bg-emerald-50/30">
              <CardHeader className="p-4">
                <CardTitle className="text-[11px] font-black uppercase">
                  Настройка {DEFAULT_ERP.find((c) => c.type === selectedType)?.name}
                </CardTitle>
                <CardDescription className="text-[9px]">REST API, логин, база</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase">Endpoint API</Label>
                  <Input
                    placeholder="https://erp.company.ru/api/..."
                    value={config.endpoint}
                    onChange={(e) => setConfig((p) => ({ ...p, endpoint: e.target.value }))}
                    className="h-9 text-[10px] rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase">Логин</Label>
                    <Input
                      value={config.login}
                      onChange={(e) => setConfig((p) => ({ ...p, login: e.target.value }))}
                      className="h-9 text-[10px] rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase">Пароль</Label>
                    <Input
                      type="password"
                      value={config.password}
                      onChange={(e) => setConfig((p) => ({ ...p, password: e.target.value }))}
                      className="h-9 text-[10px] rounded-lg"
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
                      className="h-9 text-[10px] rounded-lg"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="sm" className="h-8 text-[9px] font-bold uppercase flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveConnection}>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Сохранить
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-[9px]" onClick={() => setSelectedType(null)}>
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
