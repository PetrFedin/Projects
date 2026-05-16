'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Key, Link as LinkIcon, CheckCircle2, Activity, Terminal, ArrowRightLeft, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2FactoryERPIntegrationPanelProps = {
  articleId: string;
  dossier?: Workshop2DossierPhase1 | null;
};

export function Workshop2FactoryERPIntegrationPanel({
  articleId,
}: Workshop2FactoryERPIntegrationPanelProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>('sk_live_9x8f7d6e5c4b3a2');
  const [webhookUrl, setWebhookUrl] = useState('https://erp.factory.com/api/webhooks/techpack');
  const [notifyOnUpdate, setNotifyOnUpdate] = useState(true);
  const [notifyOnApproval, setNotifyOnApproval] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>('Недавно');
  
  const [pingStatus, setPingStatus] = useState<'idle' | 'pinging' | 'success' | 'error'>('idle');
  
  const [mappings, setMappings] = useState([
    { id: 1, plmField: 'article_id', erpField: 'StyleNumber' },
    { id: 2, plmField: 'color_code', erpField: 'ColorCode' },
    { id: 3, plmField: 'bom_total_cost', erpField: 'EstCost' },
  ]);

  const { dataMode } = useArticleWorkspace();

  const handleGenerateApiKey = async () => {
    setLoading(true);
    setTimeout(() => {
      const newKey = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      setApiKey(newKey);
      setLoading(false);
      toast({
        title: 'API-ключ сгенерирован',
        description: 'Новый API-ключ был успешно сгенерирован для данной фабрики.',
      });
    }, 800);
  };

  const handleSaveWebhooks = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Вебхуки сохранены',
        description: 'Настройки вебхуков были успешно сохранены.',
      });
    }, 600);
  };

  const handleManualSync = async () => {
    setLoading(true);
    setTimeout(() => {
      setLastSync(new Date().toLocaleString());
      setLoading(false);
      toast({
        title: 'Синхронизация запущена',
        description: 'Синхронизация с ERP была успешно запущена.',
      });
    }, 1000);
  };

  const handlePing = () => {
    setPingStatus('pinging');
    setTimeout(() => {
      setPingStatus(Math.random() > 0.2 ? 'success' : 'error');
      setTimeout(() => setPingStatus('idle'), 5000);
    }, 1500);
  };

  const addMapping = () => {
    setMappings([...mappings, { id: Date.now(), plmField: '', erpField: '' }]);
  };

  const removeMapping = (id: number) => {
    setMappings(mappings.filter(m => m.id !== id));
  };

  return (
    <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <LinkIcon className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-text-primary text-base font-semibold">Интеграция с ERP Фабрики (API)</h2>
              <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-medium">
                Ответственный: IT / Производство
              </span>
            </div>
            <p className="text-text-secondary text-xs leading-snug">
              Настройка автоматической синхронизации данных (ТЗ, BOM, лекала) с информационной системой производственной площадки.
            </p>
          </div>
        </div>
        <span
          className="border-border-default bg-bg-surface2 text-text-secondary shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px]"
        >
          {dataMode === 'http' ? 'API' : 'local'}
        </span>
      </div>

      <div className="border-border-subtle flex flex-col gap-1.5 border-t border-dotted pt-2.5 mt-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="bg-bg-surface2/70 text-text-primary max-w-full rounded border border-border-subtle px-2 py-1 text-[10px] leading-snug">
            <span className="text-text-muted font-bold">Суть</span> · Синхронизация данных
          </span>
          <span className="text-text-primary max-w-full rounded border border-border-subtle bg-white px-2 py-1 text-[10px] font-semibold leading-snug">
            <span className="text-text-muted font-bold">Гот.</span> · Подключено
          </span>
          {lastSync && (
            <span className="text-text-muted ml-auto text-[10px]">Последняя синхронизация: {lastSync}</span>
          )}
        </div>
      </div>

      <div className="min-w-0 space-y-4 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x border border-border-subtle rounded-lg">
          
          {/* Left Column: API & Webhooks */}
          <div className="lg:col-span-5 p-6 space-y-8">
            {/* API Key Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-slate-500" />
                API-аутентификация
              </h4>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    readOnly
                    value={apiKey || ''}
                    placeholder="API-ключ еще не сгенерирован"
                    className="font-mono text-sm bg-slate-50 border-slate-200"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGenerateApiKey} 
                  disabled={loading}
                  className="w-full"
                >
                  {apiKey ? 'Сгенерировать новый ключ' : 'Сгенерировать ключ'}
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Используйте этот ключ для аутентификации запросов от ERP-системы фабрики для выгрузки спецификаций (BOM) и ТЗ.
              </p>
            </div>

            {/* Webhooks Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-slate-500" />
                  Настройки Webhook
                </h4>
                
                {/* Ping Status */}
                <div className="flex items-center gap-2">
                  {pingStatus === 'idle' && (
                    <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={handlePing}>
                      Пинг сервера
                    </Button>
                  )}
                  {pingStatus === 'pinging' && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                      <Activity className="w-3 h-3 mr-1 animate-pulse" /> Выполняется пинг...
                    </Badge>
                  )}
                  {pingStatus === 'success' && (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></div> 200 OK
                    </Badge>
                  )}
                  {pingStatus === 'error' && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[10px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></div> 500 Ошибка
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="webhook-url" className="text-xs">Целевой URL</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://erp.factory.com/api/webhooks/techpack"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-2 pt-2 bg-slate-50 p-3 rounded-md border">
                  <Label className="text-xs font-semibold tracking-wider text-slate-500">События для отправки</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="notify-update" 
                      checked={notifyOnUpdate}
                      onCheckedChange={(checked) => setNotifyOnUpdate(checked as boolean)}
                    />
                    <label htmlFor="notify-update" className="text-sm font-medium leading-none cursor-pointer">
                      techpack.updated
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="notify-approval" 
                      checked={notifyOnApproval}
                      onCheckedChange={(checked) => setNotifyOnApproval(checked as boolean)}
                    />
                    <label htmlFor="notify-approval" className="text-sm font-medium leading-none cursor-pointer">
                      techpack.approved
                    </label>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleSaveWebhooks} 
                  disabled={loading || !webhookUrl}
                >
                  Сохранить настройки Webhook
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Payload Mapping (DevOps Style) */}
          <div className="lg:col-span-7 bg-slate-950 text-slate-300 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                Настройка полей для экспорта (Mapping)
              </h4>
              <Button variant="outline" size="sm" onClick={addMapping} className="h-7 text-xs bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white">
                <Plus className="w-3 h-3 mr-1" /> Добавить поле
              </Button>
            </div>

            <div className="space-y-3 flex-1">
              <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 tracking-wider mb-2 px-1">
                <div className="col-span-5">Поле Syntha PLM</div>
                <div className="col-span-2 text-center"></div>
                <div className="col-span-4">Поле ERP фабрики</div>
                <div className="col-span-1"></div>
              </div>
              
              {mappings.map((mapping, index) => (
                <div key={mapping.id} className="grid grid-cols-12 gap-2 items-center group">
                  <div className="col-span-5">
                    <Select defaultValue={mapping.plmField}>
                      <SelectTrigger className="h-8 bg-slate-900 border-slate-800 text-slate-300 text-xs font-mono">
                        <SelectValue placeholder="Выберите поле PLM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article_id">article_id</SelectItem>
                        <SelectItem value="color_code">color_code</SelectItem>
                        <SelectItem value="bom_total_cost">bom_total_cost</SelectItem>
                        <SelectItem value="season">season</SelectItem>
                        <SelectItem value="target_fob">target_fob</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 flex justify-center text-slate-600">
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                  <div className="col-span-4">
                    <Input 
                      defaultValue={mapping.erpField}
                      placeholder="Название поля ERP"
                      className="h-8 bg-slate-900 border-slate-800 text-green-400 text-xs font-mono placeholder:text-slate-700"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeMapping(mapping.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-slate-900 rounded-md p-4 border border-slate-800">
              <div className="text-xs font-semibold text-slate-500 mb-2 tracking-wider">Превью нагрузки (Payload Preview)</div>
              <pre className="text-[11px] font-mono text-blue-300 overflow-x-auto">
{`{
  "event": "techpack.updated",
  "timestamp": "2026-05-14T12:00:00.000Z",
  "data": {
    "StyleNumber": "ART-9921",
    "ColorCode": "NAVY-01",
    "EstCost": 24.50
  }
}`}
              </pre>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="default" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleManualSync}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Отправить тестовый запрос
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
