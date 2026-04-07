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
  Link as LinkIcon,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Settings,
  Upload,
  Download,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

type PlmType = 'gerber' | 'clo3d' | 'lectra';

interface PlmConnection {
  type: PlmType;
  name: string;
  connected: boolean;
  lastSync?: string;
  collections?: string;
  bomImport?: boolean;
  gradationImport?: boolean;
}

const DEFAULT_CONNECTIONS: PlmConnection[] = [
  { type: 'gerber', name: 'Gerber Accumark', connected: false, bomImport: true, gradationImport: true },
  { type: 'clo3d', name: 'CLO3D', connected: true, lastSync: '2026-03-09 14:30', collections: 'SS26, DROP-UZ', bomImport: true, gradationImport: true },
  { type: 'lectra', name: 'Lectra Modaris', connected: false, bomImport: true, gradationImport: true }
];

export interface PlmIntegrationsPanelProps {
  trigger?: React.ReactNode;
  collectionId?: string | null;
  onConnect?: (type: PlmType, config: Record<string, string>) => void;
  onImportBom?: (type: PlmType, collectionId: string) => void;
}

export function PlmIntegrationsPanel({
  trigger,
  collectionId,
  onConnect,
  onImportBom
}: PlmIntegrationsPanelProps) {
  const [connections, setConnections] = useState<PlmConnection[]>(DEFAULT_CONNECTIONS);
  const [selectedType, setSelectedType] = useState<PlmType | null>(null);
  const [config, setConfig] = useState<Record<string, string>>({ apiUrl: '', apiKey: '', workspace: '' });

  const handleConnect = (type: PlmType) => {
    setSelectedType(type);
  };

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

  const handleSync = (type: PlmType) => {
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
            <LinkIcon className="w-3.5 h-3.5" /> PLM: Gerber, CLO3D, Lectra
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-none rounded-2xl shadow-2xl p-0 overflow-hidden bg-white">
        <DialogHeader className="p-6 bg-indigo-600 text-white">
          <DialogTitle className="text-lg font-black uppercase">Интеграции PLM</DialogTitle>
          <DialogDescription className="text-[10px] text-white/80 uppercase">
            Подключение Gerber, CLO3D, Lectra — импорт BOM, градаций, синхронизация изменений
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-6">
          {connections.map((conn) => (
            <Card key={conn.type} className="border border-slate-100 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-[11px] font-black uppercase">{conn.name}</CardTitle>
                    <CardDescription className="text-[9px] mt-0.5">
                      BOM, градации, синхронизация изменений с выкройками
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
                      {collectionId && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-[9px] font-bold uppercase gap-1"
                          onClick={() => onImportBom?.(conn.type, collectionId)}
                        >
                          <Upload className="w-3.5 h-3.5" /> Импорт BOM
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 text-[9px] font-bold uppercase gap-1 bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => handleConnect(conn.type)}
                    >
                      <LinkIcon className="w-3.5 h-3.5" /> Подключить
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {selectedType && (
            <Card className="border-2 border-indigo-200 shadow-sm rounded-xl overflow-hidden bg-indigo-50/30">
              <CardHeader className="p-4">
                <CardTitle className="text-[11px] font-black uppercase">Настройка {DEFAULT_CONNECTIONS.find((c) => c.type === selectedType)?.name}</CardTitle>
                <CardDescription className="text-[9px]">API URL, ключ, workspace</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase">API URL</Label>
                  <Input
                    placeholder="https://..."
                    value={config.apiUrl}
                    onChange={(e) => setConfig((p) => ({ ...p, apiUrl: e.target.value }))}
                    className="h-9 text-[10px] rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase">API Key</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={config.apiKey}
                    onChange={(e) => setConfig((p) => ({ ...p, apiKey: e.target.value }))}
                    className="h-9 text-[10px] rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="h-8 text-[9px] font-bold uppercase flex-1" onClick={handleSaveConnection}>
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
