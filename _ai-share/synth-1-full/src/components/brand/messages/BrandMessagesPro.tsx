'use client';

/**
 * BrandMessagesPro - Версия 9.0 "SYNTHA JOOR OS INTEGRATED"
 * СТИЛЬ: JOOR HIGH-DENSITY (Minimalist, Data-Driven, Professional).
 * ФУНКЦИИ: Полный функционал Messages OS (AI Handshake, Widgets, Voice-to-Task) + Data Hub.
 */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  Filter,
  Send,
  Bot,
  Sparkles,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  Phone,
  Video,
  X,
  ChevronRight,
  Signal,
  Mic,
  Zap,
  FileText,
  Download,
  SlidersHorizontal,
  ArrowUpRight,
  Users,
  Activity,
  Globe,
  Box,
  Layers,
  Target,
  BarChart3,
  MoreVertical,
  Info,
  Star,
  Archive,
  Plus,
  CreditCard,
  Handshake,
  BellRing,
  Paperclip,
  Loader2,
  Pin,
  ShieldCheck,
  AlertTriangle,
  BrainCircuit,
  ShieldAlert,
  RotateCcw,
  LayoutGrid,
  Factory,
  Trash2,
  Eye,
  Volume2,
  SmilePlus,
  Truck,
  FileCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { DataTablePro } from '@/components/data/DataTable/DataTablePro';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { ChatMessage, Chat as ChatConversation, UserRole, TaskStatus } from '@/lib/types';

// --- MOCK DATA FROM ENGINE ---
const MOCK_CHATS: any[] = [
  {
    id: 'chat_podium',
    title: 'PODIUM (Brand Team)',
    subtitle: 'Negotiation Active',
    company: 'PODIUM Moscow',
    unread: 2,
    sentiment: 'Bullish',
    ltv: '4.2M ₽',
    status: 'online',
    activeDeal: { title: 'SS26 Outerwear', value: '1.2M ₽', stage: 'Negotiation', progress: 65 },
    lastSku: 'Graphite-01',
    sla: '14m',
    intent: 94,
    region: 'RU',
    participantsCount: 5,
    participants: [
      { id: 'p1', name: 'Елена Васильева', role: 'brand', isOnline: true },
      { id: 'p2', name: 'Анна Смирнова', role: 'manufacturer', isOnline: false },
    ],
  },
  {
    id: 'chat_selfridges',
    title: 'Selfridges (B2B Buy)',
    subtitle: 'Reviewing LineSheet',
    company: 'Selfridges UK',
    unread: 0,
    sentiment: 'Bullish',
    ltv: '12.8M ₽',
    status: 'offline',
    activeDeal: { title: 'Graphene Drop', value: '4.5M ₽', stage: 'Review', progress: 85 },
    lastSku: 'Tech-Trench',
    sla: '2h',
    intent: 72,
    region: 'UK',
    participantsCount: 3,
    participants: [{ id: 'p3', name: 'Mark Reed', role: 'buyer', isOnline: false }],
  },
];

export default function BrandMessagesPro() {
  const [activeChatId, setActiveChatId] = useState('chat_podium');
  const [viewMode, setViewType] = useState<'chat' | 'table'>('chat');
  const [composerText, setComposerText] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);
  const [msgSearch, setMsgSearch] = useState('');

  // Engine specific states
  const [productionPhase, setProductionPhase] = useState(65);
  const [riskLevel, setRiskLevel] = useState(15);
  const [activeWidgets, setActiveWidgets] = useState([
    'ai_context',
    'production_timeline',
    'risk_bar',
  ]);
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  const { toast } = useToast();
  const activeChat = MOCK_CHATS.find((c) => c.id === activeChatId) || MOCK_CHATS[0];

  const currentHistory = [
    {
      id: 101,
      user: 'Светлана',
      text: 'Привет! Мы получили образцы SS26. Качество Graphene-нейлона превосходное. Хотим обсудить спец. условия по MOQ для флагманского магазина.',
      time: '11:42',
      type: 'message',
      createdAt: Date.now() - 3600000,
    },
    {
      id: 102,
      user: 'Вы',
      text: 'Здравствуйте, Светлана. Для флагмана мы можем снизить MOQ до 30 ед. при условии 100% предоплаты логистики.',
      time: '12:05',
      type: 'message',
      createdAt: Date.now() - 1800000,
    },
    {
      id: 103,
      type: 'task',
      text: 'Подготовить финальный контракт с учетом скидки 5%',
      status: 'pending',
      priority: 'high',
      user: 'AI Assistant',
      time: '12:10',
      createdAt: Date.now() - 600000,
      widgetTags: ['contract_status', 'risk_bar'],
    },
  ];

  const allWidgets = [
    { id: 'ai_context', label: 'Контекст ИИ', icon: BrainCircuit },
    { id: 'production_timeline', label: 'Производство', icon: Activity },
    { id: 'risk_bar', label: 'Панель рисков', icon: AlertTriangle },
    { id: 'financial_health', label: 'Финансы', icon: DollarSign },
    { id: 'logistics_tracker', label: 'Логистика', icon: Truck },
    { id: 'contract_status', label: 'Контракты', icon: FileCheck },
  ];

  const tableColumns = [
    {
      accessorKey: 'company',
      header: 'Ритейлер',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-zinc-100 text-[10px] font-black">
            {row.original.company[0]}
          </div>
          <div className="min-w-0">
            <p className="mb-1 truncate font-black leading-none text-zinc-900">
              {row.original.company}
            </p>
            <Badge variant="secondary" className="h-4 text-[8px]">
              {row.original.sentiment}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'ltv',
      header: 'Оборот (LTV)',
      cell: ({ row }: any) => (
        <span className="font-black tabular-nums text-zinc-900">{row.original.ltv}</span>
      ),
    },
    {
      accessorKey: 'activeDeal',
      header: 'Стадия Сделки',
      cell: ({ row }: any) => (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase leading-none text-zinc-900">
            {row.original.activeDeal?.stage}
          </span>
          <div className="h-1 w-20 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full bg-black"
              style={{ width: `${row.original.activeDeal?.progress}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'intent',
      header: 'Интент',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-zinc-900">{row.original.intent}%</span>
          <div className="h-1 w-12 flex-1 overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full bg-blue-600" style={{ width: `${row.original.intent}%` }} />
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'sla',
      header: 'SLA',
      cell: ({ row }: any) => (
        <span className="font-black tabular-nums text-rose-600">{row.original.sla}</span>
      ),
    },
  ];

  const runVoiceDNA = () => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setIsAiProcessing(true);
      setTimeout(() => {
        setIsAiProcessing(false);
        setComposerText(
          'Нужно подготовить спецификацию по материалам для TSUM к завтрашнему утру.'
        );
        toast({ title: 'AI Analysis Complete', description: 'Текст распознан и проанализирован.' });
      }, 1500);
    }, 2000);
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto flex h-[calc(100vh-2rem)] max-w-5xl flex-col space-y-4 px-4 py-4 pb-24 duration-700 animate-in fade-in">
        {/* --- OPERATIONAL HEADER --- */}
        <div className="flex shrink-0 flex-col items-start justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-end">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <MessageSquare className="h-2.5 w-2.5" />
              <span>Communication</span>
              <ChevronRight className="h-2 w-2 opacity-50" />
              <span className="text-slate-300">Strategy OS Messages</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-[10px] font-bold uppercase text-white shadow-lg">
                {activeChat.company[0]}
              </div>
              <h1 className="font-headline text-base font-bold uppercase leading-none tracking-tighter text-slate-900">
                {activeChat.company}
              </h1>
              <Badge
                variant="outline"
                className="h-4 gap-1 border-emerald-100 bg-emerald-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm transition-all"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Region:{' '}
                {activeChat.region}
              </Badge>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
              <div className="flex shrink-0 items-center gap-3 rounded-lg border border-slate-200 bg-white p-1 px-3 shadow-sm">
                <div className="flex shrink-0 flex-col">
                  <span className="mb-0.5 text-[7px] font-bold uppercase leading-none tracking-widest text-slate-400">
                    LTV Portfolio
                  </span>
                  <span className="text-[10px] font-bold tabular-nums leading-none text-slate-900">
                    {activeChat.ltv}
                  </span>
                </div>
                <div className="mx-0.5 h-6 w-px shrink-0 bg-slate-100" />
                <div className="flex shrink-0 flex-col">
                  <span className="mb-0.5 text-[7px] font-bold uppercase leading-none tracking-widest text-slate-400">
                    SLA Deadline
                  </span>
                  <span className="text-[10px] font-bold italic tabular-nums leading-none text-rose-600">
                    {activeChat.sla}
                  </span>
                </div>
              </div>
              <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
                <button
                  onClick={() => setViewType('chat')}
                  className={cn(
                    'h-6 rounded-md px-3 text-[9px] font-bold uppercase tracking-widest transition-all',
                    viewMode === 'chat'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  Chat OS
                </button>
                <button
                  onClick={() => setViewType('table')}
                  className={cn(
                    'h-6 rounded-md px-3 text-[9px] font-bold uppercase tracking-widest transition-all',
                    viewMode === 'table'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  Data Hub
                </button>
              </div>
              <Button
                variant="outline"
                className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:text-indigo-600"
                onClick={() => setIsNegotiationOpen(true)}
              >
                <Handshake className="mr-1.5 h-3.5 w-3.5 text-indigo-500" /> Handshake
              </Button>
              <Button className="h-7 gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-indigo-600">
                <Zap className="h-3.5 w-3.5 text-indigo-400" /> Finalize Deal
              </Button>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 gap-3 overflow-hidden">
          {/* --- LEFT: ACCOUNTS & FILTERS --- */}
          <Card className="flex w-64 shrink-0 flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100/50">
            <CardHeader className="shrink-0 border-b border-slate-50 bg-slate-50/50 p-3">
              <div className="group relative">
                <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
                <Input
                  placeholder="Search Portfolio..."
                  className="h-7 rounded-lg border-slate-200 bg-white pl-8 text-[9px] font-bold uppercase tracking-widest shadow-sm placeholder:text-slate-300 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                {MOCK_CHATS.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={cn(
                      'group/item cursor-pointer rounded-lg border p-2.5 transition-all',
                      activeChatId === chat.id
                        ? 'border-slate-200 bg-white shadow-md ring-1 ring-slate-100'
                        : 'border-transparent hover:border-slate-100 hover:bg-slate-50/80'
                    )}
                  >
                    <div className="mb-1.5 flex items-start justify-between">
                      <p className="truncate text-[10px] font-bold uppercase leading-none tracking-tight text-slate-900 transition-colors group-hover/item:text-indigo-600">
                        {chat.company}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          'h-3.5 rounded border px-1 text-[6px] font-bold uppercase tracking-widest shadow-sm transition-all',
                          chat.sentiment === 'Bullish'
                            ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                            : 'border-slate-100 bg-slate-50 text-slate-400'
                        )}
                      >
                        {chat.sentiment}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[8px] font-bold uppercase leading-none tracking-widest text-slate-400">
                      <span className="tabular-nums text-slate-900">{chat.ltv}</span>
                      <span className="flex items-center gap-1 opacity-60">
                        <Clock className="h-2 w-2" /> {chat.time || 'NOW'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* --- MAIN OPERATIONAL AREA --- */}
          <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden">
            {viewMode === 'table' ? (
              <Card className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100/50">
                <div className="mb-4 flex items-end justify-between border-b border-slate-50 px-1 pb-3">
                  <div className="space-y-0.5">
                    <h2 className="text-sm font-bold uppercase leading-none tracking-tighter text-slate-900">
                      Portfolio Data Hub
                    </h2>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
                      Advanced Performance Analytics & Deal Pipeline
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      variant="outline"
                      className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:text-indigo-600"
                    >
                      <Download className="mr-1.5 h-3 w-3" /> Export
                    </Button>
                    <Button className="h-7 gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-indigo-600">
                      <Plus className="h-3.5 w-3.5" /> Create Deal
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <DataTablePro
                    columns={tableColumns}
                    data={MOCK_CHATS}
                    searchPlaceholder="Filter by Company or ID..."
                  />
                </div>
              </Card>
            ) : (
              <>
                {/* Dynamic Widget Ribbon (Engine Integrated) */}
                <div className="no-scrollbar flex shrink-0 items-center gap-2 overflow-x-auto pb-1">
                  {allWidgets.map((widget) => {
                    const isActive = activeWidgets.includes(widget.id);
                    return (
                      <Card
                        key={widget.id}
                        className={cn(
                          'group flex h-10 min-w-[160px] shrink-0 cursor-pointer flex-col justify-between rounded-xl border p-2.5 shadow-sm transition-all',
                          isActive
                            ? 'border-slate-200 bg-white hover:border-indigo-600 hover:shadow-md'
                            : 'border-transparent bg-slate-50 opacity-40 grayscale'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <widget.icon
                              className={cn(
                                'h-3 w-3',
                                isActive ? 'text-indigo-600' : 'text-slate-400'
                              )}
                            />
                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-700">
                              {widget.label}
                            </span>
                          </div>
                          {isActive && (
                            <div className="h-1 w-1 animate-pulse rounded-full bg-indigo-500" />
                          )}
                        </div>
                        <div className="h-0.5 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
                          <div
                            className={cn(
                              'h-full transition-all duration-1000',
                              widget.id === 'production_timeline' ? 'bg-indigo-600' : 'bg-slate-900'
                            )}
                            style={{
                              width:
                                widget.id === 'production_timeline' ? `${productionPhase}%` : '75%',
                            }}
                          />
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* Message Feed (High Density) */}
                <Card className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100/50">
                  <ScrollArea className="flex-1 bg-slate-50/30">
                    <div className="space-y-6 p-4">
                      {currentHistory.map((m: any) => {
                        const isMe = m.user === 'Вы' || m.user === 'AI Assistant';
                        const isTask = m.type === 'task';

                        return (
                          <div
                            key={m.id}
                            className={cn(
                              'group/msg flex gap-3',
                              isMe ? 'flex-row-reverse text-right' : 'text-left'
                            )}
                          >
                            <div
                              className={cn(
                                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[9px] font-bold uppercase shadow-sm transition-transform group-hover/msg:scale-110',
                                isMe
                                  ? 'border-slate-800 bg-slate-900 text-white'
                                  : 'border-slate-200 bg-white text-slate-900'
                              )}
                            >
                              {m.user[0]}
                            </div>
                            <div
                              className={cn(
                                'max-w-[80%] space-y-1',
                                isMe ? 'items-end' : 'items-start'
                              )}
                            >
                              <div
                                className={cn(
                                  'mb-0.5 flex items-center gap-2',
                                  isMe ? 'flex-row-reverse' : ''
                                )}
                              >
                                <span className="text-[9px] font-bold uppercase leading-none tracking-widest text-slate-900">
                                  {m.user}
                                </span>
                                <span className="text-[8px] font-bold uppercase tabular-nums leading-none text-slate-300">
                                  {m.time}
                                </span>
                              </div>
                              <div
                                className={cn(
                                  'relative rounded-xl border p-3 text-[12px] leading-relaxed shadow-sm transition-all group-hover/msg:shadow-md',
                                  isMe
                                    ? 'border-slate-800 bg-slate-900 text-white'
                                    : 'border-slate-100 bg-white text-slate-800',
                                  isTask && 'border-l-4 border-l-indigo-600 bg-indigo-50/30'
                                )}
                              >
                                {isTask && (
                                  <div className="mb-2 flex items-center gap-2">
                                    <Badge className="h-3.5 border-none bg-indigo-600 px-1.5 text-[7px] font-bold uppercase tracking-widest text-white shadow-sm">
                                      TASK ACTIVE
                                    </Badge>
                                    <span className="text-[8px] font-bold uppercase tracking-tighter text-slate-400">
                                      ID: #T-{m.id}
                                    </span>
                                  </div>
                                )}
                                <div className="whitespace-pre-wrap">{m.text}</div>

                                {isTask && (
                                  <div className="mt-3 flex items-center gap-2 border-t border-slate-200/50 pt-3">
                                    <Button
                                      variant="outline"
                                      className="h-6 rounded-md border-slate-200 bg-white px-2.5 text-[8px] font-bold uppercase text-slate-900 shadow-sm transition-all hover:bg-slate-50"
                                    >
                                      Details
                                    </Button>
                                    <Button className="h-6 rounded-md border-indigo-600 bg-indigo-600 px-3 text-[8px] font-bold uppercase text-white shadow-md transition-all hover:bg-indigo-700">
                                      Mark Done
                                    </Button>
                                  </div>
                                )}
                              </div>
                              {!isMe && (
                                <div className="mt-1 flex items-center gap-1.5 pl-1 opacity-0 transition-all duration-200 group-hover/msg:opacity-100">
                                  <Badge
                                    variant="outline"
                                    className="h-4 cursor-pointer border-slate-200 bg-white px-1.5 text-[7px] font-bold uppercase tracking-widest text-slate-400 shadow-sm transition-all hover:border-indigo-100 hover:text-indigo-600"
                                  >
                                    Reply
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="h-4 cursor-pointer border-slate-200 bg-white px-1.5 text-[7px] font-bold uppercase tracking-widest text-slate-400 shadow-sm transition-all hover:border-indigo-100 hover:text-indigo-600"
                                  >
                                    Quick Task
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  {/* Operational Input Hub (Density) */}
                  <div className="shrink-0 border-t border-slate-100 bg-white p-4">
                    <div className="mx-auto max-w-4xl space-y-3">
                      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5">
                        {['Status Check', 'Payment Link', 'Credit Limit', 'VIP Priority'].map(
                          (p) => (
                            <button
                              key={p}
                              className="h-5 shrink-0 rounded border border-slate-200 bg-slate-50 px-2 text-[7px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                            >
                              {p}
                            </button>
                          )
                        )}
                        <div className="ml-auto shrink-0">
                          <div className="group flex h-5 cursor-pointer items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-2 shadow-sm transition-all hover:bg-indigo-600">
                            <Bot className="h-2.5 w-2.5 text-indigo-600 transition-colors group-hover:text-white" />
                            <span className="text-[7px] font-bold uppercase tracking-widest text-indigo-600 transition-colors group-hover:text-white">
                              AI PROCUREMENT MODE
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="group/composer relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 shadow-inner transition-all focus-within:border-indigo-600">
                        <textarea
                          value={composerText}
                          onChange={(e) => setComposerText(e.target.value)}
                          placeholder={`Message to ${activeChat.company}...`}
                          className="no-scrollbar min-h-[80px] w-full resize-none border-none bg-transparent p-3 text-[12px] font-medium placeholder:text-[9px] placeholder:font-bold placeholder:uppercase placeholder:tracking-widest placeholder:text-slate-300 focus:ring-0"
                        />
                        <div className="flex items-center justify-between border-t border-slate-100 bg-white/80 p-2 backdrop-blur-sm">
                          <div className="flex items-center gap-0.5">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-lg text-slate-400 transition-all hover:bg-slate-50 hover:text-indigo-600"
                                  onClick={() => {}}
                                >
                                  <Paperclip className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="border-none bg-slate-900 text-[8px] font-bold uppercase tracking-widest text-white">
                                Attach File
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                    'h-7 w-7 rounded-lg transition-all',
                                    recording
                                      ? 'animate-pulse border-rose-100 bg-rose-50 text-rose-600'
                                      : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'
                                  )}
                                  onClick={runVoiceDNA}
                                >
                                  {isAiProcessing ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Mic className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="border-none bg-slate-900 text-[8px] font-bold uppercase tracking-widest text-white">
                                Voice AI
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="flex items-center gap-2">
                            {composerText.length > 20 && (
                              <Button
                                variant="ghost"
                                className="h-7 gap-1.5 rounded-lg border border-indigo-100 px-2.5 text-[8px] font-bold uppercase tracking-widest text-indigo-600 transition-all hover:bg-indigo-50"
                                onClick={() => setIsAiProcessing(true)}
                              >
                                <Sparkles className="h-3 w-3" /> Optimize AI
                              </Button>
                            )}
                            <Button
                              onClick={() => setComposerText('')}
                              className="h-7 rounded-lg border border-slate-900 bg-slate-900 px-4 text-[9px] font-bold uppercase tracking-[0.15em] text-white shadow-lg transition-all hover:bg-indigo-600"
                            >
                              Send Ops
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* --- RIGHT: INTELLIGENCE PANEL (JOOR STYLE) --- */}
          {viewMode === 'chat' && (
            <Card className="no-scrollbar flex w-72 shrink-0 flex-col space-y-6 overflow-y-auto rounded-xl border border-slate-100 bg-[#FBFBFC] p-4 shadow-sm transition-all hover:border-indigo-100/50">
              <div className="space-y-4">
                <header className="flex items-center justify-between border-b border-slate-200 px-1 pb-2">
                  <h3 className="text-[9px] font-bold uppercase italic tracking-[0.2em] text-slate-400">
                    Deal Pulse
                  </h3>
                  <Signal className="h-3 w-3 animate-pulse text-emerald-500" />
                </header>
                <div className="space-y-4 px-1">
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-bold uppercase italic leading-none tracking-tighter text-slate-900">
                      {activeChat.sentiment}
                    </span>
                    <span className="flex h-4 items-center rounded bg-emerald-50 px-1.5 text-[8px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm">
                      94% CONFIDENCE
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-slate-400">
                      <span>Negotiation Progress</span>
                      <span className="text-slate-900">65%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full border border-slate-100 bg-slate-200 shadow-inner">
                      <div
                        className="h-full bg-slate-900 transition-all duration-1000"
                        style={{ width: '65%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <header className="flex items-center justify-between border-b border-slate-200 px-1 pb-2">
                  <h3 className="text-[9px] font-bold uppercase italic tracking-[0.2em] text-slate-400">
                    Live SKU Context
                  </h3>
                </header>
                <Card className="group/sku cursor-pointer space-y-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-indigo-600 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <Badge
                      variant="outline"
                      className="h-3.5 border-none bg-slate-900 px-1 text-[6px] font-bold uppercase tracking-widest text-white shadow-sm"
                    >
                      VIEWING NOW
                    </Badge>
                    <span className="animate-pulse text-[8px] font-bold uppercase tracking-widest text-indigo-600">
                      LIVE
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-100 shadow-sm">
                      <Image
                        src="https://picsum.photos/seed/sku1/200/300"
                        alt=""
                        fill
                        className="object-cover transition-transform group-hover/sku:scale-110"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="mb-1 truncate text-[10px] font-bold uppercase leading-none tracking-tighter text-slate-900 transition-colors group-hover/sku:text-indigo-600">
                        {activeChat.lastSku}
                      </p>
                      <p className="mb-1 truncate text-[8px] font-bold uppercase leading-none tracking-tight text-slate-400 opacity-70">
                        Wool Blend Oversized Coat
                      </p>
                      <p className="text-[9px] font-bold tabular-nums leading-none text-slate-900">
                        $240.00 <span className="ml-1 text-emerald-600 opacity-80">42% GM</span>
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="h-6 w-full rounded-md border-slate-200 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all hover:bg-slate-900 hover:text-white"
                  >
                    Adjust Quote
                  </Button>
                </Card>
              </div>

              <div className="flex flex-1 flex-col justify-end">
                <Card className="group/ai relative space-y-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4 text-white shadow-xl">
                  <Sparkles className="absolute -right-2 -top-2 h-12 w-12 rotate-12 text-indigo-600 opacity-[0.1] transition-all group-hover/ai:scale-110 group-hover/ai:opacity-[0.2]" />
                  <div className="relative z-10 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-indigo-500 bg-indigo-600 shadow-lg">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300">
                      AI Closer
                    </p>
                  </div>
                  <p className="relative z-10 text-[10px] font-bold uppercase italic leading-relaxed tracking-tight text-slate-400 opacity-80">
                    "Intent peaked at 94%. Recommend 5% discount for MOQ 50 to lock production this
                    week."
                  </p>
                  <Button className="relative z-10 h-8 w-full rounded-lg bg-white text-[8px] font-bold uppercase tracking-widest text-slate-900 shadow-xl transition-all hover:bg-indigo-50 hover:text-indigo-600">
                    Apply Strategy
                  </Button>
                </Card>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* AI Handshake Dialog (Messages OS Feature) */}
      <Dialog open={isNegotiationOpen} onOpenChange={setIsNegotiationOpen}>
        <DialogContent className="max-w-2xl overflow-hidden rounded-none border-none bg-white p-0 shadow-2xl">
          <div className="bg-black p-4 text-white">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="mb-4 border-none bg-blue-600 text-[9px] font-black uppercase tracking-[0.2em] text-white">
                  AI Negotiation Hub
                </Badge>
                <DialogTitle className="text-base font-black uppercase italic tracking-tighter">
                  Handshake Strategy
                </DialogTitle>
                <DialogDescription className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Анализ рычагов влияния и сценарии закрытия сделки
                </DialogDescription>
              </div>
              <Handshake className="h-12 w-12 text-zinc-800" />
            </div>
          </div>
          <div className="space-y-4 bg-[#FBFBFC] p-3">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'SENTIMENT', val: 'Bullish', color: 'text-emerald-600' },
                { label: 'LEVERAGE', val: 'High', color: 'text-blue-600' },
                { label: 'RISK', val: 'Minimal', color: 'text-zinc-400' },
              ].map((s) => (
                <div key={s.label} className="border border-zinc-100 bg-white p-4">
                  <p className="mb-1 text-[9px] font-black uppercase text-zinc-400">{s.label}</p>
                  <span className={cn('text-sm font-black uppercase', s.color)}>{s.val}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4 bg-zinc-900 p-4 text-white">
              <div className="flex items-center gap-2 text-blue-400">
                <Zap className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Recommended Next Move
                </span>
              </div>
              <p className="text-sm font-bold italic leading-tight">
                "Предложите постоплату 30/70 в обмен на увеличение заказа на 15%. Это закроет
                потребность байера в ликвидности."
              </p>
              <Button
                className="mt-2 h-10 w-full bg-white text-[10px] font-black uppercase text-black"
                onClick={() => {
                  setComposerText(
                    'Мы готовы предложить условия 30/70 при увеличении объема заказа на 15%...'
                  );
                  setIsNegotiationOpen(false);
                }}
              >
                Use This Phrase
              </Button>
            </div>
          </div>
          <DialogFooter className="border-t border-zinc-100 bg-white p-4">
            <Button
              variant="outline"
              className="h-12 rounded-none px-8 text-[10px] font-black uppercase tracking-widest"
              onClick={() => setIsNegotiationOpen(false)}
            >
              Close Matrix
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
