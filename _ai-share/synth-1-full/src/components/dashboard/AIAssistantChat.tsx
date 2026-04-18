'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Minimize2, Maximize2, Sparkles, Mic, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserContext } from '@/hooks/useUserContext';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export function AIAssistantChat() {
  const { user, currentOrg } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Привет, ${user?.displayName || 'друг'}! Я ваш AI-ассистент для B2B закупок. Чем могу помочь сегодня?`,
      timestamp: new Date().toISOString(),
      suggestions: [
        'Найти аналоги out-of-stock товара',
        'Подобрать ассортимент FW26',
        'Проверить статус заказа',
        'Условия оплаты Net 30',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('заказ') || lowerQuery.includes('order')) {
      return `У вас 3 активных заказа:\n\n1. ORD-8821 - Nordic Wool FW26 (420,000 ₽) - In Production\n2. ORD-8819 - Radical Chic Draft (156,000 ₽) - Draft\n3. ORD-8790 - Syntha Lab SS26 (890,000 ₽) - Confirmed\n\nХотите подробности по какому-то из них?`;
    }

    if (lowerQuery.includes('аналог') || lowerQuery.includes('замен')) {
      return `Нашёл 3 альтернативы для out-of-stock товара:\n\n1. Tech Parka Pro (Syntha Lab) - 28,500 ₽ - В наличии 450 шт\n2. Urban Nomad Jacket (Nordic Wool) - 32,000 ₽ - В наличии 200 шт\n3. Arctic Explorer Coat (Radical Chic) - 35,500 ₽ - Предзаказ FW26\n\nДобавить в корзину?`;
    }

    if (lowerQuery.includes('оплат') || lowerQuery.includes('payment')) {
      return `Доступные способы оплаты для ${currentOrg?.name}:\n\n✅ Net 30 - оплата через 30 дней\n✅ Net 60 - для заказов > 500K ₽\n✅ Klarna BNPL - 0% на 3 месяца\n✅ Escrow - безопасная сделка\n✅ Factoring - получите деньги сегодня\n\nВаш кредитный лимит: 2.4M ₽`;
    }

    if (lowerQuery.includes('fw26') || lowerQuery.includes("fw'26")) {
      return `Рекомендации для FW26 ассортимента:\n\n📊 Trending Categories:\n• Puffer Jackets (+45% demand)\n• Tech Parkas (+28% demand)\n• Wool Coats (-12% vs last season)\n\n💡 Top Picks for ${currentOrg?.name}:\n1. Cyber Tech Parka - STR прогноз: 85%\n2. Nordic Peak Jacket - STR прогноз: 82%\n3. Urban Nomad Coat - STR прогноз: 78%\n\nХотите добавить эти товары в план?`;
    }

    return `Понял ваш вопрос: "${query}". Сейчас ищу информацию в нашей базе данных... Один момент!`;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl transition-transform hover:scale-110"
      >
        <MessageCircle className="h-7 w-7" />
        <div className="absolute -right-1 -top-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-rose-500">
          <span className="text-[10px] font-black">1</span>
        </div>
      </button>
    );
  }

  return (
    <Card
      className={cn(
        'fixed bottom-6 right-6 z-50 overflow-hidden rounded-2xl border-2 border-indigo-200 shadow-2xl',
        isMinimized ? 'h-12 w-80' : 'h-[600px] w-[400px]'
      )}
    >
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase">AI Assistant</h3>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <p className="text-[10px] font-medium opacity-90">Online</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[440px] flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl p-3',
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'border-2 border-slate-200 bg-white text-slate-900'
                  )}
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
                  {message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={cn(
                            'rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors',
                            message.role === 'user'
                              ? 'bg-white/20 text-white hover:bg-white/30'
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                          )}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl border-2 border-slate-200 bg-white p-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t bg-white p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Спросите что-нибудь..."
                className="flex-1 rounded-xl"
              />
              <Button size="icon" variant="ghost" className="flex-shrink-0 hover:bg-slate-100">
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={handleSend}
                className="flex-shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-center text-[9px] text-slate-400">
              Powered by GPT-4 • Ваши данные защищены
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
