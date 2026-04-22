import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { 
  Sparkles, Phone, Video, MoreVertical, Users, Archive, Settings, ExternalLink, Package, Factory, Calendar
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
  onOpenSettings
}) => {
  if (!activeChat) return null;

  return (
    <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-1 ring-slate-100">
          <AvatarFallback className="text-xs font-bold uppercase bg-slate-100 text-slate-400">{activeChat.title[0]}</AvatarFallback>
          <AvatarImage src={typeof activeChat.avatar === 'string' ? activeChat.avatar : undefined} />
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase truncate leading-none">{activeChat.title}</h2>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Active Thread</span>
            </div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate opacity-60">{activeChat.subtitle}</span>
            {(activeChat as any).linkOrderId && (
              <Link href={ROUTES.brand.b2bOrders} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100 text-[8px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors">
                <Package className="h-2.5 w-2.5" /> Заказ
              </Link>
            )}
            {(activeChat as any).linkCollectionId && (
              <Link href={ROUTES.brand.production} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100 text-[8px] font-bold uppercase tracking-widest hover:bg-amber-100 transition-colors">
                <Factory className="h-2.5 w-2.5" /> Production
              </Link>
            )}
            {(activeChat as any).calendarHref && (
              <Link href={(activeChat as any).calendarHref} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100 text-[8px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors">
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
                className={cn("h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm transition-all hover:bg-indigo-600 hover:text-white", isSummarizing && "animate-pulse")} 
                onClick={onGenerateSummary}
                disabled={isSummarizing}
              >
                <Sparkles className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-[9px] font-bold uppercase tracking-widest bg-slate-900 text-white border-none">AI Summary</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm" onClick={() => onOpenCallSetup('audio')}><Phone className="h-3.5 w-3.5" /></Button>
            </TooltipTrigger>
            <TooltipContent className="text-[9px] font-bold uppercase tracking-widest bg-slate-900 text-white border-none">Audio Call</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm" onClick={() => onOpenCallSetup('video')}><Video className="h-3.5 w-3.5" /></Button>
            </TooltipTrigger>
            <TooltipContent className="text-[9px] font-bold uppercase tracking-widest bg-slate-900 text-white border-none">Video Meeting</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"><MoreVertical className="h-3.5 w-3.5" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl p-1 min-w-[180px]">
            <DropdownMenuItem className="rounded-lg font-bold text-[10px] uppercase tracking-widest p-2.5 transition-colors cursor-pointer" onClick={onOpenParticipants}><Users className="h-3.5 w-3.5 mr-2.5" /> Manage Participants</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg font-bold text-[10px] uppercase tracking-widest p-2.5 transition-colors cursor-pointer" onClick={onOpenArchive}><Archive className="h-3.5 w-3.5 mr-2.5" /> Content Archive</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg font-bold text-[10px] uppercase tracking-widest p-2.5 transition-colors cursor-pointer" onClick={onOpenSettings}><Settings className="h-3.5 w-3.5 mr-2.5" /> Chat Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
