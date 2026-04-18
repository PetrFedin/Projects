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
    <header className="sticky top-0 z-20 flex shrink-0 items-center justify-between border-b border-slate-100 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-1 ring-slate-100">
          <AvatarFallback className="bg-slate-100 text-xs font-bold uppercase text-slate-400">
            {activeChat.title[0]}
          </AvatarFallback>
          <AvatarImage
            src={typeof activeChat.avatar === 'string' ? activeChat.avatar : undefined}
          />
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-bold uppercase leading-none tracking-tight text-slate-900">
              {activeChat.title}
            </h2>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-1.5 py-0.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-600">
                Active Thread
              </span>
            </div>
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
                  'h-8 w-8 rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-sm transition-all hover:bg-indigo-600 hover:text-white',
                  isSummarizing && 'animate-pulse'
                )}
                onClick={onGenerateSummary}
                disabled={isSummarizing}
              >
                <Sparkles className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="border-none bg-slate-900 text-[9px] font-bold uppercase tracking-widest text-white">
              AI Summary
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                onClick={() => onOpenCallSetup('audio')}
              >
                <Phone className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="border-none bg-slate-900 text-[9px] font-bold uppercase tracking-widest text-white">
              Audio Call
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                onClick={() => onOpenCallSetup('video')}
              >
                <Video className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="border-none bg-slate-900 text-[9px] font-bold uppercase tracking-widest text-white">
              Video Meeting
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
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
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
