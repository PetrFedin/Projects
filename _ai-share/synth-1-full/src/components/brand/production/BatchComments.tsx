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
  const [messages, setMessages] = useState<
    Array<{ id: number; content: string; sender_role: string; created_at: string }>
  >([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = async () => {
    if (!batchId && !skuId) {
      setLoading(false);
      return;
    }
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

  useEffect(() => {
    load();
  }, [batchId, skuId]);

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
<<<<<<< HEAD
    <Card className="overflow-hidden rounded-2xl border border-slate-200">
      <CardHeader className="border-b border-slate-100 p-4">
        <CardTitle className="flex items-center gap-2 text-xs font-black uppercase">
          <MessageSquare className="h-4 w-4 text-indigo-600" />
=======
    <Card className="border-border-default overflow-hidden rounded-2xl border">
      <CardHeader className="border-border-subtle border-b p-4">
        <CardTitle className="flex items-center gap-2 text-xs font-black uppercase">
          <MessageSquare className="text-accent-primary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
          Комментарии {batchId ? `(PO ${batchId})` : skuId ? `(${skuId})` : ''}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {!batchId && !skuId ? (
<<<<<<< HEAD
          <p className="py-4 text-[10px] text-slate-400">
=======
          <p className="text-text-muted py-4 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
            Выберите партию или артикул для комментариев
          </p>
        ) : (
          <>
            <div className="mb-4 max-h-48 space-y-2 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-6">
<<<<<<< HEAD
                  <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                </div>
              ) : messages.length === 0 ? (
                <p className="py-4 text-[10px] text-slate-400">Пока нет комментариев</p>
=======
                  <Loader2 className="text-text-muted h-6 w-6 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <p className="text-text-muted py-4 text-[10px]">Пока нет комментариев</p>
>>>>>>> recover/cabinet-wip-from-stash
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
<<<<<<< HEAD
                    className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-[10px]"
                  >
                    <p className="mb-0.5 font-bold text-slate-700">{m.sender_role}</p>
                    <p className="text-slate-900">{m.content}</p>
                    <p className="mt-1 text-[9px] text-slate-400">
=======
                    className="bg-bg-surface2 border-border-subtle rounded-xl border p-2.5 text-[10px]"
                  >
                    <p className="text-text-primary mb-0.5 font-bold">{m.sender_role}</p>
                    <p className="text-text-primary">{m.content}</p>
                    <p className="text-text-muted mt-1 text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
                      {new Date(m.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Textarea
                placeholder="Добавить комментарий..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[60px] resize-none text-[10px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                size="sm"
                onClick={handleSend}
                disabled={sending || !text.trim()}
                className="shrink-0"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
