import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { EyeOff } from 'lucide-react';
import { ChatMessage, Chat as ChatConversation } from '@/lib/types';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  grouped: Array<{ day: string; items: ChatMessage[] }>;
  currentUser: string;
  currentUserName: string;
  activeChat: ChatConversation | undefined;
  msgSearch: string;
  unreadDividerMsgId: number | null;
  unreadCountActiveChat: number;
  feedRootRef: React.RefObject<HTMLDivElement>;
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

export const MessageList: React.FC<MessageListProps> = ({
  grouped,
  currentUser,
  currentUserName,
  activeChat,
  msgSearch,
  unreadDividerMsgId,
  unreadCountActiveChat,
  feedRootRef,
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
  return (
    <ScrollArea className="flex-1 px-4 sm:px-6" ref={feedRootRef}>
      <div className="py-6 space-y-6">
        {grouped.map((g) => (
          <div key={g.day} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300 italic">{g.day}</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="space-y-2">
              {g.items.map((m) => {
                const mine = m.user === currentUser || m.user === currentUserName;
                
                // Privacy & Ethics Filter
                // If message is private and not mine, it's hidden or obfuscated
                if (m.isPrivate && !mine) {
                  return (
                    <div key={m.id} className="flex justify-center py-1 opacity-40 select-none">
                      <div className="bg-slate-50 px-3 py-1 rounded-full flex items-center gap-2 border border-slate-100 shadow-sm">
                        <EyeOff className="h-2.5 w-2.5 text-slate-400" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 italic">Content hidden by privacy policy</span>
                      </div>
                    </div>
                  );
                }

                const showUnreadDivider = unreadDividerMsgId === m.id && unreadCountActiveChat > 0;

                return (
                  <React.Fragment key={m.id}>
                    {showUnreadDivider && (
                      <div className="flex items-center gap-3 my-6">
                        <div className="h-px flex-1 bg-indigo-100" />
                        <Badge variant="outline" className="bg-indigo-600 text-white text-[8px] font-bold px-3 h-4 rounded-md border-none shadow-md tracking-widest uppercase">
                          NEW MESSAGES ({unreadCountActiveChat})
                        </Badge>
                        <div className="h-px flex-1 bg-indigo-100" />
                      </div>
                    )}
                    <MessageItem
                      message={m}
                      mine={mine}
                      activeChat={activeChat}
                      currentUser={currentUser}
                      currentUserName={currentUserName}
                      msgSearch={msgSearch}
                      onOpenEditTask={onOpenEditTask}
                      onOpenTaskProcess={onOpenTaskProcess}
                      onTogglePin={onTogglePin}
                      onToggleStar={onToggleStar}
                      onAddReaction={onAddReaction}
                      onDeleteMessage={onDeleteMessage}
                      onForwardMessage={onForwardMessage}
                      onReplyToMessage={onReplyToMessage}
                      onScrollToMessage={onScrollToMessage}
                      onOpenCreateTask={onOpenCreateTask}
                      setReminderEditing={setReminderEditing}
                      setReminderOpen={setReminderOpen}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
