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
  { id: 'EDO-001', type: 'Счёт', status: 'sent', date: '10.03.2026', partner: 'TSUM' },
  { id: 'EDO-002', type: 'Акт', status: 'pending_sign', date: '09.03.2026', partner: 'Lamoda' },
  { id: 'EDO-003', type: 'Накладная', status: 'signed', date: '08.03.2026', partner: 'ЦУМ Online' },
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
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          ЭДО — документооборот
        </CardTitle>
        <p className="text-sm text-slate-500">Связь с B2B заказами и Production</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50"
            >
              <div>
                <p className="font-bold text-sm">{doc.type} {doc.id}</p>
                <p className="text-[10px] text-slate-500">{doc.partner} · {doc.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={cn(
                    'text-[8px]',
                    doc.status === 'signed' && 'bg-emerald-100 text-emerald-700',
                    doc.status === 'pending_sign' && 'bg-amber-100 text-amber-700',
                    doc.status === 'sent' && 'bg-slate-100 text-slate-600'
                  )}
                >
                  {doc.status === 'signed' ? 'Подписан' : doc.status === 'pending_sign' ? 'Ждёт подписи' : 'Отправлен'}
                </Badge>
                {doc.status === 'pending_sign' && canEdit && (
                  <Button size="sm" variant="outline" className="h-7 text-[9px]" onClick={() => handleSign(doc)}>
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
