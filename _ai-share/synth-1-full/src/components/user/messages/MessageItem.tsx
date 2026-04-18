import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import Image from 'next/image';
import {
  Pin,
  Star,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Heart,
  Smile,
  FileText,
  Download,
  Zap,
  PlusCircle,
  Trash2,
  Forward,
  Reply,
  Pencil,
  MoreVertical,
  Package,
  Factory,
  CreditCard,
  Calendar,
  ShoppingCart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
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
  setReminderOpen,
}) => {
  const isTask = m.type === 'task';
  const status = isTask ? statusConfig[(m.status ?? 'pending') as TaskStatus] : null;

  return (
    <div
      id={`msg_${m.id}`}
      className={cn('flex items-end gap-3', mine ? 'justify-end' : 'justify-start')}
    >
      {!mine && (
        <div className="relative">
          <div className="bg-bg-surface2 border-border-default flex h-8 w-8 shrink-0 items-center justify-center border text-[10px] font-black uppercase">
            {String(m.user ?? '?')[0]}
          </div>
          {(() => {
            const p = activeChat?.participants?.find((p) => p.name === m.user);
            if (!p) return null;
            return (
              <span
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white shadow-sm',
                  p.isOnline ? 'bg-emerald-500' : 'bg-rose-500'
                )}
              />
            );
          })()}
        </div>
      )}

      <div className="group relative max-w-[min(800px,85%)]">
        <div
          className={cn(
            'relative rounded-none border px-6 py-4 transition-all',
            mine
              ? 'bg-text-primary border-white/10 text-white'
              : 'text-text-primary border-border-subtle bg-white',
            isTask && 'border-l-4 border-l-emerald-500 shadow-lg shadow-emerald-50/50'
          )}
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className={cn(
                'text-[9px] font-black uppercase tracking-widest',
                mine ? 'text-text-secondary' : 'text-text-muted'
              )}
            >
              {mine
                ? currentUserName
                : activeChat?.participants?.find((p) => p.id === m.user)?.name || m.user}
            </span>
          </div>

          {/* Прикреплённый товар */}
          {m.attachedProduct && (
            <div
              className={cn(
                'my-3 flex items-center gap-3 rounded-xl border p-3',
                mine
                  ? 'bg-text-primary/50 border-border-default'
                  : 'bg-bg-surface2 border-border-default'
              )}
            >
              {m.attachedProduct.images?.[0] && (
                <div className="bg-bg-surface2 relative h-14 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={m.attachedProduct.images[0].url}
                    alt={m.attachedProduct.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    'truncate text-[11px] font-bold uppercase tracking-tight',
                    mine ? 'text-white' : 'text-text-primary'
                  )}
                >
                  {m.attachedProduct.name}
                </p>
                {m.attachedProduct.sku && (
                  <p
                    className={cn(
                      'text-[9px] font-bold uppercase tracking-widest',
                      mine ? 'text-text-muted' : 'text-text-secondary'
                    )}
                  >
                    {m.attachedProduct.sku}
                  </p>
                )}
              </div>
              <Link
                href="/brand/products"
                className="text-accent-primary hover:text-accent-primary shrink-0 text-[8px] font-bold uppercase tracking-widest"
              >
                К товару →
              </Link>
            </div>
          )}

          {/* Ссылка на сущность (заказ, производство, оплата) */}
          {m.entityId && m.entityType && (
            <div
              className={cn(
                'my-2 flex flex-wrap gap-2',
                (m.entityType === 'order' || m.entityType === 'escrow') && 'mb-3'
              )}
            >
              {m.entityType === 'order' && (
                <Link
                  href={ROUTES.brand.b2bOrder(m.entityId)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase',
                    mine
                      ? 'bg-text-primary/50 border-border-default text-accent-primary hover:bg-text-primary/90'
                      : 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary hover:bg-accent-primary/15'
                  )}
                >
                  <ShoppingCart className="h-3 w-3" /> ORD-{m.entityId}
                </Link>
              )}
              {m.entityType === 'production' && (
                <Link
                  href="/brand/production"
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase',
                    mine
                      ? 'bg-text-primary/50 border-border-default hover:bg-text-primary/90 text-amber-300'
                      : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                  )}
                >
                  <Factory className="h-3 w-3" /> Production
                </Link>
              )}
              {m.entityType === 'escrow' && (
                <Link
                  href="/brand/finance/escrow"
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase',
                    mine
                      ? 'bg-text-primary/50 border-border-default hover:bg-text-primary/90 text-emerald-300'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  )}
                >
                  <CreditCard className="h-3 w-3" /> Escrow
                </Link>
              )}
              {m.entityType === 'task' && (
                <Link
                  href="/brand/calendar?layers=tasks"
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase',
                    mine
                      ? 'bg-text-primary/50 border-border-default text-accent-primary/50 hover:bg-text-primary/90'
                      : 'bg-accent-primary/10 border-accent-primary/25 text-accent-primary hover:bg-accent-primary/15'
                  )}
                >
                  <Calendar className="h-3 w-3" /> Задача
                </Link>
              )}
            </div>
          )}

          {/* JOOR Reminder Style */}
          {m.type === 'reminder' && m.reminderData && (
            <div className="bg-bg-surface2 border-border-default group/reminder relative my-3 space-y-5 overflow-hidden rounded-none border p-4">
              <div className="relative z-10">
                <div className="mb-2 flex items-center gap-3">
                  <Badge className="bg-text-primary rounded-none border-none px-2 py-0.5 text-[8px] font-black uppercase text-white">
                    ОПОПОЩЕНИЕ
                  </Badge>
                  <span className="text-text-muted text-[8px] font-black uppercase tracking-widest">
                    ID: {m.id.toString().slice(-4)}
                  </span>
                </div>
                <h4 className="text-text-primary mb-1 text-base font-black uppercase tracking-tight">
                  {m.reminderData.title}
                </h4>
                {m.reminderData.description && (
                  <p className="text-text-secondary text-[11px] font-medium italic leading-relaxed">
                    {m.reminderData.description}
                  </p>
                )}
              </div>
              <div className="border-border-default relative z-10 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-text-muted text-[7px] font-black uppercase tracking-widest">
                      DATE & TIME
                    </span>
                    <span className="text-text-primary text-[11px] font-black uppercase tracking-tight">
                      {m.reminderData.date} @ {m.reminderData.time}
                    </span>
                  </div>
                  {m.reminderData.reminderType === 'countdown' && (
                    <div className="flex flex-col">
                      <span className="text-text-muted text-[7px] font-black uppercase tracking-widest">
                        DUE IN
                      </span>
                      <span className="animate-pulse text-[11px] font-black tracking-tight text-rose-500">
                        ~ 2H 45M
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1">
                    {(m.reminderData.assignedTo || []).slice(0, 3).map((u: string, i: number) => (
                      <div
                        key={i}
                        className="bg-border-subtle text-text-secondary flex h-6 w-6 items-center justify-center border border-white text-[7px] font-black uppercase"
                      >
                        {u[0]}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border-default text-text-secondary h-7 rounded-none px-3 text-[8px] font-black uppercase hover:border-black hover:text-black"
                    onClick={() => {
                      setReminderEditing(m);
                      setReminderOpen(true);
                    }}
                  >
                    EDIT
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Task Metadata & Actions */}
          {isTask && (
            <div className="bg-bg-surface2/80 border-border-subtle/50 mt-4 space-y-4 rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-2 w-2 animate-pulse rounded-full',
                      status?.color.replace('text-', 'bg-')
                    )}
                  />
                  <span className="text-text-primary text-[10px] font-black uppercase tracking-widest">
                    {status?.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      'border-border-default h-5 rounded-none px-2 text-[8px] font-black uppercase',
                      priorityConfig[(m.priority ?? 'medium') as TaskPriority].color
                    )}
                  >
                    {priorityConfig[(m.priority ?? 'medium') as TaskPriority].label}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 rounded-xl border border-transparent px-3 text-[9px] font-black uppercase text-blue-600 hover:border-blue-100 hover:bg-white"
                    onClick={() => onOpenTaskProcess(m.id)}
                  >
                    ПЕРЕЙТИ В ЦИКЛ
                  </Button>
                </div>
              </div>
              <div className="bg-bg-surface2/50 h-px" />
              <div className="flex items-center justify-between gap-3">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {(m.assignees || []).map((u, i) => (
                    <Avatar
                      key={i}
                      className="ring-border-subtle h-6 w-6 border-2 border-white shadow-sm ring-1"
                    >
                      <AvatarFallback className="bg-bg-surface2 text-text-secondary text-[7px] font-black uppercase">
                        {u[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                {m.deadline && (
                  <div className="border-border-subtle flex items-center gap-2 rounded-lg border bg-white px-3 py-1 shadow-sm">
                    <span className="text-text-muted text-[7px] font-black uppercase tracking-widest">
                      DEADLINE
                    </span>
                    <span className="text-text-secondary text-[9px] font-black tabular-nums">
                      {new Date(m.deadline).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="whitespace-pre-wrap break-words text-sm font-medium leading-relaxed">
            {highlightText(m.text, msgSearch)}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'text-[9px] font-bold uppercase tabular-nums tracking-widest',
                  mine ? 'text-text-secondary' : 'text-text-muted'
                )}
              >
                {m.time}
              </span>
              {m.readBy && m.readBy.length > 0 && mine && (
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-blue-400">
                    ПРОСМОТРЕНО: {m.readBy.length}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-bg-surface2 text-text-muted h-6 w-6 p-0 hover:text-blue-500"
                onClick={() => onTogglePin(m.id)}
              >
                <Pin
                  className={cn(
                    'h-3 w-3 transition-transform',
                    m.isPinned && 'rotate-45 fill-blue-500 text-blue-500'
                  )}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-bg-surface2 text-text-muted h-6 w-6 p-0 hover:text-amber-500"
                onClick={() => onToggleStar(m.id)}
              >
                <Star className={cn('h-3 w-3', m.isStarred && 'fill-amber-500 text-amber-500')} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-bg-surface2 text-text-muted h-6 w-6 p-0"
                onClick={() => onReplyToMessage(m.id)}
              >
                <Reply className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-bg-surface2 text-text-muted h-6 w-6 p-0"
                onClick={() => onForwardMessage(m.id)}
              >
                <Forward className="h-3 w-3" />
              </Button>
              {mine && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-bg-surface2 text-text-muted h-6 w-6 p-0"
                    onClick={() => onOpenEditTask(m)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-bg-surface2 h-6 w-6 p-0 text-rose-400"
                    onClick={() => onDeleteMessage(m.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* AI Helper Bar */}
          {!mine && (
            <div className="border-border-subtle mt-4 flex flex-col gap-3 border-t pt-4 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
                    <Sparkles className="h-2.5 w-2.5 text-blue-500" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">
                    AI ПОМОЩНИК
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!isTask && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="flex h-8 items-center justify-center gap-2 rounded-full bg-blue-600 px-3 text-white transition-colors hover:bg-blue-700"
                            onClick={() => {
                              onOpenCreateTask({
                                text: m.text,
                                type: 'task',
                                status: 'pending',
                                priority: 'medium',
                                assignees: [],
                                deadline: undefined,
                              });
                            }}
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="text-[8px] font-black uppercase tracking-widest">
                              В задачу
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="text-[8px] font-black uppercase">
                          Превратить в задачу
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {[
                    { Icon: ThumbsUp, label: '👍' },
                    { Icon: ThumbsDown, label: '👎' },
                    { Icon: Heart, label: '❤️' },
                    { Icon: Smile, label: '😊' },
                  ].map(({ Icon, label }, idx) => (
                    <button
                      key={idx}
                      className="hover:bg-bg-surface2 text-text-muted flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:text-blue-600"
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
          {m.type === 'message' &&
            (String(m.text).toLowerCase().includes('сделаю') ||
              String(m.text).toLowerCase().includes('пришлю') ||
              String(m.text).toLowerCase().includes('дедлайн')) && (
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/50 p-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 fill-blue-500 text-blue-500" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">
                    AI: Обнаружено обязательство
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 rounded-lg border border-blue-100 bg-white px-2 text-[8px] font-black uppercase text-blue-700 shadow-sm"
                  onClick={() => onOpenCreateTask({ text: m.text, type: 'task' })}
                >
                  В задачи
                </Button>
              </div>
            )}
        </div>
      </div>

      {mine && (
        <Avatar className="h-8 w-8 shrink-0 border-2 border-white shadow-sm">
          <AvatarFallback className="bg-text-primary text-[10px] font-black uppercase text-white">
            {currentUser[0]}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
