'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Webhook, Mail, Calendar } from 'lucide-react';

/** Конфиг триггеров и webhooks — заглушка */
export function ProcessTriggersConfig() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-sm font-bold">Триггеры и Webhooks</h3>
        <p className="text-xs text-slate-500">
          При смене статуса: письмо, событие в календаре, обновление внешней системы (ERP, PIM,
          B2B).
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 p-2">
          <Mail className="h-4 w-4 text-slate-400" />
          <span className="text-xs">Отправка письма при смене статуса — в разработке</span>
        </div>
        <div className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 p-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-xs">Создание события в календаре — в разработке</span>
        </div>
        <div className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 p-2">
          <Webhook className="h-4 w-4 text-slate-400" />
          <span className="text-xs">Webhook для ERP, PIM, B2B — в разработке</span>
        </div>
        <Button variant="outline" size="sm" disabled>
          Добавить триггер (скоро)
        </Button>
      </CardContent>
    </Card>
  );
}
