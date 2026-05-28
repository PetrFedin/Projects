'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Send, CheckCircle2, Clock } from 'lucide-react';
import { useRbac } from '@/hooks/useRbac';
import { useNotifications } from '@/providers/notifications-provider';
import { cn } from '@/lib/utils';

const MOCK_DOCS = [
  {
    id: 'EDO-001',
    type: 'Счёт',
    status: 'sent',
    date: '10.03.2026',
    partner: 'Демо-магазин · Москва 2',
  },
  {
    id: 'EDO-002',
    type: 'Акт',
    status: 'pending_sign',
    date: '09.03.2026',
    partner: 'Демо-магазин · СПб',
  },
  {
    id: 'EDO-003',
    type: 'Накладная',
    status: 'signed',
    date: '08.03.2026',
    partner: 'Демо-магазин · Москва 1',
  },
];

export function EdoDocumentFlow() {
  const { can } = useRbac();
  const { addNotification } = useNotifications();
  const [docs] = useState(MOCK_DOCS);
  const canEdit = can('edo', 'edit');

  const handleSign = (doc: (typeof docs)[0]) => {
    addNotification({ type: 'edo', title: 'Документ подписан', body: `${doc.type} ${doc.id}` });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" />
          ЭДО — документооборот
        </CardTitle>
        <p className="text-text-secondary text-sm">Связь с B2B заказами и Production</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="border-border-subtle hover:bg-bg-surface2 flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="text-sm font-bold">
                  {doc.type} {doc.id}
                </p>
                <p className="text-text-secondary text-[10px]">
                  {doc.partner} · {doc.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={cn(
                    'text-[8px]',
                    doc.status === 'signed' && 'bg-emerald-100 text-emerald-700',
                    doc.status === 'pending_sign' && 'bg-amber-100 text-amber-700',
                    doc.status === 'sent' && 'bg-bg-surface2 text-text-secondary'
                  )}
                >
                  {doc.status === 'signed'
                    ? 'Подписан'
                    : doc.status === 'pending_sign'
                      ? 'Ждёт подписи'
                      : 'Отправлен'}
                </Badge>
                {doc.status === 'pending_sign' && canEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[9px]"
                    onClick={() => handleSign(doc)}
                  >
                    Подписать
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
