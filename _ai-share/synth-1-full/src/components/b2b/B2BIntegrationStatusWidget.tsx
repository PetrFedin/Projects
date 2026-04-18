'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export interface B2BIntegrationStatusItem {
  id: string;
  name: string;
  configured: boolean;
  docsUrl?: string;
  description?: string;
}

interface B2BIntegrationStatusWidgetProps {
  /** Ссылка на настройки интеграций (бренд: /brand/integrations, магазин: /shop/b2b/settings). */
  settingsHref?: string;
}

/** Виджет статуса B2B-интеграций (JOOR, NuOrder, Fashion Cloud, SparkLayer, Colect, Zedonk). Для брендов, дистрибуторов, магазинов, поставщиков. */
export function B2BIntegrationStatusWidget({ settingsHref }: B2BIntegrationStatusWidgetProps = {}) {
  const [items, setItems] = useState<B2BIntegrationStatusItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/b2b/integrations/status')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: B2BIntegrationStatusItem[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || items.length === 0) return null;

  const allowedIds = ['joor', 'nuorder', 'fashion_cloud', 'sparklayer', 'colect', 'zedonk'];
  const configured = items.filter((i) => i.configured && allowedIds.includes(i.id));
  if (configured.length === 0) return null;

  return (
    <Card className="border-dashed">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center gap-2 text-sm font-bold">
          <Zap className="h-4 w-4 text-amber-500" /> B2B интеграции
        </CardTitle>
        <CardDescription>Подключённые платформы для заказов, каталога и прайсов.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 pt-0">
        {configured.map((i) => (
          <Badge
            key={i.id}
            variant="secondary"
            className="cursor-default text-xs font-medium"
            title={i.description}
          >
            {i.name}
          </Badge>
        ))}
        {settingsHref && (
          <Link
            href={settingsHref}
            className="ml-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline"
          >
            Настройки <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
