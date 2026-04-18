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
  setReminderOpen,
}) => {
  return (
    <ScrollArea className="flex-1 px-4 sm:px-6" ref={feedRootRef}>
      <div className="space-y-6 py-6">
        {grouped.map((g) => (
          <div key={g.day} className="space-y-4">
            <div className="flex items-center gap-3">
<<<<<<< HEAD
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[9px] font-bold uppercase italic tracking-[0.2em] text-slate-300">
                {g.day}
              </span>
              <div className="h-px flex-1 bg-slate-100" />
=======
              <div className="bg-bg-surface2 h-px flex-1" />
              <span className="text-text-muted text-[9px] font-bold uppercase italic tracking-[0.2em]">
                {g.day}
              </span>
              <div className="bg-bg-surface2 h-px flex-1" />
>>>>>>> recover/cabinet-wip-from-stash
            </div>

            <div className="space-y-2">
              {g.items.map((m) => {
                const mine = m.user === currentUser || m.user === currentUserName;

                // Privacy & Ethics Filter
                // If message is private and not mine, it's hidden or obfuscated
                if (m.isPrivate && !mine) {
                  return (
                    <div key={m.id} className="flex select-none justify-center py-1 opacity-40">
<<<<<<< HEAD
                      <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1 shadow-sm">
                        <EyeOff className="h-2.5 w-2.5 text-slate-400" />
                        <span className="text-[8px] font-bold uppercase italic tracking-widest text-slate-500">
=======
                      <div className="bg-bg-surface2 border-border-subtle flex items-center gap-2 rounded-full border px-3 py-1 shadow-sm">
                        <EyeOff className="text-text-muted h-2.5 w-2.5" />
                        <span className="text-text-secondary text-[8px] font-bold uppercase italic tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          Content hidden by privacy policy
                        </span>
                      </div>
                    </div>
                  );
                }

                const showUnreadDivider = unreadDividerMsgId === m.id && unreadCountActiveChat > 0;

                return (
                  <React.Fragment key={m.id}>
                    {showUnreadDivider && (
                      <div className="my-6 flex items-center gap-3">
<<<<<<< HEAD
                        <div className="h-px flex-1 bg-indigo-100" />
                        <Badge
                          variant="outline"
                          className="h-4 rounded-md border-none bg-indigo-600 px-3 text-[8px] font-bold uppercase tracking-widest text-white shadow-md"
=======
                        <div className="bg-accent-primary/15 h-px flex-1" />
                        <Badge
                          variant="outline"
                          className="bg-accent-primary h-4 rounded-md border-none px-3 text-[8px] font-bold uppercase tracking-widest text-white shadow-md"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          NEW MESSAGES ({unreadCountActiveChat})
                        </Badge>
                        <div className="bg-accent-primary/15 h-px flex-1" />
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
