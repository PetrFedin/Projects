'use client';

import { Button } from '@/components/ui/button';
import { downloadJsonFile } from '@/lib/platform/json-io';
import { buildPartnerDemoSnapshot } from '@/lib/platform/partner-demo-data';
import { useToast } from '@/hooks/use-toast';
import { Copy, FileJson } from 'lucide-react';

/** Экспорт единого JSON-снимка партнёрских демо (презентации, будущий import API). */
export function PartnerDemoExportBar({ className }: { className?: string }) {
  const { toast } = useToast();

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(buildPartnerDemoSnapshot(), null, 2));
      toast({ title: 'JSON скопирован в буфер' });
    } catch {
      toast({ title: 'Не удалось скопировать', variant: 'destructive' });
    }
  };

  const saveJson = () => {
    downloadJsonFile(`synth-partner-demo-snapshot-${Date.now()}.json`, buildPartnerDemoSnapshot());
    toast({ title: 'Файл сохранён' });
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
      <Button type="button" variant="outline" size="sm" onClick={copyJson}>
        <Copy className="h-4 w-4 mr-2" />
        Копировать снимок демо
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={saveJson}>
        <FileJson className="h-4 w-4 mr-2" />
        Скачать JSON
      </Button>
    </div>
  );
}
