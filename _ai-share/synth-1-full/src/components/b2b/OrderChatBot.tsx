'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Minimize2 } from 'lucide-react';
import { getOrderChatReply, type OrderChatMessage } from '@/lib/ai/order-chat';

interface OrderChatBotProps {
  /** Свёрнутый по умолчанию */
  defaultCollapsed?: boolean;
  className?: string;
}

export function OrderChatBot({ defaultCollapsed = true, className }: OrderChatBotProps) {
  const [open, setOpen] = useState(!defaultCollapsed);
  const [messages, setMessages] = useState<OrderChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Здравствуйте! Спросите про наличие, цены или статус заказа. Например: «Есть ли в наличии?», «Какие сроки поставки?»',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: OrderChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const reply = getOrderChatReply(text);
    const botMsg: OrderChatMessage = {
      id: `b-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: new Date().toISOString(),
    };
    setTimeout(() => setMessages((prev) => [...prev, botMsg]), 400);
  };

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={className}
        onClick={() => setOpen(true)}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        AI-чат по заказам
      </Button>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="py-2 px-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          AI-чат по заказам
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
          <Minimize2 className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <div className="h-48 overflow-y-auto space-y-2 mb-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`text-xs rounded-lg px-2 py-1.5 max-w-[90%] ${m.role === 'user' ? 'ml-auto bg-indigo-100 text-indigo-900' : 'bg-slate-100 text-slate-800'}`}
            >
              {m.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="flex gap-1">
          <Input
            placeholder="Наличие, цены, статус..."
            className="text-sm h-8"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <Button size="icon" className="h-8 w-8 shrink-0" onClick={send}>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
