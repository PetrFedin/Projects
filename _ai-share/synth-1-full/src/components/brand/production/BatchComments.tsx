'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { getProductionMessages, sendProductionMessage } from '@/lib/production/plm-extended';

interface BatchCommentsProps {
  batchId?: string;
  skuId?: string;
}

export function BatchComments({ batchId, skuId }: BatchCommentsProps) {
  const [messages, setMessages] = useState<Array<{ id: number; content: string; sender_role: string; created_at: string }>>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = async () => {
    if (!batchId && !skuId) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await getProductionMessages({ batch_id: batchId, sku_id: skuId, limit: 30 });
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [batchId, skuId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await sendProductionMessage({ text: text.trim(), batch_id: batchId, sku_id: skuId });
      setText('');
      load();
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="border border-slate-200 rounded-2xl overflow-hidden">
      <CardHeader className="p-4 border-b border-slate-100">
        <CardTitle className="text-xs font-black uppercase flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-indigo-600" />
          Комментарии {batchId ? `(PO ${batchId})` : skuId ? `(${skuId})` : ''}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {!batchId && !skuId ? (
          <p className="text-[10px] text-slate-400 py-4">Выберите партию или артикул для комментариев</p>
        ) : (
          <>
            <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
              {loading ? (
                <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
              ) : messages.length === 0 ? (
                <p className="text-[10px] text-slate-400 py-4">Пока нет комментариев</p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px]">
                    <p className="font-bold text-slate-700 mb-0.5">{m.sender_role}</p>
                    <p className="text-slate-900">{m.content}</p>
                    <p className="text-slate-400 text-[9px] mt-1">{new Date(m.created_at).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Textarea
                placeholder="Добавить комментарий..."
                value={text}
                onChange={e => setText(e.target.value)}
                className="min-h-[60px] text-[10px] resize-none"
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              <Button size="sm" onClick={handleSend} disabled={sending || !text.trim()} className="shrink-0">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
