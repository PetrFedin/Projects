'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Types & Constants
import { chatGroupConfig, ROLE_PERMISSIONS } from './constants';

// Hooks
import { useChatState } from './hooks/useChatState';
import { useMessageActions } from './hooks/useMessageActions';
import { useTaskActions } from './hooks/useTaskActions';
import { useAIActions } from './hooks/useAIActions';
import { useRecording } from './hooks/useRecording';

// Components
import { AlertsFabric } from './AlertsFabric';
import { MessagesHeader } from './MessagesHeader';
import { GroupRail } from './GroupRail';
import { ChatList } from './ChatList';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { Composer } from './Composer';
import { WidgetsPanel } from './WidgetsPanel';
import { TaskHub } from './TaskHub';

// Dialogs
import { ConfirmDialog } from './Dialogs/ConfirmDialog';
import { CreateChatDialog } from './Dialogs/CreateChatDialog';
import { TaskEditDialog } from './Dialogs/TaskEditDialog';
import { SUPPLY_AND_STUDIO_STEP_IDS } from '@/lib/production/stages-comm-demo';
import { useBrandCommunicationsUnread } from '@/lib/communications/use-communications-unread';
import type { ChatMessage } from '@/lib/types';

export default function MessagesPage({ initialRole }: { initialRole?: string }) {
  const { unreadByChat } = useBrandCommunicationsUnread();
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const urlCommContextApplied = React.useRef(false);
  const chatState = useChatState(initialRole);
  const { 
    currentRole, setCurrentRole, chats, setChats, activeChatId, messages, setMessages,
    chatQuery, setChatQuery, msgSearch, setMsgSearch, tab, setTab, activeGroup, setActiveGroup,
    activeChat, switchChat
  } = chatState;

  React.useEffect(() => {
    if (urlCommContextApplied.current) return;
    const q = searchParams.get('q')?.trim() || '';
    const sku = searchParams.get('sku')?.trim() || '';
    const season = searchParams.get('season')?.trim() || '';
    const order = searchParams.get('order')?.trim() || '';
    const step = searchParams.get('stagesStep')?.trim() || '';
    const line = [q, sku, season, order, step].filter(Boolean).join(' ').trim();
    if (!line) return;
    setChatQuery((prev) => (prev.trim() ? prev : line));
    setMsgSearch((prev) => (prev.trim() ? prev : line));
    urlCommContextApplied.current = true;
  }, [searchParams, setChatQuery, setMsgSearch]);

  const { toggleStar, togglePin, deleteMessage, addReaction } = useMessageActions(activeChatId, setMessages, 'Petr');
  const { taskThreads, taskStages, saveTask, updateTask, setTaskStatus } = useTaskActions('user_petr', setMessages, {
    activeChatId,
    calendarOwnerRole: currentRole,
  });
  const { isAiProcessing, processAiCorrection } = useAIActions(chatState.composerText, chatState.setComposerText);
  const { recording, startRecording, stopRecording } = useRecording();

  const feedRootRef = React.useRef<HTMLDivElement>(null);
  const [isAlertVisible, setIsAlertVisible] = React.useState(true);
  const [createChatOpen, setCreateChatOpen] = React.useState(false);
  const [tasksHubOpen, setTasksHubOpen] = React.useState(false);
  const [taskEditOpen, setTaskEditOpen] = React.useState(false);
  const [taskEditing, setTaskEditing] = React.useState<any>(null);

  const [productionPhase] = React.useState(65);
  const [riskLevel] = React.useState(15);

  const stagesStepParam = searchParams.get('stagesStep') || '';

  const visibleChats = React.useMemo(() => {
    const raw = chatQuery.trim().toLowerCase();
    const tokens = raw ? raw.split(/\s+/).filter(Boolean) : [];
    let list = chats.filter((c) => {
      const blob = `${c.title} ${c.subtitle ?? ''}`.toLowerCase();
      const fromMatrix = Boolean(stagesStepParam && searchParams.get('sku')?.trim());
      const matchesSearch =
        tokens.length === 0 ||
        (fromMatrix ? tokens.some((t) => t.length > 1 && blob.includes(t)) : tokens.every((t) => blob.includes(t)));
      const matchesGroup = activeGroup === 'all' || c.type === activeGroup;
      return matchesSearch && matchesGroup;
    });
    if (SUPPLY_AND_STUDIO_STEP_IDS.has(stagesStepParam)) {
      const isRetailish = (c: (typeof chats)[number]) =>
        c.type === 'client' ||
        (c.type === 'b2b_orders' &&
          (c.partnerProfile === 'shop' || /podium|цум|ритейл|магазин/i.test(`${c.title} ${c.subtitle ?? ''}`)));
      list = [...list.filter((c) => !isRetailish(c)), ...list.filter((c) => isRetailish(c))];
    }
    return list;
  }, [chats, chatQuery, activeGroup, stagesStepParam, searchParams]);

  const groupedMessages = React.useMemo(() => {
    // Basic grouping logic for now
    return [{ day: 'Сегодня', items: messages }];
  }, [messages]);

  const availableGroups = React.useMemo(() => {
    const permissions = ROLE_PERMISSIONS[currentRole] || [];
    return Object.entries(chatGroupConfig).filter(([key]) => 
      permissions.includes(key) || ['all', 'starred', 'archived', 'team'].includes(key)
    );
  }, [currentRole]);

  return (
    <div className={cn(
      "flex flex-col gap-3 p-4 bg-white border border-slate-200 shadow-sm overflow-hidden",
      "rounded-xl h-[calc(100vh-2rem)] min-h-[700px] text-slate-900 font-sans animate-in fade-in duration-700"
    )}>
      <TooltipProvider>
        <AlertsFabric isVisible={isAlertVisible} onClose={() => setIsAlertVisible(false)} />
        
        <MessagesHeader 
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          userStatus="online"
          setUserStatus={() => {}}
          riskLevel={riskLevel}
          onOpenTeam={() => {}}
          onOpenRiskDetails={() => {}}
          onOpenTasksHub={() => setTab('tasks')}
          onOpenSettings={() => {}}
          onOpenCreateChat={() => setCreateChatOpen(true)}
        />

        <div className="flex-1 flex gap-3 min-h-0">
          <GroupRail 
            availableGroups={availableGroups}
            activeGroup={activeGroup as any}
            setActiveGroup={setActiveGroup as any}
          />

          <ChatList 
            visibleChats={visibleChats}
            activeChatId={activeChatId}
            onSwitchChat={switchChat}
            onOpenCreateChat={() => setCreateChatOpen(true)}
            chatQuery={chatQuery}
            setChatQuery={setChatQuery}
            unreadCountByChat={unreadByChat}
            typingUsers={{}}
            currentUser="user_petr"
          />

          <main className="flex-1 bg-slate-50/30 rounded-2xl overflow-hidden border border-slate-100 shadow-inner flex flex-col relative min-w-0 transition-all">
            {activeChat && (
              <ChatHeader 
                activeChat={activeChat}
                isSummarizing={false}
                onGenerateSummary={() => {}}
                onOpenCallSetup={() => {}}
                onOpenParticipants={() => {}}
                onOpenArchive={() => {}}
                onOpenSettings={() => {}}
              />
            )}

            <div className="flex-1 bg-white relative flex flex-col min-h-0">
              {tab === 'tasks' ? (
                <TaskHub 
                  chatTasks={messages.filter(m => m.type === 'task')}
                  currentUser="user_petr"
                  onOpenEditTask={(m) => { setTaskEditing(m); setTaskEditOpen(true); }}
                />
              ) : (
                <>
                  <MessageList 
                    grouped={groupedMessages}
                    currentUser="user_petr"
                    currentUserName="Petr"
                    activeChat={activeChat}
                    msgSearch={msgSearch}
                    unreadDividerMsgId={null}
                    unreadCountActiveChat={0}
                    feedRootRef={feedRootRef}
                    onOpenEditTask={(m) => { setTaskEditing(m); setTaskEditOpen(true); }}
                    onOpenTaskProcess={() => {}}
                    onTogglePin={togglePin}
                    onToggleStar={toggleStar}
                    onAddReaction={addReaction}
                    onDeleteMessage={deleteMessage}
                    onForwardMessage={() => {}}
                    onReplyToMessage={() => {}}
                    onScrollToMessage={() => {}}
                    onOpenCreateTask={(initial) => {
                      const draft: ChatMessage = {
                        id: initial?.id ?? Date.now(),
                        user: 'user_petr',
                        chatId: activeChatId,
                        text: initial?.text ?? '',
                        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                        type: 'task',
                        status: 'pending',
                        priority: 'medium',
                        ...initial,
                      } as ChatMessage;
                      setTaskEditing(draft);
                      setTaskEditOpen(true);
                    }}
                    setReminderEditing={() => {}}
                    setReminderOpen={() => {}}
                  />
                  <Composer 
                    activeChat={activeChat}
                    composerText={chatState.composerText}
                    setComposerText={chatState.setComposerText}
                    isPrivate={chatState.isPrivate}
                    setIsPrivate={chatState.setIsPrivate}
                    onSendMessage={chatState.onSendMessage}
                    onSmartReply={() => {}}
                    onOpenNegotiation={() => {}}
                    onStartRecording={startRecording}
                    onStopRecording={stopRecording}
                    recording={recording}
                    isAiProcessing={isAiProcessing}
                    onProcessAiCorrection={processAiCorrection}
                    onFileClick={() => {}}
                    onUnarchiveChat={() => {}}
                    onAttachProduct={() => chatState.setComposerText(prev => prev ? `${prev}\n[Обсуждаю товар — прикрепите из каталога]` : '[Обсуждаю товар — прикрепите из каталога]')}
                  />
                </>
              )}
            </div>
          </main>
        </div>

        <CreateChatDialog 
          open={createChatOpen}
          onOpenChange={setCreateChatOpen}
          currentRole={currentRole}
          onCreate={(name, group, opts) => {
            const newChat: any = {
              id: `chat_${Date.now()}`,
              title: name,
              type: group,
              participantsCount: 1,
              ...(opts?.linkOrderId && { linkOrderId: opts.linkOrderId }),
              ...(opts?.linkCollectionId && { linkCollectionId: opts.linkCollectionId }),
            };
            setChats(prev => [...prev, newChat]);
          }}
        />

        <TaskEditDialog 
          open={taskEditOpen}
          onOpenChange={(o) => {
            setTaskEditOpen(o);
            if (!o) setTaskEditing(null);
          }}
          task={taskEditing}
          currentUser="user_petr"
          participants={(activeChat?.participants ?? []).map((p) => ({ id: p.id, name: p.name, role: p.role }))}
          onSave={(t) => {
            const exists = messages.some(m => m.id === t.id);
            if (exists) updateTask(t); else saveTask(t);
          }}
        />
      </TooltipProvider>
    </div>
  );
}
