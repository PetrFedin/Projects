import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Sparkles,
  Phone,
  Video,
  MoreVertical,
  Users,
  Archive,
  Settings,
  ExternalLink,
  Package,
  Factory,
  Calendar,
} from 'lucide-react';
import { Chat as ChatConversation } from '@/lib/types';
import { ROUTES } from '@/lib/routes';
import { ID } from './types';

interface ChatHeaderProps {
  activeChat: ChatConversation | undefined;
  isSummarizing: boolean;
  onGenerateSummary: () => void;
  onOpenCallSetup: (type: 'audio' | 'video') => void;
  onOpenParticipants: () => void;
  onOpenArchive: () => void;
  onOpenSettings: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  activeChat,
  isSummarizing,
  onGenerateSummary,
  onOpenCallSetup,
  onOpenParticipants,
  onOpenArchive,
  onOpenSettings,
}) => {
  if (!activeChat) return null;

  return (
<<<<<<< HEAD
    <header className="sticky top-0 z-20 flex shrink-0 items-center justify-between border-b border-slate-100 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-1 ring-slate-100">
          <AvatarFallback className="bg-slate-100 text-xs font-bold uppercase text-slate-400">
=======
    <header className="border-border-subtle sticky top-0 z-20 flex shrink-0 items-center justify-between border-b bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="ring-border-subtle size-10 border-2 border-white shadow-md ring-1">
          <AvatarFallback className="bg-bg-surface2 text-text-muted text-xs font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
            {activeChat.title[0]}
          </AvatarFallback>
          <AvatarImage
            src={typeof activeChat.avatar === 'string' ? activeChat.avatar : undefined}
          />
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
<<<<<<< HEAD
            <h2 className="truncate text-base font-bold uppercase leading-none tracking-tight text-slate-900">
=======
            <h2 className="text-text-primary truncate text-base font-bold uppercase leading-none tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
              {activeChat.title}
            </h2>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-1.5 py-0.5">
<<<<<<< HEAD
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
=======
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
>>>>>>> recover/cabinet-wip-from-stash
              <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-600">
                Active Thread
              </span>
            </div>
<<<<<<< HEAD
            <span className="truncate text-[8px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
              {activeChat.subtitle}
            </span>
            {(activeChat as any).linkOrderId && (
              <Link
                href="/brand/b2b-orders"
                className="inline-flex items-center gap-1 rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-indigo-600 transition-colors hover:bg-indigo-100"
              >
                <Package className="h-2.5 w-2.5" /> Заказ
              </Link>
            )}
            {(activeChat as any).linkCollectionId && (
              <Link
                href="/brand/production"
                className="inline-flex items-center gap-1 rounded-md border border-amber-100 bg-amber-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-amber-600 transition-colors hover:bg-amber-100"
              >
                <Factory className="h-2.5 w-2.5" /> Production
              </Link>
            )}
            {(activeChat as any).calendarHref && (
              <Link
                href={(activeChat as any).calendarHref}
                className="inline-flex items-center gap-1 rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-indigo-600 transition-colors hover:bg-indigo-100"
              >
                <Calendar className="h-2.5 w-2.5" /> Календарь
=======
            <span className="text-text-muted truncate text-[8px] font-bold uppercase tracking-widest opacity-60">
              {activeChat.subtitle}
            </span>
            {activeChat.linkOrderId && (
              <Link
                href={ROUTES.brand.b2bOrders}
                className="border-accent-primary/20 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/15 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest transition-colors"
              >
                <Package className="size-2.5" /> Заказ
              </Link>
            )}
            {activeChat.linkCollectionId && (
              <Link
                href={ROUTES.brand.production}
                className="inline-flex items-center gap-1 rounded-md border border-amber-100 bg-amber-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-amber-600 transition-colors hover:bg-amber-100"
              >
                <Factory className="size-2.5" /> Production
              </Link>
            )}
            {activeChat.calendarHref && (
              <Link
                href={activeChat.calendarHref}
                className="border-accent-primary/20 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/15 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest transition-colors"
              >
                <Calendar className="size-2.5" /> Календарь
>>>>>>> recover/cabinet-wip-from-stash
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
<<<<<<< HEAD
                  'h-8 w-8 rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-sm transition-all hover:bg-indigo-600 hover:text-white',
=======
                  'border-accent-primary/20 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary size-8 rounded-lg border shadow-sm transition-all hover:text-white',
>>>>>>> recover/cabinet-wip-from-stash
                  isSummarizing && 'animate-pulse'
                )}
                onClick={onGenerateSummary}
                disabled={isSummarizing}
              >
                <Sparkles className="size-3.5" />
              </Button>
            </TooltipTrigger>
<<<<<<< HEAD
            <TooltipContent className="border-none bg-slate-900 text-[9px] font-bold uppercase tracking-widest text-white">
=======
            <TooltipContent className="bg-text-primary border-none text-[9px] font-bold uppercase tracking-widest text-white">
>>>>>>> recover/cabinet-wip-from-stash
              AI Summary
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
<<<<<<< HEAD
                className="h-8 w-8 rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                onClick={() => onOpenCallSetup('audio')}
              >
                <Phone className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="border-none bg-slate-900 text-[9px] font-bold uppercase tracking-widest text-white">
=======
                className="border-border-default text-text-muted hover:border-text-primary hover:bg-text-primary/90 size-8 rounded-lg border bg-white shadow-sm transition-all hover:text-white"
                onClick={() => onOpenCallSetup('audio')}
              >
                <Phone className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-text-primary border-none text-[9px] font-bold uppercase tracking-widest text-white">
>>>>>>> recover/cabinet-wip-from-stash
              Audio Call
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
<<<<<<< HEAD
                className="h-8 w-8 rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                onClick={() => onOpenCallSetup('video')}
              >
                <Video className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="border-none bg-slate-900 text-[9px] font-bold uppercase tracking-widest text-white">
=======
                className="border-border-default text-text-muted hover:border-text-primary hover:bg-text-primary/90 size-8 rounded-lg border bg-white shadow-sm transition-all hover:text-white"
                onClick={() => onOpenCallSetup('video')}
              >
                <Video className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-text-primary border-none text-[9px] font-bold uppercase tracking-widest text-white">
>>>>>>> recover/cabinet-wip-from-stash
              Video Meeting
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
<<<<<<< HEAD
              className="h-8 w-8 rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
            >
              <MoreVertical className="h-3.5 w-3.5" />
=======
              className="border-border-default text-text-muted hover:border-text-primary hover:bg-text-primary/90 size-8 rounded-lg border bg-white shadow-sm transition-all hover:text-white"
            >
              <MoreVertical className="size-3.5" />
>>>>>>> recover/cabinet-wip-from-stash
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
<<<<<<< HEAD
            className="min-w-[180px] rounded-xl border-slate-100 p-1 shadow-xl"
          >
            <DropdownMenuItem
              className="cursor-pointer rounded-lg p-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors"
              onClick={onOpenParticipants}
            >
              <Users className="mr-2.5 h-3.5 w-3.5" /> Manage Participants
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded-lg p-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors"
              onClick={onOpenArchive}
            >
              <Archive className="mr-2.5 h-3.5 w-3.5" /> Content Archive
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded-lg p-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors"
              onClick={onOpenSettings}
            >
              <Settings className="mr-2.5 h-3.5 w-3.5" /> Chat Settings
=======
            className="border-border-subtle min-w-[180px] rounded-xl p-1 shadow-xl"
          >
            <DropdownMenuItem
              className="cursor-pointer rounded-lg p-2.5 text-xs font-bold uppercase tracking-widest transition-colors"
              onClick={onOpenParticipants}
            >
              <Users className="mr-2.5 size-3.5" /> Manage Participants
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded-lg p-2.5 text-xs font-bold uppercase tracking-widest transition-colors"
              onClick={onOpenArchive}
            >
              <Archive className="mr-2.5 size-3.5" /> Content Archive
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded-lg p-2.5 text-xs font-bold uppercase tracking-widest transition-colors"
              onClick={onOpenSettings}
            >
              <Settings className="mr-2.5 size-3.5" /> Chat Settings
>>>>>>> recover/cabinet-wip-from-stash
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
