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
  Link as LinkIcon,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Settings,
  Upload,
  Download,
  FileText,
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
  {
    type: 'gerber',
    name: 'Gerber Accumark',
    connected: false,
    bomImport: true,
    gradationImport: true,
  },
  {
    type: 'clo3d',
    name: 'CLO3D',
    connected: true,
    lastSync: '2026-03-09 14:30',
    collections: 'SS26, DROP-UZ',
    bomImport: true,
    gradationImport: true,
  },
  {
    type: 'lectra',
    name: 'Lectra Modaris',
    connected: false,
    bomImport: true,
    gradationImport: true,
  },
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
  onImportBom,
}: PlmIntegrationsPanelProps) {
  const [connections, setConnections] = useState<PlmConnection[]>(DEFAULT_CONNECTIONS);
  const [selectedType, setSelectedType] = useState<PlmType | null>(null);
  const [config, setConfig] = useState<Record<string, string>>({
    apiUrl: '',
    apiKey: '',
    workspace: '',
  });

  const handleConnect = (type: PlmType) => {
    setSelectedType(type);
  };

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

  const handleSync = (type: PlmType) => {
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
            <LinkIcon className="h-3.5 w-3.5" /> PLM: Gerber, CLO3D, Lectra
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="overflow-hidden rounded-2xl border-none bg-white p-0 shadow-2xl sm:max-w-[600px]">
        <DialogHeader className="bg-accent-primary p-6 text-white">
          <DialogTitle className="text-lg font-black uppercase">Интеграции PLM</DialogTitle>
          <DialogDescription className="text-[10px] uppercase text-white/80">
            Подключение Gerber, CLO3D, Lectra — импорт BOM, градаций, синхронизация изменений
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 p-6">
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
                      BOM, градации, синхронизация изменений с выкройками
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
                      {collectionId && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-[9px] font-bold uppercase"
                          onClick={() => onImportBom?.(conn.type, collectionId)}
                        >
                          <Upload className="h-3.5 w-3.5" /> Импорт BOM
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-accent-primary hover:bg-accent-primary h-8 gap-1 text-[9px] font-bold uppercase"
                      onClick={() => handleConnect(conn.type)}
                    >
                      <LinkIcon className="h-3.5 w-3.5" /> Подключить
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {selectedType && (
            <Card className="border-accent-primary/30 bg-accent-primary/10 overflow-hidden rounded-xl border-2 shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-[11px] font-black uppercase">
                  Настройка {DEFAULT_CONNECTIONS.find((c) => c.type === selectedType)?.name}
                </CardTitle>
                <CardDescription className="text-[9px]">API URL, ключ, workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase">API URL</Label>
                  <Input
                    placeholder="https://..."
                    value={config.apiUrl}
                    onChange={(e) => setConfig((p) => ({ ...p, apiUrl: e.target.value }))}
                    className="h-9 rounded-lg text-[10px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase">API Key</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={config.apiKey}
                    onChange={(e) => setConfig((p) => ({ ...p, apiKey: e.target.value }))}
                    className="h-9 rounded-lg text-[10px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-8 flex-1 text-[9px] font-bold uppercase"
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
