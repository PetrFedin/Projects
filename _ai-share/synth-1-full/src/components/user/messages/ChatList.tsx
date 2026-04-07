import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Pin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Chat as ChatConversation } from '@/lib/types';
import { ID } from './types';

interface ChatListProps {
  visibleChats: ChatConversation[];
  activeChatId: ID;
  onSwitchChat: (id: ID) => void;
  onOpenCreateChat: () => void;
  chatQuery: string;
  setChatQuery: (q: string) => void;
  unreadCountByChat: Record<ID, number>;
  typingUsers: Record<ID, string[]>;
  currentUser: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  visibleChats,
  activeChatId,
  onSwitchChat,
  onOpenCreateChat,
  chatQuery,
  setChatQuery,
  unreadCountByChat,
  typingUsers,
  currentUser
}) => {
  return (
    <aside className="w-64 shrink-0 bg-white rounded-2xl p-4 flex flex-col gap-3 overflow-hidden border border-slate-100 shadow-sm transition-all">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Conversations</h3>
        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-100 text-indigo-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm" onClick={onOpenCreateChat}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative group">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        <Input 
          className="bg-slate-100 border-transparent rounded-lg h-8 pl-8 font-bold text-[10px] placeholder:text-slate-400 focus:bg-white focus:border-indigo-100 transition-all shadow-inner" 
          placeholder="SEARCH CONTACTS…" 
          value={chatQuery}
          onChange={e => setChatQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="space-y-1.5">
          {visibleChats.map((c) => {
            const unread = unreadCountByChat[c.id] ?? 0;
            const isActive = c.id === activeChatId;
            
            const otherParticipants = c.participants?.filter(p => p.id !== currentUser) || [];
            const isAnyOnline = otherParticipants.some(p => p.isOnline);
            const statusColor = otherParticipants.length === 1 
              ? (otherParticipants[0].isOnline ? "bg-emerald-500" : "bg-slate-300")
              : (isAnyOnline ? "bg-emerald-500" : "bg-slate-300");

            return (
              <div key={c.id} className="group/chat-item relative w-full overflow-hidden transition-all">
                <button
                  className={cn(
                    'w-full text-left p-2.5 rounded-xl transition-all flex gap-3 items-center relative min-w-0 border',
                    isActive ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-transparent border-transparent hover:bg-slate-50'
                  )}
                  onClick={() => onSwitchChat(c.id)}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-100">
                      <AvatarFallback className="text-[10px] font-bold uppercase bg-slate-100 text-slate-400">{c.title[0]}</AvatarFallback>
                      <AvatarImage src={typeof c.avatar === 'string' ? c.avatar : undefined} />
                    </Avatar>
                    <span className={cn("absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm", statusColor)} />
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 min-w-4 bg-indigo-600 text-white text-[8px] font-bold flex items-center justify-center rounded-full ring-2 ring-white shadow-lg">
                        {unread}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex justify-between items-baseline gap-1.5 mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <p className={cn("text-[11px] font-bold uppercase tracking-tight truncate leading-none", isActive ? 'text-indigo-700' : 'text-slate-900')}>
                          {c.title}
                        </p>
                        <div className="flex gap-0.5">
                          {c.isPinned && <Pin className="h-2 w-2 text-indigo-400 shrink-0 rotate-45" />}
                          {c.isStarred && <Star className="h-2 w-2 text-amber-400 shrink-0 fill-amber-400" />}
                        </div>
                      </div>
                      <span className="text-[7px] font-bold text-slate-300 uppercase shrink-0 tabular-nums">{c.time}</span>
                    </div>
                    <div className="min-w-0 flex items-center overflow-hidden">
                      {typingUsers[c.id] && typingUsers[c.id].length > 0 ? (
                        <div className="flex items-center gap-1 animate-pulse min-w-0 w-full">
                          <div className="flex gap-0.5 shrink-0">
                            <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" />
                          </div>
                          <span className="text-[9px] font-bold text-indigo-600 truncate uppercase tracking-widest">Typing...</span>
                        </div>
                      ) : (
                        <p className="text-[9px] font-bold text-slate-400 truncate uppercase tracking-tight w-full opacity-60">
                          {c.subtitle || 'NO UPDATES'}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
};
