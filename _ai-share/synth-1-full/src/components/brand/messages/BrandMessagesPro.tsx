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
    Search, Filter, Send, Bot, Sparkles, MessageSquare, 
    TrendingUp, DollarSign, Clock, CheckCircle2, 
    Phone, Video, X, ChevronRight, Signal, Mic, Zap,
    FileText, Download, SlidersHorizontal, ArrowUpRight,
    Users, Activity, Globe, Box, Layers, Target, BarChart3,
    MoreVertical, Info, Star, Archive, Plus, CreditCard,
    Handshake, BellRing, Paperclip, Loader2, Pin, ShieldCheck,
    AlertTriangle, BrainCircuit, ShieldAlert, RotateCcw,
    LayoutGrid, Factory, Trash2, Eye, Volume2, SmilePlus,
    Truck, FileCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { DataTablePro } from "@/components/data/DataTable/DataTablePro";
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
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
            { id: 'p2', name: 'Анна Смирнова', role: 'manufacturer', isOnline: false }
        ]
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
        participants: [
            { id: 'p3', name: 'Mark Reed', role: 'buyer', isOnline: false }
        ]
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
    const [activeWidgets, setActiveWidgets] = useState(['ai_context', 'production_timeline', 'risk_bar']);
    const [isAlertVisible, setIsAlertVisible] = useState(true);

    const { toast } = useToast();
    const activeChat = MOCK_CHATS.find(c => c.id === activeChatId) || MOCK_CHATS[0];

    const currentHistory = [
        { id: 101, user: 'Светлана', text: "Привет! Мы получили образцы SS26. Качество Graphene-нейлона превосходное. Хотим обсудить спец. условия по MOQ для флагманского магазина.", time: '11:42', type: 'message', createdAt: Date.now() - 3600000 },
        { id: 102, user: 'Вы', text: "Здравствуйте, Светлана. Для флагмана мы можем снизить MOQ до 30 ед. при условии 100% предоплаты логистики.", time: '12:05', type: 'message', createdAt: Date.now() - 1800000 },
        { id: 103, type: 'task', text: "Подготовить финальный контракт с учетом скидки 5%", status: 'pending', priority: 'high', user: 'AI Assistant', time: '12:10', createdAt: Date.now() - 600000, widgetTags: ['contract_status', 'risk_bar'] }
    ];

    const allWidgets = [
        { id: 'ai_context', label: 'Контекст ИИ', icon: BrainCircuit },
        { id: 'production_timeline', label: 'Производство', icon: Activity },
        { id: 'risk_bar', label: 'Панель рисков', icon: AlertTriangle },
        { id: 'financial_health', label: 'Финансы', icon: DollarSign },
        { id: 'logistics_tracker', label: 'Логистика', icon: Truck },
        { id: 'contract_status', label: 'Контракты', icon: FileCheck }
    ];

    const tableColumns = [
        {
            accessorKey: "company",
            header: "Ритейлер",
            cell: ({ row }: any) => (
                <div className="flex items-center gap-3">
                    <div className="h-7 w-7 bg-zinc-100 rounded-sm flex items-center justify-center text-[10px] font-black">{row.original.company[0]}</div>
                    <div className="min-w-0">
                        <p className="font-black text-zinc-900 leading-none mb-1 truncate">{row.original.company}</p>
                        <Badge variant="secondary" className="h-4 text-[8px]">{row.original.sentiment}</Badge>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "ltv",
            header: "Оборот (LTV)",
            cell: ({ row }: any) => <span className="font-black tabular-nums text-zinc-900">{row.original.ltv}</span>
        },
        {
            accessorKey: "activeDeal",
            header: "Стадия Сделки",
            cell: ({ row }: any) => (
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase text-zinc-900 leading-none">{row.original.activeDeal?.stage}</span>
                    <div className="h-1 w-20 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black" style={{ width: `${row.original.activeDeal?.progress}%` }} />
                    </div>
                </div>
            )
        },
        {
            accessorKey: "intent",
            header: "Интент",
            cell: ({ row }: any) => (
                <div className="flex items-center gap-2">
                    <span className="font-black text-[10px] text-zinc-900">{row.original.intent}%</span>
                    <div className="flex-1 h-1 w-12 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: `${row.original.intent}%` }} />
                    </div>
                </div>
            )
        },
        {
            accessorKey: "sla",
            header: "SLA",
            cell: ({ row }: any) => <span className="text-rose-600 font-black tabular-nums">{row.original.sla}</span>
        }
    ];

    const runVoiceDNA = () => {
        setRecording(true);
        setTimeout(() => {
            setRecording(false);
            setIsAiProcessing(true);
            setTimeout(() => {
                setIsAiProcessing(false);
                setComposerText("Нужно подготовить спецификацию по материалам для TSUM к завтрашнему утру.");
                toast({ title: "AI Analysis Complete", description: "Текст распознан и проанализирован." });
            }, 1500);
        }, 2000);
    };

    return (
        <TooltipProvider>
            <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl pb-24 animate-in fade-in duration-700 h-[calc(100vh-2rem)] flex flex-col">
                
                {/* --- OPERATIONAL HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-slate-100 pb-3 shrink-0">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            <MessageSquare className="h-2.5 w-2.5" />
                            <span>Communication</span>
                            <ChevronRight className="h-2 w-2 opacity-50" />
                            <span className="text-slate-300">Strategy OS Messages</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 bg-slate-900 text-white flex items-center justify-center rounded-lg font-bold text-[10px] uppercase shadow-lg border border-slate-800">{activeChat.company[0]}</div>
                            <h1 className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none">{activeChat.company}</h1>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[7px] px-1.5 h-4 gap-1 tracking-widest shadow-sm transition-all uppercase">
                               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Region: {activeChat.region}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                            <div className="flex items-center gap-3 bg-white border border-slate-200 p-1 rounded-lg shadow-sm px-3 shrink-0">
                                <div className="flex flex-col shrink-0">
                                    <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">LTV Portfolio</span>
                                    <span className="text-[10px] font-bold tabular-nums text-slate-900 leading-none">{activeChat.ltv}</span>
                                </div>
                                <div className="h-6 w-px bg-slate-100 mx-0.5 shrink-0" />
                                <div className="flex flex-col shrink-0">
                                    <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">SLA Deadline</span>
                                    <span className="text-[10px] font-bold tabular-nums text-rose-600 italic leading-none">{activeChat.sla}</span>
                                </div>
                            </div>
                            <div className="flex bg-white border border-slate-200 p-0.5 rounded-lg shadow-sm">
                                <button onClick={() => setViewType('chat')} className={cn("px-3 h-6 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all", viewMode === 'chat' ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50")}>Chat OS</button>
                                <button onClick={() => setViewType('table')} className={cn("px-3 h-6 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all", viewMode === 'table' ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50")}>Data Hub</button>
                            </div>
                            <Button variant="outline" className="h-7 px-3 bg-white text-slate-600 rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-sm border border-slate-200 transition-all hover:text-indigo-600" onClick={() => setIsNegotiationOpen(true)}>
                                <Handshake className="mr-1.5 h-3.5 w-3.5 text-indigo-500" /> Handshake
                            </Button>
                            <Button className="h-7 px-4 rounded-lg bg-slate-900 text-white text-[9px] font-bold uppercase gap-1.5 hover:bg-indigo-600 transition-all shadow-lg border border-slate-900 tracking-widest">
                                <Zap className="h-3.5 w-3.5 text-indigo-400" /> Finalize Deal
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 gap-3 overflow-hidden min-h-0">
                    {/* --- LEFT: ACCOUNTS & FILTERS --- */}
                    <Card className="w-64 border border-slate-100 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden shrink-0 hover:border-indigo-100/50 transition-all">
                        <CardHeader className="p-3 border-b border-slate-50 bg-slate-50/50 shrink-0">
                            <div className="relative group">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <Input placeholder="Search Portfolio..." className="h-7 pl-8 border-slate-200 rounded-lg text-[9px] font-bold uppercase tracking-widest placeholder:text-slate-300 shadow-sm focus:ring-1 focus:ring-indigo-500 bg-white" />
                            </div>
                        </CardHeader>
                        <ScrollArea className="flex-1">
                            <div className="p-2 space-y-1">
                                {MOCK_CHATS.map(chat => (
                                    <div 
                                        key={chat.id} 
                                        onClick={() => setActiveChatId(chat.id)}
                                        className={cn(
                                            "p-2.5 cursor-pointer rounded-lg border transition-all group/item",
                                            activeChatId === chat.id ? "bg-white border-slate-200 shadow-md ring-1 ring-slate-100" : "border-transparent hover:bg-slate-50/80 hover:border-slate-100"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-1.5">
                                            <p className="text-[10px] font-bold uppercase tracking-tight text-slate-900 truncate group-hover/item:text-indigo-600 transition-colors leading-none">{chat.company}</p>
                                            <Badge variant="outline" className={cn("text-[6px] font-bold uppercase px-1 h-3.5 rounded tracking-widest border transition-all shadow-sm", chat.sentiment === 'Bullish' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100")}>{chat.sentiment}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                            <span className="text-slate-900 tabular-nums">{chat.ltv}</span>
                                            <span className="flex items-center gap-1 opacity-60"><Clock className="h-2 w-2" /> {chat.time || 'NOW'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </Card>

                    {/* --- MAIN OPERATIONAL AREA --- */}
                    <div className="flex-1 flex flex-col min-w-0 gap-3 overflow-hidden">
                        {viewMode === 'table' ? (
                            <Card className="border border-slate-100 bg-white rounded-xl shadow-sm flex flex-col flex-1 overflow-hidden hover:border-indigo-100/50 transition-all p-4">
                                <div className="mb-4 border-b border-slate-50 pb-3 flex items-end justify-between px-1">
                                    <div className="space-y-0.5">
                                        <h2 className="text-sm font-bold uppercase tracking-tighter text-slate-900 leading-none">Portfolio Data Hub</h2>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Advanced Performance Analytics & Deal Pipeline</p>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <Button variant="outline" className="h-7 px-3 bg-white text-slate-600 rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-sm border border-slate-200 transition-all hover:text-indigo-600"><Download className="mr-1.5 h-3 w-3" /> Export</Button>
                                        <Button className="h-7 px-4 rounded-lg bg-slate-900 text-white text-[9px] font-bold uppercase gap-1.5 hover:bg-indigo-600 transition-all shadow-lg border border-slate-900 tracking-widest"><Plus className="h-3.5 w-3.5" /> Create Deal</Button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-auto">
                                    <DataTablePro columns={tableColumns} data={MOCK_CHATS} searchPlaceholder="Filter by Company or ID..." />
                                </div>
                            </Card>
                        ) : (
                            <>
                                {/* Dynamic Widget Ribbon (Engine Integrated) */}
                                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 pb-1">
                                    {allWidgets.map(widget => {
                                        const isActive = activeWidgets.includes(widget.id);
                                        return (
                                            <Card 
                                                key={widget.id} 
                                                className={cn(
                                                    "min-w-[160px] h-10 p-2.5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer group shrink-0 shadow-sm",
                                                    isActive ? "bg-white border-slate-200 hover:border-indigo-600 hover:shadow-md" : "bg-slate-50 border-transparent opacity-40 grayscale"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <widget.icon className={cn("h-3 w-3", isActive ? "text-indigo-600" : "text-slate-400")} />
                                                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-700">{widget.label}</span>
                                                    </div>
                                                    {isActive && <div className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse" />}
                                                </div>
                                                <div className="h-0.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                    <div className={cn("h-full transition-all duration-1000", widget.id === 'production_timeline' ? "bg-indigo-600" : "bg-slate-900")} style={{ width: widget.id === 'production_timeline' ? `${productionPhase}%` : '75%' }} />
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>

                                {/* Message Feed (High Density) */}
                                <Card className="flex-1 border border-slate-100 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden hover:border-indigo-100/50 transition-all">
                                    <ScrollArea className="flex-1 bg-slate-50/30">
                                        <div className="p-4 space-y-6">
                                            {currentHistory.map((m: any) => {
                                                const isMe = m.user === 'Вы' || m.user === 'AI Assistant';
                                                const isTask = m.type === 'task';
                                                
                                                return (
                                                    <div key={m.id} className={cn("flex gap-3 group/msg", isMe ? "flex-row-reverse text-right" : "text-left")}>
                                                        <div className={cn(
                                                            "h-7 w-7 rounded-lg border flex items-center justify-center text-[9px] font-bold shrink-0 uppercase shadow-sm group-hover/msg:scale-110 transition-transform",
                                                            isMe ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-200"
                                                        )}>{m.user[0]}</div>
                                                        <div className={cn("max-w-[80%] space-y-1", isMe ? "items-end" : "items-start")}>
                                                            <div className={cn("flex items-center gap-2 mb-0.5", isMe ? "flex-row-reverse" : "")}>
                                                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-900 leading-none">{m.user}</span>
                                                                <span className="text-[8px] font-bold text-slate-300 uppercase tabular-nums leading-none">{m.time}</span>
                                                            </div>
                                                            <div className={cn(
                                                                "p-3 text-[12px] leading-relaxed border shadow-sm rounded-xl relative transition-all group-hover/msg:shadow-md",
                                                                isMe ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-800 border-slate-100",
                                                                isTask && "border-l-4 border-l-indigo-600 bg-indigo-50/30"
                                                            )}>
                                                                {isTask && (
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Badge className="bg-indigo-600 text-white border-none text-[7px] h-3.5 font-bold uppercase tracking-widest px-1.5 shadow-sm">TASK ACTIVE</Badge>
                                                                        <span className="text-[8px] font-bold uppercase text-slate-400 tracking-tighter">ID: #T-{m.id}</span>
                                                                    </div>
                                                                )}
                                                                <div className="whitespace-pre-wrap">{m.text}</div>
                                                                
                                                                {isTask && (
                                                                    <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-center gap-2">
                                                                        <Button variant="outline" className="h-6 px-2.5 text-[8px] font-bold uppercase bg-white text-slate-900 hover:bg-slate-50 rounded-md border-slate-200 shadow-sm transition-all">Details</Button>
                                                                        <Button className="h-6 px-3 text-[8px] font-bold uppercase bg-indigo-600 text-white hover:bg-indigo-700 rounded-md border-indigo-600 shadow-md transition-all">Mark Done</Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {!isMe && (
                                                                <div className="flex items-center gap-1.5 mt-1 opacity-0 group-hover/msg:opacity-100 transition-all duration-200 pl-1">
                                                                    <Badge variant="outline" className="h-4 px-1.5 bg-white border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 cursor-pointer transition-all uppercase text-[7px] font-bold tracking-widest shadow-sm">Reply</Badge>
                                                                    <Badge variant="outline" className="h-4 px-1.5 bg-white border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 cursor-pointer transition-all uppercase text-[7px] font-bold tracking-widest shadow-sm">Quick Task</Badge>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </ScrollArea>

                                    {/* Operational Input Hub (Density) */}
                                    <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                                        <div className="max-w-4xl mx-auto space-y-3">
                                            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                                                {['Status Check', 'Payment Link', 'Credit Limit', 'VIP Priority'].map(p => (
                                                    <button key={p} className="h-5 px-2 bg-slate-50 border border-slate-200 rounded text-[7px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm shrink-0">
                                                        {p}
                                                    </button>
                                                ))}
                                                <div className="ml-auto shrink-0">
                                                    <div className="px-2 h-5 bg-indigo-50 border border-indigo-100 flex items-center gap-1.5 rounded-lg group cursor-pointer hover:bg-indigo-600 transition-all shadow-sm">
                                                        <Bot className="h-2.5 w-2.5 text-indigo-600 group-hover:text-white transition-colors" />
                                                        <span className="text-[7px] font-bold text-indigo-600 group-hover:text-white uppercase tracking-widest transition-colors">AI PROCUREMENT MODE</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="relative border border-slate-200 focus-within:border-indigo-600 transition-all bg-slate-50/50 rounded-xl overflow-hidden group/composer shadow-inner">
                                                <textarea 
                                                    value={composerText}
                                                    onChange={(e) => setComposerText(e.target.value)}
                                                    placeholder={`Message to ${activeChat.company}...`}
                                                    className="w-full min-h-[80px] p-3 bg-transparent text-[12px] font-medium border-none focus:ring-0 resize-none no-scrollbar placeholder:text-slate-300 placeholder:uppercase placeholder:font-bold placeholder:text-[9px] placeholder:tracking-widest"
                                                />
                                                <div className="p-2 border-t border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-sm">
                                                    <div className="flex items-center gap-0.5">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" onClick={() => {}}><Paperclip className="h-3.5 w-3.5" /></Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="text-[8px] font-bold uppercase tracking-widest bg-slate-900 text-white border-none">Attach File</TooltipContent>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button 
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className={cn("h-7 w-7 rounded-lg transition-all", recording ? "text-rose-600 animate-pulse bg-rose-50 border-rose-100" : "text-slate-400 hover:text-indigo-600 hover:bg-slate-50")} 
                                                                    onClick={runVoiceDNA}
                                                                >
                                                                    {isAiProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mic className="h-3.5 w-3.5" />}
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="text-[8px] font-bold uppercase tracking-widest bg-slate-900 text-white border-none">Voice AI</TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {composerText.length > 20 && (
                                                            <Button variant="ghost" className="h-7 px-2.5 gap-1.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 text-[8px] font-bold uppercase tracking-widest rounded-lg transition-all" onClick={() => setIsAiProcessing(true)}>
                                                                <Sparkles className="h-3 w-3" /> Optimize AI
                                                            </Button>
                                                        )}
                                                        <Button onClick={() => setComposerText('')} className="h-7 px-4 bg-slate-900 text-white font-bold text-[9px] uppercase tracking-[0.15em] hover:bg-indigo-600 rounded-lg shadow-lg border border-slate-900 transition-all">
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
                        <Card className="w-72 border border-slate-100 bg-[#FBFBFC] flex flex-col p-4 space-y-6 overflow-y-auto no-scrollbar shrink-0 hover:border-indigo-100/50 transition-all rounded-xl shadow-sm">
                            <div className="space-y-4">
                                <header className="flex justify-between items-center border-b border-slate-200 pb-2 px-1">
                                    <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 italic">Deal Pulse</h3>
                                    <Signal className="h-3 w-3 text-emerald-500 animate-pulse" />
                                </header>
                                <div className="space-y-4 px-1">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold italic tracking-tighter uppercase text-slate-900 leading-none">{activeChat.sentiment}</span>
                                        <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-1.5 h-4 rounded flex items-center shadow-sm">94% CONFIDENCE</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span>Negotiation Progress</span>
                                            <span className="text-slate-900">65%</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner border border-slate-100">
                                            <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: '65%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <header className="flex justify-between items-center border-b border-slate-200 pb-2 px-1">
                                    <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 italic">Live SKU Context</h3>
                                </header>
                                <Card className="bg-white border border-slate-200 p-3 space-y-3 group/sku cursor-pointer hover:border-indigo-600 hover:shadow-md transition-all rounded-xl shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="bg-slate-900 text-white border-none text-[6px] h-3.5 font-bold tracking-widest uppercase px-1 shadow-sm">VIEWING NOW</Badge>
                                        <span className="text-[8px] font-bold text-indigo-600 animate-pulse uppercase tracking-widest">LIVE</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-12 w-10 bg-slate-100 rounded-lg relative overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                                            <Image src="https://picsum.photos/seed/sku1/200/300" alt="" fill className="object-cover transition-transform group-hover/sku:scale-110" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold uppercase truncate tracking-tighter text-slate-900 leading-none mb-1 group-hover/sku:text-indigo-600 transition-colors">{activeChat.lastSku}</p>
                                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight truncate leading-none mb-1 opacity-70">Wool Blend Oversized Coat</p>
                                            <p className="text-[9px] font-bold text-slate-900 tabular-nums leading-none">$240.00 <span className="text-emerald-600 ml-1 opacity-80">42% GM</span></p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full text-[7px] h-6 border-slate-200 uppercase font-bold tracking-widest hover:bg-slate-900 hover:text-white transition-all rounded-md shadow-sm">Adjust Quote</Button>
                                </Card>
                            </div>

                            <div className="flex-1 flex flex-col justify-end">
                                <Card className="p-4 bg-slate-900 border border-slate-800 text-white space-y-3 shadow-xl relative overflow-hidden group/ai rounded-xl">
                                    <Sparkles className="absolute -right-2 -top-2 h-12 w-12 text-indigo-600 opacity-[0.1] rotate-12 transition-all group-hover/ai:scale-110 group-hover/ai:opacity-[0.2]" />
                                    <div className="flex items-center gap-2 relative z-10">
                                        <div className="h-6 w-6 bg-indigo-600 rounded-lg flex items-center justify-center border border-indigo-500 shadow-lg">
                                            <Bot className="h-3 w-3 text-white" />
                                        </div>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300">AI Closer</p>
                                    </div>
                                    <p className="text-[10px] font-bold leading-relaxed italic text-slate-400 relative z-10 uppercase tracking-tight opacity-80">"Intent peaked at 94%. Recommend 5% discount for MOQ 50 to lock production this week."</p>
                                    <Button className="w-full h-8 bg-white text-slate-900 text-[8px] font-bold uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all relative z-10 rounded-lg shadow-xl">Apply Strategy</Button>
                                </Card>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

                {/* AI Handshake Dialog (Messages OS Feature) */}
                <Dialog open={isNegotiationOpen} onOpenChange={setIsNegotiationOpen}>
                    <DialogContent className="max-w-2xl bg-white border-none p-0 overflow-hidden shadow-2xl rounded-none">
                        <div className="bg-black p-4 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge className="bg-blue-600 text-white border-none text-[9px] font-black uppercase tracking-[0.2em] mb-4">AI Negotiation Hub</Badge>
                                    <DialogTitle className="text-base font-black uppercase tracking-tighter italic">Handshake Strategy</DialogTitle>
                                    <DialogDescription className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-2">Анализ рычагов влияния и сценарии закрытия сделки</DialogDescription>
                                </div>
                                <Handshake className="h-12 w-12 text-zinc-800" />
                            </div>
                        </div>
                        <div className="p-3 space-y-4 bg-[#FBFBFC]">
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'SENTIMENT', val: 'Bullish', color: 'text-emerald-600' },
                                    { label: 'LEVERAGE', val: 'High', color: 'text-blue-600' },
                                    { label: 'RISK', val: 'Minimal', color: 'text-zinc-400' }
                                ].map(s => (
                                    <div key={s.label} className="p-4 bg-white border border-zinc-100">
                                        <p className="text-[9px] font-black text-zinc-400 uppercase mb-1">{s.label}</p>
                                        <span className={cn("text-sm font-black uppercase", s.color)}>{s.val}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-zinc-900 text-white space-y-4">
                                <div className="flex items-center gap-2 text-blue-400">
                                    <Zap className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Recommended Next Move</span>
                                </div>
                                <p className="text-sm font-bold leading-tight italic">"Предложите постоплату 30/70 в обмен на увеличение заказа на 15%. Это закроет потребность байера в ликвидности."</p>
                                <Button className="bg-white text-black font-black text-[10px] uppercase w-full h-10 mt-2" onClick={() => { setComposerText("Мы готовы предложить условия 30/70 при увеличении объема заказа на 15%..."); setIsNegotiationOpen(false); }}>Use This Phrase</Button>
                            </div>
                        </div>
                        <DialogFooter className="p-4 bg-white border-t border-zinc-100">
                            <Button variant="outline" className="rounded-none font-black text-[10px] uppercase tracking-widest h-12 px-8" onClick={() => setIsNegotiationOpen(false)}>Close Matrix</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
        </TooltipProvider>
    );
}
