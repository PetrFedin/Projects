import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Pin, Star, ThumbsUp, ThumbsDown, Sparkles, Heart, Smile, 
  FileText, Download, Zap, PlusCircle, Trash2, Forward, Reply, Pencil, MoreVertical,
  Package, Factory, CreditCard, Calendar, ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage, TaskStatus, TaskPriority, Chat as ChatConversation } from '@/lib/types';
import { statusConfig, priorityConfig } from './constants';
import { highlightText } from './utils';

interface MessageItemProps {
  message: ChatMessage;
  mine: boolean;
  activeChat: ChatConversation | undefined;
  currentUser: string;
  currentUserName: string;
  msgSearch: string;
  onOpenEditTask: (m: ChatMessage) => void;
  onOpenTaskProcess: (id: number) => void;
  onTogglePin: (id: number) => void;
  onToggleStar: (id: number) => void;
  onAddReaction: (id: number, r: string) => void;
  onDeleteMessage: (id: number) => void;
  onForwardMessage: (id: number) => void;
  onReplyToMessage: (id: number) => void;
  onScrollToMessage: (id: number) => void;
  onOpenCreateTask: (initial?: Partial<ChatMessage>) => void;
  setReminderEditing: (m: ChatMessage | null) => void;
  setReminderOpen: (open: boolean) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message: m,
  mine,
  activeChat,
  currentUser,
  currentUserName,
  msgSearch,
  onOpenEditTask,
  onOpenTaskProcess,
  onTogglePin,
  onToggleStar,
  onAddReaction,
  onDeleteMessage,
  onForwardMessage,
  onReplyToMessage,
  onScrollToMessage,
  onOpenCreateTask,
  setReminderEditing,
  setReminderOpen
}) => {
  const isTask = m.type === 'task';
  const status = isTask ? statusConfig[(m.status ?? 'pending') as TaskStatus] : null;

  return (
    <div id={`msg_${m.id}`} className={cn('flex items-end gap-3', mine ? 'justify-end' : 'justify-start')}>
      {!mine && (
        <div className="relative">
          <div className="h-8 w-8 bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] font-black shrink-0 uppercase">
            {String(m.user ?? '?')[0]}
          </div>
          {(() => {
            const p = activeChat?.participants?.find(p => p.name === m.user);
            if (!p) return null;
            return <span className={cn("absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white shadow-sm", p.isOnline ? "bg-emerald-500" : "bg-rose-500")} />;
          })()}
        </div>
      )}

      <div className="group relative max-w-[min(800px,85%)]">
        <div className={cn(
          'rounded-none px-6 py-4 border transition-all relative',
          mine ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white text-zinc-800 border-zinc-100',
          isTask && 'border-l-4 border-l-emerald-500 shadow-lg shadow-emerald-50/50'
        )}>
          <div className="flex items-center gap-2 mb-2">
            <span className={cn("text-[9px] font-black uppercase tracking-widest", mine ? 'text-zinc-500' : 'text-zinc-400')}>
              {mine ? currentUserName : (activeChat?.participants?.find(p => p.id === m.user)?.name || m.user)}
            </span>
          </div>

          {/* Прикреплённый товар */}
          {m.attachedProduct && (
            <div className={cn("my-3 p-3 rounded-xl border flex items-center gap-3", mine ? "bg-zinc-800/50 border-zinc-700" : "bg-slate-50 border-slate-200")}>
              {m.attachedProduct.images?.[0] && (
                <div className="relative h-14 w-12 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                  <Image src={m.attachedProduct.images[0].url} alt={m.attachedProduct.name} fill className="object-cover" sizes="48px" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={cn("text-[11px] font-bold uppercase tracking-tight truncate", mine ? "text-white" : "text-slate-900")}>{m.attachedProduct.name}</p>
                {m.attachedProduct.sku && <p className={cn("text-[9px] font-bold uppercase tracking-widest", mine ? "text-zinc-400" : "text-slate-500")}>{m.attachedProduct.sku}</p>}
              </div>
              <Link href="/brand/products" className="shrink-0 text-[8px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700">
                К товару →
              </Link>
            </div>
          )}

          {/* Ссылка на сущность (заказ, производство, оплата) */}
          {m.entityId && m.entityType && (
            <div className={cn("my-2 flex flex-wrap gap-2", (m.entityType === 'order' || m.entityType === 'escrow') && "mb-3")}>
              {m.entityType === 'order' && (
                <Link href={`/brand/b2b-orders/${m.entityId}`} className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase", mine ? "bg-zinc-800/50 border-zinc-600 text-indigo-300 hover:bg-zinc-700" : "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100")}>
                  <ShoppingCart className="h-3 w-3" /> ORD-{m.entityId}
                </Link>
              )}
              {m.entityType === 'production' && (
                <Link href="/brand/production" className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase", mine ? "bg-zinc-800/50 border-zinc-600 text-amber-300 hover:bg-zinc-700" : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100")}>
                  <Factory className="h-3 w-3" /> Production
                </Link>
              )}
              {m.entityType === 'escrow' && (
                <Link href="/brand/finance/escrow" className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase", mine ? "bg-zinc-800/50 border-zinc-600 text-emerald-300 hover:bg-zinc-700" : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100")}>
                  <CreditCard className="h-3 w-3" /> Escrow
                </Link>
              )}
              {m.entityType === 'task' && (
                <Link href="/brand/calendar?layers=tasks" className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase", mine ? "bg-zinc-800/50 border-zinc-600 text-violet-300 hover:bg-zinc-700" : "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100")}>
                  <Calendar className="h-3 w-3" /> Задача
                </Link>
              )}
            </div>
          )}

          {/* JOOR Reminder Style */}
          {m.type === 'reminder' && m.reminderData && (
            <div className="my-3 p-4 bg-zinc-50 border border-zinc-200 rounded-none space-y-5 relative overflow-hidden group/reminder">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-zinc-900 text-white border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-none">ОПОПОЩЕНИЕ</Badge>
                  <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">ID: {m.id.toString().slice(-4)}</span>
                </div>
                <h4 className="text-base font-black tracking-tight uppercase text-zinc-900 mb-1">{m.reminderData.title}</h4>
                {m.reminderData.description && (
                  <p className="text-[11px] font-medium text-zinc-500 leading-relaxed italic">{m.reminderData.description}</p>
                )}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-200 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black uppercase text-zinc-400 tracking-widest">DATE & TIME</span>
                    <span className="text-[11px] font-black tracking-tight text-zinc-900 uppercase">{m.reminderData.date} @ {m.reminderData.time}</span>
                  </div>
                  {m.reminderData.reminderType === 'countdown' && (
                    <div className="flex flex-col">
                      <span className="text-[7px] font-black uppercase text-zinc-400 tracking-widest">DUE IN</span>
                      <span className="text-[11px] font-black tracking-tight text-rose-500 animate-pulse">~ 2H 45M</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1">
                    {(m.reminderData.assignedTo || []).slice(0, 3).map((u: string, i: number) => (
                      <div key={i} className="h-6 w-6 border border-white bg-zinc-200 flex items-center justify-center text-[7px] font-black text-zinc-600 uppercase">{u[0]}</div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="h-7 px-3 border-zinc-200 text-zinc-500 hover:text-black hover:border-black rounded-none font-black text-[8px] uppercase" onClick={() => { setReminderEditing(m); setReminderOpen(true); }}>
                    EDIT
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Task Metadata & Actions */}
          {isTask && (
            <div className="mt-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full animate-pulse", status?.color.replace('text-', 'bg-'))} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">
                    {status?.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={cn("text-[8px] font-black uppercase h-5 rounded-none border-slate-200 px-2", priorityConfig[(m.priority ?? 'medium') as TaskPriority].color)}>
                    {priorityConfig[(m.priority ?? 'medium') as TaskPriority].label}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-3 text-[9px] font-black uppercase text-blue-600 hover:bg-white border border-transparent hover:border-blue-100 rounded-xl"
                    onClick={() => onOpenTaskProcess(m.id)}
                  >
                    ПЕРЕЙТИ В ЦИКЛ
                  </Button>
                </div>
              </div>
              <div className="h-px bg-slate-100/50" />
              <div className="flex items-center justify-between gap-3">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {(m.assignees || []).map((u, i) => (
                    <Avatar key={i} className="h-6 w-6 border-2 border-white shadow-sm ring-1 ring-slate-100">
                      <AvatarFallback className="text-[7px] font-black uppercase bg-slate-100 text-slate-500">{u[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                {m.deadline && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                    <span className="text-[7px] font-black uppercase text-slate-300 tracking-widest">DEADLINE</span>
                    <span className="text-[9px] font-black text-slate-600 tabular-nums">
                      {new Date(m.deadline).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap break-words">
            {highlightText(m.text, msgSearch)}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={cn("text-[9px] font-bold tabular-nums uppercase tracking-widest", mine ? 'text-zinc-500' : 'text-zinc-400')}>
                {m.time}
              </span>
              {m.readBy && m.readBy.length > 0 && mine && (
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">ПРОСМОТРЕНО: {m.readBy.length}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-slate-100 text-slate-400 hover:text-blue-500" onClick={() => onTogglePin(m.id)}>
                <Pin className={cn("h-3 w-3 transition-transform", m.isPinned && "fill-blue-500 text-blue-500 rotate-45")} />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-slate-100 text-slate-400 hover:text-amber-500" onClick={() => onToggleStar(m.id)}>
                <Star className={cn("h-3 w-3", m.isStarred && "fill-amber-500 text-amber-500")} />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-slate-100 text-slate-400" onClick={() => onReplyToMessage(m.id)}>
                <Reply className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-slate-100 text-slate-400" onClick={() => onForwardMessage(m.id)}>
                <Forward className="h-3 w-3" />
              </Button>
              {mine && (
                <>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-slate-100 text-slate-400" onClick={() => onOpenEditTask(m)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-slate-100 text-rose-400" onClick={() => onDeleteMessage(m.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* AI Helper Bar */}
          {!mine && (
            <div className="mt-4 pt-4 border-t border-slate-50 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                    <Sparkles className="h-2.5 w-2.5 text-blue-500" />
                  </div>
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">AI ПОМОЩНИК</span>
                </div>
                <div className="flex items-center gap-2">
                  {!isTask && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            className="h-8 px-3 rounded-full flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 transition-colors gap-2"
                            onClick={() => {
                              onOpenCreateTask({ 
                                text: m.text, 
                                type: 'task', 
                                status: 'pending', 
                                priority: 'medium', 
                                assignees: [], 
                                deadline: undefined 
                              });
                            }}
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="text-[8px] font-black uppercase tracking-widest">В задачу</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="text-[8px] font-black uppercase">Превратить в задачу</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {[
                    { Icon: ThumbsUp, label: '👍' },
                    { Icon: ThumbsDown, label: '👎' },
                    { Icon: Heart, label: '❤️' },
                    { Icon: Smile, label: '😊' }
                  ].map(({ Icon, label }, idx) => (
                    <button 
                      key={idx} 
                      className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors"
                      onClick={() => onAddReaction(m.id, label)}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI detected commitment */}
          {m.type === 'message' && (String(m.text).toLowerCase().includes('сделаю') || String(m.text).toLowerCase().includes('пришлю') || String(m.text).toLowerCase().includes('дедлайн')) && (
            <div className="mt-4 p-3 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-blue-500 fill-blue-500" />
                <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">AI: Обнаружено обязательство</span>
              </div>
              <Button variant="ghost" size="sm" className="h-6 px-2 rounded-lg text-[8px] font-black uppercase text-blue-700 bg-white shadow-sm border border-blue-100" onClick={() => onOpenCreateTask({ text: m.text, type: 'task' })}>В задачи</Button>
            </div>
          )}
        </div>
      </div>

      {mine && (
        <Avatar className="h-8 w-8 border-2 border-white shadow-sm shrink-0">
          <AvatarFallback className="text-[10px] font-black bg-slate-900 text-white uppercase">{currentUser[0]}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
