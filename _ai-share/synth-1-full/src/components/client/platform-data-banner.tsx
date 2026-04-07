'use client';

import { Badge } from '@/components/ui/badge';
import { getPlatformApiBaseUrl, getPlatformTransport } from '@/lib/platform/config';
import { Database, Cloud } from 'lucide-react';

/** Показывает режим данных (демо/localStorage vs API). */
export function PlatformDataBanner({ className }: { className?: string }) {
  const mode = getPlatformTransport();
  const api = getPlatformApiBaseUrl();

  if (mode === 'api') {
    return (
      <Badge variant="outline" className={`text-[10px] font-normal gap-1 ${className ?? ''}`}>
        <Cloud className="h-3 w-3" />
        API{api ? `: ${api}` : ' (база URL не задана)'}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={`text-[10px] font-normal gap-1 ${className ?? ''}`}>
      <Database className="h-3 w-3" />
      Локально: каталог + localStorage
    </Badge>
  );
}
